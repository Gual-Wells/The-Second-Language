// Routing-only administrator. No API key, database, private content or publisher capability.
const targets=[['language','LANGUAGE_API'],['algorithm','ALGORITHM_API'],['schedule','SCHEDULE_API'],['ledger','LEDGER_API']];
export async function tickSeriesAPI(env){
 const results=await Promise.allSettled(targets.map(async([project,binding])=>{
  if(!env[binding]?.run)return {project,status:'unbound'};
  const value=await env[binding].run();
  const status=value?.enabled===false||value?.disabled===true?'disabled':value?.configured===false?'unconfigured':value?.busy?'busy':value?.failed?(value?.outcomeUnknown?'pending-review':'failed'):value?.completed?'completed':value?.empty||value?.processed===false?'empty':'checked';
  return {project,status};
 }));
 // Only route state may be logged; execution results can contain project details.
 return results.map((result,index)=>result.status==='fulfilled'?result.value:{project:targets[index][0],status:'unavailable'});
}
export default {
 async scheduled(_controller,env){console.info(JSON.stringify({service:'second-series-api-clock',routes:await tickSeriesAPI(env)}));},
 async fetch(){return new Response('Not found',{status:404,headers:{'cache-control':'no-store'}});}
};
