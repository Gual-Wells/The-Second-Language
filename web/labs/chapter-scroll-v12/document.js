import {charterCopy,identityLines} from './charter.js';
import {prepareSeal,makeSeal,impressSeal,SEAL_VERSION} from './seal.js';
export {prepareSeal};
export {loadImage} from '../chapter-scroll/document.js';
export const DOCUMENT_WIDTH=2048,DOCUMENT_HEIGHT=2868;
const wrap=(p,text,width)=>{const lines=[];let line='';for(const word of text.split(/\s+/)){const next=line?line+' '+word:word;if(line&&p.measureText(next).width>width){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;};
export function documentLines(r){const c=charterCopy(r);return[c.chapter,c.title,...c.paragraphs,c.colophon,...c.sealLegends,...identityLines(r),c.note].filter(Boolean);}
export function populateTranscript(container,r){container.replaceChildren();for(const [i,text]of documentLines(r).entries()){const el=document.createElement(i===1?'h3':'p');el.textContent=text;container.append(el);}}
export function createDocument(r,skin,reverse,template,ornament){
 const c=charterCopy(r),ids=identityLines(r),seed=parseInt(r.artifactDigest.slice(0,8),16),seal=makeSeal(seed,r.sealVariant),w=DOCUMENT_WIDTH,h=DOCUMENT_HEIGHT,layer=()=>Object.assign(document.createElement('canvas'),{width:w,height:h});
 const front=layer(),back=layer(),ink=layer(),relief=layer(),f=front.getContext('2d'),p=ink.getContext('2d');f.drawImage(skin,0,0,w,h);back.getContext('2d').drawImage(reverse,0,0,w,h);
 // One independent marginal drawing. No whole-page AI image, page mask or
 // generated lettering; preserve the reviewed parchment and all actual text.
 if(!ornament)throw Error('Chapter ornament missing');f.globalCompositeOperation='source-atop';f.globalAlpha=.82;f.drawImage(ornament,255,915,300,900);f.globalAlpha=1;
 const font=n=>p.font=`${n}px ${template.fontFamily}`;p.textAlign='center';p.textBaseline='alphabetic';p.fillStyle=template.rubric;font(68);p.fillText(c.chapter,w/2,360);
 p.fillStyle=template.ink;let titleLines=r.chapterId==='2026-10-02'&&c.title==='The Line on the Map'?['The Line','on the Map']:null;
 let titleSize=146;if(!titleLines){do{font(titleSize);titleLines=wrap(p,c.title,1480);if(titleLines.length<=2)break;titleSize-=2;}while(titleSize>=112);}
 font(titleSize);if(titleLines.length>2||titleLines.some(s=>p.measureText(s).width>1480))throw Error('Chapter title needs a separate layout');
 for(const [i,line]of titleLines.entries())p.fillText(line,w/2,585+i*170);
 p.textAlign='left';font(106);let y=1100,lastInkBottom=0,lineCount=0;const bodyLeft=652,bodyWidth=1134,lineHeight=145;
 for(const paragraph of c.paragraphs){for(const line of wrap(p,paragraph,bodyWidth)){p.fillText(line,bodyLeft,y);lastInkBottom=Math.max(lastInkBottom,y+p.measureText(line).actualBoundingBoxDescent);y+=lineHeight;lineCount++;}y+=65;}
 if(lastInkBottom>1920)throw Error('Inscription no longer fits the chapter composition');
 const ownerLeft=350,ownerWidth=1370;let colophonY=2090;const cut=c.colophon.indexOf(' and its trial '),ownerLines=cut<0?[c.colophon]:[c.colophon.slice(0,cut),c.colophon.slice(cut+1)];let ownerSize=66;
 while(ownerSize>=60){font(ownerSize);if(ownerLines.every(s=>p.measureText(s).width<=ownerWidth))break;ownerSize-=2;}
 if(ownerSize<60)throw Error('Colophon requires a separate layout');for(const line of ownerLines){p.fillText(line,ownerLeft,colophonY);colophonY+=104;}
 const sealBox=r.sealVariant==='round'?{x:360,y:2330,width:240,height:240}:{x:315,y:2375,width:330,height:152};impressSeal(front,relief,seal,sealBox);
 font(56);p.fillText(ids[1],880,2405);font(49);p.fillText(ids[2],880,2485);p.fillText(ids[0],880,2565);
 p.textAlign='center';font(42);if(c.note)p.fillText(c.note,w/2,2730);
 p.globalCompositeOperation='destination-out';p.globalAlpha=.075;for(let i=0;i<2300;i++)p.fillRect((i*719.27+seed%103)%w,(i*437.71+seed%71)%h,.6,.8);p.globalCompositeOperation='source-over';p.globalAlpha=1;
 f.globalCompositeOperation='source-atop';f.drawImage(ink,0,0);
 return {front,back,ink,relief,seal,layout:{width:w,height:h,nominalSizeMM:[300,420],titleFontSize:titleSize,titleLines:titleLines.length,bodyFontSize:106,colophonFontSize:ownerSize,colophonLines:ownerLines,lastInkBottom,lineCount,sealBox,sealVersion:SEAL_VERSION,sealVariant:r.sealVariant,ornamentBox:{x:255,y:915,width:300,height:900},ornamentDigest:template.ornamentDigest,printedFonts:['Aboensis'],issued:c.issued,presentation:c.presentation,recipient:c.recipient,identity:ids,artifactDigest:r.artifactDigest,artSeed:seed}};
}
