import {AwsClient} from './vendor/aws4fetch/aws4fetch.mjs';

// Project-scoped CAS only: callers cannot supply arbitrary hosts, keys or buckets per operation.
const MAX_BYTES=24*1024*1024,encoder=new TextEncoder(),decoder=new TextDecoder();
const digestOf=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(n=>n.toString(16).padStart(2,'0')).join('');
const validDigest=value=>{if(!/^[a-f0-9]{64}$/.test(value||''))throw Error('文件摘要无效');return value;};
const configuredName=value=>typeof value==='string'&&/^[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/.test(value)&&!value.includes('..');
async function secret(value){const resolved=typeof value==='string'?value:typeof value?.get==='function'?await value.get():null;if(typeof resolved!=='string'||!resolved.trim())throw Error('HF存储凭据尚未配置');return resolved.trim();}
function trustedCDN(location){let url;try{url=new URL(location);}catch{throw Error('HF存储下载地址无效');}if(url.protocol!=='https:'||url.username||url.password||url.port&&url.port!=='443'||!((url.hostname.endsWith('.cdn.hf.co')&&url.hostname!=='.cdn.hf.co')||url.hostname==='cas-bridge.xethub.hf.co'))throw Error('HF存储下载地址不受信任');return url;}
function storageError(response){const error=Error(`HF文件存储暂不可用 (${response.status})`);error.status=response.status;return error;}
function sizeOf(response){const raw=response.headers.get('content-length');if(!raw||!/^\d+$/.test(raw))throw Error('HF文件长度未核实');const size=Number(raw);if(!Number.isSafeInteger(size)||size<0||size>MAX_BYTES)throw Error('HF文件超过24MiB上限');return size;}
async function bytesOf(response){const raw=response.headers.get('content-length');if(raw!==null&&(/^\d+$/.test(raw)?Number(raw)>MAX_BYTES:true))throw Error('HF文件超过24MiB上限');if(!response.body)return new Uint8Array();const reader=response.body.getReader(),parts=[];let length=0;for(;;){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>MAX_BYTES){await reader.cancel();throw Error('HF文件超过24MiB上限');}parts.push(value);}const result=new Uint8Array(length);let offset=0;for(const part of parts){result.set(part,offset);offset+=part.byteLength;}if(raw!==null&&Number(raw)!==length)throw Error('HF文件长度不一致');return result;}
function requestedRange(value,bytes){if(!value)return null;const match=value.match(/^bytes=(\d*)-(\d*)$/);if(!match||!match[1]&&!match[2])return false;const first=match[1]?Number(match[1]):Math.max(0,bytes-Number(match[2])),last=match[1]?(match[2]?Math.min(bytes-1,Number(match[2])):bytes-1):bytes-1;if(!Number.isSafeInteger(first)||!Number.isSafeInteger(last)||first<0||first>last||first>=bytes)return false;return {first,last,length:last-first+1};}
export function hfObjectStore({namespace,bucket,accessKeyId,secretAccessKey,fetchImpl=fetch}){
 if(!configuredName(namespace)||!configuredName(bucket))throw Error('HF项目存储配置无效');
 const base=`https://s3.hf.co/${namespace}/${bucket}/objects/`;
 const path=digest=>`${base}${validDigest(digest).slice(0,2)}/${digest}.bin`;
 let signerPromise;
 const signer=()=>signerPromise||=(async()=>new AwsClient({accessKeyId:await secret(accessKeyId),secretAccessKey:await secret(secretAccessKey),service:'s3',region:'us-east-1',retries:0}))().catch(error=>{signerPromise=null;throw error;});
 async function send(digest,{method='GET',range,body,headers={}}={}){
  const signed=await(await signer()).sign(path(digest),{method,headers:{'x-amz-content-sha256':'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',...headers,...(range?{range}:{})},...(body!==undefined?{body}:{}),aws:{allHeaders:Boolean(range)},redirect:'manual',signal:AbortSignal.timeout(60000)});
  // Runtime transports can normalize Accept-Encoding on Range requests; do not sign that transport header.
  signed.headers.set('accept-encoding','identity');
  let response=await fetchImpl(signed);
  if(!['GET','HEAD'].includes(method)){if(response.status>=300&&response.status<400)throw Error('HF写入发生重定向，原件未删除');return response;}
  for(let hop=0;[302,303,307,308].includes(response.status);hop++){
   if(hop>=3)throw Error('HF下载重定向次数过多');const location=response.headers.get('location');const next=trustedCDN(location);
   // Deliberately create new headers: no Authorization, cookies or X-Amz signature can cross origins.
   response=await fetchImpl(next.toString(),{method,headers:{'accept-encoding':'identity',...(range?{range}:{})},redirect:'manual',signal:AbortSignal.timeout(60000)});
  }
  return response;
 }
 const location=digest=>({provider:'huggingface-s3',namespace,bucket,key:`objects/${digest.slice(0,2)}/${digest}.bin`});
 const api={
  async contentHead(digest){validDigest(digest);const r=await send(digest,{method:'HEAD'});if(r.status===404)return null;if(r.status!==200)throw storageError(r);return {digest,bytes:sizeOf(r),provider:'huggingface-s3',location:location(digest)};},
  async getContent(digest){validDigest(digest);const r=await send(digest);if(r.status===404)return null;if(r.status!==200)throw storageError(r);const bytes=await bytesOf(r);if(await digestOf(bytes)!==digest)throw Error('HF文件摘要不一致');return {digest,bytes:bytes.byteLength,provider:'huggingface-s3',location:location(digest),arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),text:async()=>decoder.decode(bytes),json:async()=>JSON.parse(decoder.decode(bytes))};},
  async putContent(value,mime='application/octet-stream'){
   const bytes=typeof value==='string'?encoder.encode(value):value instanceof Blob?new Uint8Array(await value.arrayBuffer()):value instanceof ArrayBuffer?new Uint8Array(value):ArrayBuffer.isView(value)?new Uint8Array(value.buffer,value.byteOffset,value.byteLength):null;
   if(!bytes||bytes.byteLength>MAX_BYTES)throw Error('单份HF资产超过24MiB或内容无效');const digest=await digestOf(bytes);
   const r=await send(digest,{method:'PUT',body:bytes,headers:{'content-type':mime,'if-none-match':'*','x-amz-content-sha256':digest}});
   if(!r.ok&&r.status!==412)throw storageError(r);
   const verified=await api.getContent(digest);if(!verified||verified.bytes!==bytes.byteLength)throw Error('HF文件写入尚未核实，未提交索引');
   return {digest,bytes:bytes.byteLength,provider:'huggingface-s3',location:location(digest),reused:r.status===412};
  },
  async responseContent(digest,request,mime='application/octet-stream'){
   if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405});const head=await api.contentHead(digest);if(!head)return null;
   const headers={'content-type':mime,'cache-control':'private, no-store','accept-ranges':'bytes','x-content-type-options':'nosniff'};
   // HTTP Range applies to GET. HEAD always describes the complete representation.
   if(request.method==='HEAD')return new Response(null,{headers:{...headers,'content-length':String(head.bytes)}});
   const range=requestedRange(request.headers.get('range'),head.bytes);if(range===false)return new Response(null,{status:416,headers:{...headers,'content-range':`bytes */${head.bytes}`}});
   if(!range){const content=await api.getContent(digest);if(!content)throw Error('HF原件读取中失联');return new Response(await content.arrayBuffer(),{headers:{...headers,'content-length':String(content.bytes)}});}
   const r=await send(digest,{range:`bytes=${range.first}-${range.last}`});if(![200,206].includes(r.status))throw storageError(r);let bytes=await bytesOf(r);
   if(r.status===206){if(r.headers.get('content-range')!==`bytes ${range.first}-${range.last}/${head.bytes}`||bytes.length!==range.length)throw Error('HF范围读取校验失败');}
   else {if(bytes.length!==head.bytes||await digestOf(bytes)!==digest)throw Error('HF原件摘要不一致');bytes=bytes.slice(range.first,range.last+1);}
   return new Response(bytes,{status:206,headers:{...headers,'content-length':String(bytes.length),'content-range':`bytes ${range.first}-${range.last}/${head.bytes}`}});
  }
 };return api;
}

