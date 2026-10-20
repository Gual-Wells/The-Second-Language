import {ScrollObject} from '../chapter-scroll-v19/scroll-object.js';
import {ViewerAtmosphere} from './viewer-atmosphere.js';
import {Motion} from '../chapter-scroll-runtime/motion.js';
import {getTemplate} from '../chapter-scroll-v17/templates.js';
import {createDocument,populateTranscript as writeTranscript,documentLines,prepareSeal} from '../chapter-scroll-v14/document.js';
import {prepareCharter} from '../chapter-scroll-v14/charter.js';
import {ViewerResources} from './viewer-resources.js';

const source=new URL('../chapter-scroll-v14/',import.meta.url);
const clamp=value=>Math.max(0,Math.min(1,Number(value)||0));
const aborted=()=>new DOMException('The scroll viewer was disposed','AbortError');
function releaseContext(canvas,gl,release){
 const extension=gl?.getExtension('WEBGL_lose_context');if(!extension||gl.isContextLost())return false;
 const restore=event=>{event.preventDefault();setTimeout(()=>{if(gl.isContextLost())extension.restoreContext();},0);};
 canvas.addEventListener('webglcontextlost',restore,{once:true});release();return true;
}

// Host adapter for the accepted v20 specimen. Paper, physical keeper, finishing,
// projection and mist remain the existing implementations and asset bytes.
// This module does not bind document IDs, issue a work or synthesize a chapter.
export class ScrollViewer {
 constructor(canvas,mistCanvas,{onProgress=()=>{},onStatus=()=>{}}={}){
  if(!(canvas instanceof HTMLCanvasElement)||!(mistCanvas instanceof HTMLCanvasElement))throw TypeError('Two canvas elements are required');
  this.canvas=canvas;this.mistCanvas=mistCanvas;this.onProgress=onProgress;this.onStatus=onStatus;
  this.resources=new ViewerResources();this.disposers=[];this.ready=false;this.disposed=false;this.paused=false;this.lost=false;this.progress=0;this.frame=0;this.previousTime=0;this.animation=null;this.drag=null;this.status='idle';this.size=null;this.mistLost=false;
  // v20's field is a 160% x 130% overscan canvas. The host may prepare while
  // its viewing layer has display:none; native client sizes are then zero.
  // Forward the real canvas context, with measured host sizes only as fallback.
  this.mistSurface=new Proxy(mistCanvas,{get:(target,key)=>{
   if(key==='clientWidth')return target.clientWidth||Math.max(1,(this.size?.[0]||1)*1.6);
   if(key==='clientHeight')return target.clientHeight||Math.max(1,(this.size?.[1]||1)*1.3);
   const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;
  },set:(target,key,value)=>Reflect.set(target,key,value,target)});
  this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.atmosphereWanted=!this.reduced.matches;
  this.listen(document,'visibilitychange',()=>{if(document.hidden)this.suspend();else if(!this.paused)this.resume();});
  this.listen(this.reduced,'change',()=>{if(this.reduced.matches){this.setAtmosphere(false);if(this.animation)this.setProgress(this.animation.to);}});
  this.listen(canvas,'webglcontextlost',event=>this.contextLost(event));
  this.listen(canvas,'webglcontextrestored',()=>this.restoreContext());
  this.listen(mistCanvas,'webglcontextlost',event=>{event.preventDefault();if(this.disposed)return;this.mistLost=true;this.mist?.setEnabled(false);this.report('雾染暂时中断，藏卷仍可观赏。','mist-unavailable');});
  this.listen(mistCanvas,'webglcontextrestored',()=>{if(this.disposed)return;this.mistLost=false;if(this.ready)this.prepareMist({restored:true}).then(()=>this.schedule()).catch(()=>{});});
 }
 listen(target,type,fn,options){target.addEventListener(type,fn,options);this.disposers.push(()=>target.removeEventListener(type,fn,options));}
 report(message,status=this.status){if(this.disposed)return;this.status=status;this.onStatus(message,{status,ready:this.ready});}
 signalProgress({velocity=0,active=false,direction=0}={}){
  if(this.disposed)return;
  this.onProgress({progress:this.progress,velocity,active,direction,phase:this.object?.closure?.snapshot()?.phase||'closed',paperProgress:this.object?.paperProgress??0});
 }
 async prepare(options={}){
  if(this.disposed)throw aborted();
  const chapter=options.chapter||options.chapterId||'five';
  if(!['five','2026-10-12',5].includes(chapter))throw Error('This viewer contains the fifth-chapter specimen only; other chapters are not substituted.');
  if(this.preparation)return this.preparation;
  this.preparation=this.prepareFifth(options).catch(error=>{
   if(!this.disposed){this.ready=false;this.lastError=error.message;this.report('立体藏卷暂不可用，仍可查看已备好的纸面与释读。','failed');this.resources.dispose();}
   throw error;
  });
  return this.preparation;
 }
 async prepareFifth({initialProgress=0}={}){
  const owned=this.resources;
  this.report('正在取出第五章样品…','preparing');
  const [base,plan]=await Promise.all([owned.json(new URL('chapter-sample.json',source)),owned.text(new URL('art-plan.json',source))]);
  const record=await prepareCharter(base,plan);owned.assertAlive();this.record=record;
  const template=getTemplate(record.template);this.template=template;
  await owned.font(template.fontFamily,template.fontUrl);
  const [paper,back,keeper,ornament]=await Promise.all([template.skin,template.reverse,template.keeper,template.ornament].map(url=>owned.image(url)));
  const images=[paper,back,keeper,ornament];
  try{
   await prepareSeal();owned.assertAlive();
   this.textures=createDocument(record,paper,back,template,ornament);
   this.object=new ScrollObject(this.canvas,this.textures,keeper,template);
   this.attachObjectLifetime(this.object,owned);
  }finally{for(const image of images)if(image!==keeper||!this.object)owned.releaseImage(image);}
  owned.assertAlive();
  this.object.closure.onLoadingProgress=value=>this.report(value<1?`正在载入实体皮扣… ${Math.round(value*100)}%`:'正在准备藏卷…','preparing');
  if(!this.size){
   let host=this.canvas;
   while(host&&(!host.clientWidth||!host.clientHeight))host=host.parentElement;
   this.size=[host?.clientWidth||1,host?.clientHeight||1];
  }
  this.resize(...this.size);
  this.report('正在准备纸张、皮扣与动作…','preparing');
  const initial=clamp(initialProgress);
  await this.object.prepareMotion(initial);owned.assertAlive();
  await this.prepareMist();owned.assertAlive();
  this.progress=initial;this.object.setProgress(initial);this.object.settle();this.ready=true;this.previousTime=performance.now();
  this.render();this.signalProgress();this.report('设计试样 · 尚未颁发','ready');this.schedule();
  return this;
 }
 attachObjectLifetime(object,owned){
  const collect=()=>{
   owned.scene(object.scene);owned.scene(object.closure?.model);owned.own(object.geometry);owned.own(object.sealBump);
   owned.own(object.environment);owned.own(object.closure?.curve);
   for(const map of [...object.maps,...(object.closure?.maps||[])])owned.own(map);
   owned.own(object.keeper?.geometry);owned.material(object.keeper?.material);
  };
  // The old loaders have non-cancellable decode callbacks. A late HDR upload
  // must also be owned even if a sibling loader failed or navigation happened.
  let environment=object.environment;
  Object.defineProperty(object,'environment',{configurable:true,get:()=>environment,set:value=>{
   environment=value;owned.own(value);
   if(owned.disposed)queueMicrotask(()=>{object.renderer.dispose();releaseContext(this.canvas,object.renderer.getContext(),()=>object.renderer.forceContextLoss());});
  }});
  const originalRender=object.render.bind(object);
  object.render=(...args)=>{if(!owned.disposed)return originalRender(...args);};
  const environmentReady=object.environmentReady;
  object.environmentReady=environmentReady.then(()=>{collect();owned.assertAlive();});
  // Explicit rejection handlers keep cancelled in-flight loads from producing
  // an unhandled promise; the prepare() caller still receives its real error.
  object.environmentReady.catch(()=>collect());
  object.closure.ready.then(collect,collect);
  collect();owned.own(object.renderer);
 }
 async prepareMist({restored=false}={}){
  if(this.disposed||this.reduced.matches||this.mistLost){this.mistCanvas.hidden=true;return;}
  const old=this.mist;this.mist=null;
  // Context loss already released the old fluid targets. Calling its legacy
  // dispose after restoration would lose the newly restored context again.
  if(restored&&old){old.fluid=null;old.dispose();}else this.disposeMist(old);
  const mist=new ViewerAtmosphere(this.mistSurface,{signal:this.resources.controller.signal});this.mist=mist;
  try{
   await mist.prepare();
   if(this.disposed||this.mist!==mist){this.disposeMist(mist);return;}
   mist.setEnabled(this.atmosphereWanted&&!this.paused);this.mistCanvas.hidden=!this.atmosphereWanted||this.paused;
  }catch(error){
   this.disposeMist(mist);if(this.mist===mist)this.mist=null;
   if(!this.disposed){this.mistCanvas.hidden=true;this.mistError=error.message;}
  }
 }
 disposeMist(mist){
  if(!mist)return;
  if(!mist.fluid){mist.dispose();return;}
  if(mist.releasedFluid===mist.fluid)return;mist.releasedFluid=mist.fluid;
  const gl=this.mistCanvas.getContext('webgl2')||this.mistCanvas.getContext('webgl');
  // The legacy fluid disposes by losing its dedicated GL context. Restore an
  // empty context afterwards so a retry can reuse the host's same canvas.
  if(!releaseContext(this.mistCanvas,gl,()=>mist.dispose()))mist.dispose();
 }
 resize(width,height){
  if(!(width>0&&height>0)||this.disposed)return;
  this.size=[width,height];if(!this.object||this.lost)return;
  this.object.resize(width,height);this.mist?.resetMotion();this.render();
 }
 render(){if(this.object&&this.ready&&!this.disposed&&!this.lost&&!this.paused&&!document.hidden)this.object.render();}
 schedule(){
  if(this.frame||this.disposed||this.paused||this.lost||document.hidden||!this.ready)return;
  if(this.animation||this.object.needsMotion||(this.atmosphereWanted&&!this.reduced.matches&&this.mist?.fluid&&!this.mistLost))this.frame=requestAnimationFrame(now=>this.tick(now));
 }
 tick(now){
  this.frame=0;if(this.disposed||this.paused||this.lost||document.hidden||!this.ready)return;
  const elapsed=now-this.previousTime;if(elapsed<7){this.schedule();return;}
  const dt=Math.min(.05,(elapsed||40)/1000);this.previousTime=now;
  if(this.animation){
   const animation=this.animation,previous=this.progress,sample=animation.sample(now);
   this.progress=sample.progress;this.object.setProgress(this.progress);
   const velocity=(this.progress-previous)/Math.max(.001,elapsed/1000),direction=Math.sign(animation.to-animation.from);
   this.signalProgress({velocity,active:!sample.done,direction});
   if(sample.done){this.animation=null;this.finishAnimation({completed:true,progress:this.progress});this.report('设计试样 · 尚未颁发','ready');}
  }
  this.object.advance(dt);if(this.animation||this.object.needsMotion||this.object.dirty)this.render();
  if(this.atmosphereWanted&&!this.reduced.matches&&!this.mistLost)this.mist?.tick(dt,this.progress,this.object.bounds,this.object.viewHeight,Math.max(.001,elapsed/1000),this.object.interaction());
  this.schedule();
 }
 animate(to){
  if(!this.ready||this.disposed||this.lost)return Promise.resolve({completed:false,reason:'unavailable'});
  to=clamp(to);this.finishAnimation({completed:false,reason:'superseded'});
  if(this.reduced.matches||Math.abs(to-this.progress)<.000001){this.setProgress(to);return Promise.resolve({completed:true,progress:to});}
  this.animation=new Motion(this.progress,to,performance.now());
  const result=new Promise(resolve=>{this.animationComplete=resolve;});
  this.report(to?'藏卷展开中…':'藏卷收起中…','animating');this.signalProgress({active:true,direction:Math.sign(to-this.progress)});this.schedule();return result;
 }
 finishAnimation(result){const resolve=this.animationComplete;this.animationComplete=null;resolve?.(result);}
 setProgress(value,{immediate=true}={}){
  if(!immediate)return this.animate(value);
  if(!this.object||this.disposed||this.lost)return;
  this.finishAnimation({completed:false,reason:'set-progress'});this.animation=null;
  this.progress=clamp(value);this.object.setProgress(this.progress);this.object.settle();this.mist?.resetMotion();this.signalProgress();this.render();this.schedule();
 }
 setAtmosphere(on){
  this.atmosphereWanted=Boolean(on)&&!this.reduced.matches;
  this.mist?.setEnabled(this.atmosphereWanted&&!this.paused&&!this.lost&&!this.mistLost);this.mistCanvas.hidden=!this.atmosphereWanted||this.paused||this.lost||this.mistLost;
  if(!this.atmosphereWanted&&!this.animation&&!this.object?.needsMotion){cancelAnimationFrame(this.frame);this.frame=0;}
  this.schedule();
 }
 suspend(){cancelAnimationFrame(this.frame);this.frame=0;this.drag=null;this.mist?.resetMotion();this.signalProgress();}
 pause(){if(this.disposed)return;this.paused=true;this.suspend();this.mist?.setEnabled(false);}
 resume(){
  if(this.disposed||document.hidden)return;this.paused=false;this.previousTime=performance.now();this.animation?.resume(this.previousTime);
  this.mist?.setEnabled(this.atmosphereWanted&&!this.mistLost&&!this.lost);this.render();this.schedule();
 }
 // Explicit binding lets the host choose whether taps mean select, take out or
 // toggle. Binding this only at the viewing desk prevents gesture ambiguity.
 bindPointerInput(){
  if(this.pointerBound||this.disposed)return;this.pointerBound=true;
  this.listen(this.canvas,'pointerdown',event=>this.pointerDown(event));
  this.listen(this.canvas,'pointermove',event=>this.pointerMove(event));
  this.listen(this.canvas,'pointerup',event=>this.pointerUp(event));
  this.listen(this.canvas,'pointercancel',event=>this.pointerCancel(event));
  this.listen(this.canvas,'lostpointercapture',()=>{this.drag=null;});
 }
 pointerDown(event){
  if(!this.ready||this.paused||this.lost||this.disposed||(event.pointerType==='mouse'&&event.button!==0))return;
  const target=this.animation?.to;this.finishAnimation({completed:false,reason:'pointer'});this.animation=null;
  this.drag={id:event.pointerId,y:event.clientY,p:this.progress,moved:false,target,time:performance.now()};this.canvas.setPointerCapture(event.pointerId);
 }
 pointerMove(event){
  const drag=this.drag;if(!drag||drag.id!==event.pointerId||this.disposed)return;
  const dy=event.clientY-drag.y;if(Math.abs(dy)>9)drag.moved=true;if(!drag.moved)return;
  const now=performance.now(),previous=this.progress;this.progress=clamp(drag.p+dy/((this.size?.[1]||1)*.64));this.object.setProgress(this.progress);
  this.signalProgress({velocity:(this.progress-previous)/Math.max(.001,(now-drag.time)/1000),active:true,direction:Math.sign(this.progress-previous)});drag.time=now;this.render();this.schedule();
 }
 pointerUp(event){
  const drag=this.drag;if(!drag||drag.id!==event.pointerId)return;this.drag=null;
  if(this.canvas.hasPointerCapture(event.pointerId))this.canvas.releasePointerCapture(event.pointerId);
  this.animate(drag.moved?(this.progress>=.5?1:0):drag.target!==undefined?(drag.target?0:1):(this.progress>=.5?0:1));
 }
 pointerCancel(event){if(this.drag?.id!==event.pointerId)return;const target=this.drag.target;this.drag=null;if(target!==undefined)this.animate(target);else this.signalProgress();}
 contextLost(event){
  event.preventDefault();if(this.disposed)return;this.lost=true;this.ready=false;this.suspend();this.mist?.setEnabled(false);
  this.report('立体显示中断，可查看静态卷页。','context-lost');
 }
 async restoreContext(){
  if(this.disposed)return;this.lost=false;if(!this.object)return;this.ready=false;this.report('正在恢复藏卷…','restoring');
  try{
   if(this.size)this.object.resize(...this.size);
   await this.object.prepareMotion(this.progress);this.resources.assertAlive();this.ready=true;this.mist?.resetMotion();
   this.previousTime=performance.now();this.animation?.resume(this.previousTime);this.mist?.setEnabled(this.atmosphereWanted&&!this.paused&&!this.mistLost);this.render();this.schedule();this.report('设计试样 · 尚未颁发','ready');
  }catch(error){if(!this.disposed){this.lastError=error.message;this.report('立体显示暂不可用，可查看静态卷页。','failed');}}
 }
 getTranscript(){return this.record?documentLines(this.record):[];}
 getClosedScreenPose(){
  if(!this.object||!this.size)return null;
  const o=this.object,[width,height]=this.size,z=o.closure?.radius||0,points=[];
  for(const x of [-o.width/2,o.width/2])for(const y of [o.bounds.bottom,o.bounds.top]){
   const v=o.camera.position.clone().set(x,y,z).project(o.camera);points.push({x:(v.x*.5+.5)*width,y:(.5-v.y*.5)*height});
  }
  const xs=points.map(p=>p.x),ys=points.map(p=>p.y),left=Math.min(...xs),top=Math.min(...ys);
  return{x:(left+Math.max(...xs))/2,y:(top+Math.max(...ys))/2,width:Math.max(...xs)-left,height:Math.max(...ys)-top,units:'css-pixels'};
 }
 populateTranscript(container){if(this.record)writeTranscript(container,this.record);else container.replaceChildren();}
 exportDocument(){return this.textures?.front.toDataURL('image/png')??null;}
 exportRecord(){
  const r=this.record;if(!r)return null;
  return {status:r.status,recipient:r.recipient,chapterId:r.chapterId,chapterNumber:r.chapterNumber,sha256:r.artifactDigest,canonicalPayload:r.canonicalPayload,proof:r.proof,sealVariant:r.sealVariant,artPlanDigest:r.artPlanDigest,source:r.artPlan.source};
 }
 snapshot(){return {...this.object?.snapshot(),ready:this.ready,disposed:this.disposed,paused:this.paused,lost:this.lost,environmentAvailable:Boolean(this.object?.scene.environment),contextReleased:Boolean(this.contextReleased),animating:Boolean(this.animation),chapterId:this.record?.chapterId,issued:false,status:this.status,error:this.lastError||null,layout:this.textures?.layout,mist:this.mist?.snapshot()??{available:false},atmosphereWanted:this.atmosphereWanted};}
 dispose(){
  if(this.disposed)return;this.disposed=true;cancelAnimationFrame(this.frame);this.frame=0;this.drag=null;
  this.finishAnimation({completed:false,reason:'disposed'});this.animation=null;this.ready=false;
  for(const dispose of this.disposers.splice(0))dispose();
  const mist=this.mist;this.mist=null;this.disposeMist(mist);
  // Materials, shadows and targets must dispatch dispose before the renderer
  // clears its WebGL properties. The inherited sample dispose does the reverse
  // for some scene-owned resources, so use the complete ownership registry.
  this.resources.dispose();
  // r186 retains internal shadow/state resources outside the public scene.
  // This renderer owns a dedicated canvas; release its complete GL context only
  // at final disposal, then restore an empty one for an explicit host retry.
  if(this.object)this.contextReleased=releaseContext(this.canvas,this.object.renderer.getContext(),()=>this.object.renderer.forceContextLoss());
  for(const surface of [this.textures?.front,this.textures?.back,this.textures?.ink,this.textures?.relief,this.textures?.seal?.ink,this.textures?.seal?.mask])if(surface){surface.width=1;surface.height=1;}
  this.object?.scene.clear();this.object=null;this.textures=null;
 }
}
