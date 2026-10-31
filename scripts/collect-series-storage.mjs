// Account metadata collection only. No SQL, KV values, private object names or project content.
import {mkdir,readFile,writeFile,rename,realpath} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {cloudflare,cloudflareRequest,account} from './lib/cloudflare-local.mjs';
import {graphRequest} from './lib/onedrive-local.mjs';
import {publisherConfig} from './lib/publisher-config.mjs';
import {cleanSeriesStorageReports} from '../worker/src/series-storage.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const uuid=value=>typeof value==='string'&&/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value);
const number=value=>Number.isSafeInteger(value)&&value>=0;
const safeSum=values=>values.reduce((sum,value)=>{if(!number(value)||!number(sum+value))throw Error('存储统计范围无效');return sum+value;},0);
const failure=(resourceId,observedAt)=>({resourceId,revision:observedAt,observedAt,verified:false});
const measured=(resourceId,observedAt,data)=>({resourceId,revision:observedAt,observedAt,verified:true,usedBytes:null,limitBytes:null,remainingBytes:null,...data});
export const SERIES_D1_DATABASES=Object.freeze([
 {resourceId:'d1-language',project:'language',id:'e9d0f4ee-a720-4fa9-8c45-3f1974243092'},
 {resourceId:'d1-language-practice',project:'language',id:'bf3d8fed-55cf-49fc-8c12-4fa62462c034'},
 {resourceId:'d1-language-lab',project:'language',id:'e9670929-9f45-40b9-89c7-e03c20a43fe3'},
 {resourceId:'d1-algorithm',project:'algorithm',id:'c396b1ca-43fb-4a77-b9b2-c90c7f436b41'},
 {resourceId:'d1-schedule',project:'schedule',id:'8d87acfa-cd34-4995-860a-e2b1e589572d'},
 {resourceId:'d1-ledger',project:'ledger',id:'551324e1-695d-42ae-a93b-eb5a9d56a021'}
]);

async function jsonResponse(response){if(!response?.ok)throw Error('存储管理接口不可用');return response.json();}
export async function collectD1Inventory({cloudflareImpl=cloudflare,observedAt=Date.now()}={}){
 const failed=()=>({reports:['cloudflare-d1-account',...SERIES_D1_DATABASES.map(binding=>binding.resourceId)].map(id=>failure(id,observedAt)),inventory:{d1Complete:false,d1DatabaseCount:null,d1DatabaseLimit:10,seriesD1DatabaseCount:null,otherD1DatabaseCount:null}});
 let listed;
 try{
  listed=[];const seen=new Set();let total=null,perPage=null;
  for(let page=1;page<=32;page++){
   const value=await jsonResponse(await cloudflareImpl(`/d1/database?per_page=100&page=${page}`)),info=value.result_info;
   if(value.success!==true||!Array.isArray(value.result)||!info||info.page!==page||!number(info.count)||info.count!==value.result.length||!Number.isSafeInteger(info.per_page)||info.per_page<1||info.per_page>100||!number(info.total_count))throw Error('数据库目录未完整核实');
   if(total===null){total=info.total_count;perPage=info.per_page;}else if(total!==info.total_count||perPage!==info.per_page)throw Error('数据库目录在盘点期间发生变化');
   const totalPages=Math.max(1,Math.ceil(total/perPage));if(totalPages>32||info.total_pages!==undefined&&info.total_pages!==totalPages)throw Error('数据库分页未完整核实');
   if(page<totalPages&&value.result.length!==perPage||page===totalPages&&value.result.length!==total-(page-1)*perPage)throw Error('数据库分页条目不完整');
   for(const row of value.result){const id=row?.uuid??row?.id;if(!uuid(id)||seen.has(id))throw Error('数据库目录身份无效');seen.add(id);listed.push(id);}
   if(page===totalPages){if(listed.length!==total)throw Error('数据库目录总数不一致');break;}
  }
 }catch{return failed();}
 const details=await Promise.all(listed.map(async id=>{try{const value=await jsonResponse(await cloudflareImpl('/d1/database/'+id)),row=value.result;
  if(value.success!==true||!row||!number(row.file_size)||(row.uuid??row.id)!==id)throw Error('数据库大小未核实');return{id,size:row.file_size};
 }catch{return{id,size:null};}}));
 const sizes=new Map(details.map(row=>[row.id,row.size]));
 const reports=SERIES_D1_DATABASES.map(binding=>number(sizes.get(binding.id))?measured(binding.resourceId,observedAt,{measurement:'database-size',complete:true,usedBytes:sizes.get(binding.id)}):failure(binding.resourceId,observedAt));
 const complete=details.every(row=>number(row.size))&&SERIES_D1_DATABASES.every(binding=>sizes.has(binding.id));
 const knownIds=new Set(SERIES_D1_DATABASES.map(binding=>binding.id));
 const inventory={d1Complete:complete,d1DatabaseCount:listed.length,d1DatabaseLimit:10,seriesD1DatabaseCount:listed.filter(id=>knownIds.has(id)).length,otherD1DatabaseCount:listed.filter(id=>!knownIds.has(id)).length};
 if(complete){
  const projectAttributedBytes=Object.fromEntries(['language','algorithm','schedule','ledger'].map(project=>[project,safeSum(SERIES_D1_DATABASES.filter(binding=>binding.project===project).map(binding=>sizes.get(binding.id)))]));
  reports.unshift(measured('cloudflare-d1-account',observedAt,{measurement:'database-size',complete:true,usedBytes:safeSum(details.map(row=>row.size)),projectAttributedBytes,otherUsedBytes:safeSum(details.filter(row=>!knownIds.has(row.id)).map(row=>row.size))}));
 }else reports.unshift(failure('cloudflare-d1-account',observedAt));
 return {reports,inventory};
}

