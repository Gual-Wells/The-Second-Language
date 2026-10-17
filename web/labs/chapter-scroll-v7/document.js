import {charterCopy} from './charter.js';
export {loadImage} from '../chapter-scroll/document.js';
export const DOCUMENT_WIDTH=2048,DOCUMENT_HEIGHT=2868;
let seal;
export async function prepareSeal(){seal=new Image();seal.src='assets/project-seal.svg';await seal.decode();}
function wrap(ctx,text,width){const lines=[];let line='';for(const word of text.split(/\s+/)){const next=line?line+' '+word:word;if(line&&ctx.measureText(next).width>width){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;}
export function documentLines(record){const c=charterCopy(record);return[c.institution,c.heading,c.chapter,c.title,...c.paragraphs,c.witness,c.issuer,...c.identity,c.note];}
export function populateTranscript(container,record){container.replaceChildren();for(const [i,text]of documentLines(record).entries()){const el=document.createElement(i===1?'h3':'p');el.textContent=text;container.append(el);}}
export function createDocument(record,skin,reverse,template){
 if(!seal)throw Error('Seal not loaded');const c=charterCopy(record),w=DOCUMENT_WIDTH,h=DOCUMENT_HEIGHT,layer=()=>Object.assign(document.createElement('canvas'),{width:w,height:h});
 const front=layer(),back=layer(),ink=layer(),f=front.getContext('2d'),p=ink.getContext('2d');f.drawImage(skin,0,0,w,h);back.getContext('2d').drawImage(reverse,0,0,w,h);
 const font=(size,family=template.fontFamily)=>{p.font=`${size}px "${family}"`;};p.fillStyle=template.ink;p.textAlign='center';p.textBaseline='alphabetic';
 font(70,'Uncial Antiqua');p.fillText(c.institution,w/2,205);
 font(137);p.fillText(c.heading,w/2,385);
 font(52,'Uncial Antiqua');p.fillText(c.chapter,w/2,515);
 const left=240,width=w-left*2;let titleSize=112,titleLines;
 do{font(titleSize);titleLines=wrap(p,c.title,width);if(titleLines.length<=2&&titleLines.every(x=>p.measureText(x).width<=width))break;titleSize-=2;}while(titleSize>=92);
 if(titleLines.length>2||titleSize<92)throw Error('Title requires editorial shortening, not compression');
 for(const [i,line]of titleLines.entries())p.fillText(line,w/2,650+i*130);
 let y=790+(titleLines.length-1)*130;const bodySize=87,lineHeight=108;font(bodySize);p.textAlign='left';let lineCount=0;
 for(const [i,para]of c.paragraphs.entries()){
  for(const [j,line]of wrap(p,para,width).entries()){p.globalAlpha=.96+.012*Math.sin(j*1.73+i*2.2);p.fillText(line,left,y);y+=lineHeight;lineCount++;}y+=30;
 }
 if(y>1980)throw Error(`Charter copy overlaps seal reserve (${lineCount} lines, end ${y}); revise the prose`);
 p.globalAlpha=1;font(74);p.fillText(c.witness,left,2190);font(87);p.fillText(c.issuer,left,2310);
 const sealBox={x:1304,y:2000,width:496,height:496};p.globalAlpha=.90;p.drawImage(seal,sealBox.x,sealBox.y,sealBox.width,sealBox.height);p.globalAlpha=1;
 p.textAlign='center';font(40,'Uncial Antiqua');for(const [i,line]of c.identity.entries())p.fillText(line,w/2,2600+i*70);
 font(43);p.fillText(c.note,w/2,2750);
 // Very slight ink wear is confined to ink. Never destroy the emblem, letters
 // or dates to make a decorative counterfeit of an unreadable old document.
 p.globalCompositeOperation='destination-out';p.globalAlpha=.07;for(let i=0;i<2500;i++)p.fillRect((i*719.27)%w,(i*437.71)%h,.6,.9);p.globalCompositeOperation='source-over';p.globalAlpha=1;
 f.globalCompositeOperation='source-atop';f.drawImage(ink,0,0);
 return {front,back,ink,layout:{lastBaseline:y,bodyFontSize:bodySize,lineCount,titleLines:titleLines.length,width:w,height:h,nominalSizeMM:[300,420],marginFraction:left/w,blurredInk:false,sealBox,sealVersion:'SL-CHAPTER-1',issued:record.status==='issued'}};
}
