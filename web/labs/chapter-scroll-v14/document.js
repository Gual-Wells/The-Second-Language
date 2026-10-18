import {charterCopy,identityLines} from './charter.js';
import {prepareSeal,makeSeal,impressSeal,SEAL_VERSION} from '../chapter-scroll-v12/seal.js';
export {prepareSeal};
export {loadImage} from '../chapter-scroll/document.js';
export function documentLines(r){const c=charterCopy(r);return[c.chapter,c.title,c.chapterTitle,...c.paragraphs,c.colophon.join(' '),...c.sealLegends,...identityLines(r),c.note].filter(Boolean);}
export function populateTranscript(container,r){container.replaceChildren();for(const [i,text]of documentLines(r).entries()){const el=document.createElement(i===1?'h3':'p');el.textContent=text;el.style.whiteSpace='pre-line';container.append(el);}}
export function createDocument(r,skin,reverse,template,ornament){
 const c=charterCopy(r),plan=r.artPlan,L=plan.layout,w=L.width,h=L.height,seed=parseInt(r.artifactDigest.slice(0,8),16);
 if(w!==2048||h!==2868)throw Error('This paper size needs a verified scroll geometry');
 const layer=()=>Object.assign(document.createElement('canvas'),{width:w,height:h}),front=layer(),back=layer(),ink=layer(),relief=layer(),f=front.getContext('2d'),p=ink.getContext('2d');
 for(const [surface,image]of [[front,skin],[back,reverse]]){const q=surface.getContext('2d');q.save();if(plan.resources.paper.variant==='mirror-x'){q.translate(w,0);q.scale(-1,1);}q.drawImage(image,0,0,w,h);q.restore();}
 if(!ornament)throw Error('Chapter miniature missing');
 const box=L.ornament,scale=Math.min(box.width/ornament.width,box.height/ornament.height),iw=ornament.width*scale,ih=ornament.height*scale;
 f.globalCompositeOperation='source-atop';f.globalAlpha=box.opacity;f.drawImage(ornament,box.x+(box.width-iw)/2,box.y+(box.height-ih)/2,iw,ih);f.globalAlpha=1;
 const ids=identityLines(r),contents={chapter:[c.chapter],artTitle:c.titleLines,chapterTitle:[c.chapterTitle],stanza1:c.stanzas[0],stanza2:c.stanzas[1],colophon:c.colophon,identity:[ids[1],ids[2],ids[0]],status:[c.note]};
 const bounds=[],safe=L.textSafeRect;
 for(const b of L.blocks){
  const lines=contents[b.id];if(!Array.isArray(lines)||!['left','center'].includes(b.align)||!Number.isFinite(b.fontSize)||b.fontSize<40)throw Error('Unsupported artwork text block');
  p.font=`${b.fontSize}px ${template.fontFamily}`;p.textAlign=b.align;p.textBaseline='alphabetic';p.fillStyle=b.color;
  for(const [i,text]of lines.entries()){
   if(!text)continue;const y=b.y+i*b.lineHeight,m=p.measureText(text),left=b.x-m.actualBoundingBoxLeft,right=b.x+m.actualBoundingBoxRight,top=y-m.actualBoundingBoxAscent,bottom=y+m.actualBoundingBoxDescent;
   if(right-left>b.width||left<safe.x||right>safe.x+safe.width||top<safe.y||bottom>safe.y+safe.height)throw Error(`The ${b.id} requires another composition`);
   if((b.id==='stanza1'||b.id==='stanza2')&&top<L.reservedOrnamentBottom)throw Error('Verse overlaps miniature');
   p.fillText(text,b.x,y);bounds.push({block:b.id,text,left,right,top,bottom});
  }
 }
 for(let i=0;i<bounds.length;i++)for(let j=i+1;j<bounds.length;j++){const a=bounds[i],b=bounds[j];if(a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top)throw Error(`Text blocks overlap: ${a.block}/${b.block}`);}
 p.globalCompositeOperation='destination-out';p.globalAlpha=.075;for(let i=0;i<2300;i++)p.fillRect((i*719.27+seed%103)%w,(i*437.71+seed%71)%h,.6,.8);p.globalAlpha=1;p.globalCompositeOperation='source-over';
 const seal=makeSeal(seed,'oblong');impressSeal(front,relief,seal,L.seal);f.globalCompositeOperation='source-atop';f.drawImage(ink,0,0);
 return {front,back,ink,relief,seal,layout:{width:w,height:h,nominalSizeMM:L.nominalSizeMM,artPlanId:plan.id,artPlanDigest:r.artPlanDigest,composition:'horizontal-miniature-and-centered-verse',paperVariant:plan.resources.paper.variant,sealVersion:SEAL_VERSION,sealVariant:'oblong',sealBox:L.seal,ornamentBox:box,ornamentDigest:template.ornamentDigest,printedFonts:[template.fontFamily],textBounds:bounds,issued:c.issued,recipient:c.recipient,identity:ids,artifactDigest:r.artifactDigest,artSeed:seed}};
}
