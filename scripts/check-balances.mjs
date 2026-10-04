import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {publisherConfig} from './lib/publisher-config.mjs';
import {tencentBalance,cloudflareQuota} from './lib/account-quotas.mjs';
export async function checkTaskBalances(){
 const reports=await Promise.all(['cloudflare','tencent'].map(async pool=>{
  try{return pool==='cloudflare'?await cloudflareQuota():await tencentBalance(JSON.parse(await readFile(new URL('../.cache/speaking-provider.json',import.meta.url),'utf8')));}
  catch{return {pool,verified:false,remaining:null,checkedAt:new Date().toISOString()};}
 }));
 const {base,token}=await publisherConfig();
 const r=await fetch(new URL('/api/balances/report',base),{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify({reports}),signal:AbortSignal.timeout(60000)}),result=await r.json();
 if(!r.ok)throw Error(result.error||`额度核对 ${r.status}`);
 for(const p of result.pools)console.log(`${p.pool}: ${p.verified?p.remaining+' '+p.unit:'未核实'}${p.low?'；'+p.warning:''}`);
 return result;
}
export async function finishTaskBalances(){try{return await checkTaskBalances();}catch{console.warn('任务已完成，但额度核对暂不可用；请在设置中查看余额。');}}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])await checkTaskBalances();
