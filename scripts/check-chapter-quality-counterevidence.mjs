// Offline regression for the v5 evidence boundary. Synthetic prose is never a
// formal chapter or a real quality report; no model, network or publisher call.
import assert from 'node:assert/strict';
import {readFile,readdir,mkdir} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import {qualityPolicy,qualityPolicyV3,qualityPolicyV4,qualityPolicyDigest,qualityTargets,factTargets,finalizeQuality,counterEvidencePlan,validateCounterEvidence,digestText} from '../protocol/chapter-quality-contract.mjs';
import {assembleUsageContextCollection} from './lib/usage-context-authoring.mjs';
import {processQualityJob} from './lib/chapter-quality-runner.mjs';
import {chapterQualityRoute,claimQuality} from '../worker/src/chapter-quality.js';
globalThis.fetch=async()=>{throw Error('Network forbidden in counterevidence QA');};
assert.equal(await qualityPolicyDigest(qualityPolicyV3),'3c9c3cc48d976305765b37713c1055f010623b6cccdccad0cd4833c58c780a3a');
assert.equal(await qualityPolicyDigest(qualityPolicyV4),'52fe2fc27a693b4d9edac35c4c638513624cd3f4bafe0f5d2831f0ab037dbdfa');
const words=Array.from({length:50},(_,i)=>({id:'W'+i,use:'U'+i,text:'word'+String(i).padStart(2,'0')}));
const original='The fixture records an independently preserved original.',url='https://fixture.invalid/original',readDigest=await digestText(original);
const authored=words.map((w,i)=>({wordId:w.id,text:w.text,partOne:`<!-- WORD:${w.id} -->\n# ${w.text}\n\n**词源**：隔离样例。\n\n<!-- USE:${w.use} -->\n## ${w.text} · 样例 /test/\n\`隔离解释。\`\n\n<!-- CONTEXT_SLOT:${w.use} -->`,contexts:i===1?[]:[{id:'C'+i,kind:i===0?'abridgment':'example',uses:i===0?['U0','U1']:[w.use],sourceUrls:i===0?[url]:[],paragraphs:[[{id:'S'+i,text:'The fixture uses '+w.text+' in context.',uses:i===0?['U0','U1']:[w.use]}]],translation:'隔离语境，不是实际教材。',sourceEvidence:i===0?[{url,readRecord:'fixture-only',locator:'fixture',senseEvidence:'fixture',changes:'fixture',publicationBasis:'fixture'}]:[],...(i===0?{}:{fallbackReason:'隔离结构测试'})}],contextChoices:[{useId:w.use,contextIds:['C'+(i===1?0:i)],reason:'隔离实际映射测试'}]}));
const markdown=assembleUsageContextCollection(authored,{expectedWordCount:50}).markdown;
const chapter={id:'counterevidence-fixture',date:'2026-11-02',runId:'counterevidence-fixture',vixCommit:'a'.repeat(40),digest:await digestText(markdown),title:'隔离反证测试',markdown,sourcePackage:{evidenceDigest:'b'.repeat(64),sources:[{url,readDigest}]}};
const parsed=qualityTargets(markdown),policyDigest=await qualityPolicyDigest();
const evidence={chapterDigest:chapter.digest,policyDigest,sourceCommit:chapter.vixCommit,gaps:[],books:[],notes:[],words:words.map(w=>({id:w.id,word:w.text,entries:['collins','oxford'].map(book=>({id:book+':'+w.id,book,text:w.text+' fixed '+book+' entry with full fixture meanings.'}))})),contextSources:[{id:'read:'+readDigest,book:'context-original',url,readDigest,text:original}],authoring:authored.map(w=>({wordId:w.wordId,text:w.text,contextChoices:w.contextChoices})),authoringEvidence:{digest:chapter.sourcePackage.evidenceDigest,chapterDigest:chapter.digest,runId:chapter.runId}};
const inventory=evidence.words.map(w=>({wordId:w.id,facts:[{id:'F1',description:w.word+' meaning',refs:[{sourceId:w.entries[0].id,quote:w.word}]}],extraTerms:[],closure:'complete',reason:'fixture complete'}));
const targets=[...parsed.targets,...inventory.flatMap(factTargets)];
const sourceTarget=targets.find(t=>t.id==='source:context:C0'),finding={id:'source_problem',targetId:sourceTarget.id,severity:'major',category:'source',quote:sourceTarget.text.slice(0,20),explanation:'Synthetic source issue',action:'Synthetic correction',refs:[]};
const reviews=[{checks:targets.map(t=>({targetId:t.id,state:t.id===finding.targetId?'issue':'supported',reason:'fixture judgment',refs:[]})),findings:[finding]}];
const findings=[{...finding,id:'b0_'+finding.id}],args={chapter,policyDigest,evidenceDigest:'c'.repeat(64),evidence,inventory,reviews};
const plan=counterEvidencePlan({...args,parsed,findings});
assert.deepEqual(plan.scopes[0].wordIds.sort(),['W0','W1']);
for(const id of ['collins:W0','oxford:W0','collins:W1','oxford:W1','read:'+readDigest])assert.ok(plan.entries.some(e=>e.id===id),'Deliver necessary uncited source '+id);
assert.ok(!plan.entries.some(e=>e.id==='collins:W2'),'No unrelated word substituted as counterevidence');
const empty={items:[{findingId:findings[0].id,state:'withdrawn',severity:'minor',reason:'fixture empty withdrawal',refs:[]}]};
assert.equal(finalizeQuality({...args,verification:empty}).decision,'needs_evidence');
assert.equal(finalizeQuality({...args,verification:{items:[{...empty.items[0],state:'confirmed'}]}}).decision,'needs_evidence');
const valid={items:[{...empty.items[0],refs:[{sourceId:'read:'+readDigest,quote:'independently preserved original'}]}]};
assert.equal(finalizeQuality({...args,verification:valid}).decision,'passed');
assert.equal(finalizeQuality({...args,verification:{items:[{...empty.items[0],refs:[{sourceId:'collins:W0',quote:'word00'}]}]}}).decision,'needs_evidence','Dictionary cannot substitute for adopted original in source-fidelity withdrawal');
assert.throws(()=>validateCounterEvidence({items:[{...empty.items[0],refs:[{sourceId:'collins:W2',quote:'word02'}]}]},findings,plan),/固定原文/);
assert.throws(()=>validateCounterEvidence({items:[{...empty.items[0],refs:[{sourceId:'read:'+readDigest,quote:'invented quote'}]}]},findings,plan),/固定原文/);
const missingEvidence={...evidence,contextSources:[]};
assert.equal(finalizeQuality({...args,evidence:missingEvidence,verification:empty}).decision,'needs_evidence');
const wrongDigestEvidence={...evidence,contextSources:[{...evidence.contextSources[0],readDigest:'d'.repeat(64)}]};
assert.equal(finalizeQuality({...args,evidence:wrongDigestEvidence,verification:empty}).decision,'needs_evidence');
const missingDictionary={...evidence,words:evidence.words.map(w=>w.id==='W0'?{...w,entries:w.entries.filter(e=>e.book!=='oxford')}:w)};
const openInventory=inventory.map(w=>w.wordId==='W0'?{...w,closure:'unresolved',reason:'Oxford unavailable in fixture'}:w);
assert.equal(finalizeQuality({...args,evidence:missingDictionary,inventory:openInventory,verification:valid}).decision,'needs_evidence','Even a cited source cannot close missing required dictionary evidence');
// No blocking findings: ordinary supported checks do not need forced citations.
const allSupported=[{checks:reviews[0].checks.map(c=>({...c,state:'supported'})),findings:[]}];
assert.equal(finalizeQuality({...args,reviews:allSupported,verification:{items:[]}}).decision,'passed');

