// Explicit invocation only. No selection/VIX writes, task claim or publication.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {validateTeachingLayout} from '../web/annotations.js';
import {canonicalSourcePackage as canonical,validateSourcePackage} from '../protocol/current-affairs.mjs';
import {validatePublishedVixReceipt} from './lib/vix-publication.mjs';
import {AUTHORING_REVISION_KIND,validateAuthoringRevision} from './lib/chapter-authoring-revision.mjs';
const [date,id,...reason]=process.argv.slice(2),authorization=reason.join(' ').trim();
if(!/^20\d{2}-\d{2}-\d{2}$/.test(date||'')||!/^[A-Za-z0-9_-]{1,100}$/.test(id||'')||!authorization)throw Error('用法: node scripts/prepare-authoring-revision.mjs DATE REVISION_ID 用户明确授权说明');
const root=await fs.realpath(process.cwd());if(process.platform==='win32'&&!/^D:[\\/]/i.test(root))throw Error('重编资料须实际存D盘');
const hash=value=>createHash('sha256').update(value).digest('hex'),json=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const run=path.join(root,'work/runs',date),folder=path.join(root,'chapters',date),revisionFolder=path.join(run,'revisions',id),original=path.join(revisionFolder,'original');
const [selection,oldMeta,markdown,sourcePackage,receipt,currentSelection,meta]=await Promise.all([
  json(path.join(original,'run/selection.json')),json(path.join(original,'chapter/meta.json')),fs.readFile(path.join(original,'chapter/chapter.md'),'utf8'),json(path.join(original,'chapter/sources.json')),
  json(path.join(original,'run/vix-publication.json')),json(path.join(run,'selection.json')),json(path.join(folder,'meta.json'))]);
if(canonical(selection)!==canonical(currentSelection))throw Error('原冻结selection与当前不同；不得重编或重标');
const parsed=validateTeachingLayout(markdown,oldMeta.contentPolicy);if(parsed.format==='usage-context-v1')throw Error('原件已是单正文，不能创建旧格式转换授权');
validateSourcePackage(sourcePackage,{chapterDigest:hash(markdown),studyDate:date,vixInputCommit:selection.vixInputCommit,markdown});
validatePublishedVixReceipt(receipt,{studyDate:date,inputCommit:selection.vixInputCommit,selectionDigest:hash(canonical(selection)),vixCommit:oldMeta.vixCommit});
const baseline={schemaVersion:1,kind:'chapter-revision-baseline-v1',selection,meta:oldMeta,markdown,sourcePackage},baselineText=JSON.stringify(baseline);
const file=path.join(revisionFolder,'baseline.json');
const temporary=file+'.'+randomUUID()+'.tmp';let handle;
try{
  handle=await fs.open(temporary,'wx');await handle.writeFile(baselineText);await handle.sync();await handle.close();handle=null;
  try{await fs.link(temporary,file);}catch(error){if(error.code!=='EEXIST')throw error;if(await fs.readFile(file,'utf8')!==baselineText)throw Error('既有重编基线冲突，保留原件');}
}finally{if(handle)await handle.close();await fs.unlink(temporary).catch(error=>{if(error.code!=='ENOENT')throw error;});}
const prior=meta.authoringRevision;
const revision={schemaVersion:1,kind:AUTHORING_REVISION_KIND,studyDate:date,runId:oldMeta.runId||date,fromChapterDigest:hash(markdown),fromSourceDigest:hash(canonical(sourcePackage)),selectionDigest:hash(canonical(selection)),vixInputCommit:selection.vixInputCommit,vixCommit:oldMeta.vixCommit,fromAuthoringPolicy:'sourced-collection-v1',toAuthoringPolicy:'authentic-context-v1',authorizedAt:prior?.authorizedAt||new Date().toISOString(),authorization,baselineFile:path.relative(root,file).replaceAll('\\','/'),baselineDigest:hash(baselineText)};
const next={...meta,authoringPolicy:'authentic-context-v1',authoringRevision:revision};
validateAuthoringRevision(revision,{selection,baselineText,meta:next,date});
if(prior&&canonical(prior)!==canonical(revision))throw Error('已有明确重编身份不同，不能替换');
if(!prior)await fs.writeFile(path.join(folder,'meta.json'),JSON.stringify(next,null,2)+'\n');
console.log(JSON.stringify({revision:revision.baselineFile,originalChapterDigest:revision.fromChapterDigest,selectionDigest:revision.selectionDigest,vixCommit:revision.vixCommit,notice:'仅建立已授权重编合同；原selection及VIX回执未改，未领取或发布，默认休息与音频未改。'},null,2));
