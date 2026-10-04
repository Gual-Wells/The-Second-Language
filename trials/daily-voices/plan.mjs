export const trialId='daily-voices-20261004';
export const samples=[{id:'short',title:'共同短句',text:'I learned to solve difficult problems by breaking them into smaller steps.'}];
export const budget={exchange:7,lightCharacters:100000,fullCharacters:[600000,1200000],date:'2026-10-04'};
// Prices are USD per million fresh English characters. Speech routing may choose
// either listed provider; the lowest endpoint price is not guaranteed.
export const voices=[
 {id:'kokoro',label:'Kokoro · Heart',model:'hexgrad/kokoro-82m',voice:'af_heart',accent:'美式女声',rates:[0.62,4],note:'替换此前低沉的 George；价格区间包含不同供应商。',source:'https://openrouter.ai/hexgrad/kokoro-82m'},
 {id:'fish',label:'Fish S2.1 Pro Free',model:'fish-audio/s2.1-pro-free:free',accent:'默认音色',rates:[0,0],note:'当前免费试用端点；有限流，不保证能覆盖整章用量或长期供给。本次不做声音克隆。',source:'https://openrouter.ai/fish-audio/s2.1-pro-free:free'},
 {id:'orpheus',label:'Orpheus · Tara',model:'canopylabs/orpheus-3b-0.1-ft',voice:'tara',accent:'美式女声',rates:[7,15],note:'价格区间包含不同供应商。试听时请留意末尾 steps 是否清楚。',source:'https://openrouter.ai/canopylabs/orpheus-3b-0.1-ft'},
 {id:'flash',label:'MAI 2.1 Flash · Harper',model:'microsoft/mai-voice-2.1-flash',voice:'en-US-Harper:MAI-Voice-2.1-Flash',accent:'美式女声',rates:[15,15],note:'微软较便宜的 Flash 版本。',source:'https://openrouter.ai/microsoft/mai-voice-2.1-flash'},
 {id:'mai',label:'MAI 2.1 · Harry',model:'microsoft/mai-voice-2.1',voice:'en-GB-Harry:MAI-Voice-2.1',accent:'英式男声',rates:[22,22],note:'上次认可的音色，作为参照。',source:'https://openrouter.ai/microsoft/mai-voice-2.1'},
 {id:'aura',label:'Aura 2 · Apollo',model:'@cf/deepgram/aura-2-en',voice:'apollo',kind:'workers-ai',accent:'美式男声',rates:[30,30],note:'上次认可的音色；标价未扣共享的每日免费额度，实际费用可能更低。',source:'https://developers.cloudflare.com/workers-ai/platform/pricing/'},
];
export function monthlyPrice(voice,characters){
 if(voice.id==='fish')return '¥0/月（可用额度内）';
 const [low,high]=Array.isArray(characters)?characters:[characters,characters];
 const format=n=>Number(n.toFixed(2)).toLocaleString('zh-CN',{maximumFractionDigits:2});
 const a=voice.rates[0]*low/1e6*budget.exchange,b=voice.rates[1]*high/1e6*budget.exchange;
 return a===b?`¥${format(a)}/月`:`¥${format(a)}–${format(b)}/月`;
}
