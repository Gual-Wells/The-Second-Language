// The owner replenishes the single OpenRouter balance. No automatic payments.
export function nextBeijingDay(now = Date.now()) {
  const local = new Date(now + 8*3600000);
  return Date.UTC(local.getUTCFullYear(),local.getUTCMonth(),local.getUTCDate()+1)-8*3600000;
}
export async function checkOpenRouterFunds(apiKey,{fetchImpl=fetch}={}) {
  const replies=await Promise.allSettled(['credits','key'].map(async endpoint=>{
    const r=await fetchImpl(`https://openrouter.ai/api/v1/${endpoint}`,{headers:{authorization:`Bearer ${apiKey}`},signal:AbortSignal.timeout(25000)});
    const raw=await r.text();let parsed;try{parsed=JSON.parse(raw);}catch{parsed=null;}
    return{endpoint,status:r.status,raw,parsed};
  }));
  const [credits,key]=replies.map((r,i)=>r.status==='fulfilled'?r.value:{endpoint:i?'key':'credits',status:null,error:String(r.reason?.message??r.reason)});
  const total=credits.parsed?.data?.total_credits,used=credits.parsed?.data?.total_usage;
  const balance=Number.isFinite(total)&&Number.isFinite(used)?total-used:null;
  const remaining=key.parsed?.data?.limit_remaining;
  const verified=credits.status===200&&key.status===200&&balance!==null;
  return{checkedAt:new Date().toISOString(),verified,usable:verified&&balance>0&&!(typeof remaining==='number'&&remaining<=0),balanceUsd:balance,keyLimitRemainingUsd:typeof remaining==='number'?remaining:null,responses:[credits,key]};
}
