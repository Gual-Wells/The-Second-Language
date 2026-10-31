import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {permanentBucket,storageRoute,storageRequestEnvironment} from '../worker/src/storage.js';

const sql=new DatabaseSync(':memory:');
for(const name of ['0006_permanent_storage.sql','0007_archive_recovery.sql','0027_federated_content.sql'])sql.exec(await readFile(new URL('../worker/migrations/'+name,import.meta.url),'utf8'));
const db={prepare(statement){let values=[];return{bind(...args){values=args.map(value=>value instanceof ArrayBuffer?new Uint8Array(value):value);return this;},async first(){return sql.prepare(statement).get(...values)||null;},async run(){const value=sql.prepare(statement).run(...values);return{meta:{changes:Number(value.changes)}};},async all(){return{results:sql.prepare(statement).all(...values)};}};},async batch(statements){sql.exec('BEGIN');try{const results=[];for(const statement of statements)results.push(await statement.run());sql.exec('COMMIT');return results;}catch(error){sql.exec('ROLLBACK');throw error;}}};
const sha=value=>createHash('sha256').update(value).digest('hex'),encoder=new TextEncoder(),cases=[];
const secret=crypto.getRandomValues(new Uint8Array(32)),iv=crypto.getRandomValues(new Uint8Array(12)),key=await crypto.subtle.importKey('raw',secret,'AES-GCM',false,['encrypt']);
const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,encoder.encode(JSON.stringify({accessToken:'onedrive-private-fixture',expiresAt:Date.now()+3600000})));
sql.prepare('INSERT INTO storage_connection(id,credentials,updated_at) VALUES(1,?,?)').run(JSON.stringify({iv:Buffer.from(iv).toString('base64'),data:Buffer.from(encrypted).toString('base64')}),Date.now());
sql.prepare('INSERT INTO storage_folders VALUES(?,?)').run('@approot','fixture-root');
const legacy=new Map(),remote=new Map(),events=[];let graphStatus=null,hfFailure=false,corruptReadback=false,hfHeadFailure=false,recoveryIndexBytes=null;
const files={
 async head(digest){events.push('hf:head:'+digest);if(hfFailure||hfHeadFailure)throw Error('fixture HF authorization or quota unavailable');const bytes=remote.get(digest);return bytes?{digest,bytes:bytes.length}:null;},
 async get(digest){events.push('hf:get:'+digest);if(hfFailure||corruptReadback)throw Error('fixture HF read failed after accepted upload');const bytes=remote.get(digest);return bytes?{digest,bytes:new Uint8Array(bytes)}:null;},
 async put(bytes,mime){const digest=sha(bytes);events.push('hf:put:'+digest);if(hfFailure)throw Error('fixture HF write unavailable');const reused=remote.has(digest);if(!reused)remote.set(digest,Buffer.from(bytes));return{digest,bytes:bytes.byteLength,provider:'huggingface-s3',location:{namespace:'Gual-Wells',bucket:'second-language-assets',key:`objects/${digest.slice(0,2)}/${digest}.bin`},reused};},
 async readRange(digest,range){events.push('hf:range:'+digest);if(hfFailure)throw Error('fixture HF range unavailable');const bytes=remote.get(digest);if(!bytes)return null;const m=range.match(/^bytes=(\d*)-(\d*)$/),n=bytes.length;let first=m?.[1]?Number(m[1]):Math.max(0,n-Number(m?.[2])),last=m?.[1]?(m[2]?Math.min(n-1,Number(m[2])):n-1):n-1;
  if(!m||!m[1]&&!m[2]||first>last||first>=n)return{status:416,headers:{'content-range':`bytes */${n}`,'content-length':'0'},body:null};const part=bytes.subarray(first,last+1);return{status:206,headers:{'content-range':`bytes ${first}-${last}/${n}`,'content-length':String(part.length)},body:new Response(part).body,readMode:'buffered-verified'};
 }
};
const environment=extra=>storageRequestEnvironment({DB:db,ONEDRIVE_KEY:Buffer.from(secret).toString('base64'),ONEDRIVE_ENABLED:'true',FEDERATED_FILES_ENABLED:'true',FILES:files,...extra});
const savedFetch=globalThis.fetch;
globalThis.fetch=async(target,options={})=>{
 const url=new URL(target);assert.equal(url.origin,'https://graph.microsoft.com','No external network or generation provider is allowed');assert.equal(new Headers(options.headers).get('authorization'),'Bearer onedrive-private-fixture');
 const route=decodeURIComponent(url.pathname.replace('/v1.0','')),method=options.method||'GET';events.push('graph:'+method+':'+route);
 if(graphStatus)return Response.json({error:{code:'fixture_permission_or_quota_error'}},{status:graphStatus});
 if(route==='/me/drive/special/approot')return Response.json({id:'fixture-root'});
 if(route==='/me/drive/items/fixture-root:/recovery-index.json')return recoveryIndexBytes?Response.json({id:'fixture-recovery-index',size:recoveryIndexBytes.length}):Response.json({error:{code:'itemNotFound'}},{status:404});
 if(route==='/me/drive/items/fixture-root:/recovery-index.json:/content'&&method==='PUT'){recoveryIndexBytes=Buffer.from(options.body);return Response.json({id:'fixture-recovery-index',size:recoveryIndexBytes.length});}
 if(route==='/me/drive/items/fixture-recovery-index/content')return new Response(recoveryIndexBytes);
 let match=route.match(/^\/me\/drive\/items\/fixture-root:\/(objects-[a-f0-9]{2})$/);if(match)return Response.json({id:match[1]});
 match=route.match(/^\/me\/drive\/items\/objects-[a-f0-9]{2}:\/([a-f0-9]{64})\.bin(:\/content)?$/);
 if(match){const digest=match[1];if(method==='PUT'){const bytes=Buffer.from(options.body);legacy.set(digest,bytes);return Response.json({id:'legacy-'+digest,size:bytes.length});}return legacy.has(digest)?Response.json({id:'legacy-'+digest,size:legacy.get(digest).length}):Response.json({error:{code:'itemNotFound'}},{status:404});}
 match=route.match(/^\/me\/drive\/items\/legacy-([a-f0-9]{64})\/content$/);if(match){const bytes=legacy.get(match[1]);if(!bytes)return Response.json({error:{code:'itemNotFound'}},{status:404});const range=new Headers(options.headers).get('range');if(range){const [first,last]=range.slice(6).split('-').map(Number);return new Response(bytes.subarray(first,last+1),{status:206,headers:{'content-range':`bytes ${first}-${last}/${bytes.length}`,'content-length':String(last-first+1)}});}return new Response(bytes);}
 throw Error('Unexpected fixture Graph route '+method+' '+route);
};
async function check(name,run){await run();cases.push(name);}
function remoteRows(){return sql.prepare('SELECT count(*) n FROM storage_remote_content').get().n;}
try{
 await check('previously generated OneDrive CAS bytes win before any new-provider probe or write',async()=>{
  const bytes=Buffer.from('Previously paid original audio ID3'),digest=sha(bytes);legacy.set(digest,bytes);const before=events.length;
  const result=await permanentBucket(environment()).putContent(bytes,'audio/mpeg');assert.equal(result.itemId,'legacy-'+digest);assert.equal(result.provider,'onedrive');assert.deepEqual(Buffer.from(await(await permanentBucket(environment()).getContent(digest)).arrayBuffer()),bytes);
  assert(!events.slice(before).some(event=>event.startsWith('hf:')));assert.equal(remoteRows(),0);
 });
 await check('new compact CAS writes use HF only after OneDrive really reports 404, preserve full SHA and avoid generic logical rows',async()=>{
  const bytes=Buffer.from('A new evidence fixture'),digest=sha(bytes),before=events.length;
  const saved=await permanentBucket(environment()).putContent(bytes,'application/json');assert.equal(saved.itemId,'hf-v1:'+digest);assert.equal(saved.provider,'huggingface-s3');assert.equal(saved.location.bucket,'second-language-assets');assert.equal(remoteRows(),1);assert.equal(sql.prepare('SELECT count(*) n FROM storage_blobs').get().n,0);
  const sequence=events.slice(before),oldLookup=sequence.findIndex(event=>event.startsWith('graph:GET:')&&event.endsWith('/'+digest+'.bin')),newProbe=sequence.findIndex(event=>event==='hf:head:'+digest);assert(oldLookup>=0&&newProbe>oldLookup);assert(!sequence.some(event=>event.startsWith('graph:PUT:')));
  const replay=await permanentBucket(environment()).putContent(bytes);assert.equal(replay.reused,true);assert.equal(remoteRows(),1);
 });
 await check('logical key and historical digest URLs preserve old OneDrive versions while the new version uses an opaque HF handle',async()=>{
  const key='chapters/federated-fixture.md',old=Buffer.from('Pinned original chapter'),current=Buffer.from('New chapter revision'),oldDigest=sha(old),digest=sha(current);legacy.set(oldDigest,old);
  sql.prepare('INSERT INTO storage_blobs VALUES(?,?,?,?)').run(oldDigest,'legacy-'+oldDigest,old.length,Date.now());sql.prepare('INSERT INTO storage_versions VALUES(?,?,?,?)').run(key,oldDigest,'text/markdown',Date.now());sql.prepare('INSERT INTO storage_objects VALUES(?,?,?,?)').run(key,oldDigest,'text/markdown',Date.now());
  const result=await permanentBucket(environment()).put(key,current,{httpMetadata:{contentType:'text/markdown'}});assert.equal(result.digest,digest);assert.equal(sql.prepare('SELECT item_id FROM storage_blobs WHERE digest=?').get(digest).item_id,'hf-v1:'+digest);
  const context={isPublisher:true},base='https://fixture.invalid/api/storage/objects?key='+encodeURIComponent(key);
  assert.equal(await(await storageRoute(new Request(base+'&digest='+oldDigest),environment(),context)).text(),old.toString());assert.equal(await(await storageRoute(new Request(base),environment(),context)).text(),current.toString());assert.equal(sql.prepare('SELECT count(*) n FROM storage_versions WHERE object_key=?').get(key).n,2);
  assert.equal(sql.prepare('SELECT item_id FROM storage_blobs WHERE digest=?').get(oldDigest).item_id,'legacy-'+oldDigest);
 });
 await check('HF range and HEAD preserve existing URL semantics without forwarding a native handle to Graph',async()=>{
  const key='chapters/federated-fixture.md',digest=sql.prepare('SELECT digest FROM storage_objects WHERE object_key=?').get(key).digest,bucket=permanentBucket(environment()),before=events.length;
  const range=await bucket.response(key,new Request('https://fixture.invalid/',{headers:{range:'bytes=2-8'}}));assert.equal(range.status,206);assert.deepEqual(Buffer.from(await range.arrayBuffer()),remote.get(digest).subarray(2,9));assert.equal(range.headers.get('cache-control'),'private, no-store');
  const head=await bucket.response(key,new Request('https://fixture.invalid/',{method:'HEAD'}));assert.equal(head.status,200);assert.equal(head.headers.get('content-length'),String(remote.get(digest).length));assert.equal(await head.text(),'');
  assert(!events.slice(before).some(event=>event.startsWith('graph:')));
  const invalid=await bucket.response(key,new Request('https://fixture.invalid/',{headers:{range:'bytes=0-1,5-6'}}));assert.equal(invalid.status,416);
  const fallback=permanentBucket(environment({FILES:{...files,readRange:undefined}})),part=await fallback.response(key,new Request('https://fixture.invalid/',{headers:{range:'bytes=-4'}}));assert.equal(part.status,206);assert.deepEqual(Buffer.from(await part.arrayBuffer()),remote.get(digest).subarray(-4));
 });
 await check('rolling the write flag back leaves existing HF pointers readable and still routes old item IDs only to Graph',async()=>{
  const key='chapters/federated-fixture.md',env=environment({FEDERATED_FILES_ENABLED:'false'}),value=await permanentBucket(env).get(key);assert.equal(await value.text(),'New chapter revision');
  const digest=sql.prepare('SELECT digest FROM storage_objects WHERE object_key=?').get(key).digest,before=events.length;assert.equal((await permanentBucket(env).contentHead(digest)).bytes,remote.get(digest).length);assert(!events.slice(before).some(event=>event.startsWith('graph:')));
  const bytes=Buffer.from('Flag-disabled new data'),oldWrites=events.filter(event=>event.startsWith('hf:put')).length;const saved=await permanentBucket(env).putContent(bytes);assert.equal(saved.provider,'onedrive');assert.equal(events.filter(event=>event.startsWith('hf:put')).length,oldWrites);
 });
 await check('old-provider errors stay strict for reads while supplied complete bytes can form a verified same-SHA safety copy without generation',async()=>{
  for(const status of [401,403,429,503]){const bytes=Buffer.from('supplied full original bytes during provider error '+status),digest=sha(bytes);legacy.set(digest,bytes);graphStatus=status;
   const before=events.length;await assert.rejects(()=>permanentBucket(environment()).contentHead(digest),new RegExp('\\('+status+','));assert(!events.slice(before).some(event=>event.startsWith('hf:')));
   const copied=await permanentBucket(environment()).putContent(bytes);assert.equal(copied.digest,digest);assert.equal(copied.recoveredFromSuppliedBytes,true);assert.deepEqual(remote.get(digest),bytes);assert.deepEqual(legacy.get(digest),bytes);assert(!events.slice(before).some(event=>event.startsWith('graph:PUT:')));
  }graphStatus=null;
  const row=sql.prepare('SELECT digest FROM storage_objects WHERE object_key=?').get('chapters/federated-fixture.md'),snapshot=sql.prepare('SELECT * FROM storage_blobs WHERE digest=?').get(row.digest);
  hfFailure=true;await assert.rejects(()=>permanentBucket(environment()).contentHead(row.digest),/unavailable/);await assert.rejects(()=>permanentBucket(environment()).getContent(row.digest),/unavailable/);const unavailable=await storageRoute(new Request('https://fixture.invalid/api/storage/objects?key=chapters%2Ffederated-fixture.md'),environment(),{isPublisher:true});assert.equal(unavailable.status,503);hfFailure=false;
  assert.deepEqual(sql.prepare('SELECT * FROM storage_blobs WHERE digest=?').get(row.digest),snapshot);
 });
 await check('an accepted upload without full readback never records a logical success; explicit retry reuses the original bytes',async()=>{
  const key='fixtures/recoverable.json',bytes=Buffer.from('Recoverable fixture after interrupted verification'),digest=sha(bytes),prior=remoteRows();corruptReadback=true;
  await assert.rejects(()=>permanentBucket(environment()).put(key,bytes),/read failed/);assert.equal(remoteRows(),prior);assert.equal(sql.prepare('SELECT count(*) n FROM storage_objects WHERE object_key=?').get(key).n,0);assert(remote.has(digest));corruptReadback=false;
  const saved=await permanentBucket(environment()).put(key,bytes);assert.equal(saved.digest,digest);assert.equal(await(await permanentBucket(environment()).get(key)).text(),bytes.toString());assert.equal(remoteRows(),prior+1);
 });
 await check('oversized writes fail before I/O, missing FILES preserves the legacy path, and native pointers never fall back to Graph',async()=>{
  const before=events.length;await assert.rejects(()=>permanentBucket(environment()).putContent(new Uint8Array(24*1024*1024+1)),/24 MiB/);assert.equal(events.length,before);
  const bytes=Buffer.from('No FILES binding keeps legacy compatibility'),result=await permanentBucket(environment({FILES:undefined})).putContent(bytes);assert.equal(result.provider,'onedrive');
  const key='chapters/federated-fixture.md',after=events.length;await assert.rejects(()=>permanentBucket(environment({FILES:undefined})).get(key),/尚未连接/);assert.equal(events.length,after);
 });
 await check('recovery-purpose CAS verifies bytes and returns a stable handle without any database read or self-registration',async()=>{
  const bytes=Buffer.from('Recovery fixture chunk without recursive database mapping'),prior=remoteRows(),before=events.length;
  const noDatabase=environment({DB:{prepare(){throw Error('Recovery CAS must not access D1');}}});
  const response=await storageRoute(new Request('https://fixture.invalid/api/storage/content',{method:'PUT',headers:{'content-type':'application/octet-stream','x-storage-purpose':'recovery'},body:bytes}),noDatabase,{isPublisher:true});
  assert.equal(response.status,200);const result=await response.json();assert.equal(result.itemId,'hf-v1:'+sha(bytes));assert.equal(result.digest,sha(bytes));assert.equal(result.provider,'huggingface-s3');assert.equal(remoteRows(),prior);
  assert(!events.slice(before).some(event=>event.startsWith('graph:')));assert(remote.has(sha(bytes)));
 });
 await check('recovery-index publication reads the new unregistered HF manifest through its typed handle and preserves its locator',async()=>{
  const manifest=Buffer.from(JSON.stringify({databases:[],resources:{synthetic:true}})),prior=remoteRows(),saved=await permanentBucket(environment()).putContent(manifest,'application/json',{register:false});
  const response=await storageRoute(new Request('https://fixture.invalid/api/storage/recovery-index',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({key:'backups/fixture/manifest.json',digest:saved.digest,itemId:saved.itemId})}),environment(),{isPublisher:true});
  assert.equal(response.status,200);assert.equal((await response.json()).snapshots,1);assert.equal(remoteRows(),prior);const index=JSON.parse(recoveryIndexBytes);assert.equal(index.snapshots[0].itemId,'hf-v1:'+saved.digest);assert.equal(index.snapshots[0].digest,saved.digest);
 });
 assert.deepEqual(sql.prepare('PRAGMA foreign_key_check').all(),[]);
 console.log(JSON.stringify({passed:cases.length,cases,externalRequests:0,paidGenerationCalls:0,existingPaidAssetsDeleted:0},null,2));
}finally{globalThis.fetch=savedFetch;sql.close();}
