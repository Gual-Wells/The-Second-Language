import {checkOpenRouterFunds} from '../../scripts/lib/speaking/funding.mjs';
import {ttsModel,defaultVoice,voicePolicyVersion} from '../../protocol/voices.mjs';
import {sha256} from './practice-media.js';
import {permanentBucket,chapterText} from './storage.js';
import {pronunciationResult,savePronunciationResult,digestHex} from './pronunciation-store.js';
import {audioDescriptor} from './audio-config.js';
import {ipaToKokoro,isChapterAudioRequest} from '../../web/audio-plan.js';
const json=(v,s=200)=>Response.json(v,{status:s,headers:{'cache-control':'no-store'}});
const view=row=>({id:row.id,state:row.state,nextRetryAt:row.next_retry_at||null,audioUrl:row.state==='ready'?`/api/practice/pronunciation/${row.id}/audio`:null});
async function associate(env,b,id){
 if(typeof b.chapterId!=='string'||!/^[a-f0-9]{64}$/.test(b.digest||''))return;
 const chapter=await env.DB.prepare('SELECT 1 FROM chapter_revisions r JOIN published_chapters p ON p.chapter_id=r.chapter_id WHERE r.chapter_id=? AND r.digest=?').bind(b.chapterId,b.digest).first();
 if(!chapter)return;const saved=await pronunciationResult(env,id);let result;
 if(saved){const batch=await env.PRACTICE_DB.batch([
  env.PRACTICE_DB.prepare('INSERT OR IGNORE INTO chapter_audio_scopes(chapter_id,chapter_digest) VALUES(?,?)').bind(b.chapterId,b.digest),
  env.PRACTICE_DB.prepare('INSERT OR IGNORE INTO chapter_audio_clips SELECT id,? FROM chapter_audio_scopes WHERE chapter_id=? AND chapter_digest=?').bind(saved.id,b.chapterId,b.digest)
 ]);result=batch[1];}else result=await env.PRACTICE_DB.prepare('INSERT OR IGNORE INTO chapter_pronunciation SELECT ?,?,id FROM pronunciation_audio WHERE id=?').bind(b.chapterId,b.digest,id).run();
 if(result.meta.changes)await env.DB.prepare('INSERT INTO chapter_audio_work VALUES(?,?,?) ON CONFLICT(chapter_id,chapter_digest) DO UPDATE SET requested_at=excluded.requested_at').bind(b.chapterId,b.digest,Date.now()).run();
}
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
 if(path===`${prefix}/compact`&&request.method==='POST'&&isPublisher){
  const b=await request.json();if(!/^[a-f0-9]{64}$/.test(b.id||''))return json({error:'声音身份无效'},400);
  const old=await db.prepare("SELECT * FROM pronunciation_audio WHERE id=? AND state='ready'").bind(b.id).first();
  if(!old)return json({ok:!!await pronunciationResult(env,b.id),reused:true});
  const descriptor=JSON.parse(old.request_json);if(await sha256(JSON.stringify(descriptor))!==b.id)throw Error('原声音身份不一致');
  const content=old.audio?old.audio:await(await permanentBucket(env).get(old.audio_key)).arrayBuffer();
  const metadata=JSON.parse(old.response_json||'{}');if(metadata.digest&&await sha256(content)!==metadata.digest)throw Error('原声音摘要不一致');
  await savePronunciationResult(env,b.id,descriptor,metadata,content);return json({ok:true,reused:true});
 }
 if(match&&['GET','HEAD'].includes(request.method)){
  const saved=await pronunciationResult(env,match[1]);
  if(saved){if(!match[2])return json(view({id:match[1],state:'ready'}));return(await permanentBucket(env).responseContent(digestHex(saved.content_digest),request,'audio/mpeg'))||json({error:'原声音暂不可用，请稍后再试'},503);}
  const row=await db.prepare(match[2]?'SELECT * FROM pronunciation_audio WHERE id=?':"SELECT id,state,next_retry_at,created_at FROM pronunciation_audio WHERE id=?").bind(match[1]).first();
  if(!row)return json({error:'这段发音尚未准备好'},404);
  if(match[2]){
   if(row.state==='ready'&&row.audio_key&&env.ONEDRIVE_ENABLED==='true'){const response=await permanentBucket(env).response(row.audio_key,request);if(response)return response;}
   return row.state==='ready'&&row.audio?audioResponse(request,row):json({error:'声音尚不可用',...view(row)},409);
  }
  return json(view(row));
 }
 if(path!==prefix||request.method!=='POST')return json({error:'发音接口不存在'},404);
 if(!isPublisher&&(!session||!sameOrigin))return json({error:'请从已登录的阅读器申请发音'},403);
 if(Number(request.headers.get('content-length')||0)>6000)return json({error:'请选择单词或短句'},400);
 let b;try{const raw=await request.text();if(raw.length>6000)throw Error();b=JSON.parse(raw);}catch{return json({error:'发音请求无效'},400);}
 const text=typeof b.text==='string'?b.text.replace(/\s+/g,' ').trim():'';
 if(!['word','sentence'].includes(b.kind)||!/[A-Za-z]/.test(text)||text.length>(b.kind==='word'?100:1200)||/[\u3400-\u9fff]/.test(text))return json({error:'请选择英文单词或不超过 1200 字符的英文短句'},400);
 let phonemes='';if(b.ipa){phonemes=ipaToKokoro(String(b.ipa));if(!phonemes||b.kind!=='word')return json({error:'这个读音需要单独核对，未发起收费生成'},422);}
 if(b.chapterId!==undefined||b.digest!==undefined){
  if(typeof b.chapterId!=='string'||!/^[a-f0-9]{64}$/.test(b.digest||''))return json({error:'章节版本无效'},400);
  const chapter=await env.DB.prepare('SELECT r.content_key FROM chapter_revisions r JOIN published_chapters p ON p.chapter_id=r.chapter_id WHERE r.chapter_id=? AND r.digest=?').bind(b.chapterId,b.digest).first();
  if(!chapter)return json({error:'章节版本不存在'},404);
  let markdown;try{markdown=await chapterText(env,chapter.content_key);}catch{return json({error:'章节原件暂不可用，未发起生成'},503);}
  if(!markdown||await sha256(markdown)!==b.digest)return json({error:'章节原件暂不可核对，未发起生成'},503);
  if(!isChapterAudioRequest(markdown,text,b.kind,phonemes))return json({error:'请点按词汇标题或完整例句、范文句子'},422);
 }
 const descriptor=audioDescriptor(text,phonemes),id=await sha256(JSON.stringify(descriptor));
 await associate(env,b,id);
 if(await pronunciationResult(env,id))return json({...view({id,state:'ready'}),reused:true});
 let old=await db.prepare('SELECT id,state,next_retry_at,created_at FROM pronunciation_audio WHERE id=?').bind(id).first();
 if(old&&old.state!=='waiting_credit'){
  if(old.state==='calling'&&Date.now()-old.created_at>300000){await db.prepare("UPDATE pronunciation_audio SET state='outcome_unknown' WHERE id=? AND state='calling'").bind(id).run();old={...old,state:'outcome_unknown'};}
  return json({...view(old),reused:true});
 }
 if(!env.OPENROUTER_API_KEY)return json({error:'Bella 声音服务尚未配置'},503);
 // Preserve failed/unknown billing records, but stop admitting new paid work well
 // before a prolonged storage outage could fill the free database with fallback audio.
 const usage=await db.prepare('SELECT coalesce(sum(length(audio)),0) AS bytes FROM pronunciation_audio WHERE audio IS NOT NULL').all();
 if(!Number.isFinite(usage.meta?.size_after))return json({error:'声音存储状态暂时无法核对'},503);
 if(usage.meta.size_after>=200*1024*1024||usage.results[0].bytes>=31*1024*1024)return json({error:'声音存储需要维护，已有发音仍可播放'},503);
 const funds=await checkOpenRouterFunds(env.OPENROUTER_API_KEY);if(!funds.verified)return json({error:'声音余额暂时无法核对，请稍后再试'},503);
 if(!funds.usable){
  const retry=null;await db.prepare("INSERT INTO pronunciation_audio(id,request_json,state,next_retry_at,created_at) VALUES(?,?,'waiting_credit',?,?) ON CONFLICT(id) DO UPDATE SET next_retry_at=excluded.next_retry_at WHERE pronunciation_audio.state='waiting_credit'").bind(id,JSON.stringify(descriptor),retry,Date.now()).run();
  return json(view({id,state:'waiting_credit',next_retry_at:retry}));
 }
 const claim=old?await db.prepare("UPDATE pronunciation_audio SET state='calling',next_retry_at=NULL,created_at=? WHERE id=? AND state='waiting_credit'").bind(Date.now(),id).run():await db.prepare("INSERT OR IGNORE INTO pronunciation_audio(id,request_json,state,created_at) VALUES(?,?,'calling',?)").bind(id,JSON.stringify(descriptor),Date.now()).run();
 if(!claim.meta.changes){const row=await db.prepare('SELECT id,state,next_retry_at FROM pronunciation_audio WHERE id=?').bind(id).first();return json({...view(row),reused:true});}
 try{
  const r=await fetch('https://openrouter.ai/api/v1/audio/speech',{method:'POST',headers:{authorization:`Bearer ${env.OPENROUTER_API_KEY}`,'content-type':'application/json','X-Title':'The Second Language Bella pronunciation'},body:JSON.stringify({model:ttsModel,voice:defaultVoice,input:descriptor.input,response_format:'mp3'}),signal:AbortSignal.timeout(240000)});
  const bytes=await r.arrayBuffer(),metadata={status:r.status,model:ttsModel,voice:defaultVoice,generationId:r.headers.get('x-generation-id'),mime:r.headers.get('content-type')};
  if(!r.ok||!metadata.mime?.startsWith('audio/')){
   const state=r.status===402?'waiting_credit':'failed',retry=state==='waiting_credit'?null:null;
   await db.prepare('UPDATE pronunciation_audio SET state=?,response_json=?,next_retry_at=? WHERE id=?').bind(state,JSON.stringify({...metadata,raw:new TextDecoder().decode(bytes).slice(0,16000)}),retry,id).run();return json(view({id,state,next_retry_at:retry}));
  }
  const head=new Uint8Array(bytes.slice(0,3));if(bytes.byteLength<100||bytes.byteLength>1048576||!(head[0]===73&&head[1]===68&&head[2]===51||head[0]===255&&(head[1]&224)===224))throw Error('声音文件无效或过大');
  let saved=false;
  if(env.ONEDRIVE_ENABLED==='true')try{await savePronunciationResult(env,id,descriptor,metadata,bytes);saved=true;}catch{saved=false;}
  if(!saved)await db.prepare("UPDATE pronunciation_audio SET state='ready',audio=?,audio_key=NULL,response_json=? WHERE id=?").bind(bytes,JSON.stringify({...metadata,bytes:bytes.byteLength,digest:await sha256(bytes)}),id).run();
  await associate(env,b,id);
  return json(view({id,state:'ready'}));
 }catch(e){
  await db.prepare("UPDATE pronunciation_audio SET state='outcome_unknown',response_json=? WHERE id=?").bind(JSON.stringify({error:String(e.message)}),id).run();return json({id,state:'outcome_unknown',error:'声音请求结果待核对，已保留进度'},502);
 }
}
