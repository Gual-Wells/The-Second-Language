import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {mkdir,mkdtemp,readFile,writeFile,realpath,rm} from 'node:fs/promises';
import {EventEmitter} from 'node:events';
import {PassThrough,Writable} from 'node:stream';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {questionsRoute,claimQuestionJob,questionJobAction} from '../worker/src/questions.js';
import {runCloudChapterQuestions,cloudQuestionFetch} from '../worker/src/cloud-questions.js';
import {queueQuestionCodexFallback} from '../worker/src/codex-fallback.js';
import {runCodexData,codexDataArgs,codexDataEnvironment} from './lib/codex-data-runner.mjs';
async function removeFixture(parent,directory){const base=await realpath(parent),target=await realpath(directory),relative=path.relative(base,target);assert(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative));if(process.platform==='win32')assert.match(target,/^D:[\\/]/i);await rm(directory,{recursive:true,force:true});}

function fixture(){
 const sql=new DatabaseSync(':memory:');for(const name of readdirSync('worker/migrations').filter(n=>n.endsWith('.sql')).sort())sql.exec(readFileSync('worker/migrations/'+name,'utf8'));
 const DB={prepare(text){let args=[];return{bind(...values){args=values;return this;},async first(){return sql.prepare(text).get(...args)||null;},async all(){return{results:sql.prepare(text).all(...args)};},async run(){return{meta:{changes:Number(sql.prepare(text).run(...args).changes)}};}};},async batch(commands){sql.exec('BEGIN');try{const out=[];for(const c of commands)out.push(await c.run());sql.exec('COMMIT');return out;}catch(e){sql.exec('ROLLBACK');throw e;}}};
 const markdown='The original complete chapter.',digest=createHash('sha256').update(markdown).digest('hex');sql.prepare('INSERT INTO chapter_revisions(chapter_id,digest,content_key,title,number,subtitle,word_count,study_date,created_at,run_id,vix_commit,protocol_commit) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').run('chapter-1',digest,'original','固定原版','第1章','',50,'2026-10-27',0,'fixture','a'.repeat(40),'b'.repeat(40));sql.prepare('INSERT INTO chapter_sources VALUES(?,?,?,?,?)').run(digest,'e'.repeat(64),'source-package','current-affairs-v1',0);sql.prepare('INSERT INTO published_chapters VALUES(?,?,?,?)').run('chapter-1','2026-10-27',digest,0);
 const env={DB,API_QUESTIONS_ENABLED:'true',API_CLOUD_ENABLED:'true',CODEX_FALLBACK_ENABLED:'true',CHAPTERS:{async get(){return markdown;}},SECOND_SERIES_OPENAI_KEY:{async get(){return'sk-fixture';}}};
 async function request(route,body,context={session:true,sameOrigin:true}){const r=await questionsRoute(new Request('https://fixture.invalid/api/questions'+route,{method:body?'POST':'GET',...(body?{body:JSON.stringify(body)}:{})}),env,context);return{status:r.status,data:await r.json()};}
 async function enqueue(){const id=crypto.randomUUID();assert.equal((await request('',{id,chapterId:'chapter-1',digest,question:'解释原句'})).status,201);return id;}
 return{sql,env,request,enqueue,job:id=>sql.prepare('SELECT * FROM chapter_question_jobs WHERE id=?').get(id),markdown};
}
const completed=value=>new Response('data: '+JSON.stringify({type:'response.completed',response:{id:'resp_fallback',status:'completed',usage:{input_tokens:12,output_tokens:8},output:[{type:'message',role:'assistant',content:[{type:'output_text',text:JSON.stringify(value)}]}]}})+'\n\n',{headers:{'content-type':'text/event-stream'}});

