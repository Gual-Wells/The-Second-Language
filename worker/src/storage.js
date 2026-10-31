import {pointAudioKeys,isPointAudioClip} from '../../web/audio-plan.js';
import {sha256} from './practice-media.js';
import {federatedContent,remoteContentMapping} from './federated-content.js';
const encoder=new TextEncoder(),decoder=new TextDecoder(),json=(v,s=200)=>Response.json(v,{status:s,headers:{'cache-control':'no-store'}});
const requestStorageState=Symbol('request storage access');
// Each HTTP invocation gets its own state; never reuse account credentials across requests.
export const storageRequestEnvironment=env=>({...env,[requestStorageState]:{}});
const b64=v=>{let s='';for(const x of v)s+=String.fromCharCode(x);return btoa(s);};
const un64=v=>Uint8Array.from(atob(v),x=>x.charCodeAt(0));
async function encryptionKey(env){if(!env.ONEDRIVE_KEY)throw Error('永久存储尚未配置');return crypto.subtle.importKey('raw',un64(env.ONEDRIVE_KEY),'AES-GCM',false,['encrypt','decrypt']);}
async function seal(env,value){const iv=crypto.getRandomValues(new Uint8Array(12)),encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},await encryptionKey(env),encoder.encode(JSON.stringify(value)));return JSON.stringify({iv:b64(iv),data:b64(new Uint8Array(encrypted))});}
async function credentials(env){const row=await env.DB.prepare('SELECT credentials FROM storage_connection WHERE id=1').first();if(!row)throw Error('永久存储尚未连接');const b=JSON.parse(row.credentials);return JSON.parse(decoder.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:un64(b.iv)},await encryptionKey(env),un64(b.data))));}
async function accessRecord(env){
 let c=await credentials(env);if(c.expiresAt>Date.now()+120000)return c;
 const now=Date.now(),locked=await env.DB.prepare('UPDATE storage_connection SET refresh_lock=? WHERE id=1 AND refresh_lock<?').bind(now+60000,now).run();
 if(!locked.meta.changes)throw Error('存储凭据正在更新，请稍后再试');
 try{
  c=await credentials(env);if(c.expiresAt>Date.now()+120000)return c;
  const r=await fetch('https://login.microsoftonline.com/consumers/oauth2/v2.0/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:c.clientId,grant_type:'refresh_token',refresh_token:c.refreshToken,scope:c.scope}),signal:AbortSignal.timeout(30000)});
  const value=await r.json();if(!r.ok||!value.access_token)throw Error('OneDrive 需要重新授权');
  c={...c,accessToken:value.access_token,refreshToken:value.refresh_token||c.refreshToken,expiresAt:Date.now()+value.expires_in*1000};
  await env.DB.prepare('UPDATE storage_connection SET credentials=?,updated_at=? WHERE id=1').bind(await seal(env,c),Date.now()).run();return c;
 }finally{await env.DB.prepare('UPDATE storage_connection SET refresh_lock=0 WHERE id=1').run();}
}
async function access(env){
 const state=env[requestStorageState];if(!state)return(await accessRecord(env)).accessToken;
 if(state.record?.expiresAt>Date.now()+120000)return state.record.accessToken;
 state.pending||=accessRecord(env);
 try{const record=await state.pending;state.record={accessToken:record.accessToken,expiresAt:record.expiresAt};return record.accessToken;}
 finally{state.pending=null;}
}
async function graph(env,route,options={}){
 try{
 const headers=new Headers(options.headers);headers.set('authorization',`Bearer ${await access(env)}`);
 const r=await fetch(`https://graph.microsoft.com/v1.0${route}`,{...options,headers,redirect:'manual',signal:AbortSignal.timeout(60000)});
 if(!r.ok&&r.status!==302&&r.status!==303){const detail=await r.json().then(v=>v.error).catch(()=>null);throw Error(`OneDrive ${options.method||'GET'} ${route.includes('/content')?'file':route.includes('/children')?'folder':'metadata'} (${r.status}, ${detail?.code||'unknown'}): ${String(detail?.message||'').slice(0,180)}`);}return r;
 }catch(error){if(error&&typeof error==='object'){error.storageProvider='onedrive';throw error;}throw Object.assign(Error('OneDrive 请求未完成'),{storageProvider:'onedrive'});}
}
async function itemResponse(env,itemId,range){
 if(typeof itemId==='string'&&itemId.startsWith('hf-v1:')){
  const digest=itemId.slice(6);if(!/^[a-f0-9]{64}$/.test(digest))throw Error('永久文件句柄无效');
  if(!env.FILES)throw Error('永久文件服务尚未连接');
  if(range&&typeof env.FILES.readRange==='function'){
   const value=await env.FILES.readRange(digest,range);
   if(!value||![200,206,416].includes(value.status)||!value.headers||typeof value.headers!=='object')throw Error('永久文件范围读取未完成');
   const headers=new Headers();for(const name of ['content-length','content-range','accept-ranges']){const v=new Headers(value.headers).get(name);if(v!==null)headers.set(name,v);}
   return new Response(value.body,{status:value.status,headers});
  }
  const content=await federatedContent(env).getContent(digest);if(!content)throw Error('已存永久文件暂不可读取');
  const bytes=await content.arrayBuffer();if(range){const m=range.match(/^bytes=(\d*)-(\d*)$/),n=bytes.byteLength;
   if(!m||!m[1]&&!m[2])return new Response(null,{status:416,headers:{'content-range':`bytes */${n}`}});
   const first=m[1]?Number(m[1]):Math.max(0,n-Number(m[2])),last=m[1]?(m[2]?Math.min(n-1,Number(m[2])):n-1):n-1;
   if(!Number.isSafeInteger(first)||!Number.isSafeInteger(last)||first<0||first>last||first>=n)return new Response(null,{status:416,headers:{'content-range':`bytes */${n}`}});
   return new Response(bytes.slice(first,last+1),{status:206,headers:{'content-length':String(last-first+1),'content-range':`bytes ${first}-${last}/${n}`}});
  }
  return new Response(bytes,{headers:{'content-length':String(bytes.byteLength)}});
 }
 const headers=range?{Range:range}:{},r=await graph(env,`/me/drive/items/${encodeURIComponent(itemId)}/content`,{headers});
 if(r.ok)return r;const location=r.headers.get('location');if(!location||new URL(location).protocol!=='https:')throw Error('存储下载地址无效');
 // Signed URL is used only inside Worker, without Graph authorization or client exposure.
 const file=await fetch(location,{headers,signal:AbortSignal.timeout(60000)});if(!file.ok&&file.status!==416)throw Error(`存储下载失败 (${file.status})`);return file;
}
async function folder(env,name){
 const old=await env.DB.prepare('SELECT item_id FROM storage_folders WHERE name=?').bind(name).first();if(old)return old.item_id;
 let root=await env.DB.prepare("SELECT item_id FROM storage_folders WHERE name='@approot'").first();
 if(!root){const value=await(await graph(env,'/me/drive/special/approot')).json();root={item_id:value.id};await env.DB.prepare("INSERT OR IGNORE INTO storage_folders VALUES('@approot',?)").bind(value.id).run();}
 const route=`/me/drive/items/${encodeURIComponent(root.item_id)}`;
 let item;try{item=await(await graph(env,`${route}:/${name}`)).json();}catch{
  try{item=await(await graph(env,`${route}/children`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name,folder:{},'@microsoft.graph.conflictBehavior':'fail'})})).json();}
  catch(e){item=await(await graph(env,`${route}:/${name}`)).json();}
 }
 await env.DB.prepare('INSERT OR IGNORE INTO storage_folders VALUES(?,?)').bind(name,item.id).run();return item.id;
}
async function legacyContentHead(env,digest){
 const parent=await folder(env,`objects-${digest.slice(0,2)}`);
 try{const item=await(await graph(env,`/me/drive/items/${encodeURIComponent(parent)}:/${digest}.bin`)).json();return{digest,item_id:item.id,bytes:item.size};}
 catch(e){if(e.message.includes('(404,'))return null;throw e;}
}
export function permanentBucket(env){return{
 async contentHead(digest){
  if(typeof digest!=='string'||!/^[a-f0-9]{64}$/.test(digest))throw Error('资产摘要无效');
  const remote=await remoteContentMapping(env,digest),files=federatedContent(env);
  if(remote){if(!files)throw Error('已存永久文件服务尚未连接');return files.contentHead(digest,{onlyRemoteMap:true});}
  // Keep the old provider authoritative until it actually reports absence. A permission,
  // quota or network failure cannot turn a previously paid object into a new generation.
  const legacy=await legacyContentHead(env,digest);if(legacy)return legacy;
  return files?files.contentHead(digest):null;
 },
 async putContent(value,mime='application/octet-stream',options={}){
  const bytes=typeof value==='string'?encoder.encode(value):value instanceof Blob?await value.arrayBuffer():value;
  if(!bytes||bytes.byteLength>24*1024*1024)throw Error('单份资产超过 24 MiB，请分批归档');
  const digest=await sha256(bytes),files=federatedContent(env),newFiles=env.FEDERATED_FILES_ENABLED==='true'&&files;
  // Recovery snapshots carry typed immutable locators in their own manifests. Registering
  // every snapshot into the database being backed up would create a growing feedback loop.
  if(newFiles&&options.register===false)return files.putContent(bytes,mime,options);
  let row;try{row=await this.contentHead(digest);}catch(error){
   if(!newFiles||error?.storageProvider!=='onedrive')throw error;
   // The caller already holds the complete immutable bytes. Save a same-SHA copy;
   // this is not evidence that the older provider is missing and never reruns a model.
   return {...await files.putContent(bytes,mime,options),recoveredFromSuppliedBytes:true};
  }
  if(newFiles&&(!row||row.item_id?.startsWith('hf-v1:')))return files.putContent(bytes,mime,options);
  if(!row){const parent=await folder(env,`objects-${digest.slice(0,2)}`),item=await(await graph(env,`/me/drive/items/${encodeURIComponent(parent)}:/${digest}.bin:/content`,{method:'PUT',headers:{'content-type':mime},body:bytes})).json();row={digest,item_id:item.id,bytes:item.size};}
  if(row.bytes!==bytes.byteLength||await sha256(await(await itemResponse(env,row.item_id)).arrayBuffer())!==digest)throw Error('存储文件校验失败');
  return{digest,bytes:row.bytes,itemId:row.item_id,provider:row.provider||'onedrive',...(row.location?{location:row.location}:{})};
 },
 async getContent(digest){const row=await this.contentHead(digest);if(!row)return null;const bytes=await(await itemResponse(env,row.item_id)).arrayBuffer();if(await sha256(bytes)!==digest)throw Error('存储资产校验失败');return{arrayBuffer:async()=>bytes,text:async()=>decoder.decode(bytes),json:async()=>JSON.parse(decoder.decode(bytes))};},
 async responseContent(digest,request,mime='application/octet-stream'){const row=await this.contentHead(digest);return row?this.respond({...row,mime},request):null;},
 async put(key,value,options={}){
  const bytes=typeof value==='string'?encoder.encode(value):value instanceof Blob?await value.arrayBuffer():value;
  if(!bytes||bytes.byteLength>24*1024*1024)throw Error('单份资产超过 24 MiB，请分批归档');
  const digest=await sha256(bytes),mime=options.httpMetadata?.contentType||'application/octet-stream';
  let blob=await env.DB.prepare('SELECT * FROM storage_blobs WHERE digest=?').bind(digest).first();
  if(!blob){
   if(env.FILES){
    const saved=await this.putContent(bytes,mime);
    if(saved.digest!==digest||saved.bytes!==bytes.byteLength||typeof saved.itemId!=='string')throw Error('永久文件回执身份不一致');
    await env.DB.prepare('INSERT OR IGNORE INTO storage_blobs VALUES(?,?,?,?)').bind(digest,saved.itemId,bytes.byteLength,Date.now()).run();
    blob=await env.DB.prepare('SELECT * FROM storage_blobs WHERE digest=?').bind(digest).first();if(!blob||blob.bytes!==bytes.byteLength)throw Error('永久文件逻辑索引未提交');
   }else{
   const parent=await folder(env,`objects-${digest.slice(0,2)}`),uploaded=await (await graph(env,`/me/drive/items/${encodeURIComponent(parent)}:/${digest}.bin:/content`,{method:'PUT',headers:{'content-type':mime},body:bytes})).json();
   if(uploaded.size!==bytes.byteLength)throw Error('存储文件长度不一致');
   const verified=await (await itemResponse(env,uploaded.id)).arrayBuffer();if(await sha256(verified)!==digest)throw Error('存储文件校验失败');
   await env.DB.prepare('INSERT OR IGNORE INTO storage_blobs VALUES(?,?,?,?)').bind(digest,uploaded.id,bytes.byteLength,Date.now()).run();
   blob={item_id:uploaded.id,bytes:bytes.byteLength};
   }
  }
  const now=Date.now();await env.DB.batch([
   env.DB.prepare('INSERT OR IGNORE INTO storage_versions VALUES(?,?,?,?)').bind(key,digest,mime,now),
   env.DB.prepare('INSERT INTO storage_objects VALUES(?,?,?,?) ON CONFLICT(object_key) DO UPDATE SET digest=excluded.digest,mime=excluded.mime,updated_at=excluded.updated_at').bind(key,digest,mime,now)
  ]);await env.DB.prepare('DELETE FROM storage_pending WHERE object_key=?').bind(key).run();return{key,digest,bytes:blob.bytes};
 },
 async head(key,digest){return digest?env.DB.prepare('SELECT v.object_key AS key,v.digest,v.mime,b.item_id,b.bytes FROM storage_versions v JOIN storage_blobs b USING(digest) WHERE v.object_key=? AND v.digest=?').bind(key,digest).first():env.DB.prepare('SELECT o.object_key AS key,o.digest,o.mime,b.item_id,b.bytes FROM storage_objects o JOIN storage_blobs b USING(digest) WHERE o.object_key=?').bind(key).first();},
 async get(key){const row=await this.head(key);if(!row)return null;const r=await itemResponse(env,row.item_id);const bytes=await r.arrayBuffer();if(await sha256(bytes)!==row.digest)throw Error('存储资产校验失败');return{arrayBuffer:async()=>bytes,text:async()=>decoder.decode(bytes),json:async()=>JSON.parse(decoder.decode(bytes))};},
 async response(key,request,digest){const row=await this.head(key,digest);return row?this.respond(row,request):null;},
 async respond(row,request){
  if(request.method==='HEAD')return new Response(null,{headers:{'content-type':row.mime,'content-length':String(row.bytes),'accept-ranges':'bytes','cache-control':'private, no-store'}});
  const range=request.headers.get('range');if(range&&!/^bytes=(\d*)-(\d*)$/.test(range))return new Response(null,{status:416,headers:{'content-range':`bytes */${row.bytes}`}});
  const r=await itemResponse(env,row.item_id,range),headers=new Headers({'content-type':row.mime,'cache-control':'private, no-store','accept-ranges':'bytes','x-content-type-options':'nosniff'});
  for(const k of ['content-length','content-range'])if(r.headers.has(k))headers.set(k,r.headers.get(k));return new Response(r.body,{status:r.status,headers});
 }
};}
export function archivalBucket(env,legacy){const bucket=permanentBucket(env);return{
 async put(...a){try{return await bucket.put(...a);}catch(e){await legacy.put(...a);await env.DB.prepare('INSERT INTO storage_pending VALUES(?,?) ON CONFLICT(object_key) DO UPDATE SET created_at=excluded.created_at').bind(a[0],Date.now()).run();console.warn('永久存储暂不可用，已保留兼容副本');return{pendingArchive:true};}},
 async get(key){const pending=await env.DB.prepare('SELECT 1 FROM storage_pending WHERE object_key=?').bind(key).first();if(pending)return legacy.get(key);try{const v=await bucket.get(key);if(v)return v;}catch(e){const old=await legacy.get(key);if(old)return old;throw e;}return legacy.get(key);},
 async head(key){if(await env.DB.prepare('SELECT 1 FROM storage_pending WHERE object_key=?').bind(key).first())return legacy.head(key);return(await bucket.head(key))||legacy.head(key);}
};}
export async function chapterText(env,key){const cached=await env.CHAPTERS.get(key);if(cached!==null)return cached;const value=await permanentBucket(env).get(key);return value?value.text():null;}
async function handleStorage(request,env,{isPublisher,session,sameOrigin}){
 const url=new URL(request.url),path=url.pathname.replace('/api/storage',''),bucket=permanentBucket(env);
 if(!isPublisher&&!session)return json({error:'请先登录'},401);
 if(path==='/connect'&&request.method==='POST'){
  if(!isPublisher)return json({error:'发布身份无效'},403);const c=await request.json();
  if(c.clientId!=='69e35375-8fe6-497b-9e02-7e7425058e19'||!c.refreshToken||!c.accessToken||c.scope!=='https://graph.microsoft.com/Files.ReadWrite.AppFolder offline_access')return json({error:'存储授权无效'},400);
  await env.DB.prepare('INSERT INTO storage_connection(id,credentials,updated_at) VALUES(1,?,?) ON CONFLICT(id) DO UPDATE SET credentials=excluded.credentials,refresh_lock=0,updated_at=excluded.updated_at').bind(await seal(env,c),Date.now()).run();
  const drive=await (await graph(env,'/me/drive?$select=quota,driveType')).json();return json({connected:true,quota:drive.quota,driveType:drive.driveType});
 }
 if(path==='/status'&&request.method==='GET'){if(!isPublisher)return json({error:'发布身份无效'},403);const drive=await(await graph(env,'/me/drive?$select=quota,driveType')).json();const counts=await env.DB.prepare('SELECT count(*) AS files,sum(bytes) AS bytes FROM storage_blobs').first();return json({...drive,...counts,active:env.ONEDRIVE_ENABLED==='true'});}
 if(path==='/recovery-index'&&request.method==='POST'&&isPublisher){
  const b=await request.json();if(!/^backups\/[^/]+\/manifest\.json$/.test(b.key||'')||!/^[a-f0-9]{64}$/.test(b.digest||''))return json({error:'恢复清单无效'},400);
  const blob=await bucket.contentHead(b.digest);if(!blob||b.itemId&&b.itemId!==blob.item_id)return json({error:'恢复清单不存在'},404);
  const manifestBytes=await(await itemResponse(env,blob.item_id)).arrayBuffer();if(await sha256(manifestBytes)!==b.digest)return json({error:'恢复清单校验失败'},409);
  const manifest=JSON.parse(decoder.decode(manifestBytes));if(!Array.isArray(manifest.databases)||!manifest.resources)return json({error:'恢复清单结构无效'},400);
  const root=await(await graph(env,'/me/drive/special/approot')).json(),route=`/me/drive/items/${encodeURIComponent(root.id)}`;let index={version:1,snapshots:[]};
  try{const old=await(await graph(env,`${route}:/recovery-index.json`)).json();index=JSON.parse(await(await itemResponse(env,old.id)).text());if(index.version!==1||!Array.isArray(index.snapshots))throw Error('已有恢复索引无效');}catch(e){if(!e.message.includes('(404,'))throw e;}
  if(!index.snapshots.some(x=>x.digest===b.digest))index.snapshots.push({key:b.key,digest:b.digest,itemId:blob.item_id,createdAt:new Date().toISOString()});
  const bytes=encoder.encode(JSON.stringify(index)),uploaded=await(await graph(env,`${route}:/recovery-index.json:/content`,{method:'PUT',headers:{'content-type':'application/json'},body:bytes})).json();if(await sha256(await(await itemResponse(env,uploaded.id)).arrayBuffer())!==await sha256(bytes))throw Error('恢复索引回读失败');return json({ok:true,snapshots:index.snapshots.length});
 }
 if(path==='/content'&&isPublisher){
  if(request.method==='PUT')return json(await bucket.putContent(await request.arrayBuffer(),request.headers.get('content-type')||'application/octet-stream',request.headers.get('x-storage-purpose')==='recovery'?{register:false}:{}));
  const digest=url.searchParams.get('digest');if(!/^[a-f0-9]{64}$/.test(digest||''))return json({error:'资产摘要无效'},400);
  if(request.method==='GET'||request.method==='HEAD')return(await bucket.responseContent(digest,request))||json({error:'资产不存在'},404);
 }
 if(path==='/objects'&&isPublisher){
  const key=url.searchParams.get('key');if(!key||key.length>1000||key.startsWith('temporary/'))return json({error:'资产身份无效'},400);
  if(request.method==='PUT'){if(Number(request.headers.get('content-length'))>24*1024*1024)return json({error:'请分批上传'},413);return json(await bucket.put(key,await request.arrayBuffer(),{httpMetadata:{contentType:request.headers.get('content-type')}}));}
  if(request.method==='GET'||request.method==='HEAD'){const digest=url.searchParams.get('digest');if(digest&&!/^[a-f0-9]{64}$/.test(digest))return json({error:'版本摘要无效'},400);return (await bucket.response(key,request,digest))||json({error:'资产不存在'},404);}
 }
 const chapter=path.match(/^\/chapters\/([A-Za-z0-9._:-]+)$/);
 if(chapter&&request.method==='GET'){
  const row=await env.DB.prepare('SELECT manifest_key FROM chapter_audio_packs WHERE chapter_id=? AND chapter_digest=?').bind(chapter[1],url.searchParams.get('digest')).first();
  if(!row)return json({packs:[],clips:[]});return json(await(await bucket.get(row.manifest_key)).json());
 }
 if(path==='/pack'&&request.method==='GET'){
  const key=url.searchParams.get('key');if(!/^chapter-audio\/[A-Za-z0-9._:-]+\/[a-f0-9]{64}\/[a-f0-9]{64}\.bin$/.test(key||''))return json({error:'音频包无效'},400);
  return (await bucket.response(key,request))||json({error:'音频包不存在'},404);
 }
 if(path==='/publish-pack'&&request.method==='POST'&&isPublisher){const b=await request.json();if(typeof b.chapterId!=='string'||!/^chapter-audio\//.test(b.manifestKey)||!/^[a-f0-9]{64}$/.test(b.digest))return json({error:'清单无效'},400);
  const manifest=await bucket.get(b.manifestKey);if(!manifest)return json({error:'清单未存储'},409);const m=await manifest.json();if(m.chapterId!==b.chapterId||m.digest!==b.digest)return json({error:'章节版本不一致'},409);
  const chapter=await env.DB.prepare('SELECT content_key FROM chapter_revisions WHERE chapter_id=? AND digest=?').bind(b.chapterId,b.digest).first();
  const markdown=chapter&&await chapterText(env,chapter.content_key);if(!markdown||await sha256(markdown)!==b.digest)return json({error:'章节原件暂不可核对'},503);
  const keys=pointAudioKeys(markdown);if(!Array.isArray(m.clips)||m.clips.some(clip=>!isPointAudioClip(clip,keys)))return json({error:'音频包包含不属于正文完整英文语境句或例句的声音'},422);
  await env.DB.prepare('INSERT INTO chapter_audio_packs VALUES(?,?,?,?) ON CONFLICT(chapter_id,chapter_digest) DO UPDATE SET manifest_key=excluded.manifest_key,updated_at=excluded.updated_at').bind(b.chapterId,b.digest,b.manifestKey,Date.now()).run();return json({ok:true});
 }
 return json({error:'接口不存在'},404);
}
export async function storageRoute(request,env,context){try{return await handleStorage(request,env,context);}catch(e){return json({error:context.isPublisher?String(e.message):'存储暂不可用'},503);}}
