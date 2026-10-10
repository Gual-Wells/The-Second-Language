import {examSpec} from './exam-spec.js?v=27';
import {questionField} from './objective.js?v=27';
const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;};
export function createListening({api,toast,openSource,pauseOthers=()=>{}}){
 let active=null;
 function stop(){active?.stop();active=null;}
 function render(set){
  const passages=set.listening?.passages||[];if(!passages.length)return null;const spec=examSpec('listening',set.listening.profile||'full');
  const card=make('section','practice-question listening-paper');card.id=`practice-listening-${set.id}`;
  card.append(make('div','section-band',`听力 · ${spec.label} · 4 Parts / ${spec.total} Questions`));
  const body=make('div','practice-question-body'),toolbar=make('div','listening-toolbar'),status=make('p','practice-guidance','先阅读题面。测验按顺序播放一次；提交后可精听。'),mode=make('select','text-input');
  for(const [id,label]of [['test','测验 · 正常速度 / 一次播放'],['review','精听 · 可回听 / 查看原文']]){const o=make('option','',label);o.value=id;mode.append(o);}
  const begin=make('button','primary-button','开始听力'),pause=make('button','bevel-button','中断 / 恢复'),submit=make('button','primary-button',`提交 ${spec.total} 题`),reveal=make('button','bevel-button','查看原文与译文'),feedback=make('div','practice-attempts'),script=make('div','practice-reference');
  const audio=make('audio','listening-audio');audio.preload='none';audio.controls=false;
  const seek=make('input','listening-seek');seek.type='range';seek.min='0';seek.max='100';seek.value='0';seek.setAttribute('aria-label','精听播放位置');seek.disabled=true;
  const speed=make('select','text-input');for(const n of [1,.85,.7]){const o=make('option','',`${n}×`);o.value=n;speed.append(o);}speed.disabled=true;
  function reviewControls(){seek.hidden=speed.hidden=mode.value!=='review';}reviewControls();mode.addEventListener('change',reviewControls);toolbar.append(mode,begin,pause,seek,speed);pause.disabled=true;submit.disabled=true;reveal.disabled=true;script.hidden=true;
  body.append(toolbar,status,audio,make('p','practice-guidance','题面可见，原文与答案提交后揭示。来电或退出会保留草稿，并记录中断条件。'));
  const storage=`tsl-listening-${set.id}`;let old=null;try{old=JSON.parse(localStorage.getItem(storage)||'null');}catch{localStorage.removeItem(storage);}
  if(old&&(!['test','review'].includes(old.mode)||!old.id||typeof old.answers!=='object'||old.passage<0||old.passage>3))old=null;
  let state=old||{id:crypto.randomUUID(),mode:'test',answers:{},passage:0,position:0,interrupted:false},started=false,submitted=false,lastSave=0,finished=state.finished===true;
  mode.value=state.mode;
  const selectors=[];
  function local(){if(submitted)return;if(audio.currentSrc&&!audio.ended)state.position=audio.currentTime;localStorage.setItem(storage,JSON.stringify(state));}
  async function progress(){local();if(started&&!submitted)try{await api(`/api/practice/listening/sessions/${state.id}/progress`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({answers:state.answers,passage:state.passage,position:state.position,interrupted:state.interrupted,assisted:state.mode==='review'})});}catch{status.textContent='草稿保存在本机，联网后可继续保存。';}}
  function showAttempt(a){const box=make('div','practice-attempt');box.append(make('strong','',`${a.result.correct} / ${a.result.total} · ${a.conditions?.mode==='review'?'精听':'测验'}${a.conditions?.interrupted?' · 有中断':''}${a.conditions?.previouslyCompleted?' · 已练过材料':''}`));
   if(a.review){box.append(make('p','',a.review.summary));for(const x of a.review.priorities||[])box.append(make('p','practice-review-point',x));box.append(make('p','practice-guidance',a.review.nextStep));}
   for(const item of a.result.items){const row=make('details','listening-result');row.append(make('summary','',`${item.number}${item.total>1?`–${item.number+item.total-1}`:''} · ${item.score}/${item.total} · ${item.reason}`));row.append(make('p','practice-answer',`我的答案：${Array.isArray(item.raw)?item.raw.join(', '):item.raw||'未填写'}\n答案：${item.accepted.join(' / ')}`),make('p','practice-guidance',item.explanation));
    const listen=make('button','bevel-button','回听证据');listen.type='button';listen.onclick=async()=>{try{stop();active={stop:()=>audio.pause()};const p=(await api(`/api/practice/listening/sessions/${a.sessionId}/reveal`,{method:'POST',headers:{'content-type':'application/json'},body:'{}'})).passages.find(x=>x.id===item.passageId);const seg=p.script.find(x=>item.evidence.includes(x.id)),pub=passages.find(x=>x.id===p.id);audio.src=`/api/practice/media/${encodeURIComponent(pub.audioId)}`;await audio.play();audio.currentTime=seg.start;status.textContent='正在复听证据；本次测验成绩保持不变。';audio.onended=()=>{audio.pause();};}catch(e){toast(e.message);}};row.append(listen);box.append(row);
   }feedback.append(box);
  }
  for(const a of set.listening.attempts||[])showAttempt(a);
  for(const [index,p]of passages.entries()){
   const section=make('section','listening-part');section.id=`practice-${p.id}`;section.append(make('h3','',`Part ${index+1} · ${p.title}`),make('p','practice-guidance',p.instructions));
   const revisit=make('button','bevel-button','精听这一段');revisit.type='button';revisit.disabled=true;selectors.push(revisit);revisit.onclick=()=>{if(submitted)state.mode='review';state.passage=index;state.position=0;play().catch(e=>toast(e.message));};section.append(revisit);
   const links=make('div','practice-links');for(const link of p.links||[]){const b=make('button','bevel-button',`${link.chapterId}${link.useId?` · ${link.useId}`:''}`);b.type='button';b.onclick=()=>{document.getElementById('practiceDialog').close();openSource(link.chapterId,link.useId,set.sources.find(source=>source.id===link.chapterId)?.digest);};links.append(b);}links.hidden=true;section.append(links);
   if(p.visual){const v=p.visual,svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox',`0 0 ${v.width} ${v.height}`);svg.setAttribute('role','img');svg.setAttribute('aria-label',v.title);svg.classList.add('listening-diagram');
    const shape=(tag,attrs,text)=>{const e=document.createElementNS(svg.namespaceURI,tag);for(const [k,val]of Object.entries(attrs))e.setAttribute(k,String(val));if(text)e.textContent=text;svg.append(e);};
    for(const r of v.routes)shape('polyline',{points:r.points.map(pt=>pt.join(',')).join(' '),fill:'none',stroke:'#8b9daf','stroke-width':8});
    for(const a of v.areas){shape('rect',{x:a.x,y:a.y,width:a.width,height:a.height,fill:'#edf3f9',stroke:'#6788a5','stroke-width':2});shape('text',{x:a.x+a.width/2,y:a.y+a.height/2,'text-anchor':'middle','dominant-baseline':'middle','font-size':16,fill:'#193e62'},a.label);}
    section.append(make('p','practice-guidance',v.title),svg);
   }
   for(const q of p.questions)section.append(questionField(q,{setId:set.id,answers:state.answers,changed:local,toast}));body.append(section);
  }
  async function play(){
   if(state.finished&&state.mode==='test'&&!submitted){status.textContent='四段已播完，请检查并提交答案。';pause.disabled=true;return;}pauseOthers();stop();active={stop:()=>audio.pause()};const p=passages[state.passage];audio.src=`/api/practice/media/${encodeURIComponent(p.audioId)}`;audio.playbackRate=state.mode==='test'?1:Number(speed.value);await audio.play();if(state.position)audio.currentTime=state.position;status.textContent=`Part ${state.passage+1} / 4 · ${state.mode==='test'?'测验':'精听'}${state.interrupted?' · 中断后完成':''}`;
   audio.onended=async()=>{state.position=0;state.passage++;if(state.passage<passages.length){await progress();play().catch(e=>{state.interrupted=true;status.textContent='请点“恢复”继续下一段。';});}else{state.passage=3;state.finished=true;finished=true;audio.pause();if(state.mode==='test')pause.disabled=true;status.textContent='四段已播完，请检查并提交答案。';await progress();}};
  }
  begin.onclick=async()=>{try{if(submitted){state={id:crypto.randomUUID(),mode:mode.value,answers:{},passage:0,position:0,interrupted:false};submitted=false;finished=false;feedback.replaceChildren();for(const input of body.querySelectorAll('.listening-item input')){input.disabled=false;if(input.type==='text')input.value='';else input.checked=false;}script.hidden=true;}
   state.mode=mode.value;const r=await api(`/api/practice/sets/${set.id}/listening/sessions`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:state.id,mode:state.mode})});if(r.submitted){state.id=crypto.randomUUID();local();toast('该尝试已提交，请再次点开始建立新尝试');return;}started=true;mode.disabled=true;begin.disabled=true;submit.disabled=false;pause.disabled=false;reveal.disabled=state.mode!=='review';seek.disabled=state.mode!=='review';speed.disabled=state.mode!=='review';selectors.forEach(x=>x.disabled=state.mode!=='review');await play();}catch(e){toast(e.message);begin.disabled=false;}};
  audio.onplay=()=>pause.textContent='中断';audio.onpause=()=>pause.textContent='恢复';
  pause.onclick=()=>{if(finished&&!submitted&&state.mode==='test')return;if(audio.paused)play().catch(e=>toast(e.message));else{audio.pause();state.interrupted=true;progress();status.textContent='已中断；草稿与位置已保存。';}};
  mode.onchange=()=>{if(!started){state={id:crypto.randomUUID(),mode:mode.value,answers:state.answers,passage:0,position:0,interrupted:false};local();}};
  audio.ontimeupdate=()=>{seek.value=audio.duration?String(100*audio.currentTime/audio.duration):'0';if(Date.now()-lastSave>5000){lastSave=Date.now();progress();}};
  audio.onerror=()=>{if(audio.src){state.interrupted=true;progress();status.textContent='音频暂不可用，答案草稿已保留。请点恢复重试。';}};
  seek.onchange=()=>{if((submitted||state.mode==='review')&&audio.duration)audio.currentTime=audio.duration*Number(seek.value)/100;};speed.onchange=()=>{if(submitted||state.mode==='review')audio.playbackRate=Number(speed.value);};
  reveal.onclick=async()=>{try{const r=await api(`/api/practice/listening/sessions/${state.id}/reveal`,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});for(const links of card.querySelectorAll('.practice-links'))links.hidden=false;script.replaceChildren();for(const p of r.passages){script.append(make('h4','',passages.find(x=>x.id===p.id).title));for(const s of p.script){const line=make('div','listening-script-line'),button=make('button','bevel-button',`${s.speaker} · 回听`);button.type='button';button.onclick=async()=>{state.passage=passages.findIndex(x=>x.id===p.id);state.position=s.start;if(submitted){stop();active={stop:()=>audio.pause()};audio.src=`/api/practice/media/${passages[state.passage].audioId}`;await audio.play();audio.currentTime=s.start;audio.onended=()=>audio.pause();}else play().catch(e=>toast(e.message));};line.append(button,make('p','practice-prompt',s.text),make('p','practice-answer',s.translation));script.append(line);}}script.hidden=false;}catch(e){toast(e.message);}};
  submit.onclick=async()=>{if(!started)return;audio.pause();await progress();submit.disabled=true;try{const r=await api(`/api/practice/listening/sessions/${state.id}/submit`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:crypto.randomUUID(),answers:state.answers})});submitted=true;for(const input of body.querySelectorAll('.listening-item input'))input.disabled=true;pause.disabled=false;feedback.replaceChildren();showAttempt({id:r.id,sessionId:state.id,result:r.result,conditions:r.conditions});begin.disabled=false;begin.textContent='重新练习';mode.disabled=false;reveal.disabled=false;seek.disabled=false;speed.disabled=false;selectors.forEach(x=>x.disabled=false);localStorage.removeItem(storage);status.textContent=`已保存 · ${r.result.correct} / ${r.result.total}，Codex 会补充教学分析。`;}catch(e){toast(e.message);submit.disabled=false;}};
  const hide=()=>{if(started&&!submitted&&document.hidden){audio.pause();state.interrupted=true;progress();}},close=()=>{audio.pause();if(started&&!submitted){state.interrupted=true;progress();}};
  document.addEventListener('visibilitychange',hide);document.getElementById('practiceDialog').addEventListener('close',close,{once:true});
  card.dispose=()=>{close();document.removeEventListener('visibilitychange',hide);document.getElementById('practiceDialog').removeEventListener('close',close);};
  card.interrupt=close;
  body.append(submit,reveal,feedback,script);card.append(body);return card;
 }
 return{render,stop};
}
