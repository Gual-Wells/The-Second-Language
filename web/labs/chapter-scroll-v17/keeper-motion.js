// Material-length curve, fixed cross-section and rigid hardware.
export const RELEASE_END=.40;
export const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],(a[2]||0)-(b[2]||0));
function cumulative(p){const a=[0];for(let i=1;i<p.length;i++)a.push(a[i-1]+distance(p[i],p[i-1]));return a;}
function interval(arc,s){s=Math.max(0,Math.min(arc.at(-1),s));let lo=0,hi=arc.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(arc[m]<s)lo=m;else hi=m;}return[lo,hi,(s-arc[lo])/(arc[hi]-arc[lo]||1)];}
function at(p,arc,s){const[a,b,t]=interval(arc,s);return Array.from({length:3},(_,i)=>(p[a][i]||0)*(1-t)+(p[b][i]||0)*t);}
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
export class MaterialPath{
 constructor(data){
  this.data=data;this.points=data.pointsMm;this.arc=cumulative(this.points);this.length=data.lengthMm;this.count=data.boneCount;
  this.anchorS=data.foldEndMm+20;this.A=at(this.points,this.arc,this.anchorS);this.B=at(this.points,this.arc,data.mainEndMm);
  this.middle=this.A.map((v,i)=>(v+this.B[i])/2);const dx=this.B[0]-this.A[0],dy=this.B[1]-this.A[1];this.chord=Math.hypot(dx,dy);this.normal=[-dy/this.chord,dx/this.chord];
  const h=Math.sqrt(data.radiusMm**2-this.chord**2/4),p=this.middle.slice(0,2).map((v,i)=>v+h*this.normal[i]),n=this.middle.slice(0,2).map((v,i)=>v-h*this.normal[i]);this.sign=Math.hypot(...p)<Math.hypot(...n)?1:-1;
  this.suffix=[this.B,...this.points.filter((p,i)=>this.arc[i]>data.mainEndMm+.0001)];this.suffixArc=cumulative(this.suffix);
  this.oldArc=this.circle(data.radiusMm).length;this.holeLocal=data.selectedHoleMm-data.mainEndMm;
  const safe=this.suffix.findIndex(p=>p[0]<5.5);this.liftStart=this.suffixArc[Math.max(0,safe)];
  this.sideStart=this.suffixArc[this.suffix.findIndex(p=>p[0]<0)];
 }
 circle(radius){const h=Math.sqrt(Math.max(0,radius*radius-this.chord*this.chord/4)),C=this.middle.slice(0,2).map((v,i)=>v+this.sign*h*this.normal[i]),angle=Math.atan2(this.A[1]-C[1],this.A[0]-C[0]),end=Math.atan2(this.B[1]-C[1],this.B[0]-C[0]),turn=(angle-end+Math.PI*2)%(Math.PI*2);return{C,angle,length:radius*turn,radius};}
 radiusFor(length){let lo=this.chord/2+.01,hi=this.data.radiusMm+45;for(let i=0;i<32;i++){const m=(lo+hi)/2;if(this.circle(m).length<length)lo=m;else hi=m;}return(lo+hi)/2;}
 restFrame(s){const p=at(this.points,this.arc,s),a=at(this.points,this.arc,s-.08),b=at(this.points,this.arc,s+.08),l=distance(a,b)||1;return[p[0],p[1],(b[0]-a[0])/l,(b[1]-a[1])/l];}
 frame(s,pose){
  const p=pose.point(s),a=pose.point(Math.max(0,s-.08)),b=pose.point(Math.min(this.length,s+.08));
  const t=norm([b[0]-a[0],b[2]-a[2],-b[1]+a[1]]),w=norm([-t[0]*t[1],1-t[1]*t[1],-t[2]*t[1]]),n=[w[1]*t[2]-w[2]*t[1],w[2]*t[0]-w[0]*t[2],w[0]*t[1]-w[1]*t[0]];
  return[p[0],p[2],-p[1],...t,...w,...n];
 }
 sample(r){
  const unloading=smooth(0,.18,r),angle=.55*unloading,along=10*smooth(.18,.34,r),pin=-.45*unloading-.75*smooth(.72,.78,r),feed=smooth(.36,.72,r);
  const BY=-Math.sqrt(this.data.radiusMm**2-100)-3.5,H=at(this.suffix,this.suffixArc,this.holeLocal),start=Math.max(.3,this.holeLocal-5),D=at(this.suffix,this.suffixArc,start);
  const rot=(p,a)=>[Math.cos(a)*p[0]-Math.sin(a)*p[1],Math.sin(a)*p[0]+Math.cos(a)*p[1]];
  const hp=rot([H[0]+10+along,H[1]-BY-along*.13],-.45*unloading),target=[hp[0]-10,hp[1]+BY];
  const transform=p=>{const q=rot([p[0]-H[0],p[1]-H[1]],angle);return[target[0]+q[0],target[1]+q[1],0];};
  const end=transform(D),before=at(this.suffix,this.suffixArc,start-.08),after=at(this.suffix,this.suffixArc,start+.08),T=norm(rot([after[0]-before[0],after[1]-before[1]],angle));
  const c1=[this.B[0]-9,this.B[1]-1],c2=[end[0]-T[0]*4,end[1]-T[1]*4],prefix=[];
  for(let i=0;i<=80;i++){
   const t=i/80,u=1-t,old=at(this.suffix,this.suffixArc,start*t),p=[u**3*this.B[0]+3*u*u*t*c1[0]+3*u*t*t*c2[0]+t**3*end[0]-6*Math.sin(Math.PI*t)**2*smooth(0,8,along),u**3*this.B[1]+3*u*u*t*c1[1]+3*u*t*t*c2[1]+t**3*end[1]];
   prefix.push([old[0]*(1-unloading)+p[0]*unloading,old[1]*(1-unloading)+p[1]*unloading,0]);
  }
  const suffix=[...prefix,...this.suffix.filter((p,i)=>this.suffixArc[i]>start).map(transform)],sa=cumulative(suffix);
  const newPrefix=sa[80],tight=this.oldArc-(newPrefix-start),length=tight*(1-feed)+(this.length-this.anchorS+4)*feed,circle=this.circle(this.radiusFor(length));
  const point=s=>{if(r===0||s<=this.anchorS)return at(this.points,this.arc,s);const u=s-this.anchorS;if(u<=circle.length){const a=circle.angle-u/circle.radius;return[circle.C[0]+circle.radius*Math.cos(a),circle.C[1]+circle.radius*Math.sin(a),0];}return at(suffix,sa,u-circle.length);};
  return{r,point,pin,feed,angle,along,sideMm:0,circleCenter:r===0?[0,0]:circle.C,phase:r<=0?'fastened':r<.18?'unload-hole':r<.36?'release-hole':r<.72?'withdraw-tail':r<.79?'park-pin':r<.94?'slide-clear':r<1?'depart':'off',slide:smooth(.79,.94,r),depart:smooth(.94,1,r),freeEndBehindFrame:circle.length>=this.length-this.anchorS,expandedRadiusMm:circle.radius};
 }
}
