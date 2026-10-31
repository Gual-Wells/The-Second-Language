// No live service, credential, browser or billable provider call.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {verifyReaderRelease} from './lib/reader-release.mjs';
import {requiredReaderLayout} from '../protocol/reader-layout.mjs';

const root=process.cwd(),requests=[];
function isolated({backend=3,alter,alterQuery,unavailable=false}={}){
 return async url=>{
  requests.push(url.pathname);
  if(url.pathname==='/api/session')return Response.json({authenticated:false,readerLayoutCapability:backend});
  if(unavailable&&url.pathname==='/app.js')return new Response('unavailable',{status:503});
  let bytes=await readFile(path.join(root,'web',url.pathname==='/'?'index.html':url.pathname.slice(1)));
  if(url.pathname===alter&&(!alterQuery||url.search===alterQuery))bytes=Buffer.concat([bytes,Buffer.from('\n/* stale deployment */')]);
  return new Response(bytes);
 };
}
const quick='## record /ˈrekərd/ n. · 留存的记录',modern='## record /ˈrekərd/ n.',legacy='## record · 记录 /ˈrekərd/';
assert.equal(requiredReaderLayout(quick),3);assert.equal(requiredReaderLayout(modern),2);assert.equal(requiredReaderLayout(legacy),0);
const good=await verifyReaderRelease({root,base:'https://reader.test',required:3,fetchImpl:isolated()});
assert.ok(good.assets.length>=13);assert.ok(good.assets.some(x=>x.path==='/reader-capability.js?v=62'));
assert.ok(good.assets.some(x=>x.path==='/usage-context.js')); // Actual unversioned transitive import must also agree.
assert.ok(good.assets.some(x=>x.path==='/sw.js?v=64'));
for(const alter of ['/','/app.js','/teaching-units.js','/styles.css','/sw.js'])await assert.rejects(verifyReaderRelease({root,base:'https://reader.test',required:3,fetchImpl:isolated({alter})}),/资源与本地/);
await assert.rejects(verifyReaderRelease({root,base:'https://reader.test',required:3,fetchImpl:isolated({alter:'/sw.js',alterQuery:'?v=64'})}),/资源与本地/);
await assert.rejects(verifyReaderRelease({root,base:'https://reader.test',required:3,fetchImpl:isolated({backend:2})}),/线上Worker/);
await assert.rejects(verifyReaderRelease({root,base:'https://reader.test',required:3,fetchImpl:isolated({backend:null})}),/线上Worker/);
await assert.rejects(verifyReaderRelease({root,base:'https://reader.test',required:3,fetchImpl:isolated({unavailable:true})}),/HTTP 503/);
await assert.rejects(verifyReaderRelease({root,base:'https://reader.test',required:4,fetchImpl:isolated()}),/超过本地/);
assert.equal((await verifyReaderRelease({root,base:'https://reader.test',required:0,fetchImpl:isolated()})).required,0);
assert.ok(requests.every(p=>p==='/api/session'||!p.startsWith('/api/')));
console.log('Reader publication gate passed: actual entry/dependencies, mixed deployment, missing Worker capability, legacy body, no publishing calls.');
