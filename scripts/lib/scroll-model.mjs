import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {SCROLL_MODEL} from '../../protocol/scroll-production-contract.mjs';
import {qualityModelEnvironment} from './quality-model.mjs';
export const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const common=['-a','never','exec','--ignore-user-config','--skip-git-repo-check','--ephemeral','-m',SCROLL_MODEL.model,'-c','model_reasoning_effort="xhigh"','-c','model_provider="openai_scroll"','-c','model_providers.openai_scroll.name="OpenAI scroll craft"','-c','model_providers.openai_scroll.base_url="https://chatgpt.com/backend-api/codex"','-c','model_providers.openai_scroll.wire_api="responses"','-c','model_providers.openai_scroll.requires_openai_auth=true','-c','model_providers.openai_scroll.supports_websockets=false','--enable','code_mode_host',...['shell_tool','apps','plugins','multi_agent','browser_use','browser_use_external','computer_use','memories','workspace_dependencies'].flatMap(v=>['--disable',v]),'-c','web_search="disabled"'];
export async function runScrollModel({directory,name,prompt,schema,images=[],imageGeneration=false,timeoutMS=1200000}){
 await mkdir(directory,{recursive:true});const output=path.join(directory,name+'.json'),attemptFile=path.join(directory,name+'.attempt.json');
 let old;try{old=JSON.parse(await readFile(attemptFile,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
 if(old){if(old.inputSHA!==sha(prompt))throw Error('Changed input requires a new versioned model attempt');if(old.state==='complete'){const text=await readFile(output,'utf8');return {value:schema?JSON.parse(text):text,evidence:old};}throw Object.assign(Error('A previous model result is unknown; recover it before retrying'),{attention:true});}
 const startedAt=new Date().toISOString(),evidence={...SCROLL_MODEL,requested:{...SCROLL_MODEL},observed:{model:'not exposed by CLI response events'},runId:crypto.randomUUID(),inputSHA:sha(prompt),startedAt,state:'calling',imageGeneration,images:[]};
 for(const file of images)evidence.images.push({file:path.basename(file),sha256:sha(await readFile(file))});
 await writeFile(path.join(directory,name+'.prompt.txt'),prompt);if(schema)await writeFile(path.join(directory,name+'.schema.json'),JSON.stringify(schema));await writeFile(attemptFile,JSON.stringify(evidence,null,2));
 const tmp=path.join(directory,'tmp');await mkdir(tmp,{recursive:true});const executable=process.env.SECOND_LANGUAGE_CODEX_EXECUTABLE||'codex';
 const args=[...common,'-C',directory,'-s','workspace-write','--json',...(imageGeneration?['--enable','image_generation']:['--disable','image_generation']),...(schema?['--output-schema',path.join(directory,name+'.schema.json')]:[]),...images.flatMap(file=>['--image',file]),'-o',output,'-'];
 let events='',stderr='',timer;
 try{
  const code=await new Promise((resolve,reject)=>{const child=spawn(executable,args,{cwd:directory,windowsHide:true,stdio:['pipe','pipe','pipe'],env:{...qualityModelEnvironment(),CODEX_HOME:process.env.CODEX_HOME||'D:/CodexData',TEMP:tmp,TMP:tmp}});timer=setTimeout(()=>{child.kill();reject(Object.assign(Error('Model response outcome unknown after timeout'),{attention:true}));},timeoutMS);child.stdout.on('data',c=>events+=c);child.stderr.on('data',c=>stderr+=c);child.on('error',reject);child.on('close',resolve);child.stdin.on('error',()=>{});child.stdin.end(prompt);});
  await writeFile(path.join(directory,name+'.events.jsonl'),events);await writeFile(path.join(directory,name+'.stderr.log'),stderr);
  if(code!==0){const rejected=/invalid_json_schema/.test(events);throw Object.assign(Error('Codex scroll invocation did not complete ('+code+')'),{attention:!rejected,rejected});}
  const text=await readFile(output,'utf8'),value=schema?JSON.parse(text):text;const thread=events.split('\n').map(v=>{try{return JSON.parse(v);}catch{return null;}}).find(v=>v?.type==='thread.started');
  Object.assign(evidence,{state:'complete',finishedAt:new Date().toISOString(),outputSHA:sha(text),sessionId:thread?.thread_id||null,exitCode:code});await writeFile(attemptFile,JSON.stringify(evidence,null,2)+'\n');return {value,evidence};
 }catch(e){evidence.state=e.rejected?'rejected':'outcome_unknown';evidence.error=e.message;await writeFile(attemptFile,JSON.stringify(evidence,null,2)+'\n');if(!e.rejected)e.attention=true;throw e;}finally{clearTimeout(timer);}
}
// Subscription-backed built-in tool, never the paid Image API fallback. One
// prompt/version = one submission; interrupted outcomes cannot auto-resubmit.
export async function generateScrollImage({directory,prompt,name='material-image'}){
 const result=await runScrollModel({directory,name,imageGeneration:true,prompt:`Use the built-in image_gen tool exactly once for this authorized scroll asset. No shell/API/browser/purchase. No code or SVG substitutes. ${prompt}\nReturn the exact absolute saved PNG filesystem path as the last line. Preserve transparency when requested. Report observed model metadata only if returned.`});
 const candidates=[...result.value.matchAll(/[A-Za-z]:[\\/][^\r\n`"<>]*?\.png/g)].map(v=>v[0]);let file;
 for(const p of candidates)try{if((await stat(p)).isFile()){file=p;break;}}catch{}
 if(!file)throw Object.assign(Error('Image tool returned no recoverable PNG; inspect saved attempt, do not resubmit'),{attention:true});
 const bytes=await readFile(file);if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Image tool output is not PNG');
 const target=path.join(directory,name+'.png');await writeFile(target,bytes,{flag:'wx'}).catch(async e=>{if(e.code!=='EEXIST'||sha(await readFile(target))!==sha(bytes))throw e;});
 return {file:target,evidence:{...result.evidence,tool:'image_gen__imagegen',observedModel:'not exposed',sourceFile:path.basename(file),sha256:sha(bytes),bytes:bytes.length,width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)}};
}
