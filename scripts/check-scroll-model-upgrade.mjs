// Self-authored, offline transport/recovery fixtures. The executable below is a
// local recorder, never Codex or a provider; no image, award or user job is made.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {SCROLL_MODEL,isScrollModel,canonical} from '../protocol/scroll-production-contract.mjs';
import {scrollModelArgs,runScrollModel,scrollImagePrompt,sha} from './lib/scroll-model.mjs';
import {runScrollExternal} from './scroll-worker.mjs';

const repo=fileURLToPath(new URL('../',import.meta.url)),parent=path.join(repo,'.cache/check-scroll-model-upgrade');
await fs.mkdir(parent,{recursive:true});const root=await fs.mkdtemp(path.join(parent,'isolated-'));
const originalFetch=globalThis.fetch,originalExecutable=process.env.SECOND_LANGUAGE_CODEX_EXECUTABLE;
globalThis.fetch=async()=>{throw Error('Live network is disabled in scroll model upgrade QA');};
let count=0,recorderExecutions=0;const labels=[];
const oldModel={model:'gpt-6.1-sol',reasoningEffort:'xhigh'};
const jobId='self-authored-isolated-job',stage='art',name='creative',prompt='Self-authored isolated creative input.';
const oldInput={schema:'second-language.scroll-model-input.v1',jobId,stage,name,prompt,model:oldModel};
const resultFor=(model=oldModel)=>({value:{fixture:'original result'},evidence:{...model,state:'complete',runId:'fixture-run'}});
async function test(label,fn){await fn();labels.push(label);count++;console.log('PASS '+label);}
async function directory(label){const result=path.join(root,label);await fs.mkdir(result,{recursive:true});return result;}
const attention=e=>e.attention===true;
function fixtureService(){
 const assets=new Map(),calls=[],requests=[];let actionCalls=0,uploads=0,restores=0;
 const store=value=>{const digest=sha(Buffer.from(canonical(value)));assets.set(digest,structuredClone(value));return digest;};
 const add=(input,result,state='complete')=>{const inputDigest=store(input),outputDigest=result?store(result):null;calls.push({inputDigest,outputDigest,state});return{inputDigest,outputDigest};};
 const request=async(route,body)=>{
  requests.push({route,body:structuredClone(body)});
  if(route.startsWith('CONTENT:')){assert.ok(assets.has(route.slice(8)),'The immutable input must actually exist');return structuredClone(assets.get(route.slice(8)));}
  assert.equal(route,'/external');assert.equal(body.stage,stage);
  if(body.action==='status')return{calls:structuredClone(calls)};
  if(body.action==='begin'){
   const saved=calls.find(c=>c.inputDigest===body.inputDigest);
   if(saved?.state==='complete')return{reused:true,outputDigest:saved.outputDigest};
   assert.ok(!calls.some(c=>['calling','outcome_unknown'].includes(c.state)));
   calls.push({inputDigest:body.inputDigest,outputDigest:null,state:'calling'});return{state:'calling'};
  }
  const saved=calls.find(c=>c.inputDigest===body.inputDigest);assert.ok(saved);
  if(body.action==='resolve'){saved.state='complete';saved.outputDigest=body.outputDigest;return{state:'complete'};}
  if(body.action==='unknown'){saved.state='outcome_unknown';return{state:'attention'};}
  throw Error('Unrecognized fixture action');
 };
 return{assets,calls,requests,store,add,request,
  upload:async bytes=>{uploads++;const value=JSON.parse(bytes);assert.equal(sha(bytes),sha(Buffer.from(canonical(value))));return store(value);},
  restore:async digest=>{restores++;assert.ok(assets.has(digest));return structuredClone(assets.get(digest));},
  action:async()=>{actionCalls++;return resultFor(SCROLL_MODEL);},
  get actionCalls(){return actionCalls;},get uploads(){return uploads;},get restores(){return restores;},
  get begins(){return requests.filter(r=>r.body?.action==='begin').length;}
 };
}
const invoke=async(service,options={})=>runScrollExternal({jobId,directory:await directory('external-'+count),stage,name,prompt,state:{outputs:{}},request:service.request,upload:service.upload,restore:service.restore,action:service.action,...options});
function configs(args){const result={};for(let i=0;i<args.length;i++)if(args[i]==='-c'){const [key,...value]=args[++i].split('=');result[key]=value.join('=');}return result;}
function feature(args,key){let state;for(let i=0;i<args.length-1;i++)if(args[i+1]===key&&['--enable','--disable'].includes(args[i]))state=args[i]==='--enable';return state;}
async function localAttempt(dir,{model=oldModel,state='complete',value={fixture:'old local result'},input=prompt}={}){
 const text=JSON.stringify(value),evidence={...model,inputSHA:sha(input),outputSHA:sha(text),state,runId:'old-local-run'};
 await fs.writeFile(path.join(dir,name+'.json'),text);await fs.writeFile(path.join(dir,name+'.attempt.json'),JSON.stringify(evidence));return{text,evidence};
}
async function createRecorder(){
 if(process.platform==='win32'){
  let compiler;
  for(const bitness of ['Framework64','Framework']){const file=path.join(process.env.WINDIR||'C:/Windows','Microsoft.NET',bitness,'v4.0.30319/csc.exe');try{await fs.access(file);compiler=file;break;}catch{}}
  if(!compiler)throw Error('A local .NET Framework compiler is required for the no-network executable recorder');
  const source=path.join(root,'Recorder.cs'),executable=path.join(root,'Recorder.exe');
  await fs.writeFile(source,`using System; using System.IO;
class Recorder { static int Main(string[] args) {
 string folder=null,output=null; for(int i=0;i<args.Length-1;i++){ if(args[i]=="-C")folder=args[i+1]; if(args[i]=="-o")output=args[i+1]; }
 if(folder==null||output==null)return 3;
 File.WriteAllLines(Path.Combine(folder,"recorder-args.txt"),args);
 File.WriteAllText(Path.Combine(folder,"recorder-stdin.txt"),Console.In.ReadToEnd());
 File.WriteAllText(output,"{\\"fixture\\":\\"fake recorder result\\"}");
 Console.WriteLine("{\\"type\\":\\"thread.started\\",\\"thread_id\\":\\"offline-recorder-thread\\"}"); return 0;
} }`);
  const built=spawnSync(compiler,['/nologo','/target:exe','/out:'+executable,source],{encoding:'utf8',windowsHide:true,timeout:30000});
  assert.equal(built.status,0,built.stdout+'\n'+built.stderr);return executable;
 }
 const executable=path.join(root,'offline-recorder');
 await fs.writeFile(executable,`#!${process.execPath}\nimport fs from 'node:fs';\nconst a=process.argv.slice(2),dir=a[a.indexOf('-C')+1],out=a[a.indexOf('-o')+1];fs.writeFileSync(dir+'/recorder-args.txt',a.join('\\n'));let s='';for await(const b of process.stdin)s+=b;fs.writeFileSync(dir+'/recorder-stdin.txt',s);fs.writeFileSync(out,JSON.stringify({fixture:'fake recorder result'}));console.log(JSON.stringify({type:'thread.started',thread_id:'offline-recorder-thread'}));\n`);
 await fs.chmod(executable,0o755);return executable;
}

