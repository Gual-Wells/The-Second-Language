import { contractVersion, profiles, collectionSchema, detailSchema,detailPrompt,responseCompletionPrompt, whisperModel } from '../../../protocol/speaking/contract.mjs';
import { routes, billingPools } from '../../../protocol/speaking/routes.mjs';

export { contractVersion, profiles, whisperModel };

export const contractSnapshot = () => ({ contractVersion, profiles, collectionSchema, detailSchema,detailPrompt,responseCompletionPrompt,routes, billingPools, whisperModel, whisperParameters: { language:'en', task:'transcribe', vad_filter:false } });

export function openRouterRequest(provider, audio, { focusPrompt = '',focused = false } = {}) {
  const profile = profiles[provider];
  if (!profile) throw new Error('未知口语采集通路');
  if (!audio?.base64 || !['wav', 'mp3', 'm4a', 'flac', 'aac', 'ogg'].includes(audio.format)) throw new Error('需要完整录音及明确格式');
  const detail=focused||profile.collection==='detail',schema=detail?detailSchema:collectionSchema;
  const prompt=detail?detailPrompt+(focused?'':`\n${profile.prompt}`):profile.prompt;
  return {
    model: profile.model,
    messages: [{ role: 'user', content: [
      { type: 'text', text: prompt + (focusPrompt ? '\nSupplement purpose and evidence request:\n'+focusPrompt : '') + (profile.responseMode==='prompt'?responseCompletionPrompt:'') },
      { type: 'input_audio', input_audio: { data: audio.base64, format: audio.format } },
    ] }],
    ...(profile.responseMode==='prompt'?{modalities:profile.modalities}:{response_format: { type: 'json_schema', json_schema: { name: 'speaking_evidence', strict: true, schema } }}),
    provider: { require_parameters: true, allow_fallbacks: true },
    max_tokens: profile.maxTokens,
    temperature: 0,
    ...(provider === 'gemini' ? { reasoning: { effort: 'low' } } : {}),
  };
}