export async function collectOneDriveInventory({graphRequestImpl=graphRequest,observedAt=Date.now()}={}){
 try{
  const value=await jsonResponse(await graphRequestImpl('/me/drive?$select=quota')),quota=value.quota;
  if(!quota||!number(quota.used)||!number(quota.total)||quota.total===0||!number(quota.remaining))throw Error('云盘额度未核实');
  // AppFolder includes other projects; without disjoint complete inventories, attribution stays unknown.
  return measured('onedrive-account',observedAt,{measurement:'provider-quota',complete:true,usedBytes:quota.used,limitBytes:quota.total,remainingBytes:quota.remaining,projectAttributedBytes:null,otherUsedBytes:null});
 }catch{return failure('onedrive-account',observedAt);}
}

export async function collectKVInventory({cloudflareRequestImpl=cloudflareRequest,observedAt=Date.now()}={}){
 try{
  const today=new Date(observedAt).toISOString().slice(0,10),start=new Date(observedAt-2*86400000).toISOString().slice(0,10);
  const query=`{viewer{accounts(filter:{accountTag:"${account}"}){kvStorageAdaptiveGroups(filter:{date_geq:"${start}",date_leq:"${today}"},limit:10000,orderBy:[date_DESC]){max{byteCount}dimensions{date namespaceId}}}}}`;
  const value=await jsonResponse(await cloudflareRequestImpl('/graphql',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({query})}));
  const accounts=value.data?.viewer?.accounts,rows=accounts?.[0]?.kvStorageAdaptiveGroups;
  if(value.errors?.length||!Array.isArray(accounts)||accounts.length!==1||!Array.isArray(rows)||rows.length<1||rows.length>=10000)throw Error('缓存统计不完整');
  const seen=new Set();for(const row of rows){const date=row?.dimensions?.date,id=row?.dimensions?.namespaceId?.replaceAll('-','');
   if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||date<start||date>today||typeof id!=='string'||!/^[0-9a-f]{32}$/i.test(id)||!number(row?.max?.byteCount)||seen.has(date+':'+id))throw Error('缓存统计无效');seen.add(date+':'+id);
  }
  const latestDate=rows.map(row=>row.dimensions.date).sort().at(-1),latest=rows.filter(row=>row.dimensions.date===latestDate);
  const languageIds=['c06595e0069247cd8cf702ac9756cdea','cd0a805ac55146d599f70a32fa9aa0f2'];
  const languageRows=languageIds.map(id=>latest.find(row=>row.dimensions.namespaceId.replaceAll('-','')===id));
  const projectAttributedBytes=languageRows.every(Boolean)?{language:safeSum(languageRows.map(row=>row.max.byteCount))}:null;
  return measured('cloudflare-kv-account',observedAt,{measurement:'daily-high-water',complete:false,usedBytes:safeSum(latest.map(row=>row.max.byteCount)),projectAttributedBytes});
 }catch{return failure('cloudflare-kv-account',observedAt);}
}

