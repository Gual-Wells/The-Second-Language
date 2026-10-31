// Allocation policy and numeric inventory only; this module never opens another project's DB.
import defaultRegistry from '../../protocol/series-storage.json' with {type:'json'};

export const SERIES_STORAGE_PROJECTS=Object.freeze(['language','algorithm','schedule','ledger']);
export const SERIES_STORAGE_RESOURCE_IDS=Object.freeze(defaultRegistry.resources.map(resource=>resource.id));
const measurements=new Set(['provider-quota','inventory','database-size','daily-high-water']);
const fields=new Set(['resourceId','revision','observedAt','verified','measurement','complete','usedBytes','limitBytes','remainingBytes','projectAttributedBytes','otherUsedBytes']);
const byteFields=['usedBytes','limitBytes','remainingBytes','otherUsedBytes'];
const plain=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.getPrototypeOf(value)!==null&&Object.getPrototypeOf(value)===Object.prototype;
const bytes=value=>value===null||Number.isSafeInteger(value)&&value>=0;
const own=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);
const clone=value=>JSON.parse(JSON.stringify(value));
const invalid=message=>{throw Error(message);};

export function validateSeriesStorageRegistry(registry=defaultRegistry){
 if(!plain(registry)||registry.schemaVersion!==1||!Number.isSafeInteger(registry.policyRevision)||registry.policyRevision<1||registry.administrator!=='language')invalid('存储策略版本无效');
 if(!plain(registry.projects)||Object.keys(registry.projects).length!==4||SERIES_STORAGE_PROJECTS.some(id=>!plain(registry.projects[id])||typeof registry.projects[id].name!=='string'))invalid('存储项目登记无效');
 if(!Array.isArray(registry.resources)||registry.resources.length!==SERIES_STORAGE_RESOURCE_IDS.length)invalid('存储资源登记无效');
 const resources=new Map();
 for(const resource of registry.resources){
  if(!plain(resource)||!SERIES_STORAGE_RESOURCE_IDS.includes(resource.id)||resources.has(resource.id)||typeof resource.name!=='string'||!['cloudflare','microsoft','huggingface','kaggle'].includes(resource.provider)||!['relational','cache','file','archive'].includes(resource.kind)||!['planned','verified','active'].includes(resource.state)||!['account','project'].includes(resource.scope)||!bytes(resource.providerPlanLimitBytes))invalid('存储资源登记无效');
  if(resource.scope==='project'?!SERIES_STORAGE_PROJECTS.includes(resource.owner):resource.owner!==null)invalid('存储资源归属无效');
  resources.set(resource.id,resource);
 }
 for(const resource of resources.values())if(!resources.has(resource.quotaGroup)||resources.get(resource.quotaGroup).scope!=='account')invalid('存储配额组无效');
 if(!plain(registry.allocations)||Object.keys(registry.allocations).length!==4)invalid('存储分配登记无效');
 for(const project of SERIES_STORAGE_PROJECTS){
  const routes=registry.allocations[project];if(!Array.isArray(routes)||routes.length>16)invalid('存储分配登记无效');
  const seen=new Set();for(const route of routes){const resource=resources.get(route?.resourceId);
   if(!plain(route)||!resource||resource.scope==='project'&&resource.owner!==project||typeof route.purpose!=='string'||!/^[a-z-]{1,40}$/.test(route.purpose)||!['current','planned'].includes(route.mode)||!bytes(route.softAllowanceBytes)||seen.has(route.resourceId))invalid('存储分配归属无效');seen.add(route.resourceId);
  }
 }
 return registry;
}

export function seriesStoragePolicy(project,{registry=defaultRegistry}={}){
 validateSeriesStorageRegistry(registry);if(!SERIES_STORAGE_PROJECTS.includes(project))invalid('存储项目无效');
 const definitions=new Map(registry.resources.map(resource=>[resource.id,resource]));
 return {schemaVersion:registry.schemaVersion,policyRevision:registry.policyRevision,administrator:registry.administrator,projectId:project,name:registry.projects[project].name,
  allocations:registry.allocations[project].map(route=>({...clone(route),resource:clone(definitions.get(route.resourceId))})),
  permissions:{allocationAdministration:false,crossProjectContentAccess:false}};
}

