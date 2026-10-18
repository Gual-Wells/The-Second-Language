import {validateFirstPartUpgrade} from '../../protocol/first-part-upgrade.mjs';
import {chapterText,permanentBucket} from './storage.js';
import {digestText} from '../../protocol/chapter-quality-contract.mjs';

const dates=new Set(['2026-10-02','2026-10-06','2026-10-09','2026-10-11','2026-10-12','2026-10-13','2026-10-14']);
const pin='821651446af60912b242ea389bd6891b00381a47',digest=v=>/^[a-f0-9]{64}$/.test(v||'');
const json=(v,status=200)=>Response.json(v,{status,headers:{'cache-control':'no-store'}});

export async function firstPartUpgradeRoute(request,env,isPublisher,bucket=permanentBucket(env)){
 if(!isPublisher)return json({error:'发布身份无效'},403);
 if(request.method!=='POST')return json({error:'操作无效'},405);
 let b;try{const raw=await request.text();if(raw.length>1200000)return json({error:'修订过大'},413);b=JSON.parse(raw);}catch{return json({error:'修订格式无效'},400);}
 if(!b||Array.isArray(b)||!dates.has(b.chapterId)||![`upgrade-20261018-${b.chapterId}`,`correction-20261018-${b.chapterId}`].includes(b.runId)||!digest(b.baseDigest)||!digest(b.targetDigest)||b.vixCommit!==pin||!/^[a-f0-9]{40}$/.test(b.protocolCommit||'')||typeof b.markdown!=='string'||!b.manifest||b.manifest.scope!=='first-part'||b.manifest.baseDigest!==b.baseDigest||b.manifest.targetDigest!==b.targetDigest)return json({error:'不属于批准的第一部分升级'},400);
 if(b.runId.startsWith('correction-')&&(b.manifest.authority!=='formal-main'||!Array.isArray(b.manifest.words)||b.manifest.words.length!==40||b.manifest.words.some(w=>!Array.isArray(w.coverage)||!w.coverage.length)))return json({error:'修正须按正式主协议保留逐词内容去向'},400);
 const prior=await env.DB.prepare('SELECT * FROM chapter_first_part_upgrades WHERE id=?').bind(b.runId).first();
 const current=await env.DB.prepare('SELECT * FROM published_chapters WHERE chapter_id=?').bind(b.chapterId).first();
 if(prior){if(prior.chapter_id!==b.chapterId||prior.base_digest!==b.baseDigest||prior.target_digest!==b.targetDigest)return json({error:'修订身份已使用'},409);return current?.digest===b.targetDigest?json({ok:true,reused:true,digest:b.targetDigest}):json({error:'已有后续版本，不得重发覆盖'},409);}
 if(!current||current.digest!==b.baseDigest)return json({error:'原章已变更，请重新核对'},409);
 const original=await env.DB.prepare('SELECT * FROM chapter_revisions WHERE chapter_id=? AND digest=?').bind(b.chapterId,b.baseDigest).first();
 if(!original)return json({error:'原版本不存在'},404);
 try{
  const old=await chapterText(env,original.content_key);if(!old||await digestText(old)!==b.baseDigest)return json({error:'原件暂不可核对'},503);
  if(await digestText(b.markdown)!==b.targetDigest)return json({error:'新正文摘要不一致'},400);
  try{validateFirstPartUpgrade(old,b.markdown);}catch(e){return json({error:e.message},400);}
  const key=`chapters/${b.chapterId}/${b.targetDigest}.md`,now=Date.now();
  await bucket.put(key,b.markdown,{httpMetadata:{contentType:'text/markdown; charset=utf-8'}});
  const saved=await bucket.get(key);if(!saved||await digestText(await saved.text())!==b.targetDigest)throw Error('新版永久原件未核实');
  const manifest={...b.manifest,chapterId:b.chapterId,original:{runId:original.run_id,vixCommit:original.vix_commit,protocolCommit:original.protocol_commit},vixCommit:pin,protocolCommit:b.protocolCommit};
  const manifestText=JSON.stringify(manifest),manifestDigest=await digestText(manifestText);
  await bucket.put(`chapter-upgrades/${b.runId}/${manifestDigest}.json`,manifestText,{httpMetadata:{contentType:'application/json'}});
  const check=await bucket.get(`chapter-upgrades/${b.runId}/${manifestDigest}.json`);if(!check||await digestText(await check.text())!==manifestDigest)throw Error('升级说明未核实');
  await env.CHAPTERS.put(key,b.markdown,{expirationTtl:30*86400});
  await env.DB.prepare(`INSERT OR IGNORE INTO chapter_revisions(digest,chapter_id,study_date,number,title,subtitle,word_count,content_key,run_id,vix_commit,protocol_commit,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`).bind(b.targetDigest,b.chapterId,original.study_date,original.number,original.title,original.subtitle,40,key,b.runId,pin,b.protocolCommit,now).run();
  // Prepare immutable reuse links before changing the visible main-database pointer.
  // Retrieval still applies the unchanged sentence-only/Bella policy.
  await env.PRACTICE_DB.batch([
   env.PRACTICE_DB.prepare('INSERT OR IGNORE INTO chapter_audio_scopes(chapter_id,chapter_digest) VALUES(?,?)').bind(b.chapterId,b.targetDigest),
   env.PRACTICE_DB.prepare(`INSERT OR IGNORE INTO chapter_audio_clips(scope_id,result_id) SELECT n.id,c.result_id FROM chapter_audio_scopes o JOIN chapter_audio_clips c ON c.scope_id=o.id JOIN chapter_audio_scopes n ON n.chapter_id=o.chapter_id AND n.chapter_digest=? WHERE o.chapter_id=? AND o.chapter_digest=?`).bind(b.targetDigest,b.chapterId,b.baseDigest),
   env.PRACTICE_DB.prepare(`INSERT OR IGNORE INTO chapter_pronunciation(chapter_id,chapter_digest,audio_id) SELECT c.chapter_id,?,c.audio_id FROM chapter_pronunciation c JOIN pronunciation_audio a ON a.id=c.audio_id WHERE c.chapter_id=? AND c.chapter_digest=? AND a.state='ready'`).bind(b.targetDigest,b.chapterId,b.baseDigest)
  ]);
  const result=await env.DB.batch([
   env.DB.prepare(`INSERT OR IGNORE INTO chapter_first_part_upgrades(id,chapter_id,base_digest,target_digest,manifest_digest,created_at) SELECT ?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM published_chapters WHERE chapter_id=? AND digest=?)`).bind(b.runId,b.chapterId,b.baseDigest,b.targetDigest,manifestDigest,now,b.chapterId,b.baseDigest),
   env.DB.prepare(`UPDATE published_chapters SET digest=? WHERE chapter_id=? AND digest=? AND EXISTS(SELECT 1 FROM chapter_first_part_upgrades WHERE id=? AND target_digest=?)`).bind(b.targetDigest,b.chapterId,b.baseDigest,b.runId,b.targetDigest),
   env.DB.prepare(`INSERT INTO chapter_audio_work(chapter_id,chapter_digest,requested_at) SELECT ?,?,? WHERE EXISTS(SELECT 1 FROM published_chapters WHERE chapter_id=? AND digest=?) ON CONFLICT(chapter_id,chapter_digest) DO NOTHING`).bind(b.chapterId,b.targetDigest,now,b.chapterId,b.targetDigest)
  ]);
  if(!result[1].meta.changes)return json({error:'发布期间原章发生变化，未覆盖当前版本'},409);
  return json({ok:true,digest:b.targetDigest,manifestDigest,audioReused:true,ttsCalls:0});
 }catch(e){console.warn('第一部分升级：'+e.message);return json({error:'升级尚未完成，原件和已存资料保留'},503);}
}
