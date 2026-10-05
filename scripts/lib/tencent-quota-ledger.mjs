import {mkdir,readFile,readdir,writeFile,stat} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {assess} from './speaking/tencent-soe.mjs';
const directory=new URL('../../.cache/tencent-quota-events/',import.meta.url);
export function billedTencentUnits(messages,evalMode,referenceText=''){
  if(!messages.some(m=>m.code===0&&m.final===1))return null;
  if([0,1,4].includes(evalMode))return 1;
  const packet=[...messages].reverse().find(m=>m.result);
  let result=packet?.result;try{if(typeof result==='string')result=JSON.parse(result);}catch{return null;}
  const words=result?.Words;
  const count=referenceText.trim()?referenceText.trim().split(/\s+/).length:
    Array.isArray(words)?words.map(w=>w.Word||'').join(' ').trim().split(/\s+/).filter(Boolean).length:0;
  return count>0?Math.ceil(count/20):null;
}
export async function assessTracked(config,pcm,options={}, {assessImpl=assess,eventDirectory=directory}={}){
  await mkdir(eventDirectory,{recursive:true});
  const id=randomUUID(),file=new URL(id+'.json',eventDirectory),at=new Date().toISOString();
  // Persist before sending; a interrupted process leaves an explicitly uncertain event.
  const event={id,pool:'tencent',state:'outcome_unknown',units:null,occurredAt:at};
  await writeFile(file,JSON.stringify(event),{flag:'wx'});
  const messages=await assessImpl(config,pcm,options);
  const units=billedTencentUnits(messages,options.evalMode??3,options.referenceText??'');
  if(units!==null)await writeFile(new URL(id+'-complete.json',eventDirectory),JSON.stringify({...event,state:'completed',units}),{flag:'wx'});
  return messages;
}
export async function pendingTencentUsage({eventDirectory=directory}={}){
  let names;try{names=await readdir(eventDirectory);}catch(e){if(e.code==='ENOENT')return [];throw e;}
  const events=[];
  for(const name of names.filter(n=>/^[a-f0-9-]+(?:-complete)?\.json$/.test(n))){
    const file=new URL(name,eventDirectory),event=JSON.parse(await readFile(file,'utf8'));
    try{await stat(new URL(file.href+'.reported'));}catch(e){if(e.code!=='ENOENT')throw e;events.push({...event,file});}
  }
  return events;
}
export async function markTencentUsageReported(events){
  for(const {file}of events)await writeFile(new URL(file.href+'.reported'),'reported');
}
