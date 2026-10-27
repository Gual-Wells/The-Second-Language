import {parseTeachingUnits} from './teaching-units.js';
import {isUsageContextContent,parseUsageContextContent} from './usage-context.js';
const ID = '[A-Za-z][A-Za-z0-9_-]{0,31}';
const WORD = new RegExp(`^<!-- WORD:(${ID}) -->$`);
const USE = new RegExp(`^<!-- USE:(${ID}) -->$`);
const EXAMPLE = new RegExp(`^<!-- EXAMPLE:(${ID}) -->$`);
const SENTENCE = new RegExp(`^<!-- SENTENCE:(${ID})(?: USE:(${ID}(?:,${ID})*))? -->$`);
const ARTICLE = new RegExp(`^<!-- ARTICLE:(${ID}) -->$`);
const mono = line => /^`[^`]+`$/.test(line);
const linesOf = text => text.replace(/\r\n?/g, '\n').split('\n').map(line => line.trim());

export function splitParts(markdown) {
  const markers = [...markdown.matchAll(/^<!-- PART:(one|two|three) -->\s*$/gm)];
  if (markers.length !== 3 || markers.map(item => item[1]).join(',') !== 'one,two,three') throw new Error('正文必须依次且仅一次包含三部分标记');
  return Object.fromEntries(markers.map((item, index) => [item[1], markdown.slice(item.index + item[0].length, markers[index + 1]?.index ?? markdown.length).trim()]));
}

const firstUnits = parseTeachingUnits;

function secondExamples(source, words, uses) {
  const seenWords = [], examples = new Map();
  let pending = null, stage = 0;
  for (const line of linesOf(source)) {
    if (!line) continue;
    const word = WORD.exec(line), example = EXAMPLE.exec(line);
    if (word || example) {
      if (stage || pending) throw new Error('第二部分例句或译文未配对完成');
      pending = { kind: word ? 'word' : 'example', id: (word || example)[1] };
      if (example && !uses.has(pending.id)) throw new Error(`例句指向不存在的用法：${pending.id}`);
      continue;
    }
    if (line.startsWith('<!--')) throw new Error(`第二部分出现未知编码：${line}`);
    const heading = /^# ([^#\n]+)$/.exec(line);
    if (heading) {
      if (pending?.kind !== 'word') throw new Error(`第二部分词条缺少 WORD 编码：${heading[1]}`);
      seenWords.push({ id: pending.id, text: heading[1].trim() }); pending = null; continue;
    }
    if (pending?.kind === 'word') throw new Error(`第二部分 WORD 编码 ${pending.id} 后必须是一级词条`);
    if (stage === 1) {
      if (!mono(line)) throw new Error('第二部分例句下一行必须是等宽译文');
      examples.set(pending.id, (examples.get(pending.id) || 0) + 1);
      pending = null; stage = 0; continue;
    }
    if (pending?.kind === 'example') {
      if (mono(line) || !seenWords.length) throw new Error(`例句 ${pending.id} 缺少正文`);
      if (uses.get(pending.id).wordId !== seenWords.at(-1).id) throw new Error(`例句 ${pending.id} 被放在错误词条下`);
      stage = 1; continue;
    }
    throw new Error(`第二部分存在未编码例句：${line.slice(0, 60)}`);
  }
  if (pending || stage) throw new Error('第二部分结尾存在未配对的例句');
  if (JSON.stringify(seenWords) !== JSON.stringify(words)) throw new Error('第一、二部分 WORD 编码、词序或词条不一致');
  for (const id of uses.keys()) if (!examples.has(id)) throw new Error(`用法 ${id} 缺少对应例句`);
  return examples;
}

export function sentenceRecords(source, knownUses = null) {
  const sentences = [], articles = [], ids = new Set(), articleIds = new Set(), covered = new Set();
  let pending = null, stage = 0, article = null, awaitingTitle = false;
  for (const line of linesOf(source)) {
    if (!line) continue;
    const articleMarker = ARTICLE.exec(line);
    if (articleMarker) {
      if (pending || awaitingTitle || article && !article.sentenceIds.length) throw new Error('篇目边界前的标题或句子未完成');
      if (!articles.length && sentences.length) throw new Error('使用 ARTICLE 时每句须归属明确篇目');
      if (articleIds.has(articleMarker[1])) throw new Error(`篇目编码重复：${articleMarker[1]}`);
      articleIds.add(articleMarker[1]);
      article = { id: articleMarker[1], title: '', sentenceIds: [] }; articles.push(article); awaitingTitle = true; continue;
    }
    if (awaitingTitle) {
      const title = /^#\s+(.+)$/.exec(line);
      if (!title) throw new Error(`篇目 ${article.id} 须紧接一级文章标题`);
      article.title = title[1]; awaitingTitle = false; continue;
    }
    const marker = SENTENCE.exec(line);
    if (marker) {
      if (pending) throw new Error(`文章句子 ${pending.id} 缺少原句或译文`);
      if (ids.has(marker[1])) throw new Error(`文章句子编码重复：${marker[1]}`);
      ids.add(marker[1]);
      const refs = marker[2] ? marker[2].split(',') : [];
      if (new Set(refs).size !== refs.length || (knownUses && refs.some(id => !knownUses.has(id)))) throw new Error(`文章句子 ${marker[1]} 的用法编码无效`);
      pending = { id: marker[1], refs }; stage = 1; continue;
    }
    if (line.startsWith('<!--')) throw new Error(`第三部分出现未知编码：${line}`);
    if (stage === 1) {
      if (mono(line) || /^#/.test(line)) throw new Error(`文章句子 ${pending.id} 缺少原句`);
      pending.text = line; stage = 2; continue;
    }
    if (stage === 2) {
      if (!mono(line)) throw new Error(`文章句子 ${pending.id} 下一行必须是等宽译文`);
      pending.translation = line.slice(1, -1);
      if (article) { pending.articleId = article.id; article.sentenceIds.push(pending.id); }
      sentences.push(pending);
      pending.refs.forEach(id => covered.add(id));
      pending = null; stage = 0; continue;
    }
    if (!/^#{1,3}\s+/.test(line)) throw new Error(`第三部分存在未配对的句子：${line.slice(0, 60)}`);
    if (article && /^#\s+/.test(line)) throw new Error('新文章须先给出 ARTICLE 编码；篇内小标题使用二、三级');
  }
  if (pending || !sentences.length || awaitingTitle || article && !article.sentenceIds.length) throw new Error('第三部分篇目、句子与译文未配对完成');
  return { sentences, covered, articles };
}

export function validateAnnotatedContent(markdown, { expectedWordCount, maxWordCount = 200 } = {}) {
  if(isUsageContextContent(markdown))return parseUsageContextContent(markdown,{expectedWordCount,maxWordCount});
  const parts = splitParts(markdown);
  const { words, uses } = firstUnits(parts.one);
  if (expectedWordCount != null && words.length !== expectedWordCount) throw new Error(`正文必须有 ${expectedWordCount} 个主词`);
  if (words.length > maxWordCount || new Set(words.map(item => item.text)).size !== words.length) throw new Error('主词数量或唯一性无效');
  if (words.some((word, index) => index && words[index - 1].text.localeCompare(word.text, 'en') > 0)) throw new Error('主词必须按字典序排列');
  secondExamples(parts.two, words, uses);
  const { sentences, covered, articles } = sentenceRecords(parts.three, uses);
  for (const id of uses.keys()) if (!covered.has(id)) throw new Error(`文章未使用第一部分的用法：${id}`);
  return { parts, words, uses, sentences, articles };
}

// Formal production count; archived reads use validateAnnotatedContent separately.
export const DAILY_WORD_COUNT = 50;
export function validateTeachingLayout(markdown,policy) {
  const parsed=validateAnnotatedContent(markdown,{expectedWordCount:DAILY_WORD_COUNT});
  if(!policy||policy==='legacy')return parsed;
  if(policy!=='etymology-fused-v1')throw Error('未知章节教学协议');
  const blocks=parsed.parts.one.split(/^<!-- WORD:/m).slice(1);
  for(const block of blocks){const intro=block.split(/^<!-- USE:/m)[0],labels=[...intro.matchAll(/\*\*词源\*\*\s*[：:]/g)];if(labels.length!==1||!intro.slice(labels[0].index+labels[0][0].length).trim())throw Error('新章每个一级词头须有一个完整词源区块');}
  return parsed;
}
