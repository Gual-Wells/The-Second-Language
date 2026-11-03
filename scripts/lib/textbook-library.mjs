import {createHash,randomUUID} from 'node:crypto';
import {mkdir,readFile,readdir,realpath,rm,writeFile,link} from 'node:fs/promises';
import path from 'node:path';
const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
const gitBlob=bytes=>createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
async function optional(file){try{return JSON.parse(await readFile(file,'utf8'));}catch(error){if(error.code==='ENOENT')return null;throw error;}}
export async function textbookLibrary(root){
 const source=await readFile(path.join(root,'protocol/textbook-library.json')),catalog=JSON.parse(source);
 if(catalog.protocol!=='second-language-textbook-library/1'||!/^[-a-z0-9]{1,80}$/.test(catalog.id||'')||!Array.isArray(catalog.files)||new Set(catalog.files.map(f=>f.file)).size!==catalog.files.length||catalog.files.some(f=>!/^[-A-Za-z0-9_]+\.(md|json)$/.test(f.file)||!/^[a-f0-9]{40}$/.test(f.gitBlob)||!Number.isSafeInteger(f.bytes)||f.bytes<1||f.digest&&!/^[a-f0-9]{64}$/.test(f.digest))||!['collins','oxford'].every(book=>catalog.files.some(f=>f.book===book)))throw Error('第二语言独立教材目录无效');
 return {catalog,catalogDigest:sha256(source),directory:path.join(root,'.cache/textbook-library/blobs')};
}
function checkBytes(file,bytes){if(bytes.length!==file.bytes||gitBlob(bytes)!==file.gitBlob||file.digest&&sha256(bytes)!==file.digest)throw Error('独立教材原件摘要不符：'+file.file);}
export async function readLibraryFile(library,file){
 const target=path.join(library.directory,file.gitBlob);
 let bytes;try{const base=await realpath(library.directory),actual=await realpath(target);if(path.dirname(actual)!==base)throw Error('独立教材原件越出资料库');bytes=await readFile(actual);}catch(error){if(error.code==='ENOENT')throw Error('第二语言独立教材尚未就绪：'+file.file+'；不回退读取 VIX 教材，先完成已授权的原件移交。');throw error;}
 checkBytes(file,bytes);return bytes;
}
export async function assertTextbookLibraryReady(root){const library=await textbookLibrary(root);for(const file of library.catalog.files)await readLibraryFile(library,file);return {ready:true,libraryId:library.catalog.id,files:library.catalog.files.length,directory:library.directory};}
// Explicit transfer only: no lookup of former VIX directories, no credentials
// and no network. The caller must have authorization for its --from directory.
export async function importTextbookLibrary(root,sourceDirectory){
 const library=await textbookLibrary(root),source=await realpath(sourceDirectory),dest=path.resolve(library.directory);
 if(process.platform==='win32'&&!/^D:[\\/]/i.test(dest))throw Error('独立教材实体须存 D 盘');
 await mkdir(dest,{recursive:true});
 if(process.platform==='win32'&&!/^D:[\\/]/i.test(await realpath(dest)))throw Error('独立教材实际路径须存 D 盘');
 let imported=0,reused=0;
 for(const file of library.catalog.files){
  const target=path.join(dest,file.gitBlob);let existing;try{existing=await readFile(target);}catch(error){if(error.code!=='ENOENT')throw error;}
  if(existing){checkBytes(file,existing);reused++;continue;}
  const original=await realpath(path.join(source,file.file));if(path.dirname(original)!==source)throw Error('教材移交原件不在授权目录');
  const bytes=await readFile(original);checkBytes(file,bytes);const temp=target+'.'+randomUUID()+'.tmp';
  try{await writeFile(temp,bytes,{flag:'wx'});try{await link(temp,target);}catch(error){if(error.code!=='EEXIST')throw error;checkBytes(file,await readFile(target));}}finally{await rm(temp,{force:true});}
  imported++;
 }
 return {libraryId:library.catalog.id,catalogDigest:library.catalogDigest,directory:dest,imported,reused,bytes:library.catalog.files.reduce((n,f)=>n+f.bytes,0)};
}
function legacyFiles(lock,library){
 const files=lock.inputs?.filter(f=>f.path.startsWith('textbook/'))||[];
 if(!files.length){if(lock.vixAccessPolicy!=='auxiliary-index-only-v1')throw Error('旧教材固定身份缺失，不擅自套用现行教材');return library.catalog.files;}
 const selected=library.catalog.files.filter(f=>files.some(p=>p.path==='textbook/'+f.file));
 if(!['collins','oxford'].every(b=>selected.some(f=>f.book===b))||selected.some(f=>!files.some(p=>p.path==='textbook/'+f.file&&p.sha===f.gitBlob&&p.size===f.bytes)))throw Error('旧输入所固定的教材与独立资料库不同；恢复同摘要原件，不升级旧稿');
 return selected;
}
export async function textbookSource(root,{date,commit}={}){
 if(!/^[a-f0-9]{40}$/.test(commit||''))throw Error('缺少原运行输入身份');
 if(date&&(!/^20\d{2}-\d{2}-\d{2}$/.test(date)||new Date(date).toISOString().slice(0,10)!==date))throw Error('独立教材运行日期无效');
 const library=await textbookLibrary(root);
 if(date){
  const run=path.join(root,'work/runs',date),file=path.join(run,'textbook-source.json'),existing=await optional(file);
  if(existing){if(existing.protocol!=='second-language-textbook-source/1'||existing.studyDate!==date||existing.inputCommit!==commit||!Array.isArray(existing.files)||!existing.files.every(f=>library.catalog.files.some(c=>c.file===f.file&&c.gitBlob===f.gitBlob&&c.digest===f.digest)))throw Error('原独立教材锁身份不符，不刷新或升级');return {...library,source:existing,sourceFile:file};}
  const lock=await optional(path.join(run,'vix-source.json'));if(!lock||lock.commit!==commit)throw Error('独立教材须绑定原运行输入');
  const files=legacyFiles(lock,library);for(const item of files)await readLibraryFile(library,item);
  const value={protocol:'second-language-textbook-source/1',studyDate:date,inputCommit:commit,libraryId:library.catalog.id,catalogDigest:library.catalogDigest,files};
  await mkdir(run,{recursive:true});const temp=file+'.'+randomUUID()+'.tmp';try{await writeFile(temp,JSON.stringify(value,null,2)+'\n',{flag:'wx'});try{await link(temp,file);}catch(error){if(error.code!=='EEXIST')throw error;}}finally{await rm(temp,{force:true});}
  return textbookSource(root,{date,commit});
 }
 // Legacy read-only jobs identify their exact dictionary version from Second
 // Language's own run inventory/receipt, never a mutable VIX tree or filename.
 const runs=path.join(root,'work/runs');let entries;try{entries=await readdir(runs,{withFileTypes:true});}catch(error){if(error.code!=='ENOENT')throw error;entries=[];}
 for(const entry of entries){if(!entry.isDirectory()||!/^20\d{2}-\d{2}-\d{2}$/.test(entry.name))continue;const run=path.join(runs,entry.name),lock=await optional(path.join(run,'vix-source.json'));if(!lock)continue;const publication=await optional(path.join(run,'vix-publication.json'));if(lock.commit!==commit&&publication?.vixCommit!==commit)continue;
  const prior=await optional(path.join(run,'textbook-source.json'));
  const files=prior?.files||legacyFiles(lock,library);if(!files.every(f=>library.catalog.files.some(c=>c.gitBlob===f.gitBlob&&c.file===f.file)))throw Error('历史教材版本不在独立资料库，保持缺件');
  return {...library,source:{protocol:'second-language-textbook-source/1',inputCommit:lock.commit,files}};
 }
 throw Error('没有可核对的本项目旧教材身份；不从 VIX 仓库补读或换用当前教材');
}
