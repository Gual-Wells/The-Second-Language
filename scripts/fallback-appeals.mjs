// Explicit prepare/review/verify entry. No model call during prepare or verify.
// Independent Codex review is the maintenance default; unknown attempts persist.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {loadChapterEvidence} from './lib/chapter-evidence.mjs';
import {appealFolder,appealPrompt,scopeAppealPacket,fallbackReviewPacket,loadFallbackAppeals} from './lib/fallback-appeals.mjs';
import {qualityModelArgs,qualityModelEnvironment} from './lib/quality-model.mjs';
import {FALLBACK_APPEALS_POLICY,appealBindings,validateFallbackAppeals,authenticityAlarm} from '../protocol/fallback-appeals.mjs';
import {canonicalSourcePackage as canonical} from '../protocol/current-affairs.mjs';
import {atomicJson,optionalJson,immutableJson} from './lib/daily-pipeline.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),[action,date,...argv]=process.argv.slice(2),options={};
if(!['prepare','verify','review'].includes(action)||!/^20\d{2}-\d{2}-\d{2}$/.test(date||''))throw Error('fallback-appeals.mjs prepare|verify DATE，或 review DATE --codex EXE [--contexts C1,C2]');
for(let i=0;i<argv.length;i+=2){if(!['--codex','--contexts'].includes(argv[i])||!argv[i+1]||options[argv[i]])throw Error('申诉参数无效');options[argv[i]]=argv[i+1];}
const hash=s=>createHash('sha256').update(s).digest('hex'),chapter=JSON.parse(await fs.readFile(path.join(root,'chapters',date,'chapter.json'),'utf8'));
const evidence=await loadChapterEvidence(root,date,chapter.sourcePackage,{markdown:chapter.markdown});
const {parsed,coverage,cases,packet}=await fallbackReviewPacket(chapter,evidence),directory=appealFolder(root,date,chapter.digest),requestFile=path.join(directory,'requests.json');
if(action==='prepare'){
 await fs.mkdir(directory,{recursive:true});
 const prior=await optionalJson(requestFile);
 if(!prior)await immutableJson(requestFile,{schemaVersion:1,policy:FALLBACK_APPEALS_POLICY,...appealBindings(chapter),requests:cases.map(c=>({...c,reason:'',searchConclusion:'',teachingBenefit:'',refs:[]})),records:[]});
 console.log(JSON.stringify({requestFile,caseCount:cases.length,alarm:authenticityAlarm(coverage),notice:'这是未获准的申请骨架。作者须逐例填写真实依据；prepare不产生批准或模型调用。'},null,2));
}else if(action==='verify'){
 const result=await loadFallbackAppeals(root,date,chapter,{evidence});console.log(JSON.stringify({passed:true,appealsDigest:result.digest,admission:result.admission},null,2));
}else{
 const setting=await optionalJson(path.join(root,'.cache/appeal-reviewer.json'));
 if(setting?.mode&&setting.mode!=='codex')throw Error('已明确选择其他审核方式，保留原选择，不自动启动Codex');
 if(!options['--codex'])throw Error('缺少原Codex CLI路径');
 const request=JSON.parse(await fs.readFile(requestFile,'utf8'));
 const draft={...request,reviewedAt:new Date().toISOString(),reviewer:{kind:'codex',model:'gpt-6.1-sol',effort:'high',runReference:'preflight-not-a-real-review'},decisions:request.requests.map(r=>({contextId:r.contextId,basisDigest:r.basisDigest,decision:'needs-research',reason:'Preflight only; no reviewer verdict exists yet.',refs:r.refs}))};
 await validateFallbackAppeals(draft,{chapter,parsed,evidence:{...evidence,authenticity:coverage},requireApproved:false});
 const ids=options['--contexts']?.split(',')||cases.map(c=>c.contextId),requests=request.requests.filter(r=>ids.includes(r.contextId));
 if(!ids.length||new Set(ids).size!==ids.length||requests.length!==ids.length)throw Error('审核范围重复或越界');
 const prompt=appealPrompt(scopeAppealPacket(packet,requests,request.records));
 if(prompt.length>300000)throw Error('审核资料过大；用--contexts按实际词义/词组拆小，不截断原件或一次发送整章');
 const id=hash(prompt),batch=path.join(directory,'reviews',id);await fs.mkdir(batch,{recursive:true});
 const prior=await optionalJson(path.join(batch,'review-execution.json'));
 if(await optionalJson(path.join(batch,'started.json'))&&!prior)throw Error('原独立审核结果未知，保留原件，不自动再发');
 if(prior&&prior.exitCode!==0)throw Error('原独立审核未成功；保留实际失败，不自动重试');
 const responseFile=path.join(batch,'review-response.json'),eventFile=path.join(batch,'review-events.jsonl');
 let receipt=prior;
 if(!receipt){
  // Outside the repository: no inherited author transcript or project AGENTS.
  const isolated=path.join('D:/CodexStorage/tmp/second-language-appeal-review',date,id);await fs.mkdir(isolated,{recursive:true});
  const schema={type:'object',additionalProperties:false,required:['decisions','summary'],properties:{summary:{type:'string'},decisions:{type:'array',items:{type:'object',additionalProperties:false,required:['contextId','basisDigest','decision','reason','refs'],properties:{contextId:{type:'string'},basisDigest:{type:'string'},decision:{type:'string',enum:['approved','needs-research','rejected']},reason:{type:'string'},refs:{type:'array',items:{type:'object',additionalProperties:false,required:['sourceId','quote'],properties:{sourceId:{type:'string'},quote:{type:'string'}}}}}}}}};
  const schemaFile=path.join(isolated,'schema.json'),pending=path.join(isolated,'response.json');await fs.writeFile(schemaFile,JSON.stringify(schema));
  await fs.writeFile(path.join(batch,'review-prompt.txt'),prompt,{flag:'wx'});await immutableJson(path.join(batch,'started.json'),{id,model:'gpt-6.1-sol',effort:'high',startedAt:new Date().toISOString()});
  const args=['-a','never','exec','--ignore-user-config','--skip-git-repo-check','-C',isolated,'-m','gpt-6.1-sol','-c','model_reasoning_effort="high"','--disable','multi_agent','-c','model_provider="openai_appeal"','-c','model_providers.openai_appeal.name="Independent appeal review"','-c','model_providers.openai_appeal.base_url="https://chatgpt.com/backend-api/codex"','-c','model_providers.openai_appeal.wire_api="responses"','-c','model_providers.openai_appeal.requires_openai_auth=true','-c','model_providers.openai_appeal.supports_websockets=false','-s','read-only',...qualityModelArgs,'--json','--output-schema',schemaFile,'-o',pending,'-'];
  const eventLog=await fs.open(eventFile,'wx'),errorLog=await fs.open(path.join(batch,'review-stderr.log'),'wx');let code;
  try{code=await new Promise((resolve,reject)=>{const child=spawn(options['--codex'],args,{cwd:isolated,env:qualityModelEnvironment(),windowsHide:true,stdio:['pipe',eventLog.fd,errorLog.fd]});child.on('error',reject);child.on('close',resolve);child.stdin.on('error',()=>{});child.stdin.end(prompt);});}finally{await eventLog.close();await errorLog.close();}
  if(code!==0){await immutableJson(path.join(batch,'review-execution.json'),{kind:'isolated-appeal-review-v1',exitCode:code,model:'gpt-6.1-sol',effort:'high'});throw Error('独立审核未成功，原件已保留，不自动重试');}
  const output=await fs.readFile(pending,'utf8'),events=await fs.readFile(eventFile,'utf8'),threadId=events.trim().split(/\r?\n/).map(JSON.parse).find(e=>e.type==='thread.started')?.thread_id;
  await fs.writeFile(responseFile,output,{flag:'wx'});receipt={kind:'isolated-appeal-review-v1',exitCode:code,model:'gpt-6.1-sol',effort:'high',threadId,promptDigest:hash(prompt),responseDigest:hash(output),eventsDigest:hash(events),finishedAt:new Date().toISOString()};await immutableJson(path.join(batch,'review-execution.json'),receipt);
 }
 const response=JSON.parse(await fs.readFile(responseFile,'utf8'));
 if(!Array.isArray(response.decisions)||response.decisions.length!==ids.length||new Set(response.decisions.map(d=>d.contextId)).size!==ids.length||response.decisions.some(d=>!ids.includes(d.contextId)))throw Error('独立审核返回范围不完整；保存原结果，不自动重发');
 const priorReport=await optionalJson(path.join(directory,'review.json'));
 if(priorReport&&(canonical(priorReport.requests)!==canonical(request.requests)||canonical(priorReport.records)!==canonical(request.records)))throw Error('申诉材料已改变；先保存旧审核并明确重新审核范围，不把旧批准套用新资料');
 const decisions=[...(priorReport?.decisions||[]).filter(d=>!ids.includes(d.contextId)),...response.decisions];
 const executions=[...(priorReport?.executions||[]).filter(e=>!e.contextIds.some(id=>ids.includes(id))),{id,contextIds:requests.map(r=>r.contextId)}];
 // Preserve canonical request order across independently reviewed batches.
 const ordered=request.requests.map(r=>decisions.find(d=>d.contextId===r.contextId)).filter(Boolean);
 const report={...request,decisions:ordered,executions,reviewedAt:receipt.finishedAt,reviewer:{kind:'codex',model:'gpt-6.1-sol',effort:'high',runReference:'independent-set:'+hash(canonical(executions))}};
 await fs.mkdir(path.join(directory,'review-history'),{recursive:true});if(priorReport)await immutableJson(path.join(directory,'review-history',hash(JSON.stringify(priorReport))+'.json'),priorReport);
 await atomicJson(path.join(directory,'review.json'),report);
 console.log(JSON.stringify({reviewed:ids.length,recorded:ordered.length,total:cases.length,decisions:response.decisions.map(d=>({contextId:d.contextId,decision:d.decision})),notice:'审核结果已保留。只有逐例批准和完整出版验证都通过，才能发布。'},null,2));
}
