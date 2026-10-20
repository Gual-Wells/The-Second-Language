import {MuseumScene} from './scene.js';
import {ScrollViewer} from './scroll-viewer.js';
import {SoundDirector} from './sound.js';

const $=id=>document.getElementById(id),stage=$('museumStage');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const item=Object.freeze({id:'specimen-chapter-five',chapterId:'2026-10-12',chapterNumber:5,title:'河谷里未说完的话',artTitle:'Of Leaf and Letter',paperTint:0xb7a078,issued:false});
let scene,viewer,preparePromise,prepared=false,museumReady=false,phase='browse',transfer=null,frame=0,previous=0,drag=null,returnRequested=false,disposed=false;
let progress=0,viewerActive=false,lastVelocity=0,sceneFailed=false;
let viewerUnavailable=false,taking=false,alignment={x:0,y:0,scale:1};
const sound=new SoundDirector();
const savedPreferences=(()=>{try{return JSON.parse(localStorage.getItem('tsl-museum-sound-v1')||'{}');}catch{return {};}})();
let musicWanted=savedPreferences.music===true,foleyWanted=savedPreferences.foley===true;
const say=t=>{$('museumStatus').textContent=t;};
const ease=t=>t*t*(3-2*t);

function saveSound(){try{localStorage.setItem('tsl-museum-sound-v1',JSON.stringify({music:musicWanted,foley:foleyWanted}));}catch{}}
function updateSound(){sound.setMusicEnabled(musicWanted);sound.setFoleyEnabled(foleyWanted);$('musicButton').textContent=musicWanted?'音乐开':'音乐关';$('musicButton').setAttribute('aria-pressed',String(musicWanted));$('foleyButton').textContent=foleyWanted?'拟音开':'拟音关';$('foleyButton').setAttribute('aria-pressed',String(foleyWanted));}
function controls(){
 const browsing=phase==='browse',inspecting=phase==='inspect';
 $('takeButton').hidden=!browsing;$('takeButton').disabled=!prepared||viewerUnavailable||taking;$('takeButton').textContent=viewerUnavailable?'恢复立体显示…':taking?'正在取阅…':prepared?'取阅藏卷':'准备藏卷…';
 for(const id of ['toggleScroll','detailButton','returnButton']){$(id).hidden=!inspecting;$(id).disabled=!prepared||returnRequested;}
 $('toggleScroll').textContent=progress>=.5?'收卷':'启卷';
 $('toggleScroll').disabled||=viewerUnavailable;
 $('browseControls').hidden=!browsing;$('selectionCard').hidden=!browsing;$('museumWordmark').hidden=!browsing;
 $('catalogueButton').disabled=!browsing;
 stage.dataset.phase=phase;
 if(scene){const s=scene.snapshot();$('cabinetLabel').textContent=`第 ${s.cabinet} 柜 · 第 ${s.range[0]}—${s.range[1]} 章`;$('previousCabinet').disabled=s.cabinet<=1;$('nextCabinet').disabled=s.cabinet>=(scene.maxCabinet+1);}
}
function alignViewer(pose){
 const native=viewer?.getClosedScreenPose();if(!pose||!native?.width)return;
 const scale=pose.width/native.width,cx=stage.clientWidth/2,cy=stage.clientHeight/2;
 alignment={x:pose.x-(cx+(native.x-cx)*scale),y:pose.y-(cy+(native.y-cy)*scale),scale};applyAlignment(0);
}
function applyAlignment(p){const a=Math.max(0,1-p/.12);$('viewerLayer').style.transform=`translate(${alignment.x*a}px,${alignment.y*a}px) scale(${1+(alignment.scale-1)*a})`;}
function schedule(){if(!frame&&!document.hidden&&!disposed)frame=requestAnimationFrame(tick);}
function tick(now){
 frame=0;if(document.hidden||disposed)return;
 const dt=Math.min(.05,Math.max(0,(now-(previous||now))/1000));previous=now;
 if(transfer){
  transfer.elapsed+=dt*1000;const p=Math.min(1,transfer.elapsed/transfer.duration),t=ease(p);
  scene?.setStage(transfer.kind,t);
  if(transfer.kind==='retrieve'){
   alignViewer(scene?.getTransferPose?.());
   const blend=Math.max(0,Math.min(1,(t-.78)/.22));$('viewerLayer').style.opacity=String(blend);
   scene?.setProxyVisible?.(blend<.8);
  }else{
   alignViewer(scene?.getTransferPose?.());
   const blend=1-Math.min(1,t/.22);$('viewerLayer').style.opacity=String(blend);scene?.setProxyVisible?.(blend<.8);
  }
  if(p===1){const kind=transfer.kind;transfer=null;
   if(kind==='retrieve'){phase='inspect';scene?.setStage('inspect',1);scene?.setProxyVisible?.(false);$('viewerLayer').style.opacity='1';sound.setScene('inspect');say('第五章制作试样 · 轻触启卷，或沿纵向拖动');}
   else{phase='browse';$('viewerLayer').hidden=true;$('viewerLayer').style.opacity='0';viewer?.pause();scene?.setSelected(null);scene?.setStage('browse',0);scene?.setProxyVisible?.(true);sound.setScene('museum');sound.cue('placed');say('藏卷已归原位 · 设计试样，尚未颁发');}
   controls();
  }
 }
 if(museumReady&&(phase!=='inspect'||transfer)){scene.update(dt);scene.render();}
 if(returnRequested&&!viewerActive&&progress<.001){returnRequested=false;startReturn();}
 schedule();
}
function resize(){const {width,height}=stage.getBoundingClientRect();scene?.resize(width,height);viewer?.resize(width,height);}
async function prepareViewer(){
 if(preparePromise)return preparePromise;
 viewer=new ScrollViewer($('scrollCanvas'),$('mistCanvas'),{
  onStatus:(text,meta={})=>{
   if(!prepared){$('takeButton').textContent=text?.includes('%')?text:'准备藏卷…';say('馆景已打开，正在准备完整藏卷。');}
   else if(['context-lost','failed','restoring'].includes(meta.status)){
    viewerUnavailable=true;viewerActive=false;
    if(phase==='inspect'){const source=viewer.exportDocument();if(source)$('staticDocument').src=source;$('staticDocument').hidden=false;say(text);}
    if(returnRequested){returnRequested=false;progress=0;startReturn({immediate:true});}
    controls();
   }else if(meta.status==='ready'){
    viewerUnavailable=false;$('staticDocument').hidden=true;if(phase==='browse')viewer.setProgress(0);controls();
   }
  },
  onProgress:state=>{
   progress=state.progress;viewerActive=Boolean(state.active);lastVelocity=state.velocity||0;
   if(phase==='inspect')sound.motion({...state});
   if(phase==='inspect'&&!viewerUnavailable)applyAlignment(progress);
   if(phase==='inspect')$('toggleScroll').textContent=progress>=.5?'收卷':'启卷';
  }
 });
 const dimensions=stage.getBoundingClientRect();viewer.resize(dimensions.width,dimensions.height);viewer.pause();
 preparePromise=viewer.prepare({chapter:'five'}).then(()=>{
  if(disposed)return;prepared=true;resize();viewer.pause();controls();
  say('第五章制作试样已备妥 · 点选藏卷或取阅');
 }).catch(error=>{
  console.error('Scroll preparation',error);preparePromise=null;prepared=false;
  viewer?.dispose();viewer=null;$('takeButton').textContent='重试准备';$('takeButton').disabled=false;
  say('完整藏卷暂未备妥，可重试或查看原样品。');
 });
 return preparePromise;
}
function startTransfer(kind){
 phase=kind==='retrieve'?'retrieve':'return';transfer={kind,elapsed:0,duration:reduced.matches?1:1900};controls();schedule();
}
async function take(){
 if(phase!=='browse'||taking||disposed||viewerUnavailable)return;taking=true;controls();
 try{
  if(musicWanted||foleyWanted)sound.unlock().then(()=>{if(!disposed){updateSound();sound.resume();}}).catch(()=>{});
  if(!prepared){await prepareViewer();if(!prepared||disposed||phase!=='browse')return;}
  returnRequested=false;progress=0;alignment={x:0,y:0,scale:1};viewer.setProgress(0,{immediate:true});viewer.resume();
  $('viewerLayer').hidden=false;$('viewerLayer').style.opacity='0';scene?.setSelected(item.id);scene?.focus(item.id);
  sound.cue('pickup');say('取出藏卷…');startTransfer('retrieve');
 }finally{taking=false;controls();}
}
function startReturn({immediate=false}={}){sound.motion({progress:0,velocity:0,active:false,direction:-1});sound.setScene('museum');say('归藏中…');startTransfer('return');if(immediate)transfer.duration=1;}
function putBack(){
 if(phase!=='inspect'||returnRequested)return;drag=null;
 if(viewerUnavailable){progress=0;viewerActive=false;$('staticDocument').hidden=true;startReturn({immediate:true});return;}
 if(progress>.001||viewerActive){returnRequested=true;viewer.animate(0);controls();say('先收卷、复扣，再归回藏位…');}
 else startReturn();
}
function toggle(){if(phase==='inspect'&&!returnRequested){sound.unlock().catch(()=>{});viewer.animate(viewer.animation?(viewer.animation.to?0:1):(progress>=.5?0:1));}}
function openDialog(id){$(id).showModal();}
for(const id of ['catalogueDialog','detailDialog','aboutDialog'])$(id).addEventListener('click',e=>{if(e.target===$(id))$(id).close();});
$('catalogueButton').addEventListener('click',()=>openDialog('catalogueDialog'));
$('aboutButton').addEventListener('click',()=>openDialog('aboutDialog'));
$('chapterFive').addEventListener('click',()=>{$('catalogueDialog').close();scene?.focus(item.id);say('已定位第五章藏位 · 可取阅');});
$('takeButton').addEventListener('click',take);$('toggleScroll').addEventListener('click',toggle);$('returnButton').addEventListener('click',putBack);
for(const [id,key]of [['musicButton','music'],['foleyButton','foley']])$(id).addEventListener('click',async()=>{
 if(key==='music')musicWanted=!musicWanted;else foleyWanted=!foleyWanted;saveSound();updateSound();
 await sound.unlock().catch(()=>{say('声音被系统暂停，轻触声音按钮重试。');});sound.resume();
});
$('detailButton').addEventListener('click',()=>{
 if(!prepared)return;
 const image=viewer.exportDocument();if(image)$('documentImage').src=image;
 const transcript=$('transcript');transcript.replaceChildren();
 if(viewer.populateTranscript)viewer.populateTranscript(transcript);else{const text=viewer.getTranscript?.();if(typeof text==='string')transcript.textContent=text;}
 const translated=viewer.record?.artPlan?.copy?.translation;
 if(translated){
  const section=document.createElement('section');section.lang='zh-CN';section.className='museum-translation';
  const lines=['中文对照',`第五章 · ${translated.artTitle}`,translated.chapterEnglishTitle,...translated.stanzas.map(s=>s.join('\n')),'谨为 Gual Wells 留存，以纪念第五章及其圆满完成的试炼。','The Second Language：第二语言；In remembrance：留作纪念。','纸面身份行依次记录样品日期、时间（+08:00）与内容短码，完整摘要见藏卷记录。','Specimen — Not issued：制作试样，尚未颁发。以上纪念文辞为样品，不表示已经通过测试。'];
  for(const [i,text]of lines.entries()){const p=document.createElement(i===0?'h3':'p');p.textContent=text;p.style.whiteSpace='pre-line';section.append(p);}transcript.append(section);
 }
 const record=viewer.exportRecord();$('recordText').textContent=`制作试样 · 尚未颁发\n归属：${record.recipient||'Gual Wells'}\n样品时间：${record.proof?.sampleTime||'未设置'}\n内容 SHA-256：${record.sha256||record.artifactDigest||'见原件记录'}`;
 openDialog('detailDialog');
});
$('zoomButton').addEventListener('click',()=>{const on=$('documentField').dataset.zoom!=='true';$('documentField').dataset.zoom=String(on);$('zoomButton').textContent=on?'全页':'放大';$('zoomButton').setAttribute('aria-pressed',String(on));});
for(const [id,delta]of [['previousCabinet',-1],['nextCabinet',1]])$(id).addEventListener('click',()=>{
 if(phase!=='browse')return;const result=scene?.navigateCabinet?.(delta);if(result?.label)$('cabinetLabel').textContent=result.label;
});
const scrollCanvas=$('scrollCanvas');
scrollCanvas.addEventListener('pointerdown',e=>{if(phase==='inspect'&&!returnRequested)viewer.pointerDown(e);});
scrollCanvas.addEventListener('pointermove',e=>{if(phase==='inspect'&&!returnRequested)viewer.pointerMove(e);});
scrollCanvas.addEventListener('pointerup',e=>{if(phase==='inspect'&&!returnRequested)viewer.pointerUp(e);});
scrollCanvas.addEventListener('pointercancel',e=>{viewer?.pointerCancel(e);sound.motion({progress,velocity:0,active:false,direction:0});});
scrollCanvas.addEventListener('lostpointercapture',e=>viewer?.pointerCancel(e));
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){cancelAnimationFrame(frame);frame=0;drag=null;viewer?.pause();sound.pause();}
 else{previous=performance.now();if(phase!=='browse')viewer?.resume();sound.resume();schedule();}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&phase==='inspect'&&!document.querySelector('dialog[open]'))putBack();});
