import {SoundDirector} from '../certification-reader/sound.js?v=41';
import {materialMotion} from '../certification-reader/material-motion.js?v=41';

// Study adapter: retain the proven unlock/music/visibility lifetime, replace
// only the Foley edit. No production import or product setting points here.
const keys=['paperOpenA','paperCloseA','paperOpenB','paperCloseB','bendOpen','bendClose',
 'holeOpen','holeClose','tailOpen','tailClose','slideOpen','slideClose','park','seat'];
const files=Object.fromEntries(keys.map(key=>[key,new URL(`./audio/${key}.wav`,import.meta.url).href]));
files.music=new URL('../certification-reader/assets/audio-music/a-new-town.mp3',import.meta.url).href;
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
const clock=()=>performance.now();

function phase(pose){
 if(pose.paperProgress>0&&pose.keeper?.r>=.999)return{name:'paper',coordinate:pose.paperProgress,range:1};
 const r=pose.keeper?.r??1;
 if(r<.18)return{name:'bend',coordinate:r,range:.18};
 if(r<.36)return{name:'hole',coordinate:r,range:.18};
 if(r<.72)return{name:'tail',coordinate:r,range:.36};
 if(r<.79)return{name:'park',coordinate:r,range:.07};
 if(r<.94)return{name:'slide',coordinate:r,range:.15};
 return{name:'air',coordinate:r,range:.06};
}

