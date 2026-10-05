import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
export async function finishTaskStorage(){
 try{const config=await readFile(path.join(root,'worker/wrangler.jsonc'),'utf8');if(!/"ONEDRIVE_ENABLED"\s*:\s*"true"/.test(config))return;
  const directory=path.join(root,'.cache/storage-upgrade');await mkdir(directory,{recursive:true});const temporary=path.join(directory,`request-${randomUUID()}.tmp`);
  await writeFile(temporary,JSON.stringify({requestedAt:Date.now()}));await rename(temporary,path.join(directory,'request.json'));
  const code=await new Promise((resolve,reject)=>{const p=spawn('powershell.exe',['-NoProfile','-NonInteractive','-Command',"Start-ScheduledTask -TaskName 'SecondLanguage-PermanentArchive'"],{windowsHide:true,stdio:'ignore'});p.on('error',reject);p.on('close',resolve);});
  console.log(code===0?'永久归档已排队。':'永久归档已排队，请检查本机归档服务。');
 }catch{console.warn('归档排队暂未完成，已有数据已保留。');}
}
