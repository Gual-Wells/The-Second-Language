const storageKey='tsl-daily-voices-20261004';
let saved;try{saved=JSON.parse(localStorage.getItem(storageKey)||'null');}catch{}
const sessionId=saved?.sessionId||crypto.randomUUID();
const votes=saved?.votes||{},listened=new Set(saved?.listened||[]);
let manifest,current,submissionId,revision=0;
const $=s=>document.querySelector(s),status=message=>{$('#status').textContent=message;};
function persist(){try{localStorage.setItem(storageKey,JSON.stringify({sessionId,votes,listened:[...listened]}));}catch{}}
function change(){revision++;submissionId=null;persist();$('#save').disabled=!Object.values(votes).some(v=>v.ratings?.overall);status('评分已保存在本机，点提交即可发送。');}
async function api(path,options={}){const r=await fetch(path,{credentials:'same-origin',...options});let body;try{body=await r.json();}catch{throw Error('服务暂时没有响应，请稍后重试。');}if(!r.ok)throw Error(body.error||'请求失败');return body;}
function stop(){if(current){current.audio.pause();current.button.textContent='播放短句';current=null;}}
function button(text,handler,className='bevel'){const b=document.createElement('button');b.type='button';b.className=className;b.textContent=text;b.addEventListener('click',handler);return b;}
function render(){
 const root=$('#voices');root.replaceChildren();
 for(const voice of manifest.voices){
  const entry=votes[voice.id]??={id:voice.id,ratings:{overall:null},qualified:null,notes:''};
  const card=document.createElement('section');card.className='voice-card';card.dataset.voice=voice.id;
  const head=document.createElement('div');head.className='voice-head';
  const title=document.createElement('h2');title.textContent=voice.label;head.append(title);card.append(head);
  const prices=document.createElement('div');prices.className='prices';
  const accent=document.createElement('p');accent.className='accent';accent.textContent=voice.accent;prices.append(accent);
  const light=document.createElement('p');light.textContent=`按需点读：${voice.lightPrice}`;prices.append(light);
  const full=document.createElement('p');full.textContent=`整章配音：${voice.fullPrice}`;prices.append(full);
  const note=document.createElement('p');note.className='hint';note.textContent=voice.note;prices.append(note);
  const source=document.createElement('a');source.href=voice.source;source.target='_blank';source.rel='noopener';source.textContent='官方价格';prices.append(source);card.append(prices);
  const id=`${voice.id}-short`,audio=new Audio(`/api/audio/${id}`);audio.preload='none';
  const play=button('播放短句',async()=>{
   if(current?.audio===audio){stop();return;}stop();current={audio,button:play};play.textContent='停止';
   try{await audio.play();listened.add(id);persist();}catch{if(current?.audio===audio)stop();status('播放失败，请点按重试。');}
  });play.setAttribute('aria-label',`播放 ${voice.label}`);play.disabled=!voice.ready;
  audio.addEventListener('ended',()=>{if(current?.audio===audio)stop();});
  audio.addEventListener('error',()=>{if(current?.audio===audio)stop();status('音频未载入，请检查网络后重试。');});
  const playback=document.createElement('div');playback.className='playback';playback.append(play);card.append(playback);
  if(!voice.ready){const unavailable=document.createElement('p');unavailable.className='hint';unavailable.textContent='本次未取得可播放音频，不参与评分。';card.append(unavailable);root.append(card);continue;}
  const row=document.createElement('div');row.className='rating-row';const label=document.createElement('span');label.textContent='听感';row.append(label);
  const scores=document.createElement('div');scores.className='score';scores.setAttribute('role','group');scores.setAttribute('aria-label',`${voice.label} 听感评分`);
  for(let n=1;n<=5;n++){const b=button(String(n),()=>{entry.ratings.overall=entry.ratings.overall===n?null:n;for(const s of scores.children)s.setAttribute('aria-pressed',String(Number(s.textContent)===entry.ratings.overall));change();},'');b.setAttribute('aria-pressed',String(entry.ratings.overall===n));scores.append(b);}row.append(scores);card.append(row);
  const choice=document.createElement('div');choice.className='choice-row qualification';
  for(const [text,value] of [['日常使用合格',true],['不合格',false]]){const b=button(text,()=>{entry.qualified=entry.qualified===value?null:value;for(const child of choice.children)child.setAttribute('aria-pressed',String(child.dataset.value===String(entry.qualified)));change();},'');b.dataset.value=String(value);b.setAttribute('aria-pressed',String(entry.qualified===value));choice.append(b);}card.append(choice);
  const notes=document.createElement('textarea');notes.className='notes';notes.rows=2;notes.maxLength=2000;notes.placeholder='可选备注';notes.setAttribute('aria-label',`${voice.label} 备注`);notes.value=entry.notes;notes.addEventListener('input',()=>{entry.notes=notes.value;change();});card.append(notes);root.append(card);
 }
 $('#save').disabled=!Object.values(votes).some(v=>v.ratings?.overall);
}
$('#save').addEventListener('click',async()=>{
 const sentRevision=revision;submissionId??=crypto.randomUUID();const button=$('#save');button.disabled=true;status('正在提交…');
 try{const result=await api('/api/feedback',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({trialId:manifest.trialId,sessionId,submissionId,voices:Object.values(votes).filter(v=>manifest.voices.some(m=>m.id===v.id&&m.ready)),listened:[...listened]})});status(sentRevision===revision?'评分已提交，我可以读取。':'评分已提交；刚修改的内容可再次提交。');persist();if(sentRevision!==revision)button.disabled=false;}catch(e){status(e.message);button.disabled=false;}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);
document.addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});
try{
 const token=new URLSearchParams(location.hash.slice(1)).get('access');if(token){await api('/api/access',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({token})});history.replaceState(null,'',location.pathname);}
 manifest=await api('/api/manifest');render();status('点播放试听，然后选择评分。');
}catch(e){status(e.message);}
