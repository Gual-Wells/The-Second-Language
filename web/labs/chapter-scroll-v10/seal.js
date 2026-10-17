// Engraved codex identity, independent shoulder contact ink, dark impression.
// Dry ink/pressure is a project adaptation; medieval wax sealing is NOT claimed.
import {transferMasks,opticalInk,noise} from './ink-transfer.js';
export const SEAL_VERSION='SL-CHAPTER-4';
const size=896,padding=64;
let bookImage,inkShoulder;
export async function prepareSeal(){
 bookImage=new Image();bookImage.src='assets/scholarly-codex.png';await bookImage.decode();
 const image=new Image();image.src='assets/ink-shoulder.png';await image.decode();
 inkShoulder=Object.assign(document.createElement('canvas'),{width:256,height:480});const q=inkShoulder.getContext('2d',{willReadFrequently:true});
 q.drawImage(image,image.width*.28,image.height*.07,image.width*.45,image.height*.84,0,0,256,480);
 const pixels=q.getImageData(0,0,256,480);for(let i=0;i<pixels.data.length;i+=4){const light=(pixels.data[i]+pixels.data[i+1]+pixels.data[i+2])/765;pixels.data[i+3]*=1-light;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=255;}q.putImageData(pixels,0,0);
}
const layer=(w=size,h=size)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
function arcText(p,text,r,center,bottom,font){
 p.font=`${font}px Aboensis`;p.textAlign='center';p.textBaseline='alphabetic';
 const chars=[...text],widths=chars.map(c=>p.measureText(c).width),total=widths.reduce((a,b)=>a+b,0);let cursor=-total/2;
 for(let i=0;i<chars.length;i++){
  const s=(cursor+widths[i]/2)/r,a=center+(bottom?-s:s);
  p.save();p.translate(384+Math.cos(a)*r,384+Math.sin(a)*r);p.rotate(a+(bottom?-Math.PI/2:Math.PI/2));p.lineWidth=.85;p.strokeText(chars[i],0,0);p.fillText(chars[i],0,0);p.restore();cursor+=widths[i];
 }
}
function cutRing(p,r,width,phase){
 p.beginPath();
 for(const side of [1,-1])for(let i=0;i<=720;i++){
  const a=(side===1?i:720-i)/720*Math.PI*2;
  const center=r+1.15*Math.sin(a*3+phase)+.50*Math.cos(a*11+.3+phase),w=width*(.97+.14*Math.sin(a*5+phase)+.045*Math.cos(a*17));
  const d=center+side*w/2,x=384+Math.cos(a)*d,y=384+Math.sin(a)*d;
  if(i===0)p.moveTo(x,y);else p.lineTo(x,y);
 }p.fill('evenodd');
}
function tint(source,color){const c=layer(),p=c.getContext('2d');p.drawImage(source,0,0);p.globalCompositeOperation='source-in';p.fillStyle=color;p.fillRect(0,0,size,size);return c;}
function surplusInk(seed){
 const c=layer(),q=c.getContext('2d',{willReadFrequently:true});q.translate(padding,padding);q.fillStyle='white';
 // Excess on the dirty die shoulder: these are actual free-form contact areas,
 // not offsets, dilation or a blur of the intended emblem's stroke mask.
 for(const [x,y,w,h,angle]of [[699,596,65,114,-.45],[94,165,28,58,-.9],[39,362,16,76,.12]]){q.save();q.translate(x,y);q.rotate(angle);q.drawImage(inkShoulder,-w/2,-h/2,w,h);q.restore();}
 const raw=transferMasks(c,seed^9071),s=raw.ink.getContext('2d'),d=s.getImageData(0,0,size,size);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=(y*size+x)*4;d.data[i+3]*=.60+.24*noise(x/13,y/13,seed^632);}
 s.putImageData(d,0,0);return raw.ink;
}
export function makeSeal(seed=0x534c33){
 if(!bookImage)throw Error('Seal emblem not ready');
 const mask=layer(),p=mask.getContext('2d',{willReadFrequently:true});p.fillStyle='white';p.strokeStyle='white';
 p.save();p.translate(padding,padding);
 for(const [i,[r,width]]of [[353,12],[340,4.8],[231,9.8],[219,4.2]].entries())cutRing(p,r,width,i*.91);
 arcText(p,'The Second Language',280,-Math.PI/2,false,66);
 arcText(p,'Attestation',297,Math.PI/2,true,60);
 for(const x of [66,702]){p.beginPath();p.moveTo(x,374);p.lineTo(x+7,384);p.lineTo(x,394);p.lineTo(x-7,384);p.closePath();p.fill();}
 const book=Object.assign(document.createElement('canvas'),{width:360,height:224}),bp=book.getContext('2d');
 bp.drawImage(bookImage,0,bookImage.height*.18,bookImage.width,bookImage.height*.62,0,0,360,224);
 bp.globalCompositeOperation='source-in';bp.fillStyle='white';bp.fillRect(0,0,360,224);p.drawImage(book,204,272);
 // Three small die-face scores, fixed across impressions. They are fine missing
 // strokes across existing ridges, never independent cracks covering the page.
 p.save();p.globalCompositeOperation='destination-out';p.lineCap='round';p.globalAlpha=.72;p.lineWidth=1.3;
 for(const [x,y,dx,dy]of [[601,114,17,30],[216,430,28,-9],[547,578,20,-12]]){p.beginPath();p.moveTo(x,y);p.quadraticCurveTo(x+dx*.43,y+dy*.4+1.3,x+dx,y+dy);p.stroke();}p.restore();
 p.restore();
 const transfer=transferMasks(mask,seed),ink=layer(),q=ink.getContext('2d'),brown=tint(transfer.ink,'#342014');
 // Separate, low-opacity old halo and tighter original wet spread. The intact
 // core remains sharp; a global blur would just recreate the sticker problem.
 q.save();q.filter='blur(3.5px)';q.globalAlpha=.25;q.drawImage(brown,0,0);q.restore();
 q.save();q.filter='blur(.9px)';q.globalAlpha=.28;
 for(const [x,y]of [[.8,.1],[-.45,.65],[.2,-.6]])q.drawImage(brown,x,y);q.restore();
 // Halo occupies the outer fringe. Do not fill the dry contact's uninked core
 // again with the halo layer, which would erase the very pressure variations.
 q.save();q.globalCompositeOperation='destination-out';q.drawImage(mask,0,0);q.restore();
 q.drawImage(transfer.ink,0,0);
 q.drawImage(surplusInk(seed),0,0);
 return {mask,ink,stats:transfer.stats,version:SEAL_VERSION,seed};
}
export function impressSeal(front,inkLayer,relief,seal,box){
 const patch=layer(box.width,box.height),q=patch.getContext('2d',{willReadFrequently:true});q.drawImage(seal.ink,0,0,box.width,box.height);
 const f=front.getContext('2d'),paper=f.getImageData(box.x,box.y,box.width,box.height),printed=opticalInk(paper,q.getImageData(0,0,box.width,box.height));
 // Dyes attenuate the substrate's color instead of replacing it with an opaque
 // patch. Thus folds and wear remain visible through the actual inked area.
 f.putImageData(printed,box.x,box.y);
 const r=relief.getContext('2d');r.fillStyle='#808080';r.fillRect(0,0,relief.width,relief.height);
 // Die pressure remains even where the die did not carry much ink. This height
 // source is independent of the variable optical density and aged ink loss.
 const depression=layer();const d=depression.getContext('2d');d.drawImage(seal.mask,0,0);d.globalCompositeOperation='source-in';d.fillStyle='#202020';d.fillRect(0,0,size,size);
 r.save();r.globalAlpha=.63;r.filter='blur(.9px)';r.drawImage(depression,box.x,box.y,box.width,box.height);r.restore();
 const z=patch.getContext('2d');z.clearRect(0,0,box.width,box.height);z.drawImage(seal.mask,0,0,box.width,box.height);
 const m=z.getImageData(0,0,box.width,box.height),result=f.getImageData(box.x,box.y,box.width,box.height);
 for(let y=2;y<box.height-2;y++)for(let x=2;x<box.width-2;x++){
  const i=(y*box.width+x)*4,gradient=(m.data[((y-1)*box.width+x-1)*4+3]-m.data[((y+1)*box.width+x+1)*4+3])/255;
  for(let c=0;c<3;c++)result.data[i+c]=Math.max(0,Math.min(255,result.data[i+c]*(1+.14*gradient)));
 }f.putImageData(result,box.x,box.y);
}