export class StudySoundDirector extends SoundDirector{
 constructor({variant='A'}={}){
  super();
  this.variant=variant==='B'?'B':'A';this.sequence=null;this.frictionVoice=null;
  this.trace=[];this.idleTimer=0;this.lastMovedAt=0;this.dragDistance=0;this.dragIndex=0;this.lastDragCue=-Infinity;
  this.contactArmed={park:true,seat:true};
 }
 canonical(key){
  return key==='leather'?'bendOpen':key==='paperOpen'?'paperOpen'+this.variant:key==='paperClose'?'paperClose'+this.variant:key;
 }
 async _fetch(key){
  key=this.canonical(key);
  if(this.bytes.has(key))return this.bytes.get(key);
  if(this.loads.has('fetch:'+key))return this.loads.get('fetch:'+key);
  const task=fetch(files[key],{credentials:'same-origin'}).then(r=>{
   if(!r.ok)throw Error(`试听资源未取得：${key} (${r.status})`);return r.arrayBuffer();
  }).then(bytes=>{if(!this.disposed){this.bytes.set(key,bytes);this.failures.delete(key);}return bytes;})
   .catch(e=>{if(!this.disposed)this.failures.set(key,e.message);throw e;});
  this.loads.set('fetch:'+key,task);
  try{return await task;}finally{this.loads.delete('fetch:'+key);}
 }
 _buffer(key){return super._buffer(this.canonical(key));}
 async prepare(){
  if(this.disposed||!this.active)return false;
  const selected=keys.filter(k=>!k.startsWith('paper')||k.endsWith(this.variant));
  if(this.musicEnabled)selected.push('music');
  await Promise.allSettled(selected.map(k=>this._fetch(k)));
  return !this.disposed;
 }
 async unlock(){
  const epoch=this.epoch;
  if(!await super.unlock())return false;
  await Promise.allSettled(keys.filter(k=>!k.startsWith('paper')||k.endsWith(this.variant)).map(k=>this._buffer(k)));
  return epoch===this.epoch&&this._canPlay();
 }
 _stopFoley(){
  clearTimeout(this.idleTimer);this.idleTimer=0;this.frictionVoice=null;this.sequence=null;
  super._stopFoley();
 }
 stopFriction(fade=.03){
  if(this.frictionVoice)this._stopVoice(this.frictionVoice,fade);
  this.frictionVoice=null;this.materialTargets={paper:0,leather:0};
 }
 armIdle(){
  if(this.idleTimer)return;
  const check=()=>{
   this.idleTimer=0;
   const remaining=100-(clock()-this.lastMovedAt);
   if(remaining>0&&this._canPlay())this.idleTimer=setTimeout(check,remaining);
   else this.stopFriction(.03);
  };
  this.idleTimer=setTimeout(check,100);
 }
 cue(key,gain,{offset=0,duration,contact=false,pose,mode='automatic',direction=1}={}){
  const buffer=this.buffers.get(key);
  if(!buffer||!this._canPlay())return null; // Do not queue late gestures.
  const ctx=this.context,source=ctx.createBufferSource(),node=ctx.createGain();
  source.buffer=buffer;source.loop=false;source.playbackRate.value=1;
  const length=Math.min(duration??buffer.duration,buffer.duration-offset);
  if(length<=0)return null;
  const now=ctx.currentTime,fadeIn=contact ? .002 : .008;
  node.gain.setValueAtTime(0,now);node.gain.linearRampToValueAtTime(gain,now+Math.min(fadeIn,length/4));
  node.gain.setValueAtTime(gain,now+Math.max(fadeIn,length-.035));node.gain.linearRampToValueAtTime(0,now+length);
  source.connect(node);node.connect(this.foleyBus);
  const voice={source,gain:node,key,offset,startedAt:now,stopping:false,ended:false,contact};
  this.foleyVoices.add(voice);
  source.onended=()=>{voice.ended=true;this.foleyVoices.delete(voice);source.disconnect();node.disconnect();if(this.frictionVoice===voice)this.frictionVoice=null;};
  source.start(now,offset,length);
  this.eventsPlayed++;this.lastEvent=key;
  this.trace.push({key,mode,direction,audioTime:now,wallTime:clock(),offset,duration:length,gain,
   progress:pose?.progress,r:pose?.keeper?.r,phase:pose?.keeper?.phase,contact});
  if(this.trace.length>160)this.trace.shift();
  return voice;
 }
 motion(pose={}){
  const now=clock(),previous=this.lastMotion,current={...pose,at:now};this.lastMotion=current;
  if(!this._canPlay()||!this.foleyEnabled)return;
  const dt=previous?(now-previous.at)/1000:0;
  if(!previous||!pose.active||dt<=0||dt>.3||Math.abs(pose.progress-previous.progress)>.2){
   this.stopFriction();this.sequence=null;return;
  }
  const delta=pose.progress-previous.progress;
  if(Math.abs(delta)<1e-7)return;
  const direction=Math.sign(delta),part=phase(pose),mode=pose.mode==='drag'?'drag':'automatic';
  const response=materialMotion(current,previous,dt),r=pose.keeper?.r??1;
  if(r<.68)this.contactArmed.park=true;if(r>.08)this.contactArmed.seat=true;
  const contact=response.contact==='prong-park'?'park':response.contact==='prong-seat'?'seat':null;
  if(contact&&this.contactArmed[contact]){
   this.contactArmed[contact]=false;
   this.cue(contact,.40,{contact:true,pose,mode,direction});
   this.contacts.push({kind:response.contact,progress:pose.progress,r,phase:pose.keeper.phase,pin:pose.keeper.pin});
   if(this.contacts.length>12)this.contacts.shift();
  }
  const sequence=`${part.name}:${direction}:${mode}`;
  const changed=sequence!==this.sequence;
  if(changed){this.stopFriction();this.sequence=sequence;this.dragDistance=0;this.dragIndex=0;this.lastDragCue=-Infinity;}
  if(['park','air'].includes(part.name))return;
  this.lastMovedAt=now;this.lastDriveAt=now;this.armIdle();
  const key=part.name==='paper'?`paper${direction>0?'Open':'Close'}${this.variant}`:`${part.name}${direction>0?'Open':'Close'}`;
  const strength=part.name==='paper'?response.paper:response.leather;
  // A phase's first frame is often almost at rest. Freezing that tiny speed
  // as the whole performance gain would make closing arbitrarily inaudible.
  // Natural auto performances keep their recorded envelope and authored gain;
  // only a manually produced short stroke takes the current motion strength.
  const authoredGain={paper:.8,bend:.9,hole:.7,tail:.95,slide:.65}[part.name];
  const gain=authoredGain*(mode==='automatic'?1:clamp(.45+.55*strength,.45,1));
  this.materialTargets={paper:part.name==='paper'?gain:0,leather:part.name!=='paper'?gain:0};
  if(mode==='automatic'){
   // One complete native-rate performance per actual phase. Its source never
   // seeks/restarts as progress advances, and is not pre-scheduled in wall time.
   if(changed)this.frictionVoice=this.cue(key,gain,{pose,mode,direction});
  }else{
   const last=phase(previous);
   this.dragDistance+=last.name===part.name?Math.abs(part.coordinate-last.coordinate):.015;
   if((changed||this.dragDistance>=part.range*.10)&&now-this.lastDragCue>=170){
    // A few windowed natural strokes, paced by travelled material, not a
    // continuous granular/noise loop or a frame-by-frame seek operation.
    this.stopFriction(.025);
    const buffer=this.buffers.get(key),length=Math.min(.22,buffer?.duration??0);
    const offsets=part.name==='paper'?[.04,.63,1.38,2.12]:[0,.18,.36];
    const offset=Math.min(offsets[this.dragIndex++%offsets.length],Math.max(0,(buffer?.duration??0)-length));
    this.frictionVoice=this.cue(key,gain,{offset,duration:length,pose,mode,direction});
    this.lastDragCue=now;this.dragDistance=0;
   }
  }
 }
 snapshot(){
  const state=super.snapshot();
  return{...state,variant:this.variant,candidateOnly:true,foleyMethod:'phase-triggered finite performances and sparse drag strokes',
   listeningReview:'Pending user audition; technical checks are not a timbre judgement.',
   materialLevels:{paper:0,leather:0},
   performances:[...this.foleyVoices].filter(v=>!v.ended).map(v=>({key:v.key,loop:v.source.loop,rate:v.source.playbackRate.value,offset:v.offset,contact:v.contact,stopping:v.stopping})),
   cueTrace:this.trace.slice()};
 }
}
