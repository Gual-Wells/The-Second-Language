import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {CURRENT_AFFAIRS_POLICY,canonicalSourcePackage,validateSourcePackage} from '../../protocol/current-affairs.mjs';
import {familyRecords} from './vix-index.mjs';
import {validateReadRecord} from './current-affairs-reader.mjs';

const hash = text => createHash('sha256').update(text).digest('hex');
const readJson = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const sha = value => /^[a-f0-9]{64}$/.test(value || '');
async function immutable(file, text) {
  await fs.mkdir(path.dirname(file),{recursive:true});
  try { await fs.writeFile(file,text,{flag:'wx'}); }
  catch(e) { if(e.code!=='EEXIST')throw e; if(await fs.readFile(file,'utf8')!==text)throw Error('已封存来源包原件冲突'); }
}

export async function buildChapterSources(root, date, input) {
  if(!/^20\d{2}-\d{2}-\d{2}$/.test(date||'') || new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date)throw Error('章节日期无效');
  root=await fs.realpath(root);
  if(process.platform==='win32'&&!/^D:\\/i.test(root))throw Error('实事工作资料须实际存于D盘');
  const folder=path.join(root,'chapters',date),run=path.join(root,'work/runs',date);
  const [meta,selection,lock,control,markdown,registry]=await Promise.all([
    readJson(path.join(folder,'meta.json')),readJson(path.join(run,'selection.json')),readJson(path.join(run,'vix-source.json')),
    readJson(path.join(run,'control.json')),fs.readFile(path.join(folder,'chapter.md'),'utf8'),readJson(path.join(root,'resources/current-affairs/sources.json'))
  ]);
  if(meta.sourcePolicy!==CURRENT_AFFAIRS_POLICY)throw Error('此章不属于新流程；旧章封存，不回填来源');
  if(control.rest)throw Error('休息日不能建设来源或发布新章');
  if(meta.date!==date||selection.studyDate!==date||selection.vixInputCommit!==lock.commit||!/^[a-f0-9]{40}$/.test(lock.commit||''))throw Error('来源包必须对应原选词及固定VIX输入');
  familyRecords(selection); // The frozen 50 main words and included families remain unchanged.
  const sourcesById=new Map(registry.sources.map(s=>[s.id,s]));
  if(!input||!Array.isArray(input.sources)||!input.sources.length)throw Error('先阅读实际原文，再撰写来源事实摘要');
  const sources=[];
  for(const source of input.sources){
    const registered=sourcesById.get(source.sourceId);
    if(!registered||typeof source.readRecord!=='string')throw Error('来源必须已登记并指向实际原文读取记录');
    const record=await validateReadRecord(path.resolve(root,source.readRecord),{root,sourceId:source.sourceId,url:source.url});
    const value={sourceId:source.sourceId,url:source.url,title:source.title||record.title,publisher:registered.name,readAt:record.readAt,readDigest:record.textDigest,acquisitionMethod:record.acquisitionMethod||'native-get',facts:source.facts};
    if(record.readScope)value.readScope=record.readScope;
    for(const field of ['publishedAt','updatedAt','limitations'])if(source[field]!=null)value[field]=source[field];
    sources.push(value);
  }
  const chapterDigest=hash(markdown),selectionDigest=hash(canonicalSourcePackage(selection));
  const sourcePackage=validateSourcePackage({schemaVersion:1,studyDate:date,chapterDigest,selectionDigest,vixInputCommit:lock.commit,context:input.context,sources,...(input.articles?{articles:input.articles}:{})},{chapterDigest,studyDate:date,vixInputCommit:lock.commit,markdown});
  const canonical=canonicalSourcePackage(sourcePackage),sourceDigest=hash(canonical);
  await immutable(path.join(run,'sources',sourceDigest+'.json'),canonical);
  // Keep recovery receipts but do not copy third-party full text into a public chapter/Git payload.
  const receipts=[];
  for(const source of input.sources){const record=await validateReadRecord(path.resolve(root,source.readRecord),{root,sourceId:source.sourceId,url:source.url});receipts.push({sourceId:source.sourceId,url:source.url,readAt:record.readAt,readDigest:record.textDigest,acquisitionMethod:record.acquisitionMethod||'native-get',readScope:record.readScope||'HTML article/main extraction; author checks actual relevant text',evidenceRef:record.evidenceRef||null,recordedAt:record.recordedAt||record.readAt});}
  await immutable(path.join(run,'sources',sourceDigest+'.receipts.json'),canonicalSourcePackage(receipts));
  await fs.writeFile(path.join(folder,'sources.json'),canonical);
  await fs.writeFile(path.join(folder,'meta.json'),JSON.stringify({...meta,sourcePolicy:CURRENT_AFFAIRS_POLICY,sourceDigest,vixInputCommit:lock.commit},null,2)+'\n');
  return{sourcePolicy:CURRENT_AFFAIRS_POLICY,sourceDigest,sourcePackage,chapterDigest};
}

export async function loadChapterSources(root,date,markdown,meta,words){
  if(meta.sourcePolicy!==CURRENT_AFFAIRS_POLICY)throw Error('正式新章必须携带实事来源；旧章封存不兼容重发');
  if(meta.contentPolicy!=='etymology-fused-v1')throw Error('实事来源不能替换既有词源与双教材教学策略');
  const sourcePackage=await readJson(path.join(root,'chapters',date,'sources.json'));
  const chapterDigest=hash(markdown);
  validateSourcePackage(sourcePackage,{chapterDigest,studyDate:date,vixInputCommit:meta.vixInputCommit,markdown});
  if(meta.vixInputCommit!==sourcePackage.vixInputCommit)throw Error('选词输入commit不一致');
  const sourceDigest=hash(canonicalSourcePackage(sourcePackage));
  if(!sha(meta.sourceDigest)||meta.sourceDigest!==sourceDigest)throw Error('新章来源摘要不符；重新核对实际来源与成稿');
  const selection=await readJson(path.join(root,'work/runs',date,'selection.json'));
  familyRecords(selection);
  if(words && JSON.stringify(words)!==JSON.stringify(selection.mainWords.map(item=>item.text).sort((a,b)=>a.localeCompare(b,'en'))))throw Error('正文50主词与已冻结selection不一致');
  if(hash(canonicalSourcePackage(selection))!==sourcePackage.selectionDigest)throw Error('选词已改变，不能沿用旧来源绑定');
  return {sourcePolicy:CURRENT_AFFAIRS_POLICY,sourceDigest,vixInputCommit:sourcePackage.vixInputCommit,sourcePackage};
}
