import {transferMasks,opticalInk} from '../chapter-scroll-v10/ink-transfer.js';
export const SEAL_VERSION='SL-KEEPSAKE-1';
const size=896,layer=(w=size,h=size)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
let shoulder;
export async function prepareSeal(){
 const im=new Image();im.src='../chapter-scroll-v10/assets/ink-shoulder.png';await im.decode();shoulder=layer(256,480);const p=shoulder.getContext('2d',{willReadFrequently:true});
 p.drawImage(im,im.width*.28,im.height*.07,im.width*.45,im.height*.84,0,0,256,480);const d=p.getImageData(0,0,256,480);
 for(let i=0;i<d.data.length;i+=4){d.data[i+3]*=1-(d.data[i]+d.data[i+1]+d.data[i+2])/765;d.data[i]=d.data[i+1]=d.data[i+2]=255;}p.putImageData(d,0,0);
}
function arcText(p,text,r,center,bottom,font){
 p.font=`${font}px Aboensis`;p.textAlign='center';const chars=[...text],widths=chars.map(c=>p.measureText(c).width);let x=-widths.reduce((a,b)=>a+b,0)/2;
 for(let i=0;i<chars.length;i++){const a=center+(bottom?-1:1)*(x+widths[i]/2)/r;p.save();p.translate(448+Math.cos(a)*r,448+Math.sin(a)*r);p.rotate(a+(bottom?-Math.PI/2:Math.PI/2));p.fillText(chars[i],0,0);p.restore();x+=widths[i];}
}
export function makeSeal(seed,variant='oblong'){
 if(!shoulder)throw Error('Ink texture not ready');const mask=layer(),p=mask.getContext('2d');p.fillStyle=p.strokeStyle='white';p.textAlign='center';p.lineCap='round';
 let crop;
 if(variant==='oblong'){
  p.lineWidth=8.5;p.beginPath();p.moveTo(100,304);p.bezierCurveTo(340,301,579,305,796,303);p.lineTo(797,576);p.bezierCurveTo(590,578,340,573,99,577);p.closePath();p.stroke();
  for(const [text,y,start]of [['The Second Language',410,80],['In remembrance',527,72]]){
   let font=start,metrics;do{p.font=`${font}px Aboensis`;metrics=p.measureText(text);if(metrics.actualBoundingBoxLeft+metrics.actualBoundingBoxRight<=620)break;font-=2;}while(font>=58);
   if(font<58)throw Error('Stamp lettering requires another die layout');p.fillText(text,448,y);
  }crop={x:56,y:260,width:784,height:360};
 }else if(variant==='round'){
  for(const [r,line]of [[330,10],[306,3.5]]){p.lineWidth=line;p.beginPath();for(let i=0;i<=512;i++){const a=i/512*Math.PI*2,d=r+1.4*Math.sin(a*3)+.7*Math.cos(a*11),x=448+Math.cos(a)*d,y=448+Math.sin(a)*d;if(!i)p.moveTo(x,y);else p.lineTo(x,y);}p.closePath();p.stroke();}
  arcText(p,'The Second Language',249,-Math.PI/2,false,69);arcText(p,'In remembrance',250,Math.PI/2,true,60);p.font='192px Aboensis';p.fillText('SL',448,514);crop={x:52,y:52,width:792,height:792};
 }else throw Error('Unknown stamp');
 p.save();p.globalCompositeOperation='destination-out';p.lineWidth=1.7;for(const [x,y,dx,dy]of [[100,337,18,7],[589,305,12,21],[794,540,15,-10]]){p.beginPath();p.moveTo(x,y);p.lineTo(x+dx,y+dy);p.stroke();}p.restore();
 const contact=transferMasks(mask,seed),ink=layer(),q=ink.getContext('2d');q.save();q.filter='blur(2px)';q.globalAlpha=.25;q.drawImage(contact.ink,0,0);q.restore();q.globalCompositeOperation='destination-out';q.drawImage(mask,0,0);q.globalCompositeOperation='source-over';q.drawImage(contact.ink,0,0);
 const extra=layer(),e=extra.getContext('2d');e.save();e.translate(variant==='round'?772:792,variant==='round'?606:532);e.rotate(-.3);e.drawImage(shoulder,-21,-39,42,78);e.restore();q.globalAlpha=.74;q.drawImage(transferMasks(extra,seed^9071).ink,0,0);q.globalAlpha=1;
 const cut=source=>{const c=layer(crop.width,crop.height);c.getContext('2d').drawImage(source,crop.x,crop.y,crop.width,crop.height,0,0,crop.width,crop.height);return c;};
 return {mask:cut(mask),ink:cut(ink),seed,variant,version:SEAL_VERSION,stats:contact.stats};
}
export function impressSeal(front,relief,seal,box){
 const patch=layer(box.width,box.height),p=patch.getContext('2d',{willReadFrequently:true});p.drawImage(seal.ink,0,0,box.width,box.height);
 const f=front.getContext('2d');f.putImageData(opticalInk(f.getImageData(box.x,box.y,box.width,box.height),p.getImageData(0,0,box.width,box.height)),box.x,box.y);
 const r=relief.getContext('2d');r.fillStyle='#808080';r.fillRect(0,0,relief.width,relief.height);
 const pressure=layer(seal.mask.width,seal.mask.height),z=pressure.getContext('2d');z.drawImage(seal.mask,0,0);z.globalCompositeOperation='source-in';z.fillStyle='#303030';z.fillRect(0,0,pressure.width,pressure.height);
 r.save();r.globalAlpha=.52;r.filter='blur(.7px)';r.drawImage(pressure,box.x,box.y,box.width,box.height);r.restore();
}
