// Explicit prepare/review/verify entry. No model call during prepare or verify.
// Independent Codex review is the maintenance default; unknown attempts persist.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {loadChapterEvidence} from './lib/chapter-evidence.mjs';
import {appealFolder,appealPrompt,scopeAppealPacket,fallbackReviewPacket,loadFallbackAppeals} from './lib/fallback-appeals.mjs';
import {executeAppealReview} from './lib/isolated-appeal-review.mjs';
import {FALLBACK_APPEALS_POLICY,appealBindings,validateFallbackAppeals,authenticityAlarm} from '../protocol/fallback-appeals.mjs';
import {mergeAppealReport,cacheApprovedCases,reuseAppealCases} from './lib/fallback-review-cache.mjs';
import {optionalJson,immutableJson} from './lib/daily-pipeline.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),[action,date,...argv]=process.argv.slice(2),options={};
if(!['prepare','verify','review','reuse'].includes(action)||!/^20\d{2}-\d{2}-\d{2}$/.test(date||''))throw Error('fallback-appeals.mjs prepare|verify DATE，或 review DATE --codex EXE [--contexts C1,C2]');
for(let i=0;i<argv.length;i+=2){if(!['--codex','--contexts'].includes(argv[i])||!argv[i+1]||options[argv[i]])throw Error('申诉参数无效');options[argv[i]]=argv[i+1];}
const hash=s=>createHash('sha256').update(s).digest('hex'),chapter=JSON.parse(await fs.readFile(path.join(root,'chapters',date,'chapter.json'),'utf8'));
const evidence=await loadChapterEvidence(root,date,chapter.sourcePackage,{markdown:chapter.markdown});
const {parsed,coverage,cases,packet}=await fallbackReviewPacket(chapter,evidence),directory=appealFolder(root,date,chapter.digest),requestFile=path.join(directory,'requests.json');
if(action==='prepare'){
 await fs.mkdir(directory,{recursive:true});
 const prior=await optionalJson(requestFile);
 if(!prior)await immutableJson(requestFile,{schemaVersion:1,policy:FALLBACK_APPEALS_POLICY,...appealBindings(chapter),requests:cases.map(c=>({...c,reason:'',searchConclusion:'',teachingBenefit:'',refs:[]})),records:[]});
 console.log(JSON.stringify({requestFile,caseCount:cases.length,alarm:authenticityAlarm(coverage),notice:'这是未获准的申请骨架。作者须逐例填写真实依据；prepare不产生批准或模型调用。'},null,2));
}else if(action==='verify'){
 const result=await loadFallbackAppeals(root,date,chapter,{evidence});console.log(JSON.stringify({passed:true,appealsDigest:result.digest,admission:result.admission},null,2));
}else{
 const setting=await optionalJson(path.join(root,'.cache/appeal-reviewer.json'));
 if(setting?.mode&&setting.mode!=='codex')throw Error('已明确选择其他审核方式，保留原选择，不自动启动Codex');
 if(action==='review'&&!options['--codex'])throw Error('缺少原Codex CLI路径');
 const request=JSON.parse(await fs.readFile(requestFile,'utf8'));
 const draft={...request,reviewedAt:new Date().toISOString(),reviewer:{kind:'codex',model:'gpt-6.1-sol',effort:'high',runReference:'preflight-not-a-real-review'},decisions:request.requests.map(r=>({contextId:r.contextId,basisDigest:r.basisDigest,decision:'needs-research',reason:'Preflight only; no reviewer verdict exists yet.',refs:r.refs}))};
 await validateFallbackAppeals(draft,{chapter,parsed,evidence:{...evidence,authenticity:coverage},requireApproved:false});
 const requestedIds=options['--contexts']?.split(',')||cases.map(c=>c.contextId);
 if(!requestedIds.length||new Set(requestedIds).size!==requestedIds.length||requestedIds.some(id=>!request.requests.some(r=>r.contextId===id)))throw Error('审核范围重复或越界');
 const reused=await reuseAppealCases({root,date,chapter,directory,packet,request,parsed,evidence:{...evidence,authenticity:coverage},ids:requestedIds});
 if(action==='reuse'||!reused.remaining.length){console.log(JSON.stringify({reused:reused.reused,remaining:reused.remaining,modelCalls:0},null,2));}
 else{
 const ids=reused.remaining,requests=request.requests.filter(r=>ids.includes(r.contextId));
 const prompt=appealPrompt(scopeAppealPacket(packet,requests,request.records));
 if(prompt.length>300000)throw Error('审核资料过大；用--contexts按实际词义/词组拆小，不截断原件或一次发送整章');
 const id=hash(prompt),batch=path.join(directory,'reviews',id);await fs.mkdir(batch,{recursive:true});
 const {receipt,response}=await executeAppealReview({directory:batch,prompt,date,executable:options['--codex']});
 if(!Array.isArray(response.decisions)||response.decisions.length!==ids.length||new Set(response.decisions.map(d=>d.contextId)).size!==ids.length||response.decisions.some(d=>!ids.includes(d.contextId)))throw Error('独立审核返回范围不完整；保存原结果，不自动重发');
 const partial={...request,requests,decisions:response.decisions,reviewedAt:receipt.finishedAt,reviewer:{kind:'codex',model:'gpt-6.1-sol',effort:'high',runReference:receipt.threadId}};
 await validateFallbackAppeals(partial,{chapter,parsed:{...parsed,contexts:parsed.contexts.filter(c=>ids.includes(c.id))},evidence:{...evidence,authenticity:coverage},requireApproved:false});
 const report=await mergeAppealReport({directory,chapter,packet,request,decisions:response.decisions,executions:[{id,contextIds:requests.map(r=>r.contextId)}],reviewedAt:receipt.finishedAt});
 await cacheApprovedCases({root,date,chapter,directory,packet,report});
 console.log(JSON.stringify({reviewed:ids.length,reused:reused.reused.length,recorded:report.decisions.length,total:cases.length,decisions:response.decisions.map(d=>({contextId:d.contextId,decision:d.decision})),notice:'审核结果已保留。只有逐例批准和完整出版验证都通过，才能发布。'},null,2));
 }
}
