export {populateTranscript,loadImage,documentLines} from '../chapter-scroll/document.js';
export const DOCUMENT_WIDTH=1536,DOCUMENT_HEIGHT=2304;
function wrap(ctx,text,width){const lines=[];let line='';for(const word of text.split(/\s+/)){const next=line?line+' '+word:word;if(line&&ctx.measureText(next).width>width){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;}
export function createDocument(record,skin,reverse,template){
 const w=DOCUMENT_WIDTH,h=DOCUMENT_HEIGHT;
 const layer=()=>Object.assign(document.createElement('canvas'),{width:w,height:h});
 const paper=layer(),back=layer(),ink=layer(),front=layer();
 paper.getContext('2d').drawImage(skin,0,0,w,h);
 back.getContext('2d').drawImage(reverse,0,0,w,h);
 const p=ink.getContext('2d'),font=size=>{p.font=`${size}px "${template.fontFamily}"`;};p.textAlign='center';p.textBaseline='alphabetic';
 p.fillStyle='#3b271c';font(60);p.fillText(record.institution,w/2,310);
 p.fillStyle=template.rubric;font(122);p.fillText(record.heading,w/2,510,1120);
 p.fillStyle='#39291d';font(53);p.fillText(record.introduction,w/2,635,1040);
 font(88);p.fillText(record.displayTitle,w/2,765,1080);
 const left=250,width=1036;let y=910,fontSize=63;
 while(fontSize>46){font(fontSize);const n=record.paragraphs.reduce((sum,t)=>sum+wrap(p,t,width).length,0);if(y+n*fontSize*1.25+90<=2020)break;fontSize--;}
 p.textAlign='left';font(fontSize);
 for(const [i,para] of record.paragraphs.entries()){
   const lines=wrap(p,para,width);
   for(const [j,line] of lines.entries()){
     p.fillStyle=(j+i)%4===0?'#493323':template.ink;
     p.fillText(line,left,y);y+=fontSize*1.25;
   }
   y+=30;
 }
 if(y>2050)throw Error('Document exceeds its writing area');
 p.textAlign='center';p.fillStyle='#722c28';font(66);p.fillText(record.colophon,w/2,2115);
 p.fillStyle='#564333';font(35);p.fillText(record.specimenNote,w/2,2190);
 const f=front.getContext('2d');f.drawImage(paper,0,0);f.globalCompositeOperation='source-atop';
 // Actual font glyphs, independent of art. Subtle absorption softens only the ink.
 f.globalAlpha=.22;f.filter='blur(.7px)';f.drawImage(ink,0,0);f.filter='none';f.globalAlpha=.92;f.drawImage(ink,0,0);
 return {front,back,ink,layout:{lastBaseline:y,bodyFontSize:fontSize,width:w,height:h}};
}
