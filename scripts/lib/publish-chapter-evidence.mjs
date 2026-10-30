import {createHash} from 'node:crypto';
import {loadChapterEvidence} from './chapter-evidence.mjs';

const hash=value=>createHash('sha256').update(value).digest('hex');
// All writes use immutable content addresses. A lost upload acknowledgement can
// resume with HEAD/readback; neither the manuscript nor a model is regenerated.
export async function uploadEvidenceObjects(objects,{base,token,fetchImpl=fetch}){
 const unique=new Map();
 for(const object of objects){
  if(!object||typeof object.text!=='string'||hash(object.text)!==object.digest||Buffer.byteLength(object.text)!==object.bytes)throw Error('本机采用证据对象摘要或长度不符');
  if(unique.has(object.digest)&&unique.get(object.digest).text!==object.text)throw Error('采用证据对象身份冲突');
  unique.set(object.digest,object);
 }
 for(const object of unique.values()){
  const url=new URL('/api/storage/content?digest='+object.digest,base),headers={authorization:`Bearer ${token}`};
  const head=await fetchImpl(url,{method:'HEAD',headers,signal:AbortSignal.timeout(60000)});
  if(head.status===404){
   const response=await fetchImpl(new URL('/api/storage/content',base),{method:'PUT',headers:{...headers,'content-type':'application/json; charset=utf-8'},body:object.text,signal:AbortSignal.timeout(60000)});
   if(!response.ok)throw Error(`采用证据上传尚未完成 (${response.status})`);
   const receipt=await response.json();if(receipt.digest!==object.digest||receipt.bytes!==object.bytes)throw Error('采用证据上传回执不一致');
  }else if(!head.ok)throw Error(`采用证据存储查询尚未完成 (${head.status})`);
  const response=await fetchImpl(url,{headers,signal:AbortSignal.timeout(60000)});
  if(!response.ok)throw Error(`采用证据永久回读尚未完成 (${response.status})`);
  const bytes=Buffer.from(await response.arrayBuffer());
  if(bytes.length!==object.bytes||hash(bytes)!==object.digest)throw Error('采用证据永久原件回读摘要不符');
 }
 return {objects:unique.size};
}

export async function publishChapterEvidence(root,date,chapter,options){
 if(!chapter.sourcePackage?.evidenceDigest)return {objects:0};
 const evidence=await loadChapterEvidence(root,date,chapter.sourcePackage,{markdown:chapter.markdown});
 return uploadEvidenceObjects(evidence.objects,options);
}
