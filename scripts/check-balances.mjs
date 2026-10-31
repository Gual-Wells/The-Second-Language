import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {publisherConfig} from './lib/publisher-config.mjs';
import {pendingTencentUsage,markTencentUsageReported} from './lib/tencent-quota-ledger.mjs';
import {tencentBalance,cloudflareQuota} from './lib/account-quotas.mjs';
import {finishTaskStorage} from './lib/storage-finish.mjs';
import {reportStorageUsage} from './check-storage-usage.mjs';
import {openAIQuota} from './lib/openai-quota.mjs';
import {runSeriesStorageCollector} from './collect-series-storage.mjs';
export async function checkTaskBalances(){
 try {
 const reports=await Promise.all(['cloudflare','tencent'].map(async pool=>{
  try{return pool==='cloudflare'?await cloudflareQuota():await tencentBalance(JSON.parse(await readFile(new URL('../.cache/speaking-provider.json',import.meta.url),'utf8')));}
  catch{return {pool,verified:false,remaining:null,checkedAt:new Date().toISOString()};}
 }));
 try{reports.push(await openAIQuota(JSON.parse(await readFile(new URL('../.cache/openai-config.json',import.meta.url),'utf8'))));}catch{}
 const usage=await pendingTencentUsage();
 const {base,token}=await publisherConfig();
 let result;
 for(let start=0;start<Math.max(usage.length,1);start+=40){
  const batch=usage.slice(start,start+40);
  const r=await fetch(new URL('/api/balances/report',base),{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify({reports,usage:batch.map(({file,reported,...event})=>event)}),signal:AbortSignal.timeout(60000)});
  result=await r.json();if(!r.ok)throw Error(result.error||`额度核对 ${r.status}`);
  await markTencentUsageReported(batch);
 }
 for(const p of result.pools)console.log(`${p.pool}: ${p.verified||p.estimated?p.remaining+' '+p.unit+(p.estimated?'（估算）':''):'未核实'}${p.low?'；'+p.warning:''}`);
 return result;
 } finally {try{await reportStorageUsage();}catch{console.warn('存储用量更新暂未完成，保留上次记录。');}try{await runSeriesStorageCollector();}catch{console.warn('系列存储记录暂未更新，保留上次记录。');}await finishTaskStorage(); }
}
export async function finishTaskBalances(){try{return await checkTaskBalances();}catch{console.warn('任务已完成，但额度核对暂不可用；请在设置中查看余额。');}}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])await checkTaskBalances();
