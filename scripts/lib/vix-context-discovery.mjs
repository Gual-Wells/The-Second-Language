// The model supplies sense-aware queries; this layer binds and transports them.
// No relevance scoring, word reselection, search simulation or corpus scraping.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {canonicalSourcePackage as canonical} from '../../protocol/current-affairs.mjs';
import {parseTeachingHeading} from '../../web/teaching-units.js';
import {compileDiscoveryRequest,saveDiscoveryObservation} from './source-discovery.mjs';
import {inspectPipelinePlan,immutableJson} from './daily-pipeline.mjs';
import {readTeachingMaterials} from './teaching-authoring.mjs';
const hash=x=>createHash('sha256').update(x).digest('hex');
const json=file=>fs.readFile(file,'utf8').then(JSON.parse);
const norm=x=>x.normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');
export function senseTargets(words){
  const targets=[];
  for(const w of words){
    for(const m of w.partOne.matchAll(/^<!-- USE:([^ ]+) -->\r?\n([^]*?)(?=^<!-- USE:|$(?![^]))/gm)){
      const heading=/^## ([^\r\n]+)/m.exec(m[2])?.[1],parsed=heading&&parseTeachingHeading(heading);
      if(!parsed?.modern)throw Error('先按正式格式写完整词义骨架，再规划定向检索');
      targets.push({wordId:w.wordId,word:w.text,useId:m[1],forms:parsed.forms.map(f=>f.word),heading,targetDigest:hash(m[2].trim()),materialDigest:w.materialDigest});
    }
  }
  if(!targets.length||new Set(targets.map(t=>t.useId)).size!==targets.length)throw Error('检索范围缺少真正教学用法或身份重复');
  return targets;
}
export function compileSenseSearch({targets,intents,channels}){
  if(channels?.policy!=='vix-sense-discovery-v1'||!Array.isArray(intents)||!intents.length)throw Error('需真实用法和作者具体检索意图');
  const seen=new Set(),requests=[];
  for(const intent of intents){
    const target=targets.find(t=>t.useId===intent.useId),route=channels.channels.find(c=>c.id===intent.channelId);
    if(!target||!route||typeof intent.situation!=='string'||!intent.situation.trim()||typeof intent.senseConstraint!=='string'||!intent.senseConstraint.trim())throw Error('检索须绑定本任务VIX用法、真实场合及义项限制');
    const request=compileDiscoveryRequest({queries:intent.queries,responseLength:'long'});
    const searchForms=intent.searchForms||target.forms;
    if(!Array.isArray(searchForms)||!searchForms.length||searchForms.some(f=>typeof f!=='string'||!f.trim())||intent.searchForms&&(typeof intent.formBasis!=='string'||!intent.formBasis.trim()))throw Error('显式检索变体须保实际词形/构式依据，不用同主题词替代目标义');
    for(const query of request.search_query)if(!searchForms.some(form=>norm(query.q).includes(norm(form))))throw Error('定向查询须携带实际目标词或表达，不只搜主题');
    const value={useId:target.useId,target,searchForms,...(intent.formBasis?{formBasis:intent.formBasis}:{}),channelId:route.id,situation:intent.situation,senseConstraint:intent.senseConstraint,request};
    const id='Q'+hash(canonical(value)).slice(0,20);if(seen.has(id))throw Error('重复检索请求');seen.add(id);requests.push({id,...value});
  }
  return requests;
}
export async function taskSearchTargets(root,date,taskId){
  const p=await inspectPipelinePlan(root,date),scope=p.plan.tasks.find(t=>t.taskId===taskId);if(!scope)throw Error('未知任务');
  const {packets}=await readTeachingMaterials(p.root,date,p.selection,{wordTexts:scope.words.map(w=>w.text),manifestFile:path.join(p.task(taskId),'materials.json')});
  const words=[];for(const w of scope.words){const authored=await json(path.join(p.task(taskId),'authored','word-'+w.wordId+'.json'));if(authored.wordId!==w.wordId||authored.text!==w.text||authored.materialDigest!==packets.find(p=>p.word===w.text)?.materialDigest)throw Error('不能替别组、未冻结词或旧教材身份建立检索');words.push(authored);}
  return {p,targets:senseTargets(words)};
}
export async function prepareSenseSearch(root,date,taskId,intents){
  const {p,targets}=await taskSearchTargets(root,date,taskId),channels=await json(path.join(root,'resources/current-affairs/context-channels.json'));
  const requests=compileSenseSearch({targets,intents,channels});
  const plan={schemaVersion:1,policy:'vix-sense-discovery-v1',studyDate:date,taskId,productionPlanDigest:p.planDigest,vixInputCommit:p.selection.vixInputCommit,selectionDigest:hash(canonical(p.selection)),channelsDigest:hash(canonical(channels)),requests};
  const planDigest=hash(canonical(plan)),file=path.join(p.task(taskId),'discovery/plans',planDigest+'.json');await immutableJson(file,plan);
  return {file,planDigest,requests,notice:'These are unexecuted requests. Submit the exact request to the real live search tool and retain its actual result.'};
}
export async function recordSenseSearch(root,date,taskId,{planFile,queryId,actualResult,requestedAt,receivedAt}){
  const {p,targets}=await taskSearchTargets(root,date,taskId),plan=await json(planFile),query=plan.requests?.find(q=>q.id===queryId);
  const expected=path.join(p.task(taskId),'discovery/plans',hash(canonical(plan))+'.json');
  if(await fs.realpath(planFile)!==await fs.realpath(expected))throw Error('查询计划路径或不可变摘要不符');
  if(plan.productionPlanDigest!==p.planDigest||plan.studyDate!==date||plan.taskId!==taskId||!query||!targets.some(t=>t.useId===query.useId&&t.targetDigest===query.target.targetDigest&&t.materialDigest===query.target.materialDigest))throw Error('查询不属于当前冻结词义或计划已失效；先核实际变动，不补造旧检索');
  const file=await saveDiscoveryObservation(path.join(p.task(taskId),'discovery/observations'),{actualRequest:query.request,actualResult,requestedAt,receivedAt,scope:query.useId+' '+query.target.heading+' / '+query.channelId});
  const link={policy:plan.policy,productionPlanDigest:p.planDigest,queryId,useId:query.useId,target:query.target,planDigest:hash(canonical(plan)),observation:file};
  const record=path.join(p.task(taskId),'discovery/links',hash(canonical(link))+'.json');await immutableJson(record,link);return {record,observation:file};
}
