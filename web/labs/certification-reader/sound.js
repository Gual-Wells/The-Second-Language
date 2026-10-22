import {KeeperSoundDirector} from './keeper-sound.js?v=42';

// New recorded paper performances; the restored A/B keeper remains independent.
const paperFiles={paperUnroll:new URL('./assets/audio-foley/v42/paper-unroll-v5.wav',import.meta.url).href,
 paperRollup:new URL('./assets/audio-foley/v42/paper-rollup-v5.wav',import.meta.url).href};
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const MAX_PAPER_GAIN=.10;

export class SoundDirector extends KeeperSoundDirector {
 constructor(){
  super();this.foleyKeys.push(...Object.keys(paperFiles));this.paperVoice=null;this.paperPrevious=null;this.paperSpeed=0;this.paperGain=0;
  this.paperOffset=0;this.paperKey=null;this.paperExhausted=false;this.paperIdle=0;this.paperLastMoved=0;
  this.paperEnvelope=[];
 }
 async _fetch(key){
  if(!paperFiles[key])return super._fetch(key);
  if(this.bytes.has(key))return this.bytes.get(key);
  if(this.loads.has('fetch:'+key))return this.loads.get('fetch:'+key);
  const task=fetch(paperFiles[key],{credentials:'same-origin'}).then(r=>{
   if(!r.ok)throw Error(`纸卷录音未取得：${r.status}`);return r.arrayBuffer();
  }).then(bytes=>{if(!this.disposed){this.bytes.set(key,bytes);this.failures.delete(key);}return bytes;})
   .catch(e=>{if(!this.disposed)this.failures.set(key,e.message);throw e;});
  this.loads.set('fetch:'+key,task);try{return await task;}finally{this.loads.delete('fetch:'+key);}
 }
 async prepare(){
  if(this.disposed||!this.active)return false;
  await Promise.allSettled([super.prepare(),...Object.keys(paperFiles).map(k=>this._fetch(k))]);return !this.disposed;
 }
 async unlock(){
  const epoch=this.epoch;if(!await super.unlock())return false;
  await Promise.allSettled(Object.keys(paperFiles).map(k=>this._buffer(k)));
  return epoch===this.epoch&&this._canPlay();
 }
 stopPaper(reset=false){
  const voice=this.paperVoice;this.paperVoice=null;
  if(voice){
   this.paperOffset=Math.min(voice.source.buffer.duration,voice.offset+Math.max(0,this.context.currentTime-voice.startedAt));
   this._stopVoice(voice,.05);
  }
  this.paperSpeed=0;this.paperGain=0;
  if(reset){this.paperOffset=0;this.paperKey=null;this.paperExhausted=false;}
 }
 _stopFoley(){
  clearTimeout(this.paperIdle);this.paperIdle=0;this.stopPaper(true);this.paperPrevious=null;
  super._stopFoley();
 }
 paperIdleGuard(){
  if(this.paperIdle)return;
  const check=()=>{
   this.paperIdle=0;const remaining=100-(performance.now()-this.paperLastMoved);
   if(remaining>0&&this._canPlay())this.paperIdle=setTimeout(check,remaining);else this.stopPaper();
  };
  this.paperIdle=setTimeout(check,100);
 }
 startPaper(pose,key){
  if(this.paperVoice||this.paperExhausted)return;
  const buffer=this.buffers.get(key),ctx=this.context;if(!buffer||!ctx)return;
  if(this.paperOffset>=buffer.duration){this.paperExhausted=true;return;}
  const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=buffer;source.loop=false;source.playbackRate.value=1;
  gain.gain.value=0;source.connect(gain);gain.connect(this.foleyBus);
  const voice={source,gain,key,offset:this.paperOffset,startedAt:ctx.currentTime,stopping:false,ended:false};
  this.paperVoice=voice;this.foleyVoices.add(voice);
  source.onended=()=>{
   voice.ended=true;source.disconnect();gain.disconnect();this.foleyVoices.delete(voice);
   if(this.paperVoice===voice){this.paperVoice=null;this.paperOffset=buffer.duration;this.paperExhausted=true;}
  };
  source.start(0,this.paperOffset);this.eventsPlayed++;this.lastEvent=key;
  this.trace.push({key,progress:pose.progress,paperProgress:pose.paperProgress,audioTime:ctx.currentTime,
   offset:this.paperOffset,rate:1,loop:false,mode:pose.mode||'automatic'});
 }
 motion(pose={}){
  const at=performance.now(),previous=this.paperPrevious,current={...pose,at};
  super.motion(pose);this.paperPrevious=current;
  if(!this._canPlay()||!this.foleyEnabled)return;
  const dt=previous?(at-previous.at)/1000:0,q=Number(pose.paperProgress)||0,oldQ=Number(previous?.paperProgress)||0;
  if(q<=0||q>=1){this.stopPaper(true);return;}
  if(!previous||!pose.active||dt<=0||dt>.3||Math.abs(q-oldQ)>.15){this.stopPaper();return;}
  const delta=q-oldQ;if(Math.abs(delta)<1e-7)return;
  const key=delta>0?'paperUnroll':'paperRollup';
  // A continuous reversal keeps its current natural performance; no extra hit.
  // A new stopped gesture may select the corresponding forward recorded take.
  if(!this.paperVoice&&this.paperKey!==key){this.paperKey=key;this.paperOffset=0;this.paperExhausted=false;}
  this.paperLastMoved=at;this.paperIdleGuard();
  this.paperSpeed+=(420*Math.abs(delta)/dt-this.paperSpeed)*(1-Math.exp(-dt/.065));
  const travel=key==='paperUnroll'?q:1-q;
  // Continuous at zero speed: a decelerating sheet remains faintly audible,
  // without a speed threshold cutting off the final moving portion.
  const speedResponse=Math.pow(this.paperSpeed/(this.paperSpeed+40),.8);
  const tail=1-.55*smooth(.72,1,travel);
  const target=MAX_PAPER_GAIN*speedResponse*tail;
  this.paperGain=target;if(target>0)this.startPaper(pose,this.paperKey||key);
  const voice=this.paperVoice;
  if(voice&&!voice.stopping){
   const p=voice.gain.gain,t=this.context.currentTime;
   if(p.cancelAndHoldAtTime)p.cancelAndHoldAtTime(t);else{p.cancelScheduledValues(t);p.setValueAtTime(p.value,t);}
   p.setTargetAtTime(target,t,.045);p.setTargetAtTime(0,t+.095,.025);
  }
  if(!this.lastPaperEnvelopeAt||at-this.lastPaperEnvelopeAt>75){
   this.paperEnvelope.push({q,speed:this.paperSpeed,target,audioTime:this.context.currentTime});
   if(this.paperEnvelope.length>120)this.paperEnvelope.shift();this.lastPaperEnvelopeAt=at;
  }
 }
 snapshot(){return {...super.snapshot(),variant:'recorded-foley-v42',candidateOnly:false,userApproved:true,paperState:'adopted-full-automatic-motion-tail',keeperReference:'466132c A/B',
  paperGain:this.paperGain,paperKey:this.paperKey,paperExhausted:this.paperExhausted,maximumPaperGain:MAX_PAPER_GAIN,paperEnvelope:this.paperEnvelope.slice(),
  listeningReview:'Pitch-preserving stretched Adobe performances with a continuous quiet tail; user adopted for normal automatic opening/closing on 2026-10-23. Original A/B keeper unchanged.'};}
}
