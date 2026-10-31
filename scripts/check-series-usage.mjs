import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import vm from 'node:vm';
import {reportSeriesUsage,markSeriesUsageUnavailable,seriesUsageView} from '../worker/src/series-usage.js';
import {balanceView,checkBalances} from '../worker/src/balances.js';
import {openAIQuota} from './lib/openai-quota.mjs';
function fixture(){
 const sql=new DatabaseSync(':memory:');for(const name of readdirSync('worker/migrations').filter(n=>n.endsWith('.sql')).sort())sql.exec(readFileSync('worker/migrations/'+name,'utf8'));
 const DB={prepare(text){let args=[];return {bind(...v){args=v;return this;},async first(){return sql.prepare(text).get(...args)||null;},async all(){return {results:sql.prepare(text).all(...args)};},async run(){return {meta:{changes:Number(sql.prepare(text).run(...args).changes)}};}};},async batch(items){sql.exec('BEGIN');try{const rows=[];for(const item of items)rows.push(await item.run());sql.exec('COMMIT');return rows;}catch(error){sql.exec('ROLLBACK');throw error;}}};
 return {sql,env:{DB}};
}
const stamp=Date.now()-10000;
const snapshot=(responses=1,offset=0,extra={})=>({inputTokens:responses*10,outputTokens:responses*2,cachedInputTokens:responses,responses,unknownCalls:0,inProgressCalls:0,revision:responses,checkedAt:new Date(stamp+offset).toISOString(),...extra});
const creditReport=(extra={})=>({pool:'openai',verified:true,remaining:12,issuedAmount:20,expiresOn:null,creditCheckedAt:new Date(stamp-2*86400000).toISOString(),checkedAt:new Date(stamp).toISOString(),usage:{inputTokens:10,outputTokens:2,cachedInputTokens:1,responses:1},usageComplete:true,...extra});

