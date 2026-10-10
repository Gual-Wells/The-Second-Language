// User-requested learning flows, including one answer/review cycle and first-use audio.
// Estimates are planning ranges, not execution limits or provider bills.
export const quotaEstimateVersion = 'learning-flow-v3-chapter-oral7';
export const quotaAssumptions = Object.freeze({
  kokoroUsdPerCharacter: 0.62 / 1e6,
  whisperNeuronsPerMinute: 46.63,
  dailyCharacters: [0, 60000],
  listeningFullCharacters: [20000, 40000], listeningMiniCharacters: [15000, 30000],
  listeningFullMinutes: [27, 33], listeningMiniMinutes: [16, 20],
  examinerCharacters: [1500, 5000],
  // Cost scenarios, NOT official IELTS counts, content requirements or runtime caps.
  speakingScenarios: [{recordings:14,answerMinutes:7,examinerMinutes:3},
    {recordings:18,answerMinutes:8.5,examinerMinutes:3.5},
    {recordings:22,answerMinutes:10,examinerMinutes:3}],
  // Actual billed totals, including audio, text, reasoning and report output.
  gptCostCurve: [[15,.0091675],[40,.0196275],[76.796,.0335215]],
  geminiCostCurve: [[15,.00849525],[40,.0094965],[76.796,.01197525]],
  qwenUsdPerRecording: [.00563925,.011641302],
  // Empirical variation allowance, not statistical confidence or a guaranteed bound.
  speakingVariation: [.8,1.25], longTurnSeconds:120,
  extraQwenListens:4,extraGptListenSeconds:120,
  targetedTencentCalls: [0, 20],
});
const zero = () => [0, 0];
const scale = (range, rate) => range.map(n => n * rate);
const sum = (...ranges) => [0, 1].map(i => ranges.reduce((n, r) => n + r[i], 0));
const a = quotaAssumptions;
export function interpolatedCallCost(curve,seconds){
  if(!Number.isFinite(seconds)||seconds<=0)throw Error('需要真实录音秒数');
  const index=seconds<=curve[1][0]?0:1,[[x0,y0],[x1,y1]]=curve.slice(index,index+2);
  return Math.max(0,y0+(seconds-x0)*(y1-y0)/(x1-x0));
}
// Pass actual answer durations when available. No fixed recording count is imposed.
export function speakingCostFor(durations){
  if(!Array.isArray(durations)||!durations.length||durations.some(s=>!Number.isFinite(s)||s<=0))throw Error('需要完整回答的时长列表');
  const gpt=durations.reduce((v,s)=>v+interpolatedCallCost(a.gptCostCurve,s),0);
  const gemini=durations.reduce((v,s)=>v+interpolatedCallCost(a.geminiCostCurve,s),0);
  const qwen=scale(a.qwenUsdPerRecording,durations.length);
  const baseline=qwen.map(v=>v+gpt+gemini);
  // Allow one extra Qwen pass per answer if collection fails, plus focused listens.
  // This is a reserve allowance; it does not schedule calls or constrain evidence work.
  const supplement=(durations.length+a.extraQwenListens)*a.qwenUsdPerRecording[1]
    +interpolatedCallCost(a.gptCostCurve,a.extraGptListenSeconds);
  return {gpt,gemini,qwen,baseline,
    planning:[baseline[0]*a.speakingVariation[0],baseline[1]*a.speakingVariation[1]+supplement]};
}
export const speakingScenarios=a.speakingScenarios.map(s=>{
  const short=(s.answerMinutes*60-a.longTurnSeconds)/(s.recordings-1);
  return {...s,...speakingCostFor([a.longTurnSeconds,...Array(s.recordings-1).fill(short)])};
});
const speakingAnalysis=[Math.min(...speakingScenarios.map(s=>s.planning[0])),Math.max(...speakingScenarios.map(s=>s.planning[1]))];
const speakingAudioMinutes=[Math.min(...a.speakingScenarios.map(s=>s.answerMinutes+s.examinerMinutes)),Math.max(...a.speakingScenarios.map(s=>s.answerMinutes+s.examinerMinutes))];
const components = {
  daily: {openrouter: scale(a.dailyCharacters, a.kokoroUsdPerCharacter), cloudflare: zero(), tencent: zero()},
  fullListening: {openrouter: scale(a.listeningFullCharacters, a.kokoroUsdPerCharacter), cloudflare: scale(a.listeningFullMinutes, a.whisperNeuronsPerMinute), tencent: zero()},
  miniListening: {openrouter: scale(a.listeningMiniCharacters, a.kokoroUsdPerCharacter), cloudflare: scale(a.listeningMiniMinutes, a.whisperNeuronsPerMinute), tencent: zero()},
  speaking: {openrouter: sum(speakingAnalysis, scale(a.examinerCharacters, a.kokoroUsdPerCharacter)),
    cloudflare: scale(speakingAudioMinutes, a.whisperNeuronsPerMinute), tencent: a.targetedTencentCalls},
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
  // Seven prompts (up to 650 characters each); allow one Qwen clarification per answer.
  // 18 audio minutes is a planning reserve for prompts + answers, not a runtime bound.
  // Cached prompts and silent answers can consume no fresh inference quota.
  flow('chapter-test', '章节测试', '20 题 · 7 道听说 · 含题目音频及一次作答', {openrouter:[0,4550*a.kokoroUsdPerCharacter+7*a.qwenUsdPerRecording[1]],cloudflare:[0,18*a.whisperNeuronsPerMinute],tencent:zero()}),
  flow('voice-test', '音色试听', '20 音色 · 词汇、短句与三种对话', {openrouter: [0, 20000 * a.kokoroUsdPerCharacter], cloudflare: [0, 40 * a.whisperNeuronsPerMinute], tencent: zero()}),
  flow('speaking-test', '口语测试', '一段 2 分钟回答 · 含分析与核对', {openrouter: speakingCostFor([120]).planning, cloudflare: [2 * a.whisperNeuronsPerMinute, 4 * a.whisperNeuronsPerMinute], tencent: [0, 5]}),
]);
export const reserves = Object.freeze(Object.fromEntries(['openrouter', 'cloudflare', 'tencent'].map(pool => {
  const maximum = Math.max(...estimates.map(e => e.costs[pool][1]));
  return [pool, {maximum, threshold: maximum * 3,
    taskId: estimates.find(e => e.costs[pool][1] === maximum).id}];
})));
export const belowReserve = (pool, remaining) => Number.isFinite(remaining) && remaining < reserves[pool].threshold;
