import {checkOpenRouterFunds} from '../../scripts/lib/speaking/funding.mjs';
const json=(value,status=200)=>Response.json(value,{status,headers:{'cache-control':'no-store'}});
export const estimates=[
 {task:'40 词日课 / 临时复习 / 阅读与写作题',pool:'正文建设',value:'不调用收费语音 API',basis:'Codex 当前订阅；点读另按实际首次生成计费'},
 {task:'点读一个词 / 一句短句',pool:'OpenRouter',value:'约 $0.000008 / $0.000075',basis:'Kokoro $0.62 / 百万字符，分别按 12 / 120 字符；已有声音 $0'},
 {task:'完整听力 / 微缩听力',pool:'OpenRouter',value:'约 $0.012–0.025 / $0.009–0.019',basis:'分别按 2–4 万 / 1.5–3 万字符，只含 Kokoro；实际脚本长度决定费用'},
 {task:'口语考官提问',pool:'OpenRouter',value:'约 $0.001–0.003',basis:'Kokoro 约 1500–5000 字符，重复播放 $0'},
 {task:'2 分钟原声多路分析',pool:'OpenRouter',value:'预留 $0.15–0.60',basis:'Gemini + Qwen + GPT Audio，含长 JSON 输出的宽裕估算；不是报价或实际账单，补听另计'},
 {task:'14 分钟口语作答分题分析',pool:'OpenRouter',value:'预留 $1.05–4.20',basis:'按七段 2 分钟分析预留；完整调用次数与输出长度决定费用'},
 {task:'2 / 14 分钟原声，30 分钟听力核对',pool:'Whisper 每日免费额度',value:'约 93 / 653 / 1399 Neurons',basis:'46.63 Neurons / 音频分钟，账户每天 10000 免费；北京时间 08:00 刷新，不充值'},
 {task:'腾讯单词或短句专项 / 200 词段落',pool:'腾讯口语套餐',value:'约 1 / 10 计费次',basis:'优先扣有效套餐；段落按每 20 词计一次；套餐耗尽后后付费分别约 ¥0.005 / ¥0.05'}
];
const empty=pool=>({pool,verified:false,remaining:null,checkedAt:null,note:'尚未核对'});
export async function balanceView(env){
 const {results}=await env.DB.prepare('SELECT pool,snapshot_json FROM service_balances').all();
 const data=new Map(results.map(r=>[r.pool,JSON.parse(r.snapshot_json)]));
 const pools=['openrouter','cloudflare','tencent'].map(pool=>{
  const p=data.get(pool)||empty(pool);
  const stale=!p.checkedAt||Date.now()-p.checkedAt>24*3600000||(pool==='cloudflare'&&p.period!==new Date().toISOString().slice(0,10));
  return {...p,stale,low:!stale&&p.verified&&p.low===true};
 });
 return {pools,estimates,policy:'任务结束核对；余额偏低时提醒充值，不自动付款，也不安排额度不足后的跨日重试。'};
}
async function store(env,p,notify){
 const stamp=Date.parse(p.checkedAt);if(!Number.isFinite(stamp)||stamp>Date.now()+60000||Date.now()-stamp>24*3600000)throw Error('额度核对时间无效');
 const prior=await env.DB.prepare('SELECT checked_at,alerted FROM service_balances WHERE pool=?').bind(p.pool).first();
 if(prior&&prior.checked_at>stamp)return;
 // Only task-end checks enqueue notifications. Rechecking the modal cannot send a push.
 const alerted=!p.verified?(prior?.alerted||0):p.low?(prior?.alerted|| (notify?1:0)):0;
 const commands=[env.DB.prepare(`INSERT INTO service_balances(pool,snapshot_json,checked_at,alerted) VALUES(?,?,?,?) ON CONFLICT(pool) DO UPDATE SET snapshot_json=excluded.snapshot_json,checked_at=excluded.checked_at,alerted=excluded.alerted`).bind(p.pool,JSON.stringify(p),stamp,alerted)];
 if(notify&&p.verified&&p.low&&!prior?.alerted){
  const {results}=await env.DB.prepare('SELECT id FROM push_subscriptions').all();
  for(const s of results)commands.push(env.DB.prepare('INSERT OR IGNORE INTO balance_push_outbox(id,subscription_id,body,created_at) VALUES(?,?,?,?)').bind(`${p.pool}:${stamp}:${s.id}`,s.id,p.warning,Date.now()));
 }
 await env.DB.batch(commands);
}
export async function checkBalances(env,{reports=[],notify=false}={}){
 for(const input of reports){
  if(!['cloudflare','tencent'].includes(input.pool)||typeof input.verified!=='boolean')throw Error('额度报告无效');
  if(input.verified&&(!Number.isFinite(input.remaining)||input.remaining<0))throw Error('额度数值无效');
  const cf=input.pool==='cloudflare',remaining=input.verified?input.remaining:null;
  if(cf&&input.verified&&input.period!==new Date().toISOString().slice(0,10))throw Error('Cloudflare 用量日期无效');
  const low=input.verified&&(cf?remaining<2000:remaining<100);
  const cashBalanceCny=!cf&&Number.isFinite(input.cashBalanceCny)&&input.cashBalanceCny>=0?input.cashBalanceCny:null;
  const expiresAt=!cf&&input.expiresAt&&Number.isFinite(Date.parse(input.expiresAt))?input.expiresAt:null;
  const refreshAt=cf&&input.period?new Date(Date.parse(input.period+'T00:00:00Z')+86400000).toISOString():null;
  await store(env,{pool:input.pool,verified:input.verified,remaining,unit:cf?'Neurons':'calls',cashBalanceCny,expiresAt,period:cf?input.period:null,refreshAt,checkedAt:input.checkedAt,note:cf?'今日免费余量，账户共用每天 10000 Neurons；北京时间每天 08:00 刷新，统计可能有延迟；不启用充值':input.verified?'有效口语套餐的剩余计费次数；现金余额只作补充':'已购买套餐的剩余次数尚未读通，不能按零额度处理；现金余额不用于判定套餐不足',low,warning:cf?'Whisper 今日免费余量偏低，北京时间 08:00 自动刷新，无需充值。':'腾讯口语套餐剩余不足 100 计费次，请补充套餐。'},notify);
 }
 let p={...empty('openrouter'),unit:'USD',checkedAt:new Date().toISOString()};
 if(env.OPENROUTER_API_KEY){
  const funds=await checkOpenRouterFunds(env.OPENROUTER_API_KEY);
  if(funds.verified){const remaining=Math.max(0,Math.min(funds.balanceUsd,funds.keyLimitRemainingUsd??Infinity));p={...p,verified:true,remaining,walletUsd:funds.balanceUsd,keyRemainingUsd:funds.keyLimitRemainingUsd,low:remaining<5,note:'Gemini、Qwen、GPT Audio、Kokoro 共用一个余额；可用值取钱包和本 key 限额中的较低值',warning:'OpenRouter 可用余额低于 $5，请充值以留足下一次口语分析。'};}
  else p.note='余额接口暂时无法核对，未按零余额处理';
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
  const raw=await request.text();if(raw.length>6000)return json({error:'报告过大'},400);
  try{body=JSON.parse(raw);if(!Array.isArray(body.reports)||body.reports.length>2)throw Error();}catch{return json({error:'报告无效'},400);}
 }
 try{return json(await checkBalances(env,{reports:body.reports||[],notify:path==='/api/balances/report'}));}catch(e){return json({error:e.message},400);}
}
