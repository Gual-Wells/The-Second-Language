import {readdir,readFile} from 'node:fs/promises';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const hash=b=>createHash('sha256').update(b).digest('hex'),LIMIT=8*1024*1024;
async function entries(dir){try{return await readdir(dir,{withFileTypes:true});}catch(e){if(e.code==='ENOENT')return[];throw e;}}
export async function archiveWorking(root,put){
 const groups=[];
 for(const category of ['runs','questions'])for(const entry of await entries(path.join(root,'work',category)))if(entry.isDirectory())groups.push({id:`${category}/${entry.name}`,dir:path.join(root,'work',category,entry.name)});
 for(const category of await entries(path.join(root,'work/expression'))){if(!category.isDirectory())continue;
  const dir=path.join(root,'work/expression',category.name),items=await entries(dir);
  for(const entry of items)if(entry.isDirectory())groups.push({id:`expression/${category.name}/${entry.name}`,dir:path.join(dir,entry.name)});
  if(items.some(x=>x.isFile()))groups.push({id:`expression/${category.name}/files`,dir,shallow:true});
 }
 for(const category of ['speaking','speaking-detail-test','speaking-schema-test','daily-voices','question-voices','voice-lab','cf-openrouter-probe','quota-calibration'])groups.push({id:`evidence/${category}`,dir:path.join(root,'.cache',category),evidence:true});
 const manifests=[];
 for(const group of groups){const chunks=[],files=[];let records=[],size=0;
  async function flush(){if(!records.length)return;const bytes=gzipSync(Buffer.from(JSON.stringify({version:1,files:records})),{level:6}),key=`working-bundles/${group.id}/${hash(bytes)}.json.gz`;await put(key,bytes,'application/gzip');chunks.push({key,digest:hash(bytes),bytes:bytes.length});records=[];size=0;}
  async function walk(dir){const list=(await entries(dir)).sort((a,b)=>a.name.localeCompare(b.name,'en'));
   for(const file of list){if(file.isSymbolicLink())continue;const target=path.join(dir,file.name);if(file.isDirectory()){if(!group.shallow&&!['node_modules','.venv','__pycache__'].includes(file.name))await walk(target);continue;}
    if(/secret|credential|\.dpapi$|^\.env|^\.dev\.vars|^speaking-provider\.json$/i.test(file.name))continue;
    if(group.evidence&&!/\.(json|md|txt|mp3|wav|m4a|ogg|webm)$/i.test(file.name))continue;
    const bytes=await readFile(target),relative=path.relative(group.dir,target).split(path.sep).join('/');
    for(let offset=0;offset<Math.max(1,bytes.length);offset+=LIMIT){const part=bytes.subarray(offset,offset+LIMIT);if(size+part.length>LIMIT)await flush();records.push({path:relative,offset,total:bytes.length,digest:hash(bytes),partDigest:hash(part),data:part.toString('base64')});size+=part.length;}
    files.push({path:relative,bytes:bytes.length,digest:hash(bytes)});
   }
  }
  await walk(group.dir);await flush();if(!files.length)continue;
  const data={version:1,group:group.id,files,chunks},bytes=Buffer.from(JSON.stringify(data)),key=`working-bundles/${group.id}/manifest.json`;await put(key,bytes,'application/json');manifests.push({key,digest:hash(bytes),files:files.length,chunks:chunks.map(({key,digest})=>({key,digest}))});
 }
 return manifests;
}