test('definite ChatGPT API failure queues original context for local Codex immediately and never sends the API again',async()=>{
 const f=fixture();try{const id=await f.enqueue();let calls=0;const options={fetchImpl:async()=>{calls++;return Response.json({error:{code:'fixture'}},{status:429});}};assert.equal((await runCloudChapterQuestions(f.env,options)).fallbackQueued,true);const row=f.job(id);assert.equal(row.execution_route,'legacy');assert.equal(row.status,'pending');assert.equal(row.claim,null);assert.equal(JSON.parse(row.codex_fallback_json).apiOutcomeUnknown,false);assert.equal(f.sql.prepare('SELECT outcome FROM api_cloud_runs').get().outcome,'rejected');await runCloudChapterQuestions(f.env,options);assert.equal(calls,1);
  const status=await f.request('/jobs/fallback-status',null,{isPublisher:true});assert.deepEqual(status.data,{pending:true,pendingCount:1,activeCount:0});assert.equal((await f.request('/jobs/claim',{claim:'0'.repeat(64),questionsOnly:true},{isPublisher:true})).data.job,null,'Disabled old API worker must never claim a Codex fallback even if started manually');const claim='a'.repeat(64),local=await f.request('/jobs/claim',{claim,codexFallbackOnly:true},{isPublisher:true});assert.equal(local.data.job.id,id);assert.equal(local.data.job.chapter.markdown,f.markdown);assert.equal(local.data.job.codexFallback.apiAttempt,'1');await questionJobAction(f.env,{id,claim,action:'complete',answer:'本机已按原章回答'});assert.equal(f.job(id).status,'answered');assert.equal((await f.request('/jobs/fallback-status',null,{isPublisher:true})).data.pending,false);
 }finally{f.sql.close();}
});

test('unknown API remains unknown while a distinct local claim completes one reply and blocks late cloud writes',async()=>{
 const f=fixture();try{const id=await f.enqueue(),oldClaim='b'.repeat(64);await claimQuestionJob(f.env,{claim:oldClaim,executionRoute:'cloud-v1'});await questionJobAction(f.env,{id,claim:oldClaim,action:'fail',outcomeUnknown:true});f.sql.prepare("INSERT INTO api_cloud_runs(project,task,attempt,request_digest,model,outcome,started_at) VALUES('second-language',?,'1','x','gpt-6.1-sol','unknown',?)").run(id,Date.now());assert.equal(await queueQuestionCodexFallback(f.env,{id,apiAttempt:1,apiOutcomeUnknown:true,reason:'api-unknown'}),true);const claim='c'.repeat(64);await f.request('/jobs/claim',{claim,codexFallbackOnly:true},{isPublisher:true});await assert.rejects(questionJobAction(f.env,{id,claim:oldClaim,action:'complete',answer:'迟到API答复'}),/失效/);await questionJobAction(f.env,{id,claim,action:'complete',answer:'独立Codex答复'});await questionJobAction(f.env,{id,claim:oldClaim,action:'complete',answer:'迟到API答复'});assert.equal(f.sql.prepare("SELECT count(*) n FROM chapter_messages WHERE role='assistant'").get().n,1);assert.equal(f.sql.prepare("SELECT content FROM chapter_messages WHERE role='assistant'").get().content,'独立Codex答复');assert.equal(f.sql.prepare('SELECT outcome FROM api_cloud_runs').get().outcome,'unknown');
 }finally{f.sql.close();}
});

test('complete API replies recover their existing business commit instead of launching a second model',async()=>{
 const f=fixture();try{const id=await f.enqueue();f.sql.exec("CREATE TRIGGER fail_reply BEFORE INSERT ON chapter_messages WHEN NEW.role='assistant' BEGIN SELECT RAISE(ABORT,'fixture'); END;");let calls=0;const options={fetchImpl:async()=>{calls++;return completed({answer:'原API有效答案'});}};assert.equal((await runCloudChapterQuestions(f.env,options)).outcomeUnknown,true);assert.equal(f.job(id).execution_route,'cloud-v1');assert.equal(f.job(id).codex_fallback_json,null);f.sql.exec('DROP TRIGGER fail_reply');assert.equal((await runCloudChapterQuestions(f.env,options)).reused,true);assert.equal(calls,1);assert.equal(f.job(id).status,'answered');
 }finally{f.sql.close();}
});