try{
 await test('new default is ultra; only original xhigh and ultra evidence is recognized',async()=>{
  assert.equal(SCROLL_MODEL.reasoningEffort,'ultra');assert.ok(isScrollModel(oldModel));assert.ok(isScrollModel(SCROLL_MODEL));
  assert.equal(isScrollModel({...oldModel,reasoningEffort:'high'}),false);assert.equal(isScrollModel({...oldModel,model:'other-model'}),false);
 });
 await test('ordinary scroll arguments use ultra with max subagents and preserve execution isolation',async()=>{
  const args=scrollModelArgs(),c=configs(args);assert.equal(c.model_reasoning_effort,'"ultra"');assert.equal(c['agents.default_subagent_reasoning_effort'],'"max"');assert.equal(c['agents.enabled'],'true');assert.equal(feature(args,'multi_agent'),true);
  assert.equal(args[args.indexOf('-m')+1],'gpt-6.1-sol');for(const f of ['shell_tool','apps','plugins','browser_use','browser_use_external','computer_use','memories','workspace_dependencies'])assert.equal(feature(args,f),false,f);
 });
 await test('one authorized image remains primary-only while its main reasoning is ultra',async()=>{
  const args=scrollModelArgs({imageGeneration:true}),c=configs(args);assert.equal(c.model_reasoning_effort,'"ultra"');assert.equal(c['agents.enabled'],'false');assert.equal(feature(args,'multi_agent'),false);assert.match(c.developer_instructions,/primary agent.*exactly once/);
 });
 const recorder=await createRecorder();process.env.SECOND_LANGUAGE_CODEX_EXECUTABLE=recorder;
 await test('actual subprocess receives ultra/max flags and records truthful completed evidence without Codex',async()=>{
  const dir=await directory('new-recorder'),result=await runScrollModel({directory:dir,name,prompt,schema:{type:'object'},timeoutMS:10000});recorderExecutions++;
  assert.deepEqual(result.value,{fixture:'fake recorder result'});assert.equal(result.evidence.reasoningEffort,'ultra');assert.equal(result.evidence.subagentReasoningEffort,'max');assert.equal(result.evidence.agentsEnabled,true);assert.equal(result.evidence.state,'complete');assert.equal(result.evidence.sessionId,'offline-recorder-thread');
  const args=(await fs.readFile(path.join(dir,'recorder-args.txt'),'utf8')).trim().split(/\r?\n/),c=configs(args);assert.equal(c.model_reasoning_effort,'"ultra"');assert.equal(c['agents.default_subagent_reasoning_effort'],'"max"');assert.equal(await fs.readFile(path.join(dir,'recorder-stdin.txt'),'utf8'),prompt);
 });
 await test('actual primary-only image invocation keeps ultra and disables delegated image submission',async()=>{
  const dir=await directory('image-recorder'),result=await runScrollModel({directory:dir,name,prompt,schema:{type:'object'},imageGeneration:true,timeoutMS:10000});recorderExecutions++;
  const args=(await fs.readFile(path.join(dir,'recorder-args.txt'),'utf8')).trim().split(/\r?\n/),c=configs(args);
  assert.equal(c.model_reasoning_effort,'"ultra"');assert.equal(c['agents.enabled'],'false');assert.equal(feature(args,'multi_agent'),false);assert.equal(feature(args,'image_generation'),true);assert.match(c.developer_instructions,/primary agent.*exactly once/);
  assert.equal(result.evidence.reasoningEffort,'ultra');assert.equal(result.evidence.agentsEnabled,false);assert.equal(result.evidence.imageGeneration,true);
 });
 process.env.SECOND_LANGUAGE_CODEX_EXECUTABLE=path.join(root,'must-never-execute-missing.exe');
 await test('complete local xhigh output is reused without rewriting original model evidence',async()=>{
  const dir=await directory('local-complete'),old=await localAttempt(dir),before=await fs.readFile(path.join(dir,name+'.attempt.json'));
  const value=await runScrollModel({directory:dir,name,prompt,schema:{type:'object'}});assert.deepEqual(value.evidence,old.evidence);assert.equal(value.evidence.reasoningEffort,'xhigh');assert.deepEqual(await fs.readFile(path.join(dir,name+'.attempt.json')),before);
 });
 await test('local unknown and tampered complete originals stop before any executable is launched',async()=>{
  for(const state of ['calling','outcome_unknown']){const dir=await directory('local-'+state);await localAttempt(dir,{state});const before=await fs.readFile(path.join(dir,name+'.attempt.json'));await assert.rejects(runScrollModel({directory:dir,name,prompt,schema:{type:'object'}}),attention);assert.deepEqual(await fs.readFile(path.join(dir,name+'.attempt.json')),before);}
  const dir=await directory('local-tampered');await localAttempt(dir);await fs.writeFile(path.join(dir,name+'.json'),'{}');await assert.rejects(runScrollModel({directory:dir,name,prompt,schema:{type:'object'}}),attention);
 });
 await test('old checkpoint xhigh input restores exactly without a new external begin or action',async()=>{
  const s=fixtureService(),bound=s.add(oldInput,resultFor()),state={outputs:{[name]:bound}};const r=await invoke(s,{state,pastStage:true});assert.equal(r.evidence.reasoningEffort,'xhigh');assert.deepEqual(state.outputs[name],bound);assert.deepEqual([s.actionCalls,s.begins,s.uploads],[0,0,0]);
 });
 await test('remote complete with lost checkpoint and local attempt reuses original xhigh output',async()=>{
  const s=fixtureService(),bound=s.add(oldInput,resultFor()),state={outputs:{}};const r=await invoke(s,{state});assert.equal(r.evidence.reasoningEffort,'xhigh');assert.deepEqual(state.outputs[name],bound);assert.deepEqual([s.actionCalls,s.begins,s.uploads],[0,0,0]);assert.equal(s.restores,1);
 });
 await test('old unresolved external outcomes cannot be bypassed by the new ultra digest',async()=>{
  for(const state of ['calling','outcome_unknown']){const s=fixtureService();s.add(oldInput,null,state);await assert.rejects(invoke(s),attention);assert.deepEqual([s.actionCalls,s.begins,s.uploads],[0,0,0]);}
 });
 await test('stored input identity and changed checkpoint prompt are verified before restoration',async()=>{
  for(const change of [{jobId:'wrong-job'},{stage:'review'},{model:{model:'other-model',reasoningEffort:'xhigh'}}]){const s=fixtureService();s.add({...oldInput,...change},resultFor());await assert.rejects(invoke(s),attention);assert.equal(s.actionCalls,0);assert.equal(s.begins,0);}
  const s=fixtureService(),bound=s.add({...oldInput,prompt:'changed original prompt'},resultFor());await assert.rejects(invoke(s,{state:{outputs:{[name]:bound}}}),attention);assert.equal(s.actionCalls,0);assert.equal(s.restores,0);
 });
 await test('a restored output must retain the effort of its original immutable input',async()=>{
  const s=fixtureService();s.add(oldInput,resultFor(SCROLL_MODEL));await assert.rejects(invoke(s),attention);assert.equal(s.actionCalls,0);assert.equal(s.begins,0);
 });
 await test('legacy retry authorization is not silently converted into an ultra submission',async()=>{
  const s=fixtureService();s.add(oldInput,null,'retry_authorized');await assert.rejects(invoke(s),attention);assert.deepEqual([s.actionCalls,s.begins,s.uploads],[0,0,0]);
 });
 await test('a genuinely new external input captures ultra and max subagents, and then reuses',async()=>{
  const s=fixtureService(),state={outputs:{}},r=await invoke(s,{state});assert.equal(r.evidence.reasoningEffort,'ultra');assert.deepEqual([s.actionCalls,s.begins],[1,1]);
  const input=s.assets.get(state.outputs[name].inputDigest);assert.deepEqual(input.model,SCROLL_MODEL);assert.deepEqual(input.execution,{subagentReasoningEffort:'max',agentsEnabled:true});
  await invoke(s,{state:{outputs:{}}});assert.deepEqual([s.actionCalls,s.begins],[1,1]);
 });
 await test('an action with an unknown outcome remains blocked on its next invocation',async()=>{
  const s=fixtureService();await assert.rejects(invoke(s,{action:async()=>{throw Error('Injected outcome uncertainty');}}),/Injected/);assert.equal(s.calls[0].state,'outcome_unknown');await assert.rejects(invoke(s),attention);assert.equal(s.actionCalls,0);assert.equal(s.begins,1);
 });
 await test('a completed local legacy image retains its wrapped prompt and original external identity',async()=>{
  const s=fixtureService(),dir=await directory('local-image'),raw='Self-authored no-image-generation fixture.',wrapped=scrollImagePrompt(raw),result=resultFor(),text=JSON.stringify(result.value),evidence={...oldModel,state:'complete',runId:'old-image-run',inputSHA:sha(wrapped),outputSHA:sha(text)};
  await fs.writeFile(path.join(dir,'material-image.attempt.json'),JSON.stringify(evidence));await fs.writeFile(path.join(dir,'material-image.json'),text);
  const state={outputs:{}},r=await invoke(s,{directory:dir,name:'material-image',prompt:raw,state,action:()=>runScrollModel({directory:dir,name:'material-image',prompt:wrapped,schema:{type:'object'}})});
  assert.equal(r.evidence.reasoningEffort,'xhigh');const input=s.assets.get(state.outputs['material-image'].inputDigest);assert.deepEqual(input.model,oldModel);assert.equal(input.execution,undefined);assert.equal(input.prompt,raw);
 });
 console.log(JSON.stringify({ok:true,cases:count,labels,recorderExecutions,realModelCalls:0,imageCalls:0,liveNetworkCalls:0,productionWrites:0}));
}finally{
 globalThis.fetch=originalFetch;if(originalExecutable===undefined)delete process.env.SECOND_LANGUAGE_CODEX_EXECUTABLE;else process.env.SECOND_LANGUAGE_CODEX_EXECUTABLE=originalExecutable;
 const realParent=await fs.realpath(parent),realRoot=await fs.realpath(root),relative=path.relative(realParent,realRoot);
 assert.ok(relative&&!relative.startsWith('..')&&!path.isAbsolute(relative)&&(process.platform!=='win32'||/^D:[\\/]/i.test(realRoot)),'Only the fresh physical D fixture may be removed');await fs.rm(realRoot,{recursive:true,force:true});
}
