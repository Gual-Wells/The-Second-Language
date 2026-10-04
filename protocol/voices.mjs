export const voicePolicyVersion='kokoro-owner-20261004-v2';
export const ttsModel='hexgrad/kokoro-82m';
export const defaultVoice='af_bella';
export const listeningVoices={
 female:['af_alloy','af_aoede','af_bella','af_heart','af_jessica','af_kore','af_nova','af_sarah','af_sky'],
 male:['am_eric','am_michael','am_liam','am_puck','am_fenrir'],
};
export const isListeningVoice=voice=>Object.values(listeningVoices).some(pool=>pool.includes(voice));
export function synthesisVoice(purpose,voice){
 if(purpose==='listening'){
  if(!isListeningVoice(voice))throw Error('听力须先按人物分配已授权的 Kokoro 音色');
  return voice;
 }
 return defaultVoice;
}
function hash(s){let n=2166136261;for(const c of s){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return n>>>0;}
// The entire script is available before synthesis. Assign whole roles, not turns.
export function castAudioPlan(plan){
 if(!Array.isArray(plan.segments)||!plan.setId)throw Error('声音计划缺少 setId 或 segments');
 const roles=new Map();
 for(const segment of plan.segments){
  if(segment.purpose!=='listening'){segment.voice=defaultVoice;continue;}
  if(typeof segment.speakerId!=='string'||!/^[A-Za-z0-9._:-]{1,110}$/.test(segment.speakerId)||!listeningVoices[segment.gender])throw Error(`听力片段 ${segment.id} 需要稳定 speakerId 和 female/male gender`);
  if(typeof segment.text!=='string'||!segment.text.trim())throw Error('听力片段文本为空');
  const role=roles.get(segment.speakerId)||{speakerId:segment.speakerId,gender:segment.gender,weight:0};
  if(role.gender!==segment.gender)throw Error('同一人物的性别标注冲突');
  role.weight+=segment.text.length;roles.set(segment.speakerId,role);
 }
 const sceneRoles=new Map(),addScene=(scene,speaker)=>{if(!sceneRoles.has(scene))sceneRoles.set(scene,new Set());sceneRoles.get(scene).add(speaker);};
 for(const segment of plan.segments)if(segment.purpose==='listening'&&segment.sceneId)addScene(segment.sceneId,segment.speakerId);
 for(const assembly of plan.assemblies||[])for(const entry of assembly.segments||[]){const s=plan.segments.find(s=>s.id===entry.id);if(s?.purpose==='listening')addScene(assembly.id,s.speakerId);}
 for(const segment of plan.segments)if(segment.purpose==='listening'&&![...sceneRoles.values()].some(s=>s.has(segment.speakerId)))throw Error(`听力片段 ${segment.id} 须属于明确场景或组装段落`);
 const shareScene=(a,b)=>[...sceneRoles.values()].some(s=>s.has(a)&&s.has(b));
 let assignment;
 if(plan.voiceAllocation){
  if(plan.voiceAllocation.version!==voicePolicyVersion)throw Error('声音计划版本已固定；新声音策略需要新计划与资产编号');
  assignment=plan.voiceAllocation.roles;
  if(!Array.isArray(assignment)||assignment.length!==roles.size||new Set(assignment.map(r=>r.speakerId)).size!==roles.size)throw Error('人物音色清单与材料不一致');
  for(const role of roles.values()){
   const assigned=assignment.find(r=>r.speakerId===role.speakerId);
   if(!assigned||assigned.gender!==role.gender||!listeningVoices[role.gender].includes(assigned.voice)||assigned.weight!==role.weight)throw Error('已冻结人物或文本改变；请建立新版本');
  }
 }else{
  const usage=Object.fromEntries(Object.values(listeningVoices).flat().map(v=>[v,0]));assignment=[];
  // Longest roles first, then seeded random tie-breaking. Balance within each gender.
  for(const role of [...roles.values()].sort((a,b)=>b.weight-a.weight||hash(plan.setId+a.speakerId)-hash(plan.setId+b.speakerId))){
   const occupied=assignment.filter(r=>shareScene(role.speakerId,r.speakerId)).map(r=>r.voice);
   const voice=listeningVoices[role.gender].filter(v=>!occupied.includes(v)).sort((a,b)=>usage[a]-usage[b]||hash(`${plan.setId}:${role.speakerId}:${a}`)-hash(`${plan.setId}:${role.speakerId}:${b}`))[0];
   if(!voice)throw Error('同场人物没有足够可区分音色，请核对场景人物而非改变人物性别');
   usage[voice]+=role.weight;assignment.push({...role,voice});
  }
  plan.voiceAllocation={version:voicePolicyVersion,seed:plan.setId,roles:assignment,usage,weightUnit:'text-characters'};
 }
 for(const [i,a]of assignment.entries())for(const b of assignment.slice(i+1))if(a.voice===b.voice&&shareScene(a.speakerId,b.speakerId))throw Error('同场不同人物不能共用音色');
 for(const segment of plan.segments)if(segment.purpose==='listening')segment.voice=assignment.find(r=>r.speakerId===segment.speakerId).voice;
 return plan;
}
