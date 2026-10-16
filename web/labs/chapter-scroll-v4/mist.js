import {createFluid} from './vendor/fluid.js';
export const FIELD=Object.freeze({width:1.6,height:1.3,padX:.3,padY:.15,metresPerWorldUnit:.30/4.5,entrainment:.08,maxAirSpeedMps:.015});
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function motionSpeeds(previous,bounds,elapsed,viewHeight,gridHeight){
 if(!previous||!bounds||elapsed<=0||elapsed>.5||!viewHeight)return{top:0,bottom:0,peakMps:0};
 const metresPerCell=viewHeight*FIELD.metresPerWorldUnit*FIELD.height/gridHeight;
 let peakMps=0;const out={};
 for(const edge of ['top','bottom']){
  const edgeMps=(bounds[edge]-previous[edge])*FIELD.metresPerWorldUnit/elapsed;
  const airMps=clamp(edgeMps*FIELD.entrainment,-FIELD.maxAirSpeedMps,FIELD.maxAirSpeedMps);
  peakMps=Math.max(peakMps,Math.abs(airMps));out[edge]=airMps/metresPerCell;
 }
 return {...out,peakMps};
}
export class Atmosphere {
 constructor(canvas,{fluidFactory=createFluid}={}){
  this.canvas=canvas;this.elapsed=0;this.count=0;this.enabled=true;this.previous=null;this.progress=null;this.viewHeight=null;
  this.peakMps=0;this.ambientDose=0;
  try{this.fluid=fluidFactory(canvas);}catch(error){console.warn('Atmosphere unavailable:',error);this.fluid=null;canvas.hidden=true;}
  // Pre-existing atmosphere; no visible start-up puff. This initial density is
  // spatially broad and quiet, independent of interacting with the document.
  for(const [x,y,amount,radius] of [[.12,.32,.25,3.5],[.25,.12,.16,4],[.62,.15,.10,4.5],[.89,.62,.21,5],[.79,.83,.12,3],[.16,.8,.20,3]])this.fluid?.seed(x,y,amount,radius);
  for(const [x,y,dx,dy] of [[.1,.35,5,1.5],[.1,.78,3,-1],[.5,.055,2,3],[.9,.65,-2,.8]])this.fluid?.stir(x,y,dx,dy,6);
 }
 setEnabled(value){this.enabled=value;this.canvas.hidden=!value||!this.fluid;this.previous=null;}
 resetMotion(){this.previous=null;this.progress=null;}
 tick(dt,progress,bounds,viewHeight,elapsed=dt){
  if(!this.enabled||!this.fluid)return;dt=clamp(dt,0,.05);this.elapsed+=dt;this.count++;
  const t=this.elapsed;
  // Inlets lie outside the cropped viewport. Supply density continuously per
  // second across broad regions, with slow drift instead of a pair of nozzles.
  for(let i=0;i<4;i++){
   const y=.14+i*.23+.025*Math.sin(t*.11+i),amount=dt*(.042+.007*Math.sin(t*.09+i*1.7));
   this.fluid.seed(.105,y,amount,.72);this.fluid.stir(.105,y,dt*7,dt*.8,2.1);this.ambientDose+=amount;
  }
  for(let i=0;i<3;i++){
   const x=.23+i*.27+.015*Math.cos(t*.12+i),amount=dt*.025;
   this.fluid.seed(x,.055,amount,.85);this.fluid.stir(x,.055,dt*2,dt*4,2.2);this.ambientDose+=amount;
  }
  const grid=this.fluid.resolution();
  const valid=this.viewHeight===viewHeight&&this.progress!==null&&Math.abs(progress-this.progress)<.09;
  const speed=motionSpeeds(valid?this.previous:null,bounds,elapsed,viewHeight,grid.height);
  this.peakMps=Math.max(this.peakMps,speed.peakMps);
  for(const edge of ['top','bottom']){
   if(Math.abs(speed[edge])<.001)continue;
   const visibleY=.5+bounds[edge]/viewHeight,y=(visibleY+FIELD.padY)/FIELD.height;
   // Motion supplies only a small velocity impulse to existing fog, no new dye.
   for(const visibleX of [.25,.5,.75])this.fluid.stir((visibleX+FIELD.padX)/FIELD.width,y,0,speed[edge]*dt*.7,1.1);
  }
  this.previous=bounds?{...bounds}:null;this.progress=progress;this.viewHeight=viewHeight;this.fluid.tick(dt);
 }
 snapshot(){return {available:Boolean(this.fluid),enabled:this.enabled,frames:this.count,motionPeakMps:this.peakMps,ambientDose:this.ambientDose,visibleDomain:{left:FIELD.padX/FIELD.width,right:(1+FIELD.padX)/FIELD.width,bottom:FIELD.padY/FIELD.height,top:(1+FIELD.padY)/FIELD.height}};}
 dispose(){this.fluid?.dispose();}
}
