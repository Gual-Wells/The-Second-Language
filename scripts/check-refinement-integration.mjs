// Real local reader/material/assembly code, using only self-written offline text
// and explicitly simulated Goal receipts. No production copy or model is used.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {createEvidenceFixture} from './check-chapter-evidence.mjs';
import {prepareRefinement,inspectRefinementTask,mergeRefinement,REFINEMENT_ID} from './lib/chapter-refinement.mjs';
import {atomicJson} from './lib/daily-pipeline.mjs';
const scratch=path.resolve('.cache/refinement-integration-check',randomUUID()),date='2099-03-03',checks=[];
const check=async(name,fn)=>{await fn();checks.push(name);};
async function fixture(){
 const root=path.join(scratch,randomUUID());await fs.mkdir(root,{recursive:true});const f=await createEvidenceFixture(root,{date,count:30}),run=f.run;
 const lock=JSON.parse(await fs.readFile(path.join(run,'vix-source.json'),'utf8'));await atomicJson(path.join(run,'vix-source.json'),{...lock,teachingLayoutVersion:2,quickGlossVersion:1});
 await atomicJson(path.join(run,'control.json'),{runId:date,date,rest:false});await atomicJson(path.join(run,'vix-publication.json'),{fixtureOnly:true});await atomicJson(path.join(run,'teaching/pipeline/execution.json'),{engine:'digr-v1',fixtureOnly:true});
 const stage=path.join(run,'teaching/pipeline/invocations/task-1-plan');await atomicJson(path.join(stage,'started.json'),{startedAt:new Date().toISOString()});await atomicJson(path.join(stage,'finished.json'),{code:0});
 const files=(await fs.readdir(path.join(run,'teaching/authored'))).filter(n=>n.startsWith('word-'));
 for(const name of files){const file=path.join(run,'teaching/authored',name),w=JSON.parse(await fs.readFile(file,'utf8')),c=w.contexts[0],u=c.uses[0];w.layoutVersion=2;w.quickGlossVersion=1;w.partOne=w.partOne.replace('## '+w.text+' · 验证义 /test/','## '+w.text+' /test/ n. · 隔离验证');c.sourceEvidence[0].authenticUse={discourse:'technical-discourse',passage:c.paragraphs[0][0].text,communicativeAct:'Self-written offline validation only',uses:[{useId:u,headForm:w.text,surface:w.text,senseMatch:'Synthetic transport token match only'}]};await atomicJson(file,w);}
 const p=await prepareRefinement(root,date),file=path.join(p.task('task-1'),'authored/word-W001.json'),word=JSON.parse(await fs.readFile(file,'utf8'));word.contexts[0].translation+=' 这是修订组的隔离改动。';await atomicJson(file,word);
 return {root,run,p};
}
async function ready(f){for(const t of f.p.manifest.tasks){await atomicJson(path.join(f.p.task(t.id),'appeals.json'),[]);await atomicJson(path.join(f.p.task(t.id),'handoff.json'),{revision:REFINEMENT_ID,wordIds:t.words.map(w=>w.wordId),notes:'Simulated fixture handoff; no model ran.',unresolved:[]});const r=await inspectRefinementTask(f.root,date,t.id);await atomicJson(path.join(f.p.task(t.id),'goal/finished.json'),{code:0,fixtureOnly:true});await atomicJson(path.join(f.p.task(t.id),'goal/goal-complete.json'),{goal:{status:'complete'},verified:{artifacts:r.artifacts},fixtureOnly:true});}}
await check('three real artifact barriers integrate one complete thirty-word draft',async()=>{const f=await fixture(),global=path.join(f.run,'teaching/authored/word-W001.json'),old=await fs.readFile(global,'utf8'),engine=await fs.readFile(path.join(f.run,'teaching/pipeline/execution.json'),'utf8');await ready(f);const merged=await mergeRefinement(f.root,date);assert.equal(merged.wordIds.length,30);assert.equal(merged.coverage.authenticContextCount,30);assert.equal(merged.published,false);assert.notEqual(await fs.readFile(global,'utf8'),old);assert.equal(await fs.readFile(path.join(f.run,'teaching/pipeline/execution.json'),'utf8'),engine);assert.deepEqual(await mergeRefinement(f.root,date),merged);});
await check('missing genuine completion evidence prevents any global integration',async()=>{const f=await fixture(),global=path.join(f.run,'teaching/authored/word-W001.json'),old=await fs.readFile(global,'utf8');await assert.rejects(mergeRefinement(f.root,date));assert.equal(await fs.readFile(global,'utf8'),old);});
await check('post-receipt candidate edits invalidate the barrier',async()=>{const f=await fixture();await ready(f);await fs.appendFile(path.join(f.p.task('task-2'),'authored/word-W011.json'),' ');await assert.rejects(mergeRefinement(f.root,date),/输入改变/);});
await check('unrelated global edits are detected before changing any global file',async()=>{const f=await fixture();await ready(f);const first=path.join(f.run,'teaching/authored/word-W001.json'),material=path.join(f.run,'teaching/materials.json'),oldFirst=await fs.readFile(first,'utf8'),oldMaterial=await fs.readFile(material,'utf8'),last=path.join(f.run,'teaching/authored/word-W030.json');await fs.appendFile(last,' ');const edited=await fs.readFile(last,'utf8');await assert.rejects(mergeRefinement(f.root,date),/其他操作修改/);assert.equal(await fs.readFile(first,'utf8'),oldFirst);assert.equal(await fs.readFile(material,'utf8'),oldMaterial);assert.equal(await fs.readFile(last,'utf8'),edited);});
console.log(JSON.stringify({passed:checks.length,checks,scratch,realModelCalls:0,liveRequests:0,productionWrites:false,actualPublicationClaimed:false},null,2));
