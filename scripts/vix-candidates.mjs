import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadVixIndex } from './lib/vix-index.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(item => item.replace(/^--/, '').split(/=(.*)/s).slice(0, 2)));
if (!args.vix || !args.out) throw new Error('用法: node scripts/vix-candidates.mjs --vix=<VIX目录> --out=<输出文件>');
const { manifest, records } = await loadVixIndex(path.resolve(args.vix));
const candidates = records.filter(item => item.markDates.length === 0).map(item => ({
  entryId: item.entryId, globalRank: item.globalRank, text: item.text,
  ownerCollectionId: item.collectionId, sourceOrder: item.sourceOrder
}));
const counts = Object.fromEntries([...new Set(candidates.map(x => x.ownerCollectionId))].map(group => [group, candidates.filter(x => x.ownerCollectionId === group).length]));
const output = { vixSeedRevision: manifest.source.seedRevision, scope: manifest.scope, counts, candidates };
await mkdir(path.dirname(path.resolve(args.out)), { recursive: true });
await writeFile(args.out, JSON.stringify(output));
console.log(`可选未标注词 ${candidates.length} 条，已写入 ${args.out}`);
