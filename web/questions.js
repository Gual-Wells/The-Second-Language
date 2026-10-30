import {prose} from './text.js?v=41';
import {focusQuestion} from './reader-focus.js?v=50';
import {questionPairs} from './question-pairs.js?v=41';
export function createQuestionsUI({api,showDialog,toast,getContext}) {
 const $=id=>document.getElementById(id),dialog=$('questionsDialog');
 let target=null,threads=[],generation=0,summaryGeneration=0,opening=false,sending=false,initialPosition=false,readOnly=false,focusId=null;
 const boundaries=new Map(),identity=t=>`${t.chapterId}@${t.digest}`;
 const key=()=>target?`second-language-question-draft:${target.chapterId}:${target.digest}`:'';
 const post=(path,body)=>api(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
 const owner=()=>getContext().readerUserId;
 const validId=id=>typeof id==='string'&&/^[a-f0-9-]{36}$/.test(id);
 const unknown=m=>m.error==='outcome_unknown'||/结果待核对/.test(m.error||'');
 const updateSend=()=>{$('questionSend').disabled=opening||sending||readOnly;};
 function pendingFor(who,question){
  if(typeof owner()!=='string'||!owner())throw Error('登录身份暂不可核对，请重新连接后再发送');
  const storageKey=`second-language-question-pending-v1:${owner()}:${who.chapterId}:${who.digest}`;
  let entries;try{entries=JSON.parse(localStorage.getItem(storageKey)||'[]');}catch{throw Error('暂时无法保存发送状态，请检查本机存储后重试');}
  if(!Array.isArray(entries))throw Error('本机发送状态暂不可读取，请保留草稿后检查');
  if(entries.some(v=>!v||typeof v.question!=='string'||!validId(v.id)))throw Error('本机发送状态暂不可读取，请保留草稿后检查');
  let pending=entries.find(v=>v.question===question);if(!pending){pending={question,id:crypto.randomUUID()};entries.push(pending);}
  try{localStorage.setItem(storageKey,JSON.stringify(entries));}catch{throw Error('暂时无法保存发送状态，请检查本机存储后重试');}
  return {...pending,storageKey};
 }
 function accepted(pending){try{const entries=JSON.parse(localStorage.getItem(pending.storageKey)||'[]');if(Array.isArray(entries)){const rest=entries.filter(v=>v?.id!==pending.id);if(rest.length)localStorage.setItem(pending.storageKey,JSON.stringify(rest));else localStorage.removeItem(pending.storageKey);}}catch{}}
 function draft(save=false) {try{if(save&&key())localStorage.setItem(key(),$('questionText').value);else $('questionText').value=key()?localStorage.getItem(key())||'':'';}catch{}}
 function eligible() {const c=getContext();return c.authenticated&&!c.demo&&c.current&&!c.current.kind&&c.current.digest;}
 function options() {
  const select=$('questionChapter');select.replaceChildren();
  const current=getContext().current;
  const all=[...(current&&!current.kind?[{chapterId:current.id,digest:current.digest,title:current.title}]:[]),...threads];
  const seen=new Set();
  for(const t of all){const id=`${t.chapterId}@${t.digest}`;if(seen.has(id))continue;seen.add(id);const o=document.createElement('option');o.value=id;o.textContent=`${t.chapterId} · ${t.title}${t.unread?' · 新回复':''}${all.some(x=>x.chapterId===t.chapterId&&x.digest!==t.digest)?' · '+t.digest.slice(0,7):''}`;select.append(o);}
  if(target)select.value=`${target.chapterId}@${target.digest}`;
 }
 async function summary() {
  const active=eligible();$('questionsButton').hidden=!active;
  if(!active||opening)return;
  const ticket=++summaryGeneration,result=await api('/api/questions/summary');
  if(ticket!==summaryGeneration||opening||!eligible())return;threads=result.threads||[];
  const unread=threads.some(t=>t.unread>0);$('questionDot').hidden=!unread;$('questionsButton').setAttribute('aria-label',unread?'章节答疑，有新回复':'章节答疑');
  if(dialog.open)options();
  const updates=$('questionNewReplies');updates.replaceChildren();updates.hidden=!threads.some(t=>t.unread>0&&!(t.chapterId===target?.chapterId&&t.digest===target?.digest));
  for(const t of threads.filter(t=>t.unread>0&&!(t.chapterId===target?.chapterId&&t.digest===target?.digest))){const b=document.createElement('button');b.type='button';b.className='bevel-button';b.textContent=`${t.chapterId} · 新回复`;b.onclick=()=>{draft(true);target={chapterId:t.chapterId,digest:t.digest};readOnly=true;focusId=null;updateSend();initialPosition=true;generation++;options();draft();refresh();};updates.append(b);}
 }
 async function refresh() {
  if(!target||!dialog.open||opening)return;
  const request=++generation,who={...target};
  try {
   const data=await api(`/api/questions?chapter=${encodeURIComponent(who.chapterId)}&digest=${who.digest}`);
   if(request!==generation||!dialog.open)return;
   await display(data);
   await summary();
  }catch(e){$('questionStatus').textContent=e.message;}
 }
 async function display(data) {
   readOnly=data.readOnly===true;updateSend();
   const list=$('questionMessages'),nearBottom=list.scrollHeight-list.scrollTop-list.clientHeight<80,prior=list.scrollTop;
   const anchor=[...list.querySelectorAll('[data-message-id]')].find(el=>el.getBoundingClientRect().bottom>list.getBoundingClientRect().top),anchorId=anchor?.dataset.messageId,anchorOffset=anchor?anchor.getBoundingClientRect().top-list.getBoundingClientRect().top:0;
   list.replaceChildren();
   if(!data.messages.length){const p=document.createElement('p');p.className='question-empty';p.textContent='写下你对这一章的疑问，也可以引用原句。';list.append(p);}
   function message(m){
    const box=document.createElement('section');box.className=`question-message question-${m.role}`;
    box.dataset.messageId=m.id;
    const label=document.createElement('strong');label.textContent=m.role==='user'?'我的问题':'答疑';
    const text=document.createElement('div');text.className='question-content';if(m.role==='assistant')prose(text,m.content);else text.textContent=m.content;
    box.append(label,text);
    if(m.role==='user'&&m.status!=='answered'){
     const status=document.createElement('p');status.className='question-status';status.textContent=m.status==='running'?'正在分析…':m.status==='failed'?(m.error||'暂未完成'):'等待处理';box.append(status);
     if(m.status==='failed'&&!unknown(m)&&!readOnly){const retry=document.createElement('button');retry.type='button';retry.className='bevel-button';retry.textContent='重新处理';retry.onclick=async()=>{retry.disabled=true;try{await post(`/api/questions/${m.id}/retry`,{});await refresh();}catch(e){toast(e.message);retry.disabled=false;}};box.append(retry);}
    }
    return box;
   }
   const boundary=boundaries.get(identity(target));
   for(const {question,answer} of questionPairs(data.messages)){
    if(question.id===boundary){const divider=document.createElement('div');divider.className='question-unread-divider';divider.textContent='未读消息';list.append(divider);}
    const turn=document.createElement('div');turn.className='question-turn';turn.dataset.questionId=question.id;turn.append(message(question));if(answer)turn.append(message(answer));list.append(turn);
   }
   if(initialPosition){const focused=focusId?[...list.querySelectorAll('[data-question-id]')].find(el=>el.dataset.questionId===focusId):null,divider=focused||list.querySelector('.question-unread-divider');if(divider)list.scrollTop+=divider.getBoundingClientRect().top-list.getBoundingClientRect().top;else list.scrollTop=list.scrollHeight;initialPosition=false;focusId=null;}
   else if(nearBottom)list.scrollTop=list.scrollHeight;else{const next=anchorId?[...list.querySelectorAll('[data-message-id]')].find(el=>el.dataset.messageId===anchorId):null;list.scrollTop=prior;if(next)list.scrollTop+=next.getBoundingClientRect().top-list.getBoundingClientRect().top-anchorOffset;}
   $('questionStatus').textContent=readOnly?'此版本已封存，历史问答仍可查看。':'回复会保存在本章答疑中。本机服务在线时自动处理。';
   const seq=Math.max(0,...data.messages.filter(m=>m.role==='assistant').map(m=>m.seq));
   if(data.threadId&&seq&&nearBottom&&document.visibilityState==='visible')await post(`/api/questions/${data.threadId}/seen`,{seq});
 }
 async function open(preferred=null){
  const context=getContext();if(!context.authenticated||context.demo)return false;
  if(preferred&&(!/^[A-Za-z0-9_-]{1,100}$/.test(preferred.chapterId||'')||!/^[a-f0-9]{64}$/.test(preferred.digest||'')||!validId(preferred.questionId))){toast('这条答疑提醒地址无效');return false;}
  const current=preferred||context.current;if(!current)return false;
  draft(true);target={chapterId:preferred?current.chapterId:current.id,digest:current.digest};readOnly=false;focusId=preferred?.questionId||null;
  opening=true;summaryGeneration++;const ticket=++generation;boundaries.clear();initialPosition=true;
  $('questionChapter').disabled=true;$('questionSend').disabled=true;
  $('questionDot').hidden=true;$('questionsButton').setAttribute('aria-label','章节答疑');
  $('questionNewReplies').replaceChildren();$('questionNewReplies').hidden=true;
  options();draft();$('questionMessages').replaceChildren();$('questionStatus').textContent='正在打开…';showDialog('questionsDialog');
  try{
   const data=await post('/api/questions/open',{...target,...(preferred?{questionId:preferred.questionId}:{})});
   if(ticket!==generation||!dialog.open)return;
   for(const t of data.threads||[])if(t.firstUnreadQuestionId)boundaries.set(identity(t),t.firstUnreadQuestionId);
   threads=(data.threads||[]).map(t=>({...t,unread:0}));
   draft(true);target={chapterId:data.chapterId,digest:data.digest};options();draft();
   await display(data);return true;
  }catch(e){if(ticket===generation&&dialog.open)$('questionStatus').textContent=e.message;}
  finally{if(ticket===generation){opening=false;$('questionChapter').disabled=false;updateSend();summary().catch(()=>{});}}
 }
 $('questionsButton').onclick=()=>open();
 $('questionChapter').onchange=()=>{draft(true);const [chapterId,digest]=$('questionChapter').value.split('@');target={chapterId,digest};readOnly=true;focusId=null;updateSend();initialPosition=true;generation++;draft();refresh();};
 $('questionText').oninput=()=>{draft(true);};
 $('questionForm').onsubmit=async event=>{
  event.preventDefault();if(sending||opening||readOnly||!target||!$('questionText').value.trim())return;
  const who={...target},reader=owner(),raw=$('questionText').value,question=raw.trim();sending=true;updateSend();
  try {const pending=pendingFor(who,question);await post('/api/questions',{id:pending.id,...who,question});accepted(pending);
   const sentKey=`second-language-question-draft:${who.chapterId}:${who.digest}`;
   try{if(owner()===reader&&localStorage.getItem(sentKey)===raw)localStorage.removeItem(sentKey);}catch{}
   if(owner()===reader&&target?.chapterId===who.chapterId&&target?.digest===who.digest){if($('questionText').value===raw)$('questionText').value='';await refresh();}
  }catch(e){toast(e.message);}finally{sending=false;updateSend();}
 };
 dialog.addEventListener('close',()=>{if(dialog.open)return;draft(true);generation++;summaryGeneration++;opening=false;initialPosition=false;focusId=null;boundaries.clear();$('questionChapter').disabled=false;updateSend();});
 const poll=()=>{if(document.visibilityState==='visible'&&eligible()){if(dialog.open)refresh();else summary().catch(()=>{});}};
 setInterval(poll,30000);document.addEventListener('visibilitychange',poll);window.addEventListener('online',poll);
 const quickSending=new Set(),recent=new Map();
 async function submitFocus(focus){
  if(!eligible()){toast('请在已登录的正式章节中申请答疑');return;}
  if(!navigator.onLine){toast('当前离线，请联网后再申请答疑');return;}
  const c=getContext().current,who={chapterId:c.id,digest:c.digest},question=focusQuestion(focus),storageKey=`second-language-quick-question:${c.id}:${c.digest}:${question}`;
  if(quickSending.has(storageKey)||Date.now()-(recent.get(storageKey)||0)<5000)return;
  let id;try{id=localStorage.getItem(storageKey);}catch{}id||=crypto.randomUUID();
  try{localStorage.setItem(storageKey,id);}catch{}quickSending.add(storageKey);
  toast('正在提交答疑…');
  try{await post('/api/questions',{id,...who,question});try{localStorage.removeItem(storageKey);}catch{}recent.set(storageKey,Date.now());if(recent.size>30)recent.delete(recent.keys().next().value);toast('已提交，回复将在章节答疑中显示');summary().catch(()=>{});}
  catch(e){toast(e.message||'提交暂未确认，请重做同一手势重试');}
  finally{quickSending.delete(storageKey);}
 }
 return {submitFocus,openTarget:open,changed(){summary().catch(()=>{});},clear(){generation++;summaryGeneration++;opening=false;boundaries.clear();target=null;threads=[];recent.clear();dialog.close();$('questionMessages').replaceChildren();$('questionsButton').hidden=true;$('questionDot').hidden=true;}};
}
