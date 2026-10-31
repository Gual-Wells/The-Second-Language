import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {publisherConfig} from './lib/publisher-config.mjs';
import {root} from './lib/onedrive-local.mjs';
import {downloadStoredItem as downloadItem} from './lib/series-storage-local.mjs';
import {latestRecoverySnapshot,createRecoveryReader,restoreRecoveryDatabases} from './lib/recovery-snapshot.mjs';
const direct=process.argv.includes('--direct'),databasesOnly=process.argv.includes('--databases-only'),filename=process.argv.slice(2).find(x=>!['--direct','--databases-only'].includes(x));
let manifest,base,token;
if(direct&&!filename)manifest=await latestRecoverySnapshot();
else manifest=JSON.parse(await readFile(filename||path.join(root,'.cache/storage-upgrade/last-backup.json'),'utf8'));
if(!direct&&!manifest.directResources)({base,token}=await publisherConfig());
const directory=path.join(root,'.cache/storage-restore',new Date().toISOString().replace(/[:.]/g,'-'));await mkdir(directory,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
const get=createRecoveryReader(manifest,{direct,download:downloadItem,fetchObject:(key,expected)=>fetch(new URL(`/api/storage/objects?key=${encodeURIComponent(key)}&digest=${expected}`,base),{headers:{authorization:`Bearer ${token}`},signal:AbortSignal.timeout(90000)})});
const counts=await restoreRecoveryDatabases(manifest,directory,get);
let workingFiles=0;
for(const group of databasesOnly?[]:manifest.working||[]){
 const definition=await get(group.key,group.digest),files=new Map();
 for(const chunk of definition.chunks){const payload=await get(chunk.key,chunk.digest,true);for(const part of payload.files){const bytes=Buffer.from(part.data,'base64');if(hash(bytes)!==part.partDigest)throw Error('工作文稿分块校验失败');const entry=files.get(part.path)||{parts:[],size:0};if(part.offset!==entry.size)throw Error('工作文稿分块顺序错误');entry.parts.push(bytes);entry.size+=bytes.length;files.set(part.path,entry);}}
 const groupDirectory=path.resolve(directory,'working',definition.group);if(!groupDirectory.startsWith(directory+path.sep))throw Error('工作组路径无效');
 for(const file of definition.files){const entry=files.get(file.path),bytes=entry&&Buffer.concat(entry.parts);if(!bytes||bytes.length!==file.bytes||hash(bytes)!==file.digest)throw Error('工作文稿恢复校验失败');const target=path.resolve(groupDirectory,file.path);if(!target.startsWith(groupDirectory+path.sep))throw Error('工作文稿路径无效');await mkdir(path.dirname(target),{recursive:true});await writeFile(target,bytes);workingFiles++;}
}
await writeFile(path.join(directory,'verification.json'),JSON.stringify({source:manifest.createdAt,counts,workingFiles,workingVerification:databasesOnly?'skipped':'verified',integrity:'ok',foreignKeys:'ok'},null,2));console.log(`已在独立目录恢复验证：${JSON.stringify(counts)}；${databasesOnly?'本次仅核验数据库':workingFiles+' 份工作文稿'}；${directory}`);
