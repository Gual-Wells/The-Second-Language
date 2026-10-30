// Deterministic transport of model-authored teaching. No semantic grouping,
// definition writing, example generation or article-to-example fallback here.
import fs from 'node:fs/promises';
import path from 'node:path';
import {hash,loadTextbooks,lookupBooks} from './textbook-sources.mjs';
import {canonicalSourcePackage as canonical} from '../../protocol/current-affairs.mjs';
import {validateAnnotatedContent} from '../../web/annotations.js';
import {assembleUsageContextCollection} from './usage-context-authoring.mjs';
import {CONTEXT_AUTHORING_POLICY} from '../../protocol/usage-context.mjs';
import {loadAuthoringContract} from './chapter-authoring-revision.mjs';

export const AUTHORING_POLICY = 'sourced-collection-v1';
export const DEFAULT_AUTHORING_POLICY = CONTEXT_AUTHORING_POLICY;
const readJson = async file => JSON.parse(await fs.readFile(file,'utf8'));
const norm = s => s.normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');
const text = (s,name) => { if(typeof s!=='string'||!s.trim())throw Error(`缺少 ${name}`); return s; };
const digest = value => hash(Buffer.from(canonical(value)));
const id = s => /^[A-Za-z][A-Za-z0-9_-]{0,31}$/.test(s||'');
export function teachingScope(value) {
  if(!Array.isArray(value?.mainWords)||!value.mainWords.length)throw Error('材料范围须有 mainWords；冻结前可用相同形状的候选范围');
  const rows=value.mainWords.map(w=>({text:text(w.text,'主词'),family:(w.family||[]).filter(f=>f.included!==false).map(f=>typeof f==='string'?f:text(f.text,'词族文字')).sort((a,b)=>a.localeCompare(b,'en'))})).sort((a,b)=>a.text.localeCompare(b.text,'en'));
  if(new Set(rows.map(w=>norm(w.text))).size!==rows.length)throw Error('主词范围重复');
  return rows;
}
export function exampleCandidates(entry) {
  // These are read aids, not a parser of relevance or complete dictionary senses.
  // Keep raw text and source offsets so fragments/labels/false positives can be
  // resolved against the full original by the author rather than silently cut.
  const out=[],pattern=entry.book==='collins'?/□([^\n□]*)/g:/◊([^\n◊]*)/g;
  for(const m of entry.text.matchAll(pattern))out.push({id:entry.id+':example:'+m.index,sourceId:entry.id,raw:m[1].trim()});
  return out;
}
async function immutable(file,bytes){
  await fs.mkdir(path.dirname(file),{recursive:true});
  try{await fs.writeFile(file,bytes,{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;if(await fs.readFile(file,'utf8')!==bytes)throw Error('材料原件冲突：'+file);}
}
export async function prepareTeachingMaterials(root,date,{scopeFile,additionalFile,books}={}) {
  root=await fs.realpath(root);if(process.platform==='win32'&&!/^D:[\\/]/i.test(root))throw Error('新增教材工作材料须实际存D盘');
  const run=path.join(root,'work/runs',date),lock=await readJson(path.join(run,'vix-source.json'));
  const scopeInput=await readJson(scopeFile||path.join(run,'selection.json'));
  if(scopeInput.vixInputCommit&&scopeInput.vixInputCommit!==lock.commit)throw Error('材料范围与原 VIX 输入不一致');
  const scope=teachingScope(scopeInput);
  if(scopeFile)try{const frozen=await readJson(path.join(run,'selection.json'));if(digest(teachingScope(frozen))!==digest(scope))throw Error('已有冻结选词；候选材料不能替换原教学范围');}catch(e){if(e.code!=='ENOENT')throw e;}
  let additional={};
  if(additionalFile)additional=await readJson(additionalFile);
  else try{const previous=await readJson(path.join(run,'teaching/materials.json'));if(previous.commit!==lock.commit)throw Error('已有材料输入冲突');additional=Object.fromEntries(Object.entries(previous.additionalTerms||{}).filter(([w])=>scope.some(s=>s.text===w)));}catch(e){if(e.code!=='ENOENT')throw e;}
  if(Object.keys(additional).some(w=>!scope.some(s=>s.text===w)))throw Error('补查词须归属本次主词');
  books ||= await loadTextbooks({root,commit:lock.commit,etymology:true});
  if(!['collins','oxford'].every(name=>books.some(b=>b.book===name)))throw Error('须保留两份完整教材');
  const packets=[];
  for(const word of scope){
    if(additional[word.text]&&!Array.isArray(additional[word.text]))throw Error('补查词须为数组');
    const terms=[...new Map([word.text,...word.family,...(additional[word.text]||[])].map(t=>[norm(text(t,'补查词')),t])).values()];
    // Query every declared modern family term independently in BOTH books.
    // Never filter a previously downloaded, potentially incomplete lookup set.
    const queries=terms.map(term=>({term,books:books.filter(b=>['collins','oxford'].includes(b.book)).map(b=>({book:b.book,entryIds:b.lookup(term).map(e=>e.id)}))}));
    const entries=lookupBooks(books,terms),packet={schemaVersion:1,commit:lock.commit,word:word.text,terms,queries,entries,exampleCandidates:entries.filter(e=>['collins','oxford'].includes(e.book)).flatMap(exampleCandidates)};
    const bytes=canonical(packet),materialDigest=hash(Buffer.from(bytes)),relative=`teaching/materials/${materialDigest}.json`;
    await immutable(path.join(run,relative),bytes);
    packets.push({word:word.text,materialDigest,file:relative,unlocatedTerms:queries.filter(q=>q.books.every(b=>!b.entryIds.length)).map(q=>q.term)});
  }
  const manifest={schemaVersion:1,policy:AUTHORING_POLICY,commit:lock.commit,scope,scopeDigest:digest(scope),additionalTerms:additional,books:books.map(b=>({book:b.book,digest:b.digest,...(b.gitBlob?{gitBlob:b.gitBlob}:{})})),packets};
  await fs.mkdir(path.join(run,'teaching'),{recursive:true});
  const manifestFile=path.join(run,'teaching/materials.json'),temporary=manifestFile+'.'+process.pid+'.tmp';
  await fs.writeFile(temporary,JSON.stringify(manifest,null,2)+'\n');await fs.rename(temporary,manifestFile);
  return manifest;
}
export async function readTeachingMaterials(root,date,selection){
  const run=path.join(root,'work/runs',date),manifest=await readJson(path.join(run,'teaching/materials.json'));
  const lock=await readJson(path.join(run,'vix-source.json'));
  if(lock.authoringPolicy===CONTEXT_AUTHORING_POLICY&&selection.authoringPolicy!==CONTEXT_AUTHORING_POLICY)throw Error('新输入制作策略与冻结selection不一致');
  if(manifest.policy!==AUTHORING_POLICY||manifest.commit!==lock.commit||selection.vixInputCommit!==lock.commit||manifest.scopeDigest!==digest(teachingScope(selection))||manifest.scopeDigest!==digest(manifest.scope)||manifest.packets.length!==selection.mainWords.length)throw Error('教材材料包与冻结范围或原输入不一致；按原范围补查，不重选');
  const packets=[];
  for(const word of teachingScope(selection)){
    const ref=manifest.packets.find(p=>p.word===word.text);
    if(!ref||!/^[a-f0-9]{64}$/.test(ref.materialDigest||'')||ref.file!==`teaching/materials/${ref.materialDigest}.json`)throw Error('材料引用无效');
    const bytes=await fs.readFile(path.join(run,ref.file),'utf8');if(hash(Buffer.from(bytes))!==ref.materialDigest)throw Error('材料包原件摘要不符');
    const packet=JSON.parse(bytes);
    if(packet.word!==word.text||packet.commit!==lock.commit||[word.text,...word.family].some(t=>!packet.terms.some(s=>norm(s)===norm(t))))throw Error('词族独立补查不完整');
    for(const term of packet.terms){const q=packet.queries.find(q=>norm(q.term)===norm(term));if(!q||!['collins','oxford'].every(b=>q.books.some(v=>v.book===b&&v.entryIds.every(i=>packet.entries.some(e=>e.id===i&&e.book===b)))))throw Error('缺少独立双教材查询结果');}
    for(const e of packet.entries)if(hash(Buffer.from(e.text))!==e.excerptDigest||!manifest.books.some(b=>b.book===e.book&&b.digest===e.bookDigest))throw Error('教材条目原件摘要或教材版本不符');
    packets.push({...packet,materialDigest:ref.materialDigest});
  }
  return {manifest,packets};
}
export function assembleTeachingCollection(words,articles,{expectedWordCount}={}){
  if(!Array.isArray(words)||!words.length||!Array.isArray(articles)||!articles.length)throw Error('先完成逐词第一二部分及真实取材文章组');
  const sorted=[...words].sort((a,b)=>a.text.localeCompare(b.text,'en'));
  for(const word of sorted){
    text(word.partOne,'完整第一部分词条');text(word.partTwo,'独立制作的第二部分例句');
    for(const [part,body] of [['one',word.partOne],['two',word.partTwo]]){
      const matches=[...body.matchAll(/^<!-- WORD:([^ ]+) -->\r?\n# ([^\r\n]+)$/gm)];
      if(matches.length!==1||matches[0][1]!==word.wordId||matches[0][2]!==word.text||/<!-- PART:/.test(body))throw Error(`逐词 ${word.text} 的 ${part} 范围或 WORD 身份不符`);
    }
  }
  const third=[],seen=new Set();
  for(const article of articles){
    if(!id(article.id)||seen.has(article.id))throw Error('篇目身份无效或重复');seen.add(article.id);
    const title=text(article.title,'文章标题');if(/[\r\n]/.test(title))throw Error('文章标题须为一行');
    if(!Array.isArray(article.sourceUrls)||!article.sourceUrls.length)throw Error('每篇须绑定实际采用的材料 URL');
    third.push(`<!-- ARTICLE:${article.id} -->\n# ${title}`);
    if(!Array.isArray(article.paragraphs)||!article.paragraphs.length)throw Error('文章须有完整段落');
    for(const paragraph of article.paragraphs){
      if(!Array.isArray(paragraph)||!paragraph.length)throw Error('文章不能有空段落');
      third.push(paragraph.map(s=>{
        if(!id(s.id)||!Array.isArray(s.uses)||s.uses.some(u=>!id(u)))throw Error('句子或用法身份无效');
        const en=text(s.text,'英文原句'),zh=text(s.translation,'逐句译文');
        if(/[\r\n]/.test(en)||/[\r\n`]/.test(zh)||/^(?:<!--|#|`)/.test(en))throw Error('每条记录须为一条完整原句与译文');
        return `<!-- SENTENCE:${s.id}${s.uses.length?' USE:'+s.uses.join(','):''} -->\n${en}\n\`${zh}\``;
      }).join('\n'));
    }
  }
  const markdown=`<!-- PART:one -->\n\n${sorted.map(w=>w.partOne.trim()).join('\n\n')}\n\n<!-- PART:two -->\n\n${sorted.map(w=>w.partTwo.trim()).join('\n\n')}\n\n<!-- PART:three -->\n\n${third.join('\n\n')}\n`;
  const parsed=validateAnnotatedContent(markdown,{expectedWordCount});
  return {markdown,parsed}; // Global union only; no article/word/sense ordering rule.
}
export function checkMaterialDisposition(word,packet,parsed){
  if(word.materialDigest!==packet.materialDigest)throw Error(`${word.text} 仍在使用旧材料稿`);
  const sourceIds=new Set(packet.entries.filter(e=>['collins','oxford'].includes(e.book)).map(e=>e.id));
  if(!Array.isArray(word.sourceCoverage))throw Error('缺少教材条目内容与例句去向');
  for(const s of word.sourceCoverage){if(!sourceIds.has(s.sourceId))throw Error('未知教材条目去向');text(s.disposition,'教材内容去向或明确排除原因');}
  for(const sourceId of sourceIds)if(!word.sourceCoverage.some(s=>s.sourceId===sourceId))throw Error('教材条目尚未交代内容去向：'+sourceId);
  const candidates=new Map(packet.exampleCandidates.map(e=>[e.id,e]));
  const dispositions=word.exampleCoverage||[];
  if(!Array.isArray(dispositions)||new Set(dispositions.map(e=>e.exampleId)).size!==dispositions.length)throw Error('原例句去向重复或无效');
  for(const e of dispositions){
    if(!candidates.has(e.exampleId)||!Array.isArray(e.uses))throw Error('原例句去向包含未知来源');
    text(e.disposition,'原例句去向、合并或排除的具体说明');
    if(e.uses.some(u=>!parsed.uses.has(u)||parsed.uses.get(u).wordId!==word.wordId))throw Error('原例句不能映射到其他词族或不存在的用法');
  }
  for(const exampleId of candidates.keys())if(!dispositions.some(e=>e.exampleId===exampleId))throw Error('原例句候选尚未交代去向：'+exampleId);
  // Free-text dispositions are NOT a semantic certificate. Author review still
  // checks the full source, actual final examples, labels and genuine sense use.
}
export async function assembleRun(root,date){
  root=await fs.realpath(root);if(process.platform==='win32'&&!/^D:[\\/]/i.test(root))throw Error('新增课程工作材料须实际存D盘');
  const run=path.join(root,'work/runs',date),selection=await readJson(path.join(run,'selection.json'));
  const {packets}=await readTeachingMaterials(root,date,selection),folder=path.join(run,'teaching/authored');
  const names=(await fs.readdir(folder)).filter(n=>/^word-[A-Za-z0-9_-]+\.json$/.test(n));
  const words=await Promise.all(names.map(n=>readJson(path.join(folder,n))));
  if(words.length!==selection.mainWords.length||new Set(words.map(w=>w.text)).size!==words.length||words.some(w=>!selection.mainWords.some(s=>s.text===w.text)))throw Error('作者词条与冻结主词不一致');
  const contract=await loadAuthoringContract(root,date,selection);
  const isContexts=contract.policy===CONTEXT_AUTHORING_POLICY;
  if(selection.authoringPolicy!=null&&!isContexts&&selection.authoringPolicy!==AUTHORING_POLICY)throw Error('未知冻结制作协议');
  if(!isContexts&&words.some(w=>w.contexts!=null||w.contextChoices!=null))throw Error('旧冻结运行不能静默切换新作者合同');
  const articles=isContexts?[]:await readJson(path.join(folder,'articles.json'));
  const result=isContexts?assembleUsageContextCollection(words,{expectedWordCount:selection.mainWords.length}):assembleTeachingCollection(words,articles,{expectedWordCount:selection.mainWords.length});
  for(const w of words)checkMaterialDisposition(w,packets.find(p=>p.word===w.text),result.parsed);
  return {...result,articles,words,authoringPolicy:isContexts?CONTEXT_AUTHORING_POLICY:AUTHORING_POLICY};
}
