// One bounded isolated reviewer call. The host never retries a failed/unknown
// attempt, replaces its thread or trusts an author-written approval flag.
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {qualityModelArgs,qualityModelEnvironment} from './quality-model.mjs';
import {immutableJson,optionalJson} from './daily-pipeline.mjs';
import {canonicalSourcePackage as canonical} from '../../protocol/current-affairs.mjs';
export const appealReviewSchema={type:'object',additionalProperties:false,required:['decisions','summary'],properties:{summary:{type:'string'},decisions:{type:'array',items:{type:'object',additionalProperties:false,required:['contextId','basisDigest','decision','reason','refs'],properties:{contextId:{type:'string'},basisDigest:{type:'string'},decision:{type:'string',enum:['approved','needs-research','rejected']},reason:{type:'string'},refs:{type:'array',items:{type:'object',additionalProperties:false,required:['sourceId','quote'],properties:{sourceId:{type:'string'},quote:{type:'string'}}}}}}}}};
const hash=s=>createHash('sha256').update(s).digest('hex');
export async function executeAppealReview({directory,prompt,date,executable,spawnImpl=spawn,env=process.env}){
 if(typeof prompt!=='string'||!prompt.trim()||prompt.length>300000)throw Error('审核资料缺失或过大；按实际词义拆小，不截断实际原件');
 if(typeof executable!=='string'||!executable.trim()||!/^20\d{2}-\d{2}-\d{2}$/.test(date))throw Error('独立审核执行参数无效');
 await fs.mkdir(directory,{recursive:true});directory=await fs.realpath(directory);if(process.platform==='win32'&&!/^D:[\\/]/i.test(directory))throw Error('独立审核原件须实际存D盘');
 const prior=await optionalJson(path.join(directory,'review-execution.json'));
 if(await optionalJson(path.join(directory,'started.json'))&&!prior)throw Error('原独立审核结果未知，保留原件，不自动再发');
 if(prior&&prior.exitCode!==0)throw Error('原独立审核未成功，保留失败，不自动重试');
 const responseFile=path.join(directory,'review-response.json'),eventFile=path.join(directory,'review-events.jsonl');let receipt=prior;
 if(!receipt){
  const id=hash(prompt),isolated=path.join('D:/CodexStorage/tmp/second-language-appeal-review',date,id);await fs.mkdir(isolated,{recursive:true});
  const schemaFile=path.join(isolated,'schema.json'),pending=path.join(isolated,'response.json');await fs.writeFile(schemaFile,JSON.stringify(appealReviewSchema));
  await fs.writeFile(path.join(directory,'review-prompt.txt'),prompt,{flag:'wx'});await immutableJson(path.join(directory,'started.json'),{id,model:'gpt-6.1-sol',effort:'high',startedAt:new Date().toISOString()});
  const args=['-a','never','exec','--ignore-user-config','--skip-git-repo-check','-C',isolated,'-m','gpt-6.1-sol','-c','model_reasoning_effort="high"','--disable','multi_agent','-c','model_provider="openai_appeal"','-c','model_providers.openai_appeal.name="Independent appeal review"','-c','model_providers.openai_appeal.base_url="https://chatgpt.com/backend-api/codex"','-c','model_providers.openai_appeal.wire_api="responses"','-c','model_providers.openai_appeal.requires_openai_auth=true','-c','model_providers.openai_appeal.supports_websockets=false','-s','read-only',...qualityModelArgs,'--json','--output-schema',schemaFile,'-o',pending,'-'];
  const eventLog=await fs.open(eventFile,'wx'),errorLog=await fs.open(path.join(directory,'review-stderr.log'),'wx');let code;
  try{code=await new Promise((resolve,reject)=>{const child=spawnImpl(executable,args,{cwd:isolated,env:qualityModelEnvironment(env),windowsHide:true,stdio:['pipe',eventLog.fd,errorLog.fd]});child.on('error',reject);child.on('close',resolve);child.stdin.on('error',()=>{});child.stdin.end(prompt);});}finally{await eventLog.close();await errorLog.close();}
  if(code!==0){await immutableJson(path.join(directory,'review-execution.json'),{kind:'isolated-appeal-review-v1',exitCode:code,model:'gpt-6.1-sol',effort:'high'});throw Error('独立审核未成功，原件已保留，不自动重试');}
  const output=await fs.readFile(pending,'utf8'),events=await fs.readFile(eventFile,'utf8'),messages=events.trim().split(/\r?\n/).map(JSON.parse),threadId=messages.find(e=>e.type==='thread.started')?.thread_id;
  await fs.writeFile(responseFile,output,{flag:'wx'});
  const final=messages.filter(e=>e.type==='item.completed'&&e.item?.type==='agent_message').at(-1)?.item?.text;
  if(!threadId||!messages.some(e=>e.type==='turn.completed')||messages.some(e=>['error','turn.failed'].includes(e.type))||!final||canonical(JSON.parse(final))!==canonical(JSON.parse(output)))throw Error('独立审核真实输出或完成事件不一致，原件保留，不重发');
  receipt={kind:'isolated-appeal-review-v1',exitCode:code,model:'gpt-6.1-sol',effort:'high',threadId,promptDigest:hash(prompt),responseDigest:hash(output),eventsDigest:hash(events),finishedAt:new Date().toISOString()};await immutableJson(path.join(directory,'review-execution.json'),receipt);
 }
 const output=await fs.readFile(responseFile,'utf8'),events=await fs.readFile(eventFile,'utf8');
 if(receipt.promptDigest!==hash(prompt)||receipt.responseDigest!==hash(output)||receipt.eventsDigest!==hash(events)||await fs.readFile(path.join(directory,'review-prompt.txt'),'utf8')!==prompt)throw Error('原独立审核输入或输出摘要已改变，不使用旧回执');
 return {receipt,response:JSON.parse(output),directory,reused:!!prior};
}
