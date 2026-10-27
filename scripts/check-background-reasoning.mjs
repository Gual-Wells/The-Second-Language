// Exercise actual argument transport, never a real model or production queue.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {backgroundCodexArgs,BACKGROUND_REASONING_EFFORT,BACKGROUND_SUBAGENT_EFFORT} from '../protocol/background-codex.mjs';
import {qualityModelArgs,qualityModelEnvironment} from './lib/quality-model.mjs';

const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const parent=path.join(repo,'.cache/background-reasoning-checks');
await fs.mkdir(parent,{recursive:true});
const root=await fs.mkdtemp(path.join(parent,'isolated-'));
const put=async(name,text)=>{const file=path.join(root,name);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,text);return file;};
const results=[];
function overrides(args){const values={};for(let i=0;i<args.length;i++)if(args[i]==='-c'){const [key,...value]=args[++i].split('=');values[key]=value.join('=').replace(/^"|"$/g,'');}return values;}
function checkArguments(args,{model,sandbox}={}){
 const values=overrides(args);
 assert.equal(values.model_reasoning_effort,'ultra');
 assert.equal(values['agents.enabled'],'true');
 assert.equal(values['agents.default_subagent_reasoning_effort'],'max');
 assert.ok(args.some((v,i)=>v==='--enable'&&args[i+1]==='multi_agent'));
 assert.ok(!args.some((v,i)=>v==='--disable'&&args[i+1]==='multi_agent'));
 assert.equal(values['agents.default_subagent_model'],undefined,'Subagent model must keep the caller inheritance');
 if(model)assert.equal(args[args.indexOf('-m')+1],model);
 if(sandbox)assert.equal(args[args.indexOf('-s')+1],sandbox);
}
async function check(name,fn){await fn();results.push(name);}
try{
 const physical=await fs.realpath(root);
 if(process.platform==='win32')assert.match(physical,/^D:[\\/]/i);
 await check('shared background flags request ultra and allow default-max inherited-model agents',async()=>{
  assert.equal(BACKGROUND_REASONING_EFFORT,'ultra');assert.equal(BACKGROUND_SUBAGENT_EFFORT,'max');
  checkArguments(backgroundCodexArgs);
 });
 await check('quality reasoning does not reopen execution, network or private provider environment',async()=>{
  const args=[...backgroundCodexArgs,...qualityModelArgs];checkArguments(args);
  for(const feature of ['shell_tool','code_mode','code_mode_host','apps','plugins','browser_use','browser_use_external','computer_use','view_image','image_generation','workspace_dependencies','memories'])assert.ok(args.some((v,i)=>v==='--disable'&&args[i+1]===feature),feature);
  assert.equal(overrides(args).web_search,'disabled');
  const cleaned=qualityModelEnvironment({PATH:'fixture-path',CODEX_HOME:root,TEMP:root,TMP:root,SECOND_LANGUAGE_PUBLISH_TOKEN:'fixture-secret',OPENAI_API_KEY:'fixture-secret',UNRELATED_SECRET:'fixture-secret'});
  assert.equal(cleaned.PATH,'fixture-path');assert.equal(cleaned.SECOND_LANGUAGE_PUBLISH_TOKEN,undefined);assert.equal(cleaned.OPENAI_API_KEY,undefined);assert.equal(cleaned.UNRELATED_SECRET,undefined);
 });

 // Run a private copy of the actual worker against data-only dependency stubs.
 // The real two spawn sites execute; the preloaded child_process hook captures
 // their arguments and writes a self-authored result instead of starting Codex.
 for(const file of ['scripts/question-worker.mjs','scripts/lib/quality-model.mjs','protocol/background-codex.mjs'])await put(file,await fs.readFile(path.join(repo,file)));
 await put('scripts/lib/publisher-config.mjs',"export async function publisherConfig(){return {base:'https://background-fixture.invalid/',token:'fixture-token'};}\n");
 await put('scripts/lib/chapter-quality-runner.mjs',"export async function processQualityJob({runModel}){return runModel({type:'object'},'Self-authored isolated quality input.','fixture-quality');}\n");
 await put('protocol/chapter-test-contract.mjs',"export const chapterTestSchema={};export const validateChapterPaper=x=>x;\n");
 await put('protocol/chapter-test-prompt.mjs',"export const chapterTestPrompt=()=>{throw Error('Unexpected test production in argument fixture');};\n");
 await put('scripts/lib/chapter-test-speech.mjs',"export const prepareChapterQuestionAudio=()=>{throw Error('No audio permitted');};export const interpretChapterAnswers=()=>{throw Error('No speech permitted');};\n");
 const captures=path.join(root,'captures.jsonl');
 const preload=await put('capture-preload.mjs',`import {appendFileSync,writeFileSync} from 'node:fs';
import {EventEmitter} from 'node:events';
import {PassThrough,Writable} from 'node:stream';
import cp from 'node:child_process';
import {syncBuiltinESMExports} from 'node:module';
const log=value=>appendFileSync(process.env.BACKGROUND_FIXTURE_LOG,JSON.stringify(value)+'\\n');
globalThis.fetch=async(target,options)=>{
 const url=new URL(target);if(url.origin!=='https://background-fixture.invalid')throw Error('Real network forbidden');
 if(url.pathname==='/api/questions/jobs/claim')return Response.json({job:{id:'fixture-'+process.env.BACKGROUND_FIXTURE_KIND,kind:process.env.BACKGROUND_FIXTURE_KIND,attemptId:'fixture-attempt',chapter:{markdown:'Self-authored data-only chapter.',digest:'a'.repeat(64)}}});
 if(url.pathname==='/api/questions/jobs/fixture-question/complete'){log({kind:'complete',answer:JSON.parse(options.body).answer});return Response.json({ok:true});}
 throw Error('Unexpected fixture route '+url.pathname);
};
cp.spawn=(executable,args,options)=>{
 const child=new EventEmitter();child.stdout=new PassThrough();child.stderr=new PassThrough();
 if(executable===process.env.SECOND_LANGUAGE_CODEX_EXECUTABLE){
  log({kind:'model-captured',args,windowsHide:options.windowsHide,envSanitized:!!options.env&&!('SECOND_LANGUAGE_PUBLISH_TOKEN' in options.env)&&!('OPENAI_API_KEY' in options.env)});
  child.stdin=new Writable({write(chunk,encoding,done){done();},final(done){writeFileSync(args[args.indexOf('-o')+1],JSON.stringify({answer:'Self-authored isolated response.'}));done();setImmediate(()=>child.emit('close',0));}});
 }else if(executable===process.execPath&&args[0].endsWith('scripts'+(process.platform==='win32'?'\\\\':'/')+'check-balances.mjs')){log({kind:'balance-stubbed'});setImmediate(()=>child.emit('close',0));}
 else throw Error('Unexpected executable; real subprocesses are forbidden');
 return child;
};syncBuiltinESMExports();
`);
 for(const kind of ['question','chapter-quality'])await check('actual '+kind+' worker call transports reasoning without real subprocess or service',async()=>{
  await fs.writeFile(captures,'');
  const result=spawnSync(process.execPath,['--import',pathToFileURL(preload).href,path.join(root,'scripts/question-worker.mjs')],{cwd:root,encoding:'utf8',windowsHide:true,timeout:15000,env:{...process.env,BACKGROUND_FIXTURE_LOG:captures,BACKGROUND_FIXTURE_KIND:kind,SECOND_LANGUAGE_CODEX_EXECUTABLE:'never-execute-codex-fixture',SECOND_LANGUAGE_PUBLISH_TOKEN:'fixture-secret',OPENAI_API_KEY:'fixture-secret',CODEX_HOME:path.join(root,'codex-home'),TEMP:root,TMP:root}});
  assert.equal(result.status,0,result.stderr||result.stdout);
  const records=(await fs.readFile(captures,'utf8')).trim().split('\n').map(JSON.parse),calls=records.filter(x=>x.kind==='model-captured');
  assert.equal(calls.length,1);checkArguments(calls[0].args,{model:'gpt-6.1-sol',sandbox:'read-only'});assert.equal(calls[0].windowsHide,true);
  assert.equal(records.filter(x=>x.kind==='balance-stubbed').length,1);
  if(kind==='chapter-quality'){assert.equal(calls[0].envSanitized,true);for(const feature of ['shell_tool','apps','plugins'])assert.ok(calls[0].args.some((v,i)=>v==='--disable'&&calls[0].args[i+1]===feature));}
  else assert.equal(records.find(x=>x.kind==='complete')?.answer,'Self-authored isolated response.');
 });

 if(process.platform==='win32'){
  const astCapture=await put('capture-command.ps1','\uFEFF'+String.raw`param([string]$SourceFile)
$ErrorActionPreference='Stop'
[Console]::OutputEncoding=New-Object Text.UTF8Encoding($false)
$tokens=$null;$errors=$null
$ast=[System.Management.Automation.Language.Parser]::ParseFile($SourceFile,[ref]$tokens,[ref]$errors)
if($errors.Count){throw 'Launcher syntax invalid'}
$commands=@($ast.FindAll({param($node) $node -is [Management.Automation.Language.CommandAst] -and $node.CommandElements[0].Extent.Text -eq '$codexExecutable'},$true))
if($commands.Count -ne 1){throw 'Expected one Codex invocation per launcher'}
function Capture-CodexInvocation { ConvertTo-Json -InputObject @($args) -Compress }
$codexExecutable='Capture-CodexInvocation'
$projectRoot=$PSScriptRoot
$prompt='Self-authored fixture prompt, not a production task.'
Invoke-Expression $commands[0].Extent.Text
`);
  for(const name of ['daily','practice'])await check('PowerShell '+name+' actual command expression renders ultra/max while retaining model and sandbox',async()=>{
   const file=path.join(repo,'scripts/run-'+name+'.ps1'),bytes=await fs.readFile(file);
   assert.deepEqual([...bytes.subarray(0,3)],[239,187,191],'Windows PowerShell UTF-8 decoding remains explicit');
   const result=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',astCapture,'-SourceFile',file],{cwd:root,encoding:'utf8',windowsHide:true,timeout:15000,env:{...process.env,CODEX_HOME:path.join(root,'codex-home'),TEMP:root,TMP:root,WRANGLER_LOG_PATH:path.join(root,'wrangler-logs')}});
   assert.equal(result.status,0,result.stderr||result.stdout);const args=JSON.parse(result.stdout.trim());checkArguments(args,{model:'gpt-6.1-sol',sandbox:'danger-full-access'});
   assert.equal(args[args.length-1],'Self-authored fixture prompt, not a production task.');
  });
  await check('installed Codex strictly parses background config in an empty D-drive home without inference',async()=>{
   const home=path.join(root,'strict-codex-home');await fs.mkdir(home,{recursive:true});
   const resolved=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command','(Get-Command codex -ErrorAction Stop).Source'],{encoding:'utf8',windowsHide:true,timeout:10000,env:{...process.env,CODEX_HOME:home,TEMP:root,TMP:root,WRANGLER_LOG_PATH:path.join(root,'wrangler-logs')}});
   assert.equal(resolved.status,0,'An installed Codex CLI is required for this local parser check');
   const result=spawnSync(resolved.stdout.trim(),[...backgroundCodexArgs,'-c','analytics.enabled=false','app-server','--strict-config','--print-startup-config'],{cwd:root,encoding:'utf8',windowsHide:true,timeout:30000,env:{...qualityModelEnvironment(),CODEX_HOME:home,TEMP:root,TMP:root,WRANGLER_LOG_PATH:path.join(root,'wrangler-logs')}});
   assert.equal(result.status,0,result.stderr||'Strict background configuration parsing failed');
   const parsed=JSON.parse(result.stdout.trim());assert.equal(typeof parsed.appServerVersion,'string');
  });
 }
 console.log(JSON.stringify({passed:results.length,checks:results,scope:'Argument/configuration transport only; does not certify model behavior, reasoning quality or live account execution',realModelCalls:0,productionCalls:0,scheduledTasksStarted:0},null,2));
}finally{
 const physicalRoot=await fs.realpath(root),physicalParent=await fs.realpath(parent),relative=path.relative(physicalParent,physicalRoot);
 assert.ok(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative)&&(process.platform!=='win32'||/^D:[\\/]/i.test(physicalRoot)),'Only the fresh physical D-drive fixture is removed');
 await fs.rm(physicalRoot,{recursive:true,force:true});
}
