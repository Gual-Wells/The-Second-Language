import {createFluid} from '../chapter-scroll-v5/vendor/fluid.js';
import {fieldFactory} from './flow.js';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
// Canvas overscan is 160% x 130%, with the same mapping in both directions.
const convert=p=>({x:(p.x+.3)/1.6,y:(p.y+.15)/1.3});
export class Atmosphere{
 constructor(canvas){this.canvas=canvas;this.enabled=true;this.time=0;this.pending=0;this.frames=0;this.previous=null;this.interactionEnergy=0;this.randomState=0x53b5a71;this.clouds=Array.from({length:8},()=>this.cloud(true));this.drive=[0,0,0,0];}
 random(){this.randomState=(Math.imul(this.randomState,1664525)+1013904223)>>>0;return this.randomState/4294967296;}
 cloud(initial=false){const life=12+this.random()*17;return{x:.10+this.random()*.80,y:.07+this.random()*.86,r:.13+this.random()*.17,amplitude:.32+this.random()*.42,birth:initial?-this.random()*life:this.time,life};}
 regions(){const values=[];this.clouds=this.clouds.map(c=>this.time-c.birth>=c.life?this.cloud():c);for(const c of this.clouds){const age=clamp((this.time-c.birth)/c.life,0,1);values.push(c.x,c.y,c.r*(.86+.26*age),c.amplitude*Math.sin(Math.PI*age)**2);}return values;}
 async prepare(){
  const noise=await(await fetch(new URL('./vendor/noise2D.glsl',import.meta.url))).text();
  this.fluid=createFluid(this.canvas,{simResolution:96,dyeResolution:512,maxPixelRatio:1.5,densityDissipation:.25,curl:1.8,fieldFactory:fieldFactory(noise)});
  for(const[x,y,a]of[[.18,.32,.55],[.83,.68,.6],[.3,.79,.34],[.65,.2,.30]])this.fluid.seed(x,y,a,3);
  for(let i=0;i<42;i++){this.fluid.fields(i/30,1/30,{edges:[.7,0,.3,0],keeper:[-2,-2,0,0],span:[.24,.76],regions:this.regions()});this.fluid.tick(1/30);if(i%6===0)await new Promise(r=>requestAnimationFrame(r));}
  this.time=1.4;this.resetMotion();
 }
 tick(dt,progress,bounds,viewHeight,elapsed,interaction){
  if(!this.enabled||!this.fluid)return;this.pending+=Math.min(.07,elapsed);if(this.pending<1/30)return;
  const step=Math.min(.045,this.pending);this.pending=0;this.time+=step;
  const a=convert(interaction.top[0]),b=convert(interaction.bottom[0]),right=convert(interaction.top[1]),p=interaction.paperProgress;
  let k=interaction.keeper?convert(interaction.keeper):null;if(k&&(!Number.isFinite(k.x)||!Number.isFinite(k.y)||k.x<.02||k.x>.98||k.y<.02||k.y>.98))k=null;
  const prev=this.previous,valid=prev&&Math.abs(progress-prev.progress)<.12&&Math.abs(viewHeight-prev.viewHeight)<.001;
  // Closed paper is a single rolled body, not two moving sheet emitters.
  // Band impulses are bounded and filtered before entering the stable solver.
  const movingPaper=valid&&p>.015&&p<.999;
  const raw=[movingPaper?(a.y-prev.top)/step:0,movingPaper?(b.y-prev.bottom)/step:0,k&&valid&&prev.keeper?(k.x-prev.keeper.x)/step:0,k&&valid&&prev.keeper?(k.y-prev.keeper.y)/step:0];
  const blend=1-Math.exp(-step/.12);this.drive=this.drive.map((v,i)=>{v=Number.isFinite(v)?v:0;const target=Number.isFinite(raw[i])?clamp(raw[i],-.18,.18):0;return v+(target-v)*blend;});
  this.fluid.fields(this.time,step,{edges:[a.y,this.drive[0],b.y,this.drive[1]],span:[a.x,right.x],keeper:k?[k.x,k.y,this.drive[2],this.drive[3]]:[-2,-2,0,0],regions:this.regions()});
  this.interactionEnergy+=this.drive.reduce((s,x)=>s+Math.abs(x),0)*step;
  this.previous={top:a.y,bottom:b.y,keeper:k,progress,viewHeight};this.fluid.tick(step);this.frames++;
 }
 resetMotion(){this.previous=null;this.pending=0;this.drive=[0,0,0,0];}
 setEnabled(on){this.enabled=on;this.canvas.hidden=!on||!this.fluid;this.resetMotion();}
 snapshot(){return{available:Boolean(this.fluid),enabled:this.enabled,frames:this.frames,time:this.time,interactionEnergy:this.interactionEnergy,drive:this.drive,model:'bounded local motion over independent evolving curl clouds',simulationHz:30,fixedDirectionalInlet:false};}
 dispose(){this.fluid?.dispose();}
}
