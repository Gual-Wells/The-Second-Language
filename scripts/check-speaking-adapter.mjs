import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pcmFromWav, signedUrl, normalize, assess } from './lib/speaking/tencent-soe.mjs';

const fixture = Buffer.alloc(44 + 3840);
fixture.write('RIFF'); fixture.writeUInt32LE(fixture.length - 8, 4); fixture.write('WAVE', 8); fixture.write('fmt ', 12); fixture.writeUInt32LE(16, 16);
fixture.writeUInt16LE(1, 20); fixture.writeUInt16LE(1, 22); fixture.writeUInt32LE(16000, 24); fixture.writeUInt32LE(32000, 28); fixture.writeUInt16LE(2, 32); fixture.writeUInt16LE(16, 34); fixture.write('data', 36); fixture.writeUInt32LE(3840, 40);
const { pcm, seconds } = pcmFromWav(fixture); assert.equal(seconds, .12);
assert.throws(() => pcmFromWav(fixture.subarray(0, fixture.length - 1)), /截断/);
const wrongRate = Buffer.from(fixture); wrongRate.writeUInt32LE(44100, 24); assert.throws(() => pcmFromWav(wrongRate), /16kHz/);
assert.throws(() => signedUrl({ appId: '1', secretId: '', secretKey: '' }), /配置/);
const config = { appId: '123456', secretId: 'fixture-id', secretKey: 'fixture-key', scoreCoeff: 4 };
const url = new URL(signedUrl(config, { now: 1000, voiceId: 'fixed-fixture', nonce: 1 }));
assert.equal(url.searchParams.get('ref_text'), ''); assert.equal(url.searchParams.get('rec_mode'), '0'); assert.equal(url.searchParams.get('score_coeff'), '4.0'); assert.ok(url.searchParams.get('signature').endsWith('='));
const providerResult = { PronAccuracy: 87, PronFluency: .8, Words: [{ Word: 'hello', PronAccuracy: -1, PronFluency: .9, MemBeginTime: -1 }] };
let captured;
class FakeSocket extends EventTarget {
  readyState = 1;
  constructor() { super(); captured = []; setTimeout(() => this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ code: 0 }) })), 5); }
  send(value) {
    captured.push(value);
    if (typeof value === 'string') {
      assert.deepEqual(JSON.parse(value), { type: 'end' });
      this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ code: 0, result: providerResult }) }));
      this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ code: 0, final: 1 }) }));
    }
  }
  close() { this.readyState = 3; this.dispatchEvent(new Event('close')); }
}
const rawMessages=[];
const packets = await assess(config, pcm, { WebSocketImpl: FakeSocket,onMessage:raw=>rawMessages.push(raw) });
await assess(config,pcm,{WebSocketImpl:FakeSocket,evalMode:4,referenceText:'computer',phonemeLetters:true,recMode:1});
assert.equal(captured.length,2);assert.equal(captured[0].length,pcm.length);
const correctionUrl=new URL(signedUrl(config,{evalMode:4,referenceText:'computer',phonemeLetters:true,recMode:1}));
assert.equal(correctionUrl.searchParams.get('ref_text'),'{::cmd{F_P2L=true}}computer');
// Restore the streaming capture for its independent packet checks.
await assess(config,pcm,{WebSocketImpl:FakeSocket});
assert.equal(rawMessages.length,packets.length);
assert.equal(captured.length, 4); assert.equal(captured.slice(0, 3).reduce((n, b) => n + b.length, 0), pcm.length);
const evidence = normalize(packets, { audio: { assessedPcmSha256: createHash('sha256').update(pcm).digest('hex') }, scoreCoeff: 4 });
assert.equal(evidence.words[0].accuracy, null); assert.equal(evidence.words[0].startMs, null); assert.equal(evidence.quality.ieltsBand, null); assert.equal(evidence.capabilities.prosody, false);
assert.throws(() => normalize([{ code: 0, result: providerResult }], {}), /完成确认/);
assert.throws(() => normalize([{ code: 0, result: '{not JSON}' }, { code: 0, final: 1 }], {}), /结构化/);
class TruncatedSocket extends FakeSocket {
  send() { this.close(); }
}
await assert.rejects(assess(config, pcm, { WebSocketImpl: TruncatedSocket }), /提前关闭/);
class PrematureSocket extends FakeSocket {
  send() { this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ code: 0, final: 1 }) })); }
}
await assert.rejects(assess(config, pcm, { WebSocketImpl: PrematureSocket }), /提前返回/);
class DeniedSocket extends EventTarget {
  readyState=1;
  constructor(){super();setTimeout(()=>this.dispatchEvent(new MessageEvent('message',{data:JSON.stringify({code:150,'message':'fixture quota exhausted'})})),5);}
  close(){this.readyState=3;}
}
const deniedMessages=[];
await assert.rejects(assess(config,pcm,{WebSocketImpl:DeniedSocket,onMessage:raw=>deniedMessages.push(raw)}),/代码 150/);
assert.equal(JSON.parse(deniedMessages[0]).code,150);
console.log(JSON.stringify({ transportContractPassed: true, truncatedAudioRejected: true, earlyCloseRejected: true, prematureFinalRejected: true, unsupportedScoresNotInvented: true, actualProviderCalled: false, acousticQualityVerified: false }));
