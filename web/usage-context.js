import {parseTeachingUnits} from './teaching-units.js';

export const USAGE_CONTEXT_FORMAT = 'usage-context-v1';
export const CONTEXT_AUTHORING_POLICY = 'authentic-context-v1';
export const CONTEXT_LIMIT = 5;
const ID = '[A-Za-z][A-Za-z0-9_-]{0,31}';
const START = new RegExp(`^<!-- CONTEXT:(${ID}) USE:(${ID}(?:,${ID})*) KIND:(abridgment|excerpt|example) -->$`);
const REF = new RegExp(`^<!-- CONTEXT_REF:(${ID}) USE:(${ID}(?:,${ID})*) -->$`);
const SENTENCE = new RegExp(`^<!-- SENTENCE:(${ID})(?: USE:(${ID}(?:,${ID})*))? -->$`);
const END = new RegExp(`^<!-- END_CONTEXT:(${ID}) -->$`);
const TRANSLATION = new RegExp(`^<!-- TRANSLATION:(${ID}) -->$`);
const MARKER = `<!-- FORMAT:${USAGE_CONTEXT_FORMAT} -->`;
const uniqueRefs = (s, what) => {
  const refs = s ? s.split(',') : [];
  if (new Set(refs).size !== refs.length) throw Error(`${what}含重复用法`);
  return refs;
};
const validId = s => typeof s === 'string' && new RegExp(`^${ID}$`).test(s);
export function isUsageContextContent(markdown) {
  return typeof markdown === 'string' && /^<!-- FORMAT:usage-context-v1 -->\s*$/m.test(markdown);
}

