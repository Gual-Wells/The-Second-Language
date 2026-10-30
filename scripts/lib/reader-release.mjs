import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {READER_LAYOUT_CAPABILITY} from '../../web/reader-capability.js';

const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const critical=['app.js','reader-capability.js','render.js','teaching-units.js','usage-context.js','annotations.js','pure-reader.js','reader-focus.js','context-translations.js','chapter-quality.js'];

// Resolve the actual versioned imports in our shipped modules. Capability is a
// shared constant used by the client and Worker, not guessed from JS text.
async function readerAssets(root){
 const web=path.resolve(root,'web'),index=await readFile(path.join(web,'index.html'));
 const html=index.toString('utf8'),app=html.match(/<script\b[^>]*type="module"[^>]*src="([^"]+)"/)?.[1],style=html.match(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/)?.[1];
 if(!app||!style)throw Error('本地阅读器缺少实际模块或样式入口');
 const origin='https://reader-release.invalid',files=new Map(),seen=new Set();
 async function load(ref){
  const url=new URL(ref,origin);if(url.origin!==origin||url.hash||/%2f|%5c/i.test(url.pathname))throw Error('阅读器依赖不是站内静态文件');
  const name=url.pathname.slice(1),file=path.resolve(web,name);
  if(!file.startsWith(web+path.sep))throw Error('阅读器依赖越出web目录');
  const key=url.pathname+url.search;if(seen.has(key))return;seen.add(key);
  const bytes=await readFile(file);files.set(key,{name,bytes});
  if(name.endsWith('.js'))for(const match of bytes.toString('utf8').matchAll(/^\s*(?:import\s+(?:[^'"\n]+?\s+from\s+)?|export\s+[^'"\n]*?\s+from\s+)['"]([^'"]+)['"]/gm)){
   const dependency=match[1];if(!dependency.startsWith('.'))throw Error('阅读器存在未识别的非相对模块依赖');
   await load(new URL(dependency,url).href);
  }
 }
 await load(app);await load(style);
 const appSource=files.get(new URL(app,origin).pathname+new URL(app,origin).search)?.bytes.toString('utf8');
 const serviceWorker=appSource?.match(/navigator\.serviceWorker\.register\(['"]([^'"]+)['"]/)?.[1];
 if(!serviceWorker)throw Error('阅读器缺少实际Service Worker入口');
 await load(serviceWorker);
 for(const name of critical)if(![...files.values()].some(f=>f.name===name))throw Error('阅读器入口未引用关键模块：'+name);
 return [{url:'/',name:'index.html',bytes:index},...[...files].filter(([,f])=>critical.includes(f.name)||f.name==='styles.css'||f.name==='sw.js').map(([url,f])=>({url,...f}))];
}

// Read-only gate. Call before evidence upload, stage or commit; no auth token,
// model call, database write or chapter regeneration is needed.
export async function verifyReaderRelease({base,required=READER_LAYOUT_CAPABILITY,root=process.cwd(),fetchImpl=fetch}){
 if(!Number.isInteger(required)||required<0||required>READER_LAYOUT_CAPABILITY)throw Error('待发布正文超过本地阅读器能力');
 const assets=await readerAssets(root),origin=new URL(base).origin;
 async function get(ref){
  const url=new URL(ref,origin);
  const response=await fetchImpl(url,{cache:'no-store',headers:{'cache-control':'no-cache'},redirect:'error',signal:AbortSignal.timeout(30000)});
  if(!response.ok)throw Error('阅读器上线预检失败：'+ref+' HTTP '+response.status);
  return response;
 }
 const response=await get('/api/session');
 if(!response.headers.get('content-type')?.includes('application/json'))throw Error('阅读器上线预检未取得Worker能力');
 const session=await response.json(),backend=session.readerLayoutCapability;
 if(!Number.isInteger(backend)||backend<required||typeof session.authenticated!=='boolean')throw Error('线上Worker尚不支持待发布正文；先部署兼容读路');
 const checks=[];let next=0;
 await Promise.all(Array.from({length:Math.min(4,assets.length)},async()=>{
  while(next<assets.length){const item=assets[next++],remote=Buffer.from(await(await get(item.url)).arrayBuffer()),digest=sha(item.bytes);
   if(sha(remote)!==digest)throw Error('线上阅读器资源与本地待发布版本不一致：'+item.name+'；先完成部署及传播，不发布正文');
   checks.push({path:item.url,digest});
  }
 }));
 return {required,readerCapability:READER_LAYOUT_CAPABILITY,workerCapability:backend,checkedAt:new Date().toISOString(),assets:checks.sort((a,b)=>a.path.localeCompare(b.path))};
}
