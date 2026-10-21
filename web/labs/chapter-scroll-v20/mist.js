import {createFluid} from '../chapter-scroll-v5/vendor/fluid.js';
import {fieldFactory} from './flow.js';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const convert=p=>({x:(p.x+.3)/1.6,y:(p.y+.15)/1.3});
const finitePoint=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
const STEP=1/30;
export class Atmosphere{
 constructor(canvas,{interactionGain=1}={}){
  this.canvas=canvas;this.enabled=true;this.time=0;this.pending=0;this.frames=0;this.previous=null;
  this.interactionEnergy=0;this.randomState=0x53b5a71;this.drive=[0,0,0,0];this.interactionGain=interactionGain;
  this.clouds=Array.from({length:8},()=>this.cloud(true));
  this.patches=Array.from({length:4},(_,i)=>this.patch(i,true));
 }
 random(){this.randomState=(Math.imul(this.randomState,1664525)+1013904223)>>>0;return this.randomState/4294967296;}
 cloud(initial=false){const life=13+this.random()*19;return{x:.08+this.random()*.84,y:.03+this.random()*.94,r:.16+this.random()*.19,amplitude:.38+this.random()*.43,phase:this.random()*6.28,birth:initial?-this.random()*life:this.time,life};}
 patch(i,initial=false){const life=17+this.random()*18;return{i,x:(i%2?.72:.28)+(this.random()-.5)*.12,y:(i<2?.26:.74)+(this.random()-.5)*.14,r:.23+this.random()*.18,speed:.025+this.random()*.035,angle:this.random()*6.28,phase:this.random()*6.28,rate:.34+this.random()*.32,birth:initial?-this.random()*life:this.time,life};}
 fields(){
  this.clouds=this.clouds.map(c=>this.time-c.birth>=c.life?this.cloud():c);
  this.patches=this.patches.map(p=>this.time-p.birth>=p.life?this.patch(p.i):p);
  const regions=[],currents=[],winds=[];
  for(const c of this.clouds){const age=clamp((this.time-c.birth)/c.life,0,1),a=Math.sin(Math.PI*age)**2;
   regions.push(c.x+.045*Math.sin(this.time*.11+c.phase),c.y+.035*Math.cos(this.time*.15+c.phase),c.r*(.85+.3*age),c.amplitude*a);
  }
  for(const p of this.patches){
   const age=clamp((this.time-p.birth)/p.life,0,1),life=Math.sin(Math.PI*age)**2;
   const gust=.82+.47*Math.sin(this.time*p.rate+p.phase)+.22*Math.sin(this.time*p.rate*1.73+p.phase*2.1);
   const angle=p.angle+.5*Math.sin(this.time*.13+p.phase),speed=p.speed*life*gust;
   currents.push(p.x+.07*Math.sin(this.time*.085+p.phase),p.y+.05*Math.cos(this.time*.12+p.phase),p.r,life*gust);
   winds.push(Math.cos(angle)*speed,Math.sin(angle)*speed,p.phase,angle);
  }
  this.currentWinds=winds;return{regions,currents,winds};
 }
 async prepare(){
  const response=await fetch(new URL('../chapter-scroll-v17/vendor/noise2D.glsl',import.meta.url));
  if(!response.ok)throw Error('Atmosphere noise source unavailable');
  // Confinement restores unresolved rolling detail. Keep it restrained here:
  // this is a mist atmosphere, not a tank of equally turbulent smoke.
  this.fluid=createFluid(this.canvas,{simResolution:96,dyeResolution:512,maxPixelRatio:1.5,densityDissipation:.22,curl:.38,fieldFactory:fieldFactory(await response.text())});
  for(const[x,y,a]of[[.18,.32,.55],[.83,.68,.6],[.3,.79,.34],[.65,.2,.30]])this.fluid.seed(x,y,a,3);
  for(let i=0;i<60;i++){this.time+=STEP;this.fluid.fields(this.time,STEP,{edges:[-2,0,-2,0],keeper:[-2,-2,0,0],span:[0,1],...this.fields(),interactionGain:this.interactionGain});this.fluid.tick(STEP);if(i%6===5)await new Promise(requestAnimationFrame);}
  this.resetMotion();
 }
 tick(dt,progress,bounds,viewHeight,elapsed,interaction){
  if(!this.fluid||!this.enabled)return;
  this.pending+=clamp(Number.isFinite(elapsed)?elapsed:dt,0,.10);
  const steps=Math.min(3,Math.floor((this.pending+1e-7)/STEP));if(!steps)return;
  if(!finitePoint(interaction?.top?.[0])||!finitePoint(interaction?.top?.[1])||!finitePoint(interaction?.bottom?.[0])){this.resetMotion();return;}
  const a=convert(interaction.top[0]),b=convert(interaction.bottom[0]),right=convert(interaction.top[1]);
  let k=finitePoint(interaction.keeper)?convert(interaction.keeper):null;
  if(k&&(k.x<.02||k.x>.98||k.y<.02||k.y>.98))k=null;
  const duration=steps*STEP,p=interaction.paperProgress;
  const valid=this.previous&&Math.abs(progress-this.previous.progress)<.12&&Math.abs(viewHeight-this.previous.viewHeight)<.001;
  const movingPaper=valid&&p>.015&&p<.999;
  const raw=[movingPaper?(a.y-this.previous.top)/duration:0,movingPaper?(b.y-this.previous.bottom)/duration:0,k&&valid&&this.previous.keeper?(k.x-this.previous.keeper.x)/duration:0,k&&valid&&this.previous.keeper?(k.y-this.previous.keeper.y)/duration:0];
  for(let i=0;i<steps;i++){
   this.time+=STEP;this.pending-=STEP;
   const blend=1-Math.exp(-STEP/.065);
   this.drive=this.drive.map((v,j)=>v+(clamp(Number.isFinite(raw[j])?raw[j]:0,-.32,.32)-v)*blend);
   this.fluid.fields(this.time,STEP,{edges:[a.y,this.drive[0],b.y,this.drive[1]],span:[a.x,right.x],keeper:k?[k.x,k.y,this.drive[2],this.drive[3]]:[-2,-2,0,0],...this.fields(),interactionGain:this.interactionGain});
   this.interactionEnergy+=this.drive.reduce((sum,v)=>sum+Math.abs(v),0)*STEP;
   this.fluid.tick(STEP);this.frames++;
  }
  this.previous={top:a.y,bottom:b.y,keeper:k,progress,viewHeight};
 }
 resetMotion(){this.previous=null;this.pending=0;this.drive=[0,0,0,0];}
 setEnabled(on){this.enabled=Boolean(on);this.canvas.hidden=!on;this.resetMotion();}
 snapshot(){return{available:Boolean(this.fluid),enabled:this.enabled,frames:this.frames,time:this.time,interactionEnergy:this.interactionEnergy,drive:[...this.drive],model:'advected mist with broad regional currents, staggered gusts and bounded object wakes',simulationHz:30,fixedDirectionalInlet:false,regionalVelocities:this.currentWinds?.filter((_,i)=>i%4<2),confinement:.38};}
 dispose(){this.fluid?.dispose();}
}
