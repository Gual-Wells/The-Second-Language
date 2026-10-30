import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { validateTeachingLayout, DAILY_WORD_COUNT } from '../web/annotations.js';
import {assertTeachingText} from '../protocol/teaching-text.mjs';
import {loadChapterSources} from './lib/current-affairs-package.mjs';
import {AUTHORING_POLICY,assembleRun} from './lib/teaching-authoring.mjs';
import {CONTEXT_AUTHORING_POLICY} from '../protocol/usage-context.mjs';
import {loadChapterEvidence} from './lib/chapter-evidence.mjs';
import {canonicalSourcePackage} from '../protocol/current-affairs.mjs';

const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('用法: node scripts/pack-chapter.mjs YYYY-MM-DD');
const folder = path.resolve('chapters', date);
const markdown = await readFile(path.join(folder, 'chapter.md'), 'utf8');
const meta = JSON.parse(await readFile(path.join(folder, 'meta.json'), 'utf8'));
const parsed=validateTeachingLayout(markdown, meta.contentPolicy);if(meta.contentPolicy==='etymology-fused-v1')assertTeachingText(parsed);
const integrated=parsed.format==='usage-context-v1';
if(meta.authoringPolicy!=null&&![AUTHORING_POLICY,CONTEXT_AUTHORING_POLICY].includes(meta.authoringPolicy))throw Error('未知课程制作协议');
if(integrated&&meta.authoringPolicy!==CONTEXT_AUTHORING_POLICY||!integrated&&meta.authoringPolicy===CONTEXT_AUTHORING_POLICY)throw Error('作者协议与正文格式不一致');
let authored;
if(parsed.articles.length||meta.authoringPolicy===AUTHORING_POLICY||integrated){
  if(meta.authoringPolicy!==(integrated?CONTEXT_AUTHORING_POLICY:AUTHORING_POLICY))throw Error('新章须采用已核对的教材与作者合同');
  authored=await assembleRun(process.cwd(),date);
  if(markdown!==authored.markdown)throw Error('正式正文与已核对的制作稿不同；先在作者稿修订并重新装配');
}
const words=parsed.words.map(w=>w.text);
if(!integrated){
const parts = ['one', 'two', 'three'].map(part => `<!-- PART:${part} -->`);
const positions = parts.map(part => markdown.indexOf(part));
if (positions.some(x => x < 0) || positions[0] >= positions[1] || positions[1] >= positions[2]) throw new Error('章节必须按顺序包含三部分标记');
const first = markdown.slice(positions[0], positions[1]);
const second = markdown.slice(positions[1], positions[2]);
const firstWords = [...first.matchAll(/^# ([^#\n]+)$/gm)].map(x => x[1].trim());
const exampleWords = [...second.matchAll(/^# ([^#\n]+)$/gm)].map(x => x[1].trim());
if (firstWords.length !== DAILY_WORD_COUNT || new Set(firstWords).size !== DAILY_WORD_COUNT || JSON.stringify(firstWords) !== JSON.stringify(exampleWords)) throw new Error(`第一、二部分必须按相同顺序各列出 ${DAILY_WORD_COUNT} 个不同主词`);
}
if (words.some((word, i) => i > 0 && words[i - 1].localeCompare(word, 'en') > 0)) throw new Error('主词未按字典序排列');
if (meta.date !== date || meta.wordCount !== DAILY_WORD_COUNT || !meta.title || !meta.number) throw new Error('章节元数据不匹配');
const digest = createHash('sha256').update(markdown).digest('hex');
const source=await loadChapterSources(process.cwd(),date,markdown,meta,words);
if(integrated){
  if(!source.sourcePackage.evidenceDigest)throw Error('单正文须先封存采用原文和作者去向证据，再整理发布包');
  const sealed=await loadChapterEvidence(process.cwd(),date,source.sourcePackage,{markdown});
  const sealedWords=new Map(sealed.authoring.map(word=>[word.wordId,word.authored]));
  if(authored.words.some(word=>canonicalSourcePackage(word)!==canonicalSourcePackage(sealedWords.get(word.wordId))))throw Error('当前作者去向已改变，不能沿用旧封存证据；请重新核对来源包');
}
const packed = { id: date, date, title: meta.title, subtitle: meta.subtitle || '', number: meta.number, wordCount: DAILY_WORD_COUNT, contentPolicy: meta.contentPolicy, ...(meta.authoringPolicy?{authoringPolicy:meta.authoringPolicy}:{}), ...(integrated?{format:parsed.format}:{}), digest, markdown, ...source };
await writeFile(path.join(folder, 'chapter.json'), JSON.stringify(packed));
console.log(`章节已整理：${date}，${DAILY_WORD_COUNT} 主词，SHA-256 ${digest}`);
