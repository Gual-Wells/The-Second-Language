import {readerFocus,sentenceElement,wordAtPoint} from './reader-focus.js?v=28';
// A single arbiter owns taps, holds and scrolling, so one gesture has one action.
export function installPureReader({prepareTap=()=>{},onToggle=()=>{},onQuestion=()=>{}}={}){
 const scope=document.getElementById('readingScroll'),shell=document.getElementById('app'),forwarded=new WeakSet();
 const windowMs=300;let pending=null,pointer=null,holdTimer=null;
 const editing=target=>target.closest('input,textarea,select,audio,video,[contenteditable="true"]');
 const clearHold=()=>{clearTimeout(holdTimer);holdTimer=null;};
 const clear=()=>{if(pending)clearTimeout(pending.timer);pending=null;clearHold();};
 function toggle(target){
  const bounds=scope.getBoundingClientRect(),article=document.getElementById('article'),tools=document.getElementById('articleTools');
  const visibleTop=bounds.top+(tools.offsetParent?tools.getBoundingClientRect().height:0);
  const candidates=[...article.querySelectorAll('.story-sentence,.word-heading,.example-pair,.sense-block,h1,h2,p')];
  const clicked=article.contains(target)?target.closest('.story-sentence,.word-heading,.example-pair,.sense-block,h1,h2,p'):null;
  const anchor=clicked||candidates.find(e=>e.getBoundingClientRect().bottom>visibleTop&&e.getBoundingClientRect().top<bounds.bottom)||article;
  const y=anchor?.getBoundingClientRect().top;
  shell.classList.toggle('pure-reading');
  window.dispatchEvent(new Event('tsl-stop-speech'));
  // Native scroll bounds define the two unavoidable edge regions. Everywhere
  // else preserve the exact viewport coordinate, without clamping to a new inset.
  if(anchor)scope.scrollTop+=anchor.getBoundingClientRect().top-y;
  onToggle(shell.classList.contains('pure-reading'));
 }
 scope.addEventListener('pointerdown',e=>{
  if(!e.isPrimary||e.button!==0||editing(e.target)||document.querySelector('dialog[open]')){clear();pointer=null;return;}
  pointer={id:e.pointerId,x:e.clientX,y:e.clientY,time:performance.now(),moved:false};
  if(pending&&performance.now()-pending.time<=windowMs&&Math.hypot(e.clientX-pending.x,e.clientY-pending.y)<=28)clearTimeout(pending.timer);
  const focus=readerFocus(e.target),active=pointer;
  if(focus)holdTimer=setTimeout(()=>{
   if(pointer!==active||active.moved||!e.target.isConnected||document.querySelector('dialog[open]'))return;
   clear();active.consumed=true;window.getSelection()?.removeAllRanges();
   window.dispatchEvent(new Event('tsl-stop-speech'));onQuestion(focus);
  },650);
 },{passive:true,capture:true});
 scope.addEventListener('pointerup',e=>{if(pointer?.id===e.pointerId)clearHold();},{passive:true,capture:true});
 scope.addEventListener('pointermove',e=>{if(pointer?.id===e.pointerId&&Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y)>10){pointer.moved=true;clear();}},{passive:true,capture:true});
 scope.addEventListener('pointercancel',()=>{pointer=null;clear();},{passive:true,capture:true});
 scope.addEventListener('contextmenu',e=>{if(readerFocus(e.target)){e.preventDefault();}else clear();},{capture:true});
 scope.addEventListener('scroll',clear,{passive:true});
 scope.addEventListener('click',e=>{
  if(document.getElementById('reader').hidden||document.querySelector('dialog[open]')){clear();return;}
  if(forwarded.has(e)||e.detail===0||editing(e.target)){clear();return;}
  const now=performance.now();
  if(pointer?.consumed){e.preventDefault();e.stopImmediatePropagation();clear();return;}
  if(pending&&now-pending.time<=windowMs&&!pointer?.moved&&Math.hypot(e.clientX-pending.x,e.clientY-pending.y)<=28){
   e.preventDefault();e.stopImmediatePropagation();clear();window.getSelection()?.removeAllRanges();
   const sentence=sentenceElement(e.target);
   if(sentence){const word=wordAtPoint(sentence,e.clientX,e.clientY);if(word){window.dispatchEvent(new Event('tsl-stop-speech'));onQuestion({...readerFocus(e.target),...word});}}
   else toggle(e.target);return;
  }
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
 return {clear(){clear();pointer=null;},toggle};
}

