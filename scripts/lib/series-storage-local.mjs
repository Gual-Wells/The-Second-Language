import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {windowsProtect,downloadItem} from './onedrive-local.mjs';
import {hfObjectStore} from '../../worker/src/shared/hf-object-store.mjs';
import * as http from 'node:http';

const buckets={language:'second-language-assets',algorithm:'second-algorithm-assets',schedule:'second-schedule-archives',ledger:'second-ledger-archives'};
export function projectFilesFromCredentials(project,credentials,{fetchImpl=fetch}={}){
 if(!Object.hasOwn(buckets,project))throw Error('存储项目无效');
 // Credentials contain key material only; they cannot override the fixed project pool.
 return hfObjectStore({namespace:'Gual-Wells',bucket:buckets[project],accessKeyId:credentials?.accessKeyId,secretAccessKey:credentials?.secretAccessKey,fetchImpl});
}
export async function localSeriesFiles(project='language'){
 if(!Object.hasOwn(buckets,project))throw Error('存储项目无效');
 const config=JSON.parse(await readFile(process.env.SECOND_SERIES_STORAGE_CONFIG||new URL('../../.cache/series-storage-local.json',import.meta.url),'utf8'));
 if(typeof config.hfCredentialFile!=='string'||!path.isAbsolute(config.hfCredentialFile))throw Error('本机存储凭据配置无效');
 const credentials=JSON.parse((await windowsProtect(await readFile(config.hfCredentialFile),true)).toString('utf8'));
 if((process.env.HTTPS_PROXY||process.env.HTTP_PROXY)&&typeof http.setGlobalProxyFromEnv==='function')http.setGlobalProxyFromEnv();
 return projectFilesFromCredentials(project,credentials);
}
// Old OneDrive item IDs retain their old meaning. New locators have an explicit version.
export async function downloadStoredItem(locator,range=null,{legacyDownload=downloadItem,filesFactory=localSeriesFiles}={}){
 if(typeof locator==='string'&&locator.length>0&&!locator.startsWith('hf-v1:'))return legacyDownload(locator,range);
 if(typeof locator!=='string'&&(!locator||typeof locator!=='object'||Array.isArray(locator)||Object.keys(locator).sort().join(',')!=='digest,project,provider,version'))throw Error('恢复文件定位无效');
 const digest=typeof locator==='string'?locator.slice(6):locator?.version===2&&locator.provider==='huggingface-s3'&&locator.project==='language'?locator.digest:null;
 if(typeof digest!=='string'||!/^[a-f0-9]{64}$/.test(digest))throw Error('恢复文件定位无效');
 const store=await filesFactory('language');
 const result=await store.responseContent(digest,new Request('https://private-recovery.invalid/',{headers:range?{range}:{}}));
 if(!result)throw Error('恢复文件原件不存在');return result;
}