function cleanReport(value,reporter,registry,now){
 if(!plain(value)||Object.keys(value).some(key=>!fields.has(key)))invalid('仅允许固定资源的汇总存储字段');
 const resource=registry.resources.find(resource=>resource.id===value.resourceId);
 if(!resource)invalid('存储资源无效');
 if(reporter!=='admin'&&(resource.scope!=='project'||resource.owner!==reporter))invalid('不能报告其他项目或账户存储');
 if(!Number.isSafeInteger(value.revision)||value.revision<0||!Number.isSafeInteger(value.observedAt)||value.observedAt<0||value.observedAt>now+60000||typeof value.verified!=='boolean')invalid('存储快照身份无效');
 if(own(value,'complete')&&typeof value.complete!=='boolean')invalid('存储盘点完整性无效');
 if(own(value,'measurement')&&!measurements.has(value.measurement))invalid('存储测量方式无效');
 for(const key of byteFields)if(own(value,key)&&!bytes(value[key]))invalid('存储字节数无效');
 if(reporter!=='admin'&&own(value,'otherUsedBytes'))invalid('其他资源用量仅由管理员报告');
 let projectAttributedBytes=null;
 if(own(value,'projectAttributedBytes')&&value.projectAttributedBytes!==null){
  const attributed=value.projectAttributedBytes;if(!plain(attributed)||Object.keys(attributed).some(project=>!SERIES_STORAGE_PROJECTS.includes(project)||reporter!=='admin'&&project!==reporter||!bytes(attributed[project])))invalid('项目存储归属无效');
  projectAttributedBytes=Object.fromEntries(SERIES_STORAGE_PROJECTS.filter(project=>own(attributed,project)).map(project=>[project,attributed[project]]));
 }
 if(!value.verified){
  if(byteFields.some(key=>value[key]!=null)||projectAttributedBytes&&Object.values(projectAttributedBytes).some(value=>value!==null)||value.complete===true)invalid('失败的存储核对不能携带新数值');
  return {resourceId:resource.id,revision:value.revision,observedAt:value.observedAt,verified:false};
 }
 if(!measurements.has(value.measurement))invalid('存储测量方式无效');
 const cleaned={resourceId:resource.id,revision:value.revision,observedAt:value.observedAt,verified:true,measurement:value.measurement,complete:value.complete===true,
  ...Object.fromEntries(byteFields.map(key=>[key,value[key]??null])),projectAttributedBytes};
 if(byteFields.every(key=>cleaned[key]===null)&&!projectAttributedBytes)invalid('已核实快照缺少测量值');
 if(['inventory','daily-high-water'].includes(cleaned.measurement)&&cleaned.remainingBytes!==null)invalid('盘点或历史高水位不能冒充实时剩余容量');
 if(cleaned.limitBytes!==null&&cleaned.remainingBytes!==null&&cleaned.remainingBytes>cleaned.limitBytes)invalid('剩余容量超过资源上限');
 if(cleaned.usedBytes!==null&&cleaned.limitBytes!==null&&cleaned.remainingBytes!==null&&cleaned.remainingBytes>Math.max(0,cleaned.limitBytes-cleaned.usedBytes))invalid('存储已用与剩余不一致');
 let attributed=cleaned.otherUsedBytes||0;for(const value of Object.values(projectAttributedBytes||{})){attributed+=value||0;if(!Number.isSafeInteger(attributed))invalid('存储归属汇总超出范围');}
 if(cleaned.usedBytes!==null&&attributed>cleaned.usedBytes)invalid('归属用量超过资源已用');
 return cleaned;
}