const observer=new ResizeObserver(resize);observer.observe(stage);
$('museumCanvas').addEventListener('webglcontextlost',event=>{event.preventDefault();museumReady=false;sceneFailed=true;$('museumFallback').hidden=false;say('馆景显示中断，完整藏卷仍可取阅。');});
$('museumCanvas').addEventListener('webglcontextrestored',()=>{if(disposed)return;try{resize();museumReady=true;sceneFailed=false;scene.render();$('museumFallback').hidden=true;schedule();}catch{say('馆景暂未恢复，仍可查看藏卷与释读。');}});
async function setup(){
 updateSound();sound.prepare().catch(e=>console.warn('Audio preparation',e));
 scene=new MuseumScene($('museumCanvas'),{onSelect:id=>{if(id===item.id){scene.focus(id);say('第五章 · 河谷里未说完的话');}},onStatus:t=>{$('loadingText').textContent=t;}});
 resize();try{await scene.prepare([item]);museumReady=true;resize();scene.focus(item.id);scene.render();}
 catch(error){console.error('Museum preparation',error);sceneFailed=true;$('museumFallback').hidden=false;}
 $('museumLoading').hidden=true;controls();schedule();setTimeout(()=>{if(!disposed)prepareViewer();},600);
}
window.scrollMuseum=Object.freeze({
 take,putBack,open:()=>viewer?.animate(1),close:()=>viewer?.animate(0),
 setProgress:p=>viewer?.setProgress(p,{immediate:true}),
 snapshot:()=>({ready:museumReady,prepared,phase,progress,viewerActive,viewerUnavailable,alignment,transfer:transfer?{kind:transfer.kind,elapsed:transfer.elapsed}:null,returnRequested,sceneFailed,scene:scene?.snapshot(),viewer:viewer?.snapshot(),audio:sound.snapshot(),issued:false}),
 exportRecord:()=>viewer?.exportRecord(),exportDocument:()=>viewer?.exportDocument(),
 dispose:()=>{if(disposed)return;disposed=true;cancelAnimationFrame(frame);observer.disconnect();viewer?.dispose();scene?.dispose();sound.dispose();}
});
setup().catch(error=>{console.error(error);$('museumLoading').hidden=true;$('museumFallback').hidden=false;say('藏馆暂未准备好，可查看独立卷轴。');});
