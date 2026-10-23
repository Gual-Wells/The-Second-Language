import {getTemplate} from '../project-beginning/templates.js';
import {ScrollObject} from '../project-beginning/scroll-object.js';

const hex=/^[0-9a-f]{64}$/;
const instant=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)&&new Date(value).toISOString()===value;
const text=(value,max=2400)=>typeof value==='string'&&value.length>0&&value.length<=max;
const lines=value=>Array.isArray(value)&&value.length<=60&&value.every(line=>text(line));
const copyValid=copy=>copy&&['rubric','institution','artTitle','status'].every(key=>text(copy[key]))&&lines(copy.verse)&&copy.verse.length>0&&lines(copy.colophon)&&lines(copy.sealLegends);
const size=value=>Number.isSafeInteger(value)&&value>=64&&value<=4096;
const digest=async bytes=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');

// A finished work supplies immutable data and six verified paper layers. All
// executable rendering, material and sound code remains in the shipped base.
export function createIssuedScrollProfile(input,{scrollId,origin=location.origin}={}){
 const m=structuredClone(input),r=m?.record,s=m?.surface,p=m?.profile;
 if(m?.schema!=='second-language.chapter-scroll-viewer.v1'||!r||r.category!=='chapter-certified'||r.status!=='issued'||!text(scrollId,100)||!text(r.workId,120)||!text(r.certificationId,120)||!text(r.chapterId,120)||!(typeof r.chapterNumber==='number'&&Number.isSafeInteger(r.chapterNumber)&&r.chapterNumber>0||text(r.chapterNumber,120))||r.ownerId!=='second-language-owner'||!hex.test(r.chapterDigest)||!hex.test(r.sha256)||!hex.test(r.artPlanDigest)||!text(r.recipient,120)||!instant(r.passedAt)||!instant(r.madeAt)||!instant(r.publishedAt)||!copyValid(r.copy)||!copyValid(r.copy.translation))throw Error('正式章卷的身份或文书不完整');
 if(s?.schema!=='second-language.chapter-scroll-surfaces.v1'||!size(s.width)||!size(s.height)||!s.layout||!s.seal||s.seal.variant!=='oblong'||!text(s.seal.version,100)||p?.base!=='scroll-v42')throw Error('正式章卷的纸面或工艺版本不兼容');
 if(s.layout.contentDigest&&s.layout.contentDigest!==r.sha256||s.layout.artPlanDigest&&s.layout.artPlanDigest!==r.artPlanDigest)throw Error('正式章卷的纸面与文书摘要不一致');
 const base=getTemplate('project-commemorative-beginning-v1'),nominal=p.nominalSizeMM??[300,420];
 if(!Array.isArray(nominal)||nominal.length!==2||!nominal.every(v=>Number.isFinite(v)&&v>=180&&v<=600)||Math.abs(nominal[0]/nominal[1]-s.width/s.height)>.003)throw Error('正式章卷的纸幅比例不一致');
 let folds=base.paperFolds;
 if(p.paperFolds){
  folds={};for(const [group,keys]of Object.entries({diagonal:['offset','slope','width','depth'],lower:['offset','sine','slope','width','depth']})){
   const source=p.paperFolds[group];if(!source)throw Error('纸膜折痕参数不完整');folds[group]={};
   for(const key of keys){const value=source[key],valid=Number.isFinite(value)&&(key==='width'?value>=.002&&value<=.1:key==='depth'?value>=0&&value<=.04:Math.abs(value)<=1);if(!valid)throw Error('纸膜折痕参数超出已验证范围');folds[group][key]=value;}
  }
 }
 const layers={},expected=['front','back','ink','relief','sealInk','sealMask'];
 for(const key of expected){const f=s.layers?.[key];if(!f||!hex.test(f.sha256)||!Number.isSafeInteger(f.bytes)||f.bytes<24||f.bytes>32*1024*1024||!size(f.width)||!size(f.height)||(['front','back','ink','relief'].includes(key)&&(f.width!==s.width||f.height!==s.height)))throw Error('正式章卷的冻结图层清单不完整');layers[key]={...f,url:new URL(`/api/scrolls/${encodeURIComponent(scrollId)}/assets/${f.sha256}`,origin).href};}
 const template={...base,id:'chapter-issued-v1',width:nominal[0]*.015,height:nominal[1]*.015,nominalSizeMM:nominal,paperFolds:folds};
 const exportRecord=()=>({...r,issued:true,contentDigest:r.sha256,sourceRecordUrl:new URL(`/api/scrolls/${encodeURIComponent(scrollId)}`,origin).href});
 const document={exportRecord,documentLines:()=>[r.copy.rubric,r.copy.institution,r.copy.artTitle,...r.copy.verse,...r.copy.colophon,...r.copy.sealLegends,r.copy.status],populateTranscript(container){container.replaceChildren();for(const c of [r.copy,r.copy.translation])for(const line of [c.rubric,c.institution,c.artTitle,...c.verse,...c.colophon,...c.sealLegends,c.status]){const el=window.document.createElement('p');el.textContent=line;container.append(el);}},async loadFrozenDocument(record,owned){
  const canvases={};const loaded=await Promise.allSettled(expected.map(async key=>{const f=layers[key],bytes=await owned.bytes(f.url);if(bytes.byteLength!==f.bytes||await digest(bytes)!==f.sha256)throw Error('章卷图层校验失败，请重新载入');owned.assertAlive();const image=await owned.imageBytes(bytes);try{if(image.naturalWidth!==f.width||image.naturalHeight!==f.height)throw Error('章卷图层尺寸不一致');const canvas=Object.assign(window.document.createElement('canvas'),{width:f.width,height:f.height});canvases[key]=canvas;canvas.getContext('2d').drawImage(image,0,0);owned.assertAlive();}finally{owned.releaseImage(image);}}));
  const failed=loaded.find(result=>result.status==='rejected');if(failed||owned.disposed){for(const canvas of Object.values(canvases)){canvas.width=1;canvas.height=1;}if(failed)throw failed.reason;owned.assertAlive();}
  return {front:canvases.front,back:canvases.back,ink:canvases.ink,relief:canvases.relief,seal:{...s.seal,ink:canvases.sealInk,mask:canvases.sealMask},layout:{...s.layout,width:s.width,height:s.height,contentDigest:r.sha256,artPlanDigest:r.artPlanDigest,fixedSurfaces:true,frozen:true,issued:true}};
 }};
 return Object.freeze({id:scrollId,category:'chapter-certified',label:`${String(r.chapterNumber).replace(/课/g,'章')}纪念卷轴`,source:new URL('../project-beginning/',import.meta.url),getTemplate:()=>template,document,prepareCharter:async()=>({...r,contentDigest:r.sha256,artifactDigest:r.sha256}),record:r,hasArtPlan:false,ObjectClass:ScrollObject,frozenDocument:true,issued:true});
}
