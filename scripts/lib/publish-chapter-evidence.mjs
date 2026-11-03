import {createHash} from 'node:crypto';
import {loadChapterEvidence} from './chapter-evidence.mjs';
import {canonicalSourcePackage} from '../../protocol/current-affairs.mjs';

const hash=value=>createHash('sha256').update(value).digest('hex');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function discard(response){try{await response?.body?.cancel();}catch{}}
// Retry only immutable reads, once. A failed upload acknowledgement must resume
// through the same content address on a later run, never a repeated PUT here.
async function immutableRead(url,method,headers,fetchImpl,sleepImpl){
 for(let attempt=0;attempt<2;attempt++){
  let response;
  try{response=await fetchImpl(url,{method,headers,signal:AbortSignal.timeout(60000)});}
  catch(error){if(attempt)throw error;await sleepImpl(500);continue;}
  if(!attempt&&[502,503,504].includes(response.status)){await discard(response);await sleepImpl(500);continue;}
  if(method==='HEAD'||!response.ok){await discard(response);return {ok:response.ok,status:response.status};}
  try{return {ok:true,status:response.status,bytes:Buffer.from(await response.arrayBuffer())};}
  catch(error){await discard(response);if(attempt)throw error;await sleepImpl(500);}
 }
}
// All writes use immutable content addresses. A lost upload acknowledgement can
// resume with HEAD/readback; neither the manuscript nor a model is regenerated.
export async function uploadEvidenceObjects(objects,{base,token,fetchImpl=fetch,sleepImpl=sleep}){
 const unique=new Map();
 for(const object of objects){
  if(!object||typeof object.text!=='string'||hash(object.text)!==object.digest||Buffer.byteLength(object.text)!==object.bytes)throw Error('本机采用证据对象摘要或长度不符');
  if(unique.has(object.digest)&&unique.get(object.digest).text!==object.text)throw Error('采用证据对象身份冲突');
  unique.set(object.digest,object);
 }
 for(const object of unique.values()){
  const url=new URL('/api/storage/content?digest='+object.digest,base),headers={authorization:`Bearer ${token}`};
  const head=await immutableRead(url,'HEAD',headers,fetchImpl,sleepImpl);
  if(head.status===404){
   const response=await fetchImpl(new URL('/api/storage/content',base),{method:'PUT',headers:{...headers,'content-type':'application/json; charset=utf-8'},body:object.text,signal:AbortSignal.timeout(60000)});
   if(!response.ok){await discard(response);throw Error(`采用证据上传尚未完成 (${response.status})`);}
   let receipt;try{receipt=await response.json();}finally{await discard(response);}if(receipt.digest!==object.digest||receipt.bytes!==object.bytes)throw Error('采用证据上传回执不一致');
  }else if(!head.ok)throw Error(`采用证据存储查询尚未完成 (${head.status})`);
  const response=await immutableRead(url,'GET',headers,fetchImpl,sleepImpl);
  if(!response.ok)throw Error(`采用证据永久回读尚未完成 (${response.status})`);
  const bytes=response.bytes;
  if(bytes.length!==object.bytes||hash(bytes)!==object.digest)throw Error('采用证据永久原件回读摘要不符');
 }
 return {objects:unique.size};
}

export async function publishChapterEvidence(root,date,chapter,options){
 if(!chapter.sourcePackage?.evidenceDigest)return {objects:0};
 const evidence=await loadChapterEvidence(root,date,chapter.sourcePackage,{markdown:chapter.markdown});
 return uploadEvidenceObjects(evidence.objects,options);
}

// The large object transfers get their own request contexts before stage. This
// only seals immutable storage; normal server review, bindings and commit remain
// mandatory. Resume reads the same keys and never repeats an unknown PUT here.
export async function sealChapterObjects(chapter,{base,token,fetchImpl=fetch,sleepImpl=sleep}){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(chapter?.date||'')||chapter.id!==chapter.date||typeof chapter.markdown!=='string')throw Error('本机章节封存身份无效');
 const sourceText=canonicalSourcePackage(chapter.sourcePackage);
 const objects=[
  {key:`chapters/${chapter.date}/${chapter.digest}.md`,text:chapter.markdown,digest:chapter.digest,mime:'text/markdown; charset=utf-8'},
  {key:`chapter-sources/${chapter.digest}/${chapter.sourceDigest}.json`,text:sourceText,digest:chapter.sourceDigest,mime:'application/json; charset=utf-8'}
 ];
 for(const object of objects){if(!/^[a-f0-9]{64}$/.test(object.digest||'')||hash(object.text)!==object.digest)throw Error('本机正文或来源封存摘要不符');object.bytes=Buffer.byteLength(object.text);}
 const receipts=[];
 for(const object of objects){
  const url=new URL('/api/storage/objects',base);url.searchParams.set('key',object.key);const headers={authorization:`Bearer ${token}`};
  let read=await immutableRead(url,'GET',headers,fetchImpl,sleepImpl);const reused=read.ok;
  if(read.status===404){
   const response=await fetchImpl(url,{method:'PUT',headers:{...headers,'content-type':object.mime},body:object.text,signal:AbortSignal.timeout(60000)});
   if(!response.ok){await discard(response);throw Error(`正文或来源封存尚未完成 (${response.status})`);}
   let receipt;try{receipt=await response.json();}finally{await discard(response);}
   if(receipt.key!==object.key||receipt.digest!==object.digest||receipt.bytes!==object.bytes)throw Error('正文或来源封存回执不一致');
   read=await immutableRead(url,'GET',headers,fetchImpl,sleepImpl);
  }
  if(!read.ok)throw Error(`正文或来源永久回读尚未完成 (${read.status})`);
  if(read.bytes.length!==object.bytes||hash(read.bytes)!==object.digest)throw Error('正文或来源永久回读摘要不符');
  receipts.push({key:object.key,digest:object.digest,bytes:object.bytes,reused});
 }
 return {objects:receipts};
}
