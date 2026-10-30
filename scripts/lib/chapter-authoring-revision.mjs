// Explicit, locally authorized re-authoring keeps the original frozen selection
// and VIX receipt. It never turns a new policy into permission to revise history.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {canonicalSourcePackage as canonical} from '../../protocol/current-affairs.mjs';
import {familyRecords} from './vix-index.mjs';
export const AUTHORING_REVISION_KIND='chapter-authoring-revision-v1';
const hash=value=>createHash('sha256').update(value).digest('hex');
const sha=value=>/^[a-f0-9]{64}$/.test(value||'');
const commit=value=>/^[a-f0-9]{40}$/.test(value||'');
const validDate=value=>/^20\d{2}-\d{2}-\d{2}$/.test(value||'')&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
const oldPolicy=value=>value==null||value==='sourced-collection-v1';
export function validateAuthoringRevision(revision,{selection,baselineText,meta,date,runId}={}){
  if(!revision||revision.schemaVersion!==1||revision.kind!==AUTHORING_REVISION_KIND||!validDate(revision.studyDate)||
    typeof revision.runId!=='string'||!/^[A-Za-z0-9._:-]{1,100}$/.test(revision.runId)||
    !sha(revision.fromChapterDigest)||!sha(revision.fromSourceDigest)||!sha(revision.selectionDigest)||!sha(revision.baselineDigest)||
    !commit(revision.vixInputCommit)||!commit(revision.vixCommit)||revision.fromAuthoringPolicy!=='sourced-collection-v1'||revision.toAuthoringPolicy!=='authentic-context-v1'||
    typeof revision.authorizedAt!=='string'||!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(revision.authorizedAt)||!Number.isFinite(Date.parse(revision.authorizedAt))||
    typeof revision.authorization!=='string'||!revision.authorization.trim()||revision.authorization.length>2000||
    typeof revision.baselineFile!=='string'||!new RegExp('^work/runs/'+revision.studyDate+'/revisions/[A-Za-z0-9_-]+/baseline\\.json$').test(revision.baselineFile))throw Error('章节重编授权或原件绑定无效');
  if(date!=null&&revision.studyDate!==date||runId!=null&&revision.runId!==runId)throw Error('章节重编不能跨日期或运行');
  if(typeof baselineText!=='string'||hash(baselineText)!==revision.baselineDigest)throw Error('章节重编基线原件摘要不符');
  const baseline=JSON.parse(baselineText),old=baseline.meta;
  if(baseline.schemaVersion!==1||baseline.kind!=='chapter-revision-baseline-v1'||!old||typeof baseline.markdown!=='string'||!baseline.selection||!baseline.sourcePackage||
    old.date!==revision.studyDate||(old.runId||old.date)!==revision.runId||!oldPolicy(old.authoringPolicy)||!oldPolicy(baseline.selection.authoringPolicy)||
    baseline.selection.studyDate!==revision.studyDate||hash(canonical(baseline.selection))!==revision.selectionDigest||
    hash(baseline.markdown)!==revision.fromChapterDigest||hash(canonical(baseline.sourcePackage))!==revision.fromSourceDigest||
    baseline.sourcePackage.chapterDigest!==revision.fromChapterDigest||baseline.sourcePackage.selectionDigest!==revision.selectionDigest||
    old.sourceDigest!==revision.fromSourceDigest||old.vixCommit!==revision.vixCommit||old.vixInputCommit!==revision.vixInputCommit||
    baseline.selection.vixInputCommit!==revision.vixInputCommit||baseline.sourcePackage.vixInputCommit!==revision.vixInputCommit||
    old.contentPolicy!=='etymology-fused-v1'||old.sourcePolicy!=='current-affairs-v1'||!baseline.markdown.startsWith('<!-- PART:one -->')||baseline.markdown.includes('<!-- FORMAT:usage-context-v1 -->'))throw Error('章节重编基线与原章节、冻结选词或VIX不一致');
  familyRecords(baseline.selection);
  if(selection&&(canonical(selection)!==canonical(baseline.selection)||!oldPolicy(selection.authoringPolicy)))throw Error('重编必须原样复用完整冻结selection，不得重选、改族或补策略字段');
  if(meta&&(meta.date!==revision.studyDate||(meta.runId||meta.date)!==revision.runId||meta.vixCommit!==revision.vixCommit||meta.vixInputCommit!==revision.vixInputCommit||meta.authoringPolicy!==revision.toAuthoringPolicy||meta.contentPolicy!==old.contentPolicy||meta.sourcePolicy!==old.sourcePolicy||canonical(meta.authoringRevision)!==canonical(revision)))throw Error('重编元数据与授权、原运行或课程政策不一致');
  return {policy:revision.toAuthoringPolicy,revision,baselineText,baseline};
}
export async function loadAuthoringContract(root,date,selection,{meta}={}){
  if(!meta){try{meta=JSON.parse(await fs.readFile(path.join(root,'chapters',date,'meta.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}}
  if(!meta?.authoringRevision)return {policy:selection.authoringPolicy||'sourced-collection-v1'};
  const revision=meta.authoringRevision;
  // Validate the path shape before resolving it; never follow an arbitrary file.
  if(typeof revision.baselineFile!=='string'||!new RegExp('^work/runs/'+date+'/revisions/[A-Za-z0-9_-]+/baseline\\.json$').test(revision.baselineFile))throw Error('章节重编基线路径无效');
  const realRoot=await fs.realpath(root),file=await fs.realpath(path.join(realRoot,revision.baselineFile)),relative=path.relative(realRoot,file);
  if(relative.startsWith('..')||path.isAbsolute(relative)||process.platform==='win32'&&!/^D:[\\/]/i.test(file))throw Error('章节重编基线须实存本项目D盘');
  return validateAuthoringRevision(revision,{selection,baselineText:await fs.readFile(file,'utf8'),meta,date});
}
