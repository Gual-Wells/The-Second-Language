// Exact, explicitly partial model transport. Complete originals stay in the
// signed report/evidence; a source hash is never a claim of whole-book reading.
import {createHash} from 'node:crypto';
const hash=s=>createHash('sha256').update(s).digest('hex');
export const APPEAL_SOURCE_VIEW='exact-original-windows-v1';
const fullTextLimit=120000,padding=5000,maxCaseWindowChars=60000;
const owns=(r,id)=>r.refs?.some(e=>e.sourceId===id)||r.recordIds?.includes(id);
function selectView(view,requests){
 if(view.policy!==APPEAL_SOURCE_VIEW||!Array.isArray(view.cases))throw Error('审核原文窗口版本无效');
 const ids=new Set(requests.filter(r=>owns(r,view.sourceId)).map(r=>r.contextId));
 return {...view,cases:view.cases.filter(c=>ids.has(c.contextId)).sort((a,b)=>a.contextId.localeCompare(b.contextId))};
}
function makeView(sourceId,text,digest,requests,aliases=[]){
 if(hash(text)!==digest)throw Error('审核窗口的完整原文摘要不符');
 const cases=requests.filter(r=>owns(r,sourceId)).map(r=>{
  const quotes=[...new Set(r.refs.filter(e=>e.sourceId===sourceId||aliases.includes(e.sourceId)).map(e=>e.quote))],ranges=[];
  if(!quotes.length)throw Error('长原文须有实际相关原段引文以确定审核窗口：'+r.contextId);
  for(const quote of quotes){
   if(typeof quote!=='string'||!quote.trim())throw Error('长原文窗口缺少精确引文');
   let from=0,found=false,covered=0;const quoteRanges=[];
   for(;;){const pos=text.indexOf(quote,from);if(pos<0)break;found=true;const range={start:Math.max(0,pos-padding),end:Math.min(text.length,pos+quote.length+padding)},last=quoteRanges.at(-1);if(last&&range.start<=last.end){covered+=Math.max(0,range.end-last.end);last.end=Math.max(last.end,range.end);}else{quoteRanges.push(range);covered+=range.end-range.start;}if(covered>maxCaseWindowChars)throw Error('引文匹配范围过大；请定位更明确的实际相关原段：'+r.contextId);from=pos+1;}
   if(!found)throw Error('长原文引文不在实际原文内；请引用相关原段：'+r.contextId);
   ranges.push(...quoteRanges);
  }
  ranges.sort((a,b)=>a.start-b.start);const merged=[];
  for(const range of ranges){const last=merged.at(-1);if(last&&range.start<=last.end)last.end=Math.max(last.end,range.end);else merged.push({...range});}
  if(merged.reduce((n,r)=>n+r.end-r.start,0)>maxCaseWindowChars)throw Error('引文匹配范围过大；请定位更明确的实际相关原段：'+r.contextId);
  return {contextId:r.contextId,windows:merged.map(r=>({...r,text:text.slice(r.start,r.end)}))};
 }).sort((a,b)=>a.contextId.localeCompare(b.contextId));
 return {policy:APPEAL_SOURCE_VIEW,sourceId,anchorSourceIds:[sourceId,...aliases],originalDigest:digest,originalLength:text.length,offsetUnit:'UTF-16',partial:true,completeOriginalRetained:true,cases};
}
export function appealResearchView(record,requests){
 if(record.view)return {...record,view:selectView(record.view,requests)};
 if(!['source-reading','rights-evidence'].includes(record.kind)||record.text.length<=fullTextLimit)return record;
 if(hash(record.text)!==record.digest||record.id!=='research:'+record.digest)throw Error('审核研究原件摘要不符');
 const raw=JSON.parse(record.text);if(raw.record?.kind!=='read-original-text'||typeof raw.originalText!=='string')throw Error('长原文缺真实读取凭据');
 return {id:record.id,digest:record.digest,kind:record.kind,record:raw.record,view:makeView(record.id,raw.originalText,raw.record.textDigest,requests,['read:'+raw.record.textDigest])};
}
export function appealOriginalView(original,requests){
 if(original.view)return {...original,view:selectView(original.view,requests)};
 if(original.text.length<=fullTextLimit)return original;
 if(!/^read:[a-f0-9]{64}$/.test(original.sourceId))throw Error('长原文身份无效');
 return {sourceId:original.sourceId,view:makeView(original.sourceId,original.text,original.sourceId.slice(5),requests)};
}
export const hasAppealSourceViews=packet=>[...(packet.records||[]),...(packet.originals||[])].some(s=>s.view?.policy===APPEAL_SOURCE_VIEW);
