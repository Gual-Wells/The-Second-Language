import {readdir,readFile,realpath,stat} from 'node:fs/promises';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const hash=b=>createHash('sha256').update(b).digest('hex'),LIMIT=8*1024*1024;
const privateName=name=>/secret|credential|\.dpapi$|^\.env|^\.dev\.vars|^speaking-provider\.json$/i.test(name);
async function entries(dir){try{return await readdir(dir,{withFileTypes:true});}catch(e){if(e.code==='ENOENT')return[];throw e;}}
export async function archiveWorking(root,put){
 let config={};try{config=JSON.parse(await readFile(path.join(root,'.cache/runtime-sources.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
 const roots=config.roots||[],linked=config.linkedDirectoryRoots||[];
 if(!Array.isArray(roots)||!Array.isArray(linked)||[...roots,...linked].some(p=>typeof p!=='string'||!path.isAbsolute(p)))throw Error('归档来源目录配置无效');
 const sources=[...new Set([...roots.filter(p=>path.resolve(p)!==path.resolve(root)),root])];
 const allowed=[...new Set(await Promise.all([...sources,...linked].map(p=>realpath(p))))];
 const merged=new Map();for(const source of sources)for(const entry of await archiveSingle(source,put,allowed))merged.set(entry.key,entry);return [...merged.values()];
}
async function directory(target,allowed,required=false){
 let actual;try{actual=await realpath(target);}catch(e){if(e.code==='ENOENT'&&!required)return null;throw e;}
 if(!(await stat(actual)).isDirectory())return null;
 const inside=allowed.some(root=>{const relative=path.relative(root,actual);return relative===''||(!path.isAbsolute(relative)&&relative!=='..'&&!relative.startsWith('..'+path.sep));});
 if(!inside)throw Error(`工作目录联接未登记为归档来源：${target}`);
 return actual;
}
async function archiveSingle(root,put,allowed){
 const groups=[];
 for(const category of ['runs','questions']){const container=await directory(path.join(root,'work',category),allowed);if(!container)continue;
  for(const entry of await entries(container)){if(privateName(entry.name)||!(entry.isDirectory()||entry.isSymbolicLink()))continue;const dir=await directory(path.join(container,entry.name),allowed,true);if(dir)groups.push({id:`${category}/${entry.name}`,dir});}
 }
 const expression=await directory(path.join(root,'work/expression'),allowed);
 for(const category of expression?await entries(expression):[]){if(privateName(category.name)||!(category.isDirectory()||category.isSymbolicLink()))continue;
  const dir=await directory(path.join(expression,category.name),allowed,true);if(!dir)continue;const items=await entries(dir);
  for(const entry of items){if(privateName(entry.name)||!(entry.isDirectory()||entry.isSymbolicLink()))continue;const child=await directory(path.join(dir,entry.name),allowed,true);if(child)groups.push({id:`expression/${category.name}/${entry.name}`,dir:child});}
  if(items.some(x=>x.isFile()))groups.push({id:`expression/${category.name}/files`,dir,shallow:true});
 }
 for(const category of ['speaking','speaking-detail-test','speaking-schema-test','daily-voices','question-voices','voice-lab','cf-openrouter-probe','quota-calibration']){const dir=await directory(path.join(root,'.cache',category),allowed);if(dir)groups.push({id:`evidence/${category}`,dir,evidence:true});}
 const manifests=[];
 for(const group of groups){const chunks=[],files=[];let records=[],size=0;
  async function flush(){if(!records.length)return;const bytes=gzipSync(Buffer.from(JSON.stringify({version:1,files:records})),{level:6}),key=`working-bundles/${group.id}/${hash(bytes)}.json.gz`;await put(key,bytes,'application/gzip');chunks.push({key,digest:hash(bytes),bytes:bytes.length});records=[];size=0;}
  async function walk(dir){const list=(await entries(dir)).sort((a,b)=>a.name.localeCompare(b.name,'en'));
   for(const file of list){if(file.isSymbolicLink()||privateName(file.name))continue;const target=path.join(dir,file.name);if(file.isDirectory()){if(!group.shallow&&!['node_modules','.venv','__pycache__'].includes(file.name))await walk(target);continue;}
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
