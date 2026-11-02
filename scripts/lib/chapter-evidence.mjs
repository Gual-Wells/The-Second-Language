import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {canonicalSourcePackage} from '../../protocol/current-affairs.mjs';
import {CHAPTER_EVIDENCE_POLICY, MAX_EVIDENCE_OBJECT_BYTES, validateEvidenceManifest, validateEvidenceGroup} from '../../protocol/chapter-evidence.mjs';
import {readTeachingMaterials} from './teaching-authoring.mjs';
import {validateReadRecord} from './current-affairs-reader.mjs';
import {loadAuthoringContract} from './chapter-authoring-revision.mjs';
import {verifyEvidenceRecords} from '../../protocol/chapter-evidence-records.mjs';

const hash = value => createHash('sha256').update(value).digest('hex');
const json = file => fs.readFile(file, 'utf8').then(JSON.parse);
const key = source => JSON.stringify([source.sourceId, source.url]);
const norm = value => value.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' ');
const TARGET_BYTES = 8 * 1024 * 1024;
function object(value) { const text = JSON.stringify(value); return {digest:hash(text), text, bytes:Buffer.byteLength(text)}; }
function expectedFor(chapter) {
  const source = chapter.sourcePackage;
  if (!source || !/^[a-f0-9]{64}$/.test(source.evidenceDigest || '')) throw Error('未取得与本章固定版本绑定的作者及采用原文证据');
  if (typeof chapter.markdown !== 'string' || hash(chapter.markdown) !== chapter.digest || source.chapterDigest !== chapter.digest) throw Error('章节私有证据的正文身份不一致');
  return {studyDate:source.studyDate, ...(chapter.runId ? {runId:chapter.runId} : {}), chapterDigest:chapter.digest,
    selectionDigest:source.selectionDigest, vixInputCommit:source.vixInputCommit,...(chapter.wordCount!=null?{wordCount:chapter.wordCount,chapterSizePolicy:chapter.chapterSizePolicy??null}:{})};
}
async function immutable(file, text) {
  let ancestor=path.dirname(file);
  for(;;){try{const physical=await fs.realpath(ancestor);if(process.platform==='win32'&&!/^D:[\\/]/i.test(physical))throw Error('章节私有证据物理路径须在D盘');break;}catch(error){if(error.code!=='ENOENT')throw error;const parent=path.dirname(ancestor);if(parent===ancestor)throw error;ancestor=parent;}}
  await fs.mkdir(path.dirname(file), {recursive:true});
  if(process.platform==='win32'&&!/^D:[\\/]/i.test(await fs.realpath(path.dirname(file))))throw Error('章节私有证据物理路径须在D盘');
  const temporary=file+'.'+randomUUID()+'.tmp';let handle;
  try {
    handle=await fs.open(temporary,'wx');await handle.writeFile(text);await handle.sync();await handle.close();handle=null;
    // An interrupted write leaves only a temporary sibling, never a partial
    // content-addressed object. Existing frozen objects are never overwritten.
    try{await fs.link(temporary,file);}
    catch(error){if(error.code!=='EEXIST')throw error;if(await fs.readFile(file,'utf8')!==text)throw Error('章节私有证据原件冲突');}
  }finally{if(handle)await handle.close();await fs.unlink(temporary).catch(error=>{if(error.code!=='ENOENT')throw error;});}
}
async function safeRoot(root) {
  root = await fs.realpath(root);
  if (process.platform === 'win32' && !/^D:[\\/]/i.test(root)) throw Error('章节私有证据须实际保存于D盘');
  return root;
}
function assertDate(date){if(!/^20\d{2}-\d{2}-\d{2}$/.test(date||'')||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw Error('章节私有证据日期无效');}
// Only validated adopted records are read from their original location here.
// After sealing, readChapterEvidence never follows historical filesystem paths.
export async function prepareChapterEvidence(root, date, {markdown, selection, sources, inputSources} = {}) {
  assertDate(date);
  root = await safeRoot(root);
  const run = path.join(root,'work/runs',date), frozen = await json(path.join(run,'selection.json'));
  const contract=await loadAuthoringContract(root,date,selection);
  if (canonicalSourcePackage(frozen) !== canonicalSourcePackage(selection) || contract.policy !== 'authentic-context-v1') throw Error('只能为原冻结的单正文运行或已明确授权重编保存采用证据');
  const {manifest:materials} = await readTeachingMaterials(root,date,selection), materialsManifestText = await fs.readFile(path.join(run,'teaching/materials.json'),'utf8');
  const inputLock=await json(path.join(run,'vix-source.json'));
  const records = [{kind:'control', selection, ...((inputLock.authenticityPolicy||inputLock.chapterSizePolicy)?{inputLock}:{}), materialsManifestText, materialsManifestDigest:hash(materialsManifestText),...(contract.revision?{authoringRevision:contract.revision,revisionBaselineText:contract.baselineText}:{})}];
  for (const name of (await fs.readdir(path.join(run,'teaching/authored'))).filter(name => /^word-[A-Za-z0-9_-]+\.json$/.test(name)).sort()) {
    const authorText = await fs.readFile(path.join(run,'teaching/authored',name),'utf8'), authored = JSON.parse(authorText);
    const ref = materials.packets.find(ref => ref.word === authored.text);
    if (!ref) throw Error('作者证据不属于本次冻结词条');
    const materialText = await fs.readFile(path.join(run,ref.file),'utf8');
    records.push({kind:'word', wordId:authored.wordId, text:authored.text, authorText, authorDigest:hash(authorText), materialText, materialDigest:ref.materialDigest});
  }
  inputSources ||= (await json(path.join(run,'source-notes.json'))).sources;
  const texts=new Map(),html=new Map(),adopted=[];
  for (const source of [...(sources || [])].sort((a,b)=>key(a).localeCompare(key(b),'en'))) {
    const note = inputSources?.find(note => key(note) === key(source));
    if (!note?.readRecord) throw Error('正式采用来源缺少原读取凭据');
    const originalPath = path.resolve(root,note.readRecord), record = await validateReadRecord(originalPath,{root,sourceId:source.sourceId,url:source.url});
    if (record.textDigest !== source.readDigest) throw Error('正式采用原文与来源包读取版本不一致');
    const sourceRecord={kind:'source', sourceId:source.sourceId, url:source.url, canonicalUrl:record.canonicalUrl, readDigest:source.readDigest,authorReadRecords:[],
      recordText:await fs.readFile(originalPath,'utf8'), recordDigest:hash(await fs.readFile(originalPath))};
    if(!texts.has(record.textDigest))texts.set(record.textDigest,{kind:'text',readDigest:record.textDigest,text:await fs.readFile(record.textPath,'utf8')});
    if(record.responseBodyPath != null&&!html.has(record.responseDigest))html.set(record.responseDigest,{kind:'html',responseDigest:record.responseDigest,base64:(await fs.readFile(record.responseBodyPath)).toString('base64')});
    adopted.push(sourceRecord);
  }
  // Validate each actual author-selected receipt before sealing. URL equality
  // alone cannot establish that the author read the adopted original version.
  const authorReads=new Map(),adoptedByUrl=new Map(adopted.map(source=>[source.url,source])),sourceByUrl=new Map((sources||[]).map(source=>[source.url,source]));
  for(const word of records.filter(record=>record.kind==='word'))for(const context of JSON.parse(word.authorText).contexts||[])for(const url of context.sourceUrls||[]){
    const source=sourceByUrl.get(url),stored=adoptedByUrl.get(url),evidence=context.sourceEvidence?.find(evidence=>evidence.url===url);
    if(!source||!stored||typeof evidence?.readRecord!=='string'||!evidence.readRecord.trim())throw Error('作者语境缺少实际采用的原读取凭据');
    const file=path.resolve(root,evidence.readRecord),identity=JSON.stringify([source.sourceId,url,file]);
    if(!authorReads.has(identity)){
      const record=await validateReadRecord(file,{root,sourceId:source.sourceId,url});
      if(record.textDigest!==source.readDigest)throw Error('作者原文与采用来源readDigest不同；须回同一原件核对');
      const recordText=await fs.readFile(file,'utf8');authorReads.set(identity,{record,recordText,recordDigest:hash(recordText)});
      if(record.responseBodyPath!=null&&!html.has(record.responseDigest))html.set(record.responseDigest,{kind:'html',responseDigest:record.responseDigest,base64:(await fs.readFile(record.responseBodyPath)).toString('base64')});
    }
    const actual=authorReads.get(identity);let item=stored.authorReadRecords.find(item=>item.recordDigest===actual.recordDigest);
    if(!item){item={recordText:actual.recordText,recordDigest:actual.recordDigest,references:[]};stored.authorReadRecords.push(item);}
    if(!item.references.includes(evidence.readRecord))item.references.push(evidence.readRecord);
  }
  for(const source of adopted){source.authorReadRecords.sort((a,b)=>a.recordDigest.localeCompare(b.recordDigest));for(const record of source.authorReadRecords)record.references.sort();}
  records.push(...[...texts].sort(([a],[b])=>a.localeCompare(b)).map(([,v])=>v),...[...html].sort(([a],[b])=>a.localeCompare(b)).map(([,v])=>v),...adopted);
  const groups = []; let current = [], bytes = 0;
  for (const record of records) {
    const size = Buffer.byteLength(JSON.stringify(record));
    if (size > MAX_EVIDENCE_OBJECT_BYTES - 256) throw Error('单份采用证据超过24MiB，须显式分批材料后再封存');
    const originalRecord=!['control','word'].includes(record.kind),priorOriginal=current.length&&!['control','word'].includes(current.at(-1).kind);
    if (current.length && (bytes + size > TARGET_BYTES || originalRecord&&!priorOriginal)) { groups.push(object({schemaVersion:1,kind:'chapter-evidence-group-v1',records:current})); current=[];bytes=0; }
    current.push(record);bytes += size + 1;
  }
  if (current.length) groups.push(object({schemaVersion:1,kind:'chapter-evidence-group-v1',records:current}));
  let runId = date; try { runId = (await json(path.join(root,'chapters',date,'meta.json'))).runId || date; } catch(error) { if(error.code!=='ENOENT')throw error; }
  const manifest = validateEvidenceManifest({schemaVersion:1,kind:CHAPTER_EVIDENCE_POLICY,studyDate:date,runId,chapterDigest:hash(markdown),selectionDigest:hash(canonicalSourcePackage(selection)),vixInputCommit:selection.vixInputCommit,authoringPolicy:contract.policy,...(selection.chapterSizePolicy?{chapterSizePolicy:selection.chapterSizePolicy}:{}),wordCount:selection.mainWords.length,sourceCount:sources.length,groups:groups.map(({digest,bytes})=>({digest,bytes}))});
  const verified=verifyEvidenceRecords(manifest,groups.map(group=>JSON.parse(group.text)),{markdown,sourcePackage:{sources,...(inputLock.authenticityPolicy?{authenticityPolicy:inputLock.authenticityPolicy}:{})}});
  const manifestObject = object(manifest), objects = [...groups,manifestObject], folder = path.join(run,'sources/evidence');
  for (const item of objects) await immutable(path.join(folder,item.digest+'.json'),item.text);
  return {digest:manifestObject.digest,manifest,objects,authenticity:verified.authenticity};
}

export async function readChapterEvidence({chapter, readAsset}) {
  const expected = expectedFor(chapter), digest = chapter.sourcePackage.evidenceDigest;
  const manifest = await readAsset(digest);
  if(!manifest||typeof manifest!=='object')throw Error('章节私有证据清单缺失');
  if (hash(JSON.stringify(manifest)) !== digest) throw Error('章节私有证据清单摘要不符');
  validateEvidenceManifest(manifest,expected);
  const groups = [];
  for (const ref of manifest.groups) {
    const group = await readAsset(ref.digest);if(!group||typeof group!=='object')throw Error('章节私有证据分包缺失');const bytes = JSON.stringify(group);
    if (hash(bytes) !== ref.digest || Buffer.byteLength(bytes) !== ref.bytes) throw Error('章节私有证据分包摘要或长度不符');
    groups.push(group);
  }
  return verifyEvidenceRecords(manifest,groups,chapter);
}

export async function loadChapterEvidence(root, date, sourcePackage, {markdown} = {}) {
  assertDate(date);
  root = await safeRoot(root);
  if(date!==sourcePackage.studyDate)throw Error('本机采用证据不能跨运行日期读取');
  const folder = path.join(root,'work/runs',date,'sources/evidence'), objects = new Map();
  const result = await readChapterEvidence({chapter:{markdown,digest:hash(markdown),sourcePackage},readAsset:async digest => {
    const text = await fs.readFile(path.join(folder,digest+'.json'),'utf8');
    if (hash(text) !== digest) throw Error('本机采用证据原件摘要不符');
    const value = JSON.parse(text); if (JSON.stringify(value) !== text) throw Error('本机采用证据序列化原件不一致');
    objects.set(digest,{digest,text,bytes:Buffer.byteLength(text)}); return value;
  }});
  return {...result,digest:sourcePackage.evidenceDigest,
    objects:[...result.manifest.groups.map(group=>objects.get(group.digest)),objects.get(sourcePackage.evidenceDigest)]};
}
