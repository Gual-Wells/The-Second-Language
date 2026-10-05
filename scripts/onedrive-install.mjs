import {readPrivate,savePrivate,root} from './lib/onedrive-local.mjs';
import {publisherConfig} from './lib/publisher-config.mjs';
import {randomBytes} from 'node:crypto';
import {spawn} from 'node:child_process';
import path from 'node:path';
let secret;try{secret=await readPrivate('onedrive-worker-key.dpapi');}catch(e){if(e.code!=='ENOENT')throw e;secret={key:randomBytes(32).toString('base64')};await savePrivate('onedrive-worker-key.dpapi',secret);}
const code=await new Promise((resolve,reject)=>{const p=spawn(process.execPath,[path.join(root,'worker/node_modules/wrangler/bin/wrangler.js'),'secret','bulk','--config',path.join(root,'worker/wrangler.jsonc')],{cwd:root,windowsHide:true,stdio:['pipe','pipe','pipe']});p.stdout.resume();p.stderr.resume();p.on('error',reject);p.on('close',resolve);p.stdin.end(JSON.stringify({ONEDRIVE_KEY:secret.key}));});if(code!==0)throw Error('存储加密密钥配置失败');
const credentials=await readPrivate('onedrive-credentials.dpapi'),{base,token}=await publisherConfig();
const r=await fetch(new URL('/api/storage/connect',base),{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify(credentials),signal:AbortSignal.timeout(60000)}),data=await r.json();if(!r.ok)throw Error(data.error||`存储连接 ${r.status}`);console.log(JSON.stringify(data));
