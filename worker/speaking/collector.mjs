import { collectOpenRouter, collectWhisper, requestDescriptor, contractVersion, contractSnapshot } from '../../scripts/lib/speaking/collect.mjs';
import { routes,compensationPlan } from '../../protocol/speaking/routes.mjs';
import { checkOpenRouterFunds,nextBeijingDay } from '../../scripts/lib/speaking/funding.mjs';
import {controlRequest} from './control.mjs';

const jsonPut = (bucket, key, value) => bucket.put(key, JSON.stringify(value), { httpMetadata: { contentType: 'application/json' } });
const digest = async bytes => [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
function base64(bytes) {
  let binary = ''; const array = new Uint8Array(bytes);
  for (let offset=0; offset<array.length; offset+=32768) binary += String.fromCharCode(...array.subarray(offset,offset+32768));
  return btoa(binary);
}

// The caller stores the original and an unedited WAV derivative before queuing.
export async function collectNext(env) {
  if (!env.PRACTICE_DB || !env.SPEAKING_ASSETS) throw new Error('口语数据存储尚未齐备');
  const db = env.PRACTICE_DB, stamp = Date.now();
  const job = await db.prepare(`SELECT * FROM speaking_jobs WHERE status='queued' OR (status='running' AND lease_until<?) OR (status='waiting_credit' AND next_retry_at<=?) ORDER BY created_at LIMIT 1`).bind(stamp,stamp).first();
  if (!job) return { idle: true };
  const token = crypto.randomUUID();
  const claimed = await db.prepare(`UPDATE speaking_jobs SET status='running',lease_token=?,lease_until=?,updated_at=?
    WHERE id=? AND (status='queued' OR (status='running' AND lease_until<?) OR (status='waiting_credit' AND next_retry_at<=?))`).bind(token,stamp+1200000,stamp,job.id,stamp,stamp).run();
  if (!claimed.meta.changes) return { idle: true };
  try {
    const prefix = `speaking/${job.attempt_id}/jobs/${job.id}`;
    const resumingCredit=job.status==='waiting_credit'||job.next_retry_at!=null;
    const waitForCredit=async(nextRetryAt)=>{
      const updated=await db.prepare("UPDATE speaking_jobs SET status='waiting_credit',next_retry_at=?,lease_token=NULL,lease_until=NULL,updated_at=? WHERE id=? AND lease_token=?")
        .bind(nextRetryAt,Date.now(),job.id,token).run();
      if(updated.meta.changes)await db.prepare("UPDATE speaking_attempts SET status='waiting_credit' WHERE id=? AND status IN ('preparing','collecting','needs_attention','waiting_credit')").bind(job.attempt_id).run();
      return{jobId:job.id,state:'waiting_credit',nextRetryAt,ownerAction:'OpenRouter 充值/恢复 key 额度后续作；不会自动付款。'};
    };
    if(resumingCredit){
      const funds=await checkOpenRouterFunds(env.OPENROUTER_API_KEY);
      await jsonPut(env.SPEAKING_ASSETS,`${prefix}/funds/${crypto.randomUUID()}.json`,funds);
      if(!funds.verified)throw new Error('OpenRouter 余额无法确认；保留任务，核对余额接口，不能按没钱处理。');
      if(!funds.usable)return await waitForCredit(Date.now()+3600000);
    }
    if (job.contract_version !== contractVersion) throw new Error('采集协议版本不同；应使用固定版本，不能静默替换');
    const pinned = await env.SPEAKING_ASSETS.get(job.contract_key);
    if (!pinned) throw new Error('固定采集要求不存在');
    const pinnedBytes = await pinned.arrayBuffer();
    const currentBytes = new TextEncoder().encode(JSON.stringify(contractSnapshot()));
    if (await digest(pinnedBytes) !== job.contract_digest || await digest(currentBytes) !== job.contract_digest) throw new Error('固定提示词或数据结构不一致；不能静默重评');
    const file = await env.SPEAKING_ASSETS.get(job.audio_key);
    if (!file) throw new Error('固定录音副本不存在');
    const bytes = await file.arrayBuffer();
    if (await digest(bytes) !== job.audio_digest) throw new Error('录音摘要不一致');
    const audio = { base64: base64(bytes), format: job.audio_format, seconds: job.audio_seconds, digest: job.audio_digest };
    let details=[];
    if(job.plan_key||job.plan_digest){
      const planFile=await env.SPEAKING_ASSETS.get(job.plan_key);
      if(!planFile)throw new Error('固定专项计划不存在');
      const planBytes=await planFile.arrayBuffer();
      if(await digest(planBytes)!==job.plan_digest)throw new Error('固定专项计划摘要不一致');
      const plan=JSON.parse(new TextDecoder().decode(planBytes));
      if(plan.audioDigest!==job.audio_digest||!Array.isArray(plan.tasks))throw new Error('专项计划与原声不一致');
      const ids=new Set();
      for(const task of plan.tasks){
        if(!/^[a-zA-Z0-9._-]{1,110}$/.test(task.id??'')||task.id==='baseline'||ids.has(task.id)||typeof task.focusPrompt!=='string'||!task.focusPrompt.trim()||!['qwen','gpt-audio'].includes(task.provider??'qwen'))throw new Error('专项计划需要独立编号、可用模型和具体声音目标');
        ids.add(task.id);
      }
      details=plan.tasks;
    }
    if(job.parent_job_id){
      const parent=await db.prepare('SELECT attempt_id,audio_digest FROM speaking_jobs WHERE id=?').bind(job.parent_job_id).first();
      if(!parent || parent.attempt_id!==job.attempt_id || parent.audio_digest!==job.audio_digest)throw new Error('补充任务与原答卷/原声不一致');
      const {results: reusable}=await db.prepare("SELECT * FROM speaking_calls WHERE job_id=? AND task_id='baseline' ORDER BY created_at").bind(job.parent_job_id).all();
      for(const call of reusable){
        // A supplement keeps old request/response keys and their original contract provenance.
        await db.prepare(`INSERT INTO speaking_calls(id,job_id,provider,route_id,reused_call_id,request_key,raw_key,metadata_key,parsed_key,state,created_at,completed_at,cost_usd,error_json)
          SELECT ?,?,?,?,?,?,?,?,?,?,?,?,NULL,?
          WHERE NOT EXISTS(SELECT 1 FROM speaking_calls WHERE job_id=? AND reused_call_id=?)`)
          .bind(crypto.randomUUID(),job.id,call.provider,call.route_id,call.id,call.request_key,call.raw_key,call.metadata_key,call.parsed_key,call.state,Date.now(),call.completed_at,call.error_json,job.id,call.id).run();
      }
    }
    const { results: prior } = await db.prepare('SELECT * FROM speaking_calls WHERE job_id=? ORDER BY created_at').bind(job.id).all();
    const runRoute = async (route,task={id:'baseline',focusPrompt:''}) => {
      const lease=await db.prepare("UPDATE speaking_jobs SET lease_until=?,updated_at=? WHERE id=? AND status='running' AND lease_token=?")
        .bind(Date.now()+1200000,Date.now(),job.id,token).run();
      if(!lease.meta.changes)throw new Error('任务领取已移交；不再发起付费请求');
      const provider=route.profile, routeId=route.id;
      const taskId=task.id,matching=prior.filter(call=>call.route_id===routeId&&call.task_id===taskId);
      if(!['openrouter','whisper'].includes(route.kind))return {routeId,taskId,metadata:{state:'failed',failureKind:'not_configured',error:'该通路尚未接入实际 adapter'}};
      if ((route.kind==='openrouter' && !env.OPENROUTER_API_KEY) || (route.kind==='whisper' && !env.AI)) return {routeId,taskId,metadata:{state:'failed',failureKind:'not_configured',error:'采集服务未配置'}};
      const savedCall = async call => {
        const metadataFile=await env.SPEAKING_ASSETS.get(call.metadata_key), parsedFile=await env.SPEAKING_ASSETS.get(call.parsed_key);
        return {routeId,taskId,callId:call.id,reused:true,metadata:metadataFile?await metadataFile.json():{state:call.state},parsed:parsedFile?await parsedFile.json():null};
      };
      const complete = matching.findLast(call => call.state==='complete');
      if (complete) return savedCall(complete);
      const unfinished = matching.findLast(call => call.state==='calling');
      if (unfinished) {
        // A crash after billing may still leave recoverable output. Do not pay again blindly.
        const saved = await env.SPEAKING_ASSETS.get(unfinished.metadata_key);
        if (saved) {
          const metadata = await saved.json();
          const raw = await env.SPEAKING_ASSETS.head(unfinished.raw_key);
          const parsed = await env.SPEAKING_ASSETS.head(unfinished.parsed_key);
          if (raw && parsed && metadata.state==='complete') {
            await db.prepare("UPDATE speaking_calls SET state='complete',completed_at=?,cost_usd=? WHERE id=? AND state='calling'")
              .bind(Date.now(),unfinished.reused_call_id?null:metadata.usage?.cost ?? null,unfinished.id).run();
            return savedCall(unfinished);
          }
        }
        await db.prepare("UPDATE speaking_calls SET state='outcome_unknown',completed_at=? WHERE id=? AND state='calling'").bind(Date.now(),unfinished.id).run();
        return { routeId, taskId, metadata:{state:'outcome_unknown'}, callId:unfinished.id };
      }
      // Existing failed/incomplete calls require an explicit requeue decision.
      const previous=matching.at(-1);
      if(previous){
        const saved=await savedCall(previous);
        if(!resumingCredit||saved.metadata.httpStatus!==402)return saved;
      }
      const callId = crypto.randomUUID(), callPrefix = `${prefix}/calls/${callId}`;
      const keys = { request:`${callPrefix}/request.json`, raw:`${callPrefix}/raw.json`, metadata:`${callPrefix}/metadata.json`, parsed:`${callPrefix}/parsed.json` };
      await jsonPut(env.SPEAKING_ASSETS, keys.request, {...requestDescriptor(provider,audio,job.audio_key,{focusPrompt:task.focusPrompt,focused:taskId!=='baseline'}),taskId});
      await db.prepare(`INSERT INTO speaking_calls(id,job_id,provider,route_id,task_id,request_key,raw_key,metadata_key,parsed_key,state,created_at)
        VALUES(?,?,?,?,?,?,?,?,?,'calling',?)`).bind(callId,job.id,provider,routeId,taskId,keys.request,keys.raw,keys.metadata,keys.parsed,Date.now()).run();
      try {
        const collected = route.kind==='whisper' ? await collectWhisper(audio,{ai:env.AI}) : await collectOpenRouter(provider,audio,{apiKey:env.OPENROUTER_API_KEY,focusPrompt:task.focusPrompt,focused:taskId!=='baseline'});
        await env.SPEAKING_ASSETS.put(keys.raw,collected.raw,{httpMetadata:{contentType:'application/json'}});
        await jsonPut(env.SPEAKING_ASSETS,keys.parsed,collected.parsed);
        await jsonPut(env.SPEAKING_ASSETS,keys.metadata,collected.metadata);
        await db.prepare('UPDATE speaking_calls SET state=?,completed_at=?,cost_usd=?,error_json=? WHERE id=?')
          .bind(collected.metadata.state,Date.now(),collected.metadata.usage?.cost ?? null,JSON.stringify(collected.metadata.error ?? null),callId).run();
        return { routeId, taskId, metadata:collected.metadata, parsed:collected.parsed, callId };
      } catch (error) {
        const persisted=await env.SPEAKING_ASSETS.get(keys.metadata);
        if(persisted){
          const kept=await persisted.json();
          if(kept.state){
            // Preserve a completed provider return if only the later DB write failed.
            await jsonPut(env.SPEAKING_ASSETS,`${callPrefix}/persistence-error.json`,{error:String(error.message),at:new Date().toISOString()});
            return {routeId,taskId,metadata:kept,parsed:await env.SPEAKING_ASSETS.get(keys.parsed).then(f=>f?.json()),callId,persistenceNeedsRecovery:true};
          }
        }
        // Transport failures may have happened after the provider charged the call.
        const metadata = { provider, state:'outcome_unknown', error:String(error.message), completedAt:new Date().toISOString(), contractVersion };
        await jsonPut(env.SPEAKING_ASSETS,keys.metadata,metadata);
        await db.prepare("UPDATE speaking_calls SET state='outcome_unknown',completed_at=?,error_json=? WHERE id=?").bind(Date.now(),JSON.stringify(metadata),callId).run();
        return { routeId, taskId, metadata, callId };
      }
    };
    const initial=routes.filter(r=>r.primary&&r.enabled);
    const settled=await Promise.allSettled(initial.map(route=>runRoute(route)));
    const evidence=settled.map((r,i)=>r.status==='fulfilled'?r.value:{routeId:initial[i].id,metadata:{state:'failed',error:String(r.reason?.message ?? r.reason)}});
    let compensation=compensationPlan(evidence);
    // Additional Qwen listens are explicit tasks, not independent votes or blind retries.
    for(const task of details){
      if(compensation.waitingForCredit)break;
      evidence.push(await runRoute(routes.find(r=>r.profile===(task.provider??'qwen')),task));
      compensation=compensationPlan(evidence);
    }
    // Each eligible alternative is tried once; a service-wide balance failure blocks its siblings.
    while(compensation.candidates.length){
      const route=routes.find(r=>r.id===compensation.candidates[0]);
      try{evidence.push(await runRoute(route));}catch(error){evidence.push({routeId:route.id,metadata:{state:'failed',error:String(error.message)}});}
      compensation=compensationPlan(evidence);
    }
    const complete=initial.every(route=>evidence.some(c=>c.routeId===route.id && (c.taskId??'baseline')==='baseline' && c.metadata.state==='complete' && (c.parsed?.audio_access==null || c.parsed.audio_access==='processed')));
    const { results: calls } = await db.prepare('SELECT * FROM speaking_calls WHERE job_id=? ORDER BY created_at').bind(job.id).all();
    await jsonPut(env.SPEAKING_ASSETS,`${prefix}/manifest.json`,{
      schemaVersion:1, contractVersion, attemptId:job.attempt_id, jobId:job.id,
      audio:{objectKey:job.audio_key,digest:job.audio_digest,seconds:job.audio_seconds,format:job.audio_format},
      collectionComplete:complete, calls, compensation,
      extraPlan:job.plan_key?{key:job.plan_key,digest:job.plan_digest}:null,
      results:evidence.map(({parsed,...rest})=>rest),
    });
    if(compensation.waitingForCredit)return await waitForCredit(nextBeijingDay());
    const updated = await db.prepare('UPDATE speaking_jobs SET status=?,next_retry_at=NULL,lease_token=NULL,lease_until=NULL,updated_at=? WHERE id=? AND lease_token=?')
      .bind(compensation.readyForCodex?'collected':'needs_attention',Date.now(),job.id,token).run();
    if (updated.meta.changes) await db.prepare("UPDATE speaking_attempts SET status=? WHERE id=? AND status IN ('preparing','collecting','needs_attention','waiting_credit')")
      .bind(compensation.readyForCodex?'ready':'needs_attention',job.attempt_id).run();
    return { jobId:job.id, collectionComplete:complete, compensation };
  } catch (error) {
    const released=await db.prepare("UPDATE speaking_jobs SET status='needs_attention',lease_token=NULL,lease_until=NULL,updated_at=? WHERE id=? AND lease_token=?").bind(Date.now(),job.id,token).run();
    if(released.meta.changes)await db.prepare("UPDATE speaking_attempts SET status='needs_attention' WHERE id=? AND status IN ('preparing','collecting','waiting_credit')").bind(job.attempt_id).run();
    throw error;
  }
}

export default {
  fetch(request,env) { return controlRequest(request,env); },
  scheduled(_controller,env,ctx) { ctx.waitUntil(collectNext(env)); },
};
