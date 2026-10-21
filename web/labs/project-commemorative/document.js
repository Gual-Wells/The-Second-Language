import {charterCopy,identityLines,exportRecord} from './charter.js';
import {prepareSeal,makeSeal,impressSeal,SEAL_VERSION} from '../chapter-scroll-v12/seal.js';
export {prepareSeal,exportRecord};
export {loadImage} from '../chapter-scroll/document.js';
export const DOCUMENT_WIDTH=2048,DOCUMENT_HEIGHT=2868;

export function documentLines(r){
 const c=charterCopy(r);return [c.institution,c.title,...c.verse,...c.colophon,...c.sealLegends,...identityLines(r),
  `${c.labels.contentSHA256.en} ${r.contentDigest}`,...(r.publishedAt?[`${c.labels.published.en} ${r.publishedAt}`]:[]),c.note];
}
export function translationLines(r){
 const c=charterCopy(r),t=c.translation;return [t.institution,t.artTitle,...t.verse,...t.colophon,...t.sealLegends,
  `${c.labels.made.zh} ${r.madeAt}`,`${c.labels.contentMark.zh} ${r.contentDigest.slice(0,16).toUpperCase().match(/.{4}/g).join(' ')}`,`${c.labels.contentSHA256.zh} ${r.contentDigest}`,
  ...(r.publishedAt?[`${c.labels.published.zh} ${r.publishedAt}`]:[]),t.status];
}
export function populateTranscript(container,r){
 container.replaceChildren();
 for(const [language,lines]of [['en',documentLines(r)],['zh-CN',translationLines(r)]]){
  const section=document.createElement('section');section.lang=language;
  for(const [index,text]of lines.entries()){const el=document.createElement(index===1?'h3':'p');el.textContent=text;el.style.whiteSpace='pre-line';section.append(el);}
  container.append(section);
 }
}
// Display the accepted, once-typeset originals. This does not load a font,
// redraw the inscription, synthesize an impression or change content identity.
// PNG signatures and byte digests are verified by production/build tooling;
// the runtime checks identity, declared geometry and decoded pixel dimensions.
export async function loadFrozenDocument(record,owned,sourceURL){
 charterCopy(record);owned.assertAlive();
 const manifestURL=new URL('assets/surfaces.json',sourceURL),m=await owned.json(manifestURL),w=DOCUMENT_WIDTH,h=DOCUMENT_HEIGHT;
 if(m.schema!=='second-language.frozen-surfaces.v1'||m.category!==record.category||m.workId!==record.workId||m.contentSHA256!==record.contentDigest||m.artPlanSHA256!==record.artPlanDigest)throw Error('The frozen paper does not match this commemorative work');
 if(m.width!==w||m.height!==h||m.layout?.width!==w||m.layout?.height!==h||m.layout?.contentDigest!==record.contentDigest||m.layout?.artPlanDigest!==record.artPlanDigest||m.seal?.version!==SEAL_VERSION||m.seal?.variant!=='oblong')throw Error('Frozen paper geometry or impression metadata mismatch');
 const expected={front:[w,h],back:[w,h],ink:[w,h],relief:[w,h],sealInk:[784,360],sealMask:[784,360]},canvases={};
 const results=await Promise.allSettled(Object.entries(expected).map(async([key,[width,height]])=>{
  const file=m.layers?.[key],name=key.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase());
  if(!file||file.src!==`final-${name}.png`||file.width!==width||file.height!==height||!Number.isSafeInteger(file.bytes)||file.bytes<24||!/^[0-9a-f]{64}$/.test(file.sha256))throw Error(`Invalid frozen ${key} layer descriptor`);
  let image;
  try{
   image=await owned.image(new URL(file.src,manifestURL));owned.assertAlive();
   if(image.naturalWidth!==width||image.naturalHeight!==height)throw Error(`Frozen ${key} has unexpected decoded pixel dimensions`);
   const canvas=Object.assign(document.createElement('canvas'),{width,height});canvases[key]=canvas;
   const context=canvas.getContext('2d');if(!context)throw Error('A two-dimensional paper surface is unavailable');
   context.drawImage(image,0,0);owned.assertAlive();return canvas;
  }finally{if(image)owned.releaseImage(image);}
 }));
 const failed=results.find(result=>result.status==='rejected');
 if(failed||owned.disposed){for(const canvas of Object.values(canvases)){canvas.width=1;canvas.height=1;}if(failed)throw failed.reason;owned.assertAlive();}
 owned.assertAlive();
 return {front:canvases.front,back:canvases.back,ink:canvases.ink,relief:canvases.relief,
  seal:{ink:canvases.sealInk,mask:canvases.sealMask,seed:m.seal.seed,variant:m.seal.variant,version:m.seal.version,stats:m.seal.stats},
  layout:{...m.layout,frozen:true,frozenManifestURL:manifestURL.href}};
}
const overlaps=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
export function createDocument(r,skin,reverse,template,ornament){
 const c=charterCopy(r),L=r.artPlan.layout,w=DOCUMENT_WIDTH,h=DOCUMENT_HEIGHT;
 if(!document.fonts.check(`94px ${template.fontFamily}`))throw Error('The original Aboensis font must load before typesetting');
 if(!skin||!reverse||!ornament)throw Error('The project paper and returning-thread miniature must be present');
 const layer=()=>Object.assign(document.createElement('canvas'),{width:w,height:h}),front=layer(),back=layer(),ink=layer(),relief=layer(),f=front.getContext('2d'),p=ink.getContext('2d');
 f.drawImage(skin,0,0,w,h);back.getContext('2d').drawImage(reverse,0,0,w,h);
 const box=L.ornament,scale=Math.min(box.width/ornament.width,box.height/ornament.height),iw=ornament.width*scale,ih=ornament.height*scale;
 f.globalCompositeOperation='source-atop';f.globalAlpha=box.opacity;f.drawImage(ornament,box.x+(box.width-iw)/2,box.y+(box.height-ih)/2,iw,ih);f.globalAlpha=1;
 const ids=identityLines(r),contents={institution:[c.institution],artTitle:c.titleLines,verse:c.verse,colophon:c.colophon,identity:[ids[1],ids[2],ids[0]],status:[c.note]},bounds=[],safe=L.textSafeRect;
 const ornamentBox={left:box.x,right:box.x+box.width,top:box.y,bottom:box.y+box.height};
 const sealBox={left:L.seal.x,right:L.seal.x+L.seal.width,top:L.seal.y,bottom:L.seal.y+L.seal.height};
 for(const b of L.blocks){
  const lines=contents[b.id];if(!Array.isArray(lines)||b.align!=='left'||!Number.isFinite(b.fontSize)||b.fontSize<40)throw Error('Unsupported project inscription block');
  p.font=`${b.fontSize}px ${template.fontFamily}`;p.textAlign=b.align;p.textBaseline='alphabetic';p.fillStyle=b.color;
  for(const [i,text]of lines.entries()){
   const y=b.y+i*b.lineHeight,m=p.measureText(text),a={block:b.id,text,left:b.x-m.actualBoundingBoxLeft,right:b.x+m.actualBoundingBoxRight,top:y-m.actualBoundingBoxAscent,bottom:y+m.actualBoundingBoxDescent,fontSize:b.fontSize};
   if(![a.left,a.right,a.top,a.bottom].every(Number.isFinite)||a.right-a.left>b.width||a.left<safe.x||a.right>safe.x+safe.width||a.top<safe.y||a.bottom>safe.y+safe.height)throw Error(`The ${b.id} needs a revised composition in the actual font`);
   if(overlaps(a,ornamentBox)||overlaps(a,sealBox))throw Error(`The ${b.id} intrudes into the miniature or impression`);
   p.fillText(text,b.x,y);bounds.push(a);
  }
 }
 for(let i=0;i<bounds.length;i++)for(let j=i+1;j<bounds.length;j++)if(overlaps(bounds[i],bounds[j]))throw Error(`Project text blocks overlap: ${bounds[i].block}/${bounds[j].block}`);
 // Retain the reviewed quill's restrained dry contact; paper ageing belongs to
 // its own authored albedo, not a new uniform stain or embossing over the text.
 const seed=parseInt(r.contentDigest.slice(0,8),16);p.globalCompositeOperation='destination-out';p.globalAlpha=.075;
 for(let i=0;i<2300;i++)p.fillRect((i*719.27+seed%103)%w,(i*437.71+seed%71)%h,.6,.8);
 p.globalAlpha=1;p.globalCompositeOperation='source-over';
 const seal=makeSeal(seed,'oblong');impressSeal(front,relief,seal,L.seal);f.globalCompositeOperation='source-atop';f.drawImage(ink,0,0);
 return {front,back,ink,relief,seal,layout:{width:w,height:h,nominalSizeMM:L.nominalSizeMM,artPlanId:r.artPlan.id,artPlanDigest:r.artPlanDigest,
  composition:'left-aligned-five-line-inscription-and-lower-vertical-miniature',paperVariant:r.artPlan.resources.paper.variant,
  sealVersion:SEAL_VERSION,sealVariant:'oblong',sealBox:L.seal,ornamentBox:box,ornamentDigest:r.artPlan.resources.ornament.sha256,
  printedFonts:[template.fontFamily],textBounds:bounds,status:r.status,issued:false,recipient:c.recipient,identity:ids,
  artifactDigest:r.artifactDigest,contentDigest:r.contentDigest,artSeed:seed}};
}
