import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const listeners={},stores=new Map();let online=true,reply;
const key=r=>typeof r==='string'?new URL(r,'https://fixture').href:r.url;
const caches={async open(name){if(!stores.has(name))stores.set(name,new Map());const store=stores.get(name);return{put:async(r,v)=>store.set(key(r),v),delete:async r=>store.delete(key(r)),keys:async()=>[...store.keys()].map(u=>new Request(u)),addAll:async()=>{}};},keys:async()=>[...stores.keys()],delete:async name=>stores.delete(name),match:async r=>{for(const map of stores.values())if(map.has(key(r)))return map.get(key(r)).clone();}};
const self={location:{origin:'https://fixture'},addEventListener:(type,fn)=>listeners[type]=fn};
vm.runInNewContext(await fs.readFile('web/sw.js','utf8'),{self,caches,URL,Response,fetch:async()=>{if(!online)throw Error('offline');return reply.clone();}});
async function read(path){let response;const waits=[];listeners.fetch({request:new Request('https://fixture'+path),respondWith:p=>response=p,waitUntil:p=>waits.push(p)});const r=await response;await Promise.all(waits);return r;}
const cache=await caches.open('second-language-chapters-v3');
for(const path of ['/api/chapters/old','/api/chapters/live?digest=old','/api/chapters/live?digest=new'])await cache.put(new Request('https://fixture'+path),Response.json({markdown:path}));
reply=Response.json({chapters:[{id:'live',digest:'new'}]});await read('/api/chapters');
assert.deepEqual((await cache.keys()).map(r=>new URL(r.url).pathname+new URL(r.url).search).sort(),['/api/chapters','/api/chapters/live?digest=new']);
reply=Response.json({error:'withdrawn'},{status:404});assert.equal((await read('/api/chapters/live?digest=new')).status,404);
online=false;assert.equal((await read('/api/chapters/live?digest=new')).status,503,'Removed version must not reappear offline after online withdrawal');
console.log(JSON.stringify({ok:true,staleBodiesPurged:true,notFoundPurged:true,offlineResurrectionBlocked:true}));
