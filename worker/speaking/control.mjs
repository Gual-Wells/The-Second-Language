import {contractSnapshot,contractVersion} from '../../scripts/lib/speaking/collect.mjs';
const digest=async bytes=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
const validId=id=>/^[a-zA-Z0-9._-]{1,110}$/.test(id??'');
export async function enqueueSupplement(env,body){
 if(!env.PRACTICE_DB||!env.SPEAKING_ASSETS)throw Error('私有存储尚未接通');
 if(!['jobId','attemptId','parentJobId'].every(k=>validId(body[k]))||!Array.isArray(body.tasks)||!body.tasks.length)throw Error('专项计划无效');
 const seen=new Set();
 for(const t of body.tasks){if(!validId(t.id)||t.id==='baseline'||seen.has(t.id)||!['qwen','gpt-audio'].includes(t.provider??'qwen')||typeof t.focusPrompt!=='string'||!t.focusPrompt.trim())throw Error('专项需要独立编号和具体声音目标');seen.add(t.id);}
 const parent=await env.PRACTICE_DB.prepare('SELECT * FROM speaking_jobs WHERE id=? AND attempt_id=?').bind(body.parentJobId,body.attemptId).first();
 if(!parent)throw Error('原声采集任务不存在');
 const plan={audioDigest:parent.audio_digest,tasks:body.tasks},bytes=new TextEncoder().encode(JSON.stringify(plan)),planDigest=await digest(bytes);
 const existing=await env.PRACTICE_DB.prepare('SELECT * FROM speaking_jobs WHERE id=?').bind(body.jobId).first();
 if(existing){if(existing.parent_job_id!==parent.id||existing.attempt_id!==body.attemptId||existing.plan_digest!==planDigest)throw Error('编号已固定不同计划');return{jobId:existing.id,state:existing.status,reused:true,nextRetryAt:existing.next_retry_at};}
 const prefix=`speaking/${body.attemptId}/jobs/${body.jobId}`,snapshot=new TextEncoder().encode(JSON.stringify(contractSnapshot())),snapshotDigest=await digest(snapshot);
 const planKey=`${prefix}/plans/${planDigest}.json`,contractKey=`${prefix}/contracts/${snapshotDigest}.json`;
 await env.SPEAKING_ASSETS.put(planKey,bytes,{httpMetadata:{contentType:'application/json'}});
 await env.SPEAKING_ASSETS.put(contractKey,snapshot,{httpMetadata:{contentType:'application/json'}});
 const at=Date.now();
 const waiting=parent.status==='waiting_credit',state=waiting?'waiting_credit':'queued';
 await env.PRACTICE_DB.batch([env.PRACTICE_DB.prepare(`INSERT INTO speaking_jobs(id,attempt_id,parent_job_id,contract_version,contract_digest,contract_key,plan_key,plan_digest,audio_key,audio_digest,audio_seconds,audio_format,status,next_retry_at,created_at,updated_at)
  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(body.jobId,body.attemptId,parent.id,contractVersion,snapshotDigest,contractKey,planKey,planDigest,parent.audio_key,parent.audio_digest,parent.audio_seconds,parent.audio_format,state,waiting?parent.next_retry_at:null,at,at),
  env.PRACTICE_DB.prepare('UPDATE speaking_attempts SET status=?,claim_token=NULL,claim_at=NULL WHERE id=?').bind(waiting?'waiting_credit':'collecting',body.attemptId)]);
 return{jobId:body.jobId,state,nextRetryAt:waiting?parent.next_retry_at:null};
}
export async function controlRequest(request,env){
 if(!env.SPEAKING_CONTROL_TOKEN||request.headers.get('authorization')!==`Bearer ${env.SPEAKING_CONTROL_TOKEN}`)return new Response('Not found',{status:404});
 if(request.method!=='POST'||new URL(request.url).pathname!=='/speaking/details')return new Response('Not found',{status:404});
 try{return Response.json(await enqueueSupplement(env,await request.json()));}
 catch(error){return Response.json({error:String(error.message)},{status:400});}
}
