import {selectedWordCount} from './chapter-size.mjs';
export function familyRecords(selection) {
  const count=selectedWordCount(selection);
  if(new Set(selection.mainWords.map(item=>item.entryId)).size!==count||new Set(selection.mainWords.map(item=>item.globalRank)).size!==count)throw new Error(`${count}主词存在重复VIX身份，不能用重复词条占推荐名额`);
  const values = [];
  for (const main of selection.mainWords) {
    values.push(main);
    for (const member of main.family || []) if (member.included !== false && member.entryId != null) values.push(member);
  }
  return values;
}
