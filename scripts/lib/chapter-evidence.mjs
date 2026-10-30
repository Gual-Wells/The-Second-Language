import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {canonicalSourcePackage} from '../../protocol/current-affairs.mjs';
import {CHAPTER_EVIDENCE_POLICY, MAX_EVIDENCE_OBJECT_BYTES, validateEvidenceManifest, validateEvidenceGroup} from '../../protocol/chapter-evidence.mjs';
import {assembleUsageContextCollection} from './usage-context-authoring.mjs';
import {readTeachingMaterials, checkMaterialDisposition, teachingScope} from './teaching-authoring.mjs';
import {validateReadRecord} from './current-affairs-reader.mjs';

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
    selectionDigest:source.selectionDigest, vixInputCommit:source.vixInputCommit};
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
function verifyReceipt(record, source, canonicalUrl, text, html, expectedReadAt) {
  if(typeof record.recordText!=='string'||hash(record.recordText)!==record.recordDigest||typeof text!=='string')throw Error('采用原文或读取凭据摘要不符');
  const receipt=JSON.parse(record.recordText);
  // The acquisition reader has already checked canonical aliases at sealing.
  // Preserve that binding; tracking/fragment aliases need not equal requestedUrl.
  if (receipt.schemaVersion !== 1 || receipt.kind !== 'read-original-text' || receipt.sourceId !== source.sourceId ||
      receipt.canonicalUrl !== canonicalUrl || typeof canonicalUrl !== 'string' || receipt.textDigest !== source.readDigest || hash(text) !== source.readDigest ||
      receipt.textChars !== text.length || expectedReadAt!=null&&receipt.readAt!==expectedReadAt || !['native-get','codex-web','codex-pdf'].includes(receipt.acquisitionMethod || 'native-get')) throw Error('采用原文的来源、读取时间或固定字节不一致');
  if (receipt.responseBodyPath != null) {
    const bytes=html.get(receipt.responseDigest);
    if (!bytes || !Number.isSafeInteger(receipt.responseBytes) || receipt.responseBytes < 1 || bytes.length !== receipt.responseBytes || hash(bytes) !== receipt.responseDigest) throw Error('采用原HTML字节、长度或摘要不符');
  }
  return receipt;
}
function verifySource(record, source, texts, html) {
  const text=texts.get(record.readDigest),receipt=verifyReceipt(record,source,record.canonicalUrl,text,html,source.readAt);
  if(!Array.isArray(record.authorReadRecords))throw Error('采用原文缺少固定作者读件引用');
  const references=new Set(),digests=new Set(),authorReadRecords=[];
  for(const author of record.authorReadRecords){
    if(!Array.isArray(author.references)||!author.references.length||digests.has(author.recordDigest))throw Error('作者读取凭据重复或缺引用');
    digests.add(author.recordDigest);
    for(const reference of author.references){if(typeof reference!=='string'||!reference.trim()||reference.length>4096||reference.includes('\0')||references.has(reference))throw Error('作者原文引用无效或重复');references.add(reference);}
    authorReadRecords.push({references:author.references,record:verifyReceipt(author,source,record.canonicalUrl,text,html)});
  }
  return {sourceId:source.sourceId,url:source.url,record:receipt,text,authorReadRecords};
}
function verifyMaterial(packet, materials, scope, manifest) {
  if (packet.schemaVersion !== 1 || packet.commit !== manifest.vixInputCommit || packet.word !== scope.text ||
      !Array.isArray(packet.terms) || [scope.text,...scope.family].some(term => !packet.terms.some(value => norm(value) === norm(term)))) throw Error('作者证据中的教材词族或输入版本不一致');
  for (const term of packet.terms) {
    const query = packet.queries?.find(query => norm(query.term) === norm(term));
    if (!query || !['collins','oxford'].every(book => query.books?.some(item => item.book === book && Array.isArray(item.entryIds) && item.entryIds.every(id => packet.entries.some(entry => entry.id === id && entry.book === book))))) throw Error('作者证据缺少独立双教材查询');
  }
  if (!Array.isArray(packet.entries) || !Array.isArray(packet.exampleCandidates)) throw Error('作者证据中的教材材料无效');
  for (const entry of packet.entries) if (hash(entry.text) !== entry.excerptDigest || !materials.books?.some(book => book.book === entry.book && book.digest === entry.bookDigest)) throw Error('作者证据中的教材原件或教材版本摘要不符');
}
function verifyRecords(manifest, groups, chapter) {
  const records = groups.flatMap(group => validateEvidenceGroup(group).records);
  const controls = records.filter(record => record.kind === 'control');
  if (controls.length !== 1) throw Error('章节私有证据须有唯一冻结材料身份');
  const control = controls[0], selection = control.selection;
  if (!selection || selection.studyDate !== manifest.studyDate || selection.vixInputCommit !== manifest.vixInputCommit ||
      selection.authoringPolicy !== manifest.authoringPolicy || hash(canonicalSourcePackage(selection)) !== manifest.selectionDigest ||
      typeof control.materialsManifestText !== 'string' || hash(control.materialsManifestText) !== control.materialsManifestDigest) throw Error('章节私有证据的冻结选择或教材清单摘要不符');
  const materials = JSON.parse(control.materialsManifestText), scope = teachingScope(selection);
  if (scope.length !== manifest.wordCount || materials.commit !== manifest.vixInputCommit ||
      materials.scopeDigest !== hash(canonicalSourcePackage(scope)) || materials.scopeDigest !== hash(canonicalSourcePackage(materials.scope)) ||
      !Array.isArray(materials.packets) || materials.packets.length !== scope.length) throw Error('章节私有证据的材料范围不一致');
  const words = records.filter(record => record.kind === 'word');
  if (words.length !== manifest.wordCount || new Set(words.map(word => word.wordId)).size !== words.length || new Set(words.map(word => word.text)).size !== words.length) throw Error('章节作者证据漏词或重复');
  const authoring = words.map(record => {
    if (typeof record.authorText !== 'string' || hash(record.authorText) !== record.authorDigest ||
        typeof record.materialText !== 'string' || hash(record.materialText) !== record.materialDigest) throw Error('作者稿或教材材料原件摘要不符');
    const authored = JSON.parse(record.authorText), material = JSON.parse(record.materialText), current = scope.find(word => word.text === record.text);
    if (!current || authored.wordId !== record.wordId || authored.text !== record.text || authored.materialDigest !== record.materialDigest ||
        !materials.packets.some(ref => ref.word === record.text && ref.materialDigest === record.materialDigest && ref.file === `teaching/materials/${record.materialDigest}.json`)) throw Error('作者稿与本章冻结教材材料不一致');
    verifyMaterial(material, materials, current, manifest);
    return {wordId:record.wordId, text:record.text, authored, material:{...material, materialDigest:record.materialDigest}};
  });
  const assembled = assembleUsageContextCollection(authoring.map(item => item.authored), {expectedWordCount:manifest.wordCount});
  if (assembled.markdown !== chapter.markdown || hash(assembled.markdown) !== manifest.chapterDigest) throw Error('私有作者证据不能装配成本次固定正文');
  for (const item of authoring) checkMaterialDisposition(item.authored, item.material, assembled.parsed);
  const sources = chapter.sourcePackage.sources, originals = records.filter(record => record.kind === 'source'),texts=new Map(),html=new Map();
  for(const record of records.filter(record=>record.kind==='text')){
    if(typeof record.text!=='string'||hash(record.text)!==record.readDigest||texts.has(record.readDigest))throw Error('采用原文字节缺失、重复或摘要不符');
    texts.set(record.readDigest,record.text);
  }
  for(const record of records.filter(record=>record.kind==='html')){
    if(typeof record.base64!=='string'||html.has(record.responseDigest))throw Error('采用原HTML缺失或重复');
    const bytes=Buffer.from(record.base64,'base64');
    if(bytes.toString('base64')!==record.base64||hash(bytes)!==record.responseDigest)throw Error('采用原HTML摘要不符');
    html.set(record.responseDigest,bytes);
  }
  if (!Array.isArray(sources) || sources.length !== manifest.sourceCount || originals.length !== manifest.sourceCount || new Set(originals.map(key)).size !== originals.length) throw Error('章节采用原文证据漏项或重复');
  const resolved = originals.map(record => {
    const source = sources.find(source => key(source) === key(record));
    if (!source || record.readDigest !== source.readDigest) throw Error('原文证据包含未采用来源或其他读取版本');
    return verifySource(record, source, texts, html);
  });
  const receipts=resolved.flatMap(source=>[source.record,...source.authorReadRecords.map(author=>author.record)]);
  if(texts.size!==new Set(sources.map(source=>source.readDigest)).size||html.size!==new Set(receipts.filter(receipt=>receipt.responseBodyPath!=null).map(receipt=>receipt.responseDigest)).size)throw Error('证据包包含未采用的原文或HTML');
  const adopted = new Map(sources.map(source => [source.url,source]));
  for (const item of authoring) for (const context of item.authored.contexts) for (const url of context.sourceUrls) {
    const source = adopted.get(url), evidence = context.sourceEvidence?.find(evidence => evidence.url === url);
    if (!source || !evidence || !resolved.some(original => original.url === url && original.authorReadRecords.some(author=>author.references.includes(evidence.readRecord)&&author.record.textDigest===source.readDigest))) throw Error('作者采用语境没有同版原文证据');
  }
  return {manifest, authoring, originals:resolved};
}

