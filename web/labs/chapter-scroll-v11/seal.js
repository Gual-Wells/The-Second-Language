// A text-only square project stamp: a contemporary adaptation, not a claim
// that this was the universal medieval European authentication instrument.
import {transferMasks} from '../chapter-scroll-v10/ink-transfer.js';
export {impressSeal} from '../chapter-scroll-v10/seal.js';
export const SEAL_VERSION='SL-TEXT-SQUARE-1';
const size=896,layer=(w=size,h=size)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
let shoulder;
export async function prepareSeal(){
 const im=new Image();im.src='../chapter-scroll-v10/assets/ink-shoulder.png';await im.decode();
 shoulder=layer(256,480);const p=shoulder.getContext('2d',{willReadFrequently:true});
 p.drawImage(im,im.width*.28,im.height*.07,im.width*.45,im.height*.84,0,0,256,480);
 const d=p.getImageData(0,0,256,480);for(let i=0;i<d.data.length;i+=4){d.data[i+3]*=1-(d.data[i]+d.data[i+1]+d.data[i+2])/765;d.data[i]=d.data[i+1]=d.data[i+2]=255;}p.putImageData(d,0,0);
}
function frame(p,inset,width){
 p.lineWidth=width;p.lineJoin='miter';p.beginPath();p.moveTo(inset,inset+1);
 p.bezierCurveTo(300,inset-1,600,inset+1,size-inset,inset);
 p.bezierCurveTo(size-inset+1,350,size-inset-1,600,size-inset,size-inset);
 p.bezierCurveTo(600,size-inset-1,300,size-inset+2,inset,size-inset);
 p.bezierCurveTo(inset-1,600,inset+1,300,inset,inset+1);p.stroke();
}
export function makeSeal(seed){
 if(!shoulder)throw Error('Ink contact resource not ready');
 const mask=layer(),p=mask.getContext('2d');p.fillStyle=p.strokeStyle='white';p.textAlign='center';
 frame(p,102,16);frame(p,129,4.4);
 for(const [text,y,font]of [['The',282,106],['Second',424,135],['Language',570,131],['Attested',710,80]]){
  p.font=`${font}px Aboensis`;if(p.measureText(text).width>590)throw Error('Seal word exceeds die face');
  p.lineWidth=1.6;p.strokeText(text,448,y);p.fillText(text,448,y);
 }
 p.lineWidth=4.8;p.beginPath();p.moveTo(245,617);p.quadraticCurveTo(448,614,651,618);p.stroke();
 // Fixed, sparse die damage; impression-specific contact remains separate.
 p.save();p.globalCompositeOperation='destination-out';p.lineWidth=2;
 for(const [x,y,dx,dy]of [[102,318,22,9],[636,102,15,22],[526,767,25,4]]){p.beginPath();p.moveTo(x,y);p.lineTo(x+dx,y+dy);p.stroke();}p.restore();
 const transfer=transferMasks(mask,seed),ink=layer(),q=ink.getContext('2d');
 q.save();q.filter='blur(2.2px)';q.globalAlpha=.23;q.drawImage(transfer.ink,0,0);q.restore();
 q.globalCompositeOperation='destination-out';q.drawImage(mask,0,0);q.globalCompositeOperation='source-over';q.drawImage(transfer.ink,0,0);
 // Separate shoulder contamination may cross the square, rather than merely
 // dilating the designed lines. Native texture from the reviewed v10 asset.
 const excess=layer(),e=excess.getContext('2d');
 for(const [x,y,w,h,angle]of [[792,681,70,132,-.28],[100,220,26,65,-.55]]){e.save();e.translate(x,y);e.rotate(angle);e.drawImage(shoulder,-w/2,-h/2,w,h);e.restore();}
 q.save();q.globalAlpha=.88;q.drawImage(transferMasks(excess,seed^9071).ink,0,0);q.restore();
 return {mask,ink,seed,version:SEAL_VERSION,stats:transfer.stats};
}
