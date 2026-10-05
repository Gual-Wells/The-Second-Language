// User-requested learning flows, including one answer/review cycle and first-use audio.
// Estimates are planning ranges, not execution limits or provider bills.
export const quotaEstimateVersion = 'learning-flow-v1';
export const quotaAssumptions = Object.freeze({
  kokoroUsdPerCharacter: 0.62 / 1e6,
  whisperNeuronsPerMinute: 46.63,
  dailyCharacters: [0, 60000],
  listeningFullCharacters: [20000, 40000], listeningMiniCharacters: [15000, 30000],
  listeningFullMinutes: [27, 33], listeningMiniMinutes: [16, 20],
  examinerCharacters: [1500, 5000], examinerMinutes: [3, 5],
  answerMinutes: [8, 14], answerRecordings: [10, 18],
  promptTokensPerRecording: [1500, 5000], outputTokensPerModel: [600, 12288],
  // GPT audio: observed 767 audio tokens / 76.796 s; Gemini: 1920 / 76.796 s.
  audioTokensPerMinute: {gpt: 600, gemini: 1500, qwenPlanningAllowance: 750},
  tokenUsd: {gptInput: 2.5e-6, gptOutput: 10e-6, gptAudio: 32e-6,
    geminiInput: .75e-6, geminiOutput: 3.75e-6, geminiAudio: .75e-6,
    qwenInput: .15e-6, qwenOutput: .47e-6},
  supplementalUsd: [0, .444], targetedTencentCalls: [0, 20],
});
const zero = () => [0, 0];
const scale = (range, rate) => range.map(n => n * rate);
const sum = (...ranges) => [0, 1].map(i => ranges.reduce((n, r) => n + r[i], 0));
const a = quotaAssumptions, p = a.tokenUsd;
const speakingAnalysis = [0, 1].map(i =>
  a.answerMinutes[i] * (a.audioTokensPerMinute.gpt * p.gptAudio
    + a.audioTokensPerMinute.gemini * p.geminiAudio + a.audioTokensPerMinute.qwenPlanningAllowance * p.qwenInput)
  + a.answerRecordings[i] * (a.promptTokensPerRecording[i] * (p.gptInput + p.geminiInput + p.qwenInput)
    + a.outputTokensPerModel[i] * (p.gptOutput + p.geminiOutput + p.qwenOutput))
  + a.supplementalUsd[i]);
const components = {
  daily: {openrouter: scale(a.dailyCharacters, a.kokoroUsdPerCharacter), cloudflare: zero(), tencent: zero()},
  fullListening: {openrouter: scale(a.listeningFullCharacters, a.kokoroUsdPerCharacter), cloudflare: scale(a.listeningFullMinutes, a.whisperNeuronsPerMinute), tencent: zero()},
  miniListening: {openrouter: scale(a.listeningMiniCharacters, a.kokoroUsdPerCharacter), cloudflare: scale(a.listeningMiniMinutes, a.whisperNeuronsPerMinute), tencent: zero()},
  speaking: {openrouter: sum(speakingAnalysis, scale(a.examinerCharacters, a.kokoroUsdPerCharacter)),
    cloudflare: scale(sum(a.answerMinutes, a.examinerMinutes), a.whisperNeuronsPerMinute), tencent: a.targetedTencentCalls},
};
const flow = (id, task, detail, ...parts) => ({id, task, detail, costs: Object.fromEntries(
  ['openrouter', 'cloudflare', 'tencent'].map(pool => [pool, sum(...parts.map(c => c[pool]))]))});
const d = components.daily, full = components.fullListening, mini = components.miniListening, s = components.speaking;
export const estimates = Object.freeze([
  flow('daily', '日课', '40 词 · 含首次点读', d),
  flow('daily-full', '日课 + 完整雅思', '四科 · 含一次作答与反馈', d, full, s),
  flow('daily-mini', '日课 + 微缩雅思', '四科 · 含一次作答与反馈', d, mini, s),
  flow('ielts-full', '完整雅思', '四科 · 含一次作答与反馈', full, s),
  flow('ielts-mini', '微缩雅思', '四科 · 含一次作答与反馈', mini, s),
  flow('review', '复习', '10–40 词 · 原文与音频优先复用', d),
  flow('content-test', '内容测试', '3 词 · 含首次点读', {openrouter: [0, 3000 * a.kokoroUsdPerCharacter], cloudflare: zero(), tencent: zero()}),
  flow('voice-test', '音色试听', '20 音色 · 词汇、短句与三种对话', {openrouter: [0, 20000 * a.kokoroUsdPerCharacter], cloudflare: [0, 40 * a.whisperNeuronsPerMinute], tencent: zero()}),
  flow('speaking-test', '口语测试', '一段 2 分钟回答 · 含分析与核对', {openrouter: [.04, .60], cloudflare: [2 * a.whisperNeuronsPerMinute, 4 * a.whisperNeuronsPerMinute], tencent: [0, 5]}),
]);
export const reserves = Object.freeze(Object.fromEntries(['openrouter', 'cloudflare', 'tencent'].map(pool => {
  const maximum = Math.max(...estimates.map(e => e.costs[pool][1]));
  return [pool, {maximum, threshold: maximum * 3,
    taskId: estimates.find(e => e.costs[pool][1] === maximum).id}];
})));
export const belowReserve = (pool, remaining) => Number.isFinite(remaining) && remaining < reserves[pool].threshold;