test('only whitelisted numeric aggregate fields are accepted, never source/content/provider identifiers',async()=>{
 const f=fixture();try{
 for(const extra of [{source:'cloud-language'},{question:'private fixture'},{task:'id'},{responseId:'id'},{response_json:'text'},{image:'image'}])await assert.rejects(reportSeriesUsage(f.env,'cloud-algorithm',snapshot(1,0,extra)),/汇总用量字段/);
 for(const bad of [{inputTokens:-1},{outputTokens:0.1},{cachedInputTokens:100},{unknownCalls:NaN},{revision:-1},{checkedAt:'invalid'}])await assert.rejects(reportSeriesUsage(f.env,'cloud-algorithm',snapshot(1,0,bad)));
 assert.equal(f.sql.prepare('SELECT count(*) n FROM service_openai_usage_sources').get().n,0);
 }finally{f.sql.close();}
});
test('per-source snapshots sum once; retries replace one source instead of adding again',async()=>{
 const f=fixture();try{for(const [i,source] of ['local-shared','cloud-language','cloud-algorithm','cloud-schedule','cloud-ledger'].entries())await reportSeriesUsage(f.env,source,snapshot(i+1));
 await reportSeriesUsage(f.env,'cloud-ledger',snapshot(5));const view=await seriesUsageView(f.env);assert.equal(view.usage.responses,15);assert.equal(view.usage.inputTokens,150);assert.equal(view.usageSources.length,5);
 await reportSeriesUsage(f.env,'cloud-language',snapshot(3,1000));assert.equal((await seriesUsageView(f.env)).usage.responses,16);assert.equal(f.sql.prepare('SELECT count(*) n FROM service_openai_usage_sources').get().n,5);
 }finally{f.sql.close();}
});
test('older snapshots are ignored; equal receipt revision can update unknown/in-progress counters only',async()=>{
 const f=fixture();try{await reportSeriesUsage(f.env,'cloud-schedule',snapshot(2,100));
 assert.equal((await reportSeriesUsage(f.env,'cloud-schedule',snapshot(1))).ignored,true);
 await reportSeriesUsage(f.env,'cloud-schedule',snapshot(2,200,{unknownCalls:2,inProgressCalls:1}));assert.equal((await seriesUsageView(f.env)).usage.unknownCalls,2);
 await assert.rejects(reportSeriesUsage(f.env,'cloud-schedule',snapshot(2,300,{inputTokens:21})),/相同回执版本/);
 await assert.rejects(reportSeriesUsage(f.env,'cloud-schedule',snapshot(2,200,{unknownCalls:3})),/相同快照身份/);
 await assert.rejects(reportSeriesUsage(f.env,'cloud-schedule',snapshot(1,500,{revision:3})),/不能回退/);
 }finally{f.sql.close();}
});
test('failed local collection keeps the prior value and marks it unavailable, never reporting a false zero',async()=>{
 const f=fixture();try{await checkBalances(f.env,{reports:[creditReport()]});await reportSeriesUsage(f.env,'cloud-ledger',snapshot(2,100));
 await checkBalances(f.env,{reports:[creditReport({checkedAt:new Date(stamp+200).toISOString(),usage:null,usageComplete:false})]});
 const pool=(await balanceView(f.env)).pools.find(p=>p.pool==='openai');assert.equal(pool.usage.responses,3);assert.equal(pool.usageSources.find(s=>s.source==='local-shared').updateFailed,true);assert.equal(pool.creditCheckedAt,creditReport().creditCheckedAt);
 await checkBalances(f.env,{reports:[creditReport({checkedAt:new Date(stamp+300).toISOString()})]});assert.equal((await balanceView(f.env)).pools.find(p=>p.pool==='openai').usageSources.find(s=>s.source==='local-shared').updateFailed,false);
 }finally{f.sql.close();}
});
test('fresh cloud counters never refresh or overwrite old credit evidence and legacy reports cannot erase cloud',async()=>{
 const f=fixture();try{await checkBalances(f.env,{reports:[creditReport()]});const before=f.sql.prepare("SELECT snapshot_json FROM service_balances WHERE pool='openai'").get().snapshot_json;
 await reportSeriesUsage(f.env,'cloud-algorithm',snapshot(4,100));assert.equal(f.sql.prepare("SELECT snapshot_json FROM service_balances WHERE pool='openai'").get().snapshot_json,before);
 let pool=(await balanceView(f.env)).pools.find(p=>p.pool==='openai');assert.equal(pool.usage.responses,5);assert.equal(pool.stale,true);assert.equal(pool.remaining,12);assert.equal(pool.creditCheckedAt,creditReport().creditCheckedAt);
 await checkBalances(f.env,{reports:[creditReport({checkedAt:new Date(stamp+200).toISOString()})]});pool=(await balanceView(f.env)).pools.find(p=>p.pool==='openai');assert.equal(pool.usage.responses,5);assert.equal(pool.stale,true);
 }finally{f.sql.close();}
});
test('prior local usage remains visible before a complete source snapshot is first available',async()=>{
 const f=fixture();try{const fallback={inputTokens:40,outputTokens:8,cachedInputTokens:4,responses:4};await markSeriesUsageUnavailable(f.env,'local-shared',new Date(stamp).toISOString());
 const view=await seriesUsageView(f.env,{fallbackLocal:fallback});assert.equal(view.usage.responses,4);assert.equal(view.usageSources[0].checkedAt,null);assert.equal(view.usageSources[0].stale,true);assert.equal(view.usageSources[0].updateFailed,true);
 }finally{f.sql.close();}
});
test('a concurrent newer source snapshot cannot be overwritten after the sender pre-read',async()=>{
 const f=fixture();try{await reportSeriesUsage(f.env,'cloud-algorithm',snapshot(1));const prepare=f.env.DB.prepare;let raced=false;
 f.env.DB.prepare=function(query){const statement=prepare(query);if(query.startsWith('INSERT INTO service_openai_usage_sources(source,revision,checked_at,snapshot_json')){const run=statement.run;statement.run=async()=>{if(!raced){raced=true;f.sql.prepare('UPDATE service_openai_usage_sources SET revision=?,checked_at=?,snapshot_json=? WHERE source=?').run(3,stamp+300,JSON.stringify(snapshot(3,300)),'cloud-algorithm');}return run.call(statement);};}return statement;};
 assert.equal((await reportSeriesUsage(f.env,'cloud-algorithm',snapshot(2,200))).ignored,true);assert.equal((await seriesUsageView(f.env)).usage.responses,3);
 }finally{f.sql.close();}
});
test('collector distinguishes valid empty directory from missing or partly corrupt usage records',async()=>{
 const config={creditFile:'credit-fixture',usageDirectory:'usage-fixture'},credit='{"remainingVerified":true,"remainingAmount":12,"issuedAmount":20,"updatedAt":0}',name='a'.repeat(64)+'.json';
 const missing=await openAIQuota(config,{readFileImpl:async()=>credit,readdirImpl:async()=>{throw Error('directory unavailable');}});assert.equal(missing.usage,null);assert.equal(missing.usageComplete,false);
 const empty=await openAIQuota(config,{readFileImpl:async()=>credit,readdirImpl:async()=>[]});assert.equal(empty.usage.responses,0);assert.equal(empty.usageComplete,true);
 const corrupt=await openAIQuota(config,{readFileImpl:async file=>file===config.creditFile?credit:file.endsWith(name)?'{"usage":{"input_tokens":10,"output_tokens":2}}':'invalid JSON',readdirImpl:async()=>[name,'b'.repeat(64)+'.json']});assert.equal(corrupt.usage,null);assert.equal(corrupt.usageComplete,false);assert.equal(corrupt.remaining,12);
 const complete=await openAIQuota(config,{readFileImpl:async file=>file===config.creditFile?credit:'{"usage":{"input_tokens":10,"output_tokens":2,"input_tokens_details":{"cached_tokens":3}},"question":"not reported"}',readdirImpl:async()=>[name]});assert.equal(complete.usage.inputTokens,10);assert.equal(complete.usage.cachedInputTokens,3);assert(!JSON.stringify(complete).includes('not reported'));
});
test('named RPC capabilities pin their own sources and expose no HTTP or private read method',async()=>{
 const f=fixture();try{const exports={};const source=readFileSync('worker/src/series-usage-rpc.js','utf8').replace(/^import .*$/gm,'').replace(/export class /g,'class ')+'\nObject.assign(exports,{AlgorithmUsage,ScheduleUsage,LedgerUsage,LanguageAPIExecutor});';
 const WorkerEntrypoint=class{constructor(env){this.env=env;}};vm.runInNewContext(source,{WorkerEntrypoint,reportSeriesUsage,runCloudChapterQuestions:async()=>({completed:true}),exports});
 for(const [name,scope] of [['AlgorithmUsage','cloud-algorithm'],['ScheduleUsage','cloud-schedule'],['LedgerUsage','cloud-ledger']]){const instance=new exports[name](f.env);await instance.report(snapshot());assert.equal(f.sql.prepare('SELECT source FROM service_openai_usage_sources WHERE source=?').get(scope).source,scope);assert.deepEqual(Object.getOwnPropertyNames(exports[name].prototype),['constructor','report']);await assert.rejects(instance.report(snapshot(1,0,{source:'cloud-language'})));}
 assert.equal((await new exports.LanguageAPIExecutor(f.env).run()).completed,true);assert.deepEqual(Object.getOwnPropertyNames(exports.LanguageAPIExecutor.prototype),['constructor','run']);
 }finally{f.sql.close();}
});
