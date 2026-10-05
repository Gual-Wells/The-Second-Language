import {assessTracked as assess} from './lib/tencent-quota-ledger.mjs';
import {finishTaskBalances} from './check-balances.mjs';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { pcmFromWav, normalize } from './lib/speaking/tencent-soe.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2), filename = args[0];
const argument = name => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : null; };
const dryRun = args.includes('--dry-run');
const cache = path.join(root, '.cache', 'speaking');
const configFile = path.resolve(argument('--config') || path.join(root, '.cache', 'speaking-provider.json'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function convert(input, output, executable) {
  if (!executable) throw new Error('M4A 等格式需要本机 ffmpeg；请配置 ffmpegPath，或先转为 16kHz 单声道 PCM WAV。');
  await new Promise((resolve, reject) => {
    const child = spawn(executable, ['-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-i', input, '-vn', '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', output], { windowsHide: true, stdio: 'ignore' });
    child.on('error', () => reject(new Error('无法启动本机 ffmpeg，请核对路径。')));
    child.on('exit', code => code === 0 ? resolve() : reject(new Error('音频转换失败，原声文件保持不变。')));
  });
}
try {
  if (!filename || filename.startsWith('--')) throw new Error('用法：node scripts/speaking-assess.mjs 音频文件 [--config 本机配置.json] [--dry-run]');
  let config; try { config = JSON.parse(await readFile(configFile, 'utf8')); } catch { throw new Error(`请先填写本机配置文件：${configFile}`); }
  if (config.provider !== 'tencent-soe-n') throw new Error('当前已实现 tencent-soe-n；其他提供商需要各自适配器，不能只改名称。');
  const input = path.resolve(filename), inputStat = await stat(input);
  if (!inputStat.isFile() || inputStat.size > 32 * 1024 * 1024) throw new Error('请输入不超过 32MB 的音频文件。');
  const original = await readFile(input), originalDigest = hash(original);
  await mkdir(cache, { recursive: true });
  let wav = original;
  if (original.toString('ascii', 0, 4) !== 'RIFF' || original.toString('ascii', 8, 12) !== 'WAVE') {
    const converted = path.join(cache, `${originalDigest}.wav`);
    await convert(input, converted, config.ffmpegPath || process.env.FFMPEG_PATH); wav = await readFile(converted);
  }
  const { pcm, seconds } = pcmFromWav(wav);
  const audio = { originalSha256: originalDigest, assessedPcmSha256: hash(pcm), seconds, sampleRate: 16000, channels: 1, bitsPerSample: 16 };
  if (dryRun) {
    console.log(JSON.stringify({ status: 'prepared-only', provider: config.provider, ...audio, credentialsPresent: !!config.appId && !!config.secretId && !!config.secretKey, assessmentCalled: false, productionWrites: false }, null, 2));
  } else {
    const complete = path.join(cache, `${originalDigest}-tencent-soe-n.json`);
    try { await stat(complete); throw new Error('这份原声已有本地结果；需要再次评测时请先另存旧结果，避免重复扣费和覆盖。'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    console.log('提交腾讯新版自由说评测；按录音时长传输，原声与结果只保存在本机。');
    const packets = await assess(config, pcm, { onProgress: value => console.log(`已传输 ${Math.round(value.secondsSent)}/${Math.round(value.secondsTotal)} 秒`) });
    const rawPath = path.join(cache, `${originalDigest}-tencent-soe-n-raw-${Date.now()}.json`);
    await writeFile(rawPath, JSON.stringify({ audio, packets }, null, 2));
    const result = normalize(packets, { audio, scoreCoeff: Number(config.scoreCoeff ?? 4) });
    await writeFile(complete, JSON.stringify(result, null, 2), { flag: 'wx' });
    console.log(JSON.stringify({ status: 'assessed', provider: result.provider, seconds, wordCount: result.words.length, scores: result.scores, acousticEvidence: result.quality.acousticEvidence, teachingReady: result.quality.teachingReady, resultFile: complete, ieltsBand: null, productionWrites: false }, null, 2));
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }

await finishTaskBalances();