const objects=new Map(),put=async value=>{const text=typeof value==='string'?value:JSON.stringify(value),digest=await digestText(text);objects.set(digest,text);return{digest};};
const directory='.cache/chapter-quality-counterevidence/'+crypto.randomUUID();await mkdir(directory,{recursive:true});
let fixtureCalls=0;
async function runVerification(policy,currentEvidence,output,label){
 const digest=await qualityPolicyDigest(policy),requestId=crypto.randomUUID(),fixedEvidence={...currentEvidence,policyDigest:digest};
 const evidenceDigest=(await put(fixedEvidence)).digest,checkpointDigest=(await put({requestId,chapterDigest:chapter.digest,policyDigest:digest,evidenceDigest,phase:'verification',inventory,reviews,verification:{items:[]},expected:targets.length})).digest;
 const dir=directory+'/'+label;await mkdir(dir,{recursive:true});let delivered;
 const result=await processQualityJob({job:{id:requestId,chapter,policy,policyDigest:digest,checkpointDigest,attemptId:crypto.randomUUID(),claim:'fixture'},root:process.cwd(),directory:dir,
  request:async(route,body,method)=>{if(method==='PUT')return put(body);if(method==='GET')return JSON.parse(objects.get(new URL(route,'https://fixture').searchParams.get('digest')));return{ok:true};},
  loadBooks:async()=>{throw Error('Verification resume must not fetch textbooks');},
  runModel:async(schema,prompt)=>{fixtureCalls++;delivered=JSON.parse(prompt.slice(prompt.lastIndexOf('\n')+1));if(policy.strictCounterEvidence){assert.ok(delivered.entries.some(e=>e.id==='oxford:W0'));assert.ok(delivered.entries.some(e=>e.id==='collins:W1'));const allowed=schema.properties.items.items.properties.refs.items.properties.sourceId.enum;assert.ok(!allowed.includes('collins:W2'));}else{assert.equal(delivered.entries.length,0);assert.equal(delivered.evidenceScopes,undefined);}return output;}});
 return{result,delivered};
}
for(const policy of [qualityPolicyV3,qualityPolicyV4])assert.equal((await runVerification(policy,evidence,empty,policy.id)).result.decision,'passed','Historical checkpoint interpretation preserved');
assert.equal((await runVerification(qualityPolicy,evidence,empty,'strict-empty')).result.decision,'needs_evidence');
assert.equal((await runVerification(qualityPolicy,evidence,valid,'strict-valid')).result.decision,'passed');
const missingRun=await runVerification(qualityPolicy,missingEvidence,empty,'strict-missing');assert.equal(missingRun.result.decision,'needs_evidence');assert.ok(missingRun.delivered.evidenceScopes[0].missing.length);

