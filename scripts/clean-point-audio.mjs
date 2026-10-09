import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {publisherConfig} from './lib/publisher-config.mjs';
import {query,mainDatabase,practiceDatabase} from './lib/cloudflare-local.mjs';
import {pointAudioKeys,isPointAudioClip,pointAudioPolicy} from '../web/audio-plan.js';
const apply=process.argv.includes('--apply'),{base,token}=await publisherConfig();
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
async function get(route){const r=await fetch(new URL(route,base),{headers:{authorization:`Bearer ${token}`},signal:AbortSignal.timeout(120000)});if(!r.ok)throw Error(`音频核查读取未完成：${r.status}`);return r;}
// Maintenance is a full one-off read. Preserve append-only result/link rows and all paid originals.
const revisions=await query(mainDatabase,'SELECT r.chapter_id,r.digest FROM chapter_revisions r WHERE EXISTS(SELECT 1 FROM published_chapters p WHERE p.chapter_id=r.chapter_id) ORDER BY r.created_at');
const rows=await query(practiceDatabase,'SELECT id,lower(hex(generation_digest)) AS generation,lower(hex(record_digest)) AS record_digest FROM pronunciation_results ORDER BY id'),clips=[];
for(const row of rows){const bytes=Buffer.from(await(await get(`/api/storage/content?digest=${row.record_digest}`)).arrayBuffer());if(hash(bytes)!==row.record_digest)throw Error('音频生成记录摘要不一致');const record=JSON.parse(bytes),d=record.request;if(hash(JSON.stringify(d))!==row.generation)throw Error('音频生成身份不一致');clips.push({resultId:row.id,id:row.generation,text:d.pronunciation?.text||d.input,phonemes:d.pronunciation?.phonemes||'',voice:d.voice});}
const audited=[];
for(const c of revisions){const chapter=await(await get(`/api/chapters/${encodeURIComponent(c.chapter_id)}?digest=${c.digest}`)).json();if(hash(chapter.markdown)!==c.digest)throw Error('章节摘要不一致');const keys=pointAudioKeys(chapter.markdown),valid=clips.filter(x=>isPointAudioClip(x,keys));const old=await(await get(`/api/storage/chapters/${encodeURIComponent(c.chapter_id)}?digest=${c.digest}`)).json();audited.push({...c,valid,previousClips:old.clips?.length||0,excluded:(old.clips||[]).filter(x=>!isPointAudioClip(x,keys)).map(x=>({id:x.id,text:x.text}))});}
const report={at:new Date().toISOString(),pointAudioPolicy,apply,successfulOriginals:rows.length,revisions:audited.map(({valid,...c})=>({...c,eligible:valid.length,eligibleIds:valid.map(x=>x.id)}))};
const dir=`work/expression/audio-maintenance/${report.at.replace(/[:.]/g,'-')}`;await mkdir(dir,{recursive:true});await writeFile(dir+'/audit.json',JSON.stringify(report,null,2));
if(apply)for(const c of audited){
 if(c.valid.length){await query(practiceDatabase,'INSERT OR IGNORE INTO chapter_audio_scopes(chapter_id,chapter_digest) VALUES(?,?)',[c.chapter_id,c.digest]);
  for(const clip of c.valid)await query(practiceDatabase,'INSERT OR IGNORE INTO chapter_audio_clips SELECT id,? FROM chapter_audio_scopes WHERE chapter_id=? AND chapter_digest=?',[clip.resultId,c.chapter_id,c.digest]);
 }
 await query(mainDatabase,'INSERT INTO chapter_audio_work VALUES(?,?,?) ON CONFLICT(chapter_id,chapter_digest) DO UPDATE SET requested_at=excluded.requested_at',[c.chapter_id,c.digest,Date.now()]);
}
console.log(JSON.stringify({apply,successfulOriginals:rows.length,revisions:report.revisions.map(({chapter_id,digest,previousClips,eligible,excluded})=>({chapter_id,digest,previousClips,eligible,excluded:excluded.length})),report:dir+'/audit.json'}));
if(apply)console.log('已补充可复用关联并排入清洗打包；执行 storage-upgrade.mjs packs 后核验清单。未删除原件或历史索引，未调用声音模型。');