// Only validated adopted records are read from their original location here.
// After sealing, readChapterEvidence never follows historical filesystem paths.
export async function prepareChapterEvidence(root, date, {markdown, selection, sources, inputSources} = {}) {
  assertDate(date);
  root = await safeRoot(root);
  const run = path.join(root,'work/runs',date), frozen = await json(path.join(run,'selection.json'));
  if (canonicalSourcePackage(frozen) !== canonicalSourcePackage(selection) || selection.authoringPolicy !== 'authentic-context-v1') throw Error('只能为原冻结的单正文运行保存采用证据');
  const {manifest:materials} = await readTeachingMaterials(root,date,selection), materialsManifestText = await fs.readFile(path.join(run,'teaching/materials.json'),'utf8');
  const records = [{kind:'control', selection, materialsManifestText, materialsManifestDigest:hash(materialsManifestText)}];
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
  const manifest = validateEvidenceManifest({schemaVersion:1,kind:CHAPTER_EVIDENCE_POLICY,studyDate:date,runId,chapterDigest:hash(markdown),selectionDigest:hash(canonicalSourcePackage(selection)),vixInputCommit:selection.vixInputCommit,authoringPolicy:selection.authoringPolicy,wordCount:selection.mainWords.length,sourceCount:sources.length,groups:groups.map(({digest,bytes})=>({digest,bytes}))});
  verifyRecords(manifest,groups.map(group=>JSON.parse(group.text)),{markdown,sourcePackage:{sources}});
  const manifestObject = object(manifest), objects = [...groups,manifestObject], folder = path.join(run,'sources/evidence');
  for (const item of objects) await immutable(path.join(folder,item.digest+'.json'),item.text);
  return {digest:manifestObject.digest,manifest,objects};
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
  return verifyRecords(manifest,groups,chapter);
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