// The server recalculates strict evidence rules at direct complete, even when
// a publisher submits a forged passed report without running this runner.
const sqlite=new DatabaseSync(':memory:');for(const f of (await readdir('worker/migrations')).filter(f=>f.endsWith('.sql')).sort())sqlite.exec(await readFile('worker/migrations/'+f,'utf8'));
const db={prepare(sql){const wrap=(args=[])=>({bind(...v){return wrap(v);},async first(){return sqlite.prepare(sql).get(...args)||null;},async all(){return{results:sqlite.prepare(sql).all(...args)};},async run(){return{meta:{changes:Number(sqlite.prepare(sql).run(...args).changes)}};}});return wrap();}};
const classic='<!-- PART:one -->\n'+words.map(w=>`<!-- WORD:${w.id} -->\n# ${w.text}\n<!-- USE:${w.use} -->\n## ${w.text} · 样例 /test/\n\`隔离解释。\``).join('\n')+'\n<!-- PART:two -->\n'+words.map(w=>`<!-- WORD:${w.id} -->\n# ${w.text}\n<!-- EXAMPLE:${w.use} -->\nWe use ${w.text}.\n\`隔离译文。\``).join('\n')+'\n<!-- PART:three -->\n'+words.map((w,i)=>`<!-- SENTENCE:S${i} USE:${w.use} -->\nThey use ${w.text}.\n\`隔离译文。\``).join('\n');
const classicChapter={...chapter,markdown:classic,digest:await digestText(classic)};delete classicChapter.sourcePackage;
sqlite.prepare('INSERT INTO chapter_revisions(digest,chapter_id,study_date,number,title,subtitle,word_count,content_key,run_id,vix_commit,protocol_commit,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').run(classicChapter.digest,chapter.id,chapter.date,'第 1 章',chapter.title,'',50,'fixture',chapter.runId,chapter.vixCommit,'b'.repeat(40),0);
sqlite.prepare('INSERT INTO chapter_sources(digest,source_digest,source_key,policy,created_at) VALUES(?,?,?,?,?)').run(classicChapter.digest,'e'.repeat(64),'fixture','current-affairs-v1',0);
sqlite.prepare('INSERT INTO published_chapters(chapter_id,study_date,digest,published_at) VALUES(?,?,?,?)').run(chapter.id,chapter.date,classicChapter.digest,0);
const bucket={async getContent(digest){return objects.has(digest)?new Response(objects.get(digest)):null;}},env={DB:db,CHAPTERS:{get:async()=>classic}},claim='f'.repeat(64),id=crypto.randomUUID();
const call=async(path,body)=>{const response=await chapterQualityRoute(new Request('https://fixture/api/chapter-quality'+path,{method:'POST',body:JSON.stringify(body)}),env,{isPublisher:true},bucket);return{status:response.status,body:await response.json()};};
assert.equal((await call('',{id,chapterId:chapter.id,digest:classicChapter.digest,policy:qualityPolicyV4.id})).status,201);
const job=await claimQuality(env,claim);assert.equal(job.policy.id,qualityPolicy.id);
const classicParsed=qualityTargets(classic),classicTargets=[...classicParsed.targets,...inventory.flatMap(factTargets)],classicFinding={...finding,targetId:'source:W0',quote:classicParsed.targets[0].text.slice(0,20)},classicReviews=[{checks:classicTargets.map(t=>({targetId:t.id,state:t.id===classicFinding.targetId?'issue':'supported',reason:'fixture',refs:[]})),findings:[classicFinding]}],classicEvidence={...evidence,chapterDigest:classicChapter.digest},classicEvidenceDigest=(await put(classicEvidence)).digest;
const state={requestId:id,chapterDigest:classicChapter.digest,policyDigest,evidenceDigest:classicEvidenceDigest,phase:'complete',inventory,reviews:classicReviews,verification:empty,expected:classicTargets.length},stateDigest=(await put(state)).digest,owned={claim,attemptId:job.attemptId};
assert.equal((await call('/jobs/'+id+'/checkpoint',{...owned,checkpointDigest:stateDigest,evidenceDigest:classicEvidenceDigest})).status,200);
const classicArgs={chapter:classicChapter,policyDigest,evidenceDigest:classicEvidenceDigest,evidence:classicEvidence,inventory,reviews:classicReviews,verification:empty};
const forged={...finalizeQuality({...classicArgs,policy:qualityPolicyV4}),policy:qualityPolicy.id},forgedDigest=(await put(forged)).digest;
assert.equal((await call('/jobs/'+id+'/complete',{...owned,reportDigest:forgedDigest})).status,409,'Direct complete cannot sign the old empty-reference passed result as v5');
assert.equal(sqlite.prepare('SELECT status FROM chapter_quality_requests WHERE id=?').get(id).status,'running');
const strictReport=finalizeQuality(classicArgs);assert.equal(strictReport.decision,'needs_evidence');
assert.equal((await call('/jobs/'+id+'/complete',{...owned,reportDigest:(await put(strictReport)).digest})).status,200);
sqlite.close();
console.log(JSON.stringify({v3DigestPreserved:true,v4DigestPreserved:true,uncitedRelevantSourcesDelivered:true,sharedContextScope:true,unrelatedAndFalseQuotesRejected:true,adoptedOriginalRequired:true,missingOriginalUnresolved:true,ordinarySupportedNoForcedRefs:true,oldCheckpointInterpretation:true,runnerNegativeAndPositive:true,directCompleteForgeryRejected:true,networkCalls:0,modelCalls:0,fixtureCalls}));
