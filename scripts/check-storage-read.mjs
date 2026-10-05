import {DatabaseSync} from 'node:sqlite';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {chapterText,storageRoute} from '../worker/src/storage.js';
import {practiceRoute} from '../worker/src/practice.js';
const sqlite=new DatabaseSync(':memory:');
sqlite.exec(await readFile(new URL('../worker/migrations/0006_permanent_storage.sql',import.meta.url),'utf8'));
sqlite.exec('CREATE TABLE chapter_revisions(chapter_id TEXT,digest TEXT,content_key TEXT);');
const db={prepare(sql){let values=[];return{bind(...v){values=v;return this;},async first(){return sqlite.prepare(sql).get(...values)||null;}};}};
const texts=['The pinned original chapter.','A newer working version.'],hash=t=>createHash('sha256').update(t).digest('hex'),digests=texts.map(hash);
for(const [i,text] of texts.entries()){sqlite.prepare('INSERT INTO storage_blobs VALUES(?,?,?,?)').run(digests[i],`item-${i}`,Buffer.byteLength(text),Date.now());sqlite.prepare('INSERT INTO storage_versions VALUES(?,?,?,?)').run('chapter.md',digests[i],'text/markdown',Date.now());}
sqlite.prepare('INSERT INTO storage_objects VALUES(?,?,?,?)').run('chapter.md',digests[0],'text/markdown',Date.now());
sqlite.prepare('INSERT INTO chapter_revisions VALUES(?,?,?)').run('chapter-1',digests[0],'chapter.md');
const secret=crypto.getRandomValues(new Uint8Array(32)),iv=crypto.getRandomValues(new Uint8Array(12)),key=await crypto.subtle.importKey('raw',secret,'AES-GCM',false,['encrypt']),credentials={accessToken:'fixture-only',expiresAt:Date.now()+3600000};
const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(JSON.stringify(credentials)));
sqlite.prepare('INSERT INTO storage_connection(id,credentials,updated_at) VALUES(1,?,?)').run(JSON.stringify({iv:Buffer.from(iv).toString('base64'),data:Buffer.from(encrypted).toString('base64')}),Date.now());
const env={DB:db,PRACTICE_DB:db,ONEDRIVE_KEY:Buffer.from(secret).toString('base64'),ONEDRIVE_ENABLED:'true',CHAPTERS:{get:async()=>null}};
const originalFetch=globalThis.fetch;let downloads=0;
globalThis.fetch=async(url,options)=>{assert.equal(options.headers.get('authorization'),'Bearer fixture-only');const i=texts.findIndex((_,i)=>url===`https://graph.microsoft.com/v1.0/me/drive/items/item-${i}/content`);assert(i>=0,'No unmocked network access');downloads++;return new Response(texts[i]);};
try{
 assert.equal(await chapterText(env,'chapter.md'),texts[0]);
 const source=await practiceRoute(new Request(`https://example.test/api/practice/publisher/sources/chapter-1/${digests[0]}`),env,()=>true);assert.equal(source.status,200);assert.equal((await source.json()).markdown,texts[0]);
 sqlite.prepare('UPDATE storage_objects SET digest=?').run(digests[1]);
 const historical=await storageRoute(new Request(`https://example.test/api/storage/objects?key=chapter.md&digest=${digests[0]}`),env,{isPublisher:true});assert.equal(await historical.text(),texts[0]);
 const privateRead=await storageRoute(new Request('https://example.test/api/storage/objects?key=chapter.md'),env,{});assert.equal(privateRead.status,401);assert.equal(downloads,3);
 console.log('通过：KV 缓存失效后读取永久正文与雅思固定来源，历史摘要不随新版本漂移，私有读取需认证；无外部请求');
}finally{globalThis.fetch=originalFetch;sqlite.close();}
