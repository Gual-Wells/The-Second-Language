import {archivalBucket} from './storage.js';
export function speakingEnvironment(env){
 if(env.SPEAKING_ASSETS)return env;
 const kv=env.PRACTICE_MEDIA,bucket={
  async put(key,value,options={}){const bytes=typeof value==='string'?new TextEncoder().encode(value):value;if((bytes.byteLength||bytes.size||0)>20*1024*1024)throw Error('私有资产超过 20 MiB');return kv.put(key,bytes,{metadata:{mime:options.httpMetadata?.contentType||'application/octet-stream'}});},
  async get(key){const value=await kv.get(key,{type:'arrayBuffer'});if(value==null)return null;return{arrayBuffer:async()=>value,text:async()=>new TextDecoder().decode(value),json:async()=>JSON.parse(new TextDecoder().decode(value))};},
  async head(key){return(await kv.get(key,{type:'arrayBuffer'}))==null?null:{key};},
 };
 return{...env,SPEAKING_ASSETS:env.ONEDRIVE_ENABLED==='true'?archivalBucket(env,bucket):bucket};
}
