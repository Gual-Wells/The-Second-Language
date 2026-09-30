import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function loadVixIndex(vixDir) {
  const base = path.join(vixDir, 'data/seed-access');
  const manifest = JSON.parse(await readFile(path.join(base, 'manifest.json'), 'utf8'));
  if (manifest.protocol !== 'vix-seed-access/2' || manifest.scope?.domainId !== 'domain_general_english' || manifest.scope?.section !== 'word') throw new Error('VIX 辅助索引版本或范围不符合预期');
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
  if (!Array.isArray(selection.mainWords) || selection.mainWords.length !== 40) throw new Error('最终推荐必须恰有 40 个主词');
  const values = [];
  for (const main of selection.mainWords) {
    values.push(main);
    for (const member of main.family || []) if (member.included !== false && member.entryId != null) values.push(member);
  }
  return values;
}
