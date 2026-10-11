import {cloudflare,cloudflareRequest,account} from './lib/cloudflare-local.mjs';
import {graphRequest} from './lib/onedrive-local.mjs';
import {publisherConfig} from './lib/publisher-config.mjs';
import {fileURLToPath} from 'node:url';
export async function reportStorageUsage(){
 const checkedAt=Date.now(),config=(await import('node:fs/promises')).readFile;
 const bindings=JSON.parse(await config(new URL('../worker/wrangler.jsonc',import.meta.url),'utf8')).d1_databases;
 const jobs=[['onedrive',async()=>{const [drive,app]=await Promise.all(['/me/drive?$select=quota','/me/drive/special/approot?$select=size'].map(async p=>(await graphRequest(p)).json()));return{usedBytes:drive.quota?.used,limitBytes:drive.quota?.total,remainingBytes:drive.quota?.remaining,deletedBytes:drive.quota?.deleted,projectBytes:app.size};}],
 ...[['main','DB'],['practice','PRACTICE_DB'],['lab','CERTIFICATION_LAB_DB']].map(([pool,binding])=>[pool,async()=>{const id=bindings.find(b=>b.binding===binding)?.database_id;if(!id)throw Error('数据库未配置');const data=await(await cloudflare('/d1/database/'+id)).json();if(!data.success)throw Error('数据库大小未核实');return{usedBytes:data.result.file_size,limitBytes:500000000};}]),
 ['kv',async()=>{const today=new Date(checkedAt).toISOString().slice(0,10),start=new Date(checkedAt-2*86400000).toISOString().slice(0,10);
  const query=`{viewer{accounts(filter:{accountTag:"${account}"}){kvStorageAdaptiveGroups(filter:{date_geq:"${start}",date_leq:"${today}"},limit:10000,orderBy:[date_DESC]){max{byteCount}dimensions{date namespaceId}}}}}`;
  const data=await(await cloudflareRequest('/graphql',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({query})})).json();if(data.errors?.length)throw Error('缓存大小未核实');const rows=data.data?.viewer?.accounts?.[0]?.kvStorageAdaptiveGroups;if(!rows?.length||rows.length>=10000)throw Error('缓存统计不完整');const measurementDate=rows.map(r=>r.dimensions.date).sort().at(-1),latest=rows.filter(r=>r.dimensions.date===measurementDate),namespace=id=>latest.find(r=>r.dimensions.namespaceId.replaceAll('-','')===id)?.max.byteCount;
  return{usedBytes:latest.reduce((n,r)=>n+r.max.byteCount,0),limitBytes:1000000000,measurementDate,chapterCacheBytes:namespace('c06595e0069247cd8cf702ac9756cdea'),practiceCacheBytes:namespace('cd0a805ac55146d599f70a32fa9aa0f2')};}]];
 const reports=await Promise.all(jobs.map(async([pool,read])=>{try{const data=await read();if(!Number.isSafeInteger(data.usedBytes)||!Number.isSafeInteger(data.limitBytes)||data.limitBytes<=0)throw Error('容量未返回');return{pool,verified:true,checkedAt,...data};}catch{return{pool,verified:false,checkedAt};}}));
 const {base,token}=await publisherConfig(),r=await fetch(new URL('/api/storage/usage/report',base),{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify({reports}),signal:AbortSignal.timeout(60000)});if(!r.ok)throw Error('存储用量记录未发布');const value=await r.json();for(const p of value.pools)console.log(`${p.name}: ${p.checkedAt?p.usedBytes+' / '+p.limitBytes+' bytes':'未核实'}${p.updateFailed?'；本次更新未成功':''}`);return value;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])await reportStorageUsage();