// Validate the small schema subset we send; this does not validate sound judgments.
export function structureErrors(value, schema = collectionSchema, location = '$') {
  const errors = [], types = Array.isArray(schema.type) ? schema.type : [schema.type];
  const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
  if (!types.includes(type) || (type === 'number' && !Number.isFinite(value))) return [`${location}: type`];
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${location}: enum`);
  if (type === 'number' && schema.minimum != null && value < schema.minimum) errors.push(`${location}: minimum`);
  if (type === 'array') value.forEach((v, i) => errors.push(...structureErrors(v, schema.items, `${location}[${i}]`)));
  if (type === 'object') {
    for (const key of schema.required ?? []) if (!Object.hasOwn(value, key)) errors.push(`${location}.${key}: missing`);
    for (const [key, v] of Object.entries(value)) {
      if (schema.properties?.[key]) errors.push(...structureErrors(v, schema.properties[key], `${location}.${key}`));
      else if (schema.additionalProperties === false) errors.push(`${location}.${key}: unexpected`);
    }
  }
  return errors;
}

function evidenceWarnings(parsed, seconds) {
  if (!parsed) return [];
  const warnings = [], ids = new Set();
  for (const segment of parsed.segments ?? []) {
    if (ids.has(segment.id)) warnings.push(`重复片段 ID ${segment.id}`);
    ids.add(segment.id);
  }
  for (const item of [...(parsed.segments ?? []), ...(parsed.audible_findings ?? [])]) {
    if (item.start_seconds != null && item.end_seconds != null && item.start_seconds > item.end_seconds) warnings.push(`${item.id}: 时间倒序`);
    if ([item.start_seconds, item.end_seconds].some(t => t != null && Number.isFinite(seconds) && t > seconds)) warnings.push(`${item.id}: 时间超出录音`);
  }
  for (const item of [...(parsed.audible_findings ?? []), ...(parsed.language_findings ?? []), ...(parsed.uncertain_spans ?? [])]) {
    for (const id of item.segment_ids ?? []) if (!ids.has(id)) warnings.push(`不存在的片段引用 ${id}`);
  }
  if (parsed.audio_access !== 'processed') warnings.push('模型自述声音访问不确定，需结合实际返回核查');
  if (!parsed.coverage?.claimed_complete_recording) warnings.push('模型未声明覆盖完整录音');
  return warnings;
}

export async function collectOpenRouter(provider, audio, { apiKey, fetchImpl = fetch, timeoutMs = 300000, focusPrompt = '',focused = false } = {}) {
  if (!apiKey) throw new Error('缺少服务端 OpenRouter 密钥');
  const request = openRouterRequest(provider, audio,{focusPrompt,focused}), startedAt = new Date().toISOString();
  const detail=focused||profiles[provider].collection==='detail';
  const response = await fetchImpl('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(timeoutMs),
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json', 'HTTP-Referer': 'https://the-second-language.pages.dev/', 'X-Title': 'The Second Language speaking evidence' },
    body: JSON.stringify(request),
  });
  const raw = await response.text();
  let envelope = null, parsed = null, parseError = null,parseMethod=null;
  try { envelope = JSON.parse(raw); } catch { parseError = '提供商返回不是 JSON'; }
  const choice = envelope?.choices?.[0], content = choice?.message?.content;
  const text = typeof content === 'string' ? content : Array.isArray(content) ? content.filter(p => p.type === 'text').map(p => p.text).join('') : '';
  if (response.ok) {
    try { parsed = JSON.parse(text);parseMethod='json'; } catch {
      const fenced=text.trim().match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
      try{if(!fenced)throw Error();parsed=JSON.parse(fenced[1]);parseMethod='single-json-fence';}catch{parseError = '模型正文不是完整 JSON；保留原文';}
    }
  }
  // Some providers wrap one complete report in an array despite the object schema.
  // Unwrap only a single independently valid report; preserve the original raw return.
  if(Array.isArray(parsed)&&parsed.length===1&&!structureErrors(parsed[0],detail?detailSchema:collectionSchema).length){
    parsed=parsed[0];parseMethod+='-single-object-array';
  }
  const validationErrors = parsed ? structureErrors(parsed,detail?detailSchema:collectionSchema) : [];
  const structurallyValid = Boolean(parsed && !validationErrors.length);
  const truncated = choice?.finish_reason === 'length';
  const complete = response.ok && structurallyValid && !truncated && choice?.finish_reason === 'stop' && Boolean(parsed.verbatim_transcript?.trim());
  return {
    raw,
    parsed,
    metadata: {
      contractVersion, provider, requestedModel: request.model,
      returnedModel: envelope?.model ?? null, actualProvider: envelope?.provider ?? null,
      invocationId: envelope?.id ?? null, httpStatus: response.status,
      startedAt, completedAt: new Date().toISOString(),
      usage: envelope?.usage ?? null, finishReason: choice?.finish_reason ?? null,
      returnedTextLength:text.length,
      outputContract:detail?'speech-detail-v1':'twelve-dimensions-v1',formatEnforcement:profiles[provider].responseMode==='prompt'?'prompt-only; locally validated':'provider-json-schema; locally validated',
      state: complete ? 'complete' : response.ok ? 'needs_review' : 'failed',
      parseError,parseMethod, validationErrors,
      evidenceWarnings: structurallyValid&&!detail ? evidenceWarnings(parsed, audio.seconds) : [],
      error: envelope?.error ?? null,
      timeProvenance: detail?'not-requested':'model-estimate-unverified',
      rawResponseComplete: true,
    },
  };
}

export async function collectWhisper(audio, { ai } = {}) {
  if (!ai?.run) throw new Error('需要 Cloudflare Workers AI binding');
  const startedAt = new Date().toISOString();
  const native = await ai.run(whisperModel, { audio: audio.base64, language: 'en', task: 'transcribe', vad_filter: false });
  const words=(native?.segments ?? []).flatMap(s=>s.words ?? []);
  const timingAvailable=words.length>0&&words.every(w=>Number.isFinite(w.start)&&Number.isFinite(w.end)&&w.start>=0&&w.end>=w.start&&w.end<=audio.seconds);
  return {
    raw: JSON.stringify(native), parsed: native,
    metadata: { contractVersion, provider: 'whisper', requestedModel: whisperModel, startedAt,
      completedAt: new Date().toISOString(), state: native?.text?.trim() ? 'complete' : 'needs_review',
      timeProvenance: 'asr-unverified', usage: native?.usage??null,
      timingAvailable,
      recognitionStatisticsAvailable:(native?.segments??[]).some(s=>Number.isFinite(s.avg_logprob)),
      rawResponseComplete: true, rawSource: 'Workers AI binding native result; no HTTP envelope available',
    },
  };
}

export function requestDescriptor(provider, audio, objectKey, options = {}) {
  if (provider === 'whisper') return { contractVersion, model: whisperModel, parameters: { language: 'en', task: 'transcribe', vad_filter: false }, audio: { objectKey, digest: audio.digest, format: audio.format, seconds: audio.seconds } };
  const request = openRouterRequest(provider, audio,options);
  request.messages[0].content[1].input_audio.data = { objectKey, digest: audio.digest, note: 'Stored reference replaces base64 here only; actual request contains the complete file.' };
  return { contractVersion, request };
}
