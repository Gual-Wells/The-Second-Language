// Self-written isolated fixtures only. No real semantic review, API, production
// key or publication is performed. The reused backend fixture owns an ephemeral
// test key; its fixture signature is not used by this admission test.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {usageContextBackendFixture} from './lib/usage-context-backend-fixture.mjs';
import {assembleUsageContextCollection} from './lib/usage-context-authoring.mjs';
import {loadPublicationReview} from './lib/publication-review.mjs';
import {publicationReviewDraft} from '../protocol/publication-review.mjs';
import {canonicalSourcePackage as canonical} from '../protocol/current-affairs.mjs';
import {verifyEvidenceRecords} from '../protocol/chapter-evidence-records.mjs';
const hash=s=>createHash('sha256').update(s).digest('hex'),date='2026-11-02',root=process.cwd();
await fs.mkdir(path.join(root,'.cache'),{recursive:true});const directory=await fs.mkdtemp(path.join(root,'.cache','publication-review-check-'));
const base=usageContextBackendFixture(date,'layout3'),old=base.value,oldGroup=base.assets.find(x=>x.kind==='chapter-evidence-group-v1'),oldManifest=base.manifest;
const oldReviewText=JSON.stringify(base.review),deltaArtifact=JSON.stringify({fixtureOnly:true,notice:'Simulated narrow review metadata for self-written engineering fixture; no real model review.'}),deltaReviewDigest=hash(deltaArtifact),checks=[];
function candidate(mutator=()=>{}){
 const group=structuredClone(oldGroup),source=structuredClone(old.sourcePackage),authors=group.records.filter(x=>x.kind==='word').map(r=>JSON.parse(r.authorText));
 authors[0].partOne=authors[0].partOne.replace('隔离验证用法','隔离验证用法的限定补充');mutator({group,source,authors});
 for(const a of authors){const rec=group.records.find(r=>r.kind==='word'&&r.wordId===a.wordId);rec.authorText=JSON.stringify(a);rec.authorDigest=hash(rec.authorText);}
 const assembled=assembleUsageContextCollection(authors,{expectedWordCount:50}),digest=hash(assembled.markdown),text=JSON.stringify(group),manifest={...oldManifest,chapterDigest:digest,selectionDigest:source.selectionDigest,groups:[{digest:hash(text),bytes:Buffer.byteLength(text)}]};
 source.chapterDigest=digest;source.evidenceDigest=hash(JSON.stringify(manifest));source.contexts=assembled.contextSources;
 const chapter={...old,digest,markdown:assembled.markdown,sourcePackage:source,sourceDigest:hash(canonical(source))};
 const evidence=verifyEvidenceRecords(manifest,[group],chapter); // Counterexamples repair their hashes first.
 const value=publicationReviewDraft({chapter,parsed:assembled.parsed,runId:date});value.state='complete';value.reviewedAt=new Date().toISOString();value.reviewer={kind:'codex',model:'fixture-no-model-executed',effort:'high',runReference:'isolated-publication-review-fixture/simulated-metadata'};value.checks=Object.fromEntries(Object.keys(value.checks).map(k=>[k,'complete']));value.summary='Fixture only: old complete fixture review inherited; this simulated run covers only the changed explanation, not a newly reread whole chapter.';
 value.basis={mode:'teaching-delta-v1',chapterDigest:old.digest,sourceDigest:old.sourceDigest,evidenceDigest:old.sourcePackage.evidenceDigest,selectionDigest:old.sourcePackage.selectionDigest,reviewDigest:hash(oldReviewText),reviewFormat:'publication-review-v1',reviewRecords:[],deltaReviewDigest,reviewed:{wordIds:['W000'],useIds:['U000'],contextIds:['C000']}};
 return {chapter,group,manifest,evidence,value};
}
async function setup(name,c=candidate()){
 const dir=path.join(directory,name),run=path.join(dir,'work/runs',date),teaching=path.join(run,'teaching'),baseline=path.join(teaching,'review-baselines',old.digest);
 await fs.mkdir(path.join(dir,'chapters',date),{recursive:true});await fs.mkdir(path.join(run,'sources/evidence'),{recursive:true});await fs.mkdir(path.join(baseline,'objects'),{recursive:true});await fs.mkdir(path.join(teaching,'review-artifacts'),{recursive:true});
 await fs.writeFile(path.join(dir,'chapters',date,'chapter.json'),JSON.stringify(c.chapter));await fs.writeFile(path.join(teaching,'publication-review.json'),JSON.stringify(c.value));
 await fs.writeFile(path.join(baseline,'chapter.json'),JSON.stringify(old));await fs.writeFile(path.join(baseline,'review.json'),oldReviewText);await fs.writeFile(path.join(teaching,'review-artifacts',deltaReviewDigest+'.json'),deltaArtifact);
 for(const object of [oldGroup,oldManifest])await fs.writeFile(path.join(baseline,'objects',hash(JSON.stringify(object))+'.json'),JSON.stringify(object));
 for(const object of [c.group,c.manifest])await fs.writeFile(path.join(run,'sources/evidence',hash(JSON.stringify(object))+'.json'),JSON.stringify(object));
 return {dir,teaching,baseline,c};
}
async function verify(f){return loadPublicationReview(f.dir,date,f.c.chapter,{evidence:f.c.evidence});}
async function reject(name,mutate,pattern){const f=await setup(name);await mutate(f);await assert.rejects(()=>verify(f),pattern);checks.push(name);}
const good=await setup('valid-explanation-delta'),loaded=await verify(good);assert.deepEqual(loaded.delta.changedWordIds,['W000']);assert.deepEqual(loaded.delta.changedUseIds,['U000']);assert.equal(loaded.delta.fullOldAndNewEvidenceVerified,true);assert.equal(loaded.value.scope.wordIds.length,50);checks.push('valid-explanation-delta');
await reject('draft-is-not-review',async f=>{f.c.value.state='draft';await fs.writeFile(path.join(f.teaching,'publication-review.json'),JSON.stringify(f.c.value));},/尚未完成/);
await reject('new-version-scope-cannot-be-narrowed',async f=>{f.c.value.scope.useIds.pop();await fs.writeFile(path.join(f.teaching,'publication-review.json'),JSON.stringify(f.c.value));},/范围缺项/);
await reject('missing-actual-reviewed-range',async f=>{f.c.value.basis.reviewed.useIds=[];await fs.writeFile(path.join(f.teaching,'publication-review.json'),JSON.stringify(f.c.value));},/实际审阅范围/);
await reject('baseline-wrong-source-version',async f=>{f.c.value.basis.sourceDigest='d'.repeat(64);await fs.writeFile(path.join(f.teaching,'publication-review.json'),JSON.stringify(f.c.value));},/旧基线错版/);
await reject('baseline-review-byte-change',async f=>fs.appendFile(path.join(f.baseline,'review.json'),'\n'),/原件摘要不符/);
await reject('old-complete-review-must-really-be-complete',async f=>{const r=structuredClone(base.review);r.state='draft';const text=JSON.stringify(r);f.c.value.basis.reviewDigest=hash(text);await fs.writeFile(path.join(f.baseline,'review.json'),text);await fs.writeFile(path.join(f.teaching,'publication-review.json'),JSON.stringify(f.c.value));},/尚未完成/);
await reject('unresolved-issue-blocks-delta',async f=>{f.c.value.issues=[{id:'pending',state:'open',severity:'minor',targetIds:['U000'],disposition:'Not yet resolved.',refs:[{sourceId:'chapter:'+f.c.chapter.digest,quote:'隔离验证用法'}]}];await fs.writeFile(path.join(f.teaching,'publication-review.json'),JSON.stringify(f.c.value));},/未决/);
await reject('actual-delta-review-artifact-required',async f=>fs.unlink(path.join(f.teaching,'review-artifacts',deltaReviewDigest+'.json')),/ENOENT/);
for(const[name,mutator,pattern]of[
 ['changed-translation-not-teaching-delta',({authors})=>{authors[0].contexts[0].translation+='另改译文。';},/contexts\/sentences\/translation/],
 ['changed-English-not-teaching-delta',({authors})=>{authors[0].contexts[0].paragraphs[0][0].text+=' Another sentence.';},/contexts\/sentences\/translation/],
 ['omitted-second-affected-USE',({authors})=>{authors[1].partOne=authors[1].partOne.replace('隔离验证用法','另一处实际讲解变化');},/遗漏实际受影响/],
 ['heading-change-needs-full',({authors})=>{authors[0].partOne=authors[0].partOne.replace('测试用途','新快释');},/USE标题/],
 ['etymology-unknown-impact-needs-full',({authors})=>{authors[0].partOne=authors[0].partOne.replace('只供隔离接口验证','改动词源范围');},/词源或未知影响/],
 ['other-author-field-not-allowed',({authors})=>{authors[0].contextChoices[0].reason='Changed candidate decision.';},/其他作者字段/],
 ['source-read-identity-change-not-allowed',({group,source})=>{const src=group.records.find(r=>r.kind==='source');source.sources[0].readAt='2026-10-28T00:00:00.000Z';const receipt=JSON.parse(src.recordText);receipt.readAt=source.sources[0].readAt;src.recordText=JSON.stringify(receipt);src.recordDigest=hash(src.recordText);src.authorReadRecords[0].recordText=src.recordText;src.authorReadRecords[0].recordDigest=src.recordDigest;},/source读件/],
 ['repaired-selection-change-not-allowed',({group,source})=>{const control=group.records.find(r=>r.kind==='control');control.selection.mainWords[0].globalRank=999;source.selectionDigest=hash(canonical(control.selection));},/同一冻结selection/],
 ['repaired-material-change-not-allowed',({group,authors})=>{const word=group.records.find(r=>r.kind==='word'),packet=JSON.parse(word.materialText);packet.entries[0].text+='Self-written changed fixed-material fixture text.\n';packet.entries[0].excerptDigest=hash(packet.entries[0].text);word.materialText=canonical(packet);word.materialDigest=hash(word.materialText);authors[0].materialDigest=word.materialDigest;const control=group.records.find(r=>r.kind==='control'),manifest=JSON.parse(control.materialsManifestText),ref=manifest.packets.find(r=>r.word===word.text);ref.materialDigest=word.materialDigest;ref.file='teaching/materials/'+word.materialDigest+'.json';control.materialsManifestText=JSON.stringify(manifest);control.materialsManifestDigest=hash(control.materialsManifestText);},/selection\/control|封存教材|材料/],
 ['sourceCoverage-cannot-rewrite-history',({authors})=>{authors[0].sourceCoverage[0].disposition='Replace historical account.';},/只能附加/]
]){const c=candidate(mutator),f=await setup(name,c);await assert.rejects(()=>verify(f),pattern);checks.push(name);}
const note=candidate(({authors})=>{authors[0].sourceCoverage[0].disposition+='\n[teaching-delta-v1 USE:U000] Added bounded explanation condition in this isolated fixture.';}),noteFile=await setup('bounded-sourceCoverage-note',note);assert.equal((await verify(noteFile)).delta.sourceCoverageNotes.length,1);checks.push('bounded-sourceCoverage-note');
async function legacySetup(name){
 const f=await setup(name),c=old,scope=base.review.scope;
 const report={version:1,status:'published-and-read-back',fixtureOnly:true,candidate:{chapterDigest:c.digest,sourceDigest:c.sourceDigest,evidenceDigest:c.sourcePackage.evidenceDigest,selectedMainWords:50,uses:50,contexts:49},scope:{allUseChoicesRevisited:50,usesAndOrderPreserved:true,selectedWordsAndFamiliesUnchanged:true,semanticReview:'Self-written simulated historical root report; no real review claimed.'},checks:{frozenIdentityAndWholeAssembly:true,actualMaterialDisposition:true}};
 const uses=oldGroup.records.filter(x=>x.kind==='word').map((r,i)=>({wordId:r.wordId,useId:'U'+String(i).padStart(3,'0'),materialDigest:r.materialDigest,pending:[]}));
 const lanes=[{status:'complete',uses:uses.slice(0,17)},{status:'lane-complete-pending-root-integration',unresolved:[],words:uses.slice(17,34).map(u=>({wordId:u.wordId,materialDigest:u.materialDigest,decisions:[{useId:u.useId}]}))},{uses:uses.slice(34),unresolved:[]}];
 const text=JSON.stringify(report);f.c.value.basis.reviewDigest=hash(text);f.c.value.basis.reviewFormat='legacy-context-reselection-v1';f.c.value.basis.reviewRecords=[];await fs.writeFile(path.join(f.baseline,'review.json'),text);
 for(let i=0;i<lanes.length;i++){const file='lane-'+i+'.json',raw=JSON.stringify(lanes[i]);await fs.writeFile(path.join(f.baseline,file),raw);f.c.value.basis.reviewRecords.push({file,digest:hash(raw),role:'use-review'});}
 await fs.writeFile(path.join(f.teaching,'publication-review.json'),JSON.stringify(f.c.value));return {f,lanes};
}
const legacy=await legacySetup('legacy-final-root-closes-unaltered-lanes');assert.equal((await verify(legacy.f)).delta.baselineReview.format,'legacy-context-reselection-v1');assert.equal(legacy.lanes[1].status,'lane-complete-pending-root-integration');checks.push('legacy-final-root-closes-unaltered-lanes');
const missingLane=await legacySetup('legacy-missing-full-USE-range');missingLane.lanes[2].uses.pop();{const raw=JSON.stringify(missingLane.lanes[2]);await fs.writeFile(path.join(missingLane.f.baseline,'lane-2.json'),raw);missingLane.f.c.value.basis.reviewRecords[2].digest=hash(raw);await fs.writeFile(path.join(missingLane.f.teaching,'publication-review.json'),JSON.stringify(missingLane.f.c.value));}await assert.rejects(()=>verify(missingLane.f),/没有覆盖旧全量/);checks.push('legacy-missing-full-USE-range');
const unresolvedLane=await legacySetup('legacy-unresolved-USE-blocks-inheritance');unresolvedLane.lanes[2].uses[0].pending=['unresolved fixture issue'];{const raw=JSON.stringify(unresolvedLane.lanes[2]);await fs.writeFile(path.join(unresolvedLane.f.baseline,'lane-2.json'),raw);unresolvedLane.f.c.value.basis.reviewRecords[2].digest=hash(raw);await fs.writeFile(path.join(unresolvedLane.f.teaching,'publication-review.json'),JSON.stringify(unresolvedLane.f.c.value));}await assert.rejects(()=>verify(unresolvedLane.f),/仍有未决/);checks.push('legacy-unresolved-USE-blocks-inheritance');
// Keep the original full route strict and compatible: no basis field needed.
const full=await setup('full-mode-compatible');full.c.chapter=old;full.c.evidence=verifyEvidenceRecords(oldManifest,[oldGroup],old);await fs.writeFile(path.join(full.teaching,'publication-review.json'),oldReviewText);const fullResult=await loadPublicationReview(full.dir,date,old,{evidence:full.c.evidence});assert.equal(fullResult.value.state,'complete');assert.equal(fullResult.delta,undefined);checks.push('full-mode-compatible');
const report={checks,passed:checks.length,fixtureDirectory:directory,externalRequests:0,paidApiCalls:0,productionKeysUsed:false,realSemanticReviewClaimed:false};await fs.writeFile(path.join(directory,'results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
