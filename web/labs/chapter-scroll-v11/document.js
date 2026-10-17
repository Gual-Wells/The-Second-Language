import {charterCopy,identityLines} from './charter.js';
import {prepareSeal,makeSeal,impressSeal,SEAL_VERSION} from './seal.js';
export {prepareSeal};
export {loadImage} from '../chapter-scroll/document.js';
export const DOCUMENT_WIDTH=2048,DOCUMENT_HEIGHT=2732;
const wrap=(p,text,width)=>{const lines=[];let line='';for(const word of text.split(/\s+/)){const next=line?line+' '+word:word;if(line&&p.measureText(next).width>width){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;};
export function documentLines(r){const c=charterCopy(r);return[c.institution,c.heading,c.address,c.recipient,c.chapter,c.title,...c.paragraphs,c.recordLabel,...identityLines(r),...c.sealLegends,c.note].filter(Boolean);}
export function populateTranscript(container,r){container.replaceChildren();for(const [i,text]of documentLines(r).entries()){const el=document.createElement(i===1?'h3':'p');el.textContent=text;container.append(el);}}
// Constrained pen-end variants, not an invented signature attributed to a human.
function flourish(p,x,y,seed){
 p.save();p.translate(x,y);p.lineWidth=2.6;p.strokeStyle='#493020';
 const reach=340+(seed%3)*28;p.beginPath();p.moveTo(-reach/2,0);p.bezierCurveTo(-100,-18,95,24,reach/2,0);p.bezierCurveTo(reach/2+40,-16,reach/2-3,-43,reach/2-22,-22);p.stroke();
 p.lineWidth=1.5;p.beginPath();p.moveTo(-100,13);p.bezierCurveTo(20,30,120,23,180,7);p.stroke();p.restore();
}
export function createDocument(r,skin,reverse,template){
 const c=charterCopy(r),ids=identityLines(r),seed=parseInt(r.artifactDigest.slice(0,8),16),seal=makeSeal(seed),w=DOCUMENT_WIDTH,h=DOCUMENT_HEIGHT,layer=()=>Object.assign(document.createElement('canvas'),{width:w,height:h});
 const front=layer(),back=layer(),ink=layer(),relief=layer(),f=front.getContext('2d'),p=ink.getContext('2d');
 f.drawImage(skin,0,0,w,h);back.getContext('2d').drawImage(reverse,0,0,w,h);
 p.fillStyle=template.ink;p.textAlign='center';p.textBaseline='alphabetic';
 const font=size=>p.font=`${size}px ${template.fontFamily}`;
 const centered=(text,y,size,max=1600)=>{font(size);if(p.measureText(text).width>max)throw Error(`Heading needs a new line: ${text}`);p.fillText(text,w/2,y);};
 centered(c.institution,270,88);
 centered(c.heading,465,116,1680);
 let titleSize=104,titleLines;do{font(titleSize);titleLines=wrap(p,c.title,1580);if(titleLines.length<=2)break;titleSize-=2;}while(titleSize>=84);
 if(titleLines.length>2||titleLines.some(t=>p.measureText(t).width>1580))throw Error('Title needs an editorial layout');
 const longTitle=titleLines.length===2;
 centered(c.address,longTitle?615:655,72);
 centered(c.recipient,longTitle?810:850,184);
 flourish(p,w/2,longTitle?890:930,seed);
 centered(c.chapter,longTitle?985:1030,66);
 font(titleSize);for(const [i,line]of titleLines.entries())p.fillText(line,w/2,(longTitle?1095:1150)+i*108);
 const left=236,width=w-left*2,start=longTitle?1360:1320;let bodySize=78,bodyLines,lineHeight;
 // Two-line chapter titles keep their full text; only a small, specified
 // body-size range is available before requiring a different editorial layout.
 while(bodySize>=74){font(bodySize);lineHeight=Math.round(bodySize*1.23);bodyLines=c.paragraphs.map(t=>wrap(p,t,width));const lines=bodyLines.flat(),bottom=start+(lines.length-1)*lineHeight+44+Math.max(...lines.map(t=>p.measureText(t).actualBoundingBoxDescent));if(bottom<=2215)break;bodySize-=2;}
 if(bodySize<74)throw Error('Copy requires another editorial layout');
 let y=start,lastInkBottom=0,lineCount=0;p.textAlign='left';
 for(const [n,para]of c.paragraphs.entries()){
  const lines=bodyLines[n];
  for(const [i,line]of lines.entries()){p.globalAlpha=.95+.018*Math.sin(i*1.6+n*2);p.fillText(line,left,y);lastInkBottom=Math.max(lastInkBottom,y+p.measureText(line).actualBoundingBoxDescent);y+=lineHeight;lineCount++;}y+=22;
 }
 if(lastInkBottom>2215)throw Error(`Copy overlaps attestation (${lineCount} lines, bottom ${lastInkBottom}); revise layout`);
 p.globalAlpha=1;
 const sealBox={x:253,y:2220,width:390,height:390};impressSeal(front,ink,relief,seal,sealBox);
 p.textAlign='left';font(64);p.fillText(c.recordLabel,825,2280);
 font(64);p.fillText(ids[0],825,2370);
 font(67);p.fillText(ids[1],825,2455);
 font(57);p.fillText(ids[2],825,2530);
 p.textAlign='center';font(44);if(c.note)p.fillText(c.note,w/2,2630);
 // Paper-preserving optical ink used for the seal; body retains clear strokes
 // and minute ink-only wear. No global blur, red coloring or gilded ornament.
 p.globalCompositeOperation='destination-out';p.globalAlpha=.08;for(let i=0;i<2600;i++)p.fillRect((i*719.27+seed%103)%w,(i*437.71+seed%71)%h,.65,.8);p.globalCompositeOperation='source-over';p.globalAlpha=1;
 f.globalCompositeOperation='source-atop';f.drawImage(ink,0,0);
 return {front,back,ink,relief,seal,layout:{width:w,height:h,nominalSizeMM:[270,360],lastInkBottom,lineCount,titleLines:titleLines.length,bodyFontSize:bodySize,sealBox,sealVersion:SEAL_VERSION,sealContact:seal.stats,printedFonts:['Aboensis'],issued:c.issued,presentation:c.presentation,recipient:c.recipient,identity:ids,artifactDigest:r.artifactDigest,artSeed:seed}};
}
