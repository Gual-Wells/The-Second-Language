import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {gzipSync,gunzipSync} from 'node:zlib';
import {publisherConfig} from './lib/publisher-config.mjs';
import {cloudflare,kvKeys,queryDetailed,mainDatabase,practiceDatabase} from './lib/cloudflare-local.mjs';
import {root,downloadItem} from './lib/onedrive-local.mjs';
import {archiveWorking} from './lib/work-archives.mjs';
import {rowidPages,permanentRows,storageTableOrder} from './lib/storage-scan.mjs';
import {archiveQuery} from './lib/archive-read-budget.mjs';
import {latestRecoverySnapshot} from './lib/recovery-snapshot.mjs';
import {pointAudioKeys,isPointAudioClip,pointAudioPolicy} from '../web/audio-plan.js';
try{
const {base,token}=await publisherConfig(),mode=process.argv[2]||'migrate',directory=path.join(root,'.cache/storage-upgrade');await mkdir(directory,{recursive:true});
const query=await archiveQuery(queryDetailed,path.join(directory,'read-budget.json'));
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
let ledger={};try{ledger=JSON.parse(await readFile(path.join(directory,'upload-ledger.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;
 for await(const rows of rowidPages(query,mainDatabase,'storage_objects',{pageSize:1000,projection:'t.object_key AS key,t.digest,b.bytes',join:'JOIN storage_blobs b ON b.digest=t.digest'}))for(const row of rows)ledger[row.key]=row;
 await writeFile(path.join(directory,'upload-ledger.json'),JSON.stringify(ledger));
}
async function api(route,body=null,method='POST',mime='application/json'){const r=await fetch(new URL(`/api/storage${route}`,base),{method,headers:{authorization:`Bearer ${token}`,'content-type':mime},...(body!==null?{body:Buffer.isBuffer(body)?body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(180000)});if(!r.ok){const error=await r.json().catch(()=>({}));throw Error(`归档接口 ${r.status}: ${error.error||'request_failed'}`);}return r;}
async function put(key,bytes,mime='application/octet-stream'){const hash=digest(bytes);if(ledger[key]?.digest===hash&&(mode!=='backup'||ledger[key].itemId))return ledger[key];const result=await(await api(mode==='backup'?'/content':`/objects?key=${encodeURIComponent(key)}`,bytes,'PUT',mime)).json();if(result.digest!==hash)throw Error('上传摘要不同');ledger[key]={key,...result};await writeFile(path.join(directory,'upload-ledger.json'),JSON.stringify(ledger));return ledger[key];}
if(mode==='backup'){
 const stamp=new Date().toISOString().replace(/[:.]/g,'-'),manifest={version:2,createdAt:new Date().toISOString(),databases:[],directResources:true,temporaryPolicy:'48-hour temporary content is excluded from permanent exports'};
 let previous={};try{previous=JSON.parse(await readFile(path.join(directory,'last-backup.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;try{previous=await latestRecoverySnapshot();}catch(error){if(!error.message.includes('Graph HTTP 404')&&!error.message.includes('没有独立恢复快照'))throw error;}}
 const pageCache=path.join(directory,'immutable-pages');await mkdir(pageCache,{recursive:true});
 async function cachedPage(entry){let bytes;try{bytes=await readFile(path.join(pageCache,entry.digest+'.json'));}catch(e){if(e.code!=='ENOENT')throw e;const item=previous.resources?.[entry.digest];if(!item)throw Error('增量检查点缺少恢复定位');bytes=Buffer.from(await(await downloadItem(item)).arrayBuffer());}if(digest(bytes)!==entry.digest)throw Error('增量检查点校验失败');await writeFile(path.join(pageCache,entry.digest+'.json'),bytes);return JSON.parse((entry.compressed?gunzipSync(bytes):bytes).toString('utf8'));}
 // Explicitly export only permanent tables. A full SQL export would accidentally retain expired temporary pages.
 manifest.working=await archiveWorking(root,put);
 for(const [name,id] of [['main',mainDatabase],['practice',practiceDatabase]]){
  const schema=await query(id,"SELECT type,name,sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name NOT LIKE 'd1_%' ORDER BY type,name");
  const preserved=schema.filter(x=>!/^temporary_|^auth_challenges$|^auth_sessions$/.test(x.name)&&!(/temporary_|auth_challenges|auth_sessions/.test(x.sql)&&x.type!=='table'));
  const validation=new DatabaseSync(':memory:');validation.exec('PRAGMA foreign_keys=OFF');for(const object of preserved.filter(x=>x.type==='table'))validation.exec(object.sql);
  const schemaBytes=Buffer.from(JSON.stringify(preserved)),schemaKey=`backups/chunks/${name}/schema/${digest(schemaBytes)}.json`;await put(schemaKey,schemaBytes,'application/json');
  manifest.databases.push({database:name,schemaKey,digest:digest(schemaBytes)});
  const tables=await query(id,"SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name NOT LIKE 'd1_%' ORDER BY name");
  const neededDigests=new Set();
  for(const {name:table} of tables.sort(storageTableOrder)){if(/^temporary_|^auth_challenges$|^auth_sessions$/.test(table))continue;
   const safe='"'+table.replaceAll('"','""')+'"';
   const types=Object.fromEntries(validation.prepare(`PRAGMA table_info(${safe})`).all().map(x=>[x.name,x.type]));
   function validateRows(rows){for(const row of rows){const columns=Object.keys(row),insert=`INSERT INTO ${safe} (${columns.map(c=>'"'+c.replaceAll('"','""')+'"').join(',')}) VALUES (${columns.map(()=>'?').join(',')})`;validation.prepare(insert).run(...columns.map(c=>types[c]==='BLOB'&&Array.isArray(row[c])?Buffer.from(row[c]):row[c]));}}
   let scan={};
   if(name==='practice'&&['pronunciation_results','chapter_audio_clips'].includes(table)){
    const schemaHash=digest(Buffer.from(preserved.find(x=>x.type==='table'&&x.name===table).sql)),old=previous.immutable?.tables?.[table];
    const end=(await query(id,`SELECT MAX(rowid) AS last FROM ${safe}`))[0].last||0;
    let reusedRows=0;if(old&&old.schema===schemaHash&&old.last<=end){scan={after:old.last,endAt:end};for(const entry of previous.databases.filter(x=>x.database===name&&x.table===table)){validateRows((await cachedPage(entry)).rows);manifest.databases.push(entry);reusedRows+=entry.rows;}}
    else scan={endAt:end};
    manifest.immutable||={tables:{}};manifest.immutable.tables[table]={schema:schemaHash,last:end,reusedRows,addedRows:0};
   }
   for await(const page of rowidPages(query,id,table,scan)){
    const rows=permanentRows(table,page,neededDigests);
    if(!rows.length)continue;const bytes=gzipSync(Buffer.from(JSON.stringify({table,rows})),{level:6});if(bytes.length>20*1024*1024)throw Error(`请为 ${table} 配置更小的分页`);
    validateRows(rows);if(['pronunciation_results','chapter_audio_clips'].includes(table)){await writeFile(path.join(pageCache,digest(bytes)+'.json'),bytes);manifest.immutable.tables[table].addedRows+=rows.length;}
    const key=`backups/chunks/${name}/${table}/${digest(bytes)}.json.gz`;await put(key,bytes,'application/gzip');manifest.databases.push({database:name,table,key,digest:digest(bytes),rows:rows.length,compressed:true});
   }
  }
  for(const object of preserved.filter(x=>x.type!=='table'))validation.exec(object.sql);
  if(validation.prepare('PRAGMA integrity_check').get().integrity_check!=='ok'||validation.prepare('PRAGMA foreign_key_check').all().length)throw Error(`${name} 快照发生并发变化，未发布恢复清单，请稍后重新归档`);validation.close();
 }
 const dependencies=[...manifest.databases.map(x=>({key:x.key||x.schemaKey,digest:x.digest})),...manifest.working.flatMap(x=>[{key:x.key,digest:x.digest},...x.chunks])];manifest.resources={};
 for(const item of dependencies){const location=ledger[item.key]?.digest===item.digest&&ledger[item.key]?.itemId||previous.resources?.[item.digest];if(location)manifest.resources[item.digest]=location;}
 if(dependencies.some(x=>!manifest.resources[x.digest]))throw Error('恢复资产定位不完整，未发布快照');
 const measured=JSON.parse(await readFile(path.join(directory,'read-budget.json'),'utf8')).sizes||{};
 manifest.capacity={main:measured[mainDatabase],practice:measured[practiceDatabase]};
 for(const [name,bytes] of Object.entries(manifest.capacity))if(bytes>=120*1024*1024)console.warn(`${name} 数据库已达 ${Math.ceil(bytes/1048576)} MiB，需要检查增长类别；160 MiB 前安排容量维护。`);
 const manifestKey=`backups/${stamp}/manifest.json`,saved=await put(manifestKey,Buffer.from(JSON.stringify(manifest,null,2)),'application/json');await api('/recovery-index',{key:manifestKey,digest:saved.digest,itemId:saved.itemId});
 await writeFile(path.join(directory,'last-backup.pending'),JSON.stringify(manifest,null,2));await rename(path.join(directory,'last-backup.pending'),path.join(directory,'last-backup.json'));console.log(`已归档 ${manifest.databases.length} 份结构/数据页，完整性及外键核验通过，独立恢复索引已更新`);
}else if(mode==='migrate'){
 const status=await(await api('/status',null,'GET')).json();
 const report={at:new Date().toISOString(),assets:[],pronunciation:0,compact:0};
 const chapters=await query(mainDatabase,'SELECT r.content_key FROM chapter_revisions r LEFT JOIN storage_objects o ON o.object_key=r.content_key WHERE o.object_key IS NULL');
 const legacy=await kvKeys('cd0a805ac55146d599f70a32fa9aa0f2'),known=legacy.length?await query(mainDatabase,'SELECT object_key FROM storage_objects WHERE object_key IN (SELECT value FROM json_each(?))',[JSON.stringify(legacy.map(x=>x.name))]):[],pending=await query(mainDatabase,'SELECT object_key FROM storage_pending'),knownSet=new Set(known.map(x=>x.object_key)),pendingSet=new Set(pending.map(x=>x.object_key));
 for(const [namespace,keys] of [['c06595e0069247cd8cf702ac9756cdea',chapters.map(x=>({name:x.content_key}))],['cd0a805ac55146d599f70a32fa9aa0f2',legacy.filter(x=>!knownSet.has(x.name)||pendingSet.has(x.name))]]){
  for(const {name,metadata} of keys){const r=await cloudflare(`/storage/kv/namespaces/${namespace}/values/${encodeURIComponent(name)}`),bytes=Buffer.from(await r.arrayBuffer());const saved=await put(name,bytes,metadata?.mime||(name.endsWith('.md')?'text/markdown':'application/octet-stream'));report.assets.push({key:name,...saved});}
 }
 const clips=await query(practiceDatabase,"SELECT id,hex(audio) AS audio_hex FROM pronunciation_audio WHERE state='ready' AND audio IS NOT NULL");
 for(const row of status.active?[]:clips){const key=`pronunciation/${row.id}.mp3`,bytes=Buffer.from(row.audio_hex,'hex');await put(key,bytes,'audio/mpeg');
  const fetched=Buffer.from(await(await api(`/objects?key=${encodeURIComponent(key)}`,null,'GET')).arrayBuffer());if(digest(fetched)!==digest(bytes))throw Error('音频迁移回读失败');
  await query(practiceDatabase,`UPDATE pronunciation_audio SET audio_key=?${status.active?',audio=NULL':''} WHERE id=? AND hex(audio)=?`,[key,row.id,row.audio_hex]);report.pronunciation++;
 }
 if(status.active){const ready=await query(practiceDatabase,"SELECT id FROM pronunciation_audio WHERE state='ready'");for(const row of ready){const r=await fetch(new URL('/api/practice/pronunciation/compact',base),{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify({id:row.id}),signal:AbortSignal.timeout(180000)});if(!r.ok||(await r.json()).ok!==true)throw Error('成功声音索引整理未完成；原件保留');report.compact++;}report.pronunciation=clips.length;}
 await writeFile(path.join(directory,'migration.json'),JSON.stringify(report,null,2));console.log(`已核验迁移 ${report.assets.length} 个文件、${report.pronunciation} 段点读，整理 ${report.compact} 个成功索引；保留旧 KV 副本`);
}else if(mode==='packs'){
 const chapters=await query(mainDatabase,'SELECT chapter_id,chapter_digest AS digest,requested_at FROM chapter_audio_work');
 for(const c of chapters){
  const response=await fetch(new URL(`/api/chapters/${encodeURIComponent(c.chapter_id)}?digest=${c.digest}`,base),{headers:{authorization:`Bearer ${token}`},signal:AbortSignal.timeout(60000)});
  if(!response.ok)throw Error('音频包对应的章节原件暂不可读');const chapter=await response.json();if(digest(Buffer.from(chapter.markdown))!==c.digest)throw Error('音频包对应章节摘要不一致');const eligible=pointAudioKeys(chapter.markdown);
  const compact=await query(practiceDatabase,`SELECT lower(hex(p.generation_digest)) AS id,lower(hex(p.content_digest)) AS content_digest,lower(hex(p.record_digest)) AS record_digest FROM chapter_audio_scopes s JOIN chapter_audio_clips l ON l.scope_id=s.id JOIN pronunciation_results p ON p.id=l.result_id WHERE s.chapter_id=? AND s.chapter_digest=?`,[c.chapter_id,c.digest]);
  const legacy=await query(practiceDatabase,`SELECT p.id,p.request_json,p.audio_key FROM chapter_pronunciation l JOIN pronunciation_audio p ON p.id=l.audio_id WHERE l.chapter_id=? AND l.chapter_digest=? AND p.state='ready' AND p.audio_key IS NOT NULL`,[c.chapter_id,c.digest]);
  const compactIds=new Set(compact.map(x=>x.id)),clips=[...compact,...legacy.filter(x=>!compactIds.has(x.id))];
  const chunks=[],packs=[],entries=[];let length=0;
  async function flush(){if(!chunks.length)return;const bytes=Buffer.concat(chunks),key=`chapter-audio/${c.chapter_id}/${c.digest}/${digest(bytes)}.bin`;await put(key,bytes);packs.push({key,bytes:bytes.length,digest:digest(bytes)});chunks.length=0;length=0;}
  async function readClip(clip){let descriptor;if(clip.record_digest){const record=Buffer.from(await(await api(`/content?digest=${clip.record_digest}`,null,'GET')).arrayBuffer());if(digest(record)!==clip.record_digest)throw Error('点读描述摘要不一致');descriptor=JSON.parse(record.toString('utf8')).request;}else descriptor=JSON.parse(clip.request_json);
   if(digest(Buffer.from(JSON.stringify(descriptor)))!==clip.id)throw Error('点读生成身份不一致');
   const entry={id:clip.id,text:descriptor.pronunciation?.text||descriptor.input,phonemes:descriptor.pronunciation?.phonemes||'',voice:descriptor.voice};if(!isPointAudioClip(entry,eligible))return null;
   const bytes=Buffer.from(await(await api(clip.content_digest?`/content?digest=${clip.content_digest}`:`/objects?key=${encodeURIComponent(clip.audio_key)}`,null,'GET')).arrayBuffer());if(clip.content_digest&&digest(bytes)!==clip.content_digest)throw Error('点读原件摘要不一致');return{entry,bytes};
  }
  // Bound read concurrency and memory; publishing and ledger writes stay sequential.
  for(let start=0;start<clips.length;start+=4){
   const batch=await Promise.all(clips.slice(start,start+4).map(readClip));
   for(const result of batch){if(!result)continue;const{entry,bytes}=result;if(length+bytes.length>8*1024*1024)await flush();entries.push({...entry,pack:packs.length,offset:length,length:bytes.length,digest:digest(bytes)});chunks.push(bytes);length+=bytes.length;}
   if((start+4)%100===0||start+4>=clips.length)console.log(`章节 ${c.chapter_id} 点读包：${Math.min(start+4,clips.length)}/${clips.length} 已核验`);
  }
  await flush();const manifest={chapterId:c.chapter_id,digest:c.digest,pointAudioPolicy,packs,clips:entries},bytes=Buffer.from(JSON.stringify(manifest)),key=`chapter-audio/${c.chapter_id}/${c.digest}/${digest(bytes)}.json`;await put(key,bytes,'application/json');await api('/publish-pack',{chapterId:c.chapter_id,digest:c.digest,manifestKey:key});
  await query(mainDatabase,'DELETE FROM chapter_audio_work WHERE chapter_id=? AND chapter_digest=? AND requested_at<=?',[c.chapter_id,c.digest,c.requested_at]);
 }
 console.log('章节音频包已更新，仅打包已经生成的点读');
}else throw Error('使用 migrate、backup 或 packs');
}catch(error){if(error.code==='D1_ARCHIVE_READ_BUDGET'){console.error(error.message);process.exitCode=78;}else throw error;}
