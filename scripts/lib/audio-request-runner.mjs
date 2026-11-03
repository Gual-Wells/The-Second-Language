// The orchestration may recover a saved result; it must never replay an
// unacknowledged paid POST. Only read/status/progress operations are retryable.
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export async function readAudioResponse(response){
 let value;try{value=await response.json();}catch{
  throw Object.assign(Error(`声音服务返回非 JSON 响应（HTTP ${response.status}），请求结果需按原身份查询`),{transportUnknown:true,status:response.status});
 }
 if(!response.ok&&!(value?.state==='outcome_unknown'&&/^[a-f0-9]{64}$/.test(value.id||'')))throw Object.assign(Error(typeof value?.error==='string'?value.error:`声音服务 HTTP ${response.status}`),{status:response.status,storageBackpressure:response.status===503&&value?.error==='声音存储需要维护，已有发音仍可播放'});
 return value;
}
export function recoverAudioBlocked(checkpoint,job){
 if(!checkpoint)return [];
 if(checkpoint.jobId!==job.id||checkpoint.digest!==job.digest||checkpoint.total!==job.units.length||!Array.isArray(checkpoint.blocked)||!Number.isInteger(checkpoint.cursor)||checkpoint.cursor<0||checkpoint.cursor>job.units.length)throw Error('音频断点与原任务身份不符，停止新增生成');
 if(checkpoint.blocked.some(b=>!Number.isInteger(b.index)||b.index<0||b.index>=checkpoint.cursor||(job.units[b.index]?.id??null)!==(b.id??null)))throw Error('音频缺项断点与原计划不符，停止新增生成');
 return checkpoint.blocked.filter(b=>b.index<job.cursor);
}
export async function reconcileAudioBlocked(blocked,request){
 const remaining=[];
 for(const item of blocked){
  try{const result=await retryAudioRead(()=>request('/api/practice/pronunciation/'+item.id,null,{method:'GET',timeoutMs:30000}));if(result.id===item.id&&result.state==='ready')continue;}catch{}
  remaining.push(item);
 }
 return remaining;
}
export async function retryAudioRead(operation,{wait=delay,attempts=3}={}){
 for(let n=0;;n++)try{return await operation();}catch(error){
  if(n+1>=attempts||error.status&&!error.transportUnknown&&![408,429,500,502,503,504].includes(error.status))throw error;
  await wait(500*(n+1));
 }
}
export async function prepareAudioUnit({unit,body,request,wait=delay,maxPolls=240}){
 const statusPath='/api/practice/pronunciation/'+unit.id;
 const read=()=>retryAudioRead(()=>request(statusPath,null,{method:'GET',timeoutMs:30000}),{wait});
 const identify=result=>{if(result.id!==unit.id)throw Error('声音身份不一致，停止新增生成');return result;};
 let result,acknowledged=false;
 try{result=identify(await read());}catch(error){if(error.status!==404)throw error;}
 // An explicitly resumed waiting_credit request may try its original identity.
 // Failed/unknown results never receive another POST. A known ready result
 // reuses the original endpoint only to attach the saved asset to this chapter.
 if(!result||result.state==='waiting_credit'){
  try{result=identify(await request('/api/practice/pronunciation',body));acknowledged=true;}
  catch(error){
   if(!error.transportUnknown)throw error;
   try{result=identify(await read());}catch(readError){
    if(readError.message==='声音身份不一致，停止新增生成')throw readError;
    return {id:unit.id,state:'outcome_unknown',transportUnknown:true};
   }
  }
 }
 for(let n=0;result.state==='calling'&&n<maxPolls;n++){
  await wait(1000);
  try{result=identify(await read());}catch(error){
   if(error.message==='声音身份不一致，停止新增生成')throw error;
   return {id:unit.id,state:'outcome_unknown',transportUnknown:true};
  }
 }
 if(result.state==='ready'&&!acknowledged){
  // Successful identities are immutable, so this association cannot synthesize.
  // A GET after a lost response alone does not prove the chapter link committed.
  result=identify(await retryAudioRead(()=>request('/api/practice/pronunciation',body),{wait}));
 }
 return result.state==='calling'?{...result,state:'outcome_unknown',pollingExpired:true}:result;
}