async function storeReport(db,snapshot){
 for(let retry=0;retry<4;retry++){
  const prior=await db.prepare('SELECT * FROM service_series_storage WHERE resource_id=?').bind(snapshot.resourceId).first();
  if(prior&&(snapshot.revision<prior.revision||snapshot.observedAt<prior.attempted_at))return false;
  const saved=prior?.snapshot_json?JSON.parse(prior.snapshot_json):null;
  const same=prior&&snapshot.revision===prior.revision&&snapshot.observedAt===prior.attempted_at;
  if(same){
   if(snapshot.verified&&saved?.revision===snapshot.revision&&saved.observedAt===snapshot.observedAt){if(JSON.stringify(saved)!==JSON.stringify(snapshot))invalid('相同存储快照身份的数值不一致');if(!prior.failed)return false;}
   if(!snapshot.verified)return false; // A failed duplicate never hides a success at the same identity.
  }
  const json=snapshot.verified?JSON.stringify(snapshot):prior?.snapshot_json??null;
  const observed=snapshot.verified?snapshot.observedAt:prior?.observed_at??null;
  const changed=await db.prepare(`INSERT INTO service_series_storage(resource_id,write_version,revision,observed_at,attempted_at,snapshot_json,failed)
   VALUES(?,1,?,?,?,?,?) ON CONFLICT(resource_id) DO UPDATE SET write_version=service_series_storage.write_version+1,
   revision=excluded.revision,observed_at=excluded.observed_at,attempted_at=excluded.attempted_at,snapshot_json=excluded.snapshot_json,failed=excluded.failed
   WHERE service_series_storage.write_version=?`)
   .bind(snapshot.resourceId,snapshot.revision,observed,snapshot.observedAt,json,snapshot.verified?0:1,prior?.write_version??-1).run();
  if(Number(changed?.meta?.changes??changed?.changes??0)===1)return true;
 }
 invalid('存储快照并发更新，请稍后重报');
}

export function cleanSeriesStorageReports(reporter,value,{registry=defaultRegistry,now=Date.now()}={}){
 validateSeriesStorageRegistry(registry);if(reporter!=='admin'&&!SERIES_STORAGE_PROJECTS.includes(reporter))invalid('存储报告身份无效');
 if(!plain(value)||Object.keys(value).some(key=>key!=='reports')||!Array.isArray(value.reports)||value.reports.length<1||value.reports.length>SERIES_STORAGE_RESOURCE_IDS.length)invalid('存储汇总报告无效');
 const reports=value.reports.map(report=>cleanReport(report,reporter,registry,now));
 if(new Set(reports.map(report=>report.resourceId)).size!==reports.length)invalid('同一资源只能报告一次');
 return reports;
}

export async function reportSeriesStorage(env,reporter,value,{registry=defaultRegistry,now=Date.now()}={}){
 const reports=cleanSeriesStorageReports(reporter,value,{registry,now});
 let accepted=0;for(const report of reports)if(await storeReport(env.DB,report))accepted++;
 return {ok:true,accepted,ignored:reports.length-accepted};
}

export async function seriesStorageView(env,{registry=defaultRegistry,now=Date.now()}={}){
 validateSeriesStorageRegistry(registry);
 const {results}=await env.DB.prepare('SELECT * FROM service_series_storage').all();
 const rows=new Map(results.map(row=>[row.resource_id,row]));
 const resources=registry.resources.map(definition=>{
  const row=rows.get(definition.id),snapshot=row?.snapshot_json?JSON.parse(row.snapshot_json):null;
  const projectIds=SERIES_STORAGE_PROJECTS.filter(project=>registry.allocations[project].some(route=>route.resourceId===definition.id));
  const remaining=snapshot?.remainingBytes??null;
  return {...clone(definition),projectIds,revision:row?.revision??null,measurementRevision:snapshot?.revision??null,
   ...Object.fromEntries(byteFields.map(key=>[key,snapshot?.[key]??null])),projectAttributedBytes:clone(snapshot?.projectAttributedBytes??null),
   verified:Boolean(snapshot),complete:snapshot?.complete===true,measurement:snapshot?.measurement??null,
   observedAt:row?.observed_at??null,attemptedAt:row?.attempted_at??null,updateFailed:Boolean(row?.failed),
   stale:!row?.observed_at||now-row.observed_at>86400000,
   effectiveAvailableBytes:definition.state==='active'&&snapshot?.complete===true&&snapshot?.measurement==='provider-quota'?remaining:null};
 });
 // An account quota is one physical pool. Its child databases and project attribution
 // are explanations of that pool, never additional capacity to add to it.
 const capacityGroups=resources.filter(resource=>resource.scope==='account').map(resource=>({...clone(resource),resourceIds:resources.filter(child=>child.quotaGroup===resource.id).map(child=>child.id)}));
 return {schemaVersion:registry.schemaVersion,policyRevision:registry.policyRevision,administrator:registry.administrator,
  projects:SERIES_STORAGE_PROJECTS.map(project=>({id:project,...clone(registry.projects[project])})),resources,capacityGroups};
}
