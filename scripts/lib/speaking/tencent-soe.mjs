import { createHmac, randomInt, randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';

export const providerId = 'tencent-soe-n';
export const capabilities = Object.freeze({ wordAccuracy: true, fluency: true, phonemes: false, prosody: false, wordTimestamps: false, ieltsBand: false });

export function pcmFromWav(bytes) {
  if (bytes.length < 44 || bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WAVE') throw new Error('需要 PCM WAV 音频。');
  const limit = bytes.readUInt32LE(4) + 8;
  if (limit > bytes.length) throw new Error('WAV 文件截断，不能提交评测。');
  let format, pcm;
  for (let offset = 12; offset + 8 <= limit;) {
    const name = bytes.toString('ascii', offset, offset + 4), size = bytes.readUInt32LE(offset + 4), start = offset + 8;
    if (start + size > limit) throw new Error('WAV 数据块截断，不能提交评测。');
    if (name === 'fmt ') {
      if (size < 16) throw new Error('WAV 格式块无效。');
      format = { encoding: bytes.readUInt16LE(start), channels: bytes.readUInt16LE(start + 2), sampleRate: bytes.readUInt32LE(start + 4), byteRate: bytes.readUInt32LE(start + 8), align: bytes.readUInt16LE(start + 12), bits: bytes.readUInt16LE(start + 14) };
    }
    if (name === 'data') { if (pcm) throw new Error('WAV 包含多个音频数据块，需要先转换。'); pcm = bytes.subarray(start, start + size); }
    offset = start + size + (size % 2);
  }
  if (!format || format.encoding !== 1 || format.channels !== 1 || format.sampleRate !== 16000 || format.bits !== 16 || format.byteRate !== 32000 || format.align !== 2) throw new Error('请先转换为 16kHz、16bit、单声道 PCM WAV。');
  if (!pcm?.length || pcm.length % 2) throw new Error('WAV 音频数据为空或采样不完整。');
  const seconds = pcm.length / 32000;
  if (seconds > 300) throw new Error('自由说录音最多 300 秒。');
  return { pcm, seconds };
}

export function signedUrl(config, { now = Math.floor(Date.now() / 1000), voiceId = randomUUID(), nonce = randomInt(1, 2 ** 31), evalMode = 3, referenceText = '', sentenceInfoEnabled = 0, phonemeLetters = false, ipaOutput = false, recMode = 0 } = {}) {
  if (!/^\d+$/.test(String(config.appId)) || !config.secretId || !config.secretKey) throw new Error('请在本机配置腾讯 AppID、SecretId、SecretKey。');
  const scoreCoeff = Number(config.scoreCoeff ?? 4);
  if (!Number.isFinite(scoreCoeff) || scoreCoeff < 1 || scoreCoeff > 4) throw new Error('scoreCoeff 必须在 1–4 之间。');
  if (![0,1,3,4].includes(evalMode)) throw new Error('不支持的专项评测模式。');
  if([0,4].includes(evalMode)&&(!/^[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/.test(referenceText)))throw new Error('单词专项仅接受一个本人实际说出的词。');
  if((phonemeLetters||ipaOutput)&&![0,4].includes(evalMode))throw new Error('映射/IPA 开关当前仅在单词专项接入。');
  if(phonemeLetters&&ipaOutput)throw new Error('字母映射与 IPA 当前分别调用；组合指令尚未实测。');
  if(![0,1].includes(recMode))throw new Error('无效传输模式。');
  if (evalMode === 1 && (typeof referenceText !== 'string' || !referenceText.trim() || referenceText.trim().split(/\s+/).length > 30)) throw new Error('句子专项需要本人原话，不超过 30 词。');
  if (evalMode === 3 && referenceText !== '') throw new Error('自由说首轮不输入参考稿。');
  const commands=[phonemeLetters?'F_P2L=true':null,ipaOutput?'F_IPA=true':null].filter(Boolean);
  const refText=commands.length?`{::cmd{${commands.join(',')}}}${referenceText}`:referenceText;
  const params = { eval_mode: evalMode, expired: now + 600, nonce, rec_mode: recMode, ref_text: refText, score_coeff: scoreCoeff.toFixed(1), secretid: config.secretId, sentence_info_enabled: sentenceInfoEnabled, server_engine_type: '16k_en', text_mode: 0, timestamp: now, voice_format: 0, voice_id: voiceId };
  const entries = Object.entries(params).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  const hostPath = `soe.cloud.tencent.com/soe/api/${config.appId}`;
  const canonical = `${hostPath}?${entries.map(([k, v]) => `${k}=${v}`).join('&')}`;
  const signature = createHmac('sha1', config.secretKey).update(canonical).digest('base64');
  return `wss://${hostPath}?${entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')}&signature=${encodeURIComponent(signature)}`;
}

const nonnegative = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
function objectResult(value) {
  if (typeof value === 'string') { try { value = JSON.parse(value); } catch { return null; } }
  return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
}
export function normalize(messages, metadata) {
  if (!messages.some(m => m.final === 1 && m.code === 0)) throw new Error('未收到评测完成确认；保留原声后重试。');
  const results = messages.map(m => objectResult(m.result)).filter(Boolean);
  const result = results.at(-1);
  if (!result || !Array.isArray(result.Words) || !result.Words.length) throw new Error('服务未返回可用的结构化口语结果；不能据此生成声音反馈。');
  const words = result.Words.map(w => ({ text: typeof w.Word === 'string' ? w.Word : '', accuracy: nonnegative(w.PronAccuracy), fluency: nonnegative(w.PronFluency), startMs: null, endMs: null }));
  return { schemaVersion: 1, provider: providerId, engine: '16k_en', providerModelVersion: null, mode: 'free-speech', assessedAt: new Date().toISOString(), audio: metadata.audio,
    parameters: { scoreCoeff: metadata.scoreCoeff, referenceText: null }, capabilities,
    providerTranscript: words.map(w => w.text).join(' '), words,
    scores: { accuracy: nonnegative(result.PronAccuracy), fluency: nonnegative(result.PronFluency) },
    quality: { providerCompleted: true, acousticEvidence: words.some(w => w.accuracy !== null) || nonnegative(result.PronAccuracy) !== null || nonnegative(result.PronFluency) !== null, transcriptReviewed: false, teachingReady: false, pronunciationScope: 'word-accuracy', prosodyAvailable: false, timingAvailable: false, ieltsBand: null },
    limitations: ['发音与流利度保留提供商原始量纲，不直接换算雅思分数。', '此模式不提供可信的音素、韵律或逐词回听时间。', '转写仍可能有识别错误，应与原声及用户核对版本区分。'] };
}

export async function assess(config, pcm, { WebSocketImpl = globalThis.WebSocket, onProgress = () => {}, onMessage = () => {}, evalMode = 3, referenceText = '', sentenceInfoEnabled = 0, phonemeLetters = false, ipaOutput = false, recMode = 0 } = {}) {
  const seconds = pcm.length / 32000;
  if (!pcm.length || pcm.length % 2 || seconds > 300) throw new Error('PCM 长度无效或超过 300 秒。');
  if ([0,1,4].includes(evalMode) && seconds > 60) throw new Error('单词/句子专项录音最多 60 秒。');
  if (typeof WebSocketImpl !== 'function') throw new Error('需要支持 WebSocket 的 Node.js 22 或更新版本。');
  const url = signedUrl(config, { evalMode, referenceText, sentenceInfoEnabled, phonemeLetters, ipaOutput, recMode }), messages = [], abort = new AbortController();
  let ws, settled = false, ended = false, handshaken = false, sent = 0, resolveReady, rejectReady, resolveDone, rejectDone;
  const ready = new Promise((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });
  const done = new Promise((resolve, reject) => { resolveDone = resolve; rejectDone = reject; });
  // Both promises can reject while the other stage is still running.
  ready.catch(() => {}); done.catch(() => {});
  function fail(error) {
    if (settled) return; settled = true; abort.abort(); rejectReady(error); rejectDone(error);
    try { ws?.close(); } catch {}
  }
  const timeout = setTimeout(() => fail(new Error('腾讯口语评测超时；保留原声后重试。')), (seconds + 45) * 1000);
  const handshakeTimeout = setTimeout(() => fail(new Error('腾讯口语评测握手超时。')), 15000);
  try {
    try { ws = new WebSocketImpl(url); } catch { throw new Error('无法建立腾讯口语连接，请核对网络和服务开通。'); }
    ws.addEventListener('message', event => {
      if (settled) return;
      try { onMessage(event.data); } catch { fail(new Error('口语原始消息保存失败；已停止调用。')); return; }
      let packet; try { packet = JSON.parse(event.data); } catch { fail(new Error('口语服务返回无效消息。')); return; }
      if (packet.code !== 0) { fail(new Error(`腾讯口语评测失败（代码 ${Number(packet.code) || '未知'}），请核对权限、服务开通或套餐。`)); return; }
      messages.push(packet);
      if (!handshaken) { handshaken = true; clearTimeout(handshakeTimeout); resolveReady(); }
      if (packet.final === 1) {
        if (!ended) { fail(new Error('音频上传结束前服务提前返回完成，不能当作完整作答。')); return; }
        settled = true; resolveDone(messages); ws.close();
      }
    });
    ws.addEventListener('error', () => fail(new Error('腾讯口语连接失败；请核对网络和服务开通。')));
    ws.addEventListener('close', () => { if (!settled) fail(new Error('口语连接提前关闭；未收到完整评测。')); });
    await ready;
    if(recMode===1){
      // Recording mode accepts exactly one binary audio packet.
      ended=true;ws.send(pcm);sent=pcm.length;
      if(!settled)ws.send(JSON.stringify({type:'end'}));
      return await done;
    }
    let progressAt = 0;
    for (let offset = 0; offset < pcm.length; offset += 1280) {
      if (settled || ws.readyState !== 1) throw new Error('音频传输中断，不能当作完整评测。');
      const chunk = pcm.subarray(offset, Math.min(offset + 1280, pcm.length)); ws.send(chunk); sent += chunk.length;
      if (sent / 32000 - progressAt >= 15) { progressAt = sent / 32000; onProgress({ secondsSent: progressAt, secondsTotal: seconds }); }
      await delay(chunk.length / 32, undefined, { signal: abort.signal });
    }
    ended = true; ws.send(JSON.stringify({ type: 'end' }));
    return await done;
  } catch (error) {
    if (!settled) fail(error);
    // Use the provider-stage failure rather than a secondary abort exception.
    try { await done; } catch (failure) { throw failure; }
    throw error;
  } finally { clearTimeout(timeout); clearTimeout(handshakeTimeout); if (!settled) { settled = true; try { ws?.close(); } catch {} } }
}

export function normalizeSentence(messages, metadata) {
  if (!messages.some(m => m.final === 1 && m.code === 0)) throw new Error('未收到专项评测完成确认。');
  const result = messages.map(m=>objectResult(m.result)).filter(Boolean).at(-1);
  if (!result?.Words?.length) throw new Error('未收到句子专项结果。');
  const offsetMs = Number(metadata.clipStartSeconds) * 1000;
  const position = (start,end) => Number.isFinite(start) && Number.isFinite(end) && start >= 0 && end >= start && end <= metadata.audio.seconds*1000 && Number.isFinite(offsetMs)
    ? { originalStartMs:offsetMs+start, originalEndMs:offsetMs+end } : { originalStartMs:null, originalEndMs:null };
  return {
    schemaVersion:1, provider:providerId, mode:'reference-assisted-sentence', engine:'16k_en',
    audio:metadata.audio, originalDigest:metadata.originalDigest, clipStartSeconds:metadata.clipStartSeconds,
    referenceText:metadata.referenceText, referenceSource:metadata.referenceSource,
    parameters:{scoreCoeff:metadata.scoreCoeff,evalMode:1},
    words:result.Words.map(word=>({ ...word, ...position(word.MemBeginTime,word.MemEndTime),
      phones:(word.PhoneInfos ?? []).map(phone=>({...phone,...position(phone.MemBeginTime,phone.MemEndTime)})),
    })),
    scores:{accuracy:nonnegative(result.PronAccuracy),fluency:nonnegative(result.PronFluency),completion:nonnegative(result.PronCompletion)},
    quality:{providerCompleted:true,referenceAssisted:true,phonemeJudgmentsVerified:false,stressJudgmentsVerified:false,timeProvenance:'provider-boundaries-unverified',ieltsBand:null},
    limitations:['提供参考文本后的词序不等同于独立识别结果。','Phone 字段与分数不能自行证明实际误音；需要回听及语言判断。','Stress/DetectedStress 默认 false 不能用于断言没有重音。'],
  };
}
