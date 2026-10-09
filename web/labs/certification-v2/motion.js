// Device vectors -> a stable displayed frame. Total acceleration is never a gravity substitute.
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const length=v=>Math.hypot(v.x,v.y,v.z);
export function screenVector(v,angle=0){const r=angle*Math.PI/180,c=Math.cos(r),s=Math.sin(r);return{x:v.x*c-v.y*s,y:v.x*s+v.y*c,z:v.z};}
export function splitMotion(event,angle=0){const g=event.accelerationIncludingGravity,a=event.acceleration;if(!g||!a||![g.x,g.y,g.z,a.x,a.y,a.z].every(Number.isFinite))return null;return{gravity:screenVector({x:g.x-a.x,y:g.y-a.y,z:g.z-a.z},angle),linear:screenVector({...a},angle)};}
export function rotate(v,q){const t={x:2*(q.y*v.z-q.z*v.y),y:2*(q.z*v.x-q.x*v.z),z:2*(q.x*v.y-q.y*v.x)};return{x:v.x+q.w*t.x+q.y*t.z-q.z*t.y,y:v.y+q.w*t.y+q.z*t.x-q.x*t.z,z:v.z+q.w*t.z+q.x*t.y-q.y*t.x};}
export function fromTo(a,b){const la=length(a),lb=length(b);if(la<1e-5||lb<1e-5)return{x:0,y:0,z:0,w:1};a={x:a.x/la,y:a.y/la,z:a.z/la};b={x:b.x/lb,y:b.y/lb,z:b.z/lb};const dot=a.x*b.x+a.y*b.y+a.z*b.z;if(dot<-.99999){const axis=Math.abs(a.x)<.8?{x:0,y:a.z,z:-a.y}:{x:-a.z,y:0,z:a.x},n=length(axis);return{x:axis.x/n,y:axis.y/n,z:axis.z/n,w:0};}const q={x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x,w:1+dot},n=Math.hypot(q.x,q.y,q.z,q.w);return{x:q.x/n,y:q.y/n,z:q.z/n,w:q.w/n};}
export function slerp(a,b,t){let dot=a.x*b.x+a.y*b.y+a.z*b.z+a.w*b.w;if(dot<0){b={x:-b.x,y:-b.y,z:-b.z,w:-b.w};dot=-dot;}const d=clamp(dot,-1,1),theta=Math.acos(d);if(theta<.001){const q=Object.fromEntries(['x','y','z','w'].map(k=>[k,a[k]+(b[k]-a[k])*t])),n=Math.hypot(q.x,q.y,q.z,q.w);return Object.fromEntries(Object.entries(q).map(([k,v])=>[k,v/n]));}const f=Math.sin((1-t)*theta)/Math.sin(theta),g=Math.sin(t*theta)/Math.sin(theta);return{x:a.x*f+b.x*g,y:a.y*f+b.y*g,z:a.z*f+b.z*g,w:a.w*f+b.w*g};}
export class MotionInput{
 constructor(){this.reset();}
 reset(){this.calibration=null;this.samples=[];this.gravity={x:0,y:-9.81,z:0};this.linear={x:0,y:0,z:0};this.received=0;this.invalid=0;this.lastAt=0;this.trace=[];this.angle=null;}
 feed(event,angle,now){if(this.angle!==null&&angle!==this.angle){this.reset();}this.angle=angle;const p=splitMotion(event,angle);if(!p){this.invalid++;return false;}const magnitude=length(p.gravity),movement=length(p.linear);if(magnitude<5||magnitude>14)return false;
  // Twelve quiet readings, rather than one potentially shaken initial sample.
  if(!this.calibration){if(movement>.65||magnitude<8||magnitude>11){this.samples=[];return false;}if(this.samples.length&&length({x:p.gravity.x-this.samples[0].x,y:p.gravity.y-this.samples[0].y,z:p.gravity.z-this.samples[0].z})>.5){this.samples=[];return false;}this.samples.push(p.gravity);if(this.samples.length<12)return false;const mean={x:0,y:0,z:0};for(const s of this.samples)for(const k of ['x','y','z'])mean[k]+=s[k]/this.samples.length;this.calibration=fromTo(mean,{x:0,y:-9.81,z:0});}
  const dt=this.lastAt?clamp((now-this.lastAt)/1000,.001,.1):.016,weight=1-Math.exp(-dt/.10),g=rotate(p.gravity,this.calibration),a=rotate(p.linear,this.calibration);for(const k of ['x','y','z']){this.gravity[k]+=(g[k]-this.gravity[k])*weight;this.linear[k]=clamp(a[k],-15,15);}this.lastAt=now;this.received++;if(this.received%8===0){this.trace.push({g:Object.values(this.gravity).map(v=>+v.toFixed(2)),a:Object.values(this.linear).map(v=>+v.toFixed(2))});if(this.trace.length>12)this.trace.shift();}return true;
 }
 stats(){return{calibrated:Boolean(this.calibration),samples:this.received,invalid:this.invalid,angle:this.angle,trace:this.trace};}
}
