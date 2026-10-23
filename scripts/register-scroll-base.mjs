// Freeze the approved shared craft sources once, independently of chapter jobs.
// Only explicit source files are accepted; no credentials, logs or model caches.
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {publisherConfig} from './lib/publisher-config.mjs';
import {projectRoot as root,localServices} from './lib/local-services.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const mode=process.argv[2]||'freeze';
const directory=path.join(root,'.cache/scroll-base');await mkdir(directory,{recursive:true});
const config=await localServices();
const spec=JSON.parse(await readFile(path.join(root,'protocol/scroll-base-files.json'),'utf8'));
if(mode==='freeze'&&!config.nativeCraftDirectory)throw Error('请在本机local-services.json配置nativeCraftDirectory；不猜测其他工作区');
let credentials;
async function api(route,method='GET',body,mime='application/json'){
 credentials||=await publisherConfig();
 const r=await fetch(new URL(route,credentials.base),{method,headers:{authorization:`Bearer ${credentials.token}`,'content-type':mime},...(body===undefined?{}:{body:Buffer.isBuffer(body)?body:JSON.stringify(body)}),signal:AbortSignal.timeout(180000)});
 if(!r.ok)throw Error(`共享工艺接口 ${r.status}: ${(await r.json().catch(()=>({}))).error||'unavailable'}`);return r;
}
const manifestFile=path.join(directory,'manifest.json');
if(mode==='freeze'){
 const files=[];await mkdir(path.join(directory,'objects'),{recursive:true});
 for(const item of spec.files){
  const base=item.source==='native'?config.nativeCraftDirectory:item.source==='repository'?root:null;
  if(!base||!item.path||item.path.split(/[\\/]/).some(s=>!s||s==='.'||s==='..')||/secret|credential|\.dpapi|\.env|token/i.test(item.path))throw Error('工艺来源规格无效');
  const file=path.resolve(base,item.path),bytes=await readFile(file);
  if(!(await stat(file)).isFile()||!bytes.length||bytes.length>24*1024*1024)throw Error('工艺文件无效或需分块：'+item.path);
  if(item.expectedSHA256&&hash(bytes)!==item.expectedSHA256)throw Error('已认可工艺原件发生变化：'+item.path);
  await writeFile(path.join(directory,'objects',hash(bytes)),bytes);
  files.push({path:item.path,digest:hash(bytes),bytes:bytes.length,mime:item.mime||'application/octet-stream',role:item.role||'native',source:item.source});
 }
 const manifest={schema:'second-language.scroll-base-recovery.v1',revision:spec.revision,files:files.map(({source,...f})=>f),restore:'Restore every file at its recorded relative path. Native Blender images are packed or remapped only in a restored copy. Sources and display assets have different roles.'};
 await writeFile(manifestFile,JSON.stringify(manifest,null,2));
 await writeFile(path.join(directory,'source-map.json'),JSON.stringify(files));
 console.log(JSON.stringify({manifestDigest:hash(await readFile(manifestFile)),files:files.length,bytes:files.reduce((n,f)=>n+f.bytes,0)}));
}else{
 const requestedDigest=process.argv[3],bytes=mode==='restore'&&requestedDigest?Buffer.from(await(await api('/api/storage/content?digest='+requestedDigest)).arrayBuffer()):await readFile(manifestFile),manifest=JSON.parse(bytes),manifestDigest=hash(bytes);
 if(requestedDigest&&mode==='restore'&&requestedDigest!==manifestDigest)throw Error('恢复清单摘要不同');
 if(mode==='upload'||mode==='verify'){
 if(mode==='upload'){
  const sourceMap=JSON.parse(await readFile(path.join(directory,'source-map.json'),'utf8'));
  for(const item of manifest.files){
   const mapping=sourceMap.find(f=>f.path===item.path&&f.digest===item.digest);
   if(!mapping)throw Error('缺少工艺源映射');
   const data=await readFile(path.join(directory,'objects',item.digest));
   if(hash(data)!==item.digest)throw Error('工艺源已漂移');
   // A prior upload is recovered by immutable digest. Network failures are not blindly repeated.
   const known=await api(`/api/storage/content?digest=${item.digest}`).catch(e=>{if(e.message.includes('404'))return null;throw e;});
   if(known){if(hash(Buffer.from(await known.arrayBuffer()))!==item.digest)throw Error('已有工艺源回读不一致');}
   else{const result=await(await api('/api/storage/content','PUT',data,item.mime)).json();if(result.digest!==item.digest)throw Error('上传摘要不一致');}
   console.log('工艺源已核验：'+item.path);
  }
  const result=await(await api('/api/storage/content','PUT',bytes)).json();if(result.digest!==manifestDigest)throw Error('基座清单上传摘要不同');
 }
  let offset=mode==='verify'?Number(process.argv[3]||0):0;
  for(;;){const verified=await(await api('/api/scrolls/bases/verify','POST',{manifestDigest,offset,limit:2})).json();await writeFile(path.join(directory,'verification-progress.json'),JSON.stringify({manifestDigest,...verified}));if(verified.nextOffset==null||verified.verified===verified.total)break;if(verified.nextOffset<=offset)throw Error('工艺基座验证没有推进');offset=verified.nextOffset;}
  await api('/api/scrolls/bases/register','POST',{manifestDigest});
  await writeFile(path.join(directory,'registered.json'),JSON.stringify({manifestDigest,verifiedAt:new Date().toISOString(),files:manifest.files.length}));
  console.log('共享工艺基座注册完成：'+manifestDigest);
 }else if(mode==='restore'){
  const target=path.join(directory,'restored',manifestDigest);await mkdir(target,{recursive:true});
  for(const item of manifest.files){if(!item.path||path.isAbsolute(item.path)||item.path.split(/[\\/]/).some(s=>!s||s==='.'||s==='..')||!/^[a-f0-9]{64}$/.test(item.digest))throw Error('恢复路径无效');const data=Buffer.from(await(await api(`/api/storage/content?digest=${item.digest}`)).arrayBuffer());if(data.length!==item.bytes||hash(data)!==item.digest)throw Error('原件恢复校验失败');const out=path.join(target,item.path);await mkdir(path.dirname(out),{recursive:true});await writeFile(out,data);}
  await writeFile(path.join(target,'restoration.json'),JSON.stringify({manifestDigest,verifiedAt:new Date().toISOString(),files:manifest.files.length,bytes:manifest.files.reduce((n,f)=>n+f.bytes,0)},null,2));console.log(target);
 }else throw Error('模式仅支持freeze/upload/verify/restore');
}
