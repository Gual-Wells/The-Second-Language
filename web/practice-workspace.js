const make=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls||'';if(text)e.textContent=text;return e;};
export function practiceWorkspace({root,set,onLeave}) {
 const tabs=make('nav','practice-subject-tabs'),panes=make('div','practice-panes'),footer=make('div','practice-work-foot');
 tabs.setAttribute('aria-label','练习科目');const groups=new Map(),positions=new Map();let active='',observer=null;
 const labels={listening:'听力',reading:'阅读',writing:'写作',speaking:'口语'};
 for(const [kind,label]of Object.entries(labels)){
  const cards=[...root.children].filter(e=>kind==='listening'?e.classList.contains('listening-paper'):kind==='reading'?e.classList.contains('reading-paper'):kind==='writing'?e.classList.contains('writing-clock')||e.dataset.kind===kind:e.dataset.kind===kind);
  if(!cards.length)continue;
  const pane=make('section','practice-pane'),controls=make('div','practice-controls'),paper=make('div','practice-paper-scroll');pane.dataset.kind=kind;pane.hidden=true;pane.append(controls,paper);panes.append(pane);
  const b=make('button','',label);b.type='button';b.setAttribute('role','tab');b.onclick=()=>select(kind);tabs.append(b);
  for(const card of cards)paper.append(card);
  if(kind==='listening'||kind==='reading'){
   const card=cards[0],toolbar=card.querySelector('.listening-toolbar');if(toolbar)controls.append(toolbar);
   if(kind==='listening'){const status=card.querySelector('.practice-guidance');if(status)controls.append(status);}
   else {const passageTabs=card.querySelector('.reading-tabs'),view=passageTabs?.nextElementSibling;if(passageTabs)controls.append(passageTabs);if(view?.classList.contains('button-row'))controls.append(view);}
  }
  if(kind==='writing'||kind==='speaking'){
   const clock=cards.find(c=>c.classList.contains('writing-clock'));if(clock)controls.append(clock);
   const parts=make('div','practice-part-tabs'),questionNav=make('div','practice-question-nav'),previous=make('button','bevel-button','‹ 上一题'),next=make('button','bevel-button','下一题 ›'),position=make('span');
   previous.type=next.type='button';questionNav.append(previous,position,next);controls.append(parts,questionNav);
   const partKeys=[...new Set(cards.filter(c=>c.dataset.kind===kind).map(c=>c.dataset.part))],partPositions=new Map();let chosen=partKeys[0],selectedId='';
   function display(part,index=partPositions.get(part)||0){
    const choices=[...paper.children].filter(c=>c.dataset.part===part),current=choices[Math.min(index,choices.length-1)];if(!current)return;
    const prior=document.getElementById(selectedId);if(prior&&prior!==current){onLeave(prior);positions.set(prior.id,paper.scrollTop);}
    chosen=part;selectedId=current.id;partPositions.set(part,choices.indexOf(current));for(const child of paper.children)child.hidden=child!==current;
    for(const option of parts.children)option.classList.toggle('selected',option.dataset.part===part);
    questionNav.hidden=choices.length<2;position.textContent=`${choices.indexOf(current)+1} / ${choices.length}`;previous.disabled=choices.indexOf(current)===0;next.disabled=choices.indexOf(current)===choices.length-1;
    paper.scrollTop=positions.get(current.id)||0;syncFooter();
   }
   for(const key of partKeys){const button=make('button','bevel-button',key.replace(kind+'-',kind==='writing'?'Task ':'Part '));button.type='button';button.dataset.part=key;button.onclick=()=>display(key);parts.append(button);}
   previous.onclick=()=>display(chosen,(partPositions.get(chosen)||0)-1);next.onclick=()=>display(chosen,(partPositions.get(chosen)||0)+1);
   display(chosen);
   pane.showQuestion=id=>{const current=document.getElementById(`practice-${id}`);if(!current)return;const choices=[...paper.children].filter(c=>c.dataset.part===current.dataset.part);display(current.dataset.part,choices.indexOf(current));};
   pane.refreshPart=()=>syncFooter();
  }
  groups.set(kind,{pane,paper,button:b});
 }
 root.replaceChildren(tabs,panes,footer);
 function syncFooter(){
  observer?.disconnect();footer.replaceChildren();const group=groups.get(active);if(!group)return;
  const card=group.paper.querySelector('.practice-question:not([hidden])'),body=card?.querySelector('.practice-question-body');
  const button=active==='listening'||active==='reading'?body?.querySelector(':scope > .primary-button'):card?.querySelector('.speaking-recorder .primary-button:last-child')||body?.querySelector(':scope > .button-row .primary-button');
  const note=make('span','',active==='speaking'?'原声草稿仅保存在本机':'答案自动保留在本机');footer.append(note);
  if(button){button.classList.add('footer-primary');const proxy=make('button','primary-button',button.textContent);proxy.type='button';const sync=()=>{proxy.textContent=button.textContent;proxy.disabled=button.disabled;};sync();proxy.onclick=()=>button.click();footer.append(proxy);observer=new MutationObserver(sync);observer.observe(button,{attributes:true,childList:true,subtree:true});}
 }
 function select(kind){if(active===kind||!groups.has(kind))return;const prior=groups.get(active);if(prior)onLeave(prior.pane);active=kind;try{localStorage.setItem(`tsl-practice-subject-${set.id}`,kind);}catch{}for(const [k,g]of groups){g.pane.hidden=k!==kind;g.button.classList.toggle('active',k===kind);g.button.setAttribute('aria-selected',String(k===kind));}syncFooter();}
 let remembered;try{remembered=localStorage.getItem(`tsl-practice-subject-${set.id}`);}catch{}
 select(groups.has(remembered)?remembered:groups.keys().next().value);
 return {select,focus(id){const card=document.getElementById(`practice-${id}`);if(!card)return;const pane=card.closest('.practice-pane');if(!pane)return;select(pane.dataset.kind);pane.showQuestion?.(id);requestAnimationFrame(()=>card.scrollIntoView({block:'start'}));},refresh(){syncFooter();},dispose(){observer?.disconnect();}};
}