test('invalid API answer and missing configuration can hand off without falsifying a successful API answer',async()=>{
 for(const mode of ['invalid','missing']){const f=fixture();try{const id=await f.enqueue();if(mode==='missing')delete f.env.SECOND_SERIES_OPENAI_KEY;const result=await runCloudChapterQuestions(f.env,{fetchImpl:async()=>completed({wrong:'no answer'})});assert.equal(result.fallbackQueued,true);assert.equal(f.job(id).execution_route,'legacy');const meta=JSON.parse(f.job(id).codex_fallback_json);assert.equal(meta.reason,mode==='missing'?'configuration-missing':'api-result-invalid');assert.equal(meta.apiOutcomeUnknown,false);}finally{f.sql.close();}}
});

test('fallback status and claim retain publisher authentication, isolate ordinary questions and preserve local retry routing',async()=>{
 const f=fixture();try{assert.equal((await f.request('/jobs/fallback-status',null,{session:null})).status,401);assert.equal((await f.request('/jobs/fallback-status',null,{session:true})).status,403);const id=await f.enqueue();assert.equal((await f.request('/jobs/claim',{claim:'d'.repeat(64),codexFallbackOnly:true},{isPublisher:true})).data.job,null);await runCloudChapterQuestions(f.env,{fetchImpl:async()=>Response.json({error:{}},{status:400})});const claim='e'.repeat(64);await f.request('/jobs/claim',{claim,codexFallbackOnly:true},{isPublisher:true});await questionJobAction(f.env,{id,claim,action:'fail'});assert.equal((await f.request('/'+id+'/retry',{})).status,200);assert.equal(f.job(id).execution_route,'legacy');assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM api_cloud_runs').get().n,1);
 }finally{f.sql.close();}
});

test('header deadline stops a missing connection but is cancelled before a long streamed body',async()=>{
 const stopped=cloudQuestionFetch(async(_url,{signal})=>new Promise((_,reject)=>{signal.addEventListener('abort',()=>reject(Error('stopped')),{once:true});}),10);await assert.rejects(stopped('https://fixture.invalid'),/stopped/);
 let signal;const body=cloudQuestionFetch(async(_url,options)=>{signal=options.signal;return new Response('long response');},10);const response=await body('https://fixture.invalid');await new Promise(resolve=>setTimeout(resolve,25));assert.equal(signal.aborted,false);assert.equal(await response.text(),'long response');
});

test('shared Codex runner binds fixed identity and images, uses high and no connected tools, and reuses one successful original',async()=>{
 const parent=path.resolve('.cache/codex-data-runner-tests');await mkdir(parent,{recursive:true});const directory=await mkdtemp(path.join(parent,'run-'));try{
  const image=path.join(directory,'fixture.png');await writeFile(image,Buffer.from('self-authored native-image fixture'));let calls=0,captured;
  const spawnImpl=(_exe,args,options)=>{calls++;captured={args,options};const child=new EventEmitter();child.stdout=new PassThrough();child.stderr=new PassThrough();child.stdin=new Writable({write(_chunk,_enc,done){done();},final(done){writeFile(args[args.indexOf('-o')+1],JSON.stringify({answer:'本机合成结果',ignored:'discard'})).then(()=>{done();setImmediate(()=>child.emit('close',0));});}});return child;};
  const request={directory,identity:{project:'fixture',task:'task-one',generation:'1',owner:'isolated'},instructions:'Only interpret the fixed data.',input:{chapter:'Self-authored chapter.'},schema:{type:'object',properties:{answer:{type:'string'}},required:['answer'],additionalProperties:false},model:'gpt-6.1-terra',images:[image],executable:'never-run-real-codex',spawnImpl,validate:value=>({answer:value.answer})};
  const first=await runCodexData(request),again=await runCodexData(request);assert.equal(calls,1);assert.equal(first.reused,false);assert.equal(again.reused,true);assert.deepEqual(again.value,{answer:'本机合成结果'});assert.equal(first.evidence.reasoningEffort,'high');assert.equal(first.evidence.model,'gpt-6.1-terra');assert.equal(captured.options.windowsHide,true);assert.equal(captured.options.env.OPENAI_API_KEY,undefined);assert.equal(captured.options.env.SECOND_LANGUAGE_PUBLISH_TOKEN,undefined);assert(captured.args.includes('--ephemeral'));assert(captured.args.includes('--output-schema'));assert.equal(captured.args[captured.args.indexOf('-i')+1],await realpath(image));assert(captured.args.includes('model_reasoning_effort="high"'));assert(captured.args.includes('project_doc_max_bytes=0'));assert(captured.args.includes('agents.enabled=false'));assert.equal(captured.args[captured.args.indexOf('-s')+1],'read-only');
  await assert.rejects(runCodexData({...request,input:{chapter:'Different chapter.'}}),e=>e.inputChanged===true);
 }finally{await removeFixture(parent,directory);}
});

