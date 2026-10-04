import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { loadVixIndex, familyRecords } from './lib/vix-index.mjs';
import { validateVixDate } from './lib/vix-date.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(item => item.replace(/^--/, '').split(/=(.*)/s).slice(0, 2)));
if (!args.vix || !args.selection) throw new Error('用法: node scripts/mark-vix.mjs --vix=<VIX目录> --selection=<selection.json>');
const vixDir = path.resolve(args.vix), selection = JSON.parse(await readFile(args.selection, 'utf8'));
const label = validateVixDate(selection);
const index = await loadVixIndex(vixDir);
const chosen = familyRecords(selection), unique = new Map();
for (const item of chosen) {
  const actual = index.byRank.get(item.globalRank);
  if (!actual || actual.entryId !== item.entryId || actual.text !== item.text) throw new Error(`VIX rank 与词条身份已变化: ${item.text}`);
  unique.set(item.globalRank, actual);
}
const file = path.join(vixDir, 'data/seed-access/dates', `${label}.json`);
let date;
try { date = JSON.parse(await readFile(file, 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; date = { protocol: 'vix-seed-access-date/1', schemaVersion: 1, date: label, globalRanks: [] }; }
if (date.protocol !== 'vix-seed-access-date/1' || date.date !== label || !Array.isArray(date.globalRanks)) throw new Error('原日期标注文件无效');
date.globalRanks = [...new Set([...date.globalRanks, ...unique.keys()])].sort((a, b) => a - b);
await writeFile(file, JSON.stringify(date) + '\n');
const result = spawnSync(process.execPath, ['tools/build-seed-access.mjs'], { cwd: vixDir, encoding: 'utf8' });
if (result.status !== 0) throw new Error(`VIX 构建失败:\n${result.stderr || result.stdout}`);
console.log(`已向 ${label} 写入 ${unique.size} 个本次建设的 VIX 词条；请检查差异并提交 VIX 日期及派生索引。`);
