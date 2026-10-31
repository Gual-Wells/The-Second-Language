import test from 'node:test';
import assert from 'node:assert/strict';
import {SERIES_D1_DATABASES,collectD1Inventory,collectOneDriveInventory,collectKVInventory,collectSeriesStorage,publishSeriesStorage,runSeriesStorageCollector} from './collect-series-storage.mjs';

const now=Date.now()-1000;
const json=(body,status=200)=>Response.json(body,{status});
const extras=['00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003'];
function d1Mock({pageSize=100,missing=null,failInfo=null,transformPage=value=>value}={}){
 const ids=[...SERIES_D1_DATABASES.map(binding=>binding.id),...extras].filter(id=>id!==missing),calls=[],sizes=new Map(ids.map((id,index)=>[id,(index+1)*100]));
 const read=async route=>{
  calls.push(route);if(route.startsWith('/d1/database?')){
   const page=Number(new URL(route,'https://metadata.invalid').searchParams.get('page'));
   return json(transformPage({success:true,result:ids.slice((page-1)*pageSize,page*pageSize).map(uuid=>({uuid,name:'not-returned'})),result_info:{page,per_page:pageSize,count:ids.slice((page-1)*pageSize,page*pageSize).length,total_count:ids.length,total_pages:Math.max(1,Math.ceil(ids.length/pageSize))}},page));
  }
  const id=route.split('/').at(-1);if(id===failInfo)return json({error:'private credential diagnostic'},403);
  if(!sizes.has(id))return json({success:false},404);
  return json({success:true,result:{uuid:id,name:'must-not-be-output',file_size:sizes.get(id),created_at:'irrelevant'}});
 };
 return {read,calls,ids,sizes};
}
const quota=async()=>json({quota:{used:200,total:1000,remaining:750,deleted:0},id:'private-account-id'});
const today=new Date(now).toISOString().slice(0,10);
const kvRow=(namespaceId,byteCount,date=today)=>({max:{byteCount},dimensions:{date,namespaceId}});
const kvData=rows=>({data:{viewer:{accounts:[{kvStorageAdaptiveGroups:rows}]}}});
const kv=async()=>json(kvData([kvRow('c06595e0069247cd8cf702ac9756cdea',100),kvRow('cd0a805ac55146d599f70a32fa9aa0f2',200),kvRow('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',40)]));
const external=(resourceId='hf-private-account',extra={})=>({resourceId,revision:now,observedAt:now,verified:true,measurement:'inventory',complete:false,usedBytes:123,limitBytes:null,remainingBytes:null,...extra});

