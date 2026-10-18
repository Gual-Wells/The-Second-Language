import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {publisherConfig} from './lib/publisher-config.mjs';
import {validateFirstPartUpgrade} from '../protocol/first-part-upgrade.mjs';
import {validateChapterCorrection} from '../protocol/chapter-correction.mjs';
import {hash} from './lib/textbook-sources.mjs';
import {reuseFirstPartAudioPack} from './lib/first-part-audio-reuse.mjs';

const chapterId=process.argv.find(a=>a.startsWith('--chapter='))?.slice(10);
if(!/^2026-10-\d{2}$/.test(chapterId||''))throw Error('指定已批准的章节日期');
const batchId=process.argv.find(a=>a.startsWith('--batch='))?.slice(8)||'upgrade-20261018';
if(!/^(upgrade|correction)-20261018$/.test(batchId))throw Error('未知第一部分修订批次');
const runId=batchId+'-'+chapterId;
const rootDirectory=path.resolve('work/runs',runId),full=process.argv.includes('--full'),directory=full?path.join(rootDirectory,'full'):rootDirectory,original=JSON.parse(await readFile(path.join(rootDirectory,'original.json'),'utf8')),result=JSON.parse(await readFile(path.join(directory,'content-result.json'),'utf8')),markdown=await readFile(path.join(directory,'chapter.md'),'utf8'),reviewed=JSON.parse(await readFile(path.join(directory,full?'word-result.json':'reviewed-words.json'),'utf8'));
(full?validateChapterCorrection:validateFirstPartUpgrade)(original.markdown,markdown);
if(hash(Buffer.from(markdown))!==result.targetDigest||result.baseDigest!==original.digest||reviewed.length!==40)throw Error('产物或审阅身份不一致');
const protocolCommit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8',windowsHide:true}).trim();
const manifest={scope:full?'chapter-correction':'first-part',baseDigest:result.baseDigest,targetDigest:result.targetDigest,sourcePin:result.sourcePin,approvedAt:'2026-10-18',approval:full?'用户明确要求按主协议补齐必要的对应内容':batchId.startsWith('correction')?'用户要求纠正重做第一部分，明确遵循主协议而非临时协议':'用户明确批准 v1.1：批准协议，现在动工',authority:'formal-main',formalProtocols:['CONTENT.md','QUALITY_WORKFLOW.md','ETYMOLOGY.md','USAGE_LABELS.md','ANNOTATIONS.md'],reviewScope:full?'双教材内容、全部原例句去向与完整范文语义闭环':'仅第一部分，未宣称全章重新质检',words:reviewed.map(({wordId,sourceIds,notes,exceptions,coverage})=>({wordId,sourceIds,notes,exceptions,coverage})),secondThirdByteIdentical:original.markdown.slice(original.markdown.indexOf('<!-- PART:two -->'))===markdown.slice(markdown.indexOf('<!-- PART:two -->')),ttsCalls:0};
try{manifest.supplementarySourceChecks=JSON.parse(await readFile(path.join(rootDirectory,'supplementary-source-checks.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
const {base,token}=await publisherConfig(),headers={authorization:`Bearer ${token}`,'content-type':'application/json'};
const r=await fetch(new URL(full?'/api/publish/correct-chapter':'/api/publish/upgrade-first-part',base),{method:'POST',headers,body:JSON.stringify({chapterId,runId,baseDigest:result.baseDigest,targetDigest:result.targetDigest,markdown,vixCommit:result.sourcePin,protocolCommit,manifest}),signal:AbortSignal.timeout(240000)}),receipt=await r.json();if(!r.ok)throw Error(receipt.error||'发布未完成 '+r.status);
const audioPack=await reuseFirstPartAudioPack({chapterId,baseDigest:result.baseDigest,targetDigest:result.targetDigest,markdown,request:async(route,method='GET',body)=>{const r=await fetch(new URL(route,base),{method,headers,...(body?{body:typeof body==='string'?body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(120000)});const data=await r.json();if(!r.ok)throw Error(data.error||'音频清单复用失败');return data;}});
const read=await fetch(new URL('/api/chapters/'+chapterId,base),{headers,signal:AbortSignal.timeout(60000)});if(!read.ok)throw Error('当前版本回读失败');const live=await read.json();if(live.digest!==result.targetDigest||live.markdown!==markdown)throw Error('新版回读不一致');
const oldRead=await fetch(new URL('/api/chapters/'+chapterId+'?digest='+original.digest,base),{headers,signal:AbortSignal.timeout(60000)});if(!oldRead.ok||(await oldRead.json()).markdown!==original.markdown)throw Error('旧版回读失败');
const meta={date:original.date,title:original.title,number:live.number,subtitle:original.subtitle||'',wordCount:40,runId,vixCommit:result.sourcePin,protocolCommit,contentPolicy:'etymology-fused-v1'};
await writeFile(path.join(directory,'meta.json'),JSON.stringify(meta,null,2));await writeFile(path.join(directory,'chapter.json'),JSON.stringify({...live,contentPolicy:meta.contentPolicy}));await writeFile(path.join(directory,'published.json'),JSON.stringify({...receipt,audioPack,checkedAt:new Date().toISOString(),oldVersionReadable:true,newVersionReadbackIdentical:true},null,2));
console.log(JSON.stringify({chapterId,...receipt,audioPack,oldVersionReadable:true,newVersionReadbackIdentical:true}));
