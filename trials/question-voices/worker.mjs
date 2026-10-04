import {trialId,samples,voices} from './plan.mjs';
import {checkOpenRouterFunds} from '../../scripts/lib/speaking/funding.mjs';
const json=(value,status=200)=>Response.json(value,{status,headers:{'cache-control':'no-store'}});
const put=(env,key,value)=>env.TRIAL_DATA.put(key,JSON.stringify(value));
let active=false;
export async function generate(env){
 if(env.GENERATION_ENABLED!=='true'||active||Date.now()>Number(env.GENERATION_DEADLINE))return;
 active=true;
 try{
  const funds=await checkOpenRouterFunds(env.OPENROUTER_API_KEY);await put(env,'funds-before',funds);
  if(!funds.verified||!funds.usable){await put(env,'generation-state',{state:'waiting-credit',at:new Date().toISOString()});return;}
  await Promise.allSettled(voices.map(async voice=>{
   for(const sample of samples){
    const id=`${voice.generationPrefix??voice.id}-${sample.id}`;
    if(await env.TRIAL_DATA.get(`started/${id}`))continue;
    const body={model:voice.model,voice:voice.voice,input:sample.text,response_format:'mp3',...(voice.provider?{provider:voice.provider}:{})};
    await put(env,`started/${id}`,{at:new Date().toISOString()});
    await put(env,`request/${id}`,voice.kind==='workers-ai'?{model:voice.model,parameters:{text:sample.text,speaker:voice.voice,encoding:'mp3'}}:body);
    try{
     if(voice.kind==='workers-ai'){
      const stream=await env.AI.run(voice.model,{text:sample.text,speaker:voice.voice,encoding:'mp3'}),bytes=await new Response(stream).arrayBuffer();
      if(bytes.byteLength<100)throw Error('Cloudflare 没有返回可用声音');
      await env.TRIAL_DATA.put(`audio/${id}`,bytes,{metadata:{mime:'audio/mpeg'}});
      await put(env,`return/${id}`,{id,model:voice.model,voice:voice.voice,state:'ready',mime:'audio/mpeg',bytes:bytes.byteLength,at:new Date().toISOString(),rawSource:'Workers AI native binary stream',production:false});continue;
     }
     const r=await fetch('https://openrouter.ai/api/v1/audio/speech',{method:'POST',redirect:'manual',headers:{authorization:`Bearer ${env.OPENROUTER_API_KEY}`,'content-type':'application/json','X-Title':'Second Language question voice audition'},body:JSON.stringify(body),signal:AbortSignal.timeout(240000)});
     const bytes=await r.arrayBuffer(),mime=r.headers.get('content-type')??'',generationId=r.headers.get('x-generation-id');
     const metadata={id,model:voice.model,voice:voice.voice,httpStatus:r.status,mime,generationId,bytes:bytes.byteLength,at:new Date().toISOString(),production:false};
     if(!r.ok||!mime.startsWith('audio/')||bytes.byteLength<100){await put(env,`return/${id}`,{...metadata,state:'failed',raw:new TextDecoder().decode(bytes)});if(r.status===402)break;continue;}
     await env.TRIAL_DATA.put(`audio/${id}`,bytes,{metadata:{mime}});
     await put(env,`return/${id}`,{...metadata,state:'ready'});
     if(generationId){const usage=await fetch(`https://openrouter.ai/api/v1/generation?id=${encodeURIComponent(generationId)}`,{headers:{authorization:`Bearer ${env.OPENROUTER_API_KEY}`},signal:AbortSignal.timeout(20000)});await put(env,`billing/${id}`,{status:usage.status,raw:await usage.text()});}
    }catch(error){await put(env,`error/${id}`,{state:'outcome_unknown',error:String(error.message),at:new Date().toISOString()});}
   }
  }));
  await put(env,'funds-after',await checkOpenRouterFunds(env.OPENROUTER_API_KEY));
  await put(env,'generation-state',{state:'finished',at:new Date().toISOString()});
 }finally{active=false;}
}
export function validateFeedback(body){
 if(body.trialId!==trialId||!/^[-a-zA-Z0-9]{1,80}$/.test(body.sessionId??'')||!/^[-a-zA-Z0-9]{1,80}$/.test(body.submissionId??'')||!Array.isArray(body.voices)||body.voices.length>3)throw Error('评分格式无效');
 const seen=new Set();let count=0;
 for(const v of body.voices){
  if(!voices.some(x=>x.id===v.id)||seen.has(v.id))throw Error('声音编号无效');seen.add(v.id);
  for(const key of ['naturalness','clarity','examiner','faithfulness']){const n=v.ratings?.[key];if(n!=null&&(!Number.isInteger(n)||n<1||n>5))throw Error('评分应为 1–5');if(n!=null)count++;}
  if(![null,true,false].includes(v.qualified??null)||typeof v.notes!=='string'||v.notes.length>2000)throw Error('备注格式无效');
 }
 if(!count||!['a','b','c','none',null].includes(body.preferred??null))throw Error('请至少完成一项评分');
 return{trialId,sessionId:body.sessionId,submissionId:body.submissionId,voices:body.voices.map(v=>({id:v.id,ratings:Object.fromEntries(['naturalness','clarity','examiner','faithfulness'].map(k=>[k,v.ratings?.[k]??null])),qualified:v.qualified??null,notes:v.notes})),preferred:body.preferred??null,identitiesRevealed:body.identitiesRevealed===true,listened:Array.isArray(body.listened)?body.listened.filter(x=>/^[abc]-(personal|long-turn|discussion)$/.test(x)).slice(0,9):[]};
}
export default{
 scheduled(_event,env,ctx){ctx.waitUntil(generate(env));},
 async fetch(request,env){
  const url=new URL(request.url),path=url.pathname;
  const admin=!!env.ADMIN_TOKEN&&request.headers.get('authorization')===`Bearer ${env.ADMIN_TOKEN}`;
  const cookie=request.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith('trial_access='))?.slice(13);
  if(path==='/api/access'&&request.method==='POST'){
   let b;try{b=await request.json();}catch{return json({error:'无法读取访问请求'},400);}
   if(!env.VIEW_TOKEN||b.token!==env.VIEW_TOKEN)return json({error:'试听链接无效，请使用聊天中的完整链接'},403);
   return new Response(JSON.stringify({ok:true}),{headers:{'content-type':'application/json','cache-control':'no-store','set-cookie':`trial_access=${env.VIEW_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=1209600`}});
  }
  if(!env.VIEW_TOKEN||(!admin&&cookie!==env.VIEW_TOKEN))return json({error:'请使用聊天中的完整试听链接'},401);
  if(['/api/start','/api/verify','/api/retry-google'].includes(path)&&request.method==='POST'&&admin&&env.GENERATION_ENABLED!=='true')return json({error:'本轮音频已准备完成，付费生成入口已关闭'},409);
  if(path==='/api/start'&&request.method==='POST'&&admin){await generate(env);return json({finished:true});}
  if(path==='/api/verify'&&request.method==='POST'&&admin){
   const checked=[];for(const voice of voices)for(const sample of samples){const id=`${voice.generationPrefix??voice.id}-${sample.id}`;if(await env.TRIAL_DATA.get(`validation-started/${id}`))continue;const audio=await env.TRIAL_DATA.get(`audio/${id}`,{type:'arrayBuffer'});if(!audio)continue;await put(env,`validation-started/${id}`,{at:new Date().toISOString()});
    try{let binary='';const bytes=new Uint8Array(audio);for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));const native=await env.AI.run('@cf/openai/whisper-large-v3-turbo',{audio:btoa(binary),language:'en',task:'transcribe',vad_filter:false});await put(env,`validation/${id}`,{model:'@cf/openai/whisper-large-v3-turbo',native,scope:'ASR fidelity cross-check, not human naturalness judgment',at:new Date().toISOString()});checked.push(id);}catch(e){await put(env,`validation/${id}`,{error:String(e.message),state:'outcome_unknown'});}
   }return json({checked});
  }
  if(path==='/api/retry-google'&&request.method==='POST'&&admin){
   const id='google-retry-20261004-personal';if(await env.TRIAL_DATA.get(`started/${id}`))return json({alreadyRequested:true});
   const body=await env.TRIAL_DATA.get('request/c-personal',{type:'json'});if(!body)return json({error:'原始请求不存在'},409);
   await put(env,`started/${id}`,{at:new Date().toISOString()});await put(env,`request/${id}`,body);
   const r=await fetch('https://openrouter.ai/api/v1/audio/speech',{method:'POST',redirect:'manual',headers:{authorization:`Bearer ${env.OPENROUTER_API_KEY}`,'content-type':'application/json','X-Title':'Second Language Google TTS explicit retry'},body:JSON.stringify(body),signal:AbortSignal.timeout(240000)});
   const bytes=await r.arrayBuffer(),mime=r.headers.get('content-type')??'',generationId=r.headers.get('x-generation-id'),result={id,httpStatus:r.status,mime,generationId,bytes:bytes.byteLength,at:new Date().toISOString(),state:r.ok&&mime.startsWith('audio/')?'ready':'failed',production:false};
   if(result.state==='ready')await env.TRIAL_DATA.put(`audio/${id}`,bytes,{metadata:{mime}});else result.raw=new TextDecoder().decode(bytes);
   await put(env,`return/${id}`,result);return json(result);
  }
  if(path==='/api/manifest'){
   const available=[];for(const voice of voices)for(const sample of samples){const r=await env.TRIAL_DATA.get(`return/${voice.generationPrefix??voice.id}-${sample.id}`,{type:'json'});available.push({id:`${voice.id}-${sample.id}`,ready:r?.state==='ready'});}
   return json({trialId,samples,voices:voices.map(v=>({id:v.id,label:v.label})),available});
  }
  if(path==='/api/identities')return json({voices:voices.map(({provider,...v})=>v)});
  if(/^\/api\/audio\/[abc]-(personal|long-turn|discussion)$/.test(path)){
   const requested=path.split('/').at(-1),voice=voices.find(v=>requested.startsWith(v.id+'-')),key=voice.generationPrefix?voice.generationPrefix+requested.slice(1):requested;
   const result=await env.TRIAL_DATA.getWithMetadata(`audio/${key}`,{type:'arrayBuffer'});if(!result.value)return json({error:'这段音频暂未准备好'},404);
   const bytes=result.value,total=bytes.byteLength,headers={'content-type':result.metadata?.mime??'audio/mpeg','accept-ranges':'bytes','cache-control':'private, no-store','x-content-type-options':'nosniff'};
   const range=request.headers.get('range');
   if(range){const m=range.match(/^bytes=(\d*)-(\d*)$/);if(!m||(!m[1]&&!m[2]))return new Response(null,{status:416,headers:{'content-range':`bytes */${total}`}});
    const start=m[1]?Number(m[1]):Math.max(0,total-Number(m[2])),end=m[1]?(m[2]?Math.min(total-1,Number(m[2])):total-1):total-1;
    if(start>=total||start>end)return new Response(null,{status:416,headers:{'content-range':`bytes */${total}`}});
    return new Response(request.method==='HEAD'?null:bytes.slice(start,end+1),{status:206,headers:{...headers,'content-range':`bytes ${start}-${end}/${total}`,'content-length':String(end-start+1)}});
   }
   return new Response(request.method==='HEAD'?null:bytes,{headers:{...headers,'content-length':String(total)}});
  }
  if(path==='/api/feedback'&&request.method==='POST'){
   if(request.headers.get('origin')!==env.APP_ORIGIN&&!admin)return json({error:'来源不匹配'},403);
   if(Number(request.headers.get('content-length')??0)>15000)return json({error:'评分过长'},413);
   try{const raw=await request.text();if(raw.length>15000)throw Error('评分过长');const b=validateFeedback(JSON.parse(raw)),key=`feedback/${b.sessionId}/${b.submissionId}`,old=await env.TRIAL_DATA.get(key,{type:'json'});if(old)return json({saved:true,receipt:old.receipt,at:old.at,reused:true});const feedback={...b,receipt:crypto.randomUUID(),at:new Date().toISOString()};await put(env,key,feedback);return json({saved:true,receipt:feedback.receipt,at:feedback.at});}catch(e){return json({error:String(e.message)},400);}
  }
  return json({error:'Not found'},404);
 }
};
