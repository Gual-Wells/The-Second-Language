// Local paths only. Secrets stay in their existing private file / DPAPI store.
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
export async function localServices(root=projectRoot){
 const filename=process.env.SECOND_LANGUAGE_LOCAL_CONFIG||path.join(root,'.cache/local-services.json');
 let value={};try{value=JSON.parse((await readFile(filename,'utf8')).replace(/^\uFEFF/,''));}catch(e){if(e.code!=='ENOENT')throw e;}
 for(const key of ['publisherCredentialFile','privateCacheDirectory','archiveStateDirectory','archiveServiceRoot','nativeCraftDirectory'])if(value[key]!==undefined&&(typeof value[key]!=='string'||!path.isAbsolute(value[key])))throw Error('本机服务路径配置无效：'+key);
 return value;
}
export async function privateCacheDirectory(){const value=await localServices();return value.privateCacheDirectory||path.join(projectRoot,'.cache');}
export async function archiveStateDirectory(root=projectRoot){const value=await localServices(root);return value.archiveStateDirectory||path.join(root,'.cache/storage-upgrade');}
