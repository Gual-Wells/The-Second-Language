// Complete deterministic evidence validation shared by CLI and Worker (nodejs_compat).
// This validates provenance and reconstruction, not the truth of semantic judgments.
import {createHash} from 'node:crypto';
import {Buffer} from 'node:buffer';
import {canonicalSourcePackage} from './current-affairs.mjs';
import {validateEvidenceGroup} from './chapter-evidence.mjs';
import {assembleUsageContextCollection} from '../scripts/lib/usage-context-authoring.mjs';
import {checkMaterialDisposition,teachingScope} from './teaching-disposition.mjs';
import {validateAuthoringRevision} from './chapter-authoring-revision.mjs';
const hash=value=>createHash('sha256').update(value).digest('hex');
const key=source=>JSON.stringify([source.sourceId,source.url]);
const norm=value=>value.normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');
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
export function verifyEvidenceRecords(manifest, groups, chapter) {
  const records = groups.flatMap(group => validateEvidenceGroup(group).records);
  const controls = records.filter(record => record.kind === 'control');
  if (controls.length !== 1) throw Error('章节私有证据须有唯一冻结材料身份');
  const control = controls[0], selection = control.selection;
  const policy=control.authoringRevision?validateAuthoringRevision(control.authoringRevision,{selection,baselineText:control.revisionBaselineText,date:manifest.studyDate,runId:manifest.runId}).policy:selection?.authoringPolicy;
  if (!selection || selection.studyDate !== manifest.studyDate || selection.vixInputCommit !== manifest.vixInputCommit ||
      policy !== manifest.authoringPolicy || hash(canonicalSourcePackage(selection)) !== manifest.selectionDigest ||
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
