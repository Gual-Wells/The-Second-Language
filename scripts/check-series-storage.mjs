import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import registry from '../protocol/series-storage.json' with {type:'json'};
import {SERIES_STORAGE_PROJECTS,SERIES_STORAGE_RESOURCE_IDS,validateSeriesStorageRegistry,seriesStoragePolicy,reportSeriesStorage,seriesStorageView} from '../worker/src/series-storage.js';

const at=Date.now()-100000;
const copy=value=>JSON.parse(JSON.stringify(value));
const report=(resourceId='onedrive-account',extra={})=>({resourceId,revision:1,observedAt:at,verified:true,measurement:'provider-quota',complete:true,usedBytes:200,limitBytes:1000,remainingBytes:750,...extra});
function fixture(){
 const sql=new DatabaseSync(':memory:');sql.exec(readFileSync('worker/migrations/0026_series_storage.sql','utf8'));
 const env={DB:{prepare(text){let args=[];return {bind(...values){args=values;return this;},async first(){return sql.prepare(text).get(...args)||null;},async all(){return {results:sql.prepare(text).all(...args)};},async run(){return {meta:{changes:Number(sql.prepare(text).run(...args).changes)}};}};}}};
 return {sql,env,send:(value,reporter='admin',options={})=>reportSeriesStorage(env,reporter,{reports:Array.isArray(value)?value:[value]},options),view:options=>seriesStorageView(env,options),close:()=>sql.close()};
}
const resource=(view,id)=>view.resources.find(resource=>resource.id===id);

