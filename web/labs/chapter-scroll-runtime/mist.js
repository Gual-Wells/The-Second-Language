import {Atmosphere as ApprovedAtmosphere} from '../chapter-scroll-v6/mist.js';
import {createFluid} from '../chapter-scroll-v5/vendor/fluid.js';
// Fog is deliberately low frequency. Its simulation has its own 30 Hz budget;
// the document continues to use display refresh and its full-resolution buffer.
export class Atmosphere extends ApprovedAtmosphere {
 constructor(canvas){super(canvas,{fluidFactory:c=>createFluid(c,{dyeResolution:256,maxPixelRatio:1})});this.pendingTime=0;this.motionTime=0;}
 prepare(progress,bounds,viewHeight){
  if(!this.fluid)return;
  super.tick(1/30,progress,bounds,viewHeight,1/30);super.tick(1/30,progress,bounds,viewHeight,1/30);this.resetMotion();
 }
 tick(dt,progress,bounds,viewHeight,elapsed=dt){
  if(!this.enabled||!this.fluid)return;
  this.pendingTime+=Math.min(.1,elapsed);this.motionTime+=elapsed;
  if(this.pendingTime<1/30)return;
  const step=Math.min(.05,this.motionTime);this.pendingTime%=1/30;
  super.tick(step,progress,bounds,viewHeight,this.motionTime);this.motionTime=0;
 }
 resetMotion(){super.resetMotion();this.pendingTime=0;this.motionTime=0;}
 snapshot(){return {...super.snapshot(),simulationHz:30,dyeResolution:256,maxPixelRatio:1};}
}
