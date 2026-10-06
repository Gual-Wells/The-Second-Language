// Preserve single-tap actions while recognising a deliberate double tap.
export function installPureReader({prepareTap=()=>{},onToggle=()=>{}}={}){
 const scope=document.getElementById('readingScroll'),shell=document.getElementById('app'),forwarded=new WeakSet();
 const windowMs=300;let pending=null,pointer=null;
 const editing=target=>target.closest('input,textarea,select,audio,video,[contenteditable="true"]');
 const clear=()=>{if(pending)clearTimeout(pending.timer);pending=null;};
 function toggle(target){
  const bounds=scope.getBoundingClientRect(),tools=document.getElementById('articleTools');
  const visibleTop=bounds.top+(tools.offsetParent?tools.getBoundingClientRect().height:0);
  const candidates=[...scope.querySelectorAll('.story-sentence,.word-heading,.example-pair,.sense-block,h1,h2,p')];
  const anchor=target.closest('.story-sentence,.word-heading,.example-pair,.sense-block,h1,h2,p')||candidates.find(e=>e.getBoundingClientRect().bottom>visibleTop&&e.getBoundingClientRect().top<bounds.bottom);
  const y=anchor?.getBoundingClientRect().top;
  shell.classList.toggle('pure-reading');
  window.dispatchEvent(new Event('tsl-stop-speech'));
  const next=scope.getBoundingClientRect(),nextTop=next.top+(tools.offsetParent?tools.getBoundingClientRect().height:0);
  if(anchor){const desired=Math.min(next.bottom-24,Math.max(nextTop+10,y));scope.scrollTop+=anchor.getBoundingClientRect().top-desired;}
  onToggle(shell.classList.contains('pure-reading'));
 }
 scope.addEventListener('pointerdown',e=>{if(!e.isPrimary){clear();pointer=null;return;}pointer={id:e.pointerId,x:e.clientX,y:e.clientY,time:performance.now(),moved:false};},{passive:true,capture:true});
 scope.addEventListener('pointermove',e=>{if(pointer?.id===e.pointerId&&Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)>10){pointer.moved=true;clear();}},{passive:true,capture:true});
 scope.addEventListener('pointercancel',()=>{pointer=null;clear();},{passive:true,capture:true});
 scope.addEventListener('contextmenu',clear,{capture:true});
 scope.addEventListener('scroll',clear,{passive:true});
 scope.addEventListener('click',e=>{
  if(document.getElementById('reader').hidden||document.querySelector('dialog[open]')){clear();return;}
  if(forwarded.has(e)||e.detail===0||editing(e.target)){clear();return;}
  const now=performance.now();
  if(pending&&now-pending.time<=windowMs&&!pointer?.moved&&Math.hypot(e.clientX-pending.x,e.clientY-pending.y)<=28){e.preventDefault();e.stopImmediatePropagation();clear();window.getSelection()?.removeAllRanges();toggle(e.target);return;}
  const selected=window.getSelection();if(pointer?.moved||(pointer&&now-pointer.time>450)||(selected&&!selected.isCollapsed)){clear();e.stopImmediatePropagation();return;}
  e.preventDefault();e.stopImmediatePropagation();
  if(pending){const prior=pending;clear();prior.forward();}
  prepareTap();
  const target=e.target,replay=new MouseEvent('click',{bubbles:true,cancelable:true,view:window,clientX:e.clientX,clientY:e.clientY,detail:1});
  const forward=()=>{if(target.isConnected){forwarded.add(replay);target.dispatchEvent(replay);}};
  const item={time:performance.now(),x:e.clientX,y:e.clientY,forward};item.timer=setTimeout(()=>{if(pending===item){pending=null;forward();}},windowMs);pending=item;
 },true);
 scope.addEventListener('dblclick',e=>{if(!editing(e.target)){e.preventDefault();e.stopImmediatePropagation();}},true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clear();});
 return {clear,toggle};
}

