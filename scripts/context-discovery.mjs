import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {sourceAdmissionId,validateSourceAdmission} from '../protocol/source-admission.mjs';
import {immutableJson} from './lib/daily-pipeline.mjs';
import {taskSearchTargets,prepareSenseSearch,recordSenseSearch} from './lib/vix-context-discovery.mjs';
import {auditAuthenticity} from './lib/authenticity-audit.mjs';
import {authenticityAlarm} from '../protocol/fallback-appeals.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),[action,date,taskId,...args]=process.argv.slice(2);
const options={};for(let i=0;i<args.length;i+=2){if(!args[i].startsWith('--')||!args[i+1]||options[args[i]])throw Error('缺少或重复参数');options[args[i]]=args[i+1];}
let result;
if(action==='targets'){const {targets}=await taskSearchTargets(root,date,taskId);result={targets};}
else if(action==='coverage'){
  const {p}=await taskSearchTargets(root,date,taskId),scope=p.plan.tasks.find(t=>t.taskId===taskId),words=[];
  for(const w of scope.words)words.push(JSON.parse(await fs.readFile(path.join(p.task(taskId),'authored','word-'+w.wordId+'.json'),'utf8')));
  result=await auditAuthenticity(root,words);result={...result,authenticityAlarm:authenticityAlarm(result),publicationAdmission:{state:"not-reviewed",note:"比例不授予出版权限；每份教学例句均须逐例申诉获准"}};
}
else if(action==='plan')result=await prepareSenseSearch(root,date,taskId,JSON.parse(await fs.readFile(options['--intents'],'utf8')));
else if(action==='observe')result=await recordSenseSearch(root,date,taskId,{planFile:options['--plan'],queryId:options['--query'],actualResult:JSON.parse(await fs.readFile(options['--result'],'utf8')),requestedAt:options['--requested-at'],receivedAt:options['--received-at']});
else if(action==='admit'){
  const file=options['--file'];if(!file)throw Error('admit DATE task-N --file 实际发布者核验.json');
  const {p}=await taskSearchTargets(root,date,taskId),value=JSON.parse(await fs.readFile(file,'utf8'));
  value.id=sourceAdmissionId(value.home);validateSourceAdmission(value);
  const output=path.join(p.task(taskId),'discovery/admissions',value.id+'.json');await immutableJson(output,value);result={sourceId:value.id,admission:output};
}else throw Error('context-discovery.mjs targets|plan|observe|admit DATE task-N [--intents FILE | --plan FILE --query ID --result FILE --requested-at ISO --received-at ISO | --file FILE]');
console.log(JSON.stringify(result,null,2));
