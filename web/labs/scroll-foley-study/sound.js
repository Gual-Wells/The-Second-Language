import {SoundDirector} from '../certification-reader/sound.js?v=41';

// One quiet paper performance. Keeper, prong, hands, desk and camera are silent.
// Reuse the reader's audio lifetime without changing production defaults.
const paperURL=new URL('./audio/soft-roll-v2.wav',import.meta.url).href;
const musicURL=new URL('../certification-reader/assets/audio-music/a-new-town.mp3',import.meta.url).href;
const nowMS=()=>performance.now();
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const HEIGHT_MM=420,QUIET_MM_PER_S=15,FULL_MM_PER_S=175,MAX_GAIN=.13;

export class StudySoundDirector extends SoundDirector{
 constructor(){
  super();this.paperVoice=null;this.speed=0;this.paperGain=0;this.idleTimer=0;this.lastMovedAt=0;
  this.trace=[];this.envelope=[];this.exhausted=false;
 }
 // The inherited unlock preloads legacy names. They all resolve to the same
 // sole paper buffer; no leather/metal asset is fetched, decoded or played.
 canonical(key){return key==='music'?'music':'paper';}
 async _fetch(key){
  key=this.canonical(key);
  if(this.bytes.has(key))return this.bytes.get(key);
  if(this.loads.has('fetch:'+key))return this.loads.get('fetch:'+key);
  const task=fetch(key==='music'?musicURL:paperURL,{credentials:'same-origin'}).then(r=>{
   if(!r.ok)throw Error(`试听资源未取得：${key} (${r.status})`);return r.arrayBuffer();
  }).then(bytes=>{if(!this.disposed){this.bytes.set(key,bytes);this.failures.delete(key);}return bytes;})
   .catch(e=>{if(!this.disposed)this.failures.set(key,e.message);throw e;});
  this.loads.set('fetch:'+key,task);
  try{return await task;}finally{this.loads.delete('fetch:'+key);}
 }
 _buffer(key){return super._buffer(this.canonical(key));}
 async prepare(){
  if(this.disposed||!this.active)return false;
  await Promise.allSettled((this.musicEnabled?['paper','music']:['paper']).map(k=>this._fetch(k)));
  return !this.disposed;
 }
 _stopFoley(){
  clearTimeout(this.idleTimer);this.idleTimer=0;this.paperVoice=null;this.speed=0;this.paperGain=0;this.exhausted=false;
  super._stopFoley();
 }
 silence({reset=false}={}){
  this.speed=0;this.paperGain=0;this.materialTargets={paper:0,leather:0};
  if(this.paperVoice)this._stopVoice(this.paperVoice,.08);
  this.paperVoice=null;if(reset)this.exhausted=false;
 }
 armIdle(){
  if(this.idleTimer)return;
  const check=()=>{
   this.idleTimer=0;
   const remaining=100-(nowMS()-this.lastMovedAt);
   if(remaining>0&&this._canPlay())this.idleTimer=setTimeout(check,remaining);
   else this.silence({reset:true});
  };
  this.idleTimer=setTimeout(check,100);
 }
 startPaper(pose){
  if(this.paperVoice||this.exhausted)return;
  const buffer=this.buffers.get('paper'),ctx=this.context;
  if(!buffer||!ctx)return;
  const source=ctx.createBufferSource(),gain=ctx.createGain();
  source.buffer=buffer;source.loop=false;source.playbackRate.value=1;
  gain.gain.value=0;source.connect(gain);gain.connect(this.foleyBus);
  const voice={source,gain,startedAt:ctx.currentTime,stopping:false,ended:false};
  this.paperVoice=voice;this.foleyVoices.add(voice);
  source.onended=()=>{
   voice.ended=true;source.disconnect();gain.disconnect();this.foleyVoices.delete(voice);
   if(this.paperVoice===voice){this.paperVoice=null;this.exhausted=true;}
  };
  source.start();this.eventsPlayed++;this.lastEvent='soft-paper';
  this.trace.push({key:'soft-paper',progress:pose.progress,paperProgress:pose.paperProgress,audioTime:ctx.currentTime,
   sourceOffset:0,rate:1,loop:false,mode:pose.mode||'automatic'});
  if(this.trace.length>32)this.trace.shift();
 }
 motion(pose={}){
  const at=nowMS(),previous=this.lastMotion,current={...pose,at};this.lastMotion=current;
  if(!this._canPlay()||!this.foleyEnabled)return;
  const dt=previous?(at-previous.at)/1000:0;
  const q=Number(pose.paperProgress)||0,oldQ=Number(previous?.paperProgress)||0;
  if(!previous||!pose.active||dt<=0||dt>.3||Math.abs(q-oldQ)>.15||q<=0||q>=1){
   this.silence({reset:true});return;
  }
  const travelled=Math.abs(q-oldQ);
  if(travelled<1e-7)return; // The audio-clock envelope below already fades a hold.
  this.lastMovedAt=at;this.lastDriveAt=at;this.armIdle();
  const speed=HEIGHT_MM*travelled/dt;
  this.speed+=(speed-this.speed)*(1-Math.exp(-dt/.065));
  // No minimum sound floor and no gain from roll radius, camera movement or age.
  const endpoint=smooth(0,.035,q)*smooth(0,.035,1-q);
  const target=MAX_GAIN*Math.pow(smooth(QUIET_MM_PER_S,FULL_MM_PER_S,this.speed),1.5)*endpoint;
  this.paperGain=target;this.materialTargets={paper:target,leather:0};
  if(target>.00005)this.startPaper(pose);
  const voice=this.paperVoice;
  if(voice&&!voice.stopping){
   const param=voice.gain.gain,t=this.context.currentTime;
   if(param.cancelAndHoldAtTime)param.cancelAndHoldAtTime(t);
   else{param.cancelScheduledValues(t);param.setValueAtTime(param.value,t);}
   param.setTargetAtTime(target,t,.045);
   // If frames/input stop arriving, the AUDIO clock still fades to silence.
   // Source stop/seek is never scheduled anew on every progress frame.
   param.setTargetAtTime(0,t+.095,.025);
  }
  if(!this.lastEnvelopeAt||at-this.lastEnvelopeAt>65){
   this.envelope.push({at,audioTime:this.context.currentTime,q,speedMMPerS:this.speed,target,mode:pose.mode||'automatic'});
   this.lastEnvelopeAt=at;if(this.envelope.length>200)this.envelope.shift();
  }
 }
 snapshot(){
  return{...super.snapshot(),variant:'soft-v2',candidateOnly:true,
   foleyMethod:'paper winding only; continuous native recording, smooth low-level speed envelope',
   listeningReview:'User audition pending; older heavy-paper/belt candidates are rejected.',
   materialLevels:{paper:this.paperVoice?.gain.gain.value||0,leather:0},
   paperSpeedMMPerS:this.speed,paperGain:this.paperGain,maximumPaperGain:MAX_GAIN,sourceExhausted:this.exhausted,
   performances:[...this.foleyVoices].map(v=>({key:'soft-paper',loop:v.source.loop,rate:v.source.playbackRate.value,stopping:v.stopping})),
   cueTrace:this.trace.slice(),envelope:this.envelope.slice(),contacts:[]};
 }
}
