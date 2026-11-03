import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {uploadEvidenceObjects,sealChapterObjects} from './lib/publish-chapter-evidence.mjs';
import {canonicalSourcePackage} from '../protocol/current-affairs.mjs';
const object=text=>({text,digest:createHash('sha256').update(text).digest('hex'),bytes:Buffer.byteLength(text)});
const asset=object(JSON.stringify({kind:'self-written transport fixture',original:'仅用于隔离存储验证。'}));
function transport({loseAck=false,corrupt=false}={}){
 const stored=new Map(),calls=[];
 return {stored,calls,async fetchImpl(url,options={}){
  const method=options.method||'GET',digest=new URL(url).searchParams.get('digest');calls.push(method);
  if(method==='HEAD')return new Response(null,{status:stored.has(digest)?200:404});
  if(method==='PUT'){
   const value=object(options.body);stored.set(value.digest,value.text);
   if(loseAck){loseAck=false;throw Error('isolated lost acknowledgement');}
   return Response.json({digest:value.digest,bytes:value.bytes});
  }
  return new Response(corrupt?'changed bytes':stored.get(digest),{status:stored.has(digest)?200:404});
 }};
}
const options=t=>({base:'https://isolated-evidence.test',token:'isolated-fixture',fetchImpl:t.fetchImpl.bind(t)});
test('a saved upload with a lost ACK resumes without a second write',async()=>{
 const t=transport({loseAck:true});await assert.rejects(uploadEvidenceObjects([asset],options(t)),/lost acknowledgement/);
 assert.equal(t.calls.filter(x=>x==='PUT').length,1);
 await uploadEvidenceObjects([asset],options(t));assert.equal(t.calls.filter(x=>x==='PUT').length,1);assert.equal(t.calls.at(-1),'GET');
});
test('repeated content addresses reuse the same verified object',async()=>{
 const t=transport();assert.deepEqual(await uploadEvidenceObjects([asset,asset],options(t)),{objects:1});
 await uploadEvidenceObjects([asset],options(t));assert.equal(t.calls.filter(x=>x==='PUT').length,1);
});
test('bad permanent readback fails before publication can continue',async()=>{
 const t=transport({corrupt:true});await assert.rejects(uploadEvidenceObjects([asset],options(t)),/回读摘要不符/);
});
test('a changed local asset cannot reach storage',async()=>{
 const t=transport();await assert.rejects(uploadEvidenceObjects([{...asset,text:'changed'}],options(t)),/本机采用证据/);assert.equal(t.calls.length,0);
});

const chapter={id:'2026-11-02',date:'2026-11-02',markdown:'<!-- isolated author-owned transport fixture -->\n正文',sourcePackage:{sources:[],purpose:'isolated self-written fixture'}};
chapter.digest=object(chapter.markdown).digest;chapter.sourceDigest=object(canonicalSourcePackage(chapter.sourcePackage)).digest;
function logicalTransport({loseAck=false,corrupt=false,transient=false}={}){
 const stored=new Map(),calls=[];
 return {stored,calls,async fetchImpl(url,options={}){
  url=new URL(url);assert.equal(url.pathname,'/api/storage/objects','Storage preparation cannot stage, commit or invoke generation');
  const method=options.method||'GET',key=url.searchParams.get('key');calls.push({method,key});
  if(method==='PUT'){stored.set(key,options.body);if(loseAck){loseAck=false;throw Error('isolated lost logical ACK');}const value=object(options.body);return Response.json({key,digest:value.digest,bytes:value.bytes});}
  if(transient){transient=false;return new Response('unavailable',{status:503});}
  return new Response(stored.has(key)?corrupt?'corrupt original':stored.get(key):null,{status:stored.has(key)?200:404});
 }};
}
test('body and canonical source are independently sealed and GET-verified before stage',async()=>{
 const t=logicalTransport(),result=await sealChapterObjects(chapter,options(t));assert.equal(result.objects.length,2);
 assert.deepEqual(t.calls.map(c=>c.method),['GET','PUT','GET','GET','PUT','GET']);
 assert.equal(result.objects[0].digest,chapter.digest);assert.equal(result.objects[1].digest,chapter.sourceDigest);
 assert.equal(t.stored.get(result.objects[1].key),canonicalSourcePackage(chapter.sourcePackage));
 await sealChapterObjects(chapter,options(t));assert.equal(t.calls.filter(c=>c.method==='PUT').length,2);
});
test('lost body acknowledgement stops and resumes by reading the same immutable key',async()=>{
 const t=logicalTransport({loseAck:true});await assert.rejects(sealChapterObjects(chapter,options(t)),/lost logical ACK/);
 assert.equal(t.calls.filter(c=>c.method==='PUT').length,1);assert.equal(t.stored.size,1);
 await sealChapterObjects(chapter,options(t));assert.equal(t.calls.filter(c=>c.method==='PUT').length,2);assert.equal(t.stored.size,2);
});
test('a corrupted existing immutable body is never overwritten or staged',async()=>{
 const t=logicalTransport();await sealChapterObjects(chapter,options(t));const failing=logicalTransport({corrupt:true});for(const [key,value] of t.stored)failing.stored.set(key,value);
 await assert.rejects(sealChapterObjects(chapter,options(failing)),/回读摘要不符/);assert(failing.calls.every(c=>c.method==='GET'));
});
test('both local objects must match before any storage request',async()=>{
 const t=logicalTransport();await assert.rejects(sealChapterObjects({...chapter,sourceDigest:'0'.repeat(64)},options(t)),/封存摘要不符/);assert.equal(t.calls.length,0);
});
test('only a transient read is retried; writes retain single-attempt ownership',async()=>{
 const t=logicalTransport({transient:true});let sleeps=0;await sealChapterObjects(chapter,{...options(t),sleepImpl:async()=>{sleeps++;}});
 assert.equal(sleeps,1);assert.equal(t.calls.filter(c=>c.method==='PUT').length,2);
});
