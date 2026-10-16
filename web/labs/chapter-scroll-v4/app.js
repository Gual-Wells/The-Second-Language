import {ScrollObject} from './scroll-object.js';
import {Atmosphere} from './mist.js';
import {getTemplate} from './templates.js';
import {createDocument,loadImage,populateTranscript} from './document.js';
const $=id=>document.getElementById(id),canvas=$('scrollCanvas'),stage=$('stage');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let object,mist,textures,record,ready=false,lost=false,progress=0,animation=null,frame=0,previousTime=0,drag=null;
let atmosphereWanted=!reduced.matches;
const message=t=>$('status').textContent=t;
function controls(){
 $('toggle').textContent=progress>=.5?'收卷':'启卷';
 $('toggle').setAttribute('aria-label',progress>=.5?'收起藏卷':'展开藏卷');
 $('unfoldHint').hidden=progress>.025||Boolean(animation)||!ready;
 $('mistToggle').setAttribute('aria-pressed',String(atmosphereWanted));
}
function deform(p){progress=Math.max(0,Math.min(1,p));object.setProgress(progress);controls();}
function schedule(){if(!frame&&!lost&&!document.hidden&&ready&&(animation||(atmosphereWanted&&!reduced.matches)))frame=requestAnimationFrame(tick);}
function render(){if(object&&!lost&&!document.hidden)object.render();}
function tick(now){
 frame=0;if(lost||document.hidden||!ready)return;
 const elapsed=now-previousTime;
 // One scheduler for both canvases. Idle atmosphere is capped at 24 fps;
 // scrolling remains at the host refresh rate and only then deforms the mesh.
 if(elapsed<(animation?14:40)){schedule();return;}
 const dt=Math.min(.05,(elapsed||40)/1000);previousTime=now;
 if(animation){
  const t=Math.min(1,(now-animation.start)/animation.duration),e=t*t*(3-2*t);
  deform(animation.from+(animation.to-animation.from)*e);
  if(t===1){animation=null;controls();message('设计试样 · 尚未颁发');}
  render();
 }
 if(atmosphereWanted&&!reduced.matches)mist?.tick(dt,progress,object.bounds,object.viewHeight,Math.max(.001,elapsed/1000));
 schedule();
}
function animate(to,{immediate=false}={}){
 if(!ready||lost)return;
 if(immediate||reduced.matches){animation=null;mist?.resetMotion();deform(to);render();message('设计试样 · 尚未颁发');schedule();return;}
 animation={from:progress,to,start:performance.now(),duration:Math.max(280,Math.abs(to-progress)*5600)};
 controls();message(to?'藏卷展开中…':'藏卷收起中…');schedule();
}
function toggle(){animate(animation?(animation.to?0:1):(progress>=.5?0:1));}
function resize(){if(!object||lost)return;const {width,height}=stage.getBoundingClientRect();object.resize(width,height);render();}
function objectOnly(on){document.body.classList.toggle('scroll-object-only',on);$('leaveObject').hidden=!on;requestAnimationFrame(resize);}
async function setup(){
 const response=await fetch('chapter-sample.json',{signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error('Chapter unavailable');record=await response.json();
 populateTranscript($('transcriptContent'),record);populateTranscript($('fallbackDocument'),record);
 const template=getTemplate(record.template);
 const font=new FontFace(template.fontFamily,`url(${template.fontUrl})`);document.fonts.add(await font.load());
 const [paper,back,keeper]=await Promise.all([template.skin,template.reverse,template.keeper].map(loadImage));
 textures=createDocument(record,paper,back,template);$('detailImage').src=textures.front.toDataURL('image/png');
 object=new ScrollObject(canvas,textures,keeper,template);
 if(!reduced.matches)mist=new Atmosphere($('mistCanvas'));else $('mistCanvas').hidden=true;
 ready=true;deform(reduced.matches?1:0);$('loading').hidden=true;
 for(const id of ['toggle','replay','detail','objectOnly'])$(id).disabled=false;
 if(!mist?.fluid){atmosphereWanted=false;$('mistToggle').disabled=true;$('mistToggle').textContent='静景';}
 controls();
 new ResizeObserver(resize).observe(stage);resize();await object.environmentReady;render();schedule();
 if(new URL(location.href).searchParams.get('view')==='object')objectOnly(true);
 window.scrollSpecimen=Object.freeze({
  open:()=>animate(1),close:()=>animate(0),setProgress:p=>animate(p,{immediate:true}),
  atmosphere:on=>setAtmosphere(on),
  snapshot:()=>({...object.snapshot(),ready,animating:Boolean(animation),chapterId:record.chapterId,issued:false,layout:textures.layout,mist:mist?.snapshot()??{available:false}}),
  exportObject:()=>object.exportObject(),exportDocument:()=>textures.front.toDataURL('image/png')
 });
}
function setAtmosphere(on){atmosphereWanted=Boolean(on)&&!reduced.matches&&Boolean(mist?.fluid);mist?.setEnabled(atmosphereWanted);controls();if(!atmosphereWanted&&!animation){cancelAnimationFrame(frame);frame=0;}schedule();}
$('toggle').addEventListener('click',toggle);$('unfoldHint').addEventListener('click',toggle);
$('replay').addEventListener('click',()=>{animate(0,{immediate:true});animate(1);});
$('mistToggle').addEventListener('click',()=>setAtmosphere(!atmosphereWanted));
$('detail').addEventListener('click',()=>{$('transcriptDialog').showModal();});
$('transcriptDialog').addEventListener('click',e=>{if(e.target===$('transcriptDialog'))$('transcriptDialog').close();});
$('objectOnly').addEventListener('click',()=>objectOnly(true));$('leaveObject').addEventListener('click',()=>objectOnly(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape')objectOnly(false);});
canvas.addEventListener('pointerdown',e=>{
 if(!ready||lost||(e.pointerType==='mouse'&&e.button!==0))return;animation=null;
 drag={id:e.pointerId,y:e.clientY,p:progress,moved:false};canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dy=e.clientY-drag.y;if(Math.abs(dy)>9)drag.moved=true;if(drag.moved){deform(drag.p+dy/(stage.clientHeight*.64));render();}});
canvas.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const moved=drag.moved;drag=null;if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(moved)animate(progress>=.5?1:0);else toggle();});
canvas.addEventListener('pointercancel',()=>{drag=null;controls();message('设计试样 · 尚未颁发');});
canvas.addEventListener('lostpointercapture',()=>{drag=null;});
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){if(animation)animation.remaining=Math.max(0,animation.duration-(performance.now()-animation.start));cancelAnimationFrame(frame);frame=0;drag=null;}
 else{previousTime=performance.now();if(animation){animation.from=progress;animation.start=performance.now();animation.duration=Math.max(1,animation.remaining??animation.duration);}render();schedule();}
});
reduced.addEventListener('change',()=>{if(reduced.matches){setAtmosphere(false);if(animation)animate(animation.to,{immediate:true});}});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;animation=null;cancelAnimationFrame(frame);frame=0;mist?.setEnabled(false);$('fallback').hidden=false;$('unfoldHint').hidden=true;for(const id of ['toggle','replay','objectOnly'])$(id).disabled=true;message('立体显示中断，可查看静态卷页。');});
canvas.addEventListener('webglcontextrestored',()=>{lost=false;$('fallback').hidden=true;for(const id of ['toggle','replay','objectOnly'])$(id).disabled=false;mist?.setEnabled(atmosphereWanted);resize();controls();schedule();});
setup().catch(error=>{console.error(error);$('loading').hidden=true;canvas.hidden=true;$('fallback').hidden=false;$('unfoldHint').hidden=true;message('藏卷暂不可用，已保留释读。');});
