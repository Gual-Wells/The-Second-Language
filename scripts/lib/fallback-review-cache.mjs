// Reuse a genuine unchanged case verdict, including a subset of an old batch.
// The cached index never grants approval: raw input, output and all cited current
// evidence are revalidated before the case is admitted to a new chapter report.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {canonicalSourcePackage as canonical} from '../../protocol/current-affairs.mjs';
import {FALLBACK_APPEALS_POLICY,appealBindings,validateFallbackAppeals} from '../../protocol/fallback-appeals.mjs';
import {scopeAppealPacket,appealFolder,verifyAppealExecution} from './fallback-appeals.mjs';
import {optionalJson,immutableJson,atomicJson} from './daily-pipeline.mjs';
const hash=s=>createHash('sha256').update(s).digest('hex');
const names=['review-execution.json','review-prompt.txt','review-response.json','review-events.jsonl'];
const identity=executions=>({kind:'codex',model:'gpt-6.1-sol',effort:'high',runReference:'independent-set:'+hash(canonical(executions))});
const caseKey=(packet,request,records)=>hash(canonical(scopeAppealPacket(packet,[request],records)));
export async function mergeAppealReport({directory,chapter,packet,request,decisions,executions,reviewedAt}){
 const prior=await optionalJson(path.join(directory,'review.json')),keep=new Set();
 for(const d of prior?.decisions||[]){const now=request.requests.find(r=>r.contextId===d.contextId),old=prior.requests.find(r=>r.contextId===d.contextId);if(now&&old&&caseKey(packet,now,request.records)===caseKey(packet,old,prior.records))keep.add(d.contextId);}
 const replacing=new Set(decisions.map(d=>d.contextId)),allDecisions=[...(prior?.decisions||[]).filter(d=>keep.has(d.contextId)&&!replacing.has(d.contextId)),...decisions];
 const mergedExecutions=[...(prior?.executions||[]).map(e=>({...e,contextIds:e.contextIds.filter(id=>keep.has(id)&&!replacing.has(id))})).filter(e=>e.contextIds.length),...executions];
 const byId=new Map();for(const e of mergedExecutions){const ids=byId.get(e.id)||[];if(e.contextIds.some(id=>ids.includes(id)))throw Error('独立审核回执覆盖重复');byId.set(e.id,[...ids,...e.contextIds]);}
 const rows=[...byId].map(([id,contextIds])=>({id,contextIds})),ordered=request.requests.map(r=>allDecisions.find(d=>d.contextId===r.contextId)).filter(Boolean);
 const report={schemaVersion:1,policy:FALLBACK_APPEALS_POLICY,...appealBindings(chapter),requests:request.requests,records:request.records,decisions:ordered,executions:rows,reviewedAt,reviewer:identity(rows)};
 const reviewedIds=new Set(ordered.map(d=>d.contextId));
 if(ordered.length)await verifyAppealExecution(directory,{...report,requests:report.requests.filter(r=>reviewedIds.has(r.contextId))},packet);
 await fs.mkdir(path.join(directory,'review-history'),{recursive:true});if(prior)await immutableJson(path.join(directory,'review-history',hash(JSON.stringify(prior))+'.json'),prior);
 await atomicJson(path.join(directory,'review.json'),report);return report;
}
export async function cacheApprovedCases({root,date,chapter,directory,packet,report}){
 for(const decision of report.decisions.filter(d=>d.decision==='approved')){
  const request=report.requests.find(r=>r.contextId===decision.contextId),execution=report.executions.find(e=>e.contextIds.includes(decision.contextId));if(!execution)throw Error('批准缺少独立执行原件');
  const key=caseKey(packet,request,report.records),file=path.join(root,'work/runs',date,'teaching/fallback-review-cache',key+'.json');
  if(await optionalJson(file))continue;
  const receipt=await optionalJson(path.join(directory,'reviews',execution.id,'review-execution.json'));
  await immutableJson(file,{schemaVersion:1,policy:'fallback-case-cache-v1',key,contextId:request.contextId,basisDigest:request.basisDigest,chapterDigest:chapter.digest,batchId:execution.id,decision,reviewedAt:receipt?.finishedAt||report.reviewedAt});
 }
}
export async function reuseAppealCases({root,date,chapter,directory,packet,request,parsed,evidence,ids}){
 const decisions=[],byBatch=new Map(),reused=[],prior=await optionalJson(path.join(directory,'review.json'));let reviewedAt=prior?.reviewedAt;
 for(const id of ids){
  const r=request.requests.find(r=>r.contextId===id);if(!r)throw Error('复用范围越界');
  const negative=prior?.decisions?.find(d=>d.contextId===id&&d.decision!=='approved'),oldRequest=prior?.requests.find(r=>r.contextId===id);
  if(negative&&oldRequest&&caseKey(packet,r,request.records)===caseKey(packet,oldRequest,prior.records))continue;
  const key=caseKey(packet,r,request.records),cached=await optionalJson(path.join(root,'work/runs',date,'teaching/fallback-review-cache',key+'.json'));if(!cached)continue;
  if(cached.policy!=='fallback-case-cache-v1'||cached.key!==key||cached.contextId!==id||cached.basisDigest!==r.basisDigest||!/^[a-f0-9]{64}$/.test(cached.chapterDigest||'')||!/^[a-f0-9]{64}$/.test(cached.batchId||'')||cached.decision?.decision!=='approved')throw Error('原逐例审核索引无效，保留原件核查');
  const source=await fs.realpath(path.join(appealFolder(root,date,cached.chapterDigest),'reviews',cached.batchId)),target=path.join(directory,'reviews',cached.batchId);await fs.mkdir(target,{recursive:true});
  for(const name of names){const physical=await fs.realpath(path.join(source,name));if(path.dirname(physical)!==source)throw Error('独立审核原件越界');const bytes=await fs.readFile(physical),file=path.join(target,name);try{await fs.writeFile(file,bytes,{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;if(!bytes.equals(await fs.readFile(file)))throw Error('同一独立审核批次原件冲突');}}
  const executions=[{id:cached.batchId,contextIds:[id]}],partial={schemaVersion:1,policy:FALLBACK_APPEALS_POLICY,...appealBindings(chapter),requests:[r],records:request.records,decisions:[cached.decision],executions,reviewedAt:cached.reviewedAt,reviewer:identity(executions)};
  await validateFallbackAppeals(partial,{chapter,parsed:{...parsed,contexts:parsed.contexts.filter(c=>c.id===id)},evidence});
  await verifyAppealExecution(directory,partial,packet);
  decisions.push(cached.decision);byBatch.set(cached.batchId,[...(byBatch.get(cached.batchId)||[]),id]);reused.push(id);
  if(!reviewedAt||Date.parse(cached.reviewedAt)>Date.parse(reviewedAt))reviewedAt=cached.reviewedAt;
 }
 if(decisions.length)await mergeAppealReport({directory,chapter,packet,request,decisions,executions:[...byBatch].map(([id,contextIds])=>({id,contextIds})),reviewedAt});
 return {reused,remaining:ids.filter(id=>!reused.includes(id))};
}
