export const trialId='voice-lab-20261004';
export const budget={exchange:7,lightCharacters:100000,fullCharacters:[600000,1200000],date:'2026-10-04'};
export const models=[
 {id:'kokoro',label:'Kokoro 82M',model:'hexgrad/kokoro-82m',rates:[0.62,4],note:'全部美式英语音色；男女音色同一计价口径。',source:'https://openrouter.ai/hexgrad/kokoro-82m'},
];
export const voices=[
 {id:'heart',modelId:'kokoro',voice:'af_heart',label:'Heart',gender:'female',accent:'美式',default:true},
 {id:'bella',modelId:'kokoro',voice:'af_bella',label:'Bella',gender:'female',accent:'美式'},
 {id:'michael',modelId:'kokoro',voice:'am_michael',label:'Michael',gender:'male',accent:'美式',default:true},
 {id:'puck',modelId:'kokoro',voice:'am_puck',label:'Puck',gender:'male',accent:'美式'},
 ...[
  ['af_alloy','Alloy'],['af_aoede','Aoede'],['af_jessica','Jessica'],['af_kore','Kore'],['af_nicole','Nicole'],['af_nova','Nova'],['af_river','River'],['af_sarah','Sarah'],['af_sky','Sky'],
  ['am_adam','Adam'],['am_echo','Echo'],['am_eric','Eric'],['am_fenrir','Fenrir'],['am_liam','Liam'],['am_onyx','Onyx'],['am_santa','Santa'],
 ].map(([voice,label])=>({id:voice.replace('_','-'),modelId:'kokoro',voice,label,gender:voice[1]==='f'?'female':'male',accent:voice[0]==='a'?'美式':'英式'})),
];
export const words=[
 {id:'analysis',text:'analysis',hint:'多音节词与重音'},
 {id:'schedule',text:'schedule',hint:'英美读法均可，听清音节'},
 {id:'record',text:'record',hint:'单独词可能采用一种读音；句子页检验名词与动词的区分'},
];
export const sentences=[
 {id:'record-context',text:'I keep a record of my progress and record one short answer each day.',hint:'前一个 record 是名词，后一个是动词。'},
 {id:'numbers',text:'The project starts on Thursday, and the fee is fifteen dollars, not fifty.',hint:'留意 Thursday、十五与五十，以及否定。'},
];
export const scenes=[
 {id:'booking',title:'日常预约',description:'电话订餐：确认人数并纠正时间。',femaleRole:'来电者',maleRole:'接待员',turns:[
  {gender:'female',text:'Hi, could I book a table for Friday evening?'},
  {gender:'male',text:'Of course. Is that for six people at seven?'},
  {gender:'female',text:'Six people, yes, but half past seven, please.'},
  {gender:'male',text:"Right, seven thirty. I'll put you down for Friday."},
 ]},
 {id:'seminar',title:'学术讨论',description:'研究伙伴：评估证据，承认局限并商量下一步。',femaleRole:'研究伙伴 A',maleRole:'研究伙伴 B',turns:[
  {gender:'female',text:'Our results look promising, but the sample is quite small.'},
  {gender:'male',text:'True. We should compare the two groups before making a claim.'},
  {gender:'female',text:'Would another week of observations make the conclusion more reliable?'},
  {gender:'male',text:"Probably. Let's explain the limitation and collect more data."},
 ]},
 {id:'interview',title:'雅思问答',description:'考官提问与考生回答：自然、清楚、克制。',femaleRole:'考官',maleRole:'考生',turns:[
  {gender:'female',text:'Do you prefer studying alone or with other people?'},
  {gender:'male',text:'Usually alone, because I can work at my own pace.'},
  {gender:'female',text:'Why do you sometimes choose to study with others?'},
  {gender:'male',text:"When a problem is difficult, discussing it helps me notice things I've missed."},
 ]},
];
export const assets=voices.flatMap(v=>[
 ...words.map(w=>({id:`${v.id}-word-${w.id}`,voiceId:v.id,category:'words',text:w.text})),
 ...sentences.map(s=>({id:`${v.id}-sentence-${s.id}`,voiceId:v.id,category:'sentences',text:s.text})),
 ...scenes.flatMap(s=>s.turns.flatMap((t,i)=>t.gender===v.gender?[{id:`${v.id}-scene-${s.id}-${i+1}`,voiceId:v.id,category:'dialogue',sceneId:s.id,turn:i+1,text:t.text}]:[])),
]);
export function monthlyPrice(model,characters){
 const [low,high]=Array.isArray(characters)?characters:[characters,characters];
 const format=n=>Number(n.toFixed(2)).toLocaleString('zh-CN',{maximumFractionDigits:2});
 const a=model.rates[0]*low/1e6*budget.exchange,b=model.rates[1]*high/1e6*budget.exchange;
 return a===b?`¥${format(a)}/月`:`¥${format(a)}–${format(b)}/月`;
}
export const voiceById=new Map(voices.map(v=>[v.id,v]));
export const assetById=new Map(assets.map(a=>[a.id,a]));
export function feedbackIdentity(key){
 const [kind,a,b,c]=String(key).split('.');
 if((kind==='words'||kind==='sentences')&&voiceById.has(a)&&b===undefined)return{kind,voiceId:a};
 if(kind==='dialogue'&&scenes.some(s=>s.id===a)&&voiceById.get(b)?.gender==='female'&&voiceById.get(c)?.gender==='male'&&String(key).split('.').length===4)return{kind,sceneId:a,femaleVoiceId:b,maleVoiceId:c};
 return null;
}
