import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { publisherConfig } from './lib/publisher-config.mjs';
import { sentenceRecords, splitParts, validateAnnotatedContent } from '../web/annotations.js';

const planPath = process.argv[2];
if (!planPath) throw new Error('用法: node scripts/build-review.mjs work/temporary/ID/plan.json');
const plan = JSON.parse(await readFile(path.resolve(planPath), 'utf8'));
if (!/^[A-Za-z0-9._:-]{1,110}$/.test(plan.id || '') || !Array.isArray(plan.entries) || !plan.entries.length || plan.entries.length > 40)
  throw new Error('复习计划须有编号与 1–40 个词条');
const words = plan.entries.map(item => item.word);
if (new Set(words).size !== words.length || words.some((word, index) => typeof word !== 'string' || !word.trim() || (index && words[index - 1].localeCompare(word, 'en') > 0)))
  throw new Error('复习词条必须唯一并按词汇顺序排列');

const { base, token } = await publisherConfig();
const sources = new Map();
async function source(id) {
  if (!sources.has(id)) {
    const response = await fetch(new URL(`/api/chapters/${encodeURIComponent(id)}`, base), { headers: { authorization: `Bearer ${token}` } });
    const chapter = await response.json();
    if (!response.ok) throw new Error(`读取原章节 ${id} 失败：${chapter.error || response.status}`);
    validateAnnotatedContent(chapter.markdown);
    sources.set(id, { chapter, parts: splitParts(chapter.markdown) });
  }
  return sources.get(id);
}
function wordBlock(part, word) {
  const headings = [...part.matchAll(/^<!-- WORD:([A-Za-z][A-Za-z0-9_-]{0,31}) -->\n# ([^#\n]+)$/gm)];
  const index = headings.findIndex(item => item[2].trim() === word);
  if (index < 0) throw new Error(`原章节缺少带编码的词条：${word}`);
  return { id: headings[index][1], text: part.slice(headings[index].index, headings[index + 1]?.index ?? part.length).trim() };
}
function remap(block, wordId, newWordId, useIds) {
  return block
    .replaceAll(`<!-- WORD:${wordId} -->`, `<!-- WORD:${newWordId} -->`)
    .replace(/<!-- (USE|EXAMPLE):([A-Za-z][A-Za-z0-9_-]{0,31}) -->/g, (_, kind, id) => {
      if (!useIds.has(id)) throw new Error(`来源词条出现未映射用法：${id}`);
      return `<!-- ${kind}:${useIds.get(id)} -->`;
    });
}
const sections = { one: [], two: [], three: [] };
let sentenceNumber = 0;
for (const [index, item] of plan.entries.entries()) {
  const { parts } = await source(item.chapterId);
  const first = wordBlock(parts.one, item.word);
  const second = wordBlock(parts.two, item.word);
  if (first.id !== second.id) throw new Error(`${item.word} 在第一、二部分的词条编码不一致`);
  const newWordId = `W${String(index + 1).padStart(3, '0')}`;
  const oldUseIds = [...first.text.matchAll(/^<!-- USE:([A-Za-z][A-Za-z0-9_-]{0,31}) -->$/gm)].map(match => match[1]);
  const useIds = new Map(oldUseIds.map((id, ordinal) => [id, `U${String(index + 1).padStart(3, '0')}_${String(ordinal + 1).padStart(3, '0')}`]));
  if (!useIds.size) throw new Error(`${item.word} 没有可复习的已编码用法`);
  sections.one.push(remap(first.text, first.id, newWordId, useIds));
  sections.two.push(remap(second.text, second.id, newWordId, useIds));

  const originalSentences = sentenceRecords(parts.three).sentences;
  if (!Array.isArray(item.thirdSentences) || !item.thirdSentences.length) throw new Error(`${item.word} 缺少第三部分摘句`);
  const selected = [];
  for (const text of item.thirdSentences) {
    const record = originalSentences.find(sentence => sentence.text === text?.trim());
    if (!record) throw new Error(`${item.word} 的摘句必须与来源章节原句完全相同`);
    const refs = record.refs.filter(id => useIds.has(id)).map(id => useIds.get(id));
    if (!refs.length) throw new Error(`${item.word} 的摘句没有对应此词条的用法编码`);
    const sentenceId = `S${String(++sentenceNumber).padStart(3, '0')}`;
    selected.push(`<!-- SENTENCE:${sentenceId} USE:${refs.join(',')} -->\n${record.text}\n\`${record.translation}\``);
  }
  sections.three.push(`# ${item.word}\n\n${selected.join('\n')}`);
}
const markdown = ['one', 'two', 'three'].map(part => `<!-- PART:${part} -->\n\n${sections[part].join('\n\n')}`).join('\n\n') + '\n';
validateAnnotatedContent(markdown, { maxWordCount: 40 });
const page = { id: plan.id, kind: 'review', title: plan.title || '章节复习', subtitle: plan.subtitle || '', requestId: plan.requestId || null, markdown };
const folder = path.dirname(path.resolve(planPath));
await mkdir(folder, { recursive: true });
await writeFile(path.join(folder, 'page.md'), markdown);
await writeFile(path.join(folder, 'page.json'), JSON.stringify(page, null, 2));
console.log(`复习页已排版：${plan.entries.length} 个词，${sources.size} 个来源章节，${path.join(folder, 'page.json')}`);