test('D1 inventory reads management metadata only and reports six project resources plus one account rollup',async()=>{
 const m=d1Mock(),value=await collectD1Inventory({cloudflareImpl:m.read,observedAt:now});
 assert.equal(value.reports.length,7);assert.equal(value.reports.filter(report=>report.verified).length,7);
 assert.deepEqual(value.inventory,{d1Complete:true,d1DatabaseCount:9,d1DatabaseLimit:10,seriesD1DatabaseCount:6,otherD1DatabaseCount:3});
 assert(m.calls.every(route=>route.startsWith('/d1/database')&&!route.includes('/query')&&!route.includes('/export')));
 assert(!JSON.stringify(value).includes('not-returned'));assert(!JSON.stringify(value).includes('00000000-0000'));
 const account=value.reports[0];assert.equal(account.usedBytes,4500);assert.equal(account.otherUsedBytes,2400);assert.deepEqual(account.projectAttributedBytes,{language:600,algorithm:400,schedule:500,ledger:600});
});
test('D1 successful size reads do not claim to have measured provider quota or remaining space',async()=>{
 const m=d1Mock(),value=await collectD1Inventory({cloudflareImpl:m.read,observedAt:now});
 for(const report of value.reports){assert.equal(report.measurement,'database-size');assert.equal(report.limitBytes,null);assert.equal(report.remainingBytes,null);}
});
test('all D1 pages must be complete and consistent before account totals are trusted',async()=>{
 const m=d1Mock({pageSize:3}),value=await collectD1Inventory({cloudflareImpl:m.read,observedAt:now});
 assert.equal(value.inventory.d1Complete,true);assert.equal(m.calls.filter(route=>route.includes('?')).length,3);assert.equal(value.reports[0].usedBytes,4500);
});
test('changed pagination total, missing metadata and duplicate database IDs invalidate the account inventory',async()=>{
 for(const transformPage of [
  (value,page)=>page===2?{...value,result_info:{...value.result_info,total_count:10}}:value,
  value=>({...value,result_info:undefined}),
  (value,page)=>page===2?{...value,result:value.result.map((row,index)=>index===0?{uuid:SERIES_D1_DATABASES[0].id}:row)}:value,
  value=>({...value,result_info:{...value.result_info,count:99}})
 ]){
  const m=d1Mock({pageSize:3,transformPage}),value=await collectD1Inventory({cloudflareImpl:m.read,observedAt:now});assert.equal(value.inventory.d1Complete,false);assert(value.reports.every(report=>!report.verified));
 }
});
test('a missing expected project database remains unknown and does not silently become a zero-size database',async()=>{
 const m=d1Mock({missing:SERIES_D1_DATABASES[2].id}),value=await collectD1Inventory({cloudflareImpl:m.read,observedAt:now});
 assert.equal(value.inventory.d1Complete,false);assert.equal(value.inventory.seriesD1DatabaseCount,5);assert.equal(value.reports[0].verified,false);
 assert.equal(value.reports.find(report=>report.resourceId==='d1-language-lab').verified,false);
 assert.equal(value.reports.find(report=>report.resourceId==='d1-schedule').verified,true);
});
test('one database metadata failure preserves successful project sizes but refuses a partial account total',async()=>{
 const m=d1Mock({failInfo:extras[0]}),value=await collectD1Inventory({cloudflareImpl:m.read,observedAt:now});
 assert.equal(value.reports[0].verified,false);assert.equal(value.reports.slice(1).every(report=>report.verified),true);
 assert.equal(value.inventory.d1Complete,false);assert(!JSON.stringify(value).includes('credential diagnostic'));
});
test('an empty account with expected active bindings is not mistaken for a successfully measured zero account',async()=>{
 const read=async()=>json({success:true,result:[],result_info:{page:1,per_page:100,count:0,total_count:0,total_pages:1}});
 const value=await collectD1Inventory({cloudflareImpl:read,observedAt:now});assert.equal(value.inventory.d1DatabaseCount,0);assert.equal(value.inventory.d1Complete,false);assert(value.reports.every(report=>!report.verified));
});
test('OneDrive uses the current provider quota and makes no duplicate whole-AppFolder project attribution',async()=>{
 const calls=[],value=await collectOneDriveInventory({graphRequestImpl:async route=>{calls.push(route);return quota();},observedAt:now});
 assert.equal(value.verified,true);assert.equal(value.usedBytes,200);assert.equal(value.limitBytes,1000);assert.equal(value.remainingBytes,750);assert.equal(value.projectAttributedBytes,null);assert.equal(value.otherUsedBytes,null);
 assert.deepEqual(calls,['/me/drive?$select=quota']);assert.equal(value.measurement,'provider-quota');
});
test('OneDrive missing counters or authentication failure produce no false zero and no account identity leak',async()=>{
 for(const graphRequestImpl of [async()=>json({quota:{used:0,total:1000}}),async()=>json({quota:{used:-1,total:1000,remaining:1000}}),async()=>{throw Error('Bearer private-token');}]){
  const value=await collectOneDriveInventory({graphRequestImpl,observedAt:now});assert.deepEqual(value,{resourceId:'onedrive-account',revision:now,observedAt:now,verified:false});
 }
});
test('KV uses one account daily-high-water measurement and never reports it as real-time remaining quota',async()=>{
 let seen;const value=await collectKVInventory({cloudflareRequestImpl:async(route,options)=>{seen={route,options};return kv();},observedAt:now});
 assert.equal(value.usedBytes,340);assert.equal(value.measurement,'daily-high-water');assert.equal(value.complete,false);assert.equal(value.limitBytes,null);assert.equal(value.remainingBytes,null);assert.deepEqual(value.projectAttributedBytes,{language:300});
 assert.equal(seen.route,'/graphql');assert.equal(seen.options.method,'POST');assert(!seen.options.body.includes('values'));
});
test('KV sums namespaces from the latest observed date only and leaves missing project attribution unknown',async()=>{
 const previous=new Date(now-86400000).toISOString().slice(0,10);
 const value=await collectKVInventory({cloudflareRequestImpl:async()=>json(kvData([kvRow('c06595e0069247cd8cf702ac9756cdea',100,previous),kvRow('cd0a805ac55146d599f70a32fa9aa0f2',200),kvRow('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',40)])),observedAt:now});
 assert.equal(value.usedBytes,240);assert.equal(value.projectAttributedBytes,null);
});
test('invalid, duplicate, truncated or empty KV groups are not reported as complete account consumption',async()=>{
 for(const rows of [[],[kvRow('bad',1)],[kvRow('a'.repeat(32),-1)],[kvRow('a'.repeat(32),1),kvRow('a'.repeat(32),2)],Array.from({length:10000},()=>kvRow('a'.repeat(32),1))]){
  const value=await collectKVInventory({cloudflareRequestImpl:async()=>json(kvData(rows)),observedAt:now});assert.equal(value.verified,false);
 }
 const value=await collectKVInventory({cloudflareRequestImpl:async()=>json({errors:[{message:'do not emit this private account error'}]}),observedAt:now});assert.equal(value.verified,false);assert(!JSON.stringify(value).includes('private account error'));
});
test('the collector returns exactly the whitelisted metadata records and explicitly unknown external resources',async()=>{
 const m=d1Mock(),value=await collectSeriesStorage({cloudflareImpl:m.read,cloudflareRequestImpl:kv,graphRequestImpl:quota,observedAt:now});
 assert.equal(value.reports.length,11);assert.equal(value.reports.filter(report=>report.resourceId==='cloudflare-kv-account').length,1);
 assert.equal(value.reports.find(report=>report.resourceId==='hf-private-account').verified,false);
 assert.equal(value.reports.find(report=>report.resourceId==='kaggle-private-account').verified,false);
 assert.equal(value.inventory.d1DatabaseCount,9);assert(!JSON.stringify(value).includes('private-account-id'));
});
test('external SDK summaries are accepted only for the two fixed external account resources and retain their evidence time',async()=>{
 const m=d1Mock(),value=await collectSeriesStorage({cloudflareImpl:m.read,cloudflareRequestImpl:kv,graphRequestImpl:quota,observedAt:now,externalReports:[external('hf-private-account',{observedAt:now-100,revision:now-100})]});
 const hf=value.reports.find(report=>report.resourceId==='hf-private-account');assert.equal(hf.usedBytes,123);assert.equal(hf.observedAt,now-100);assert.equal(hf.remainingBytes,null);assert.equal(hf.measurement,'inventory');
});
test('invalid external summaries fail before any network work and cannot smuggle project content or override D1',async()=>{
 let calls=0;const read=async()=>{calls++;throw Error('not reached');};
 for(const externalReports of [[external('d1-language')],[external('hf-private-account',{question:'private'})],[external(),external()],['text']])await assert.rejects(collectSeriesStorage({cloudflareImpl:read,cloudflareRequestImpl:read,graphRequestImpl:read,externalReports,observedAt:now}));
 assert.equal(calls,0);
});
test('all provider failures become bounded unknown metadata without exposing raw authentication errors',async()=>{
 const fail=async()=>{throw Error('secret token and remote response body');};
 const value=await collectSeriesStorage({cloudflareImpl:fail,cloudflareRequestImpl:fail,graphRequestImpl:fail,observedAt:now});
 assert(value.reports.every(report=>report.verified===false));assert(!JSON.stringify(value).includes('secret'));assert.equal(value.inventory.d1DatabaseCount,null);
});
test('publisher sends only validated reports to the fixed endpoint and never forwards local inventory diagnostics',async()=>{
 let sent;const value=await publishSeriesStorage({reports:[external()],inventory:{private:'must not transmit'}},{publisherConfigImpl:async()=>({base:'https://fixture.invalid/',token:'fixture-protected'}),fetchImpl:async(url,options)=>{sent={url:String(url),options};return json({ok:true});}});
 assert.equal(value.ok,true);assert.equal(sent.url,'https://fixture.invalid/api/series/storage/report');assert.equal(sent.options.redirect,'manual');assert.deepEqual(Object.keys(JSON.parse(sent.options.body)),['reports']);assert(!sent.options.body.includes('must not transmit'));
});
test('a rejected or redirected publication never reports success and never surfaces the private error body',async()=>{
 for(const status of [302,401,500])await assert.rejects(publishSeriesStorage({reports:[external()]},{publisherConfigImpl:async()=>({base:'https://fixture.invalid/',token:'fixture'}),fetchImpl:async()=>json({error:'sensitive provider text'},status)}),/^Error: 系列存储记录发布未完成$/);
});
test('unknown command-line options are rejected before credential access, collection or publication',async()=>{
 await assert.rejects(runSeriesStorageCollector(['--unknown']),/参数无效/);await assert.rejects(runSeriesStorageCollector(['--output']),/参数无效/);
});
