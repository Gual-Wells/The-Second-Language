// Self-authored offline transport fixtures. Only the installed CLI's startup
// config parser runs; it has an empty D-drive home and receives no model input.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {EventEmitter} from 'node:events';
import {PassThrough,Writable} from 'node:stream';
import {createHash} from 'node:crypto';
import {codexDataArgs,codexDataEnvironment,runCodexData} from './lib/codex-data-runner.mjs';
const root=process.cwd(),cache=path.join(root,'.cache');await fs.mkdir(cache,{recursive:true});
const directory=await fs.mkdtemp(path.join(cache,'codex-data-retries-'));
if(process.platform==='win32')assert.match(await fs.realpath(directory),/^D:[\\/]/i);
const checks=[],captured=[];
const sha=x=>createHash('sha256').update(x).digest('hex');
function configArgs(args){const values=[];for(let i=0;i<args.length;i++)if(args[i]==='-c')values.push(args[++i]);return values;}
function assertArgs(args,model){
 const values=configArgs(args),get=key=>values.filter(s=>s.startsWith(key+'='));
 for(const key of ['request_max_retries','stream_max_retries'])assert.deepEqual(get('model_providers.second_series_codex.'+key),['model_providers.second_series_codex.'+key+'=0']);
 for(const exact of ['model_reasoning_effort="high"','model_provider="second_series_codex"','model_providers.second_series_codex.name="Second Series local fallback"','model_providers.second_series_codex.base_url="https://chatgpt.com/backend-api/codex"','model_providers.second_series_codex.wire_api="responses"','model_providers.second_series_codex.requires_openai_auth=true','model_providers.second_series_codex.supports_websockets=false','agents.enabled=false','web_search="disabled"'])assert(values.includes(exact),exact);
 assert.equal(args[args.indexOf('-m')+1],model);assert.equal(args[args.indexOf('-s')+1],'read-only');assert(args.includes('--ephemeral'));assert(args.includes('--ignore-user-config'));assert.equal(args.at(-1),'-');
}
for(const model of ['gpt-6.1-sol','gpt-6.1-terra'])assertArgs(codexDataArgs({directory,schemaFile:'fixed-schema.json',outputFile:'fixed-output.json',model}),model);
checks.push('both-supported-models-keep-complete-provider-high-and-explicit-zero-retries');
const schema={type:'object',properties:{answer:{type:'string'}},required:['answer'],additionalProperties:false};
const validate=value=>{if(typeof value?.answer!=='string'||!value.answer)throw Error('fixture invalid');return value;};
async function fixture(name,mode){
 const dir=path.join(directory,name);let calls=0;
 const request={directory:dir,identity:{project:'second-language',task:'fixture-'+name,generation:'1'},schema,instructions:'Self-authored data fixture. No inference.',input:{text:'fixed fixture'},validate,executable:'fixture-never-execute-codex',spawnImpl(_exe,args,options){
  calls++;assertArgs(args,'gpt-6.1-sol');captured.push({name,args,windowsHide:options.windowsHide});
  assert.equal(options.env.OPENAI_API_KEY,undefined);assert.equal(options.env.SECOND_LANGUAGE_PUBLISH_TOKEN,undefined);
  if(mode==='spawn-error')throw Error('offline fixture spawn failure');
  const child=new EventEmitter();child.stdout=new PassThrough();child.stderr=new PassThrough();
  child.stdin=new Writable({write(_c,_e,done){done();},final(done){done();setImmediate(async()=>{
   if(mode==='success')await fs.writeFile(args[args.indexOf('-o')+1],JSON.stringify({answer:'saved fixed result'}));
   if(mode==='malformed')await fs.writeFile(args[args.indexOf('-o')+1],'{incomplete');
   if(mode==='invalid')await fs.writeFile(args[args.indexOf('-o')+1],JSON.stringify({answer:''}));
   if(mode==='stream-interrupted'){child.stdout.write('fixture partial stream');child.stderr.write('fixture SSE interrupted before final response; no internal retry executed by this fixture');}
   child.emit('close',mode==='stream-interrupted'?1:0);
  });}});return child;
 }};
 if(mode==='success'){
  const first=await runCodexData(request),started=await fs.readFile(path.join(dir,'answer.started.json'));
  const second=await runCodexData(request);assert.equal(calls,1);assert.equal(second.reused,true);assert.deepEqual(first.value,second.value);assert.equal(first.evidence.reasoningEffort,'high');
  assert.deepEqual(await fs.readFile(path.join(dir,'answer.started.json')),started);
  await assert.rejects(runCodexData({...request,input:{text:'different fixture'}}),e=>e.inputChanged===true);assert.equal(calls,1);
 }else{
  await assert.rejects(runCodexData(request),e=>e.outcomeUnknown===true);
  const started=await fs.readFile(path.join(dir,'answer.started.json'));
  await assert.rejects(runCodexData(request),e=>e.outcomeUnknown===true);assert.equal(calls,1);
  assert.deepEqual(await fs.readFile(path.join(dir,'answer.started.json')),started);
 }
 checks.push(name);
}
await fixture('saved-success-reused-with-unchanged-identity','success');
for(const mode of ['spawn-error','stream-interrupted','no-output','malformed','invalid'])await fixture(mode+'-remains-unknown-no-second-spawn',mode);
let strictConfig={status:'not-run-platform-not-windows'};
if(process.platform==='win32'){
 const home=path.join(directory,'empty-codex-home');await fs.mkdir(home);
 const env={...codexDataEnvironment(),CODEX_HOME:home,TEMP:directory,TMP:directory,HTTP_PROXY:'http://127.0.0.1:9',HTTPS_PROXY:'http://127.0.0.1:9',ALL_PROXY:'http://127.0.0.1:9'};
 let exe=process.env.SECOND_SERIES_CODEX_EXECUTABLE||process.env.SECOND_LANGUAGE_CODEX_EXECUTABLE;
 if(!exe){const resolved=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command','(Get-Command codex -ErrorAction Stop).Source'],{encoding:'utf8',windowsHide:true,timeout:10000,env});assert.equal(resolved.status,0,'Set the installed CLI absolute path in SECOND_SERIES_CODEX_EXECUTABLE for the offline parser check. '+resolved.stderr);exe=resolved.stdout.trim();}
 assert(path.isAbsolute(exe));assert((await fs.stat(exe)).isFile());
 const args=codexDataArgs({directory,schemaFile:'fixture.json',outputFile:'fixture.json'}),overrides=[];
 for(let i=0;i<args.length;i++)if(['-c','--disable'].includes(args[i]))overrides.push(args[i],args[++i]);
 const parserArgs=[...overrides,'-c','analytics.enabled=false','app-server','--strict-config','--print-startup-config'];
 const result=spawnSync(exe,parserArgs,{cwd:directory,encoding:'utf8',windowsHide:true,timeout:30000,env});
 await fs.writeFile(path.join(directory,'strict-config.stdout.json'),result.stdout||'');await fs.writeFile(path.join(directory,'strict-config.stderr.txt'),result.stderr||'');
 assert.equal(result.status,0,result.stderr);assert.doesNotMatch(result.stderr,/unknown feature|unrecognized field/i);const parsed=JSON.parse(result.stdout);assert.equal(typeof parsed.appServerVersion,'string');
 strictConfig={status:'accepted',executable:exe,args:parserArgs,appServerVersion:parsed.appServerVersion,stdoutSha256:sha(result.stdout),stderrSha256:sha(result.stderr),emptyHome:home,noModelPrompt:true,noAuthenticationFile:true};
 checks.push('installed-cli-strict-config-accepts-zero-retries-with-complete-provider');
}
const report={schemaVersion:1,verifiedAt:new Date().toISOString(),passed:checks.length,checks,directory,captured,strictConfig,boundary:'Argument transport and installed parser validation only. No claim of observed server exactly-once execution or verified internals of an earlier reconnect.',realModelCalls:0,paidApiCalls:0,globalConfigModified:false,originalSharedModuleModified:false};
await fs.writeFile(path.join(directory,'results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:checks.length,checks,directory,strictConfigStatus:strictConfig.status,appServerVersion:strictConfig.appServerVersion,realModelCalls:0,paidApiCalls:0}));
