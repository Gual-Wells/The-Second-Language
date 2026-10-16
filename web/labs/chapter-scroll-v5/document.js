export {populateTranscript,loadImage,documentLines} from '../chapter-scroll/document.js';
export const DOCUMENT_WIDTH=2048,DOCUMENT_HEIGHT=2868;
function wrap(ctx,text,width){const lines=[];let line='';for(const word of text.split(/\s+/)){const next=line?line+' '+word:word;if(line&&ctx.measureText(next).width>width){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;}
export function createDocument(record,skin,reverse,template){
 const w=DOCUMENT_WIDTH,h=DOCUMENT_HEIGHT,layer=()=>Object.assign(document.createElement('canvas'),{width:w,height:h});
 const front=layer(),back=layer(),ink=layer(),f=front.getContext('2d'),p=ink.getContext('2d');
 f.drawImage(skin,0,0,w,h);back.getContext('2d').drawImage(reverse,0,0,w,h);
 const font=size=>{p.font=`${size}px "${template.fontFamily}"`;};
 p.fillStyle=template.ink;p.textAlign='center';p.textBaseline='alphabetic';
 font(88);p.fillText(record.institution,w/2,290);
 font(142);p.fillText(record.heading,w/2,485,1610);
 font(73);p.fillText(record.introduction,w/2,618,1600);
 font(116);p.fillText(record.displayTitle,w/2,795,1640);
 const left=233,width=w-left*2;let y=1020,fontSize=93;
 while(fontSize>68){font(fontSize);const n=record.paragraphs.reduce((s,t)=>s+wrap(p,t,width).length,0);if(y+n*fontSize*1.3+100<=2450)break;fontSize--;}
 p.textAlign='left';font(fontSize);let lineCount=0;
 for(const [i,para] of record.paragraphs.entries()){
  for(const [j,line] of wrap(p,para,width).entries()){
   p.globalAlpha=.94+.018*Math.sin(j*1.73+i*2.2);p.fillText(line,left,y);y+=fontSize*1.3;lineCount++;
  }y+=36;
 }
 if(y>2490)throw Error('Charter text exceeds its writing field');
 p.globalAlpha=1;p.textAlign='center';font(83);p.fillText(record.colophon,w/2,2600);
 font(44);p.fillText(record.specimenNote,w/2,2710);
 // Fine pigment loss, without blurring the glyph outlines.
 p.globalCompositeOperation='destination-out';p.globalAlpha=.10;
 for(let i=0;i<3100;i++){const x=(i*719.27)%w,y=(i*437.71)%h;p.fillRect(x,y,.6,.9);}
 p.globalCompositeOperation='source-over';p.globalAlpha=1;
 f.globalCompositeOperation='source-atop';f.drawImage(ink,0,0);
 return {front,back,ink,layout:{lastBaseline:y,bodyFontSize:fontSize,lineCount,width:w,height:h,nominalSizeMM:[300,420],marginFraction:left/w,blurredInk:false}};
}