test('unknown local execution is never blindly repeated and provider/publisher credentials do not enter child environment',async()=>{
 const parent=path.resolve('.cache/codex-data-runner-tests');await mkdir(parent,{recursive:true});const directory=await mkdtemp(path.join(parent,'unknown-'));try{let calls=0;const request={directory,identity:{project:'fixture',task:'task-two',generation:'1'},schema:{type:'object'},instructions:'data only',input:{},executable:'never-run-real-codex',spawnImpl(){calls++;throw Error('fixture unknown');}};await assert.rejects(runCodexData(request),e=>e.outcomeUnknown===true);await assert.rejects(runCodexData(request),e=>e.outcomeUnknown===true);assert.equal(calls,1);const env=codexDataEnvironment({PATH:'fixture',CODEX_HOME:directory,OPENAI_API_KEY:'secret',SECOND_LANGUAGE_PUBLISH_TOKEN:'secret',UNRELATED_SECRET:'secret'});assert.equal(env.OPENAI_API_KEY,undefined);assert.equal(env.SECOND_LANGUAGE_PUBLISH_TOKEN,undefined);assert.equal(env.UNRELATED_SECRET,undefined);}finally{await removeFixture(parent,directory);}
});

test('an explicit lost claim aborts only its own local child and never makes another attempt',async()=>{
 const parent=path.resolve('.cache/codex-data-runner-tests');await mkdir(parent,{recursive:true});const directory=await mkdtemp(path.join(parent,'abort-'));try{
  let calls=0;const controller=new AbortController(),request={directory,identity:{project:'fixture',task:'task-aborted',generation:'1'},schema:{type:'object'},instructions:'fixed data',input:{},executable:'never-run-real-codex',signal:controller.signal,spawnImpl(_exe,_args,options){calls++;assert.equal(options.signal,controller.signal);const child=new EventEmitter();child.stdout=new PassThrough();child.stderr=new PassThrough();child.stdin=new Writable({write(_chunk,_encoding,done){done();},final(done){done();setImmediate(()=>controller.abort());}});options.signal.addEventListener('abort',()=>child.emit('error',Object.assign(Error('own process cancelled'),{name:'AbortError'})),{once:true});return child;}};
  await assert.rejects(runCodexData(request),e=>e.claimLost===true&&e.outcomeUnknown===true);assert.equal(calls,1);await assert.rejects(runCodexData(request),e=>e.claimLost===true);assert.equal(calls,1);assert.equal(JSON.parse(await readFile(path.join(directory,'answer.started.json'),'utf8')).identity.task,'task-aborted');
 }finally{await removeFixture(parent,directory);}
});

test('installed CLI strictly accepts the exact data-only feature flags without creating a model response',()=>{
 if(process.platform!=='win32')return;const resolved=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command','(Get-Command codex -ErrorAction Stop).Source'],{encoding:'utf8',windowsHide:true});assert.equal(resolved.status,0);const args=codexDataArgs({directory:process.cwd(),schemaFile:'fixture.json',outputFile:'fixture.json'}),overrides=[];for(let i=0;i<args.length;i++)if(['-c','--disable'].includes(args[i]))overrides.push(args[i],args[++i]);const result=spawnSync(resolved.stdout.trim(),[...overrides,'app-server','--strict-config','--print-startup-config'],{encoding:'utf8',windowsHide:true,timeout:30000,env:codexDataEnvironment()});assert.equal(result.status,0,result.stderr);assert.doesNotMatch(result.stderr,/unknown feature|unrecognized field/i);assert.equal(typeof JSON.parse(result.stdout).appServerVersion,'string');
});
