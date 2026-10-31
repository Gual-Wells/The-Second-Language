import {createHash} from 'node:crypto';
import {graphRequest} from './onedrive-local.mjs';
import {downloadStoredItem as downloadItem} from './series-storage-local.mjs';
import {DatabaseSync} from 'node:sqlite';
import path from 'node:path';
import {gunzipSync} from 'node:zlib';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function latestRecoverySnapshot({graph=graphRequest,download=downloadItem}={}){
 const root=await(await graph('/me/drive/special/approot')).json();
 const item=await(await graph(`/me/drive/items/${encodeURIComponent(root.id)}:/recovery-index.json`)).json();
 const index=await(await download(item.id)).json();if(index.version!==1||!Array.isArray(index.snapshots))throw Error('恢复索引无效');
 const latest=index.snapshots.at(-1);if(!latest)throw Error('没有独立恢复快照');
 const bytes=Buffer.from(await(await download(latest.itemId)).arrayBuffer());if(hash(bytes)!==latest.digest)throw Error('恢复清单摘要不一致');
 return JSON.parse(bytes.toString('utf8'));
}

// Default direct reads use only local provider credentials and immutable resource locators.
// They do not ask a production D1, publisher endpoint or chapter queue for recovery data.
export function createRecoveryReader(manifest,{direct=false,download=downloadItem,fetchObject}={}){
 return async(key,expected,compressed=false)=>{
  if(typeof expected!=='string'||!/^[a-f0-9]{64}$/.test(expected))throw Error('恢复资产摘要无效');
  const useDirect=direct||manifest.directResources;
  if(useDirect&&!manifest.resources?.[expected])throw Error('快照缺少独立恢复定位');
  if(!useDirect&&typeof fetchObject!=='function')throw Error('快照缺少恢复读取配置');
  const response=useDirect?await download(manifest.resources[expected]):await fetchObject(key,expected);
  if(!response.ok)throw Error(`恢复读取 ${response.status}`);
  const bytes=Buffer.from(await response.arrayBuffer());if(bytes.length>24*1024*1024||hash(bytes)!==expected)throw Error('备份摘要不一致或超过读取上限');
  return JSON.parse((compressed?gunzipSync(bytes,{maxOutputLength:256*1024*1024}):bytes).toString('utf8'));
 };
}

export async function restoreRecoveryDatabases(manifest,directory,get){
 const counts={};
 for(const name of ['main','practice']){
  const definition=manifest.databases.find(item=>item.database===name&&item.schemaKey);if(!definition)throw Error('缺少数据库结构');
  const schema=await get(definition.schemaKey,definition.digest),sqlite=new DatabaseSync(path.join(directory,`${name}.sqlite`));
  try{
   sqlite.exec('PRAGMA foreign_keys=OFF;');
   for(const object of schema.filter(item=>item.type==='table'))sqlite.exec(object.sql);
   let rows=0;
   for(const page of manifest.databases.filter(item=>item.database===name&&item.table)){
    const data=await get(page.key,page.digest,!!page.compressed);
    if(data.table!==page.table||!Array.isArray(data.rows)||page.rows!=null&&page.rows!==data.rows.length)throw Error('恢复数据页与结构身份不一致');
    const safe='"'+page.table.replaceAll('"','""')+'"',types=Object.fromEntries(sqlite.prepare(`PRAGMA table_info(${safe})`).all().map(item=>[item.name,item.type]));
    sqlite.exec('BEGIN');try{for(const row of data.rows){const columns=Object.keys(row),statement=`INSERT INTO ${safe} (${columns.map(column=>'"'+column.replaceAll('"','""')+'"').join(',')}) VALUES (${columns.map(()=>'?').join(',')})`;
     sqlite.prepare(statement).run(...columns.map(column=>types[column]==='BLOB'&&Array.isArray(row[column])?Buffer.from(row[column]):row[column]));rows++;}sqlite.exec('COMMIT');}catch(error){sqlite.exec('ROLLBACK');throw error;}
   }
   for(const object of schema.filter(item=>item.type!=='table'))sqlite.exec(object.sql);
   if(sqlite.prepare('PRAGMA integrity_check').get().integrity_check!=='ok'||sqlite.prepare('PRAGMA foreign_key_check').all().length)throw Error('恢复数据库完整性失败');
   counts[name]=rows;
  }finally{sqlite.close();}
 }
 return counts;
}
