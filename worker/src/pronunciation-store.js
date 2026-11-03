import {permanentBucket} from './storage.js';
export const digestBytes=hex=>Uint8Array.from(hex.match(/../g),x=>parseInt(x,16));
export const digestHex=bytes=>Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('');
export async function pronunciationResult(env,id){return env.PRACTICE_DB.prepare('SELECT * FROM pronunciation_results WHERE generation_digest=?').bind(digestBytes(id)).first();}
export function audioStorageFailure(error){
 const messages=[];for(let e=error,n=0;e&&n<4;e=e.cause,n++)messages.push(String(e.message||''));const text=messages.join(' ');
 const reason=/too many.*(?:SQL|quer)|D1.*(?:limit|exceed)/i.test(text)?'d1-query-limit':/subrequest/i.test(text)?'subrequest-limit':/cpu.*(?:limit|exceed)|exceed.*cpu/i.test(text)?'cpu-limit':/RPC|stub|dispos|revok/i.test(text)?'file-rpc':/回读|尚未核实|暂不可核对/.test(text)?'readback-unverified':/回执|位置.*无效|长度.*不一致/.test(text)?'receipt-invalid':/429|throttl/i.test(text)?'provider-throttled':/存储凭据|unauthorized|forbidden|401|403/i.test(text)?'provider-authorization':/type|serializ|ArrayBuffer/i.test(text)?'serialization':/timeout|abort|network|fetch/i.test(text)?'transport':'unclassified';
 return {phase:error.audioStoragePhase||'unknown',reason};
}
export async function savePronunciationResult(env,id,descriptor,metadata,audio){
 let phase='audio-write';try{
 const bucket=permanentBucket(env),clip=await bucket.putContent(audio,'audio/mpeg');
 phase='source-record';
 const job=await env.PRACTICE_DB.prepare('SELECT id,request_json,response_json,next_retry_at,created_at,state,audio_key FROM pronunciation_audio WHERE id=?').bind(id).first(),createdAt=job?.created_at||Date.now();
 phase='descriptor-write';
 const record=await bucket.putContent(JSON.stringify({id,createdAt,request:descriptor,response:{...metadata,bytes:clip.bytes,digest:clip.digest},originalJob:job}),'application/json');
 phase='index-commit';
 await env.PRACTICE_DB.batch([
  env.PRACTICE_DB.prepare('INSERT OR IGNORE INTO pronunciation_results(generation_digest,content_digest,record_digest,bytes,created_at) VALUES(?,?,?,?,?)').bind(digestBytes(id),digestBytes(clip.digest),digestBytes(record.digest),clip.bytes,createdAt),
  env.PRACTICE_DB.prepare('INSERT OR IGNORE INTO chapter_audio_scopes(chapter_id,chapter_digest) SELECT chapter_id,chapter_digest FROM chapter_pronunciation WHERE audio_id=?').bind(id),
  env.PRACTICE_DB.prepare('INSERT OR IGNORE INTO chapter_audio_clips SELECT s.id,r.id FROM chapter_pronunciation l JOIN chapter_audio_scopes s ON s.chapter_id=l.chapter_id AND s.chapter_digest=l.chapter_digest JOIN pronunciation_results r ON r.generation_digest=? WHERE l.audio_id=?').bind(digestBytes(id),id),
  env.PRACTICE_DB.prepare('DELETE FROM chapter_pronunciation WHERE audio_id=?').bind(id),
  env.PRACTICE_DB.prepare('DELETE FROM pronunciation_audio WHERE id=?').bind(id)
 ]);
 phase='index-readback';return await pronunciationResult(env,id);
 }catch(error){throw Object.assign(Error('声音永久转存未完成',{cause:error}),{audioStoragePhase:phase});}
}
