export {populateTranscript,loadImage,documentLines} from '../chapter-scroll/document.js';
export const DOCUMENT_WIDTH=1536,DOCUMENT_HEIGHT=2304;
function wrap(ctx,text,width){const lines=[];let line='';for(const word of text.split(/\s+/)){const next=line?line+' '+word:word;if(line&&ctx.measureText(next).width>width){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;}
export function createDocument(record,skin,reverse,template){
 const w=DOCUMENT_WIDTH,h=DOCUMENT_HEIGHT,layer=()=>Object.assign(document.createElement('canvas'),{width:w,height:h});
 const paper=layer(),back=layer(),ink=layer(),front=layer();
 paper.getContext('2d').drawImage(skin,0,0,w,h);back.getContext('2d').drawImage(reverse,0,0,w,h);
 const p=ink.getContext('2d'),font=size=>{p.font=`${size}px "${template.fontFamily}"`;};
 p.textAlign='center';p.textBaseline='alphabetic';p.fillStyle=template.ink;
 font(62);p.fillText(record.institution,w/2,285);
 font(106);p.fillText(record.heading,w/2,475,1140);
 font(55);p.fillText(record.introduction,w/2,600,1100);
 font(84);p.fillText(record.displayTitle,w/2,725,1130);
 const left=215,width=1106;let y=895,fontSize=63;
 while(fontSize>46){font(fontSize);const n=record.paragraphs.reduce((sum,t)=>sum+wrap(p,t,width).length,0);if(y+n*fontSize*1.29+90<=1990)break;fontSize--;}
 p.textAlign='left';font(fontSize);
 for(const [i,para] of record.paragraphs.entries()){
  for(const [j,line] of wrap(p,para,width).entries()){
   p.fillStyle=(i+j)%5===0?'#44382a':template.ink;p.globalAlpha=.90+.035*Math.sin(j*1.73+i*2.2);
   p.fillText(line,left,y);y+=fontSize*1.29;
  }y+=30;
 }
 p.globalAlpha=1;if(y>2020)throw Error('Document exceeds writing area');
 p.textAlign='center';font(63);p.fillStyle=template.ink;p.fillText(record.colophon,w/2,2100);
 font(35);p.fillStyle='#514335';p.fillText(record.specimenNote,w/2,2190);
 // Reuse v2's independent ink-wear idea at a restrained scale: fine irregular
 // pigment losses, with more wear at the old fold than in intact writing areas.
 let state=104729+record.chapterNumber;const random=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};
 p.globalCompositeOperation='destination-out';
 for(let i=0;i<10000;i++){
  const x=random()*w,iy=random()*h,creaseY=h*(.419+.047*x/w),atFold=Math.abs(iy-creaseY)<11;
  p.globalAlpha=atFold?.20+random()*.18:.025+random()*.09;p.fillRect(x,iy,.5+random()*1.7,.4+random()*1.1);
 }
 p.globalAlpha=1;p.globalCompositeOperation='source-over';
 const f=front.getContext('2d');f.drawImage(paper,0,0);f.globalCompositeOperation='source-atop';
 f.globalAlpha=.12;f.filter='blur(.6px)';f.drawImage(ink,0,0);f.filter='none';f.globalAlpha=.94;f.drawImage(ink,0,0);
 return {front,back,ink,layout:{lastBaseline:y,bodyFontSize:fontSize,width:w,height:h}};
}
