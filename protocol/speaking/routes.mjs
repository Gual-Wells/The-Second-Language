// Service/model redundancy is distinct from independent evidence and distinct billing.
export const billingPools = Object.freeze([
  { id:'openrouter', channels:['or-gemini','or-qwen','or-gpt-audio','or-gemini-lite','or-gemini-flash'], account:'one-shared-balance', configured:true },
  { id:'cloudflare-ai', channels:['cf-whisper'], account:'cloudflare-workers-ai', configured:true },
  { id:'tencent-soe', channels:['tencent-sentence'], account:'tencent-soe-n', configured:true, execution:'local-targeted-adapter' },
  { id:'alibaba-model-studio', channels:['direct-qwen'], configured:false },
  { id:'google-direct', channels:['direct-gemini'], configured:false },
  { id:'azure', channels:['azure-speech'], configured:false },
]);

export const routes = Object.freeze([
  {id:'or-gpt-audio',kind:'openrouter',profile:'gpt-audio',service:'openrouter',author:'openai',capabilities:['transcription','audio-observation'],enabled:true,primary:true,backupEligible:false,verified:'complete-audio-final-JSON-prompt-return; phonetic-judgments-unverified'},
  { id:'cf-whisper', kind:'whisper', profile:'whisper', service:'cloudflare-ai', author:'openai', capabilities:['transcription','asr-timing'], enabled:true,primary:true, verified:'complete-audio-native-output' },
  { id:'or-gemini', kind:'openrouter', profile:'gemini', service:'openrouter', author:'google', capabilities:['transcription','audio-observation'], enabled:true,primary:true, verified:'complete-audio-detailed-schema; phonetic-judgments-unverified' },
  { id:'or-qwen', kind:'openrouter', profile:'qwen', service:'openrouter', author:'qwen', capabilities:['transcription','audio-observation'], enabled:true,primary:true, verified:'complete-audio-detailed-schema; phonetic-judgments-unverified' },
  { id:'or-gemini-lite', kind:'openrouter', profile:'gemini-flash-lite', service:'openrouter', author:'google', capabilities:['transcription','audio-observation'], enabled:false, verified:'audio-schema-returned; teaching-quality-rejected' },
  { id:'or-gemini-flash', kind:'openrouter', profile:'gemini-flash', service:'openrouter', author:'google', capabilities:['transcription','audio-observation'], enabled:false, verified:'full-audio-schema-return; transcript and phonetic claims rejected' },
  { id:'tencent-sentence', kind:'targeted', profile:'tencent-soe-n-sentence', service:'tencent-soe', author:'tencent', capabilities:['reference-assisted-phoneme','provider-timing'], enabled:true, verified:'sentence-output; judgments-unverified' },
  { id:'direct-qwen', kind:'reserved', profile:null, service:'alibaba-model-studio', author:'qwen', capabilities:['transcription','audio-observation'], enabled:false, verified:'no-account-or-adapter' },
  { id:'direct-gemini', kind:'reserved', profile:null, service:'google-direct', author:'google', capabilities:['transcription','audio-observation'], enabled:false, verified:'no-account-or-adapter' },
  { id:'azure-speech', kind:'reserved', profile:null, service:'azure', author:'microsoft', capabilities:['transcription','provider-timing','pronunciation-assessment'], enabled:false, verified:'no-account-or-adapter' },
]);

export function failureScope(metadata, route) {
  const status=metadata?.httpStatus, error=metadata?.error;
  const message=typeof error==='string'?error:JSON.stringify(error ?? metadata?.parseError ?? '');
  if(metadata?.failureKind==='not_configured')return {service:route.service,reason:'not-configured',retryable:false};
  if(status===402)return {service:route.service,reason:'quota-or-balance',retryable:false};
  if(status===401)return {service:route.service,reason:'credentials',retryable:false};
  if(status===403 && /author.*banned/i.test(message))return {service:route.service,author:route.author,reason:'author-eligibility',retryable:false};
  if(status===403)return {route:route.id,reason:'access-or-region',retryable:false};
  if(status===429 || status>=500)return {route:route.id,reason:'temporary-provider-failure',retryable:true};
  return {route:route.id,reason:'incomplete-or-unknown',retryable:false};
}