test('registry has exactly four active projects, six independently owned D1s and one shared KV pool',()=>{
 assert.equal(validateSeriesStorageRegistry(),registry);
 assert.deepEqual(SERIES_STORAGE_PROJECTS,['language','algorithm','schedule','ledger']);
 assert.equal(registry.resources.filter(resource=>resource.scope==='project'&&resource.kind==='relational').length,6);
 assert.equal(registry.resources.filter(resource=>resource.kind==='cache').length,1);
 assert(!Object.hasOwn(registry.projects,'paper'));
 assert.equal(registry.resources.find(resource=>resource.id==='hf-private-account').providerPlanLimitBytes,100_000_000_000);
 assert.equal(registry.resources.find(resource=>resource.id==='kaggle-private-account').providerPlanLimitBytes,200_000_000_000);
 assert.equal(registry.resources.find(resource=>resource.id==='onedrive-account').providerPlanLimitBytes,null);
 assert(registry.allocations.schedule.length<registry.allocations.language.length);
 assert(Object.values(registry.allocations).flat().every(route=>route.softAllowanceBytes===null));
});
test('project policy contains only its own allocations and never grants content or cross-project DB authority',()=>{
 const policy=seriesStoragePolicy('algorithm');assert.equal(policy.projectId,'algorithm');
 assert.deepEqual(policy.allocations.filter(route=>route.resource.scope==='project').map(route=>route.resource.owner),['algorithm']);
 assert.equal(policy.permissions.crossProjectContentAccess,false);
 assert.equal(policy.permissions.allocationAdministration,false);
 policy.allocations[0].resource.name='changed';assert.notEqual(seriesStoragePolicy('algorithm').allocations[0].resource.name,'changed');
 assert.throws(()=>seriesStoragePolicy('paper'),/项目无效/);
});
test('private fields, file identifiers and arbitrary nested content are rejected before any row is written',async()=>{
 const f=fixture();try{
  for(const extra of [{question:'private'},{answer:'private'},{taskId:'private'},{url:'https://example.invalid/'},{filename:'secret.bin'},{token:'secret'},{body:{text:'private'}},{provider:'arbitrary'}])await assert.rejects(f.send(report('onedrive-account',extra)),/汇总存储字段/);
  await assert.rejects(reportSeriesStorage(f.env,'admin',{reports:[report()],question:'private'}));
  await assert.rejects(f.send(report('onedrive-account',{projectAttributedBytes:{language:{question:'private'}}})));
  assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM service_series_storage').get().n,0);
 }finally{f.close();}
});
test('resource and batch identities use a fixed maximum whitelist and reject unknown or duplicated resources',async()=>{
 const f=fixture();try{
  await assert.rejects(f.send(report('my-bucket')),/资源无效/);
  await assert.rejects(f.send([report(),report()]),/一次/);
  await assert.rejects(f.send([]));
  await assert.rejects(f.send(Array.from({length:SERIES_STORAGE_RESOURCE_IDS.length+1},()=>report())));
  assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM service_series_storage').get().n,0);
 }finally{f.close();}
});
test('a project can report only its own resources; account measurements require the administrator',async()=>{
 const f=fixture();try{
  await f.send(report('d1-algorithm'),'algorithm');
  for(const id of ['d1-language','d1-schedule','onedrive-account','cloudflare-d1-account'])await assert.rejects(f.send(report(id),'algorithm'),/其他项目或账户/);
  await assert.rejects(f.send(report('d1-algorithm'),'paper'),/身份无效/);
  assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM service_series_storage').get().n,1);
 }finally{f.close();}
});
test('bad byte counts, unsafe integers, future timestamps and invalid revisions are rejected',async()=>{
 const f=fixture();try{
  for(const value of [-1,0.2,Number.MAX_SAFE_INTEGER+1,'20',{},NaN,Infinity])await assert.rejects(f.send(report('onedrive-account',{usedBytes:value})));
  for(const extra of [{revision:-1},{revision:0.2},{observedAt:Date.now()+120000},{observedAt:'2026-10-31'},{verified:'yes'},{complete:'true'},{measurement:'directory-name'}])await assert.rejects(f.send(report('onedrive-account',extra)));
 }finally{f.close();}
});
test('one resource snapshot replaces its previous measurement and repeated delivery does not add bytes',async()=>{
 const f=fixture();try{
  assert.equal((await f.send(report())).accepted,1);assert.equal((await f.send(report())).ignored,1);
  await f.send(report('onedrive-account',{revision:2,observedAt:at+1,usedBytes:300,remainingBytes:650}));
  const pool=resource(await f.view(),'onedrive-account');assert.equal(pool.usedBytes,300);assert.equal(pool.effectiveAvailableBytes,650);
  assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM service_series_storage').get().n,1);
 }finally{f.close();}
});
test('account quotas are shown once and are never added to child database capacity or another storage tier',async()=>{
 const f=fixture();try{
  await f.send([report('cloudflare-d1-account',{usedBytes:900,limitBytes:5000,remainingBytes:4100,otherUsedBytes:600,projectAttributedBytes:{language:100,algorithm:100,schedule:50,ledger:50}}),report('d1-language',{usedBytes:100,limitBytes:500,remainingBytes:400}),report('cloudflare-kv-account')]);
  const view=await f.view();assert.equal(view.capacityGroups.length,5);
  const d1=view.capacityGroups.find(group=>group.id==='cloudflare-d1-account');assert.equal(d1.usedBytes,900);assert.equal(d1.limitBytes,5000);assert.equal(d1.otherUsedBytes,600);assert.equal(d1.resourceIds.length,7);
  assert.equal(view.capacityGroups.filter(group=>group.id==='cloudflare-kv-account').length,1);
  assert(!Object.hasOwn(view,'totalBytes'));assert(!Object.hasOwn(view,'totalAvailableBytes'));assert(!Object.hasOwn(view,'totalCapacityBytes'));
 }finally{f.close();}
});
test('missing account measurements are unknown even if every individual series database is measured',async()=>{
 const f=fixture();try{
  await f.send(registry.resources.filter(resource=>resource.scope==='project').map(resource=>report(resource.id)));
  const account=(await f.view()).capacityGroups.find(group=>group.id==='cloudflare-d1-account');
  assert.equal(account.usedBytes,null);assert.equal(account.remainingBytes,null);assert.equal(account.complete,false);assert.equal(account.effectiveAvailableBytes,null);
 }finally{f.close();}
});
test('planned and merely verified resources never contribute active usable capacity',async()=>{
 const f=fixture();try{
  await f.send(report('hf-private-account'));await f.send(report('kaggle-private-account'));
  const variant=copy(registry);variant.resources.find(resource=>resource.id==='hf-private-account').state='planned';
  assert.equal(resource(await f.view({registry:variant}),'hf-private-account').effectiveAvailableBytes,null);
  variant.resources.find(resource=>resource.id==='hf-private-account').state='verified';
  assert.equal(resource(await f.view({registry:variant}),'hf-private-account').effectiveAvailableBytes,null);
  variant.resources.find(resource=>resource.id==='hf-private-account').state='active';
  assert.equal(resource(await f.view({registry:variant}),'hf-private-account').effectiveAvailableBytes,750);
 }finally{f.close();}
});
test('declared free-plan size never invents a measured quota or remaining bytes',async()=>{
 const f=fixture();try{
  let hf=resource(await f.view(),'hf-private-account');assert.equal(hf.providerPlanLimitBytes,100_000_000_000);assert.equal(hf.limitBytes,null);assert.equal(hf.usedBytes,null);assert.equal(hf.remainingBytes,null);
  await f.send(report('hf-private-account',{usedBytes:100,limitBytes:null,remainingBytes:null}));
  hf=resource(await f.view(),'hf-private-account');assert.equal(hf.limitBytes,null);assert.equal(hf.remainingBytes,null);
 }finally{f.close();}
});
test('inventory and daily high-water measurements never masquerade as provider remaining quota',async()=>{
 const f=fixture();try{
  for(const measurement of ['inventory','daily-high-water'])await assert.rejects(f.send(report('cloudflare-kv-account',{measurement})),/实时剩余/);
  await f.send(report('kaggle-private-account',{measurement:'inventory',remainingBytes:null}));
  const pool=resource(await f.view(),'kaggle-private-account');assert.equal(pool.measurement,'inventory');assert.equal(pool.usedBytes,200);assert.equal(pool.remainingBytes,null);assert.equal(pool.effectiveAvailableBytes,null);
 }finally{f.close();}
});
test('partial or absent attribution is represented as unknown, not a fabricated zero',async()=>{
 const f=fixture();try{
  await f.send(report('onedrive-account',{projectAttributedBytes:{language:10,algorithm:null},otherUsedBytes:null}));
  const pool=resource(await f.view(),'onedrive-account');assert.deepEqual(pool.projectAttributedBytes,{language:10,algorithm:null});assert(!Object.hasOwn(pool.projectAttributedBytes,'schedule'));assert.equal(pool.otherUsedBytes,null);
 }finally{f.close();}
});
test('a failed measurement preserves verified values and their observation time while recording the newer failed attempt',async()=>{
 const f=fixture();try{
  await f.send(report());await f.send({resourceId:'onedrive-account',revision:2,observedAt:at+10,verified:false});
  const pool=resource(await f.view(),'onedrive-account');assert.equal(pool.usedBytes,200);assert.equal(pool.remainingBytes,750);assert.equal(pool.observedAt,at);assert.equal(pool.attemptedAt,at+10);assert.equal(pool.updateFailed,true);assert.equal(pool.measurementRevision,1);assert.equal(pool.revision,2);
 }finally{f.close();}
});
test('an initial failed report leaves every usage and capacity value unknown',async()=>{
 const f=fixture();try{
  await f.send({resourceId:'onedrive-account',revision:1,observedAt:at,verified:false});
  const pool=resource(await f.view(),'onedrive-account');for(const key of ['usedBytes','limitBytes','remainingBytes','otherUsedBytes','observedAt','effectiveAvailableBytes'])assert.equal(pool[key],null);assert.equal(pool.verified,false);assert.equal(pool.updateFailed,true);
 }finally{f.close();}
});
test('failure reports cannot carry private data, replacement numeric measurements or claims of completeness',async()=>{
 const f=fixture();try{
  for(const extra of [{usedBytes:0},{limitBytes:1000},{remainingBytes:0},{projectAttributedBytes:{language:2}},{complete:true}])await assert.rejects(f.send({resourceId:'onedrive-account',revision:1,observedAt:at,verified:false,...extra}));
  assert.equal(f.sql.prepare('SELECT COUNT(*) n FROM service_series_storage').get().n,0);
 }finally{f.close();}
});
test('both revision and observation ordering protect against delayed reports, including delayed failures',async()=>{
 const f=fixture();try{
  await f.send(report('onedrive-account',{revision:3,observedAt:at+30}));
  assert.equal((await f.send(report('onedrive-account',{revision:2,observedAt:at+40}))).ignored,1);
  assert.equal((await f.send(report('onedrive-account',{revision:4,observedAt:at+20}))).ignored,1);
  assert.equal((await f.send({resourceId:'onedrive-account',revision:2,observedAt:at+20,verified:false})).ignored,1);
  const pool=resource(await f.view(),'onedrive-account');assert.equal(pool.revision,3);assert.equal(pool.updateFailed,false);
 }finally{f.close();}
});
test('a conflicting immutable snapshot is rejected and a duplicate failure cannot hide the same successful identity',async()=>{
 const f=fixture();try{
  await f.send(report());await assert.rejects(f.send(report('onedrive-account',{usedBytes:199})),/身份的数值不一致/);
  assert.equal((await f.send({resourceId:'onedrive-account',revision:1,observedAt:at,verified:false})).ignored,1);
  assert.equal(resource(await f.view(),'onedrive-account').updateFailed,false);
 }finally{f.close();}
});
test('a success at a failed attempt identity may establish the verified value without replaying business work',async()=>{
 const f=fixture();try{
  await f.send({resourceId:'onedrive-account',revision:1,observedAt:at,verified:false});await f.send(report());
  const pool=resource(await f.view(),'onedrive-account');assert.equal(pool.updateFailed,false);assert.equal(pool.usedBytes,200);
 }finally{f.close();}
});
test('an intervening newer write defeats a stale compare-and-swap even after the initial pre-read',async()=>{
 const f=fixture();try{
  await f.send(report());const prepare=f.env.DB.prepare;let raced=false;
  f.env.DB.prepare=function(text){const statement=prepare(text);if(text.startsWith('INSERT INTO service_series_storage')){const run=statement.run;statement.run=async()=>{if(!raced){raced=true;const newer=report('onedrive-account',{revision:3,observedAt:at+30,usedBytes:500,remainingBytes:450});f.sql.prepare('UPDATE service_series_storage SET write_version=write_version+1,revision=?,observed_at=?,attempted_at=?,snapshot_json=? WHERE resource_id=?').run(3,at+30,at+30,JSON.stringify({...newer,otherUsedBytes:null,projectAttributedBytes:null}),'onedrive-account');}return run.call(statement);};}return statement;};
  assert.equal((await f.send(report('onedrive-account',{revision:2,observedAt:at+20,usedBytes:300,remainingBytes:650}))).ignored,1);
  assert.equal(resource(await f.view(),'onedrive-account').usedBytes,500);
 }finally{f.close();}
});
test('attributed bytes have a fixed project whitelist and other-account usage is admin-only',async()=>{
 const f=fixture();try{
  await assert.rejects(f.send(report('onedrive-account',{projectAttributedBytes:{paper:5}})),/归属无效/);
  await assert.rejects(f.send(report('d1-algorithm',{projectAttributedBytes:{language:5}}),'algorithm'),/归属无效/);
  await assert.rejects(f.send(report('d1-algorithm',{otherUsedBytes:null}),'algorithm'),/管理员/);
  await f.send(report('d1-algorithm',{projectAttributedBytes:{algorithm:200}}),'algorithm');
 }finally{f.close();}
});
test('attribution totals and remaining capacity must be consistent but over-quota used bytes remain displayable',async()=>{
 const f=fixture();try{
  await assert.rejects(f.send(report('onedrive-account',{projectAttributedBytes:{language:150,algorithm:100}})),/归属用量超过/);
  await assert.rejects(f.send(report('onedrive-account',{projectAttributedBytes:{language:150},otherUsedBytes:100})),/归属用量超过/);
  await assert.rejects(f.send(report('onedrive-account',{remainingBytes:900})),/已用与剩余不一致/);
  await f.send(report('onedrive-account',{usedBytes:1200,remainingBytes:0}));assert.equal(resource(await f.view(),'onedrive-account').usedBytes,1200);
 }finally{f.close();}
});
test('known database size without real quota remains a partial measurement and is not summed into fake account capacity',async()=>{
 const f=fixture();try{
  await f.send(report('d1-schedule',{measurement:'database-size',complete:false,limitBytes:null,remainingBytes:null}));
  const pool=resource(await f.view(),'d1-schedule');assert.equal(pool.usedBytes,200);assert.equal(pool.limitBytes,null);assert.equal(pool.complete,false);assert.equal(pool.effectiveAvailableBytes,null);
  assert.equal((await f.view()).capacityGroups.find(group=>group.id==='cloudflare-d1-account').usedBytes,null);
 }finally{f.close();}
});
test('the durable table itself rejects arbitrary resource keys and malformed stored JSON',()=>{
 const f=fixture();try{
  assert.throws(()=>f.sql.prepare('INSERT INTO service_series_storage(resource_id,revision,attempted_at) VALUES(?,?,?)').run('foreign-content',1,at));
  assert.throws(()=>f.sql.prepare('INSERT INTO service_series_storage(resource_id,revision,attempted_at,snapshot_json) VALUES(?,?,?,?)').run('onedrive-account',1,at,'not json'));
 }finally{f.close();}
});
test('registry changes cannot turn an unrelated project DB into a cross-project route',()=>{
 const variant=copy(registry);variant.allocations.schedule.push({resourceId:'d1-algorithm',purpose:'state',mode:'current',softAllowanceBytes:null});
 assert.throws(()=>validateSeriesStorageRegistry(variant),/归属无效/);
 const bad=copy(registry);bad.projects.paper={name:'retired'};assert.throws(()=>validateSeriesStorageRegistry(bad),/项目登记无效/);
});
