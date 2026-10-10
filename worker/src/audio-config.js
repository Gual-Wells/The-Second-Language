import {audioUnits,uniqueAudioUnits,audioParts,audioCost,audioPrice} from '../../web/audio-plan.js';
import {ttsModel,defaultVoice,voicePolicyVersion} from '../../protocol/voices.mjs';
import {chapterText,permanentBucket} from './storage.js';
import {sha256} from './practice-media.js';
import {digestBytes,digestHex} from './pronunciation-store.js';
export function audioDescriptor(text,phonemes=''){
 const d={model:ttsModel,voice:defaultVoice,input:phonemes?`[${text}](/${phonemes}/)`:text,response_format:'mp3',voicePolicyVersion};
 if(phonemes)d.pronunciation={text,phonemes,version:'kokoro-misaki-us-v1'};return d;
}
const json=(v,s=200)=>Response.json(v,{status:s,headers:{'cache-control':'no-store'}});
const partsOf=p=>Array.isArray(p)&&p.length<=3&&new Set(p).size===p.length&&p.every(x=>audioParts.includes(x))?audioParts.filter(x=>p.includes(x)):null;
export async function buildAudioPlan(env,chapterId,digest,parts){
 const chapter=await env.DB.prepare('SELECT * FROM chapter_revisions WHERE chapter_id=? AND digest=? AND EXISTS(SELECT 1 FROM published_chapters WHERE chapter_id=?)').bind(chapterId,digest,chapterId).first();
 if(!chapter)throw Error('章节版本不存在');const markdown=await chapterText(env,chapter.content_key);if(!markdown||await sha256(markdown)!==digest)throw Error('章节原件暂不可用');
 const all=audioUnits(markdown),unique=uniqueAudioUnits(all),indexed=await Promise.all(unique.map(async u=>({...u,id:await sha256(JSON.stringify(audioDescriptor(u.text,u.phonemes)))}))),states=new Map();
 for(let start=0;start<indexed.length;start+=80){const ids=indexed.slice(start,start+80).map(u=>u.id),marks=ids.map(()=>'?').join(',');
  for(const r of (await env.PRACTICE_DB.prepare(`SELECT generation_digest FROM pronunciation_results WHERE generation_digest IN (${marks})`).bind(...ids.map(digestBytes)).all()).results)states.set(digestHex(r.generation_digest),'ready');
  for(const r of (await env.PRACTICE_DB.prepare(`SELECT id,state FROM pronunciation_audio WHERE id IN (${marks})`).bind(...ids).all()).results)if(!states.has(r.id))states.set(r.id,r.state);
 }
 const selectedKeys=new Set(uniqueAudioUnits(all.filter(u=>parts.includes(u.part))).map(u=>JSON.stringify([u.text,u.phonemes]))),units=indexed.filter(u=>selectedKeys.has(JSON.stringify([u.text,u.phonemes]))).map(u=>({...u,cached:states.get(u.id)==='ready',existingState:states.get(u.id)||null}));
 const estimates=audioParts.map(part=>{const list=uniqueAudioUnits(all.filter(u=>u.part===part)),newUnits=list.filter(u=>!indexed.some(v=>states.get(v.id)==='ready'&&v.text===u.text&&v.phonemes===u.phonemes)),characters=newUnits.reduce((n,u)=>n+audioDescriptor(u.text,u.phonemes).input.length,0);return{part,count:list.length,characters,cost:audioCost(characters)};});
 const characters=units.filter(u=>!u.cached).reduce((n,u)=>n+audioDescriptor(u.text,u.phonemes).input.length,0);
 return{chapterId,digest,title:chapter.title,parts,units,estimates,characters,cost:audioCost(characters),price:audioPrice};
}
export async function audioConfigRoute(request,env,{isPublisher,session,sameOrigin}){
 const url=new URL(request.url),p=url.pathname.replace('/api/audio-config',''),db=env.DB,now=Date.now();
 if(!isPublisher&&!session)return json({error:'请先登录'},401);
 if(request.method!=='GET'&&!isPublisher&&!sameOrigin)return json({error:'请从设置提交'},403);
 let b={};if(request.method!=='GET'){try{const raw=await request.text();if(raw.length>6000)throw Error();b=JSON.parse(raw);}catch{return json({error:'申请无效'},400);}}
 if(p===''&&request.method==='GET'){
  const next=await db.prepare('SELECT parts,revision FROM audio_next_config WHERE id=1').first(),jobs=await db.prepare("SELECT id,chapter_id,parts,state,cursor,total,error FROM audio_requests WHERE state!='quoted' ORDER BY created_at DESC LIMIT 15").all();
  return json({next:JSON.parse(next.parts).filter(p=>audioParts.includes(p)),revision:next.revision,jobs:jobs.results,price:audioPrice});
 }
 if(p==='/next'&&request.method==='PUT'){
  const parts=partsOf(b.parts);if(!parts)return json({error:'请选择有效的音频项目'},400);
  if(!Number.isInteger(b.revision))return json({error:'请重新读取设置'},409);
  const r=await db.prepare('UPDATE audio_next_config SET parts=?,revision=revision+1,updated_at=? WHERE id=1 AND revision=?').bind(JSON.stringify(parts),now,b.revision).run();
  if(!r.meta.changes)return json({error:'选配已变化，请重新读取后保存'},409);return json({ok:true,next:parts,revision:b.revision+1});
 }
 if(p==='/estimate'&&request.method==='POST'){
  if(b.mode==='next'){
   const {results}=await db.prepare('SELECT r.* FROM published_chapters p JOIN chapter_revisions r ON r.digest=p.digest ORDER BY p.study_date DESC LIMIT 3').all();const samples=[];
   for(const c of results){const text=await chapterText(env,c.content_key);if(text&&await sha256(text)===c.digest)samples.push(audioUnits(text));}
   const estimates=audioParts.map(part=>{const characters=samples.map(s=>uniqueAudioUnits(s.filter(u=>u.part===part)).reduce((n,u)=>n+audioDescriptor(u.text,u.phonemes).input.length,0));return{part,cost:characters.length?[audioCost(Math.min(...characters))[0],audioCost(Math.max(...characters))[1]]:null};});
   return json({estimates,approximate:true,price:audioPrice});
  }
  const plan=await buildAudioPlan(env,b.chapterId,b.digest,audioParts);return json({...plan,units:undefined});
 }
 if(p==='/quote'&&request.method==='POST'){
  const parts=partsOf(b.parts);if(!parts?.length)return json({error:'请至少选择一项'},400);
  if(typeof b.chapterId!=='string'||!/^[a-f0-9]{64}$/.test(b.digest||''))return json({error:'请选择章节'},400);
  const plan=await buildAudioPlan(env,b.chapterId,b.digest,parts),id=crypto.randomUUID(),planKey=`audio-requests/${id}/plan.json`;
  await permanentBucket(env).put(planKey,JSON.stringify(plan),{httpMetadata:{contentType:'application/json'}});
  await db.prepare("DELETE FROM audio_requests WHERE state='quoted' AND expires_at<?").bind(now).run();
  await db.prepare("INSERT INTO audio_requests(id,chapter_id,chapter_digest,parts,source,plan_key,state,created_at,expires_at,total) VALUES(?,?,?,?,'existing',?,'quoted',?,?,?)").bind(id,b.chapterId,b.digest,JSON.stringify(parts),planKey,now,now+600000,plan.units.length).run();
  return json({quoteId:id,expiresAt:now+600000,...plan,units:undefined});
 }
 if(p==='/confirm'&&request.method==='POST'){
  if(b.confirmed!==true||typeof b.quoteId!=='string')return json({error:'请确认本次申请'},400);
  const job=await db.prepare('SELECT * FROM audio_requests WHERE id=?').bind(b.quoteId).first();if(!job)return json({error:'申请不存在'},404);
  if(job.state!=='quoted')return json({ok:true,id:job.id,reused:true});
  const r=await db.prepare("UPDATE audio_requests SET state='pending',expires_at=NULL WHERE id=? AND state='quoted' AND expires_at>?").bind(job.id,now).run();
  return r.meta.changes?json({ok:true,id:job.id}):json({error:'费用预估已过期，请重新申请'},409);
 }
 if(p==='/resume'&&request.method==='POST'){
  const r=await db.prepare("UPDATE audio_requests SET state='pending',claim=NULL,lease_until=NULL,error=NULL WHERE id=? AND state='waiting_credit'").bind(String(b.id||'')).run();return r.meta.changes?json({ok:true}):json({error:'此申请不处于等待充值状态'},409);
 }
 if(p==='/jobs/claim'&&isPublisher&&request.method==='POST'){
  if(!/^[a-f0-9]{64}$/.test(b.claim||''))return json({error:'处理身份无效'},400);
  // Reclaim the orchestration lease only. The TTS ledger decides if a paid call can repeat.
  const candidate=await db.prepare("SELECT id FROM audio_requests WHERE state='pending' OR (state='running' AND lease_until<?) ORDER BY created_at LIMIT 1").bind(now).first();if(!candidate)return json({job:null});
  const row=await db.prepare("UPDATE audio_requests SET state='running',claim=?,lease_until=? WHERE id=? AND (state='pending' OR (state='running' AND lease_until<?)) RETURNING *").bind(b.claim,now+300000,candidate.id,now).first();if(!row)return json({job:null});
  try{let plan;if(row.plan_key)plan=await(await permanentBucket(env).get(row.plan_key)).json();else{
    plan=await buildAudioPlan(env,row.chapter_id,row.chapter_digest,JSON.parse(row.parts));const key=`audio-requests/${row.id}/plan.json`;await permanentBucket(env).put(key,JSON.stringify(plan),{httpMetadata:{contentType:'application/json'}});await db.prepare('UPDATE audio_requests SET plan_key=?,total=? WHERE id=? AND claim=?').bind(key,plan.units.length,row.id,b.claim).run();
   }return json({job:{id:row.id,cursor:row.cursor,...plan}});
  }catch{await db.prepare("UPDATE audio_requests SET state='pending',claim=NULL,lease_until=NULL,error='章节资料暂不可用' WHERE id=? AND claim=?").bind(row.id,b.claim).run();return json({error:'章节资料暂不可用'},503);}
 }
 if(p==='/jobs/progress'&&isPublisher&&request.method==='POST'){
  const job=await db.prepare("SELECT * FROM audio_requests WHERE id=? AND claim=? AND state='running' AND lease_until>?").bind(b.id,b.claim,now).first();if(!job)return json({error:'处理权已失效'},409);
  if(!Number.isInteger(b.cursor)||b.cursor<job.cursor||b.cursor>job.total||!['running','completed','waiting_credit','needs_review'].includes(b.state))return json({error:'进度无效'},400);
  if(b.state==='completed'&&b.cursor!==job.total)return json({error:'音频尚未完成'},409);
  if(b.state!=='running')await permanentBucket(env).put(`audio-requests/${job.id}/result-${b.cursor}-${b.state}.json`,JSON.stringify({id:job.id,chapterId:job.chapter_id,digest:job.chapter_digest,cursor:b.cursor,total:job.total,state:b.state,error:String(b.error||'').slice(0,180),at:now}),{httpMetadata:{contentType:'application/json'}});
  await db.prepare('UPDATE audio_requests SET cursor=?,state=?,lease_until=?,error=? WHERE id=? AND claim=?').bind(b.cursor,b.state,now+300000,String(b.error||'').slice(0,180),job.id,b.claim).run();return json({ok:true});
 }
 return json({error:'接口不存在'},404);
}
