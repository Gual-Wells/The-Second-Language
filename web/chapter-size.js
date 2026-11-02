// A frozen run keeps its original size. Only new input locks adopt this policy.
export const CHAPTER_SIZE_POLICY = 'thirty-main-words-v1';
export const DAILY_WORD_COUNT = 30;
export const LEGACY_DAILY_WORD_COUNT = 50;
export const WORDS_PER_TASK = 10;

export function chapterSizePolicy(selection, inputLock) {
  const policy = selection?.chapterSizePolicy ?? null;
  if (policy !== null && policy !== CHAPTER_SIZE_POLICY) throw Error('未知章节词数合同');
  if (inputLock !== undefined) {
    const locked = inputLock?.chapterSizePolicy ?? null;
    if (locked !== null && locked !== CHAPTER_SIZE_POLICY) throw Error('未知章节词数输入合同');
    if (policy !== locked) throw Error('章节词数合同与冻结输入不一致；不能补写或删除旧合同');
  }
  return policy;
}

export function frozenWordCount(record) {
  return chapterSizePolicy(record) ? DAILY_WORD_COUNT : LEGACY_DAILY_WORD_COUNT;
}

export function selectedWordCount(selection, inputLock) {
  chapterSizePolicy(selection, inputLock);
  const count = frozenWordCount(selection);
  if (!Array.isArray(selection?.mainWords) || selection.mainWords.length !== count) throw Error(`最终推荐必须恰有 ${count} 个主词，与冻结章节词数合同一致`);
  return count;
}

export function formalChapterWordCount(value) {
  const count = frozenWordCount(value);
  if (value?.wordCount !== count) throw Error(`正式章节须有 ${count} 个主词，与固定词数合同一致`);
  return count;
}
