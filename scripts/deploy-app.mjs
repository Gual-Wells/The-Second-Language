import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {mkdir} from 'node:fs/promises';
import {pagesBuildDirectory} from '../worker/gateway/build-path.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),worker=path.join(root,'worker');
const wrangler=path.join(worker,'node_modules/wrangler/bin/wrangler.js');
if(process.platform==='win32'){
 const temporary='D:/CodexStorage/tmp/the-second-language';await mkdir(temporary,{recursive:true});
 process.env.TMP=process.env.TEMP=temporary;
 if(!/^D:[\\/]/i.test(process.env.WRANGLER_LOG_PATH||'')){
  const logs='D:/CodexStorage/logs/the-second-language';await mkdir(logs,{recursive:true});process.env.WRANGLER_LOG_PATH=logs;
 }
}
async function run(args,cwd){const code=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,args,{cwd,windowsHide:true,stdio:'inherit'});child.on('error',reject);child.on('close',resolve);});if(code!==0)throw Error(`部署步骤未完成 (${code})`);}
await run([wrangler,'deploy'],worker);
await run([path.join(worker,'gateway/build.mjs')],worker);
await run([wrangler,'pages','deploy',pagesBuildDirectory(),'--project-name','the-second-language','--branch','main','--cwd','gateway','--commit-dirty=true'],worker);
const base='https://the-second-language.pages.dev';
const session=await fetch(base+'/api/session',{signal:AbortSignal.timeout(60000)});
if(!session.ok||!session.headers.get('content-type')?.includes('application/json')||typeof(await session.json()).authenticated!=='boolean')throw Error('已发布，但同源 API 网关核验未通过');
const privateRoute=await fetch(base+'/api/practice',{signal:AbortSignal.timeout(60000)});
if(privateRoute.status!==401)throw Error('已发布，但私有接口认证核验未通过');
console.log('已发布：API Worker、含 API service binding 的 Pages 网关；公开会话及私有认证核验通过。');
