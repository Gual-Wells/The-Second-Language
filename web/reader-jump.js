// Hold the current frame while the destination is laid out; reveal it without scrolling animation.
export function createReaderJump({shell,scope,notice}) {
 let serial=0,cover=null;
 const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
 function cancel(){serial++;cover?.remove();cover=null;notice.hidden=true;}
 async function run(render,findTarget,complete=()=>{}) {
  cancel();const ticket=serial,bounds=shell.getBoundingClientRect(),snapshot=shell.cloneNode(true);
  snapshot.removeAttribute('id');for(const node of snapshot.querySelectorAll('[id]'))node.removeAttribute('id');
  snapshot.inert=true;snapshot.setAttribute('aria-hidden','true');snapshot.classList.add('reader-jump-cover');
  Object.assign(snapshot.style,{top:bounds.top+'px',left:bounds.left+'px',width:bounds.width+'px',height:bounds.height+'px'});
  const before=[shell,...shell.querySelectorAll('*')],after=[snapshot,...snapshot.querySelectorAll('*')];
  for(let i=0;i<before.length;i++)if(['partNumber','partSummary','readingPosition','questionsButton','temporaryCount'].includes(before[i].id)){
   const style=getComputedStyle(before[i]);for(const name of ['display','color','font','position','max-width','margin-left','overflow','white-space','text-overflow'])after[i].style.setProperty(name,style.getPropertyValue(name));
  }
  document.body.append(snapshot);for(let i=0;i<before.length;i++){if(before[i].scrollTop)after[i].scrollTop=before[i].scrollTop;if(before[i].scrollLeft)after[i].scrollLeft=before[i].scrollLeft;}
  // ID-specific visibility rules must survive sanitising the inert snapshot.
  const tools=shell.querySelector('.article-tools');if(tools&&getComputedStyle(tools).display==='none')snapshot.querySelector('.article-tools').hidden=true;
  cover=snapshot;notice.hidden=false;
  try{
   await frame();if(ticket!==serial)return;
   render();await document.fonts?.ready;await frame();await frame();if(ticket!==serial)return;
   const target=findTarget();if(!target)throw Error('没有找到对应内容');
   scope.scrollTop+=target.getBoundingClientRect().top-scope.getBoundingClientRect().top-12;
   await frame();if(ticket!==serial)return;complete();
  }finally{if(ticket===serial){cover?.remove();cover=null;notice.hidden=true;}}
 }
 return {run,cancel};
}
