import {createFluid} from '../chapter-scroll-v5/vendor/fluid.js';
import {fieldFactory} from './flow.js';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const convert=p=>({x:(p.x+.3)/1.6,y:(p.y+.15)/1.3});
export class Atmosphere{
 constructor(canvas){this.canvas=canvas;this.enabled=true;this.time=0;this.pending=0;this.frames=0;this.previous=null;this.interactionEnergy=0;this.fluid=null;this.randomState=0x53b5a71;this.clouds=Array.from({length:8},()=>this.cloud(true));}
 random(){this.randomState=(Math.imul(this.randomState,1664525)+1013904223)>>>0;return this.randomState/4294967296;}
 cloud(initial=false){const life=14+this.random()*17;return{x:.13+this.random()*.74,y:.09+this.random()*.82,r:.13+this.random()*.17,amplitude:.32+this.random()*.42,birth:initial?-this.random()*life:this.time,life};}
 regions(){const values=[];this.clouds=this.clouds.map(c=>this.time-c.birth>=c.life?this.cloud():c);for(const c of this.clouds){const age=clamp((this.time-c.birth)/c.life,0,1),envelope=Math.pow(Math.sin(Math.PI*age),2);values.push(c.x,c.y,c.r*(.85+.25*age),c.amplitude*envelope);}return values;}
 async prepare(progress,bounds,viewHeight,interaction){
  const noise=await(await fetch('vendor/noise2D.glsl')).text();
  this.fluid=createFluid(this.canvas,{simResolution:96,dyeResolution:512,maxPixelRatio:1.5,densityDissipation:.24,curl:3,fieldFactory:fieldFactory(noise)});
  for(const [x,y,amount]of [[.18,.32,.55],[.83,.68,.6],[.3,.79,.34],[.65,.2,.30],[.5,.5,.13]])this.fluid.seed(x,y,amount,3);
  const zero={edges:[.7,0,.3,0],keeper:[-2,-2,0,0],span:[.24,.76],regions:this.regions()};
  // Establish the ambient field before showing it; no visible start-up emitter.
  for(let i=0;i<36;i++){this.fluid.fields(i/30,1/30,zero);this.fluid.tick(1/30);if(i%6===0)await new Promise(r=>requestAnimationFrame(r));}
  this.time=1.2;this.resetMotion();
 }
 tick(dt,progress,bounds,viewHeight,elapsed=dt,interaction){
  if(!this.enabled||!this.fluid)return;this.pending+=Math.min(.1,elapsed);if(this.pending<1/30)return;
  const step=Math.min(.05,this.pending);this.pending=0;this.time+=step;
  const current=interaction??{top:[{x:.2,y:.5+bounds.top/viewHeight},{x:.8,y:.5+bounds.top/viewHeight}],bottom:[{x:.2,y:.5+bounds.bottom/viewHeight},{x:.8,y:.5+bounds.bottom/viewHeight}],keeper:null};
  const a=convert(current.top[0]),b=convert(current.bottom[0]),right=convert(current.top[1]);
  const prev=this.previous,valid=prev&&Math.abs(progress-prev.progress)<.15;
  const top=valid?clamp((a.y-prev.top)/step,-.6,.6):0,bottom=valid?clamp((b.y-prev.bottom)/step,-.6,.6):0;
  const k=current.keeper?convert(current.keeper):null,pk=valid?prev.keeper:null;
  const vx=k&&pk?clamp((k.x-pk.x)/step,-.6,.6):0,vy=k&&pk?clamp((k.y-pk.y)/step,-.6,.6):0;
  this.fluid.fields(this.time,step,{edges:[a.y,top,b.y,bottom],span:[a.x,right.x],keeper:k?[k.x,k.y,vx,vy]:[-2,-2,0,0],regions:this.regions()});
  this.interactionEnergy+=(Math.abs(top)+Math.abs(bottom)+Math.abs(vx)+Math.abs(vy))*step;
  this.previous={top:a.y,bottom:b.y,keeper:k,progress};this.fluid.tick(step);this.frames++;
 }
 resetMotion(){this.previous=null;this.pending=0;}
 setEnabled(value){this.enabled=value;this.canvas.hidden=!value||!this.fluid;this.resetMotion();}
 snapshot(){return{available:Boolean(this.fluid),enabled:this.enabled,frames:this.frames,time:this.time,interactionEnergy:this.interactionEnergy,model:'2D advected dye; eight spatial cloud lifecycles, multi-scale curl forcing and signed sheet/keeper velocity',simulationHz:30,dyeResolution:512,fixedDirectionalInlet:false};}
 dispose(){this.fluid?.dispose();}
}
