import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { publisherConfig } from './lib/publisher-config.mjs';

const planPath = process.argv[2];
if (!planPath) throw new Error('用法: node scripts/build-review.mjs work/reviews/ID/plan.json');
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
    sources.set(id, chapter);
  }
  return sources.get(id);
}
function parts(markdown) {
  const markers = [...markdown.matchAll(/^<!-- PART:(one|two|three) -->\s*$/gm)];
  if (markers.length !== 3 || markers.map(item => item[1]).join(',') !== 'one,two,three') throw new Error('来源章节缺少三部分');
  return Object.fromEntries(markers.map((item, index) => [item[1], markdown.slice(item.index + item[0].length, markers[index + 1]?.index ?? markdown.length).trim()]));
}
function wordBlock(part, word) {
  const headings = [...part.matchAll(/^# ([^#\n]+)$/gm)];
  const index = headings.findIndex(item => item[1].trim() === word);
  if (index < 0) throw new Error(`原章节缺少词条：${word}`);
  return part.slice(headings[index].index, headings[index + 1]?.index ?? part.length).trim();
}
const sections = { one: [], two: [], three: [] };
for (const item of plan.entries) {
  const chapter = await source(item.chapterId);
  const original = parts(chapter.markdown);
  sections.one.push(wordBlock(original.one, item.word));
  sections.two.push(wordBlock(original.two, item.word));
  if (!Array.isArray(item.thirdSentences) || !item.thirdSentences.length || item.thirdSentences.some(sentence => typeof sentence !== 'string' || !sentence.trim() || !original.three.includes(sentence.trim())))
    throw new Error(`${item.word} 的第三部分摘句必须直接取自其来源章节，且至少一条`);
  sections.three.push(`# ${item.word}\n\n${item.thirdSentences.map(sentence => sentence.trim()).join('\n\n')}`);
}
const markdown = ['one', 'two', 'three'].map(part => `<!-- PART:${part} -->\n\n${sections[part].join('\n\n')}`).join('\n\n') + '\n';
const page = { id: plan.id, kind: 'review', title: plan.title || '章节复习', subtitle: plan.subtitle || '', requestId: plan.requestId || null, markdown };
const folder = path.dirname(path.resolve(planPath));
await mkdir(folder, { recursive: true });
await writeFile(path.join(folder, 'page.md'), markdown);
await writeFile(path.join(folder, 'page.json'), JSON.stringify(page, null, 2));
console.log(`复习页已排版：${plan.entries.length} 个词，${sources.size} 个来源章节，${path.join(folder, 'page.json')}`);
