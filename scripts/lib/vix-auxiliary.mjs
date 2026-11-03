import {createHash,randomUUID} from 'node:crypto';
import {mkdir,readFile,readdir,realpath,rename,rm,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {canonicalSourcePackage as canonical} from '../../protocol/current-affairs.mjs';
import {vixDateLabel} from './vix-date.mjs';

export const VIX_ACCESS_POLICY='auxiliary-index-only-v1';
export const auxiliaryPath=value=>typeof value==='string'&&/^data\/seed-access\/(?:manifest\.json|structure\.json|mark-hash\.json|README\.md|records-\d{3,}\.json|dates\/\d{2}-\d{2}-\d{2}\.json)$/.test(value);
export const gitBlobSha=bytes=>createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
const digest=value=>createHash('sha256').update(canonical(value)).digest('hex');
const bytes=value=>Buffer.from(JSON.stringify(value)+'\n');
const same=(a,b)=>canonical(a)===canonical(b);
async function read(root,file){if(!auxiliaryPath(file))throw Error('VIX 只允许通用英语词辅助索引路径：'+file);const base=await realpath(path.join(root,'data/seed-access')),target=await realpath(path.join(root,...file.split('/'))),relative=path.relative(base,target);if(!relative||relative.startsWith('..')||path.isAbsolute(relative))throw Error('VIX 辅助索引文件越出允许目录');return readFile(target);}
async function json(root,file){return JSON.parse(await read(root,file));}
function dateLabel(label){if(!/^\d{2}-\d{2}-\d{2}$/.test(label||'')||vixDateLabel('20'+label)!==label)throw Error('VIX 日期标签无效');return label;}
async function install(root,file,value){const target=path.join(root,...file.split('/')),temp=target+'.'+randomUUID()+'.tmp';await mkdir(path.dirname(target),{recursive:true});const base=await realpath(path.join(root,'data/seed-access')),parent=await realpath(path.dirname(target)),relative=path.relative(base,parent);if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('VIX 标注写入目录越界');try{await writeFile(temp,value,{flag:'wx'});await rename(temp,target);}finally{await rm(temp,{force:true});}}

// This is a marks-only client for the permitted auxiliary index. It neither
// follows manifest.source into Seed nor reconstructs any VIX runtime data.
export async function readAuxiliaryIndex(root,{verifyMarks=true}={}){
  const manifest=await json(root,'data/seed-access/manifest.json');
  if(manifest.protocol!=='vix-seed-access/2'||manifest.ordinalBase!==1||manifest.scope?.domainId!=='domain_general_english'||manifest.scope.section!=='word'||manifest.binding?.marks?.labelFormat!=='YY-MM-DD'||manifest.binding.marks.yearBase!==2000||manifest.binding.marks.externalDateMeaning!==true)throw Error('VIX 辅助索引范围或日期合同无效');
  const fields=manifest.recordTuple;
  if(!Array.isArray(fields)||new Set(fields).size!==fields.length||['globalRank','entryId','text','collectionId','markDates'].some(f=>!fields.includes(f)))throw Error('VIX 词记录 tuple 无效');
  const pos=Object.fromEntries(fields.map((f,i)=>[f,i]));
  if(!Array.isArray(manifest.records)||!manifest.records.length||new Set(manifest.records.map(r=>r.path)).size!==manifest.records.length||manifest.records.some(r=>!/^data\/seed-access\/records-\d{3,}\.json$/.test(r.path)))throw Error('VIX 词记录路径无效');
  if(manifest.structure?.path!=='data/seed-access/structure.json'||manifest.markHash?.path!=='data/seed-access/mark-hash.json')throw Error('VIX 辅助索引派生文件路径无效');
  const structureBytes=await read(root,manifest.structure.path),structure=JSON.parse(structureBytes);
  if(gitBlobSha(structureBytes)!==manifest.structure.gitBlobSha||structure.scope?.domainId!==manifest.scope.domainId||structure.scope.section!=='word'||!Array.isArray(structure.collections)||structure.collections.length!==manifest.counts.collections)throw Error('VIX 导航结构摘要或范围无效');
  const shards=[],records=[],ids=new Set(),ranks=new Set();
  for(const descriptor of manifest.records){
    const body=await read(root,descriptor.path),rows=JSON.parse(body);
    if(!Array.isArray(rows)||rows.length!==descriptor.count||verifyMarks&&gitBlobSha(body)!==descriptor.gitBlobSha)throw Error('VIX 词记录摘要或数量无效：'+descriptor.path);
    for(const row of rows){
      const rank=row[pos.globalRank],id=row[pos.entryId];
      if(!Array.isArray(row)||row.length!==fields.length||!Number.isSafeInteger(rank)||rank!==records.length+1||typeof id!=='string'||!id||ids.has(id)||ranks.has(rank)||typeof row[pos.text]!=='string'||!row[pos.text]||typeof row[pos.collectionId]!=='string'||!Array.isArray(row[pos.markDates]))throw Error('VIX 词记录身份、顺序或 tuple 无效');
      ranks.add(rank);ids.add(id);records.push(Object.fromEntries(fields.map((f,i)=>[f,row[i]])));
    }
    if(rows[0]?.[pos.globalRank]!==descriptor.globalStartRank||rows.at(-1)?.[pos.globalRank]!==descriptor.globalEndRank)throw Error('VIX 分片 rank 范围无效');
    shards.push({descriptor,body,rows});
  }
  if(records.length!==manifest.scope.records||records.length!==manifest.counts.records)throw Error('VIX 辅助索引记录数不符');
  const navigation=new Map();
  for(const collection of structure.collections){
    const owned=records.filter(r=>r.collectionId===collection.id),expected=owned.map(r=>r.globalRank);
    if(navigation.has(collection.id)||collection.count!==owned.length||!same(collection.priorityGlobalRanks,expected)||!Array.isArray(collection.displayGlobalRanks)||!same([...collection.displayGlobalRanks].sort((a,b)=>a-b),expected))throw Error('VIX 导航归属与词记录不符');
    navigation.set(collection.id,collection);
  }
  if(records.some(r=>!navigation.has(r.collectionId)))throw Error('VIX 词记录缺少索引内导航归属');
  const dates=[],marks=new Map(records.map(r=>[r.globalRank,[]]));
  let names;try{const base=await realpath(path.join(root,'data/seed-access')),directory=await realpath(path.join(root,'data/seed-access/dates')),relative=path.relative(base,directory);if(relative.startsWith('..')||path.isAbsolute(relative))throw Error('VIX 日期目录越出辅助索引');names=await readdir(directory);}catch(error){if(error.code!=='ENOENT')throw error;names=[];}
  for(const name of names.sort()){
    if(!/^\d{2}-\d{2}-\d{2}\.json$/.test(name))throw Error('VIX 日期目录含非日期原件');
    const label=dateLabel(name.slice(0,-5)),file='data/seed-access/dates/'+name,body=await read(root,file),value=JSON.parse(body);
    if(value.protocol!=='vix-seed-access-date/1'||value.schemaVersion!==1||value.date!==label||!Array.isArray(value.globalRanks)||value.globalRanks.some((rank,i)=>!ranks.has(rank)||i>0&&rank<=value.globalRanks[i-1]))throw Error('VIX 日期原件无效：'+name);
    for(const rank of value.globalRanks)marks.get(rank).push(label);
    dates.push({date:label,path:file,gitBlobSha:gitBlobSha(body),count:value.globalRanks.length});
  }
  const marked=[...marks.values()].filter(a=>a.length).length,counts={...manifest.counts,marked,unmarked:records.length-marked,dateFiles:dates.length};
  const markHash={protocol:'vix-seed-access-mark-hash/1',schemaVersion:1,ordinalBase:1,scope:{domainId:'domain_general_english',section:'word'},counts:{records:records.length,marked,unmarked:records.length-marked,dateFiles:dates.length},byGlobalRank:Object.fromEntries(records.map(r=>[r.globalRank,[r.entryId,marks.get(r.globalRank)]]))};
  if(verifyMarks){
    const hashBytes=await read(root,manifest.markHash.path);
    if(!same(manifest.dates,dates)||!same(manifest.counts,counts)||gitBlobSha(hashBytes)!==manifest.markHash.gitBlobSha||!same(JSON.parse(hashBytes),markHash)||records.some(r=>!same(r.markDates,marks.get(r.globalRank))))throw Error('VIX 日期与派生标注不一致；只可从日期原件恢复，不刷新选词或 Seed');
  }
  const stableManifest={...manifest,counts:{...manifest.counts,marked:null,unmarked:null,dateFiles:null},dates:[],markHash:{...manifest.markHash,gitBlobSha:null},records:manifest.records.map(r=>({...r,gitBlobSha:null}))};
  const identityDigest=digest({manifest:stableManifest,structure,rows:shards.flatMap(s=>s.rows.map(r=>r.filter((_,i)=>i!==pos.markDates)))});
  return {manifest,structure,shards,records,marks,dates,counts,markHash,pos,identityDigest};
}

export async function markAuxiliaryIndex(root,{label,globalRanks,identityDigest}){
  dateLabel(label);
  const initial=await readAuxiliaryIndex(root,{verifyMarks:false});
  if(!identityDigest||initial.identityDigest!==identityDigest)throw Error('VIX 标注副本的词身份或导航已偏离不可变输入');
  if(!Array.isArray(globalRanks)||globalRanks.some(r=>!initial.marks.has(r)))throw Error('VIX 标注 rank 越界');
  const file='data/seed-access/dates/'+label+'.json';let date;
  try{date=await json(root,file);}catch(error){if(error.code!=='ENOENT')throw error;date={protocol:'vix-seed-access-date/1',schemaVersion:1,date:label,globalRanks:[]};}
  const next=bytes({...date,globalRanks:[...new Set([...date.globalRanks,...globalRanks])].sort((a,b)=>a-b)});
  let prior;try{prior=await read(root,file);}catch(error){if(error.code!=='ENOENT')throw error;}
  if(!prior?.equals(next))await install(root,file,next);
  const state=await readAuxiliaryIndex(root,{verifyMarks:false}),manifest=structuredClone(state.manifest);
  for(const shard of state.shards){
    for(const row of shard.rows)row[state.pos.markDates]=state.marks.get(row[state.pos.globalRank]);
    const body=bytes(shard.rows);if(!body.equals(shard.body))await install(root,shard.descriptor.path,body);
    manifest.records.find(r=>r.path===shard.descriptor.path).gitBlobSha=gitBlobSha(body);
  }
  const hashBytes=bytes(state.markHash);let oldHash;try{oldHash=await read(root,manifest.markHash.path);}catch(error){if(error.code!=='ENOENT')throw error;}
  if(!oldHash?.equals(hashBytes))await install(root,manifest.markHash.path,hashBytes);
  manifest.markHash.gitBlobSha=gitBlobSha(hashBytes);manifest.counts=state.counts;manifest.dates=state.dates;
  if(!same(manifest,state.manifest))await install(root,'data/seed-access/manifest.json',bytes(manifest));
  const verified=await readAuxiliaryIndex(root);
  if(verified.identityDigest!==identityDigest)throw Error('VIX 标注后不可变词身份变化');
  return verified;
}
