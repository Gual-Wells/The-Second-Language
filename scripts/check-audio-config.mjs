import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {audioConfigRoute} from '../worker/src/audio-config.js';
import {audioUnits,uniqueAudioUnits} from '../web/audio-plan.js';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pronunciationRoute} from '../worker/src/pronunciation.js';
import {permanentBucket,storageRoute} from '../worker/src/storage.js';
import {digestBytes} from '../worker/src/pronunciation-store.js';
import {rowidPages} from './lib/storage-scan.mjs';
import {ttsModel,defaultVoice,voicePolicyVersion} from '../protocol/voices.mjs';
const db=new DatabaseSync(':memory:');
for(const file of ['worker/migrations/0006_permanent_storage.sql','worker/migrations/0007_archive_recovery.sql','worker/practice_migrations/0005_pronunciation.sql','worker/practice_migrations/0006_permanent_audio.sql','worker/practice_migrations/0007_compact_pronunciation.sql','worker/practice_migrations/0008_compact_chapter_links.sql'])db.exec(await readFile(new URL('../'+file,import.meta.url),'utf8'));
db.exec('CREATE TABLE chapter_revisions(chapter_id TEXT,digest TEXT,title TEXT,content_key TEXT);CREATE TABLE published_chapters(chapter_id TEXT);CREATE TABLE chapter_audio_work(chapter_id TEXT,chapter_digest TEXT,requested_at INTEGER,PRIMARY KEY(chapter_id,chapter_digest));');
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
db.prepare('INSERT INTO chapter_revisions VALUES(?,?,?,?)').run('chapter',chapterDigest,'Fixture','chapter-key');db.prepare('INSERT INTO published_chapters VALUES(?)').run('chapter');
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
db.exec(await readFile('worker/migrations/0009_audio_requests.sql','utf8'));
const markdown=['<!-- PART:one -->','<!-- WORD:W001 -->','# record','<!-- USE:U001 -->','## record · noun /ˈrekərd/','<!-- USE:U002 -->','## record · verb /rɪˈkɔːrd/','<!-- PART:two -->','<!-- WORD:W001 -->','# record','<!-- EXAMPLE:U001 -->','Keep a record.','`译文`','<!-- EXAMPLE:U002 -->','Keep a record.','`译文`','<!-- PART:three -->','<!-- SENTENCE:S001 USE:U001 -->','Keep a record.','`译文`'].join('\n');
const chapterHash=hash(markdown);db.prepare('UPDATE chapter_revisions SET digest=?').run(chapterHash);env.CHAPTERS={get:async()=>markdown};
const call=(path,body,ctx=context)=>audioConfigRoute(new Request('https://test/api/audio-config'+path,{method:'POST',body:JSON.stringify(body)}),env,ctx);
try{
 assert.equal(uniqueAudioUnits(audioUnits(markdown).filter(u=>u.part==='one')).length,0);
 assert.equal((await call('/quote',{chapterId:'chapter',digest:chapterHash,parts:['one']},{session:null})).status,401);
 assert.equal((await call('/quote',{chapterId:'chapter',digest:chapterHash,parts:['one']},{session:{},sameOrigin:false})).status,403);
 const quote=await(await call('/quote',{chapterId:'chapter',digest:chapterHash,parts:['two','three']})).json();assert.equal(providerCalls,0);assert.equal(db.prepare('SELECT state FROM audio_requests').get().state,'quoted');
 assert.equal((await call('/confirm',{quoteId:quote.quoteId,confirmed:false})).status,400);
 assert.equal((await call('/jobs/claim',{claim:'a'.repeat(64)})).status,200);assert.equal(db.prepare('SELECT state FROM audio_requests').get().state,'quoted');
 assert.equal((await call('/confirm',{quoteId:quote.quoteId,confirmed:true})).status,200);assert.equal((await call('/confirm',{quoteId:quote.quoteId,confirmed:true})).status,200);
 const claimed=await(await call('/jobs/claim',{claim:'a'.repeat(64)})).json();assert.equal(claimed.job.units.length,1,'Repeated titles/examples/sentences deduplicate across selected parts');
 assert.equal((await call('/cancel',{id:quote.quoteId})).status,404);
 assert.equal((await call('/jobs/progress',{id:quote.quoteId,claim:'b'.repeat(64),cursor:1,state:'running'})).status,409);
 assert.equal((await call('/jobs/progress',{id:quote.quoteId,claim:'a'.repeat(64),cursor:0,state:'completed'})).status,409);
 assert.equal((await call('/jobs/progress',{id:quote.quoteId,claim:'a'.repeat(64),cursor:1,state:'completed'})).status,200);
 assert.equal(db.prepare('SELECT state FROM audio_requests').get().state,'completed');assert.equal(providerCalls,0);
 const expired=await(await call('/quote',{chapterId:'chapter',digest:chapterHash,parts:['two']})).json();db.prepare('UPDATE audio_requests SET expires_at=0 WHERE id=?').run(expired.quoteId);
 assert.equal((await call('/confirm',{quoteId:expired.quoteId,confirmed:true})).status,409);
 const speak=body=>pronunciationRoute(new Request('https://test/api/practice/pronunciation',{method:'POST',body:JSON.stringify({chapterId:'chapter',digest:chapterHash,...body})}),env,context);
 const beforeCalls=providerCalls,beforeLinks=db.prepare('SELECT count(*) n FROM chapter_audio_clips').get().n;
 for(const body of [{text:'Keep a',kind:'sentence'},{text:'record',kind:'word'},{text:'record',kind:'word',ipa:'/ˈrekɪd/'},{text:'noun',kind:'word',ipa:'/naʊn/'}])assert.equal((await speak(body)).status,body.kind==='word'?400:422,'Fragments, missing/wrong IPA and explanatory words cannot enter generation');
 assert.equal(providerCalls,beforeCalls);assert.equal(db.prepare('SELECT count(*) n FROM chapter_audio_clips').get().n,beforeLinks);
 assert.equal(providerCalls,beforeCalls,'All word requests are refused before provider billing');
 const sentence=await(await speak({text:'Keep a record.',kind:'sentence'})).json();assert.equal(sentence.state,'ready');const paidSentence=providerCalls;assert.equal((await(await speak({text:'Keep a record.',kind:'sentence'})).json()).id,sentence.id);assert.equal(providerCalls,paidSentence,'Identical example/story sentence is reused');
 const publishPack=async clips=>{const manifest={chapterId:'chapter',digest:chapterHash,packs:[],clips},key=`chapter-audio/chapter/${chapterHash}/${hash(JSON.stringify(manifest))}.json`;await permanentBucket(env).put(key,JSON.stringify(manifest));return storageRoute(new Request('https://test/api/storage/publish-pack',{method:'POST',body:JSON.stringify({chapterId:'chapter',digest:chapterHash,manifestKey:key})}),env,context);};
 assert.equal((await publishPack([{text:'Keep a',voice:'af_bella'}])).status,422,'A fragment cannot re-enter through a pack manifest');
 assert.equal((await publishPack([{text:'Keep a record.',voice:'am_michael'}])).status,422,'Reader cache retains Bella voice policy');
 assert.equal((await publishPack([{text:'Keep a record.',voice:'af_bella'}])).status,200);
 assert.equal((await publishPack([])).status,200,'An empty clean manifest replaces an obsolete pack');
 console.log('通过：付费生成前确认、同一申请幂等、过期报价、处理权、不可撤销、跨部分去重、永久计划与结果；零真实收费调用。');
}finally{globalThis.fetch=originalFetch;db.close();}
