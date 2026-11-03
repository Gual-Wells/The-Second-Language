import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {auxiliaryPath} from './vix-auxiliary.mjs';
export {familyRecords} from '../../protocol/vix-family.mjs';

export async function loadVixIndex(vixDir) {
  const base = path.join(vixDir, 'data/seed-access');
  const manifest = JSON.parse(await readFile(path.join(base, 'manifest.json'), 'utf8'));
  if (manifest.protocol !== 'vix-seed-access/2' || manifest.scope?.domainId !== 'domain_general_english' || manifest.scope?.section !== 'word') throw new Error('VIX 辅助索引版本或范围不符合预期');
  if (manifest.binding?.marks?.labelFormat !== 'YY-MM-DD' || manifest.binding.marks.externalDateMeaning !== true || manifest.binding.marks.yearBase !== 2000) throw new Error('VIX 索引尚未使用真实 YY-MM-DD 日期，请重新固定并获取最新索引');
  const fields = manifest.recordTuple;
  if(!Array.isArray(fields)||new Set(fields).size!==fields.length||['entryId','globalRank','text','markDates'].some(f=>!fields.includes(f)))throw Error('VIX 辅助索引 tuple 无效');
  const position = Object.fromEntries(fields.map((name, index) => [name, index]));
  const records = [];
  for (const shard of manifest.records) {
    if(!auxiliaryPath(shard.path)||!/^data\/seed-access\/records-\d{3,}\.json$/.test(shard.path))throw Error('VIX 记录路径超出允许的辅助索引');
    const rows = JSON.parse(await readFile(path.join(vixDir, shard.path), 'utf8'));
    for (const row of rows) records.push(Object.fromEntries(fields.map((name, i) => [name, row[i]])));
  }
  if (records.length !== manifest.scope.records || records.length !== manifest.counts.records) throw new Error('VIX 索引记录数不一致');
  const byRank = new Map(records.map(item => [item.globalRank, item]));
  const byEntryId = new Map(records.map(item => [item.entryId, item]));
  if (byRank.size !== records.length || byEntryId.size !== records.length) throw new Error('VIX 索引存在重复身份');
  return { manifest, records, byRank, byEntryId, position };
}
