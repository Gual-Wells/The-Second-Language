import * as T from '../certification/vendor/three.module.js';
import {ScrollObject as StableScroll} from '../chapter-scroll-runtime/scroll-object.js';
import {ScrollObject as PaperCore} from '../chapter-scroll-v6/scroll-object.js';
import {Cord,RELEASE_END} from './cord.js';
export class ScrollObject extends StableScroll{
 constructor(...args){
  super(...args);this.closure.dispose();this.closure=new Cord(this.scene,this.template);this.integrated=true;
  const old=this.environmentReady;this.environmentReady=Promise.all([old,this.closure.ready]).then(()=>{
   this.maps.push(...this.closure.maps);for(const map of [this.material.normalMap,this.material.roughnessMap]){map.wrapS=map.wrapT=T.ClampToEdgeWrapping;map.repeat.set(1,1);map.needsUpdate=true;}
   this.material.normalScale.set(.11,.11);this.material.needsUpdate=true;
  });
  // Preserve the fifth chapter's v14 paper, including its two nonuniform folds.
  const folds=shader=>{shader.vertexShader=shader.vertexShader.replace('v.z=.009*sin',`float u=q.x/scrollWidth+.5, sheetV=.5-q.y/scrollHeight;
   float diagonal=exp(-pow((sheetV-(.11+.365*u))/.009,2.))*(1.-smoothstep(.42,.55,u));
   float crossfold=exp(-pow((sheetV-(.645+.04*u))/.010,2.));
   v.z=-.008*diagonal-.011*crossfold;
   v.z+=.009*sin`);};
  for(const material of [this.material,this.sheet.customDepthMaterial]){const previous=material.onBeforeCompile;material.onBeforeCompile=s=>{previous(s);folds(s);};material.customProgramCacheKey=()=>material===this.material?'cord-v14-folds':'cord-v14-fold-shadow';material.needsUpdate=true;}
  this.setProgress(0);
 }
 setProgress(value){
  if(!this.integrated)return super.setProgress(value);
  const raw=T.MathUtils.clamp(value,0,1),paper=T.MathUtils.clamp((raw-RELEASE_END)/(1-RELEASE_END),0,1);
  PaperCore.prototype.setProgress.call(this,.18+.82*paper);this.progress=raw;this.paperProgress=paper;
  this.closure.update(raw,this.height/2+this.sheet.position.y);this.dirty=true;
 }
 async prepareMotion(initial){
  const started=performance.now();await this.environmentReady;for(const map of new Set([...this.maps,this.sealBump]))this.renderer.initTexture(map);
  this.setProgress(0);await this.renderer.compileAsync(this.scene,this.camera);
  for(const p of [0,.09,.19,.29,.36,.38,1,initial]){this.setProgress(p);this.render();await new Promise(r=>requestAnimationFrame(r));}
  this.motionPrepared=true;this.preparationMs=performance.now()-started;this.preparedPrograms=this.renderer.info.programs.length;
 }
 snapshot(){return{...super.snapshot(),edition:'silk-cord raster-frame specimen',paperProgress:this.paperProgress,keeperPose:this.closure.snapshot(),keeperMotion:'64 authored frames plus a screen-plane departure',paperMaterial:'unchanged chapter-five v14'};}
 exportKeeper(){return this.closure.exportFrame();}
 interaction(){
  const project=(x,y,z)=>{const p=new T.Vector3(x,y,z).project(this.camera);return{x:.5+.5*p.x,y:.5+.5*p.y};};
  return{top:[project(-this.width/2,this.bounds.top,0),project(this.width/2,this.bounds.top,0)],bottom:[project(-this.width/2,this.bounds.bottom,0),project(this.width/2,this.bounds.bottom,0)],keeper:this.closure.group.visible?project(this.closure.group.position.x,this.closure.group.position.y,.65):null,paperProgress:this.paperProgress};
 }
}
