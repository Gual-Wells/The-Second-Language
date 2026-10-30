import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {uploadEvidenceObjects} from './lib/publish-chapter-evidence.mjs';
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
