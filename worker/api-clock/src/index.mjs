// Routing-only administrator. No API key, database, private content or publisher capability.
const targets=[['language','LANGUAGE_API'],['algorithm','ALGORITHM_API'],['schedule','SCHEDULE_API'],['ledger','LEDGER_API']];
export async function tickSeriesAPI(env){
 const results=await Promise.allSettled(targets.map(async([project,binding])=>{
  if(!env[binding]?.run)return {project,status:'unbound'};
  const value=await env[binding].run();
  return {project,status:value?.enabled===false?'disabled':value?.busy?'busy':'checked'};
 }));
 // Only route state may be logged; execution results can contain project details.
 return results.map((result,index)=>result.status==='fulfilled'?result.value:{project:targets[index][0],status:'unavailable'});
}
export default {
 async scheduled(_controller,env){await tickSeriesAPI(env);},
 async fetch(){return new Response('Not found',{status:404,headers:{'cache-control':'no-store'}});}
};
