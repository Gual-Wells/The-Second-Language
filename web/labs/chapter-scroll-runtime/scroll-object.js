import {ScrollObject as ApprovedScroll} from '../chapter-scroll-v12/scroll-object.js';
export class ScrollObject extends ApprovedScroll {
 constructor(...args){
  super(...args);this.motionPrepared=false;
  // Keep the same transparent/depth-tested render path throughout the fade.
  // Switching the hoop between opaque and transparent used to compile again.
  const update=this.closure.update.bind(this.closure);
  this.closure.update=(...values)=>{update(...values);for(const mesh of this.closure.parts)mesh.material.transparent=true;};
  this.closure.update(0,0);
 }
 async prepareMotion(initialProgress){
  const started=performance.now();await this.environmentReady;
  for(const map of new Set([...this.maps,this.sealBump]))this.renderer.initTexture(map);
  await this.renderer.compileAsync(this.scene,this.camera);
  // Real draws prepare shadow/depth programs and first-use GPU uploads too.
  // The canvas remains concealed by its normal loading state during this pass.
  for(const p of [0,.11,.225,1,initialProgress]){
   this.setProgress(p);this.render();await new Promise(resolve=>requestAnimationFrame(resolve));
  }
  this.motionPrepared=true;this.preparationMs=performance.now()-started;this.preparedPrograms=this.renderer.info.programs.length;
 }
 snapshot(){return {...super.snapshot(),runtime:{motionPrepared:this.motionPrepared,preparationMs:this.preparationMs,preparedPrograms:this.preparedPrograms,programs:this.renderer.info.programs.length}};}
}
