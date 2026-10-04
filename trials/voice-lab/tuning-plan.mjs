import {voices,assets} from './plan.mjs';
export const tuningVoices=voices.filter(v=>['am-fenrir','michael','am-liam'].includes(v.id));
export const profiles=[
 {id:'original',label:'原版',description:'上次试听的版本，仅统一过响度。'},
 {id:'clear',label:'清晰',description:'轻减低频浑浊，温和提升辅音存在感，保留语速与音高。'},
 {id:'pace',label:'自然节奏',description:'清晰处理，并小幅加快；保留音高，不删除句中停顿。'},
 {id:'light',label:'明亮',description:'自然节奏基础上升高一个半音，保留声道共振特征。'},
 {id:'clean',label:'轻降噪',description:'自然节奏基础上轻度降噪；请留意是否损伤字音或变水声。'},
];
export const tempoByVoice={'am-fenrir':1.08,michael:1.10,'am-liam':1.04};
export const tuningSources=assets.filter(a=>tuningVoices.some(v=>v.id===a.voiceId)&&a.category!=='dialogue');
export const tuningAssets=tuningSources.flatMap(a=>profiles.map(p=>({...a,id:`tune-${a.id}-${p.id}`,sourceId:a.id,profileId:p.id})));
export const tuningAssetById=new Map(tuningAssets.map(a=>[a.id,a]));
export function tuningFeedbackIdentity(key){
 const [kind,category,voiceId,profileId,...rest]=String(key).split('.');
 return kind==='tuning'&&['words','sentences'].includes(category)&&tuningVoices.some(v=>v.id===voiceId)&&profiles.some(p=>p.id===profileId)&&!rest.length?{kind,category,voiceId,profileId}:null;
}
export function filterFor(voiceId,profileId){
 if(profileId==='original')return 'anull';
 const filters=['highpass=f=65','equalizer=f=220:t=q:w=0.8:g=-2.5','equalizer=f=2700:t=q:w=0.7:g=1.5'];
 if(profileId==='clean')filters.push('afftdn=nr=3:nf=-55');
 if(['pace','light','clean'].includes(profileId))filters.push(`rubberband=tempo=${tempoByVoice[voiceId]}:pitch=${profileId==='light'?Math.pow(2,1/12).toFixed(9):1}:formant=preserved:pitchq=quality`);
 return filters.join(',');
}
