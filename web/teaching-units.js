const ID='[A-Za-z][A-Za-z0-9_-]{0,31}';
const WORD=new RegExp(`^<!-- WORD:(${ID}) -->$`);
const USE=new RegExp(`^<!-- USE:(${ID}) -->$`);
const mono=line=>/^`[^`]+`$/.test(line);
const linesOf=text=>text.replace(/\r\n?/g,'\n').split('\n').map(line=>line.trim());
export function parseTeachingUnits(source) {
  const words = [], uses = new Map(), allIds = new Set();
  let pending = null, currentWord = null, awaitingGloss = null;
  for (const line of linesOf(source)) {
    if (!line) continue;
    if (awaitingGloss) {
      if (!mono(line) || /^(?:Oxford|牛津)\s*[:：]|美式音标|美音\s*[:：]/i.test(line.slice(1, -1)))
        throw new Error(`用法 ${awaitingGloss} 下一行须是无来源或音标说明字的等宽融合词义`);
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
