import {checkOpenRouterFunds} from '../../scripts/lib/speaking/funding.mjs';
import {ttsModel,defaultVoice,voicePolicyVersion} from '../../protocol/voices.mjs';
import {sha256} from './practice-media.js';
const json=(v,s=200)=>Response.json(v,{status:s,headers:{'cache-control':'no-store'}});
const view=row=>({id:row.id,state:row.state,nextRetryAt:row.next_retry_at||null,audioUrl:row.state==='ready'?`/api/practice/pronunciation/${row.id}/audio`:null});
function audioResponse(request,row){
 const bytes=new Uint8Array(row.audio),n=bytes.byteLength,headers={'content-type':'audio/mpeg','cache-control':'private, no-store','accept-ranges':'bytes','x-content-type-options':'nosniff'};
 const range=request.headers.get('range');if(range){
  const m=range.match(/^bytes=(\d*)-(\d*)$/);if(!m||(!m[1]&&!m[2]))return new Response(null,{status:416,headers:{'content-range':`bytes */${n}`}});
  const start=m[1]?Number(m[1]):Math.max(0,n-Number(m[2])),end=m[1]?(m[2]?Math.min(n-1,Number(m[2])):n-1):n-1;
  if(start>=n||start>end)return new Response(null,{status:416,headers:{'content-range':`bytes */${n}`}});
  return new Response(request.method==='HEAD'?null:bytes.slice(start,end+1),{status:206,headers:{...headers,'content-range':`bytes ${start}-${end}/${n}`,'content-length':String(end-start+1)}});
 }
 return new Response(request.method==='HEAD'?null:bytes,{headers:{...headers,'content-length':String(n)}});
}
export async function pronunciationRoute(request,env,{isPublisher,isReader,session,sameOrigin}){
 const path=new URL(request.url).pathname,prefix='/api/practice/pronunciation';if(!path.startsWith(prefix))return null;
 const db=env.PRACTICE_DB,match=path.match(/^\/api\/practice\/pronunciation\/([a-f0-9]{64})(\/audio)?$/);
 if(match&&['GET','HEAD'].includes(request.method)){
  const row=await db.prepare(match[2]?'SELECT * FROM pronunciation_audio WHERE id=?':"SELECT id,state,next_retry_at,created_at FROM pronunciation_audio WHERE id=?").bind(match[1]).first();
  if(!row)return json({error:'这段发音尚未准备好'},404);
  if(match[2])return row.state==='ready'&&row.audio?audioResponse(request,row):json({error:'声音尚不可用',...view(row)},409);
  return json(view(row));
 }
 if(path!==prefix||request.method!=='POST')return json({error:'发音接口不存在'},404);
 if(!isPublisher&&(!session||!sameOrigin))return json({error:'请从已登录的阅读器申请发音'},403);
 if(Number(request.headers.get('content-length')||0)>6000)return json({error:'请选择单词或短句'},400);
 let b;try{const raw=await request.text();if(raw.length>6000)throw Error();b=JSON.parse(raw);}catch{return json({error:'发音请求无效'},400);}
 const text=typeof b.text==='string'?b.text.replace(/\s+/g,' ').trim():'';
 if(!['word','sentence'].includes(b.kind)||!/[A-Za-z]/.test(text)||text.length>(b.kind==='word'?100:1200)||/[\u3400-\u9fff]/.test(text))return json({error:'请选择英文单词或不超过 1200 字符的英文短句'},400);
 const descriptor={model:ttsModel,voice:defaultVoice,input:text,response_format:'mp3',voicePolicyVersion},id=await sha256(JSON.stringify(descriptor));
 let old=await db.prepare('SELECT id,state,next_retry_at,created_at FROM pronunciation_audio WHERE id=?').bind(id).first();
 if(old&&old.state!=='waiting_credit'){
  if(old.state==='calling'&&Date.now()-old.created_at>300000){await db.prepare("UPDATE pronunciation_audio SET state='outcome_unknown' WHERE id=? AND state='calling'").bind(id).run();old={...old,state:'outcome_unknown'};}
  return json({...view(old),reused:true});
 }
 if(!env.OPENROUTER_API_KEY)return json({error:'Bella 声音服务尚未配置'},503);
 const funds=await checkOpenRouterFunds(env.OPENROUTER_API_KEY);if(!funds.verified)return json({error:'声音余额暂时无法核对，请稍后再试'},503);
 if(!funds.usable){
  const retry=null;await db.prepare("INSERT INTO pronunciation_audio(id,request_json,state,next_retry_at,created_at) VALUES(?,?,'waiting_credit',?,?) ON CONFLICT(id) DO UPDATE SET next_retry_at=excluded.next_retry_at WHERE pronunciation_audio.state='waiting_credit'").bind(id,JSON.stringify(descriptor),retry,Date.now()).run();
  return json(view({id,state:'waiting_credit',next_retry_at:retry}));
 }
 const claim=old?await db.prepare("UPDATE pronunciation_audio SET state='calling',next_retry_at=NULL,created_at=? WHERE id=? AND state='waiting_credit'").bind(Date.now(),id).run():await db.prepare("INSERT OR IGNORE INTO pronunciation_audio(id,request_json,state,created_at) VALUES(?,?,'calling',?)").bind(id,JSON.stringify(descriptor),Date.now()).run();
 if(!claim.meta.changes){const row=await db.prepare('SELECT id,state,next_retry_at FROM pronunciation_audio WHERE id=?').bind(id).first();return json({...view(row),reused:true});}
 try{
  const r=await fetch('https://openrouter.ai/api/v1/audio/speech',{method:'POST',headers:{authorization:`Bearer ${env.OPENROUTER_API_KEY}`,'content-type':'application/json','X-Title':'The Second Language Bella pronunciation'},body:JSON.stringify({model:ttsModel,voice:defaultVoice,input:text,response_format:'mp3'}),signal:AbortSignal.timeout(240000)});
  const bytes=await r.arrayBuffer(),metadata={status:r.status,model:ttsModel,voice:defaultVoice,generationId:r.headers.get('x-generation-id'),mime:r.headers.get('content-type')};
  if(!r.ok||!metadata.mime?.startsWith('audio/')){
   const state=r.status===402?'waiting_credit':'failed',retry=state==='waiting_credit'?null:null;
   await db.prepare('UPDATE pronunciation_audio SET state=?,response_json=?,next_retry_at=? WHERE id=?').bind(state,JSON.stringify({...metadata,raw:new TextDecoder().decode(bytes).slice(0,16000)}),retry,id).run();return json(view({id,state,next_retry_at:retry}));
  }
  const head=new Uint8Array(bytes.slice(0,3));if(bytes.byteLength<100||bytes.byteLength>1048576||!(head[0]===73&&head[1]===68&&head[2]===51||head[0]===255&&(head[1]&224)===224))throw Error('声音文件无效或过大');
  await db.prepare("UPDATE pronunciation_audio SET state='ready',audio=?,response_json=? WHERE id=?").bind(bytes,JSON.stringify({...metadata,bytes:bytes.byteLength,digest:await sha256(bytes)}),id).run();
  return json(view({id,state:'ready'}));
 }catch(e){
  await db.prepare("UPDATE pronunciation_audio SET state='outcome_unknown',response_json=? WHERE id=?").bind(JSON.stringify({error:String(e.message)}),id).run();return json({id,state:'outcome_unknown',error:'声音请求结果待核对，已保留进度'},502);
 }
}
