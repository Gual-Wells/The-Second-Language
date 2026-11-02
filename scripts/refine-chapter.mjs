import path from 'node:path';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {prepareRefinement,runRefinement,inspectRefinementTask,refinementMaterials,runRefinementAssembly} from './lib/chapter-refinement.mjs';
import {optionalJson} from './lib/daily-pipeline.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),[action,date,arg,flag,value]=process.argv.slice(2);
let result;
if(action==='prepare')result=(await prepareRefinement(root,date)).manifest;
else if(action==='run'){if(arg!=='--codex'||!flag)throw Error('run DATE --codex EXE');result=await runRefinement(root,date,flag);}
else if(['assemble','assemble-when-ready'].includes(action)){if(arg!=='--codex'||!flag)throw Error('assemble[-when-ready] DATE --codex EXE');result=await runRefinementAssembly(root,date,flag,{waitForProducers:action==='assemble-when-ready'});}
else if(action==='materials'){if(flag!=='--additional'||!value)throw Error('materials DATE task-N --additional FILE');result=await refinementMaterials(root,date,arg,value);}
else if(action==='inspect'){const r=await inspectRefinementTask(root,date,arg);result={wordIds:r.words.map(w=>w.wordId),coverage:r.coverage,alarm:r.alarm,publicationApproved:false};}
else if(action==='status'){
 const p=await prepareRefinement(root,date);result={date,revision:p.manifest.revision,deadlineAt:new Date(p.manifest.deadlineAt).toISOString(),tasks:await Promise.all(p.manifest.tasks.map(async t=>{const d=path.join(p.task(t.id),'goal');return {id:t.id,started:await optionalJson(path.join(d,'started.json')),thread:await optionalJson(path.join(d,'thread.json')),goal:await optionalJson(path.join(d,'native-goal.json')),finished:await optionalJson(path.join(d,'finished.json')),error:await optionalJson(path.join(d,'error.json'))};}))};
}else throw Error('refine-chapter.mjs prepare|run|assemble|assemble-when-ready|materials|inspect|status DATE');
console.log(JSON.stringify(result,null,2));
