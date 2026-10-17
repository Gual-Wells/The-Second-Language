// A matrix-derived impression, not a flat badge: matching scribal lettering,
// line-cut original project book, uneven ink transfer and paper indentation.
// Dry ink/pressure is a project adaptation; medieval wax sealing is NOT claimed.
export const SEAL_VERSION='SL-CHAPTER-2';
const size=768;
let bookPaths;
export async function prepareSeal(){
 const r=await fetch('/icon.svg');if(!r.ok)throw Error('Project icon unavailable');
 const xml=new DOMParser().parseFromString(await r.text(),'image/svg+xml');
 bookPaths=[...xml.querySelectorAll('path')].map(p=>new Path2D(p.getAttribute('d')));
 if(bookPaths.length!==3)throw Error('Project book geometry requires review');
}
const layer=(w=size,h=size)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
function arcText(p,text,r,center,bottom,font){
 p.font=`${font}px Aboensis`;p.textAlign='center';p.textBaseline='alphabetic';
 const chars=[...text],widths=chars.map(c=>p.measureText(c).width),total=widths.reduce((a,b)=>a+b,0);let cursor=-total/2;
 for(let i=0;i<chars.length;i++){
  const s=(cursor+widths[i]/2)/r,a=center+(bottom?-s:s);
  p.save();p.translate(384+Math.cos(a)*r,384+Math.sin(a)*r);p.rotate(a+(bottom?-Math.PI/2:Math.PI/2));p.fillText(chars[i],0,0);p.restore();cursor+=widths[i];
 }
}
export function makeSeal(){
 if(!bookPaths)throw Error('Seal emblem not ready');
 const mask=layer(),p=mask.getContext('2d',{willReadFrequently:true});p.fillStyle='white';p.strokeStyle='white';
 for(const [r,width]of [[353,4.2],[344,1.7],[231,3.1],[224,1.5]]){p.lineWidth=width;p.beginPath();p.arc(384,384,r,0,Math.PI*2);p.stroke();}
 arcText(p,'The Second Language',280,-Math.PI/2,false,66);
 arcText(p,'Attestation',297,Math.PI/2,true,60);
 for(const x of [66,702]){p.beginPath();p.moveTo(x,374);p.lineTo(x+7,384);p.lineTo(x,394);p.lineTo(x-7,384);p.closePath();p.fill();}
 p.save();p.translate(148.48,152.62);p.scale(.92,.92);p.lineWidth=7;p.lineCap='round';p.lineJoin='round';
 p.stroke(bookPaths[0]);p.stroke(bookPaths[1]);p.stroke(bookPaths[2]);p.restore();
 const data=p.getImageData(0,0,size,size),ink=layer(),q=ink.getContext('2d'),a=q.createImageData(size,size);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const i=(y*size+x)*4,pressure=.78+.11*Math.sin(x*.007+y*.003)+.035*Math.sin(x*.22+y*.39)+.025*Math.cos(x*.71-y*.44);
  a.data[i]=48;a.data[i+1]=38;a.data[i+2]=27;a.data[i+3]=data.data[i+3]*pressure;
 }q.putImageData(a,0,0);return {mask,ink,version:SEAL_VERSION};
}
export function impressSeal(front,inkLayer,relief,seal,box){
 const q=inkLayer.getContext('2d');q.save();q.globalAlpha=.93;q.drawImage(seal.ink,box.x,box.y,box.width,box.height);q.restore();
 const r=relief.getContext('2d');r.fillStyle='#808080';r.fillRect(0,0,relief.width,relief.height);
 // Indentation height remains in its own linear texture, UV-locked to the ink.
 const depression=layer();const d=depression.getContext('2d');d.drawImage(seal.mask,0,0);d.globalCompositeOperation='source-in';d.fillStyle='#202020';d.fillRect(0,0,size,size);
 r.save();r.globalAlpha=.50;r.filter='blur(.55px)';r.drawImage(depression,box.x,box.y,box.width,box.height);r.restore();
 // A pressed edge changes the original paper's local luminance; no opaque
 // background disc and no white bevel painted around a separate badge.
 const patch=layer(box.width,box.height),z=patch.getContext('2d');z.drawImage(seal.mask,0,0,box.width,box.height);
 const m=z.getImageData(0,0,box.width,box.height),f=front.getContext('2d'),paper=f.getImageData(box.x,box.y,box.width,box.height);
 for(let y=2;y<box.height-2;y++)for(let x=2;x<box.width-2;x++){
  const i=(y*box.width+x)*4,gradient=(m.data[((y-1)*box.width+x-1)*4+3]-m.data[((y+1)*box.width+x+1)*4+3])/255;
  for(let c=0;c<3;c++)paper.data[i+c]=Math.max(0,Math.min(255,paper.data[i+c]*(1+.12*gradient)));
 }f.putImageData(paper,box.x,box.y);
}
