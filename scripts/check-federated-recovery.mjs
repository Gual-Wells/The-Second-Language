// Real SQLite reconstruction and real signed-provider adapter, using synthetic in-memory objects.
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFile,mkdir,mkdtemp,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {rowidPages} from './lib/storage-scan.mjs';
import {latestRecoverySnapshot,createRecoveryReader,restoreRecoveryDatabases} from './lib/recovery-snapshot.mjs';
import {downloadStoredItem,projectFilesFromCredentials} from './lib/series-storage-local.mjs';

const base=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../.cache/series-storage-20261031/recovery-fixtures');await mkdir(base,{recursive:true});
const directory=await mkdtemp(path.join(base,'verification-'));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex'),legacy=new Map(),hf=new Map(),payloads=new Map(),events=[],cases=[];
let sequence=0,corruptLegacy=null;
const manifest={version:3,createdAt:'2026-10-31T00:00:00.000Z',directResources:true,databases:[],working:[],resources:{}};
function save(bytes,provider){bytes=Buffer.from(bytes);const digest=sha(bytes);payloads.set(digest,bytes);const locator=provider==='hf'?{version:2,provider:'huggingface-s3',project:'language',digest}:'drive-fixture-'+digest;manifest.resources[digest]=locator;if(provider==='hf')hf.set(digest,bytes);else legacy.set(locator,bytes);return digest;}
const source={main:new DatabaseSync(':memory:'),practice:new DatabaseSync(':memory:')};
source.main.exec('CREATE TABLE parent(id INTEGER PRIMARY KEY,title TEXT);CREATE TABLE child(id INTEGER PRIMARY KEY,parent_id INTEGER REFERENCES parent(id),data BLOB);');
source.main.exec(await readFile(new URL('../worker/migrations/0027_federated_content.sql',import.meta.url),'utf8'));
source.main.prepare('INSERT INTO parent VALUES(?,?)').run(7,'Synthetic original');source.main.prepare('INSERT INTO child VALUES(?,?,?)').run(23,7,Buffer.from([0,1,255,64]));
source.main.prepare('INSERT INTO storage_remote_pools(id,provider,namespace,bucket) VALUES(5,?,?,?)').run('huggingface-s3','Gual-Wells','second-language-assets');
for(const [id,label] of [[99,'first'],[137,'second']])source.main.prepare('INSERT INTO storage_remote_content(id,digest,pool_id,bytes,verified_at) VALUES(?,?,?,?,?)').run(id,Buffer.from(sha(label),'hex'),5,100,123456);
source.practice.exec('CREATE TABLE practice_sets(id TEXT PRIMARY KEY);CREATE TABLE practice_answers(id INTEGER PRIMARY KEY,set_id TEXT REFERENCES practice_sets(id),audio_digest BLOB);');
source.practice.prepare('INSERT INTO practice_sets VALUES(?)').run('fixture-set');source.practice.prepare('INSERT INTO practice_answers VALUES(?,?,?)').run(41,'fixture-set',Buffer.from(sha('old paid audio identity'),'hex'));
const query=async(database,statement,params=[])=>source[database].prepare(statement).all(...params);
async function recordPage(database,table,rows){const json=Buffer.from(JSON.stringify({table,rows:rows.map(row=>Object.fromEntries(Object.entries(row).map(([key,value])=>[key,value instanceof Uint8Array?Array.from(value):value])))})),bytes=gzipSync(json),digest=save(bytes,++sequence%2?'hf':'legacy');manifest.databases.push({database,table,key:`fixture/${database}/${table}/${digest}.json.gz`,digest,rows:rows.length,compressed:true});}
for(const database of ['main','practice']){
 const schema=await query(database,"SELECT type,name,sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY type,name"),digest=save(Buffer.from(JSON.stringify(schema)),database==='main'?'legacy':'hf');
 manifest.databases.push({database,schemaKey:`fixture/${database}/schema.json`,digest});
 for(const {name:table} of await query(database,"SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"))for await(const rows of rowidPages(query,database,table,{pageSize:1}))await recordPage(database,table,rows);
}
// Exercise the real high-water continuation for the new main mapping table, preserving ID gaps.
source.main.prepare('INSERT INTO storage_remote_content(id,digest,pool_id,bytes,verified_at) VALUES(300,?,5,101,123457)').run(Buffer.from(sha('third'),'hex'));
const incremental=[];for await(const rows of rowidPages(query,'main','storage_remote_content',{after:137,endAt:300,pageSize:1})){incremental.push(...rows);await recordPage('main','storage_remote_content',rows);}
assert.deepEqual(incremental.map(row=>row.id),[300]);manifest.immutable={tables:{storage_remote_content:{last:300,reusedRows:2,addedRows:1}}};
const fetchFixture=async(input,options={})=>{
 const request=input instanceof Request?input:new Request(input,options),url=new URL(request.url);assert.equal(url.origin,'https://s3.hf.co');assert(url.pathname.startsWith('/Gual-Wells/second-language-assets/objects/'));assert.match(request.headers.get('authorization'),/^AWS4-HMAC-SHA256 Credential=HFAK_fixture\//);events.push('hf:'+request.method);
 const digest=url.pathname.split('/').at(-1).replace('.bin',''),bytes=hf.get(digest);if(!bytes)return new Response(null,{status:404});return new Response(request.method==='HEAD'?null:bytes,{headers:{'content-length':String(bytes.length)}});
};
// Malicious credential-file extras must not override the fixed project namespace/bucket/fetch.
const store=projectFilesFromCredentials('language',{accessKeyId:'HFAK_fixture',secretAccessKey:'fixture-secret-only',namespace:'other-user',bucket:'other-project',fetchImpl:()=>{throw Error('Credential metadata must never choose transport');}},{fetchImpl:fetchFixture});
const download=(locator,range)=>downloadStoredItem(locator,range,{filesFactory:async project=>{assert.equal(project,'language');return store;},legacyDownload:async(item,range)=>{assert.equal(range,null);events.push('legacy:GET');assert(legacy.has(item),'Fixture legacy item must exist');return new Response(item===corruptLegacy?Buffer.from('corrupted'):legacy.get(item));}});
const offlinePublisher=()=>{throw Error('Production D1/publisher is unavailable and must not participate');};
async function check(name,operation){await operation();cases.push(name);}
try{
 await check('version3 mixed typed-HF and legacy locators restore real SQLite including BLOBs, original IDs and immutable pool relationships without production D1',async()=>{
  const output=path.join(directory,'v3');await mkdir(output);const reader=createRecoveryReader(manifest,{direct:true,download,fetchObject:offlinePublisher});const counts=await restoreRecoveryDatabases(manifest,output,reader);assert.equal(counts.main,6);assert.equal(counts.practice,2);
  const restored=new DatabaseSync(path.join(output,'main.sqlite'));try{assert.equal(restored.prepare('PRAGMA integrity_check').get().integrity_check,'ok');assert.deepEqual(restored.prepare('PRAGMA foreign_key_check').all(),[]);assert.deepEqual(restored.prepare('SELECT id,rowid AS checked_rowid,pool_id FROM storage_remote_content ORDER BY id').all().map(row=>[row.id,row.checked_rowid,row.pool_id]),[[99,99,5],[137,137,5],[300,300,5]]);assert.deepEqual(Buffer.from(restored.prepare('SELECT data FROM child WHERE id=23').get().data),Buffer.from([0,1,255,64]));assert.throws(()=>restored.exec('DELETE FROM storage_remote_content'),/immutable/);assert.throws(()=>restored.exec('UPDATE storage_remote_pools SET namespace=\'changed\''),/immutable/);}finally{restored.close();}
  assert(events.includes('legacy:GET'));assert(events.some(event=>event.startsWith('hf:')));
 });
 await check('version2 all-OneDrive resource strings remain directly recoverable with the same schema and row identities',async()=>{
  const v2={...manifest,version:2,resources:{}};for(const [digest,bytes] of payloads){const item='old-v2-'+digest;legacy.set(item,bytes);v2.resources[digest]=item;}
  const output=path.join(directory,'v2');await mkdir(output);const counts=await restoreRecoveryDatabases(v2,output,createRecoveryReader(v2,{download,fetchObject:offlinePublisher}));assert.equal(counts.main,6);assert.equal(counts.practice,2);
 });
 await check('an independent OneDrive recovery index can point to an hf-v1 manifest without a publisher/database lookup',async()=>{
  const bytes=Buffer.from(JSON.stringify(manifest)),digest=sha(bytes);hf.set(digest,bytes);legacy.set('recovery-index',Buffer.from(JSON.stringify({version:1,snapshots:[{digest,itemId:'hf-v1:'+digest}]})));
  const graph=async route=>{if(route==='/me/drive/special/approot')return Response.json({id:'fixture-root'});assert.equal(route,'/me/drive/items/fixture-root:/recovery-index.json');return Response.json({id:'recovery-index'});};
  const latest=await latestRecoverySnapshot({graph,download});assert.equal(latest.version,3);assert.equal(latest.databases.length,manifest.databases.length);assert.deepEqual(latest.immutable,manifest.immutable);
 });
 await check('a legacy non-direct version2 snapshot still uses the fixed key and expected digest route',async()=>{
  const v2={version:2,databases:manifest.databases},reader=createRecoveryReader(v2,{fetchObject:async(key,digest)=>{assert(key.startsWith('fixture/'));return new Response(payloads.get(digest));},download:()=>{throw Error('Old non-direct route must not select a provider locator');}});
  const first=manifest.databases.find(item=>item.schemaKey);assert(Array.isArray(await reader(first.schemaKey,first.digest)));
 });
 await check('invalid locator fields, cross-project routing, changed bytes and mismatched page identity cannot yield a valid restore',async()=>{
  for(const locator of [{version:2,provider:'huggingface-s3',project:'algorithm',digest:'a'.repeat(64)},{version:2,provider:'huggingface-s3',project:'language',digest:'a'.repeat(64),url:'https://untrusted.invalid/'},'',{},'hf-v1:bad'])await assert.rejects(()=>download(locator),/定位无效/);
  const first=manifest.databases.find(item=>item.schemaKey),locator=manifest.resources[first.digest];assert.equal(typeof locator,'string');corruptLegacy=locator;await assert.rejects(()=>createRecoveryReader(manifest,{download})(first.schemaKey,first.digest),/摘要不一致/);corruptLegacy=null;
  const wrong={...manifest,databases:manifest.databases.map(item=>item.table==='child'?{...item,table:'parent'}:item)},output=path.join(directory,'bad-page');await mkdir(output);await assert.rejects(()=>restoreRecoveryDatabases(wrong,output,createRecoveryReader(wrong,{download})),/身份不一致/);
 });
 await check('a relationally incomplete reconstructed snapshot fails actual foreign-key checking',async()=>{
  const orphan={...manifest,databases:manifest.databases.filter(item=>item.table!=='parent')},output=path.join(directory,'orphan');await mkdir(output);await assert.rejects(()=>restoreRecoveryDatabases(orphan,output,createRecoveryReader(orphan,{download})),/完整性失败/);
 });
 const result={passed:cases.length,cases,outputDirectory:directory,syntheticOnly:true,productionD1ReadOrWrite:false,externalRequests:0,paidCalls:0,scope:'Reader/locator/real SQLite fixture verification; not proof of a full production snapshot or working-artifact backup'};
 await writeFile(path.join(directory,'verification.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{source.main.close();source.practice.close();}
