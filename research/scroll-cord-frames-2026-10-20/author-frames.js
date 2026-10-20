// Offline 2D drawing instructions. The viewer plays the resulting raster frames.
// These are authored poses, not a rope simulation or a three-dimensional model.
export const FRAME_SIZE=384, FRAME_COUNT=64;
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const mix=(a,b,t)=>a+(b-a)*t;
export function pose(r){
 const left=1-smooth(.08,.43,r),right=1-smooth(.30,.65,r),open=smooth(.55,.78,r);
 const pull=smooth(0,.48,r),cx=192,cy=192,wrap=1-smooth(.34,.64,r);
 const A=[[cx,cy-56],[cx-5,cy-20],
  [cx-10-42*left,cy-11-14*left],[cx-12-45*left,cy+6+18*left],
  [cx-6,cy+10],[cx-10*wrap,cy-7*wrap],[cx+1*wrap,cy-13*wrap],
  [cx+13*wrap,cy-3*wrap],[cx+10*wrap,cy+12*wrap],[cx,cy+14*wrap],
  [cx+24+53*pull+14*open,cy+24+10*pull],
  [cx+42+59*pull,cy+48-10*pull+15*open]];
 const B=[[cx,cy+58],[cx+5,cy+20],
  [cx+10+42*right,cy+11+14*right],[cx+12+45*right,cy-6-18*right],
  [cx+6,cy-10],[cx-10,cy+2],
  [cx-24-25*open,cy+30+28*open],[cx-35-48*open,cy+64+20*open]];
 // The knot has gone by this point; the same visible standing segments splay
 // out as the open binding is lifted. No image opacity or cross-dissolve.
 for(let i=1;i<A.length;i++){A[i][0]+=open*(16+i*2);A[i][1]-=open*(8-i);}
 for(let i=1;i<B.length;i++){B[i][0]-=open*(18+i*2);B[i][1]+=open*(8-i);}
 return {A,B,left,right,pull,open,phase:r<.08?'take-up':r<.43?'release-first-loop':r<.65?'release-second-loop':r<.78?'open-binding':'lift-clear'};
}
function sample(points){
 const out=[];
 for(let k=0;k<points.length-1;k++){
  const p0=points[Math.max(0,k-1)],p1=points[k],p2=points[k+1],p3=points[Math.min(points.length-1,k+2)];
  const steps=Math.max(8,Math.ceil(Math.hypot(p2[0]-p1[0],p2[1]-p1[1])*1.5));
  for(let j=0;j<steps;j++){
   const t=j/steps,t2=t*t,t3=t2*t;
   out.push([0,1].map(i=>.5*((2*p1[i])+(-p0[i]+p2[i])*t+(2*p0[i]-5*p1[i]+4*p2[i]-p3[i])*t2+(-p0[i]+3*p1[i]-3*p2[i]+p3[i])*t3)));
  }
 }
 out.push(points.at(-1));return out;
}
function line(ctx,p,width,stroke){ctx.beginPath();p.forEach((v,i)=>i?ctx.lineTo(...v):ctx.moveTo(...v));ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=stroke;ctx.stroke();}
function textured(ctx,points,image,bounds,width,offset=0,range=null){
 const p=sample(points);let arc=0;
 for(let i=0;i<p.length-1;i++){
  const a=p[i],b=p[i+1],d=Math.hypot(b[0]-a[0],b[1]-a[1]);if(d<.01)continue;
  if(!range||(i/p.length>=range[0]&&i/p.length<=range[1])){
   const length=width*bounds.w/bounds.h,s=(((arc+offset)/length)%1+1)%1;
   const sw=Math.max(1,(d+1.25)/width*bounds.h);
   ctx.save();ctx.translate(...a);ctx.rotate(Math.atan2(b[1]-a[1],b[0]-a[0]));
   ctx.drawImage(image,bounds.x+s*(bounds.w-sw),bounds.y,sw,bounds.h,-.5,-width/2,d+1.25,width);ctx.restore();
  }
  arc+=d;
 }
 return p;
}
export function drawFrame(ctx,r,image,bounds){
 ctx.clearRect(0,0,FRAME_SIZE,FRAME_SIZE);const p=pose(r);
 // A soft contact shadow is authored with the drawing, not used to hide gaps.
 for(const points of [p.A,p.B]){
  ctx.save();ctx.translate(1.4,2.8);ctx.filter='blur(2.5px)';line(ctx,sample(points),10,'rgba(32,18,13,.35)');ctx.restore();
 }
 textured(ctx,p.A,image,bounds,9,22+p.pull*35);
 textured(ctx,p.B,image,bounds,9,238-p.pull*22);
 // At the bow's central crossing the returning strand passes above the other
 // one. This overlay uses the identical path and texture coordinates.
 if(r<.64)textured(ctx,p.A,image,bounds,9,22+p.pull*35,[.49,.70]);
}
export function drawRear(ctx,image,bounds){
 ctx.clearRect(0,0,FRAME_SIZE,FRAME_SIZE);
 textured(ctx,[[192,136],[193,160],[192,192],[191,224],[192,250]],image,bounds,7.4,120);
}
