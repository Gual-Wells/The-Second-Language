import {checkOpenRouterFunds} from '../../scripts/lib/speaking/funding.mjs';
const json=(value,status=200)=>Response.json(value,{status,headers:{'cache-control':'no-store'}});
import {estimates,reserves,belowReserve,quotaEstimateVersion} from '../../protocol/task-quotas.mjs';
export {estimates};
const empty=pool=>({pool,verified:false,remaining:null,checkedAt:null,note:'尚未核对'});
export async function balanceView(env){
 const {results}=await env.DB.prepare('SELECT pool,snapshot_json FROM service_balances').all();
 const data=new Map(results.map(r=>[r.pool,JSON.parse(r.snapshot_json)]));
 const pools=['openrouter','cloudflare','tencent'].map(pool=>{
  const p=data.get(pool)||empty(pool);
  const stale=!p.checkedAt||Date.now()-Date.parse(p.estimated?p.checkedAt:p.quotaCheckedAt||p.checkedAt)>24*3600000||(pool==='cloudflare'&&p.period!==new Date().toISOString().slice(0,10));
  return {...p,stale,low:!stale&&(p.verified||p.estimated)&&p.low===true};
 });
 return {pools,estimates,reserves,estimateVersion:quotaEstimateVersion};
}
async function store(env,p,notify){
 const stamp=Date.parse(p.checkedAt);if(!Number.isFinite(stamp)||stamp>Date.now()+60000||Date.now()-stamp>24*3600000)throw Error('额度核对时间无效');
 const prior=await env.DB.prepare('SELECT checked_at,alerted FROM service_balances WHERE pool=?').bind(p.pool).first();
 if(prior&&prior.checked_at>stamp)return;
 // Only task-end checks enqueue notifications. Rechecking the modal cannot send a push.
 const alerted=!(p.verified||p.estimated)?(prior?.alerted||0):p.low?(prior?.alerted|| (notify?1:0)):0;
 const commands=[env.DB.prepare(`INSERT INTO service_balances(pool,snapshot_json,checked_at,alerted) VALUES(?,?,?,?) ON CONFLICT(pool) DO UPDATE SET snapshot_json=excluded.snapshot_json,checked_at=excluded.checked_at,alerted=excluded.alerted`).bind(p.pool,JSON.stringify(p),stamp,alerted)];
 if(notify&&(p.verified||p.estimated)&&p.low&&!prior?.alerted){
  const {results}=await env.DB.prepare('SELECT id FROM push_subscriptions').all();
  for(const s of results)commands.push(env.DB.prepare('INSERT OR IGNORE INTO balance_push_outbox(id,subscription_id,body,created_at) VALUES(?,?,?,?)').bind(`${p.pool}:${stamp}:${s.id}`,s.id,p.warning,Date.now()));
 }
 await env.DB.batch(commands);
}
async function recordUsage(env,usage){
 if(!Array.isArray(usage)||usage.length>40)throw Error('用量报告无效');
 for(const e of usage){
  if(e.pool!=='tencent'||!/^[a-f0-9-]{36}$/.test(e.id||'')||!['completed','outcome_unknown'].includes(e.state)||!Number.isFinite(Date.parse(e.occurredAt))||Date.parse(e.occurredAt)>Date.now()+60000||
   (e.state==='completed'&&(!Number.isInteger(e.units)||e.units<=0||e.units>1000))||(e.state==='outcome_unknown'&&e.units!==null))throw Error('用量报告无效');
 }
 if(usage.length)await env.DB.batch(usage.map(e=>env.DB.prepare(`INSERT INTO service_quota_usage(id,pool,units,state,occurred_at) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET units=excluded.units,state=excluded.state WHERE service_quota_usage.state='outcome_unknown' AND excluded.state='completed'`).bind(e.id,e.pool,e.units,e.state,Date.parse(e.occurredAt))));
}
export async function checkBalances(env,{reports=[],usage=[],notify=false}={}){
 await recordUsage(env,usage);
 for(const input of reports){
  if(!['cloudflare','tencent'].includes(input.pool)||typeof input.verified!=='boolean')throw Error('额度报告无效');
  if(input.verified&&(!Number.isFinite(input.remaining)||input.remaining<0))throw Error('额度数值无效');
  const cf=input.pool==='cloudflare';let remaining=input.verified?input.remaining:null;
  if(cf&&input.verified&&input.period!==new Date().toISOString().slice(0,10))throw Error('Cloudflare 用量日期无效');

  const priorRow=!cf?await env.DB.prepare('SELECT snapshot_json FROM service_balances WHERE pool=?').bind(input.pool).first():null;
  const prior=priorRow?JSON.parse(priorRow.snapshot_json):{};
  const baseline=!cf&&input.verified?{remaining:input.remaining,at:input.checkedAt}:prior.baseline??null;
  let estimated=false,uncertainCalls=0;
  if(!cf&&!input.verified&&baseline){
   const used=await env.DB.prepare(`SELECT COALESCE(SUM(CASE WHEN state='completed' THEN units ELSE 0 END),0) AS units,COALESCE(SUM(CASE WHEN state='outcome_unknown' THEN 1 ELSE 0 END),0) AS uncertain FROM service_quota_usage WHERE pool='tencent' AND occurred_at>?`).bind(Date.parse(baseline.at)).first();
   remaining=Math.max(0,baseline.remaining-used.units);estimated=true;uncertainCalls=used.uncertain;
  }
  let low=(input.verified||estimated)&&belowReserve(input.pool,remaining);
  const lastKnownRemaining=!cf&&!input.verified?(prior.verified?prior.remaining:prior.lastKnownRemaining)??null:null;
  const quotaCheckedAt=!cf?(input.verified?input.checkedAt:prior.quotaCheckedAt||prior.checkedAt):input.checkedAt;
  const cashBalanceCny=!cf&&Number.isFinite(input.cashBalanceCny)&&input.cashBalanceCny>=0?input.cashBalanceCny:prior.cashBalanceCny??null;
  const expiresAt=!cf&&input.expiresAt&&Number.isFinite(Date.parse(input.expiresAt))?input.expiresAt:prior.expiresAt??null;
  const expiresOn=!cf&&/^\d{4}-\d{2}-\d{2}$/.test(input.expiresOn||'')?input.expiresOn:prior.expiresOn??null;
  if(estimated&&expiresOn&&new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())>expiresOn){remaining=0;low=belowReserve(input.pool,remaining);}
  const source=cf?'account-api':input.verified?(input.source==='console-screenshot'?'console-screenshot':'account-api'):prior.source??null;
  const refreshAt=cf&&input.period?new Date(Date.parse(input.period+'T00:00:00Z')+86400000).toISOString():null;
  await store(env,{pool:input.pool,verified:input.verified,remaining,lastKnownRemaining,quotaCheckedAt,source:estimated?'usage-ledger':source,estimated,uncertainCalls,baseline,unit:cf?'Neurons':'calls',cashBalanceCny,expiresAt,expiresOn,period:cf?input.period:null,refreshAt,checkedAt:input.checkedAt,
    note:cf?'每日免费额度 · 北京时间 08:00 刷新':input.verified?'口语评测套餐':estimated?'按使用记录估算':Number.isFinite(lastKnownRemaining)?'最近核实的套餐余量':'套餐余量待核实',low,
    warning:cf?'今日免费余量偏低，08:00 刷新。':'口语套餐余量偏低，请补充套餐。'},notify);
 }
 let p={...empty('openrouter'),unit:'USD',checkedAt:new Date().toISOString()};
 if(env.OPENROUTER_API_KEY){
  const funds=await checkOpenRouterFunds(env.OPENROUTER_API_KEY);
  if(funds.verified){const remaining=Math.max(0,Math.min(funds.balanceUsd,funds.keyLimitRemainingUsd??Infinity));p={...p,verified:true,remaining,walletUsd:funds.balanceUsd,keyRemainingUsd:funds.keyLimitRemainingUsd,low:belowReserve('openrouter',remaining),note:'声音生成与口语分析共用额度',warning:'余额偏低，请补充额度。'};}
  else p.note='余额暂未核实';
 }else p.note='服务端未配置 OpenRouter';
 await store(env,p,notify);
 return balanceView(env);
}
export async function balanceRoute(request,env,{isPublisher,session,sameOrigin}){
 const path=new URL(request.url).pathname;if(!['/api/balances','/api/balances/check','/api/balances/report'].includes(path))return null;
 if(!isPublisher&&!session)return json({error:'请先登录'},401);
 if(path==='/api/balances'&&request.method==='GET')return json(await balanceView(env));
 if(request.method!=='POST')return json({error:'方法不允许'},405);
 if(!isPublisher&&!sameOrigin)return json({error:'来源不允许'},403);
 if(!isPublisher)return json({error:'发布身份无效'},401);
 let body={};if(path==='/api/balances/report'){
  const raw=await request.text();if(raw.length>16000)return json({error:'报告过大'},400);
  try{body=JSON.parse(raw);if(!Array.isArray(body.reports)||body.reports.length>2)throw Error();}catch{return json({error:'报告无效'},400);}
 }
 try{return json(await checkBalances(env,{reports:body.reports||[],usage:body.usage||[],notify:path==='/api/balances/report'}));}catch(e){return json({error:e.message},400);}
}
