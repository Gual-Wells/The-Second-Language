import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {publisherConfig} from './lib/publisher-config.mjs';
import {cloudflare,kvKeys,queryDetailed,mainDatabase,practiceDatabase} from './lib/cloudflare-local.mjs';
import {root} from './lib/onedrive-local.mjs';
import {archiveWorking} from './lib/work-archives.mjs';
import {rowidPages,permanentRows,storageTableOrder} from './lib/storage-scan.mjs';
import {archiveQuery} from './lib/archive-read-budget.mjs';
try{
const {base,token}=await publisherConfig(),mode=process.argv[2]||'migrate',directory=path.join(root,'.cache/storage-upgrade');await mkdir(directory,{recursive:true});
const query=await archiveQuery(queryDetailed,path.join(directory,'read-budget.json'));
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
let ledger={};try{ledger=JSON.parse(await readFile(path.join(directory,'upload-ledger.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;
 for await(const rows of rowidPages(query,mainDatabase,'storage_objects',{pageSize:1000,projection:'t.object_key AS key,t.digest,b.bytes',join:'JOIN storage_blobs b ON b.digest=t.digest'}))for(const row of rows)ledger[row.key]=row;
 await writeFile(path.join(directory,'upload-ledger.json'),JSON.stringify(ledger));
}
async function api(route,body=null,method='POST',mime='application/json'){const r=await fetch(new URL(`/api/storage${route}`,base),{method,headers:{authorization:`Bearer ${token}`,'content-type':mime},...(body!==null?{body:Buffer.isBuffer(body)?body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(180000)});if(!r.ok){const error=await r.json().catch(()=>({}));throw Error(`归档接口 ${r.status}: ${error.error||'request_failed'}`);}return r;}
async function put(key,bytes,mime='application/octet-stream'){const hash=digest(bytes);if(ledger[key]?.digest===hash)return ledger[key];const result=await(await api(`/objects?key=${encodeURIComponent(key)}`,bytes,'PUT',mime)).json();if(result.digest!==hash)throw Error('上传摘要不同');ledger[key]=result;await writeFile(path.join(directory,'upload-ledger.json'),JSON.stringify(ledger));return result;}
if(mode==='backup'){
 const stamp=new Date().toISOString().replace(/[:.]/g,'-'),manifest={createdAt:new Date().toISOString(),databases:[],temporaryPolicy:'48-hour temporary content is excluded from permanent exports'};
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
   for await(const page of rowidPages(query,id,table)){
    const rows=permanentRows(table,page,neededDigests);
    if(!rows.length)continue;const bytes=Buffer.from(JSON.stringify({table,rows}));if(bytes.length>20*1024*1024)throw Error(`请为 ${table} 配置更小的分页`);
    const types=Object.fromEntries(validation.prepare(`PRAGMA table_info(${safe})`).all().map(x=>[x.name,x.type]));
    for(const row of rows){const columns=Object.keys(row),insert=`INSERT INTO ${safe} (${columns.map(c=>'"'+c.replaceAll('"','""')+'"').join(',')}) VALUES (${columns.map(()=>'?').join(',')})`;validation.prepare(insert).run(...columns.map(c=>types[c]==='BLOB'&&Array.isArray(row[c])?Buffer.from(row[c]):row[c]));}
    const key=`backups/chunks/${name}/${table}/${digest(bytes)}.json`;await put(key,bytes,'application/json');manifest.databases.push({database:name,table,key,digest:digest(bytes),rows:rows.length});
   }
  }
  for(const object of preserved.filter(x=>x.type!=='table'))validation.exec(object.sql);
  if(validation.prepare('PRAGMA integrity_check').get().integrity_check!=='ok'||validation.prepare('PRAGMA foreign_key_check').all().length)throw Error(`${name} 快照发生并发变化，未发布恢复清单，请稍后重新归档`);validation.close();
 }
 const dependencies=[...manifest.databases.map(x=>({key:x.key||x.schemaKey,digest:x.digest})),...manifest.working.flatMap(x=>[{key:x.key,digest:x.digest},...x.chunks])];manifest.resources={};
 for(let start=0;start<dependencies.length;start+=500){const rows=await query(mainDatabase,"SELECT v.digest,b.item_id FROM json_each(?) j JOIN storage_versions v ON v.object_key=json_extract(j.value,'$.key') AND v.digest=json_extract(j.value,'$.digest') JOIN storage_blobs b USING(digest)",[JSON.stringify(dependencies.slice(start,start+500))]);for(const row of rows)manifest.resources[row.digest]=row.item_id;}
 if(dependencies.some(x=>!manifest.resources[x.digest]))throw Error('恢复资产定位不完整，未发布快照');
 const manifestKey=`backups/${stamp}/manifest.json`,saved=await put(manifestKey,Buffer.from(JSON.stringify(manifest,null,2)),'application/json');await api('/recovery-index',{key:manifestKey,digest:saved.digest});await writeFile(path.join(directory,'last-backup.json'),JSON.stringify(manifest,null,2));console.log(`已归档 ${manifest.databases.length} 份结构/数据页，完整性及外键核验通过，独立恢复索引已更新`);
}else if(mode==='migrate'){
 const status=await(await api('/status',null,'GET')).json();
 const report={at:new Date().toISOString(),assets:[],pronunciation:0};
 const chapters=await query(mainDatabase,'SELECT r.content_key FROM chapter_revisions r LEFT JOIN storage_objects o ON o.object_key=r.content_key WHERE o.object_key IS NULL');
 const legacy=await kvKeys('cd0a805ac55146d599f70a32fa9aa0f2'),known=legacy.length?await query(mainDatabase,'SELECT object_key FROM storage_objects WHERE object_key IN (SELECT value FROM json_each(?))',[JSON.stringify(legacy.map(x=>x.name))]):[],pending=await query(mainDatabase,'SELECT object_key FROM storage_pending'),knownSet=new Set(known.map(x=>x.object_key)),pendingSet=new Set(pending.map(x=>x.object_key));
 for(const [namespace,keys] of [['c06595e0069247cd8cf702ac9756cdea',chapters.map(x=>({name:x.content_key}))],['cd0a805ac55146d599f70a32fa9aa0f2',legacy.filter(x=>!knownSet.has(x.name)||pendingSet.has(x.name))]]){
  for(const {name,metadata} of keys){const r=await cloudflare(`/storage/kv/namespaces/${namespace}/values/${encodeURIComponent(name)}`),bytes=Buffer.from(await r.arrayBuffer());const saved=await put(name,bytes,metadata?.mime||(name.endsWith('.md')?'text/markdown':'application/octet-stream'));report.assets.push({key:name,...saved});}
 }
 const clips=await query(practiceDatabase,"SELECT id,hex(audio) AS audio_hex FROM pronunciation_audio WHERE state='ready' AND audio IS NOT NULL");
 for(const row of clips){const key=`pronunciation/${row.id}.mp3`,bytes=Buffer.from(row.audio_hex,'hex');await put(key,bytes,'audio/mpeg');
  const fetched=Buffer.from(await(await api(`/objects?key=${encodeURIComponent(key)}`,null,'GET')).arrayBuffer());if(digest(fetched)!==digest(bytes))throw Error('音频迁移回读失败');
  await query(practiceDatabase,`UPDATE pronunciation_audio SET audio_key=?${status.active?',audio=NULL':''} WHERE id=? AND hex(audio)=?`,[key,row.id,row.audio_hex]);report.pronunciation++;
 }
 await writeFile(path.join(directory,'migration.json'),JSON.stringify(report,null,2));console.log(`已核验迁移 ${report.assets.length} 个文件、${report.pronunciation} 段点读；保留旧 KV 副本`);
}else if(mode==='packs'){
 const chapters=await query(mainDatabase,'SELECT chapter_id,chapter_digest AS digest,requested_at FROM chapter_audio_work');
 for(const c of chapters){
  const clips=await query(practiceDatabase,`SELECT p.id,p.request_json,p.audio_key FROM chapter_pronunciation l JOIN pronunciation_audio p ON p.id=l.audio_id WHERE l.chapter_id=? AND l.chapter_digest=? AND p.state='ready' AND p.audio_key IS NOT NULL`,[c.chapter_id,c.digest]);
  if(!clips.length)continue;const chunks=[],packs=[],entries=[];let length=0;
  async function flush(){if(!chunks.length)return;const bytes=Buffer.concat(chunks),key=`chapter-audio/${c.chapter_id}/${c.digest}/${digest(bytes)}.bin`;await put(key,bytes);packs.push({key,bytes:bytes.length,digest:digest(bytes)});chunks.length=0;length=0;}
  for(const clip of clips){const bytes=Buffer.from(await(await api(`/objects?key=${encodeURIComponent(clip.audio_key)}`,null,'GET')).arrayBuffer());if(length+bytes.length>8*1024*1024)await flush();const descriptor=JSON.parse(clip.request_json);entries.push({id:clip.id,text:descriptor.input,voice:descriptor.voice,pack:packs.length,offset:length,length:bytes.length,digest:digest(bytes)});chunks.push(bytes);length+=bytes.length;}
  await flush();const manifest={chapterId:c.chapter_id,digest:c.digest,packs,clips:entries},bytes=Buffer.from(JSON.stringify(manifest)),key=`chapter-audio/${c.chapter_id}/${c.digest}/${digest(bytes)}.json`;await put(key,bytes,'application/json');await api('/publish-pack',{chapterId:c.chapter_id,digest:c.digest,manifestKey:key});
  await query(mainDatabase,'DELETE FROM chapter_audio_work WHERE chapter_id=? AND chapter_digest=? AND requested_at<=?',[c.chapter_id,c.digest,c.requested_at]);
 }
 console.log('章节音频包已更新，仅打包已经生成的点读');
}else throw Error('使用 migrate、backup 或 packs');
}catch(error){if(error.code==='D1_ARCHIVE_READ_BUDGET'){console.error(error.message);process.exitCode=78;}else throw error;}
