import {DAILY_WORD_COUNT} from '../web/annotations.js';
export function familyRecords(selection) {
  if (!Array.isArray(selection.mainWords) || selection.mainWords.length !== DAILY_WORD_COUNT) throw new Error(`最终推荐必须恰有 ${DAILY_WORD_COUNT} 个主词`);
  if(new Set(selection.mainWords.map(item=>item.entryId)).size!==DAILY_WORD_COUNT||new Set(selection.mainWords.map(item=>item.globalRank)).size!==DAILY_WORD_COUNT)throw new Error(`${DAILY_WORD_COUNT}主词存在重复VIX身份，不能用重复词条占推荐名额`);
  const values = [];
  for (const main of selection.mainWords) {
    values.push(main);
    for (const member of main.family || []) if (member.included !== false && member.entryId != null) values.push(member);
  }
  return values;
}
