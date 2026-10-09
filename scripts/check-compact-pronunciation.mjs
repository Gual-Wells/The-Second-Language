import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pronunciationRoute} from '../worker/src/pronunciation.js';
import {permanentBucket} from '../worker/src/storage.js';
import {digestBytes} from '../worker/src/pronunciation-store.js';
import {rowidPages} from './lib/storage-scan.mjs';
import {ttsModel,defaultVoice,voicePolicyVersion} from '../protocol/voices.mjs';
const db=new DatabaseSync(':memory:');
for(const file of ['worker/migrations/0006_permanent_storage.sql','worker/migrations/0007_archive_recovery.sql','worker/practice_migrations/0005_pronunciation.sql','worker/practice_migrations/0006_permanent_audio.sql','worker/practice_migrations/0007_compact_pronunciation.sql','worker/practice_migrations/0008_compact_chapter_links.sql'])db.exec(await readFile(new URL('../'+file,import.meta.url),'utf8'));
db.exec('CREATE TABLE chapter_revisions(chapter_id TEXT,digest TEXT);CREATE TABLE published_chapters(chapter_id TEXT);CREATE TABLE chapter_audio_work(chapter_id TEXT,chapter_digest TEXT,requested_at INTEGER,PRIMARY KEY(chapter_id,chapter_digest));');
let databaseSize=327680;
const adapter={prepare(sql){let args=[];return{bind(...values){args=values.map(v=>v instanceof ArrayBuffer?new Uint8Array(v):v);return this;},async first(){return db.prepare(sql).get(...args)||null;},async run(){const result=db.prepare(sql).run(...args);return{meta:{changes:result.changes}};},async all(){return{results:db.prepare(sql).all(...args),meta:{size_after:databaseSize}};}};},async batch(statements){db.exec('BEGIN');try{const rows=[];for(const statement of statements)rows.push(await statement.run());db.exec('COMMIT');return rows;}catch(e){db.exec('ROLLBACK');throw e;}}};
const encoder=new TextEncoder(),secret=crypto.getRandomValues(new Uint8Array(32)),iv=crypto.getRandomValues(new Uint8Array(12)),key=await crypto.subtle.importKey('raw',secret,'AES-GCM',false,['encrypt']);
const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,encoder.encode(JSON.stringify({accessToken:'fixture',expiresAt:Date.now()+3600000})));
db.prepare('INSERT INTO storage_connection(id,credentials,updated_at) VALUES(1,?,?)').run(JSON.stringify({iv:Buffer.from(iv).toString('base64'),data:Buffer.from(encrypted).toString('base64')}),Date.now());
db.prepare('INSERT INTO storage_folders VALUES(?,?)').run('@approot','root');
const env={DB:adapter,PRACTICE_DB:adapter,ONEDRIVE_KEY:Buffer.from(secret).toString('base64'),ONEDRIVE_ENABLED:'true',OPENROUTER_API_KEY:'fixture-only'};
const descriptor={model:ttsModel,voice:defaultVoice,input:'analysis',response_format:'mp3',voicePolicyVersion},hash=bytes=>createHash('sha256').update(bytes).digest('hex'),id=hash(JSON.stringify(descriptor)),audio=Buffer.concat([Buffer.from('ID3'),Buffer.alloc(1200,41)]),chapterDigest='b'.repeat(64);
db.prepare("INSERT INTO pronunciation_audio(id,request_json,state,audio,response_json,created_at) VALUES(?,?,'ready',?,?,?)").run(id,JSON.stringify(descriptor),audio,JSON.stringify({digest:hash(audio),detail:'保真返回'}),Date.now());
db.prepare('INSERT INTO chapter_pronunciation VALUES(?,?,?)').run('chapter',chapterDigest,id);
db.prepare('INSERT INTO chapter_revisions VALUES(?,?)').run('chapter',chapterDigest);db.prepare('INSERT INTO published_chapters VALUES(?)').run('chapter');
const originalFetch=globalThis.fetch,files=new Map();let uploads=0,providerCalls=0,failUploads=false;
globalThis.fetch=async(url,options={})=>{
 if(url==='https://openrouter.ai/api/v1/credits')return Response.json({data:{total_credits:10,total_usage:0}});
 if(url==='https://openrouter.ai/api/v1/key')return Response.json({data:{limit_remaining:null}});
 if(url==='https://openrouter.ai/api/v1/audio/speech'){providerCalls++;return new Response(audio,{headers:{'content-type':'audio/mpeg'}});}
 assert.ok(url.startsWith('https://graph.microsoft.com/'),'No provider call or unmocked network access');assert.equal(options.headers.get('authorization'),'Bearer fixture');
 if(url.endsWith('/children'))return Response.json({id:JSON.parse(options.body).name});
 const upload=url.match(/\/items\/[^/]+:\/([a-f0-9]{64})\.bin:\/content$/);if(upload){if(failUploads)throw Error('fixture upload outage');const bytes=Buffer.from(options.body),digest=upload[1];files.set(digest,bytes);uploads++;return Response.json({id:digest,size:bytes.length});}
 const metadata=url.match(/:\/([a-f0-9]{64})\.bin$/);if(metadata){const bytes=files.get(metadata[1]);return bytes?Response.json({id:metadata[1],size:bytes.length}):Response.json({error:{code:'itemNotFound'}},{status:404});}
 const download=url.match(/\/items\/([a-f0-9]{64})\/content$/);if(download){const bytes=files.get(download[1]),range=options.headers.get('range');if(range)return new Response(bytes.subarray(0,8),{status:206,headers:{'content-range':`bytes 0-7/${bytes.length}`}});return new Response(bytes);}
 return Response.json({error:{code:'itemNotFound'}},{status:404});
};
const context={isPublisher:true};
try{
 const compact=await pronunciationRoute(new Request('https://test/api/practice/pronunciation/compact',{method:'POST',body:JSON.stringify({id})}),env,context);assert.equal((await compact.json()).ok,true);
 assert.equal(db.prepare('SELECT count(*) n FROM pronunciation_audio').get().n,0);assert.equal(db.prepare('SELECT count(*) n FROM chapter_audio_clips').get().n,1);
 assert.equal(db.prepare('SELECT count(*) n FROM storage_objects').get().n,0);assert.equal(db.prepare('SELECT count(*) n FROM storage_versions').get().n,0);assert.equal(db.prepare('SELECT count(*) n FROM storage_blobs').get().n,0);
 const result=db.prepare('SELECT * FROM pronunciation_results').get();assert.equal(result.generation_digest.length,32);const record=JSON.parse(files.get(Buffer.from(result.record_digest).toString('hex')));assert.deepEqual(record.request,descriptor);assert.equal(record.response.detail,'保真返回');
 const before=uploads,reuse=await pronunciationRoute(new Request('https://test/api/practice/pronunciation',{method:'POST',body:JSON.stringify({kind:'word',text:'analysis'})}),env,context);assert.equal((await reuse.json()).reused,true);assert.equal(uploads,before);
 const playback=await pronunciationRoute(new Request(`https://test/api/practice/pronunciation/${id}/audio`,{headers:{range:'bytes=0-7'}}),env,context);assert.equal(playback.status,206);assert.deepEqual(Buffer.from(await playback.arrayBuffer()),audio.subarray(0,8));
 assert.throws(()=>db.prepare('DELETE FROM pronunciation_results').run(),/immutable/);
 const checkpoint=result.id;db.prepare('INSERT INTO pronunciation_results(generation_digest,content_digest,record_digest,bytes,created_at) VALUES(?,?,?,?,?)').run(digestBytes('c'.repeat(64)),result.content_digest,result.record_digest,result.bytes,Date.now());
 let queriedRows=0;const exported=[];for await(const page of rowidPages(async(_,sql,params=[])=>{const rows=db.prepare(sql).all(...params);if(sql.includes('ORDER BY'))queriedRows+=rows.length;return rows;},'test','pronunciation_results',{after:checkpoint}))exported.push(...page);
 assert.equal(queriedRows,1);assert.equal(exported.length,1);assert.ok(exported[0].id>checkpoint);
 files.delete(hash(audio));const lost=await pronunciationRoute(new Request(`https://test/api/practice/pronunciation/${id}/audio`),env,context);assert.equal(lost.status,503);const stillReused=await pronunciationRoute(new Request('https://test/api/practice/pronunciation',{method:'POST',body:JSON.stringify({kind:'word',text:'analysis'})}),env,context);assert.equal((await stillReused.json()).reused,true);
 const generate=word=>pronunciationRoute(new Request('https://test/api/practice/pronunciation',{method:'POST',body:JSON.stringify({kind:'word',text:word})}),env,context);
 const newResult=await(await generate('schedule')).json();assert.equal(newResult.state,'ready');assert.equal(providerCalls,1);assert.equal((await(await generate('schedule')).json()).reused,true);assert.equal(providerCalls,1);
 failUploads=true;files.delete(hash(audio));const fallback=await(await generate('record')).json();assert.equal(fallback.state,'ready');assert.equal(providerCalls,2);assert.equal(db.prepare('SELECT length(audio) n FROM pronunciation_audio WHERE id=?').get(fallback.id).n,audio.length);assert.equal((await(await generate('record')).json()).reused,true);assert.equal(providerCalls,2);
 failUploads=false;assert.equal((await(await pronunciationRoute(new Request('https://test/api/practice/pronunciation/compact',{method:'POST',body:JSON.stringify({id:fallback.id})}),env,context)).json()).ok,true);assert.equal(providerCalls,2);
 databaseSize=200*1024*1024;assert.equal((await generate('object')).status,503);assert.equal(providerCalls,2);
 databaseSize=327680;
 const pronounced=async ipa=>pronunciationRoute(new Request('https://test/api/practice/pronunciation',{method:'POST',body:JSON.stringify({kind:'word',text:'record',ipa})}),env,context);
 const noun=await(await pronounced('/ˈrekərd/')).json(),verb=await(await pronounced('/rɪˈkɔːrd/')).json();assert.notEqual(noun.id,verb.id);assert.equal(noun.state,'ready');assert.equal(verb.state,'ready');
 const paidBefore=providerCalls;assert.equal((await(await pronounced('/ˈrekərd/')).json()).reused,true);assert.equal(providerCalls,paidBefore);
 assert.equal((await pronounced('/unsupported☃/')).status,422);assert.equal(providerCalls,paidBefore);
 assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(),[]);
 console.log('通过：原字节迁移、完整描述保真、零三表重复登记、固定身份复用、Range、不可变保护、增量游标、原件失联不重付、新调用成功/故障副本/无重付补归档、容量入口保护；无真实 API 调用');
}finally{globalThis.fetch=originalFetch;db.close();}
