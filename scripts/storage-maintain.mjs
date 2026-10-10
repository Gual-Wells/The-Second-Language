import {readFile,writeFile,unlink} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import path from 'node:path';
import {root} from './lib/onedrive-local.mjs';
let sources=[];try{sources=JSON.parse(await readFile(path.join(root,'.cache/runtime-sources.json'),'utf8')).roots||[];}catch(e){if(e.code!=='ENOENT')throw e;}
const requests=[];for(const source of new Set([root,...sources])){const file=path.join(source,'.cache/storage-upgrade/request.json');try{const request=JSON.parse(await readFile(file,'utf8'));if(!request.needsAttention&&!(request.retryAt>Date.now()))requests.push({file,request});}catch(e){if(e.code!=='ENOENT')throw e;}}
if(!requests.length)process.exit(0);
try{
 for(const mode of ['migrate','packs','backup']){const code=await new Promise((resolve,reject)=>{const p=spawn(process.execPath,[path.join(root,'scripts/storage-upgrade.mjs'),mode],{cwd:root,windowsHide:true,stdio:'inherit'});p.on('error',reject);p.on('close',resolve);});if(code!==0){const error=Error(code===78?'归档读取预算已到保护线；保留待处理状态，不重复尝试。':'归档未完成');error.budget=code===78;throw error;}}
 for(const {file,request} of requests){const current=JSON.parse(await readFile(file,'utf8'));if(current.requestedAt===request.requestedAt)await unlink(file);}
}catch(e){for(const {file,request} of requests){const current=JSON.parse(await readFile(file,'utf8'));if(current.requestedAt===request.requestedAt)await writeFile(file,JSON.stringify({...request,failures:(request.failures||0)+1,retryAt:Date.now()+15*60000,lastError:String(e.message),needsAttention:!!e.budget||(request.failures||0)>=2}));}throw e;}
