import path from 'node:path';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dailyMode,createPipelinePlan,inspectPipelinePlan,prepareTaskMaterials,sealPipelineTask,pipelineBarrier,mergePipelineTasks,requestPipelineRepair} from './lib/daily-pipeline.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),[action,date,taskId,...args]=process.argv.slice(2);
let result;
if(action==='mode')result={mode:await dailyMode(root,date)};
else if(action==='plan')result={plan:(await createPipelinePlan(root,date)).planDigest};
else if(action==='status')result=await pipelineBarrier(root,date);
else if(action==='scope'){const p=await inspectPipelinePlan(root,date);result={planDigest:p.planDigest,task:p.plan.tasks.find(t=>t.taskId===taskId),directory:p.task(taskId)};}
else if(action==='materials'){let additionalFile;if(args.length){if(args.length!==2||args[0]!=='--additional')throw Error('补查参数须为--additional FILE');additionalFile=path.resolve(args[1]);}const manifest=await prepareTaskMaterials(root,date,taskId,{additionalFile});result={words:manifest.packets.length,manifest:'work/runs/'+date+'/teaching/pipeline/tasks/'+taskId+'/materials.json'};}
else if(action==='seal')result=await sealPipelineTask(root,date,taskId);
else if(action==='merge')result=await mergePipelineTasks(root,date);
else if(action==='repair'){if(!taskId||args.length)throw Error('用法：daily-pipeline.mjs repair DATE REQUEST.json');result=await requestPipelineRepair(root,date,JSON.parse(await fs.readFile(path.resolve(taskId),'utf8')));}
else throw Error('用法：daily-pipeline.mjs mode|plan|status|scope|materials|seal|merge|repair DATE [task-1至task-5]');
console.log(JSON.stringify(result,null,2));
