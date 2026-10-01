const ID = '[A-Za-z][A-Za-z0-9_-]{0,31}';
const WORD = new RegExp(`^<!-- WORD:(${ID}) -->$`);
const USE = new RegExp(`^<!-- USE:(${ID}) -->$`);
const EXAMPLE = new RegExp(`^<!-- EXAMPLE:(${ID}) -->$`);
const SENTENCE = new RegExp(`^<!-- SENTENCE:(${ID}) USE:(${ID}(?:,${ID})*) -->$`);
const mono = line => /^`[^`]+`$/.test(line);
const linesOf = text => text.replace(/\r\n?/g, '\n').split('\n').map(line => line.trim());

export function splitParts(markdown) {
  const markers = [...markdown.matchAll(/^<!-- PART:(one|two|three) -->\s*$/gm)];
  if (markers.length !== 3 || markers.map(item => item[1]).join(',') !== 'one,two,three') throw new Error('正文必须依次且仅一次包含三部分标记');
  return Object.fromEntries(markers.map((item, index) => [item[1], markdown.slice(item.index + item[0].length, markers[index + 1]?.index ?? markdown.length).trim()]));
}

function firstUnits(source) {
  const words = [], uses = new Map(), allIds = new Set();
  let pending = null, currentWord = null, awaitingGloss = null;
  for (const line of linesOf(source)) {
    if (!line) continue;
    if (awaitingGloss) {
      if (!mono(line) || /^(?:Oxford|牛津)\s*[:：]|美式音标|美音\s*[:：]/i.test(line.slice(1, -1)))
        throw new Error(`用法 ${awaitingGloss} 下一行须是无来源或音标说明字的等宽 Oxford 词义`);
      awaitingGloss = null; continue;
    }
    const word = WORD.exec(line), use = USE.exec(line);
    if (word || use) {
      if (pending) throw new Error(`第一部分编码 ${pending.id} 未关联内容`);
      const id = (word || use)[1];
      if (allIds.has(id)) throw new Error(`第一部分编码重复：${id}`);
      allIds.add(id); pending = { kind: word ? 'word' : 'use', id }; continue;
    }
    if (line.startsWith('<!--')) throw new Error(`第一部分出现未知编码：${line}`);
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading?.[1] === '#') {
      if (pending?.kind !== 'word') throw new Error(`词条缺少 WORD 编码：${heading[2]}`);
      currentWord = { id: pending.id, text: heading[2].trim() };
      words.push(currentWord); pending = null; continue;
    }
    if (heading?.[1] === '##') {
      if (pending?.kind !== 'use' || !currentWord) throw new Error(`二级用法缺少 USE 编码：${heading[2]}`);
      const title = /^(.*?)\s+(\/[^/\n]+\/)\s*$/.exec(heading[2]);
      if (!title?.[1]) throw new Error(`二级用法须在标题末尾直接写美式音标：${heading[2]}`);
      uses.set(pending.id, { label: title[1].trim(), wordId: currentWord.id });
      awaitingGloss = pending.id; pending = null; continue;
    }
    if (pending?.kind === 'word') throw new Error(`WORD 编码 ${pending.id} 后必须是一级词条`);
    if (pending?.kind === 'use') {
      if (!currentWord || mono(line)) throw new Error(`USE 编码 ${pending.id} 未指向具体用法或短语`);
      uses.set(pending.id, { label: line.replace(/^[-*]\s+|^\d+\.\s+/, '').replace(/[*`]/g, '').slice(0, 120), wordId: currentWord.id });
      pending = null; continue;
    }
    if (/^[-*]\s+\*\*/.test(line)) throw new Error(`短语实例缺少 USE 编码：${line.slice(0, 60)}`);
  }
  if (pending || awaitingGloss) throw new Error(`第一部分编码 ${pending?.id || awaitingGloss} 未关联完整内容`);
  if (!words.length || !uses.size) throw new Error('第一部分缺少已编码的词条或用法');
  return { words, uses };
}

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
  const sentences = [], ids = new Set(), covered = new Set();
  let pending = null, stage = 0;
  for (const line of linesOf(source)) {
    if (!line) continue;
    const marker = SENTENCE.exec(line);
    if (marker) {
      if (pending) throw new Error(`文章句子 ${pending.id} 缺少原句或译文`);
      if (ids.has(marker[1])) throw new Error(`文章句子编码重复：${marker[1]}`);
      ids.add(marker[1]);
      const refs = marker[2].split(',');
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
      sentences.push(pending);
      pending.refs.forEach(id => covered.add(id));
      pending = null; stage = 0; continue;
    }
    if (!/^#{1,3}\s+/.test(line)) throw new Error(`第三部分存在未配对的句子：${line.slice(0, 60)}`);
  }
  if (pending || !sentences.length) throw new Error('第三部分句子与译文未配对完成');
  return { sentences, covered };
}

export function validateAnnotatedContent(markdown, { expectedWordCount, maxWordCount = 200 } = {}) {
  const parts = splitParts(markdown);
  const { words, uses } = firstUnits(parts.one);
  if (expectedWordCount != null && words.length !== expectedWordCount) throw new Error(`正文必须有 ${expectedWordCount} 个主词`);
  if (words.length > maxWordCount || new Set(words.map(item => item.text)).size !== words.length) throw new Error('主词数量或唯一性无效');
  if (words.some((word, index) => index && words[index - 1].text.localeCompare(word.text, 'en') > 0)) throw new Error('主词必须按字典序排列');
  secondExamples(parts.two, words, uses);
  const { sentences, covered } = sentenceRecords(parts.three, uses);
  for (const id of uses.keys()) if (!covered.has(id)) throw new Error(`文章未使用第一部分的用法：${id}`);
  return { parts, words, uses, sentences };
}