export async function collectSeriesStorage({externalReports=[],cloudflareImpl=cloudflare,cloudflareRequestImpl=cloudflareRequest,graphRequestImpl=graphRequest,observedAt=Date.now()}={}){
 if(!number(observedAt)||!Array.isArray(externalReports)||externalReports.length>2)throw Error('外部存储汇总无效');
 if(externalReports.some(report=>!['hf-private-account','kaggle-private-account'].includes(report?.resourceId)))throw Error('外部汇总仅接受已登记的两项文件资源');
 const external=externalReports.length?cleanSeriesStorageReports('admin',{reports:externalReports}):[];
 const [d1,onedrive,kv]=await Promise.all([collectD1Inventory({cloudflareImpl,observedAt}),collectOneDriveInventory({graphRequestImpl,observedAt}),collectKVInventory({cloudflareRequestImpl,observedAt})]);
 const reports=cleanSeriesStorageReports('admin',{reports:[...d1.reports,onedrive,kv,...['hf-private-account','kaggle-private-account'].map(id=>external.find(report=>report.resourceId===id)||failure(id,observedAt))]});
 return {reports,inventory:d1.inventory};
}

export async function publishSeriesStorage(collection,{publisherConfigImpl=publisherConfig,fetchImpl=fetch}={}){
 const reports=cleanSeriesStorageReports('admin',{reports:collection.reports}),{base,token}=await publisherConfigImpl();
 const response=await fetchImpl(new URL('/api/series/storage/report',base),{method:'POST',redirect:'manual',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify({reports}),signal:AbortSignal.timeout(60000)});
 if(!response.ok)throw Error('系列存储记录发布未完成');
 return response.json();
}

export async function saveSeriesStorageCollection(filename,collection){
 const target=path.resolve(filename);await mkdir(path.dirname(target),{recursive:true});
 if(process.platform==='win32'&&!/^D:[\\/]/i.test(await realpath(path.dirname(target))))throw Error('存储盘点文件必须保存在D盘');
 const temporary=target+'.'+randomUUID()+'.tmp';await writeFile(temporary,JSON.stringify(collection,null,2)+'\n',{mode:0o600});await rename(temporary,target);
}

async function optionalExternalReports(){
 const configFile=path.join(root,'.cache/series-storage-local.json');let config;
 try{config=JSON.parse(await readFile(configFile,'utf8'));}catch(error){if(error.code==='ENOENT')return [];throw Error('本机存储采集配置无效');}
 if(!config.providerInventoryPython||!config.providerInventory)return [];
 const {spawn}=await import('node:child_process'),output=path.join(root,'.cache/series-storage/series-storage-report.json');
 const temporary=path.join(root,'.cache/series-storage/runtime-temp');await mkdir(temporary,{recursive:true});
 const code=await new Promise(resolve=>{const child=spawn(config.providerInventoryPython,[path.join(root,'scripts/lib/series-provider-inventory.py'),'--config',configFile,'--output',output],{windowsHide:true,stdio:'ignore',env:{...process.env,TMP:temporary,TEMP:temporary},signal:AbortSignal.timeout(60000)});child.on('error',()=>resolve(-1));child.on('close',resolve);});
 if(code!==0)return []; // The caller records failed checks while preserving prior values.
 try{const value=JSON.parse(await readFile(output,'utf8'));return cleanSeriesStorageReports('admin',value);}catch{throw Error('外部存储汇总无效');}
}
export async function runSeriesStorageCollector(args=process.argv.slice(2)){
 let output=path.join(root,'.cache/series-storage/last-collection.json'),publish=true,externalFile=null;
 for(let i=0;i<args.length;i++){
  if(args[i]==='--no-publish')publish=false;
  else if(args[i]==='--output'&&args[i+1])output=path.resolve(args[++i]);
  else if(args[i]==='--external-reports'&&args[i+1])externalFile=path.resolve(args[++i]);
  else throw Error('存储盘点参数无效');
 }
 const externalReports=externalFile?JSON.parse(await readFile(externalFile,'utf8')):await optionalExternalReports();
 const result=await collectSeriesStorage({externalReports});await saveSeriesStorageCollection(output,result);
 if(publish)await publishSeriesStorage(result);
 console.log(publish?'系列存储元数据已核对并更新。':'系列存储元数据已保存，尚未发布。');return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))try{await runSeriesStorageCollector();}catch{console.error('系列存储盘点未完成；已有记录保留。');process.exitCode=1;}
