import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID,createHash} from 'node:crypto';
import {usageContextBackendFixture} from './lib/usage-context-backend-fixture.mjs';
import {prepareRefinement,inspectRefinementTask,runRefinement,REFINEMENT_ID} from './lib/chapter-refinement.mjs';
import {canonicalSourcePackage as canonical} from '../protocol/current-affairs.mjs';
const scratch=path.resolve('.cache/chapter-refinement-check',randomUUID()),date='2099-03-01',hash=s=>createHash('sha256').update(s).digest('hex'),checks=[];
const check=async(name,fn)=>{await fn();checks.push(name);};
async function fixture({rest=false,active=false,expired=false}={}){
 const root=path.join(scratch,randomUUID()),run=path.join(root,'work/runs',date),f=usageContextBackendFixture(date,'layout3',{wordCount:30,authenticWords:24,contextTag:root}),group=f.assets[0],control=group.records.find(r=>r.kind==='control'),material=JSON.parse(control.materialsManifestText),selection=control.selection;
 const write=async(file,data)=>{await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,typeof data==='string'?data:JSON.stringify(data));};
 await write(path.join(run,'control.json'),{runId:date,date,rest});await write(path.join(run,'selection.json'),selection);await write(path.join(run,'vix-source.json'),{...control.inputLock,commit:selection.vixInputCommit,authoringPolicy:'authentic-context-v1',teachingLayoutVersion:2,quickGlossVersion:1});await write(path.join(run,'vix-publication.json'),{fixtureOnly:true});await write(path.join(run,'teaching/materials.json'),material);
 for(const record of group.records.filter(r=>r.kind==='word')){await write(path.join(run,'teaching/authored/word-'+record.wordId+'.json'),record.authorText);await write(path.join(run,'teaching/materials/'+record.materialDigest+'.json'),record.materialText);}
 const stage=path.join(run,'teaching/pipeline/invocations/task-1-plan');await write(path.join(stage,'started.json'),{startedAt:new Date(Date.now()-(expired?21*3600000:0)).toISOString()});if(!active)await write(path.join(stage,'finished.json'),{code:0});
 // Authenticity readback is covered by the actual local draft and evidence
 // suites. These lifecycle fixtures deliberately do not invent read receipts.
 return {root,run,f,write};
}
await check('three ten-word revision scopes preserve exact original authors and selection',async()=>{const f=await fixture(),before=await fs.readFile(path.join(f.run,'selection.json')),p=await prepareRefinement(f.root,date);assert.deepEqual(p.manifest.tasks.map(t=>t.words.length),[10,10,10]);assert.equal(new Set(p.manifest.tasks.flatMap(t=>t.words.map(w=>w.wordId))).size,30);assert.deepEqual(await fs.readFile(path.join(f.run,'selection.json')),before);assert.equal(p.manifest.originalDailyEnginePreserved,true);assert.equal(await fs.stat(path.join(f.run,'teaching/pipeline/execution.json')).catch(e=>e.code), 'ENOENT');});
await check('recovery preserves candidate edits rather than restoring the old draft over them',async()=>{const f=await fixture(),p=await prepareRefinement(f.root,date),file=path.join(p.task('task-1'),'authored/word-W000.json');const text=await fs.readFile(file,'utf8');await fs.writeFile(file,text+'\n');await prepareRefinement(f.root,date);assert.equal(await fs.readFile(file,'utf8'),text+'\n');});
await check('active original producer stops revision before a snapshot or model',async()=>{const f=await fixture({active:true});await assert.rejects(prepareRefinement(f.root,date),/仍在途/);assert.equal(await fs.stat(path.join(f.run,'revisions',REFINEMENT_ID)).catch(e=>e.code),'ENOENT');});
await check('rest and expired original window stop all new work',async()=>{for(const opts of [{rest:true},{expired:true}]){const f=await fixture(opts);await assert.rejects(prepareRefinement(f.root,date),/休息|窗口/);assert.equal(await fs.stat(path.join(f.run,'revisions',REFINEMENT_ID)).catch(e=>e.code),'ENOENT');}});
await check('changed frozen selection cannot reuse a prepared revision',async()=>{const f=await fixture();await prepareRefinement(f.root,date);await fs.appendFile(path.join(f.run,'selection.json'),' ');await assert.rejects(prepareRefinement(f.root,date),/输入改变/);});
await check('a started revision never silently creates replacement model threads',async()=>{const f=await fixture(),p=await prepareRefinement(f.root,date);for(const t of p.manifest.tasks)await f.write(path.join(p.task(t.id),'goal/started.json'),{fixtureOnly:true});await assert.rejects(runRefinement(f.root,date,'never-execute-fixture'),/未完成/);for(const t of p.manifest.tasks)assert.equal(await fs.stat(path.join(p.task(t.id),'goal/thread.json')).catch(e=>e.code),'ENOENT');});
console.log(JSON.stringify({passed:checks.length,checks,scratch,realModelCalls:0,externalRequests:0,productionChanges:false},null,2));
