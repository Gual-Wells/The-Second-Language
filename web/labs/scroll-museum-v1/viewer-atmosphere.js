import {Atmosphere} from '../chapter-scroll-v20/mist.js';
import {createFluid} from '../chapter-scroll-v5/vendor/fluid.js';
import {fieldFactory} from '../chapter-scroll-v20/flow.js';

// Identical v20 simulation parameters and 60 prewarm steps. Only asynchronous
// preparation gains cancellation; fields(), tick() and motion remain inherited.
export class ViewerAtmosphere extends Atmosphere {
 constructor(canvas,{signal}={}){super(canvas);this.controller=new AbortController();this.signal=signal?AbortSignal.any([signal,this.controller.signal]):this.controller.signal;}
 check(){if(this.signal.aborted)throw new DOMException('Atmosphere preparation cancelled','AbortError');}
 frame(){return new Promise((resolve,reject)=>{
  this.check();let frame;
  const abort=()=>{cancelAnimationFrame(frame);reject(new DOMException('Atmosphere preparation cancelled','AbortError'));};
  this.signal.addEventListener('abort',abort,{once:true});
  frame=requestAnimationFrame(()=>{this.signal.removeEventListener('abort',abort);resolve();});
 });}
 async prepare(){
  const response=await fetch(new URL('../chapter-scroll-v17/vendor/noise2D.glsl',import.meta.url),{signal:this.signal});
  if(!response.ok)throw Error('Atmosphere noise source unavailable');
  const noise=await response.text();this.check();
  this.fluid=createFluid(this.canvas,{simResolution:96,dyeResolution:512,maxPixelRatio:1.5,densityDissipation:.22,curl:.38,fieldFactory:fieldFactory(noise)});
  for(const[x,y,a]of[[.18,.32,.55],[.83,.68,.6],[.3,.79,.34],[.65,.2,.30]])this.fluid.seed(x,y,a,3);
  const step=1/30;
  for(let i=0;i<60;i++){
   this.check();this.time+=step;this.fluid.fields(this.time,step,{edges:[-2,0,-2,0],keeper:[-2,-2,0,0],span:[0,1],...this.fields(),interactionGain:this.interactionGain});this.fluid.tick(step);
   if(i%6===5)await this.frame();
  }
  this.check();this.resetMotion();
 }
 dispose(){this.controller.abort();super.dispose();}
}