export function compensationPlan(calls, registry=routes) {
  // A historical 402 is resolved only by a later completed call for the same task.
  const latest=[...new Map(calls.map(c=>[`${c.routeId}/${c.taskId??'baseline'}`,c])).values()];
  const waitingForCredit=latest.some(c=>c.metadata?.httpStatus===402 && registry.find(r=>r.id===c.routeId)?.service==='openrouter');
  const successful=[...new Map(calls.filter(c=>c.metadata?.state==='complete' && (c.parsed?.audio_access == null || c.parsed.audio_access==='processed')).map(c=>[c.routeId,c])).values()];
  const reviewable=calls.filter(c=>c.metadata?.state==='needs_review' && (c.metadata.returnedTextLength>0 || c.parsed?.verbatim_transcript?.trim()));
  const used=new Set(calls.map(c=>c.routeId));
  const blocked=latest.filter(c=>c.metadata?.state!=='complete').map(c=>failureScope(c.metadata,registry.find(r=>r.id===c.routeId)??{id:c.routeId,service:'unknown',author:'unknown'}));
  const usable=r=>r.enabled && r.backupEligible!==false && !['reserved','targeted'].includes(r.kind) && !used.has(r.id) && !blocked.some(b=>b.route===r.id || (b.service===r.service && (!b.author || b.author===r.author)));
  const audioObservers=successful.filter(c=>(registry.find(r=>r.id===c.routeId)?.capabilities ?? []).includes('audio-observation'));
  const transcription=successful.some(c=>(registry.find(r=>r.id===c.routeId)?.capabilities ?? []).includes('transcription'));
  const timing=successful.some(c=>(registry.find(r=>r.id===c.routeId)?.capabilities ?? []).includes('asr-timing') &&
    (c.metadata.timingAvailable ?? (c.parsed?.segments ?? []).some(s=>(s.words ?? []).some(w=>Number.isFinite(w.start)&&Number.isFinite(w.end)&&w.start>=0&&w.end>=w.start))));
  const needs=[];
  if(!transcription)needs.push('transcription');
  if(audioObservers.length<2)needs.push('audio-observation');
  const candidates=registry.filter(r=>usable(r) && needs.some(n=>r.capabilities.includes(n)));
  return {
    needs, candidates:candidates.map(r=>r.id),
    waitingForCredit,
    interimMaterialAvailable:successful.length>0 || reviewable.length>0,
    readyForCodex:!waitingForCredit && (successful.length>0 || reviewable.length>0),
    reviewableReturns:reviewable.length,
    qualityScope:audioObservers.length>=2?'multiple-audio-observers':audioObservers.length===1?'single-audio-observer':transcription?'transcript-only':reviewable.length?'return-needs-review':'audio-pending',
    independentAudioSources:audioObservers.length,
    distinctAudioAuthors:new Set(audioObservers.map(c=>registry.find(r=>r.id===c.routeId)?.author)).size,
    timingAvailable:timing,
    targetedTencentAvailable:registry.some(r=>r.id==='tencent-sentence'&&r.enabled),
    targetedFollowups:audioObservers.length<2 && registry.some(r=>r.id==='tencent-sentence'&&r.enabled)
      ? [{routeId:'tencent-sentence',requires:'confirmed-actual-utterance-and-clip',execution:'codex-planned-local-tool',scope:'targeted-only; not-a-full-recording-replacement'}] : [],
    billingPools:[...new Set(registry.map(r=>r.service))].map(id=>({id,blocked:blocked.some(b=>b.service===id&&!b.author),used:successful.some(c=>registry.find(r=>r.id===c.routeId)?.service===id)})),
    blocked,
    deferred:!timing?['asr-word-timing']:[],
  };
}
