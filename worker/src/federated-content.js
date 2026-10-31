// Project-local location records; the FILES capability is bound to this project's fixed gateway entrypoint.
const MAX_BYTES=24*1024*1024,encoder=new TextEncoder(),decoder=new TextDecoder();
const digestBytes=value=>{if(!/^[a-f0-9]{64}$/.test(value||''))throw Error('永久文件摘要无效');return Uint8Array.from(value.match(/../g),part=>parseInt(part,16));};
const sha=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(n=>n.toString(16).padStart(2,'0')).join('');
const validSize=bytes=>Number.isSafeInteger(bytes)&&bytes>=0&&bytes<=MAX_BYTES;
function locationOf(value,digest){
 const location=value?.location;if(value?.provider!=='huggingface-s3'||!location||typeof location!=='object'||Array.isArray(location))throw Error('永久文件位置回执无效');
 if(Object.keys(location).some(key=>!['provider','namespace','bucket','key'].includes(key))||location.provider!=null&&location.provider!=='huggingface-s3')throw Error('永久文件位置含未授权字段');
 for(const name of ['namespace','bucket'])if(typeof location[name]!=='string'||!/^[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/.test(location[name])||location[name].includes('..'))throw Error('永久文件项目位置无效');
 if(location.key!==`objects/${digest.slice(0,2)}/${digest}.bin`)throw Error('永久文件位置与摘要不一致');
 return {provider:'huggingface-s3',namespace:location.namespace,bucket:location.bucket,key:location.key};
}
const view=(digest,bytes,extra={})=>({digest,bytes,itemId:`hf-v1:${digest}`,item_id:`hf-v1:${digest}`,...extra});
export async function remoteContentMapping(env,digest){
 const key=digestBytes(digest);if(!env.DB?.prepare)return null;let row;
 try{row=await env.DB.prepare('SELECT c.bytes,p.provider,p.namespace,p.bucket,c.verified_at FROM storage_remote_content c JOIN storage_remote_pools p ON p.id=c.pool_id WHERE c.digest=?').bind(key).first();}
 catch(error){if(/no such table:\s*(?:storage_remote_content|storage_remote_pools)/i.test(String(error?.message)))return null;throw error;}
 if(!row)return null;if(!validSize(row.bytes))throw Error('永久文件位置长度无效');
 const location={provider:row.provider,namespace:row.namespace,bucket:row.bucket,key:`objects/${digest.slice(0,2)}/${digest}.bin`};
 return view(digest,row.bytes,{provider:row.provider,location:locationOf({provider:row.provider,location},digest),verifiedAt:row.verified_at});
}
function metadata(value,digest){if(!value||value.digest!==digest||!validSize(value.bytes))throw Error('永久文件长度或摘要回执无效');return view(digest,value.bytes);}
async function contentBytes(value){if(typeof value==='string')return encoder.encode(value);if(value instanceof Blob)return new Uint8Array(await value.arrayBuffer());if(value instanceof ArrayBuffer)return new Uint8Array(value);if(ArrayBuffer.isView(value))return new Uint8Array(value.buffer,value.byteOffset,value.byteLength);throw Error('永久文件内容无效');}
export function federatedContent(env){
 if(!env.FILES)return null;
 const files=env.FILES;
 const api={
  async contentHead(digest,{onlyRemoteMap=false}={}){
   const known=await remoteContentMapping(env,digest);if(onlyRemoteMap&&!known)return null;
   const result=await files.head(digest);if(result===null){if(known)throw Error('已存永久文件暂不可核对');return null;}
   const head=metadata(result,digest);if(known&&known.bytes!==head.bytes)throw Error('永久文件长度与原位置不一致');return known?{...known,...head}:head;
  },
  async getContent(digest,{onlyRemoteMap=false}={}){
   const known=await remoteContentMapping(env,digest);if(onlyRemoteMap&&!known)return null;
   const result=await files.get(digest);if(result===null){if(known)throw Error('已存永久文件暂不可读取');return null;}
   if(!result||result.digest!==digest)throw Error('永久文件摘要回执无效');const bytes=await contentBytes(result.bytes);
   if(bytes.byteLength>MAX_BYTES||known&&known.bytes!==bytes.byteLength)throw Error('永久文件长度不一致');if(await sha(bytes)!==digest)throw Error('永久文件回读摘要不一致');
   return {...(known||{}),...view(digest,bytes.byteLength),arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),text:async()=>decoder.decode(bytes),json:async()=>JSON.parse(decoder.decode(bytes))};
  },
  async putContent(value,mime='application/octet-stream',{register=true}={}){
   if(typeof register!=='boolean')throw Error('永久文件登记选项无效');
   if(env.FEDERATED_FILES_ENABLED!=='true')throw Error('新的永久文件写入尚未启用');if(register&&!env.DB?.prepare)throw Error('项目永久文件索引尚未配置');
   const bytes=await contentBytes(value);if(bytes.byteLength>MAX_BYTES)throw Error('永久文件超过24MiB，请分批归档');const digest=await sha(bytes);
   const result=await files.put(bytes,mime),receipt=metadata(result,digest);if(receipt.bytes!==bytes.byteLength)throw Error('永久文件写入长度不一致');const location=locationOf(result,digest);
   // Persist a project-local pointer only after an independent complete read verifies the actual object.
   const readback=await files.get(digest);if(!readback||readback.digest!==digest)throw Error('永久文件写入尚未核实');const restored=await contentBytes(readback.bytes);
   if(restored.byteLength!==bytes.byteLength||await sha(restored)!==digest)throw Error('永久文件写入回读不一致');
   const locationJSON=JSON.stringify(location),verifiedAt=Date.now();
   // Recovery chunks/manifests carry their own immutable locator; never grow the business registry recursively.
   if(!register)return {...view(digest,bytes.byteLength),provider:'huggingface-s3',location,verifiedAt,reused:result.reused===true};
   await env.DB.prepare('INSERT OR IGNORE INTO storage_remote_pools(provider,namespace,bucket) VALUES(?,?,?)').bind(location.provider,location.namespace,location.bucket).run();
   const pool=await env.DB.prepare('SELECT id FROM storage_remote_pools WHERE provider=? AND namespace=? AND bucket=?').bind(location.provider,location.namespace,location.bucket).first();if(!pool)throw Error('永久文件池位置未提交');
   await env.DB.prepare('INSERT OR IGNORE INTO storage_remote_content(digest,pool_id,bytes,verified_at) VALUES(?,?,?,?)').bind(digestBytes(digest),pool.id,bytes.byteLength,verifiedAt).run();
   const saved=await remoteContentMapping(env,digest);if(!saved||saved.bytes!==bytes.byteLength||JSON.stringify(saved.location)!==locationJSON)throw Error('永久文件位置未提交或发生冲突，原件已保留');
   return {...saved,reused:result.reused===true};
  }
 };return api;
}
