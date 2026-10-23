import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {DAILY_WORD_COUNT} from '../../web/annotations.js';

export async function loadVixIndex(vixDir) {
  const base = path.join(vixDir, 'data/seed-access');
  const manifest = JSON.parse(await readFile(path.join(base, 'manifest.json'), 'utf8'));
  if (manifest.protocol !== 'vix-seed-access/2' || manifest.scope?.domainId !== 'domain_general_english' || manifest.scope?.section !== 'word') throw new Error('VIX 辅助索引版本或范围不符合预期');
  if (manifest.binding?.marks?.labelFormat !== 'YY-MM-DD' || manifest.binding.marks.externalDateMeaning !== true || manifest.binding.marks.yearBase !== 2000) throw new Error('VIX 索引尚未使用真实 YY-MM-DD 日期，请重新固定并获取最新索引');
  const fields = manifest.recordTuple;
  const position = Object.fromEntries(fields.map((name, index) => [name, index]));
  const records = [];
  for (const shard of manifest.records) {
    const rows = JSON.parse(await readFile(path.join(vixDir, shard.path), 'utf8'));
    for (const row of rows) records.push(Object.fromEntries(fields.map((name, i) => [name, row[i]])));
  }
  if (records.length !== manifest.scope.records || records.length !== manifest.counts.records) throw new Error('VIX 索引记录数不一致');
  const byRank = new Map(records.map(item => [item.globalRank, item]));
  const byEntryId = new Map(records.map(item => [item.entryId, item]));
  if (byRank.size !== records.length || byEntryId.size !== records.length) throw new Error('VIX 索引存在重复身份');
  return { manifest, records, byRank, byEntryId, position };
}

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
