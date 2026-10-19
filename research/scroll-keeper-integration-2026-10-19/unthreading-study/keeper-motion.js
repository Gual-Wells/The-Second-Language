// Material-length path for the accepted continuous strap. No mesh replacement,
// flat-blank morph, opacity animation, or scaling of the metal during motion.
export const RELEASE_END=.34;
export const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
function cumulative(points){const s=[0];for(let i=1;i<points.length;i++)s.push(s[i-1]+distance(points[i],points[i-1]));return s;}
function at(points,arc,s){s=Math.max(0,Math.min(arc.at(-1),s));let lo=0,hi=arc.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(arc[mid]<s)lo=mid;else hi=mid;}const t=(s-arc[lo])/(arc[hi]-arc[lo]||1);return [points[lo][0]*(1-t)+points[hi][0]*t,points[lo][1]*(1-t)+points[hi][1]*t];}
export class MaterialPath{
 constructor(data){
  this.data=data;this.points=data.pointsMm;this.arc=cumulative(this.points);this.length=data.lengthMm;this.count=data.boneCount;
  this.anchorS=data.foldEndMm+20;this.A=at(this.points,this.arc,this.anchorS);this.B=at(this.points,this.arc,data.mainEndMm);
  this.middle=[(this.A[0]+this.B[0])/2,(this.A[1]+this.B[1])/2];const dx=this.B[0]-this.A[0],dy=this.B[1]-this.A[1];this.chord=Math.hypot(dx,dy);this.normal=[-dy/this.chord,dx/this.chord];
  const h=Math.sqrt(data.radiusMm**2-this.chord**2/4),p=this.middle.map((v,i)=>v+h*this.normal[i]),n=this.middle.map((v,i)=>v-h*this.normal[i]);this.sign=Math.hypot(...p)<Math.hypot(...n)?1:-1;
  this.suffix=[this.B,...this.points.filter((p,i)=>this.arc[i]>data.mainEndMm+.0001)];this.suffixArc=cumulative(this.suffix);
  this.oldArc=this.circle(data.radiusMm).length;const remaining=this.length-this.anchorS;
  let low=data.radiusMm,high=low+30;for(let i=0;i<40;i++){const m=(low+high)/2;if(this.circle(m).length<remaining+3)low=m;else high=m;}this.expandedRadius=(low+high)/2;
  // Start lifting only after the strap is inside the clear buckle window.
  const safe=this.suffix.findIndex(p=>p[0]<5.5);this.liftStart=this.suffixArc[Math.max(0,safe)];
 }
 circle(radius){const h=Math.sqrt(radius*radius-this.chord*this.chord/4),C=this.middle.map((v,i)=>v+this.sign*h*this.normal[i]),angle=Math.atan2(this.A[1]-C[1],this.A[0]-C[0]),end=Math.atan2(this.B[1]-C[1],this.B[0]-C[0]),turn=(angle-end+Math.PI*2)%(Math.PI*2);return {C,angle,length:radius*turn,radius};}
 sample(r){
  // Lift the hole off the tip. Withdraw with the pin almost resting, then turn
  // it OUTWARD once the tail is clear. An inward swing hits the paper cylinder.
  const lift=6*smooth(0,.18,r)*(1-smooth(.65,.72,r)),pin=-.08*smooth(.18,.3,r)-.9*smooth(.65,.72,r),feed=smooth(.3,.65,r);
  const circle=this.circle(this.data.radiusMm+(this.expandedRadius-this.data.radiusMm)*feed);
  const suffix=this.suffix.map((p,i)=>[p[0],p[1]-lift*smooth(this.liftStart,this.liftStart+7,this.suffixArc[i])]),suffixArc=cumulative(suffix);
  const point=s=>{if(s<=this.anchorS)return at(this.points,this.arc,s);const t=s-this.anchorS;if(t<=circle.length){const a=circle.angle-t/circle.radius;return [circle.C[0]+circle.radius*Math.cos(a),circle.C[1]+circle.radius*Math.sin(a)];}return at(suffix,suffixArc,t-circle.length);};
  return {heads:Array.from({length:this.count+1},(_,i)=>point(this.length*i/this.count)),pin,feed,liftMm:lift,phase:r<=0?'fastened':r<.18?'unload-hole':r<.3?'release-pin':r<.65?'withdraw-tail':r<.72?'park-pin':r<.92?'slide-clear':r<1?'depart':'off',slide:smooth(.72,.92,r),depart:smooth(.92,1,r),freeEndBehindFrame:circle.length>=this.length-this.anchorS,expandedRadiusMm:circle.radius};
 }
}