function metadata(line, kind) {
  const m = /^<!-- CONTEXT_META:(\{.*\}) -->$/.exec(line);
  if (!m) throw Error('语境须紧接一行 CONTEXT_META JSON');
  let value;
  try { value = JSON.parse(m[1]); } catch { throw Error('语境元数据JSON无效'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error('语境元数据无效');
  for (const key of ['title', 'displayContext']) {
    if (value[key] != null && (typeof value[key] !== 'string' || /[\r\n<>]/.test(value[key]) || value[key].length > 1200)) throw Error('语境显示说明无效');
  }
  if (!Array.isArray(value.sourceUrls) || value.sourceUrls.length > 20 || new Set(value.sourceUrls).size !== value.sourceUrls.length) throw Error('语境来源须为唯一URL数组');
  for (const url of value.sourceUrls) {
    try { const u = new URL(url); if (u.protocol !== 'https:' || u.username || u.password) throw Error(); }
    catch { throw Error('语境来源须为无凭据HTTPS链接'); }
  }
  if (kind !== 'example' && !value.sourceUrls.length) throw Error('真实语境缺少实际采用来源');
  if (value.speakers != null && (typeof value.speakers !== 'object' || Array.isArray(value.speakers))) throw Error('说话者映射无效');
  for (const [id, speaker] of Object.entries(value.speakers || {})) {
    if (!validId(id) || typeof speaker !== 'string' || !speaker.trim() || speaker.length > 150 || /[\r\n<>]/.test(speaker)) throw Error('说话者标记无效');
  }
  return {title: value.title || '', displayContext: value.displayContext || '', sourceUrls: value.sourceUrls, speakers: value.speakers || {}};
}

// A single text stream. Sentences have identities for audio and questions;
// translations belong to whole contexts and never to individual sentences.
export function parseUsageContextContent(markdown, {expectedWordCount, maxWordCount = 200} = {}) {
  if (typeof markdown !== 'string') throw Error('正文须为文字');
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  if (lines.find(l => l.trim())?.trim() !== MARKER || lines.filter(l => l.trim() === MARKER).length !== 1 || /<!-- PART:/.test(markdown)) throw Error('新格式须以唯一FORMAT开头，不能混入旧三部分');
  const definitions = [], contexts = [], sentences = [], occurrences = [], sentenceIds = new Set();
  let currentUse = null, definitionState = 'none';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === MARKER) continue;
    const use = new RegExp(`^<!-- USE:(${ID}) -->$`).exec(line);
    if(/^<!-- WORD:/.test(line)){currentUse=null;definitionState='none';}
    if (use) {currentUse = use[1];definitionState='pending';}
    const ref = REF.exec(line);
    if (ref) {
      const refs = uniqueRefs(ref[2], '共享语境');
      if (!currentUse || definitionState!=='ready' || !refs.includes(currentUse)) throw Error('语境引用须位于对应完整用法定义后');
      occurrences.push({id: ref[1], refs, useId: currentUse, reference: true});
      continue;
    }
    const start = START.exec(line);
    if (!start) {
      if (/^<!-- (?:CONTEXT|SENTENCE|TRANSLATION|END_CONTEXT|FORMAT)/.test(line)) throw Error('语境标记无效或落在块外');
      definitions.push(lines[i]);
      if(line&&!line.startsWith('<!--')){
        if(definitionState==='pending')definitionState=line.startsWith('## ')?'gloss':'ready';
        else if(definitionState==='gloss'&&/^`[^`]+`$/.test(line))definitionState='ready';
      }
      continue;
    }
    const [_, id, rawRefs, kind] = start;
    const refs = uniqueRefs(rawRefs, '语境');
    if (!currentUse || definitionState!=='ready' || !refs.includes(currentUse) || contexts.some(c => c.id === id)) throw Error('语境须位于完整用法定义后，身份唯一且属于当前位置');
    do { i++; } while (i < lines.length && !lines[i].trim());
    const meta = metadata(lines[i]?.trim() || '', kind);
    const context = {id, refs, kind, ...meta, paragraphs: [], sentences: [], translation: ''};
    let paragraph = [], pending = null, translating = false, closed = false;
    const translationLines = [];
    const flush = () => { if (paragraph.length) { context.paragraphs.push(paragraph); paragraph = []; } };
    for (i++; i < lines.length; i++) {
      const raw = lines[i], value = raw.trim();
      const end = END.exec(value);
      if (end) {
        if (end[1] !== id || pending || !translating) throw Error('语境未完成英文、整块译文或闭合身份不符');
        flush(); closed = true; break;
      }
      if (translating) {
        if (value.startsWith('<!--') || /<\/?(?:script|iframe|style)\b/i.test(value)) throw Error('整份译文不能夹入结构或执行内容');
        translationLines.push(raw); continue;
      }
      const trans = TRANSLATION.exec(value);
      if (trans) {
        if (trans[1] !== id || pending || !context.sentences.length) throw Error('语境译文缺少对应完整英文');
        flush(); translating = true; continue;
      }
      if (!value) { if (pending) throw Error('句子编码须紧接完整英文'); flush(); continue; }
      const sentence = SENTENCE.exec(value);
      if (sentence) {
        if (pending || sentenceIds.has(sentence[1])) throw Error('语境句子重复或上一句未完成');
        const uses = uniqueRefs(sentence[2], '句子');
        if (uses.some(u => !refs.includes(u))) throw Error('句子引用超出本语境声明');
        pending = {id: sentence[1], refs: uses}; continue;
      }
      if (!pending || /^(?:<!--|#{1,6}\s|`)/.test(value) || /<\/?(?:script|iframe|style)\b/i.test(value)) throw Error('语境英文须逐条完整编码，不放逐句译文');
      const record = {...pending, text: value, contextId: id, ...(meta.speakers[pending.id] ? {speaker: meta.speakers[pending.id]} : {})};
      sentenceIds.add(record.id); sentences.push(record); context.sentences.push(record); paragraph.push(record); pending = null;
    }
    if (!closed) throw Error('语境块未闭合');
    context.translation = translationLines.join('\n').trim();
    if (!context.translation || context.translation.length > 100000 || /^`[^]*`$/.test(context.translation)) throw Error('每份语境须有一个完整译文块，不使用逐句等宽译文');
    const covered = new Set(context.sentences.flatMap(s => s.refs));
    if (refs.some(u => !covered.has(u))) throw Error('语境声明须由英文句子的实际用法引用承接');
    if (Object.keys(meta.speakers).some(id => !context.sentences.some(s => s.id === id))) throw Error('说话者映射指向不存在句子');
    contexts.push(context); occurrences.push({id, refs, useId: currentUse, reference: false});
  }
  const definitionText = definitions.join('\n').trim();
  const {words, uses} = parseTeachingUnits(definitionText);
  const definedWords = new Set([...uses.values()].map(use => use.wordId));
  for (const word of words) if (!definedWords.has(word.id)) throw Error(`主词 ${word.text} 缺少已编码用法；新正文每个主词须有至少一个USE`);
  if (expectedWordCount != null && words.length !== expectedWordCount) throw Error(`正文必须有 ${expectedWordCount} 个主词`);
  if (words.length > maxWordCount || new Set(words.map(w => w.text)).size !== words.length || words.some((w,i) => i && words[i-1].text.localeCompare(w.text,'en') > 0)) throw Error('主词数量、唯一性或字典序无效');
  const contextMap = new Map(contexts.map(c => [c.id,c]));
  const useContexts = new Map([...uses.keys()].map(id => [id,new Set()]));
  const placements=new Set();
  for (const occurrence of occurrences) {
    const key=occurrence.useId+'\0'+occurrence.id;
    if(placements.has(key))throw Error('同一用法不能重复呈现同一语境');
    placements.add(key);
    const c = contextMap.get(occurrence.id);
    if (!c || occurrence.refs.some(u => !uses.has(u) || !c.refs.includes(u))) throw Error('语境引用不存在或不覆盖所指用法');
    for (const u of occurrence.refs) useContexts.get(u).add(c.id);
  }
  for (const c of contexts) {
    if(c.refs.some(u => !uses.has(u)))throw Error('语境声明引用不存在用法');
    for(const u of c.refs)if(!occurrences.some(o=>o.id===c.id&&o.useId===u&&o.refs.includes(u)))throw Error(`语境${c.id}未在用法${u}旁实际放置或引用`);
  }
  for (const [id, selected] of useContexts) {
    if (selected.size < 1 || selected.size > CONTEXT_LIMIT) throw Error(`用法 ${id} 须有1至${CONTEXT_LIMIT}份选定语境`);
    // Every use must have an inline location; a distant context's metadata alone
    // does not count as having placed a learning example beside this definition.
    if (!occurrences.some(o => o.useId === id && o.refs.includes(id))) throw Error(`用法 ${id} 缺少就地语境或引用`);
    uses.get(id).contextIds = [...selected];
  }
  return {format: USAGE_CONTEXT_FORMAT, parts: {one: markdown.trim()}, definitions: definitionText, words, uses, contexts, contextMap, occurrences, sentences, articles: []};
}
