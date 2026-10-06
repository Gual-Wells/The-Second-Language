import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {publisherConfig} from './lib/publisher-config.mjs';
import {root,downloadItem} from './lib/onedrive-local.mjs';
import {latestRecoverySnapshot} from './lib/recovery-snapshot.mjs';
const direct=process.argv.includes('--direct'),databasesOnly=process.argv.includes('--databases-only'),filename=process.argv.slice(2).find(x=>!['--direct','--databases-only'].includes(x));
let manifest,base,token;
if(direct&&!filename)manifest=await latestRecoverySnapshot();
else manifest=JSON.parse(await readFile(filename||path.join(root,'.cache/storage-upgrade/last-backup.json'),'utf8'));
if(!direct&&!manifest.directResources)({base,token}=await publisherConfig());
const directory=path.join(root,'.cache/storage-restore',new Date().toISOString().replace(/[:.]/g,'-'));await mkdir(directory,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
async function get(key,expected,compressed=false){const useDirect=direct||manifest.directResources;if(useDirect&&!manifest.resources?.[expected])throw Error('快照缺少独立恢复定位');const r=useDirect?await downloadItem(manifest.resources[expected]):await fetch(new URL(`/api/storage/objects?key=${encodeURIComponent(key)}&digest=${expected}`,base),{headers:{authorization:`Bearer ${token}`},signal:AbortSignal.timeout(90000)});if(!r.ok)throw Error(`恢复读取 ${r.status}`);const bytes=Buffer.from(await r.arrayBuffer());if(hash(bytes)!==expected)throw Error('备份摘要不一致');return JSON.parse((compressed?gunzipSync(bytes):bytes).toString('utf8'));}
const counts={};for(const name of ['main','practice']){
 const definition=manifest.databases.find(x=>x.database===name&&x.schemaKey);if(!definition)throw Error('缺少数据库结构');
 const schema=await get(definition.schemaKey,definition.digest),sqlite=new DatabaseSync(path.join(directory,`${name}.sqlite`));sqlite.exec('PRAGMA foreign_keys=OFF;');
 for(const object of schema.filter(x=>x.type==='table'))sqlite.exec(object.sql);
 let rows=0;
 for(const page of manifest.databases.filter(x=>x.database===name&&x.table)){
  const data=await get(page.key,page.digest,!!page.compressed),types=Object.fromEntries(sqlite.prepare(`PRAGMA table_info("${page.table.replaceAll('"','""')}")`).all().map(x=>[x.name,x.type]));
  sqlite.exec('BEGIN');try{for(const row of data.rows){const columns=Object.keys(row),sql=`INSERT INTO "${page.table.replaceAll('"','""')}" (${columns.map(c=>'"'+c.replaceAll('"','""')+'"').join(',')}) VALUES (${columns.map(()=>'?').join(',')})`;
    sqlite.prepare(sql).run(...columns.map(c=>types[c]==='BLOB'&&Array.isArray(row[c])?Buffer.from(row[c]):row[c]));rows++;}sqlite.exec('COMMIT');}catch(e){sqlite.exec('ROLLBACK');throw e;}
 }
 for(const object of schema.filter(x=>x.type!=='table'))sqlite.exec(object.sql);
 const integrity=sqlite.prepare('PRAGMA integrity_check').get();if(integrity.integrity_check!=='ok'||sqlite.prepare('PRAGMA foreign_key_check').all().length)throw Error('恢复数据库完整性失败');sqlite.close();counts[name]=rows;
}
let workingFiles=0;
for(const group of databasesOnly?[]:manifest.working||[]){
 const definition=await get(group.key,group.digest),files=new Map();
 for(const chunk of definition.chunks){const payload=await get(chunk.key,chunk.digest,true);for(const part of payload.files){const bytes=Buffer.from(part.data,'base64');if(hash(bytes)!==part.partDigest)throw Error('工作文稿分块校验失败');const entry=files.get(part.path)||{parts:[],size:0};if(part.offset!==entry.size)throw Error('工作文稿分块顺序错误');entry.parts.push(bytes);entry.size+=bytes.length;files.set(part.path,entry);}}
 const groupDirectory=path.resolve(directory,'working',definition.group);if(!groupDirectory.startsWith(directory+path.sep))throw Error('工作组路径无效');
 for(const file of definition.files){const entry=files.get(file.path),bytes=entry&&Buffer.concat(entry.parts);if(!bytes||bytes.length!==file.bytes||hash(bytes)!==file.digest)throw Error('工作文稿恢复校验失败');const target=path.resolve(groupDirectory,file.path);if(!target.startsWith(groupDirectory+path.sep))throw Error('工作文稿路径无效');await mkdir(path.dirname(target),{recursive:true});await writeFile(target,bytes);workingFiles++;}
}
await writeFile(path.join(directory,'verification.json'),JSON.stringify({source:manifest.createdAt,counts,workingFiles,workingVerification:databasesOnly?'skipped':'verified',integrity:'ok',foreignKeys:'ok'},null,2));console.log(`已在独立目录恢复验证：${JSON.stringify(counts)}；${databasesOnly?'本次仅核验数据库':workingFiles+' 份工作文稿'}；${directory}`);
