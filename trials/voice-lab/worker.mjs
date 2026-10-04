import {trialId,budget,models,voices,words,sentences,scenes,assets,voiceById,assetById,monthlyPrice,feedbackIdentity} from './plan.mjs';
import {checkOpenRouterFunds} from '../../scripts/lib/speaking/funding.mjs';
import {tuningVoices,profiles,tuningAssets,tuningAssetById,tuningFeedbackIdentity,tempoByVoice} from './tuning-plan.mjs';
const availableAsset=id=>assetById.has(id)||tuningAssetById.has(id);
const json=(body,status=200)=>Response.json(body,{status,headers:{'cache-control':'no-store'}});
const put=(env,key,value)=>env.TRIAL_DATA.put(key,JSON.stringify(value));
const publicPlan={trialId,budget,models:models.map(m=>({...m,lightPrice:monthlyPrice(m,budget.lightCharacters),fullPrice:monthlyPrice(m,budget.fullCharacters)})),voices,words,sentences,scenes,assets};
let active=false;
async function generate(env,ids){
 if(active)return json({error:'上一批仍在运行'},409);active=true;
 try{
  const funds=await checkOpenRouterFunds(env.OPENROUTER_API_KEY);await put(env,'funds-latest',funds);
  if(!funds.verified)return json({state:'funds_check_failed'},503);
  if(!funds.usable)return json({state:'waiting_credit'},402);
  const results=[];
  // One controller submits bounded batches. A stored start is never silently retried.
  for(const id of ids){
   const asset=assetById.get(id),voice=voiceById.get(asset.voiceId),model=models.find(m=>m.id===voice.modelId);
   const prior=await env.TRIAL_DATA.get(`started/${id}`);if(prior){results.push({id,state:'already_started'});continue;}
   const body={model:model.model,voice:voice.voice,input:asset.text,response_format:'mp3'};
   await put(env,`started/${id}`,{at:new Date().toISOString()});await put(env,`request/${id}`,model.kind==='workers-ai'?{model:model.model,text:asset.text,speaker:voice.voice,encoding:'mp3'}:body);
   try{
    let bytes,metadata;
    if(model.kind==='workers-ai'){
     bytes=await new Response(await env.AI.run(model.model,{text:asset.text,speaker:voice.voice,encoding:'mp3',bit_rate:128000})).arrayBuffer();
     metadata={id,model:model.model,voice:voice.voice,mime:'audio/mpeg',source:'workers-ai',bytes:bytes.byteLength,at:new Date().toISOString(),production:false};
    }else{
     const r=await fetch('https://openrouter.ai/api/v1/audio/speech',{method:'POST',redirect:'manual',headers:{authorization:`Bearer ${env.OPENROUTER_API_KEY}`,'content-type':'application/json','X-Title':'Second Language layered voice audition'},body:JSON.stringify(body),signal:AbortSignal.timeout(240000)});
     bytes=await r.arrayBuffer();metadata={id,model:model.model,voice:voice.voice,httpStatus:r.status,mime:r.headers.get('content-type')??'',generationId:r.headers.get('x-generation-id'),bytes:bytes.byteLength,at:new Date().toISOString(),production:false};
     if(!r.ok||!metadata.mime.startsWith('audio/')){
      await put(env,`return/${id}`,{...metadata,state:r.status===402?'waiting_credit':'failed',raw:new TextDecoder().decode(bytes)});results.push({id,state:r.status===402?'waiting_credit':'failed',status:r.status});if(r.status===402)break;continue;
     }
    }
    if(bytes.byteLength<100)throw Error('没有返回可用声音');
    await env.TRIAL_DATA.put(`raw-audio/${id}`,bytes,{metadata:{mime:metadata.mime}});await put(env,`return/${id}`,{...metadata,state:'ready'});results.push({id,state:'ready'});
   }catch(e){await put(env,`return/${id}`,{id,state:'outcome_unknown',error:String(e.message),at:new Date().toISOString()});results.push({id,state:'outcome_unknown'});}
  }
  return json({results});
 }finally{active=false;}
}
export function validateFeedback(body){
 const maximum=voices.length*2+scenes.length*voices.filter(v=>v.gender==='female').length*voices.filter(v=>v.gender==='male').length+tuningVoices.length*profiles.length*2;
 if(body.trialId!==trialId||!/^[-a-zA-Z0-9]{1,80}$/.test(body.sessionId??'')||!/^[-a-zA-Z0-9]{1,80}$/.test(body.submissionId??'')||!Array.isArray(body.ratings)||body.ratings.length>maximum)throw Error('评分格式无效');
 const seen=new Set();let count=0;const ratings=body.ratings.map(r=>{
  const identity=feedbackIdentity(r.key)||tuningFeedbackIdentity(r.key);if(!identity||seen.has(r.key))throw Error('评分对象无效');seen.add(r.key);
  if(r.score!=null&&(!Number.isInteger(r.score)||r.score<1||r.score>5))throw Error('评分应为 1–5');
  if(r.score!=null)count++;if(![null,true,false].includes(r.qualified??null)||typeof r.notes!=='string'||r.notes.length>2000)throw Error('备注格式无效');
  return{key:r.key,...identity,score:r.score??null,qualified:r.qualified??null,notes:r.notes};
 });
 if(!count)throw Error('请至少完成一项评分');
 return{trialId,sessionId:body.sessionId,submissionId:body.submissionId,ratings,listened:Array.isArray(body.listened)?[...new Set(body.listened.filter(availableAsset))].slice(0,assets.length+tuningAssets.length):[]};
}
export default{
 async fetch(request,env){
  const path=new URL(request.url).pathname,admin=!!env.ADMIN_TOKEN&&request.headers.get('authorization')===`Bearer ${env.ADMIN_TOKEN}`;
  const cookie=request.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith('voice_lab_access='))?.slice(17);
  if(path==='/api/access'&&request.method==='POST'){
   let b;try{b=await request.json();}catch{return json({error:'访问请求无效'},400);}
   if(!env.VIEW_TOKEN||b.token!==env.VIEW_TOKEN)return json({error:'请使用聊天中的完整试听链接'},403);
   return new Response(JSON.stringify({ok:true}),{headers:{'content-type':'application/json','cache-control':'no-store','set-cookie':`voice_lab_access=${env.VIEW_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=1209600`}});
  }
  if(!env.VIEW_TOKEN||(!admin&&cookie!==env.VIEW_TOKEN))return json({error:'请使用聊天中的完整试听链接'},401);
  if(['/api/generate','/api/verify','/api/upload-audio','/api/publish-manifest'].includes(path)&&admin){
   if(env.GENERATION_ENABLED!=='true'||Date.now()>Number(env.GENERATION_DEADLINE))return json({error:'音频准备入口已关闭'},409);
   if(request.method!=='POST')return json({error:'Method not allowed'},405);
   if(path==='/api/upload-audio'){
    const id=new URL(request.url).searchParams.get('id');if(!assetById.has(id))return json({error:'声音编号无效'},400);
    const bytes=await request.arrayBuffer();if(bytes.byteLength<100||bytes.byteLength>2*1024*1024)return json({error:'声音文件大小无效'},400);
    await env.TRIAL_DATA.put(`audio/${id}`,bytes,{metadata:{mime:'audio/mpeg',mastering:'loudnorm-I-20-TP-2-LRA-11'}});return json({ready:true,id});
   }
   if(path==='/api/publish-manifest'){
    const b=await request.json();if(!Array.isArray(b.ready)||b.ready.some(id=>!assetById.has(id)))return json({error:'声音清单无效'},400);
    await put(env,'public-manifest',{...publicPlan,ready:[...new Set(b.ready)],mastering:'统一响度，保留原始语速与语调',publishedAt:new Date().toISOString()});return json({readyCount:b.ready.length});
   }
   const b=await request.json();if(!Array.isArray(b.ids)||!b.ids.length||b.ids.length>6||b.ids.some(id=>!assetById.has(id)))return json({error:'请选择一至六段已定义音频'},400);
   if(path==='/api/generate')return generate(env,[...new Set(b.ids)]);
   const results=[];for(const id of [...new Set(b.ids)]){
    const old=await env.TRIAL_DATA.get(`validation/${id}`,{type:'json'});if(old){results.push({id,reused:true});continue;}
    if(await env.TRIAL_DATA.get(`validation-started/${id}`)){results.push({id,state:'already_started'});continue;}
    const bytes=await env.TRIAL_DATA.get(`raw-audio/${id}`,{type:'arrayBuffer'});if(!bytes){results.push({id,state:'missing'});continue;}
    await put(env,`validation-started/${id}`,{at:new Date().toISOString()});
    try{
     let binary='';const u=new Uint8Array(bytes);for(let i=0;i<u.length;i+=32768)binary+=String.fromCharCode(...u.subarray(i,i+32768));
     const native=await env.AI.run('@cf/openai/whisper-large-v3-turbo',{audio:btoa(binary),language:'en',task:'transcribe',vad_filter:false});
     await put(env,`validation/${id}`,{native,model:'@cf/openai/whisper-large-v3-turbo',scope:'transcription cross-check; not phonetic or naturalness certification'});results.push({id,state:'complete'});
    }catch(e){await put(env,`validation/${id}`,{state:'outcome_unknown',error:String(e.message)});results.push({id,state:'outcome_unknown'});}
   }return json({results});
  }
  if(path==='/api/access-check'){
   const id=new URL(request.url).searchParams.get('id');return availableAsset(id)?json({ok:true}):json({error:'声音编号无效'},404);
  }
  if(path==='/api/tuning-manifest')return json({trialId,voices:tuningVoices,profiles,words,sentences,assets:tuningAssets,tempoByVoice});
  if(path==='/api/manifest')return json(env.STATIC_AUDIO==='true'?{...publicPlan,ready:assets.map(a=>a.id),mastering:'统一响度，保留原始语速与语调',storage:'prepared-pages-assets'}:await env.TRIAL_DATA.get('public-manifest',{type:'json'})??{...publicPlan,ready:[]});
  if(path==='/api/feedback-recovery'&&request.method==='GET'){
   if(!env.FEEDBACK_DB)return json({error:'截图反馈暂不可用'},503);
   const {results}=await env.FEEDBACK_DB.prepare("SELECT payload FROM trial_feedback WHERE session_id NOT LIKE 'automation-%' ORDER BY created_at").all();
   const rows=results.map(r=>JSON.parse(r.payload)),ratings=new Map();
   for(const row of rows)for(const rating of row.ratings)ratings.set(rating.key,rating);
   return json({version:rows.at(-1)?.receipt??'provided-images-17',ratings:[...ratings.values()]});
  }
  if(path==='/api/feedback-snapshot'&&admin){
   if(!env.FEEDBACK_DB)return json({error:'独立反馈库未配置'},503);
   const {results}=await env.FEEDBACK_DB.prepare('SELECT payload FROM trial_feedback ORDER BY created_at').all();return json({feedback:results.map(r=>JSON.parse(r.payload))});
  }
  if(path==='/api/progress'&&admin){
   const ids=new URL(request.url).searchParams.get('ids')?.split(',')??[];if(ids.length>6||ids.some(id=>!assetById.has(id)))return json({error:'编号无效'},400);
   return json({results:await Promise.all(ids.map(async id=>({id,result:await env.TRIAL_DATA.get(`return/${id}`,{type:'json'}),validation:await env.TRIAL_DATA.get(`validation/${id}`,{type:'json'})})))});
  }
  const rawMatch=path.match(/^\/api\/raw-audio\/([a-z0-9-]+)$/);
  if(rawMatch&&admin&&assetById.has(rawMatch[1])){
   const bytes=await env.TRIAL_DATA.get(`raw-audio/${rawMatch[1]}`,{type:'arrayBuffer'});
   return bytes?new Response(bytes,{headers:{'content-type':'audio/mpeg','cache-control':'no-store'}}):json({error:'Missing audio'},404);
  }
  const match=path.match(/^\/api\/audio\/([a-z0-9-]+)$/);
  if(match&&assetById.has(match[1])&&['GET','HEAD'].includes(request.method)){
   const result=await env.TRIAL_DATA.getWithMetadata(`audio/${match[1]}`,{type:'arrayBuffer'});if(!result.value)return json({error:'音频暂不可用'},404);
   const bytes=result.value,total=bytes.byteLength,headers={'content-type':'audio/mpeg','accept-ranges':'bytes','cache-control':'private, no-store','x-content-type-options':'nosniff'};
   const range=request.headers.get('range');if(range){
    const m=range.match(/^bytes=(\d*)-(\d*)$/);if(!m||(!m[1]&&!m[2]))return new Response(null,{status:416,headers:{'content-range':`bytes */${total}`}});
    const start=m[1]?Number(m[1]):Math.max(0,total-Number(m[2])),end=m[1]?(m[2]?Math.min(total-1,Number(m[2])):total-1):total-1;
    if(start>=total||start>end)return new Response(null,{status:416,headers:{'content-range':`bytes */${total}`}});
    return new Response(request.method==='HEAD'?null:bytes.slice(start,end+1),{status:206,headers:{...headers,'content-range':`bytes ${start}-${end}/${total}`,'content-length':String(end-start+1)}});
   }return new Response(request.method==='HEAD'?null:bytes,{headers:{...headers,'content-length':String(total)}});
  }
  if(path==='/api/feedback'&&request.method==='POST'){
   if(request.headers.get('origin')!==env.APP_ORIGIN&&!admin)return json({error:'来源不匹配'},403);
   try{
    const raw=await request.text();if(raw.length>1024*1024)return json({error:'评分过长'},413);const b=validateFeedback(JSON.parse(raw));
    if(!env.FEEDBACK_DB)return json({error:'反馈库暂不可用；评分仍保存在本机，可导出备份。'},503);
    const db=env.FEEDBACK_DB,old=await db.prepare('SELECT receipt FROM trial_feedback WHERE session_id=? AND submission_id=?').bind(b.sessionId,b.submissionId).first();if(old)return json({saved:true,receipt:old.receipt,reused:true});
    const row={...b,receipt:crypto.randomUUID(),at:new Date().toISOString()};await db.prepare('INSERT OR IGNORE INTO trial_feedback(session_id,submission_id,receipt,payload,created_at) VALUES(?,?,?,?,?)').bind(b.sessionId,b.submissionId,row.receipt,JSON.stringify(row),row.at).run();const winner=await db.prepare('SELECT receipt FROM trial_feedback WHERE session_id=? AND submission_id=?').bind(b.sessionId,b.submissionId).first();return json({saved:true,receipt:winner.receipt,reused:winner.receipt!==row.receipt});
   }catch(e){return json({error:'提交未成功；评分仍在本机，请导出备份或稍后重试。'},503);}
  }
  return json({error:'Not found'},404);
 }
};
