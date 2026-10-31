// This module only accepts aggregate counters. It cannot read another project's DB.
export const SERIES_USAGE_SOURCES=Object.freeze(['local-shared','cloud-language','cloud-algorithm','cloud-schedule','cloud-ledger']);
const counters=['inputTokens','outputTokens','cachedInputTokens','responses','unknownCalls','inProgressCalls'];
const fields=new Set([...counters,'revision','checkedAt']);
const names={'local-shared':'本机已保存回执','cloud-language':'第二语言云端','cloud-algorithm':'第二算法云端','cloud-schedule':'课表云端','cloud-ledger':'账单云端'};
const checkedSource=source=>{if(!SERIES_USAGE_SOURCES.includes(source))throw Error('用量来源无效');return source;};
function cleanSnapshot(value,now){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(key=>!fields.has(key)))throw Error('仅允许汇总用量字段');
 for(const key of [...counters,'revision'])if(!Number.isSafeInteger(value[key])||value[key]<0)throw Error('用量计数无效');
 if(value.cachedInputTokens>value.inputTokens)throw Error('缓存token不能多于输入token');
 const at=typeof value.checkedAt==='string'?Date.parse(value.checkedAt):NaN;
 if(!Number.isFinite(at)||at<0||at>now+60000)throw Error('用量快照时间无效');
 return Object.fromEntries([...counters.map(key=>[key,value[key]]),['revision',value.revision],['checkedAt',new Date(at).toISOString()]]);
}
export async function reportSeriesUsage(env,source,value,{now=Date.now()}={}){
 checkedSource(source);const snapshot=cleanSnapshot(value,now),stamp=Date.parse(snapshot.checkedAt),db=env.DB;
 const prior=await db.prepare('SELECT revision,checked_at,snapshot_json FROM service_openai_usage_sources WHERE source=?').bind(source).first();
 if(prior?.snapshot_json){
  if(prior.revision>snapshot.revision||prior.checked_at>stamp)return {ok:true,ignored:true};
  const old=JSON.parse(prior.snapshot_json);
  if(['inputTokens','outputTokens','cachedInputTokens','responses'].some(key=>snapshot[key]<old[key]))throw Error('累计用量不能回退，保留旧值');
  // Equal receipt revision may have newer in-progress/unknown counts, never new token totals.
  if(prior.revision===snapshot.revision&&['inputTokens','outputTokens','cachedInputTokens','responses'].some(key=>old[key]!==snapshot[key]))throw Error('相同回执版本的token统计不一致');
  if(prior.revision===snapshot.revision&&prior.checked_at===stamp&&JSON.stringify(old)!==JSON.stringify(snapshot))throw Error('相同快照身份携带了不同用量');
 }
 const result=await db.prepare(`INSERT INTO service_openai_usage_sources(source,revision,checked_at,snapshot_json,last_failure_at) VALUES(?,?,?,?,NULL)
  ON CONFLICT(source) DO UPDATE SET revision=excluded.revision,checked_at=excluded.checked_at,snapshot_json=excluded.snapshot_json,
   last_failure_at=CASE WHEN service_openai_usage_sources.last_failure_at>excluded.checked_at THEN service_openai_usage_sources.last_failure_at ELSE NULL END
  WHERE (service_openai_usage_sources.checked_at IS NULL OR excluded.checked_at>=service_openai_usage_sources.checked_at)
   AND (service_openai_usage_sources.snapshot_json IS NULL OR (
    json_extract(excluded.snapshot_json,'$.inputTokens')>=json_extract(service_openai_usage_sources.snapshot_json,'$.inputTokens')
    AND json_extract(excluded.snapshot_json,'$.outputTokens')>=json_extract(service_openai_usage_sources.snapshot_json,'$.outputTokens')
    AND json_extract(excluded.snapshot_json,'$.cachedInputTokens')>=json_extract(service_openai_usage_sources.snapshot_json,'$.cachedInputTokens')
    AND json_extract(excluded.snapshot_json,'$.responses')>=json_extract(service_openai_usage_sources.snapshot_json,'$.responses')))
   AND (excluded.revision>service_openai_usage_sources.revision OR (excluded.revision=service_openai_usage_sources.revision
    AND (service_openai_usage_sources.snapshot_json IS NULL OR (
     json_extract(excluded.snapshot_json,'$.inputTokens')=json_extract(service_openai_usage_sources.snapshot_json,'$.inputTokens')
     AND json_extract(excluded.snapshot_json,'$.outputTokens')=json_extract(service_openai_usage_sources.snapshot_json,'$.outputTokens')
     AND json_extract(excluded.snapshot_json,'$.cachedInputTokens')=json_extract(service_openai_usage_sources.snapshot_json,'$.cachedInputTokens')
     AND json_extract(excluded.snapshot_json,'$.responses')=json_extract(service_openai_usage_sources.snapshot_json,'$.responses')))
    AND (excluded.checked_at>service_openai_usage_sources.checked_at OR excluded.snapshot_json=service_openai_usage_sources.snapshot_json)))`)
  .bind(source,snapshot.revision,stamp,JSON.stringify(snapshot)).run();
 return {ok:true,...(!result.meta.changes?{ignored:true}:{})};
}
export async function markSeriesUsageUnavailable(env,source,checkedAt){
 checkedSource(source);const at=Date.parse(checkedAt);if(!Number.isFinite(at)||at>Date.now()+60000)throw Error('用量检查时间无效');
 await env.DB.prepare(`INSERT INTO service_openai_usage_sources(source,revision,last_failure_at) VALUES(?,-1,?)
  ON CONFLICT(source) DO UPDATE SET last_failure_at=max(coalesce(service_openai_usage_sources.last_failure_at,0),excluded.last_failure_at)`)
  .bind(source,at).run();
}
export async function seriesUsageView(env,{fallbackLocal=null,now=Date.now()}={}){
 const {results}=await env.DB.prepare('SELECT source,revision,checked_at,snapshot_json,last_failure_at FROM service_openai_usage_sources').all();
 const rows=new Map(results.map(row=>[row.source,row])),total=Object.fromEntries(counters.map(key=>[key,0]));let known=false,latest=0;
 const sources=SERIES_USAGE_SOURCES.map(source=>{
  const row=rows.get(source),saved=row?.snapshot_json?JSON.parse(row.snapshot_json):null;
  const fallback=source==='local-shared'&&fallbackLocal&&counters.slice(0,4).every(key=>Number.isSafeInteger(fallbackLocal[key])&&fallbackLocal[key]>=0)?{...fallbackLocal,unknownCalls:0,inProgressCalls:0}:null;
  const snapshot=saved||fallback,checkedAt=saved?.checkedAt||null;
  if(snapshot){known=true;for(const key of counters){const next=total[key]+snapshot[key];if(!Number.isSafeInteger(next))throw Error('用量汇总超出范围');total[key]=next;}latest=Math.max(latest,Date.parse(checkedAt)||0);}
  return {source,name:names[source],usage:snapshot?Object.fromEntries(counters.map(key=>[key,snapshot[key]])):null,checkedAt,
   stale:!checkedAt||now-Date.parse(checkedAt)>24*3600000,updateFailed:Boolean(row?.last_failure_at&&row.last_failure_at>=(row.checked_at||0))};
 });
 return {usage:known?total:null,usageCheckedAt:latest?new Date(latest).toISOString():null,usageSources:sources};
}
