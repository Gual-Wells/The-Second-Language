const storageKey='tsl-kokoro-male-tuning-20261004';
let saved;try{saved=JSON.parse(localStorage.getItem(storageKey)||'null');}catch{}
const sessionId=saved?.sessionId||crypto.randomUUID(),votes=saved?.votes||{},listened=new Set(saved?.listened||[]),buffers=new Map();
let voiceId=saved?.voiceId||'am-fenrir',profileId=saved?.profileId||'clear',tab=saved?.tab||'sentences',manifest,previous=[],context,playing,serial=0,submissionId,revision=0;
const $=s=>document.querySelector(s),status=s=>{$('#status').textContent=s;};
function persist(){try{localStorage.setItem(storageKey,JSON.stringify({sessionId,votes,listened:[...listened],voiceId,profileId,tab}));}catch{status('浏览器存储不可用，请及时提交或导出评分。');}}
function count(){const n=Object.values(votes).filter(v=>v.score!=null||v.qualified!=null||v.notes).length;$('#save').disabled=!Object.values(votes).some(v=>v.score!=null);return n;}
function change(){revision++;submissionId=null;persist();status(`已在本机保存 ${count()} 项调音反馈，点提交发送。`);}
async function api(path,options={}){const r=await fetch(path,{credentials:'same-origin',...options});let b;try{b=await r.json();}catch{throw Error('服务暂未响应。');}if(!r.ok)throw Error(b.error||'请求失败');return b;}
function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function button(text,handler,cls='bevel'){const b=el('button',text,cls);b.type='button';b.onclick=handler;return b;}
function stop(){serial++;if(playing){try{playing.source?.stop();}catch{}playing.button.textContent=playing.label;playing=null;}}
async function play(id,b,label){
 if(playing?.button===b){stop();return;}stop();const ticket=serial;
 try{
  try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch{}
  context??=new(window.AudioContext||window.webkitAudioContext)({latencyHint:'playback'});const resumed=context.resume();playing={button:b,label};b.textContent='载入 · 点按取消';await resumed;
  if(!buffers.has(id)){const r=await fetch('/api/audio/'+id);if(!r.ok)throw Error('声音暂不可用');buffers.set(id,await context.decodeAudioData(await r.arrayBuffer()));}
  if(ticket!==serial)return;
  const source=context.createBufferSource();source.buffer=buffers.get(id);source.connect(context.destination);playing.source=source;source.onended=()=>{if(ticket===serial)stop();};b.textContent='停止';source.start();listened.add(id);persist();status('正在播放；可随时点另一版本切换。');
 }catch(e){if(ticket===serial){stop();status(e.message||'播放失败');}}
}
function select(list,current,handler,label){const s=el('select');s.setAttribute('aria-label',label);for(const x of list){const o=el('option',x.label);o.value=x.id;s.append(o);}s.value=current;s.onchange=()=>{stop();handler(s.value);persist();render();};return s;}
function rating(key,title){
 const r=votes[key]??={key,score:null,qualified:null,notes:''},box=el('div',undefined,'rating');box.dataset.rating=key;box.append(el('p',`${title} · 1 可弃用，3 可用，5 很满意`,'rating-title'));
 const scores=el('div',undefined,'scores');scores.setAttribute('aria-label',`${title}评分`);for(let n=1;n<=5;n++){const b=button(String(n),()=>{r.score=r.score===n?null:n;for(const x of scores.children)x.setAttribute('aria-pressed',String(Number(x.textContent)===r.score));change();},'');b.setAttribute('aria-pressed',String(n===r.score));scores.append(b);}box.append(scores);
 const q=el('div',undefined,'qualified');for(const [name,value]of[['用途合格',true],['不合格',false]]){const b=button(name,()=>{r.qualified=r.qualified===value?null:value;for(const x of q.children)x.setAttribute('aria-pressed',String(x.dataset.value===String(r.qualified)));change();});b.dataset.value=String(value);b.setAttribute('aria-pressed',String(r.qualified===value));q.append(b);}box.append(q);
 const notes=el('textarea',undefined,'notes');notes.rows=2;notes.maxLength=2000;notes.setAttribute('aria-label',`${title}评语`);notes.placeholder='相比原版更好或更差在哪？是否仍有卡痰、低沉、慢的感觉？';notes.value=r.notes;notes.oninput=()=>{r.notes=notes.value;change();};box.append(notes);return box;
}
function render(){
 const v=manifest.voices.find(v=>v.id===voiceId),p=manifest.profiles.find(p=>p.id===profileId),card=el('section',undefined,'card'),body=el('div',undefined,'body');card.append(el('h2','选择男声与处理版本'));
 const vl=el('label','男声');vl.append(select(manifest.voices,voiceId,id=>voiceId=id,'选择男声'));const pl=el('label','处理版本');pl.append(select(manifest.profiles,profileId,id=>profileId=id,'选择处理版本'));body.append(vl,pl,el('p',p.description,'hint'));
 if(['pace','light','clean'].includes(profileId))body.append(el('p',`${v.label} 语速加快 ${Math.round((manifest.tempoByVoice[voiceId]-1)*100)}%，${profileId==='light'?'音高提升一个半音':'音高不变'}。`,'hint'));
 const old=previous.find(r=>r.key===`${tab}.${voiceId}`);if(old)body.append(el('p',`你的原版评价：${old.score==null?'未评分':old.score+' 分'}${old.qualified===false?' · 不合格':''}。${old.notes||''}`,'hint'));
 for(const s of manifest[tab]){
  const sample=el('div',undefined,'sample');sample.append(el('p',s.text),el('p',s.hint,'hint'));const pair=el('div',undefined,'qualified'),source=`${voiceId}-${tab==='words'?'word':'sentence'}-${s.id}`;
  const a=button('原版',()=>play(`tune-${source}-original`,a,'原版'));pair.append(a);
  if(profileId!=='original'){const b=button(p.label,()=>play(`tune-${source}-${profileId}`,b,p.label),'bevel primary');pair.append(b);}sample.append(pair);body.append(sample);
 }
 body.append(rating(`tuning.${tab}.${voiceId}.${profileId}`,`${v.label} · ${p.label} · ${tab==='words'?'词汇':'句子'}`),el('p','处理版与原版的评分独立保存，词汇和句子分别评价。','count'));card.append(body);$('#content').replaceChildren(card);
 for(const b of document.querySelectorAll('[data-tab]'))b.setAttribute('aria-pressed',String(b.dataset.tab===tab));count();
}
function payload(){return{trialId:manifest.trialId,sessionId,submissionId:submissionId??=crypto.randomUUID(),ratings:Object.values(votes).filter(v=>v.score!=null||v.qualified!=null||v.notes),listened:[...listened]};}
$('#save').onclick=async()=>{const b=$('#save'),before=revision;try{b.disabled=true;status('正在提交…');const result=await api('/api/feedback',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload())});status(before===revision?`评分已提交：${result.receipt.slice(0,8)}`:'旧评分已提交，新改动仍保存在本机，请再提交。');}catch(e){status(e.message+' 本机评分仍保留，可导出。');}finally{count();}};
$('#export').onclick=()=>{if(!manifest)return;const url=URL.createObjectURL(new Blob([JSON.stringify(payload(),null,2)],{type:'application/json'})),a=el('a');a.href=url;a.download='kokoro-male-tuning-feedback.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status('评分备份已导出。');};
for(const b of document.querySelectorAll('[data-tab]'))b.onclick=()=>{stop();tab=b.dataset.tab;persist();render();};
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
async function start(){try{
 const token=new URLSearchParams(location.hash.slice(1)).get('access');if(token){await api('/api/access',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({token})});history.replaceState(null,'',location.pathname);}
 manifest=await api('/api/tuning-manifest');
 if(!manifest.voices.some(v=>v.id===voiceId))voiceId='am-fenrir';if(!manifest.profiles.some(p=>p.id===profileId))profileId='clear';if(!['words','sentences'].includes(tab))tab='sentences';
 try{const recovery=await api('/api/feedback-recovery');previous=recovery.ratings;for(const r of previous.filter(r=>r.kind==='tuning')){const local=votes[r.key];votes[r.key]={key:r.key,score:local?.score??r.score,qualified:local?.qualified??r.qualified,notes:local?.notes||r.notes};}}catch{status('原版评分暂未取回；可以照常试听。');}
 persist();render();status(`已准备三种男声、五种版本。现有 ${count()} 项调音反馈。`);
 }catch(e){status(e.message);}}
start();
