import {checkOpenRouterFunds} from '../../scripts/lib/speaking/funding.mjs';
import {ttsModel,synthesisVoice,voicePolicyVersion} from '../../protocol/voices.mjs';
export const sha256=async value=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',typeof value==='string'?new TextEncoder().encode(value):value))].map(x=>x.toString(16).padStart(2,'0')).join('');
const idOK=x=>typeof x==='string'&&/^[A-Za-z0-9._:-]{1,110}$/.test(x);
const json=(v,s=200)=>Response.json(v,{status:s,headers:{'cache-control':'no-store'}});
export async function mediaBytes(env,key){
 if(env.PRACTICE_R2){const o=await env.PRACTICE_R2.get(key);return o?o.arrayBuffer():null;}
 return env.PRACTICE_MEDIA.get(key,{type:'arrayBuffer'});
}
async function store(env,key,bytes,mime){
 if(env.PRACTICE_R2)return env.PRACTICE_R2.put(key,bytes,{httpMetadata:{contentType:mime}});
 return env.PRACTICE_MEDIA.put(key,bytes,{metadata:{mime}});
}
export async function mediaRoute(request,env,{isPublisher,isReader,session}){
 const path=new URL(request.url).pathname,db=env.PRACTICE_DB;
 const read=path.match(/^\/api\/practice\/media\/([A-Za-z0-9._:-]+)$/);
 if(read&&['GET','HEAD'].includes(request.method)){
  const row=await db.prepare('SELECT m.* FROM practice_media m WHERE m.id=? AND m.state=\'ready\'').bind(read[1]).first();
  if(!row)return json({error:'音频未准备好'},404);
  const published=await db.prepare('SELECT 1 FROM practice_sets WHERE id=?').bind(row.set_id).first();
  if(!isPublisher&&!published)return json({error:'音频尚未发布'},404);
  const bytes=await mediaBytes(env,row.object_key);if(!bytes)return json({error:'音频暂不可用，请稍后重试'},503);
  const n=bytes.byteLength,headers={'content-type':row.mime,'cache-control':'private, no-store','accept-ranges':'bytes','x-content-type-options':'nosniff'};
  const range=request.headers.get('range');if(range){
   const m=range.match(/^bytes=(\d*)-(\d*)$/);if(!m||(!m[1]&&!m[2]))return new Response(null,{status:416,headers:{'content-range':`bytes */${n}`}});
   const start=m[1]?Number(m[1]):Math.max(0,n-Number(m[2])),end=m[1]?(m[2]?Math.min(n-1,Number(m[2])):n-1):n-1;
   if(start>=n||start>end)return new Response(null,{status:416,headers:{'content-range':`bytes */${n}`}});
   return new Response(request.method==='HEAD'?null:bytes.slice(start,end+1),{status:206,headers:{...headers,'content-range':`bytes ${start}-${end}/${n}`,'content-length':String(end-start+1)}});
  }
  return new Response(request.method==='HEAD'?null:bytes,{headers:{...headers,'content-length':String(n)}});
 }
 if(!path.startsWith('/api/practice/publisher/media/'))return null;
 if(!isPublisher)return json({error:'发布身份无效'},401);
 if(!env.PRACTICE_MEDIA&&!env.PRACTICE_R2)return json({error:'私有音频存储未配置'},503);
 if(path.endsWith('/synthesize')&&request.method==='POST'){
  const b=await request.json();if(!idOK(b.id)||!idOK(b.setId)||typeof b.text!=='string'||!b.text.trim()||b.text.length>8000)return json({error:'声音片段需有固定编号、练习册及 1–8000 字符文本'},400);
  const model=ttsModel,purpose=b.purpose||'speaking';let voice;
  try{voice=synthesisVoice(purpose,b.voice);}catch(e){return json({error:e.message},400);}
  if(purpose==='listening'){
   if(!idOK(b.speakerId)||!['female','male'].includes(b.gender)||voice[1]!==b.gender[0])return json({error:'听力片段须带稳定人物编号及正确性别'},400);
   await db.prepare('INSERT OR IGNORE INTO practice_voice_roles(set_id,speaker_id,gender,voice,policy_version) VALUES(?,?,?,?,?)').bind(b.setId,b.speakerId,b.gender,voice,voicePolicyVersion).run();
   const fixed=await db.prepare('SELECT * FROM practice_voice_roles WHERE set_id=? AND speaker_id=?').bind(b.setId,b.speakerId).first();
   if(fixed.voice!==voice||fixed.gender!==b.gender)return json({error:'同一人物的声音已固定，请继续使用原音色'},409);
  }
  const descriptor={model,voice,text:b.text,purpose,format:'mp3',voicePolicyVersion,...(purpose==='listening'?{speakerId:b.speakerId,gender:b.gender}:{})},digest=await sha256(JSON.stringify(descriptor));
  const old=await db.prepare('SELECT * FROM practice_media WHERE id=?').bind(b.id).first();
  if(old&&(old.digest!==digest||old.set_id!==b.setId))return json({error:'该编号已对应不同声音内容'},409);
  if(old&&!['waiting_credit'].includes(old.state))return json({id:old.id,state:old.state,reused:true,response:old.response_json?JSON.parse(old.response_json):null});
  const native=model.startsWith('@cf/');if(native&&!env.AI||!native&&!env.OPENROUTER_API_KEY)return json({error:'对应声音通路未配置'},503);
  if(!native){
   const funds=await checkOpenRouterFunds(env.OPENROUTER_API_KEY);if(!funds.verified)return json({error:'余额核对失败，尚未合成'},503);
   if(!funds.usable){const retry=null;await db.prepare(`INSERT INTO practice_media(id,set_id,digest,object_key,mime,bytes,state,request_json,next_retry_at,created_at) VALUES(?,?,?,?,?,0,'waiting_credit',?,?,?) ON CONFLICT(id) DO UPDATE SET state='waiting_credit',next_retry_at=excluded.next_retry_at WHERE practice_media.state='waiting_credit' AND practice_media.digest=excluded.digest AND practice_media.set_id=excluded.set_id`).bind(b.id,b.setId,digest,`media/${b.setId}/${b.id}/${digest}.mp3`,'audio/mpeg',JSON.stringify(descriptor),retry,Date.now()).run();return json({id:b.id,state:'waiting_credit',nextRetryAt:retry});}
  }
  const key=`media/${b.setId}/${b.id}/${digest}.mp3`;
  const claim=old?await db.prepare("UPDATE practice_media SET state='calling',next_retry_at=NULL WHERE id=? AND state='waiting_credit'").bind(b.id).run():await db.prepare("INSERT OR IGNORE INTO practice_media(id,set_id,digest,object_key,mime,bytes,state,request_json,created_at) VALUES(?,?,?,?,?,0,'calling',?,?)").bind(b.id,b.setId,digest,key,'audio/mpeg',JSON.stringify(descriptor),Date.now()).run();
  if(!claim.meta.changes)return json({id:b.id,state:'calling',reused:true});
  try{
   let bytes,metadata;
   if(native){bytes=await new Response(await env.AI.run(model,{text:b.text,speaker:voice,encoding:'mp3'})).arrayBuffer();metadata={provider:'workers-ai',model,voice};}
   else{const r=await fetch('https://openrouter.ai/api/v1/audio/speech',{method:'POST',headers:{authorization:`Bearer ${env.OPENROUTER_API_KEY}`,'content-type':'application/json','X-Title':'The Second Language IELTS practice'},body:JSON.stringify({model,voice,input:b.text,response_format:'mp3'}),signal:AbortSignal.timeout(240000)});bytes=await r.arrayBuffer();metadata={provider:'openrouter',status:r.status,generationId:r.headers.get('x-generation-id'),mime:r.headers.get('content-type')};if(!r.ok||!metadata.mime?.startsWith('audio/')){metadata.raw=new TextDecoder().decode(bytes);const state=r.status===402?'waiting_credit':'failed',retry=state==='waiting_credit'?null:null;await db.prepare('UPDATE practice_media SET state=?,response_json=?,next_retry_at=? WHERE id=?').bind(state,JSON.stringify(metadata),retry,b.id).run();return json({id:b.id,state,response:metadata,nextRetryAt:retry});}}
   if(bytes.byteLength<100||bytes.byteLength>20*1024*1024)throw Error('音频文件大小无效');
   await store(env,key,bytes,'audio/mpeg');await db.prepare("UPDATE practice_media SET state='ready',bytes=?,response_json=? WHERE id=?").bind(bytes.byteLength,JSON.stringify({...metadata,audioDigest:await sha256(bytes)}),b.id).run();
   return json({id:b.id,state:'ready',bytes:bytes.byteLength,response:metadata});
  }catch(e){await db.prepare("UPDATE practice_media SET state='outcome_unknown',response_json=? WHERE id=?").bind(JSON.stringify({error:String(e.message)}),b.id).run();return json({id:b.id,state:'outcome_unknown',error:'已保留请求，请核对结果；不会自动重复收费'},502);}
 }
 const upload=path.match(/^\/api\/practice\/publisher\/media\/([A-Za-z0-9._:-]+)\/upload$/);
 const verify=path.match(/^\/api\/practice\/publisher\/media\/([A-Za-z0-9._:-]+)\/verify$/);
 if(verify&&request.method==='POST'){
  if(!env.AI)return json({error:'Whisper 尚未配置'},503);
  const row=await db.prepare("SELECT * FROM practice_media WHERE id=? AND state='ready'").bind(verify[1]).first();if(!row)return json({error:'音频未准备好'},404);
  const metadata=JSON.parse(row.response_json||'{}');if(metadata.verification)return json({id:row.id,verification:metadata.verification,reused:true});
  const bytes=await mediaBytes(env,row.object_key);if(!bytes)return json({error:'音频暂不可用'},503);
  let binary='';const array=new Uint8Array(bytes);for(let i=0;i<array.length;i+=32768)binary+=String.fromCharCode(...array.subarray(i,i+32768));
  const native=await env.AI.run('@cf/openai/whisper-large-v3-turbo',{audio:btoa(binary),language:'en',task:'transcribe',vad_filter:false});
  const verification={model:'@cf/openai/whisper-large-v3-turbo',at:Date.now(),native,scope:'转写核对，不代替答案发音和自然度审阅'};
  await db.prepare('UPDATE practice_media SET response_json=? WHERE id=?').bind(JSON.stringify({...metadata,verification}),row.id).run();return json({id:row.id,verification});
 }
 if(upload&&request.method==='PUT'){
  const setId=new URL(request.url).searchParams.get('set'),seconds=Number(new URL(request.url).searchParams.get('seconds'));
  if(!idOK(setId)||!Number.isFinite(seconds)||seconds<=0||seconds>1200||Number(request.headers.get('content-length'))>20*1024*1024)return json({error:'整段音频参数无效'},400);
  const bytes=await request.arrayBuffer(),head=new Uint8Array(bytes.slice(0,3));if(bytes.byteLength>20*1024*1024||bytes.byteLength<100||!(head[0]===73&&head[1]===68&&head[2]===51||head[0]===255&&(head[1]&224)===224))return json({error:'只接受可解码的 MP3，最大 20 MiB'},400);
  const digest=await sha256(bytes),old=await db.prepare('SELECT * FROM practice_media WHERE id=?').bind(upload[1]).first();
  if(old){if(old.digest!==digest||old.set_id!==setId||old.seconds!==seconds)return json({error:'音频版本编号已固定'},409);return json({id:old.id,state:old.state,reused:true});}
  const key=`media/${setId}/${upload[1]}/${digest}.mp3`;await store(env,key,bytes,'audio/mpeg');
  await db.prepare("INSERT INTO practice_media(id,set_id,digest,object_key,mime,bytes,seconds,state,request_json,created_at) VALUES(?,?,?,?,?,?,?,'ready',?,?)").bind(upload[1],setId,digest,key,'audio/mpeg',bytes.byteLength,seconds,JSON.stringify({assembly:true}),Date.now()).run();
  return json({id:upload[1],digest,seconds,state:'ready'});
 }
 return json({error:'声音控制接口不存在'},404);
}
