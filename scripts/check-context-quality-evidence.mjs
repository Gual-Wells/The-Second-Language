// Real publication evidence and quality stages, deterministic reviewer outputs.
// This checks evidence delivery and decisions, not a model's semantic accuracy.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createEvidenceFixture} from './check-chapter-evidence.mjs';
import {processQualityJob} from './lib/chapter-quality-runner.mjs';
import {qualityPolicy,qualityPolicyDigest} from '../protocol/chapter-quality-contract.mjs';
import {indexTextbook} from './lib/textbook-sources.mjs';

const hash=value=>createHash('sha256').update(value).digest('hex');
const parent=path.resolve('.cache/publication-reliability-20261030/quality-evidence');await fs.mkdir(parent,{recursive:true});
const root=await fs.mkdtemp(path.join(parent,'isolated-')),checks=[],calls=[];
const originalFetch=globalThis.fetch;globalThis.fetch=async()=>{throw Error('Quality evidence checks cannot access the network');};
const check=async(name,run)=>{await run();checks.push(name);console.log('PASS '+name);};
try{
 const fixture=await createEvidenceFixture(root),chapter={...fixture.chapter,id:'evidence-quality-fixture',title:'Isolated evidence review',vixCommit:fixture.chapter.sourcePackage.vixInputCommit};
 const policyDigest=await qualityPolicyDigest(),names=fixture.selection.mainWords.map(w=>w.text);
 const books=['collins','oxford'].map(book=>indexTextbook(Buffer.from(names.map(name=>`## ${name}\nA self-authored fixture definition.\n${book==='collins'?'□':'◊'} This unshown original example uses ${name}.`).join('\n')),book));
 const initial=new Map([...fixture.objects].map(([digest,value])=>[digest,JSON.stringify(value)]));
 const makeJob=(overrides={})=>({id:crypto.randomUUID(),claim:'a'.repeat(64),attemptId:crypto.randomUUID(),policyDigest,checkpointDigest:null,chapter,...overrides});
 async function execute(name,{job=makeJob(),mode='accepted',mutateRead,requestOverride,directory}={}){
  const assets=new Map(initial),folder=directory||path.join(parent,name);await fs.mkdir(folder,{recursive:true});let completed=null;
  const request=async(route,payload,method)=>{
   if(requestOverride){const value=await requestOverride(route,payload,method);if(value!==undefined)return value;}
   if(route==='/api/storage/content'&&method==='PUT'){const digest=hash(payload);assets.set(digest,payload);return{digest};}
   if(route.startsWith('/api/storage/content?')){const digest=new URL(route,'https://fixture.test').searchParams.get('digest');if(!assets.has(digest))throw Error('Missing fixture asset');const value=JSON.parse(assets.get(digest));return mutateRead?mutateRead(digest,value):value;}
   if(route.endsWith('/checkpoint'))return{yield:false};
   if(route.endsWith('/complete')){completed=JSON.parse(assets.get(payload.reportDigest));return{ok:true};}
   throw Error('Unexpected isolated quality route '+route);
  };
  const runModel=async(schema,prompt)=>{
   const input=JSON.parse(prompt.slice(prompt.lastIndexOf('\n')+1)),phase=schema.properties.words?'sources':schema.properties.items?'verification':'reviews';calls.push({name,phase});
   if(phase==='sources'){
    assert(!prompt.includes('authoringEvidence')&&!prompt.includes('unshown candidate'),'Independent dictionary inventory never sees author mappings');
    return{words:input.map(w=>({wordId:w.wordId,facts:[{id:'F001',description:'A self-authored fixture definition.',refs:[{sourceId:w.entries[0].id,quote:'A self-authored fixture definition.'}]}],extraTerms:[],closure:'complete',reason:'Deterministic independent source fixture'}))};
   }
   if(phase==='verification'){
    assert(prompt.includes('不要求全部展示')&&Array.isArray(input.authoringEvidence),'Counter-review receives the new policy and fixed author data');
    return{items:input.findings.map(f=>({findingId:f.id,state:'confirmed',severity:'major',reason:'Explicit omission control remains a defect despite a producer assertion.',refs:f.refs}))};
   }
   if(mode==='accepted'&&input.targets.some(t=>t.wordId)){
    assert(prompt.includes('不要求全部展示')&&prompt.includes('作者理由与映射仅是待核数据'));
    assert(input.authoringEvidence.length>0,'Fixed author choices accompany word review');
    for(const a of input.authoringEvidence){assert.equal(a.exampleCoverage.length,2);assert(a.exampleCoverage.every(e=>e.disposition.includes('unshown candidate')));assert.equal(a.contextChoices.length,1);assert.equal(a.material.exampleCandidates.length,2);}
   }
   const checks=input.targets.map(t=>({targetId:t.id,state:'supported',reason:'Deterministic transport control; not semantic certification.',refs:[]})),findings=[];
   if(mode==='omission'){
    const target=input.targets.find(t=>t.id==='fact:W001:F001');
    if(target){const ref=input.inventory.find(i=>i.wordId==='W001').facts[0].refs;checks.find(c=>c.targetId===target.id).state='issue';findings.push({id:'omitted',targetId:target.id,severity:'major',category:'meaning',quote:target.text,explanation:'Explicit unique-information omission control.',action:'Restore the missing teaching information.',refs:ref});}
   }
   return{checks,findings};
  };
  const result=await processQualityJob({job,root,directory:folder,request,runModel,loadBooks:async()=>books});
  return{result,report:completed,job,folder,assets,request,runModel};
 }
 let accepted;
 await check('unshown original examples retain their fixed dispositions and do not mechanically fail',async()=>{
  assert(!chapter.markdown.includes('This unshown original example uses'));
  accepted=await execute('accepted');assert.equal(accepted.result.decision,'passed');assert.equal(accepted.report.policy,'chapter-quality-v3-evidence');
  assert(!JSON.stringify(accepted.report).includes('unshown candidate'),'Private author rationale is not copied into the report');
 });
 await check('fixed publisher evidence remains usable without the acquisition cache or local author files',async()=>{
  await fs.rm(path.join(root,'.cache/current-affairs-research'),{recursive:true,force:true});
  await fs.rm(path.join(root,'work/runs',fixture.date,'teaching/authored'),{recursive:true,force:true});
  assert.equal((await execute('without-local-originals')).result.decision,'passed');
 });
 await check('genuine information omission is not suppressed by a producer disposition',async()=>{
  const value=await execute('omission',{mode:'omission'});assert.equal(value.result.decision,'revision_required');assert(value.report.findings.some(f=>f.verification?.state==='confirmed'));
 });
 await check('missing publication evidence yields needs_evidence even when the reviewer returns supported',async()=>{
  const bad=structuredClone(chapter);delete bad.sourcePackage.evidenceDigest;
  const value=await execute('missing',{job:makeJob({chapter:bad}),mode:'missing'});assert.equal(value.result.decision,'needs_evidence');assert(value.report.limitations.some(s=>s.includes('出版作者去向证据')));
 });
 await check('tampered private publication object remains an evidence gap',async()=>{
  const group=fixture.evidence.manifest.groups[0].digest;
  const value=await execute('tampered',{mode:'missing',mutateRead:(digest,value)=>digest===group?{...value,tampered:true}:value});assert.equal(value.result.decision,'needs_evidence');
 });
 await check('evidence from a different run is never replaced by current local materials',async()=>{
  const value=await execute('foreign-run',{mode:'missing',job:makeJob({chapter:{...chapter,runId:'different-run'}})});assert.equal(value.result.decision,'needs_evidence');
 });
 await check('already validated same-identity model results are reused on a repeat push',async()=>{
  const before=calls.length;
  await processQualityJob({job:accepted.job,root,directory:accepted.folder,request:accepted.request,runModel:accepted.runModel,loadBooks:async()=>books});assert.equal(calls.length,before);
 });
 await check('old semantic policy is rejected before a model or checkpoint can run',async()=>{
  const before=calls.length,old=makeJob({policyDigest:'b'.repeat(64)});
  await assert.rejects(execute('old-policy',{job:old}),/标准已更新/);assert.equal(calls.length,before);
 });
 await check('a foreign policy checkpoint cannot skip the new evidence review',async()=>{
  const job=makeJob(),oldEvidence={chapterDigest:chapter.digest,policyDigest:'b'.repeat(64),sourceCommit:chapter.vixCommit};
  const state={requestId:job.id,chapterDigest:chapter.digest,policyDigest:'b'.repeat(64),evidenceDigest:hash(JSON.stringify(oldEvidence)),phase:'complete'},digest=hash(JSON.stringify(state));job.checkpointDigest=digest;
  await assert.rejects(execute('old-checkpoint',{job,requestOverride:async route=>route==='/api/storage/content?digest='+digest?state:route==='/api/storage/content?digest='+state.evidenceDigest?oldEvidence:undefined}),/旧检查点不属于/);
 });
 await fs.writeFile(path.join(parent,'results.json'),JSON.stringify({checks,policy:qualityPolicy.id,mockModelCalls:calls.length,paidModelCalls:0,liveNetworkRequests:0,semanticModelAccuracyMeasured:false},null,2));
 console.log(JSON.stringify({passed:checks.length,paidModelCalls:0,liveNetworkRequests:0}));
}finally{
 globalThis.fetch=originalFetch;
 const physicalParent=await fs.realpath(parent),physicalRoot=await fs.realpath(root),relative=path.relative(physicalParent,physicalRoot);
 assert(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative),'Cleanup stays inside this fixture');await fs.rm(physicalRoot,{recursive:true,force:true});
}
