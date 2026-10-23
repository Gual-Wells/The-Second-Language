import {prepareSeal,makeSeal,impressSeal} from '../chapter-scroll-v12/seal.js';
import {opticalInk} from '../chapter-scroll-v10/ink-transfer.js';
export {prepareSeal};
const canvas=(width=2048,height=2868)=>Object.assign(document.createElement('canvas'),{width,height});
const overlaps=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
export function createChapterSurfaces({plan,record,paper,reverse}){
 if(!document.fonts.check('90px Aboensis'))throw Error('Aboensis unavailable; modern fallback prohibited');
 const w=2048,h=2868,front=canvas(),back=canvas(),ink=canvas(),relief=canvas(),f=front.getContext('2d',{willReadFrequently:true}),p=ink.getContext('2d'),b=back.getContext('2d');
 f.drawImage(paper,0,0,w,h);b.drawImage(reverse||paper,0,0,w,h);
 // Alpha fringe decontamination at the cut silhouette only; do not erase age
 // or recolour the writing field. The selected original stays recoverable.
 let cleanedFringePixels=0;if(plan.material.paperId!=='first-v6-lossless')for(const c of [f,b]){const d=c.getImageData(0,0,w,h),o=new Uint8ClampedArray(d.data),suspect=i=>{const r=o[i],g=o[i+1],b=o[i+2];return Math.max(r,g,b)-Math.min(r,g,b)>70&&((g>=r*.95&&g>b*1.4)||(r>180&&g<r*.62)||(b>=r*.95&&b>g*1.4));};for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=(y*w+x)*4;if(!o[i+3]||!suspect(i))continue;let edge=false;for(const [dx,dy]of [[-5,0],[5,0],[0,-5],[0,5]]){const j=(Math.max(0,Math.min(h-1,y+dy))*w+Math.max(0,Math.min(w-1,x+dx)))*4;if(o[j+3]<128)edge=true;}if(!edge)continue;let best=null;for(let radius=1;radius<=10&&!best;radius++)for(const [dx,dy]of [[radius,0],[-radius,0],[0,radius],[0,-radius],[radius,radius],[-radius,-radius],[radius,-radius],[-radius,radius]]){const xx=x+dx,yy=y+dy;if(xx<0||xx>=w||yy<0||yy>=h)continue;const j=(yy*w+xx)*4;if(o[j+3]>=245&&!suspect(j)){best=j;break;}}if(best!==null){d.data[i]=o[best];d.data[i+1]=o[best+1];d.data[i+2]=o[best+2];cleanedFringePixels++;}}c.putImageData(d,0,0);}
 // Material-aware exposure only: the licensed mother skin remains legible.
 // This is an artistic derivative, not an animal skin physics measurement.
 const m=plan.material,vertical=['left','right'].includes(m.exposedSide),flip=['right','bottom'].includes(m.exposedSide),n=vertical?w:h,from=flip?n:0,to=flip?n*.74:n*.26;
 for(const c of [f,b]){c.save();c.globalCompositeOperation='source-atop';const g=vertical?c.createLinearGradient(from,0,to,0):c.createLinearGradient(0,from,0,to);g.addColorStop(0,`rgba(89,53,22,${m.wearStrength})`);g.addColorStop(.52,`rgba(112,77,34,${m.wearStrength*.25})`);g.addColorStop(1,'rgba(112,77,34,0)');c.fillStyle=g;c.fillRect(0,0,w,h);c.restore();}
 const dt=new Date(record.passedAt||record.sampleTime),date=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(dt),time=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(dt)+'.'+String(dt.getUTCMilliseconds()).padStart(3,'0')+' +08:00';
 const mark=record.sha256.slice(0,16).toUpperCase().match(/.{4}/g).join(' '),identity=[record.recipient,(record.certificationId?'Certified ':'Study ')+date,time,'Mark '+mark];
 const contents={...plan.copy,identity},bounds=[],safe=plan.layout.safe,s=plan.layout.seal,sealBox={left:s.x,right:s.x+s.width,top:s.y,bottom:s.y+s.height};
 for(const block of plan.layout.blocks){const all=Array.isArray(contents[block.role])?contents[block.role]:[contents[block.role]],lines=all.slice(block.start,block.start+block.count);p.font=`${block.fontSize}px Aboensis`;p.textAlign=block.align;p.textBaseline='alphabetic';p.fillStyle=block.color;
  for(const [i,text] of lines.entries()){const y=block.y+i*block.lineHeight,m=p.measureText(text),a={block:block.role,text,left:block.x-m.actualBoundingBoxLeft,right:block.x+m.actualBoundingBoxRight,top:y-m.actualBoundingBoxAscent,bottom:y+m.actualBoundingBoxDescent,fontSize:block.fontSize,baseline:y};if(a.right-a.left>block.width||a.left<safe.x||a.right>safe.x+safe.width||a.top<safe.y||a.bottom>safe.y+safe.height)throw Error(`Actual Aboensis overflow: ${JSON.stringify({glyph:a,safe,block})}`);if(overlaps(a,sealBox))throw Error('Lettering overlaps remembrance impression');for(const old of bounds)if(overlaps(a,old))throw Error(`Lettering collision ${block.role}/${old.block}`);p.fillText(text,block.x,y);bounds.push(a);}
 }
 const seed=parseInt(record.sha256.slice(0,8),16);p.globalCompositeOperation='destination-out';p.globalAlpha=.075;for(let i=0;i<2300;i++)p.fillRect((i*719.27+seed%103)%w,(i*437.71+seed%71)%h,.6,.8);p.globalAlpha=1;p.globalCompositeOperation='source-over';
 // Same optical-density compositing as accepted impression, retaining skin.
 f.putImageData(opticalInk(f.getImageData(0,0,w,h),p.getImageData(0,0,w,h)),0,0);
 const seal=makeSeal(seed,'oblong');impressSeal(front,relief,seal,s);
 return {front,back,ink,relief,sealInk:seal.ink,sealMask:seal.mask,layout:{width:w,height:h,nominalSizeMM:[300,420],contentDigest:record.sha256,artPlanDigest:record.artPlanDigest,textBounds:bounds,composition:plan.layout.composition,identity,material:plan.material,cleanedFringePixels,issued:false},seal:{version:seal.version,variant:seal.variant,seed:seal.seed,stats:seal.stats}};
}
