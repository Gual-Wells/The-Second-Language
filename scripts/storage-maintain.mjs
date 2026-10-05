import {readFile,writeFile,unlink} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import path from 'node:path';
import {root} from './lib/onedrive-local.mjs';
const file=path.join(root,'.cache/storage-upgrade/request.json');
let request;try{request=JSON.parse(await readFile(file,'utf8'));}catch(e){if(e.code==='ENOENT')process.exit(0);throw e;}
if(request.needsAttention||request.retryAt>Date.now())process.exit(0);
try{
 for(const mode of ['migrate','packs','backup']){const code=await new Promise((resolve,reject)=>{const p=spawn(process.execPath,[path.join(root,'scripts/storage-upgrade.mjs'),mode],{cwd:root,windowsHide:true,stdio:'inherit'});p.on('error',reject);p.on('close',resolve);});if(code!==0){const error=Error(code===78?'归档读取预算已到保护线；保留待处理状态，不重复尝试。':'归档未完成');error.budget=code===78;throw error;}}
 const current=JSON.parse(await readFile(file,'utf8'));if(current.requestedAt===request.requestedAt)await unlink(file);
}catch(e){const current=JSON.parse(await readFile(file,'utf8'));if(current.requestedAt===request.requestedAt)await writeFile(file,JSON.stringify({...request,failures:(request.failures||0)+1,retryAt:Date.now()+15*60000,lastError:String(e.message),needsAttention:!!e.budget||(request.failures||0)>=2}));throw e;}
