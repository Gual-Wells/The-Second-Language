import {ScrollObject} from '../chapter-scroll-runtime/scroll-object.js';
import {Atmosphere} from '../chapter-scroll-runtime/mist.js';
import {Motion} from '../chapter-scroll-runtime/motion.js';
import {getTemplate} from './templates.js';
import {createDocument,loadImage,populateTranscript,prepareSeal} from './document.js';
import {prepareCharter} from './charter.js';
const $=id=>document.getElementById(id),canvas=$('scrollCanvas'),stage=$('stage');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let object,mist,textures,record,ready=false,lost=false,progress=0,animation=null,frame=0,previousTime=0,drag=null;
let atmosphereWanted=!reduced.matches;
let baseRecord,paperImage,backImage,ornamentImage,currentTemplate,switching=false;
const message=t=>$('status').textContent=t;
function controls(){
 const label=progress>=.5?'收卷':'启卷';if($('toggle').textContent!==label)$('toggle').textContent=label;
 $('toggle').setAttribute('aria-label',progress>=.5?'收起藏卷':'展开藏卷');
 $('unfoldHint').hidden=progress>.025||Boolean(animation)||!ready;
 $('mistToggle').setAttribute('aria-pressed',String(atmosphereWanted));
}
function deform(p){progress=Math.max(0,Math.min(1,p));object.setProgress(progress);controls();}
function schedule(){if(!frame&&!lost&&!document.hidden&&ready&&(animation||object?.needsMotion||(atmosphereWanted&&!reduced.matches)))frame=requestAnimationFrame(tick);}
function render(){if(object&&ready&&!lost&&!document.hidden)object.render();}
function tick(now){
 frame=0;if(lost||document.hidden||!ready)return;
 const elapsed=now-previousTime;
 // One refresh-driven scheduler; 60/120 Hz are not deliberately divided.
 if(elapsed<7){schedule();return;}
 const dt=Math.min(.05,(elapsed||40)/1000);previousTime=now;
 if(animation){
  const sample=animation.sample(now);deform(sample.progress);
  if(sample.done){animation=null;controls();message('设计试样 · 尚未颁发');}
 }
 object.advance(dt);if(animation||object.needsMotion||object.dirty)render();
 if(atmosphereWanted&&!reduced.matches)mist?.tick(dt,progress,object.bounds,object.viewHeight,Math.max(.001,elapsed/1000));
 schedule();
}
function animate(to,{immediate=false}={}){
 if(!ready||lost)return;
 if(immediate||reduced.matches){animation=null;mist?.resetMotion();deform(to);object.settle();render();message('设计试样 · 尚未颁发');schedule();return;}
 animation=new Motion(progress,to,performance.now());
 controls();message(to?'藏卷展开中…':'藏卷收起中…');schedule();
}
function toggle(){animate(animation?(animation.to?0:1):(progress>=.5?0:1));}
function resize(){if(!object||lost)return;const {width,height}=stage.getBoundingClientRect();object.resize(width,height);render();}
function objectOnly(on){document.body.classList.toggle('scroll-object-only',on);$('leaveObject').hidden=!on;requestAnimationFrame(resize);}
async function setup(){
 canvas.style.visibility='hidden';$('mistCanvas').style.visibility='hidden';
 const response=await fetch('chapter-sample.json',{signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error('Chapter unavailable');baseRecord=await response.json();
 const params=new URL(location.href).searchParams,chosen=params.get('seal');record=await prepareCharter({...baseRecord,sealVariant:chosen==='round'?'round':'oblong'});
 updateText();
 const template=getTemplate(record.template);
 currentTemplate=template;
 const font=new FontFace(template.fontFamily,`url(${template.fontUrl})`);document.fonts.add(await font.load());
 const [paper,back,keeper,ornament]=await Promise.all([template.skin,template.reverse,template.keeper,template.ornament].map(loadImage));
 paperImage=paper;backImage=back;ornamentImage=ornament;
 await prepareSeal();
 textures=createDocument(record,paper,back,template,ornament);updateProof();
 object=new ScrollObject(canvas,textures,keeper,template);
 const initialProgress=reduced.matches||params.get('open')==='1'?1:0;
 new ResizeObserver(resize).observe(stage);resize();
 $('loading').textContent='正在准备藏卷…';await object.prepareMotion(initialProgress);
 if(!reduced.matches){mist=new Atmosphere($('mistCanvas'));mist.prepare(initialProgress,object.bounds,object.viewHeight);}else $('mistCanvas').hidden=true;
 if(!mist?.fluid){atmosphereWanted=false;$('mistToggle').disabled=true;$('mistToggle').textContent='静景';}
 ready=true;deform(initialProgress);object.settle();render();previousTime=performance.now();
 canvas.style.visibility='';$('mistCanvas').style.visibility='';$('loading').hidden=true;
 for(const id of ['toggle','replay','detail','objectOnly'])$(id).disabled=false;
 controls();schedule();
 if(new URL(location.href).searchParams.get('view')==='object')objectOnly(true);
 window.scrollSpecimen=Object.freeze({
  open:()=>animate(1),close:()=>animate(0),setProgress:p=>animate(p,{immediate:true}),
  atmosphere:on=>setAtmosphere(on),
  snapshot:()=>({...object.snapshot(),ready,animating:Boolean(animation),chapterId:record.chapterId,issued:false,layout:textures.layout,mist:mist?.snapshot()??{available:false}}),
  exportObject:()=>object.exportObject(),exportDocument:()=>textures.front.toDataURL('image/png'),
  exportSeal:()=>textures.seal.ink.toDataURL('image/png'),
  exportSealHeight:()=>textures.relief.toDataURL('image/png'),
  exportRecord:()=>({status:record.status,recipient:record.recipient,sha256:record.artifactDigest,canonicalPayload:record.canonicalPayload,proof:record.proof,sealVariant:record.sealVariant}),
  setSeal:variant=>switchSeal(variant)
 });
}
function updateText(){
 populateTranscript($('transcriptContent'),record);populateTranscript($('fallbackDocument'),record);
 $('proofIdentity').textContent=`归属：${record.recipient}\n样品时间：${record.proof.sampleTime}\nSHA-256：${record.artifactDigest}`;
}
function updateProof(){
 updateText();
 $('detailImage').src=textures.front.toDataURL('image/png');
 $('sealOblong').setAttribute('aria-pressed',String(record.sealVariant==='oblong'));$('sealRound').setAttribute('aria-pressed',String(record.sealVariant==='round'));
}
async function switchSeal(variant){
 if(!ready||switching||variant===record.sealVariant)return;
 switching=true;$('sealOblong').disabled=$('sealRound').disabled=true;
 try{
  const next=await prepareCharter({...baseRecord,sealVariant:variant}),surfaces=createDocument(next,paperImage,backImage,currentTemplate,ornamentImage);
  object.setSurfaces(surfaces);record=next;textures=surfaces;updateProof();render();
  const url=new URL(location.href);url.searchParams.set('seal',variant);history.replaceState(null,'',url);message('设计试样 · 尚未颁发');
 }catch(error){console.error(error);message('藏记暂未切换，请重试。');}
 finally{switching=false;$('sealOblong').disabled=$('sealRound').disabled=false;}
}
$('sealOblong').addEventListener('click',()=>switchSeal('oblong'));$('sealRound').addEventListener('click',()=>switchSeal('round'));
function setAtmosphere(on){atmosphereWanted=Boolean(on)&&!reduced.matches&&Boolean(mist?.fluid);mist?.setEnabled(atmosphereWanted);controls();if(!atmosphereWanted&&!animation&&!object?.needsMotion){cancelAnimationFrame(frame);frame=0;}schedule();}
$('toggle').addEventListener('click',toggle);$('unfoldHint').addEventListener('click',toggle);
$('replay').addEventListener('click',()=>{animate(0,{immediate:true});animate(1);});
$('mistToggle').addEventListener('click',()=>setAtmosphere(!atmosphereWanted));
$('detail').addEventListener('click',()=>{$('transcriptDialog').showModal();});
$('detailZoom').addEventListener('click',()=>{const field=document.querySelector('.scroll-document-detail'),on=field.dataset.zoom!=='true';field.dataset.zoom=String(on);$('detailZoom').setAttribute('aria-pressed',String(on));$('detailZoom').textContent=on?'全页':'放大';field.scrollLeft=0;});
$('transcriptDialog').addEventListener('click',e=>{if(e.target===$('transcriptDialog'))$('transcriptDialog').close();});
$('objectOnly').addEventListener('click',()=>objectOnly(true));$('leaveObject').addEventListener('click',()=>objectOnly(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape')objectOnly(false);});
canvas.addEventListener('pointerdown',e=>{
 if(!ready||lost||(e.pointerType==='mouse'&&e.button!==0))return;
 const target=animation?.to;animation=null;
 drag={id:e.pointerId,y:e.clientY,p:progress,moved:false,target};canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dy=e.clientY-drag.y;if(Math.abs(dy)>9)drag.moved=true;if(drag.moved){deform(drag.p+dy/(stage.clientHeight*.64));render();}});
canvas.addEventListener('pointerup',e=>{if(!drag||drag.id!==e.pointerId)return;const {moved,target}=drag;drag=null;if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(moved)animate(progress>=.5?1:0);else if(target!==undefined)animate(target?0:1);else toggle();});
canvas.addEventListener('pointercancel',()=>{const target=drag?.target;drag=null;if(target!==undefined)animate(target);else{controls();message('设计试样 · 尚未颁发');}});
canvas.addEventListener('lostpointercapture',()=>{drag=null;});
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){cancelAnimationFrame(frame);frame=0;drag=null;mist?.resetMotion();}
 else{previousTime=performance.now();animation?.resume(previousTime);render();schedule();}
});
reduced.addEventListener('change',()=>{if(reduced.matches){setAtmosphere(false);if(animation)animate(animation.to,{immediate:true});}});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;animation=null;cancelAnimationFrame(frame);frame=0;mist?.setEnabled(false);$('fallback').hidden=false;$('unfoldHint').hidden=true;for(const id of ['toggle','replay','objectOnly'])$(id).disabled=true;message('立体显示中断，可查看静态卷页。');});
canvas.addEventListener('webglcontextrestored',async()=>{
 lost=false;ready=false;canvas.style.visibility='hidden';$('loading').hidden=false;
 try{
  resize();await object.prepareMotion(progress);mist?.resetMotion();ready=true;
  $('fallback').hidden=true;canvas.style.visibility='';$('loading').hidden=true;
  for(const id of ['toggle','replay','objectOnly'])$(id).disabled=false;
  mist?.setEnabled(atmosphereWanted);previousTime=performance.now();controls();schedule();
 }catch(error){console.error(error);$('loading').hidden=true;$('fallback').hidden=false;message('立体显示暂不可用，可查看静态卷页。');}
});
setup().catch(error=>{console.error(error);$('loading').hidden=true;canvas.hidden=true;$('fallback').hidden=false;$('unfoldHint').hidden=true;message('藏卷暂不可用，已保留释读。');});
