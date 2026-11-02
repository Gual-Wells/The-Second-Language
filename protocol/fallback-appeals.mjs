// Real contexts are the default. Eighty percent is an alarm, never an allowance
// for unreviewed examples. Semantic sufficiency belongs to the actual reviewer;
// these checks bind every decision to its exact candidate and supplied evidence.
import {canonicalSourcePackage as canonical} from './current-affairs.mjs';
export const FALLBACK_APPEALS_POLICY='fallback-appeals-v1';
export const FALLBACK_VALIDATOR_POLICY='real-or-approved-validator-v1';
export const sha256=async text=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(v=>v.toString(16).padStart(2,'0')).join('');
const sha=s=>typeof s==='string'&&/^[a-f0-9]{64}$/.test(s);
const nonempty=(s,max=12000)=>typeof s==='string'&&!!s.trim()&&s.length<=max;
const same=(a,b)=>Array.isArray(a)&&a.length===b.length&&new Set(a).size===a.length&&a.every(x=>b.includes(x));
const fail=message=>{const e=Error('例句申诉：'+message);e.code='FALLBACK_APPEALS_PENDING';throw e;};
export function authenticityAlarm(coverage){
 if(!coverage)return {state:'unmeasured',warning:true,publicationGate:false};
 const {useCount,authenticUseCount,contextCount,authenticContextCount}=coverage;
 if([useCount,authenticUseCount,contextCount,authenticContextCount].some(n=>!Number.isSafeInteger(n)||n<0)||!useCount||!contextCount||authenticUseCount>useCount||authenticContextCount>contextCount)throw Error('真实语境计数无效');
 const warning=authenticUseCount*100<useCount*80||authenticContextCount*100<contextCount*80;
 return {state:warning?'below-80-alarm':'at-or-above-80',warning,publicationGate:false,useCount,authenticUseCount,contextCount,authenticContextCount,useCoveragePercent:100*authenticUseCount/useCount,contextSharePercent:100*authenticContextCount/contextCount};
}
export function fallbackContexts(parsed){return parsed.contexts.filter(c=>c.kind==='example');}
export function fallbackCaseSetText(cases){return canonical(cases.map(c=>({contextId:c.contextId,useIds:[...c.useIds].sort(),basisDigest:c.basisDigest})).sort((a,b)=>a.contextId.localeCompare(b.contextId)));}
export async function fallbackCases(parsed,words){
 const contexts=new Map(words.flatMap(w=>(w.contexts||[]).map(c=>[c.id,c])));
 const owners=new Map(words.flatMap(w=>[...w.partOne.matchAll(/^<!-- USE:([^ ]+) -->/gm)].map(m=>[m[1],w])));
 return Promise.all(fallbackContexts(parsed).map(async c=>{
  const useIds=[...(c.refs||c.uses)].sort(),authored=contexts.get(c.id);
  if(!authored||useIds.some(id=>!owners.has(id)))fail('缺少当前作者或完整用法 '+c.id);
  const scope=useIds.map(id=>{const w=owners.get(id);return {useId:id,wordId:w.wordId,materialDigest:w.materialDigest,partOne:w.partOne};});
  return {contextId:c.id,useIds,basisDigest:await sha256(canonical({context:authored,scope}))};
 }));
}
export function appealBindings(chapter){return {runId:chapter.runId||chapter.date,studyDate:chapter.date,chapterDigest:chapter.digest,sourceDigest:chapter.sourceDigest,evidenceDigest:chapter.sourcePackage.evidenceDigest,selectionDigest:chapter.sourcePackage.selectionDigest};}
export async function validateFallbackAppeals(value,{chapter,parsed,evidence,checkEvidence=true,requireApproved=true}={}){
 if(!value||value.schemaVersion!==1||value.policy!==FALLBACK_APPEALS_POLICY)fail('缺少本版逐例申诉及实际审核');
 for(const [key,want]of Object.entries(appealBindings(chapter)))if(value[key]!==want)fail('申诉与本版'+key+'不一致');
 if(!Array.isArray(value.requests)||!Array.isArray(value.decisions)||!Array.isArray(value.records))fail('申诉、决议或实际材料缺失');
 const expected=fallbackContexts(parsed),ids=expected.map(c=>c.id);
 if(!same(value.requests.map(r=>r?.contextId),ids)||!same(value.decisions.map(r=>r?.contextId),ids))fail('每份教学例句必须单独申诉、单独审核，不能遗漏、重复或概括豁免');
 const cases=checkEvidence?await fallbackCases(parsed,evidence.authoring.map(w=>w.authored)):null;
 const entries=[...(evidence?.authoring||[]).flatMap(w=>w.material.entries),...(evidence?.originals||[]).map(o=>({id:'read:'+o.record.textDigest,text:o.text}))];
 const records=new Set();
 for(const r of value.records){
  if(!r||r.id!=='research:'+r.digest||!sha(r.digest)||records.has(r.id)||!['search-observation','source-reading','rights-evidence'].includes(r.kind)||!nonempty(r.text,4000000)||await sha256(r.text)!==r.digest)fail('研究原件摘要、种类或身份无效');
  records.add(r.id);entries.push({id:r.id,text:r.text});
  const raw=JSON.parse(r.text);
  if(r.kind==='search-observation'){
   if(raw.kind!=='external-search-observation'||!Array.isArray(raw.actualRequest?.search_query)||!raw.actualRequest.search_query.length||raw.actualResult===undefined||!nonempty(raw.scope)||!Number.isFinite(Date.parse(raw.requestedAt))||!Number.isFinite(Date.parse(raw.receivedAt))||Date.parse(raw.receivedAt)<Date.parse(raw.requestedAt)||await sha256(JSON.stringify(raw.actualResult))!==raw.resultSha256)fail('不能把查询计划或作者概述当实际搜索返回');
   // Quotes refer to actual returned strings, not JSON escape characters.
   // Keep individual leaves separate so a quote cannot join unrelated fields.
   if(checkEvidence){const pending=[raw.actualResult,...raw.actualRequest.search_query.map(q=>q.q)];while(pending.length){const v=pending.pop();if(typeof v==='string')entries.push({id:r.id,text:v});else if(v&&typeof v==='object')for(const child of Object.values(v))pending.push(child);}}
  }else{
   if(!raw.record||raw.record.kind!=='read-original-text'||typeof raw.originalText!=='string'||await sha256(raw.originalText)!==raw.record.textDigest||!nonempty(raw.record.canonicalUrl)||!Number.isFinite(Date.parse(raw.record.readAt)))fail('候选读件或采用条件必须保实际读取凭据及同摘要原文');
   if(checkEvidence)entries.push({id:r.id,text:raw.originalText});
  }
 }
 const refs=(list,label)=>{if(!Array.isArray(list)||!list.length)fail(label+'须引用实际原件');for(const r of list)if(!nonempty(r?.sourceId,300)||!nonempty(r?.quote,12000)||checkEvidence&&!entries.some(e=>e.id===r.sourceId&&e.text.includes(r.quote)))fail(label+'引文不在固定资料中');};
 for(const c of expected){
  const request=value.requests.find(r=>r.contextId===c.id),decision=value.decisions.find(r=>r.contextId===c.id),basis=cases?.find(r=>r.contextId===c.id);
  if(!sha(request.basisDigest)||basis&&request.basisDigest!==basis.basisDigest||!same(request.useIds,c.refs||c.uses)||!nonempty(request.reason)||!nonempty(request.searchConclusion)||!nonempty(request.teachingBenefit))fail('申诉须绑定实际例句、全部用法和具体取材/教学理由 '+c.id);
  refs(request.refs,'申诉 '+c.id);
  if(request.recordIds!==undefined&&(!Array.isArray(request.recordIds)||new Set(request.recordIds).size!==request.recordIds.length||request.recordIds.some(id=>!records.has(id))))fail('申诉的逐例研究记录范围缺失、重复或越界 '+c.id);
  if(decision.basisDigest!==request.basisDigest||!['approved','needs-research','rejected'].includes(decision.decision)||!nonempty(decision.reason))fail('逐例决议缺依据或失效 '+c.id);
  refs(decision.refs,'审核 '+c.id);
  if(requireApproved&&decision.decision!=='approved')fail('仍有未获准例句 '+c.id+'：'+decision.reason);
 }
 if(ids.length){
  const r=value.reviewer;
  if(!r||!['codex','human'].includes(r.kind)||!nonempty(r.runReference,500)||r.kind==='codex'&&(!nonempty(r.model,100)||r.effort!=='high'))fail('缺少实际审核执行身份');
  if(!nonempty(value.reviewedAt,80)||!Number.isFinite(Date.parse(value.reviewedAt))||Date.parse(value.reviewedAt)>Date.now()+300000)fail('审核时间无效');
 }
 const approvedExampleCount=value.decisions.filter(d=>d.decision==='approved').length;
 return {policy:FALLBACK_VALIDATOR_POLICY,contextCount:parsed.contexts.length,authenticContextCount:parsed.contexts.length-ids.length,approvedExampleCount,allContextsAdmitted:approvedExampleCount===ids.length,alarm:authenticityAlarm(evidence?.authenticity||chapter.sourcePackage.authenticityCoverage)};
}
