// A source-backed disagreement remains visible to the authoring Goal. A later
// review or an old file hash cannot silently turn it into a resolved issue.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {canonicalSourcePackage} from '../../protocol/current-affairs.mjs';

const hash=s=>createHash('sha256').update(s).digest('hex');
export const objectionContextDigest=context=>hash(canonicalSourcePackage(context));
export async function readPublicationObjections(root,date,{words}={}){
 if(!/^20\d{2}-\d{2}-\d{2}$/.test(date||''))throw Error('原文异议日期无效');
 root=await fs.realpath(root);
 const file=path.join(root,'work/runs',date,'teaching/publication-objections.json');
 let data;try{data=JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if(e.code==='ENOENT')return {file,open:[],resolved:[]};throw e;}
 if(data.schemaVersion!==1||data.studyDate!==date||!Array.isArray(data.objections))throw Error('原文异议记录无效');
 if(new Set(data.objections.map(x=>x.id)).size!==data.objections.length)throw Error('原文异议身份重复');
 const report={file,open:[],resolved:[]};
 for(const item of data.objections){
  if(!/^[A-Za-z0-9_-]{1,100}$/.test(item.id||'')||!/^W\d+$/.test(item.wordId||'')||!/^C\d+_\d+$/.test(item.contextId||'')||typeof item.issue!=='string'||!item.issue.trim()||item.issue.length>6000)throw Error('原文异议目标或说明无效');
  const e=item.evidence;
  if(!e||typeof e.recordPath!=='string'||!e.recordPath||!/^[a-f0-9]{64}$/.test(e.sourceDigest||'')||!Number.isSafeInteger(e.start)||!Number.isSafeInteger(e.end)||e.start<0||e.end<=e.start||typeof e.quote!=='string'||e.quote.length>12000)throw Error('原文异议须有具体原件与范围');
  const inside=async p=>{const actual=await fs.realpath(path.resolve(root,p));const relative=path.relative(root,actual);if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('原文异议原件须位于本工作区');return actual;};
  const record=JSON.parse(await fs.readFile(await inside(e.recordPath),'utf8'));
  if(record.textDigest!==e.sourceDigest||typeof record.textPath!=='string')throw Error('原文异议读件身份不符');
  const original=await fs.readFile(await inside(record.textPath),'utf8');
  if(hash(original)!==e.sourceDigest||original.slice(e.start,e.end)!==e.quote)throw Error('原文异议引文或完整原件摘要不符');
  const word=words?.find(w=>w.wordId===item.wordId)??JSON.parse(await fs.readFile(path.join(root,'work/runs',date,'teaching/authored',`word-${item.wordId}.json`),'utf8'));
  const context=word.contexts?.find(c=>c.id===item.contextId);
  if(!context)throw Error('原文异议目标语境缺失，不能删去目标规避');
  const contextDigest=objectionContextDigest(context),resolution=item.resolution;
  const resolved=resolution?.contextDigest===contextDigest&&resolution?.sourceDigest===e.sourceDigest&&typeof resolution.note==='string'&&resolution.note.trim().length>0;
  (resolved?report.resolved:report.open).push({...item,currentContextDigest:contextDigest});
 }
 return report;
}
export function publicationObjectionDiagnostic(report){
 return report.open.map(x=>`原文异议未解决 ${x.id} / ${x.wordId} / ${x.contextId}: ${x.issue}\n已核完整原件SHA256 ${x.evidence.sourceDigest}；实际引文 [${x.evidence.start},${x.evidence.end}):\n${x.evidence.quote}\n原件记录 ${x.evidence.recordPath}\n异议文件 ${report.file}\n须回原文解决分歧并记录本版contextDigest处置，不能凭旧已审文件摘要恢复。`).join('\n\n');
}
export async function assertPublicationObjectionsResolved(root,date,options){
 const report=await readPublicationObjections(root,date,options);
 if(report.open.length)throw Error(publicationObjectionDiagnostic(report));
 return report;
}
