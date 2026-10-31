import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {reportProjectStorage} from '../worker/src/shared/project-storage-client.mjs';
import {seriesStoragePolicy} from '../worker/src/series-storage.js';

const now=Date.now()-1000;
function fixture({projectId='algorithm',resourceId='d1-algorithm',meta={size_after:229376},policy=seriesStoragePolicy(projectId),dbError=false,rpcError=false}={}){
 const calls={policies:0,queries:[],reports:[]};
 const db={prepare(query){calls.queries.push(query);return{async all(){if(dbError)throw Error('private database diagnostic');return{results:[{text:'must not report row content'}],meta};}};}};
 const policyBinding={async policy(){calls.policies++;return policy;},async report(value){calls.reports.push(value);if(rpcError)throw Error('private RPC diagnostic');return{ok:true,accepted:1,ignored:0};}};
 return{calls,options:{db,policyBinding,projectId,resourceId,now}};
}
test('a handled project reports one measured D1 size after its fixed scoped policy is checked',async()=>{
 const f=fixture(),result=await reportProjectStorage(f.options);
 assert.deepEqual(result,{reported:true,verified:true});assert.equal(f.calls.policies,1);assert.deepEqual(f.calls.queries,['SELECT 1']);
 assert.deepEqual(f.calls.reports,[{reports:[{resourceId:'d1-algorithm',revision:now,observedAt:now,verified:true,measurement:'database-size',complete:true,usedBytes:229376,limitBytes:null,remainingBytes:null}]}]);
});
test('each project accepts only its own fixed resource identities, including the three language databases',async()=>{
 for(const[projectId,ids]of Object.entries({language:['d1-language','d1-language-practice','d1-language-lab'],algorithm:['d1-algorithm'],schedule:['d1-schedule'],ledger:['d1-ledger']}))for(const resourceId of ids){const f=fixture({projectId,resourceId});assert.equal((await reportProjectStorage(f.options)).reported,true);}
 const f=fixture();for(const options of [{projectId:'paper'},{projectId:'algorithm',resourceId:'d1-language'},{resourceId:'onedrive-account'},{resourceId:'https://proxy.invalid/'}])assert.equal((await reportProjectStorage({...f.options,...options})).reason,'invalid-resource');
 assert.equal(f.calls.policies,0);assert.equal(f.calls.queries.length,0);assert.equal(f.calls.reports.length,0);
});
test('a policy for the wrong project is refused before any query or report',async()=>{
 const f=fixture({policy:seriesStoragePolicy('schedule')});assert.equal((await reportProjectStorage(f.options)).reason,'policy-mismatch');assert.equal(f.calls.queries.length,0);assert.equal(f.calls.reports.length,0);
});
test('missing, duplicated, planned, foreign-owner and foreign-resource routes cannot authorize a measurement',async()=>{
 const base=seriesStoragePolicy('algorithm');
 const invalids=[{...base,allocations:[]},{...base,allocations:[base.allocations[0],base.allocations[0]]},{...base,allocations:[{...base.allocations[0],mode:'planned'}]},{...base,allocations:[{...base.allocations[0],resource:{...base.allocations[0].resource,owner:'language'}}]},{...base,allocations:[{...base.allocations[0],resource:{...base.allocations[0].resource,id:'d1-language'}}]},{...base,allocations:[{...base.allocations[0],resource:{...base.allocations[0].resource,state:'verified'}}]},{...base,schemaVersion:2},{...base,policyRevision:0}];
 for(const policy of invalids){const f=fixture({policy});assert.equal((await reportProjectStorage(f.options)).reason,'policy-mismatch');assert.equal(f.calls.queries.length,0);assert.equal(f.calls.reports.length,0);}
});
test('missing metadata and failed DB reads report unknown rather than zero while leaving the business caller successful',async()=>{
 for(const config of [{meta:{}},{meta:null},{meta:{size_after:'229376'}},{meta:{size_after:-1}},{meta:{size_after:Number.MAX_SAFE_INTEGER+1}},{dbError:true}]){
  const f=fixture(config);assert.deepEqual(await reportProjectStorage(f.options),{reported:true,verified:false});assert.deepEqual(f.calls.reports,[{reports:[{resourceId:'d1-algorithm',revision:now,observedAt:now,verified:false}]}]);
 }
});
test('an explicitly measured zero is distinct from missing size metadata',async()=>{
 const f=fixture({meta:{size_after:0}});assert.equal((await reportProjectStorage(f.options)).verified,true);assert.equal(f.calls.reports[0].reports[0].usedBytes,0);
});
test('RPC report failure never throws to business completion and does not retry',async()=>{
 const f=fixture({rpcError:true});assert.deepEqual(await reportProjectStorage(f.options),{reported:false,reason:'report-unavailable'});assert.equal(f.calls.reports.length,1);assert.equal(f.calls.queries.length,1);
 const g=fixture();g.options.policyBinding.report=async value=>{g.calls.reports.push(value);return{ok:false};};assert.equal((await reportProjectStorage(g.options)).reason,'report-unavailable');assert.equal(g.calls.reports.length,1);
});
test('unavailable policy, missing binding and invalid clocks fail without touching a database or caller business',async()=>{
 const f=fixture();f.options.policyBinding.policy=async()=>{throw Error('private binding diagnostic');};assert.equal((await reportProjectStorage(f.options)).reason,'policy-unavailable');assert.equal(f.calls.queries.length,0);
 for(const extra of [{policyBinding:null},{db:null},{now:-1},{now:()=>{throw Error('clock');}},{now:'yesterday'}]){
  const g=fixture();const result=await reportProjectStorage({...g.options,...extra});assert.equal(result.reported,false);assert.equal(g.calls.queries.length,0);assert.equal(g.calls.reports.length,0);
 }
});
test('only byte metadata leaves the project, even if query rows and policy contain private identifiers',async()=>{
 const policy=seriesStoragePolicy('algorithm');policy.privateToken='never-forward';policy.allocations[0].resource.privateURL='https://private.invalid/file';
 const f=fixture({policy,meta:{size_after:42,queryId:'private-query-id',duration:2}});await reportProjectStorage({...f.options,question:'private question',token:'private token'});
 const wire=JSON.stringify(f.calls.reports);for(const text of ['must not report','private','never-forward','https:','queryId','duration','question','token'])assert(!wire.includes(text));
 assert.deepEqual(Object.keys(f.calls.reports[0]),['reports']);
});
test('module has no autonomous work, network provider, model or retry mechanism',()=>{
 const source=readFileSync('worker/src/shared/project-storage-client.mjs','utf8');for(const forbidden of ['fetch(','setInterval(','setTimeout(','runCloudResponses','OPENAI','PUBLISH_TOKEN','SELECT *'])assert(!source.includes(forbidden));
 assert.equal(typeof reportProjectStorage,'function');
});
