import {prose} from './text.js?v=25';
export function createQuestionsUI({api,showDialog,toast,getContext}) {
 const $=id=>document.getElementById(id),dialog=$('questionsDialog');
 let target=null,threads=[],generation=0,sending=false,pendingId=null;
 const key=()=>target?`second-language-question-draft:${target.chapterId}:${target.digest}`:'';
 const post=(path,body)=>api(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
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
  if(!active)return;
  const result=await api('/api/questions/summary');threads=result.threads||[];
  const unread=threads.some(t=>t.unread>0);$('questionDot').hidden=!unread;$('questionsButton').setAttribute('aria-label',unread?'章节答疑，有新回复':'章节答疑');
  if(dialog.open)options();
  const updates=$('questionNewReplies');updates.replaceChildren();updates.hidden=!threads.some(t=>t.unread>0&&!(t.chapterId===target?.chapterId&&t.digest===target?.digest));
  for(const t of threads.filter(t=>t.unread>0&&!(t.chapterId===target?.chapterId&&t.digest===target?.digest))){const b=document.createElement('button');b.type='button';b.className='bevel-button';b.textContent=`${t.chapterId} · 新回复`;b.onclick=()=>{draft(true);target={chapterId:t.chapterId,digest:t.digest};pendingId=null;generation++;options();draft();refresh();};updates.append(b);}
 }
 async function refresh() {
  if(!target||!dialog.open)return;
  const request=++generation,who={...target};
  try {
   const data=await api(`/api/questions?chapter=${encodeURIComponent(who.chapterId)}&digest=${who.digest}`);
   if(request!==generation||!dialog.open)return;
   const list=$('questionMessages'),nearBottom=list.scrollHeight-list.scrollTop-list.clientHeight<80,prior=list.scrollTop;
   list.replaceChildren();
   if(!data.messages.length){const p=document.createElement('p');p.className='question-empty';p.textContent='写下你对这一章的疑问，也可以引用原句。';list.append(p);}
   for(const m of data.messages){
    const box=document.createElement('section');box.className=`question-message question-${m.role}`;
    const label=document.createElement('strong');label.textContent=m.role==='user'?'我的问题':'答疑';
    const text=document.createElement('div');text.className='question-content';if(m.role==='assistant')prose(text,m.content);else text.textContent=m.content;
    box.append(label,text);
    if(m.role==='user'&&m.status!=='answered'){
     const status=document.createElement('p');status.className='question-status';status.textContent=m.status==='running'?'正在分析…':m.status==='failed'?(m.error||'暂未完成'):'等待处理';box.append(status);
     if(m.status==='failed'){const retry=document.createElement('button');retry.type='button';retry.className='bevel-button';retry.textContent='重新处理';retry.onclick=async()=>{retry.disabled=true;try{await post(`/api/questions/${m.id}/retry`,{});await refresh();}catch(e){toast(e.message);retry.disabled=false;}};box.append(retry);}
    }
    list.append(box);
   }
   list.scrollTop=nearBottom?list.scrollHeight:prior;
   $('questionStatus').textContent='回复会保存在本章答疑中。本机服务在线时自动处理。';
   const seq=Math.max(0,...data.messages.filter(m=>m.role==='assistant').map(m=>m.seq));
   if(data.threadId&&seq&&nearBottom&&document.visibilityState==='visible')await post(`/api/questions/${data.threadId}/seen`,{seq});
   await summary();
  }catch(e){$('questionStatus').textContent=e.message;}
 }
 $('questionsButton').onclick=async()=>{
  draft(true);const current=getContext().current;target={chapterId:current.id,digest:current.digest};pendingId=null;
  options();draft();showDialog('questionsDialog');await refresh();
 };
 $('questionChapter').onchange=()=>{draft(true);const [chapterId,digest]=$('questionChapter').value.split('@');target={chapterId,digest};pendingId=null;generation++;draft();refresh();};
 $('questionText').oninput=()=>{pendingId=null;draft(true);};
 $('questionForm').onsubmit=async event=>{
  event.preventDefault();if(sending||!target||!$('questionText').value.trim())return;
  const who={...target},raw=$('questionText').value,question=raw.trim();sending=true;$('questionSend').disabled=true;
  pendingId ||= crypto.randomUUID();
  try {await post('/api/questions',{id:pendingId,...who,question});
   const sentKey=`second-language-question-draft:${who.chapterId}:${who.digest}`;
   try{if(localStorage.getItem(sentKey)===raw)localStorage.removeItem(sentKey);}catch{}
   if(target?.chapterId===who.chapterId&&target?.digest===who.digest){if($('questionText').value===raw){$('questionText').value='';pendingId=null;}await refresh();}
  }catch(e){toast(e.message);}finally{sending=false;$('questionSend').disabled=false;}
 };
 dialog.addEventListener('close',()=>{draft(true);generation++;});
 const poll=()=>{if(document.visibilityState==='visible'&&eligible()){if(dialog.open)refresh();else summary().catch(()=>{});}};
 setInterval(poll,30000);document.addEventListener('visibilitychange',poll);window.addEventListener('online',poll);
 return {changed(){summary().catch(()=>{});},clear(){generation++;target=null;threads=[];dialog.close();$('questionMessages').replaceChildren();$('questionsButton').hidden=true;$('questionDot').hidden=true;}};
}
