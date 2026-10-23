import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadVixIndex } from './lib/vix-index.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(item => item.replace(/^--/, '').split(/=(.*)/s).slice(0, 2)));
if (!args.vix || !args.out) throw new Error('用法: node scripts/vix-candidates.mjs --vix=<VIX目录> --out=<输出文件>');
const { manifest, records } = await loadVixIndex(path.resolve(args.vix));
const readJson = async file => JSON.parse(await readFile(path.join(path.resolve(args.vix), file), 'utf8'));
const seed = manifest.source.inputs;
const meta = await readJson(seed.meta.path);
const sourceCollections = meta.collections.filter(item => item.domainId === 'domain_general_english' && item.type === 'normal' && !item.hidden);
const visible = new Set(sourceCollections.map(item => item.id));
const members = new Map();
for (const shard of seed.memberships) for (const item of await readJson(shard.path)) {
  if (!visible.has(item.collectionId)) continue;
  if (!members.has(item.entryId)) members.set(item.entryId, new Set());
  members.get(item.entryId).add(item.collectionId);
}
const sourceOrder = new Map(sourceCollections.sort((a,b) => a.order-b.order || a.name.localeCompare(b.name) || a.id.localeCompare(b.id)).map((item,i) => [item.id,i]));
const candidates = records.filter(item => item.markDates.length === 0).map(item => ({
  entryId: item.entryId, globalRank: item.globalRank, text: item.text,
  ownerCollectionId: item.collectionId, sourceOrder: item.sourceOrder,
  sourceCollectionIds: [...(members.get(item.entryId) || [])].sort((a,b) => sourceOrder.get(a)-sourceOrder.get(b))
}));
for (const item of candidates) if (!item.sourceCollectionIds.includes(item.ownerCollectionId)) throw new Error(`原始词表成员关系缺少唯一owner: ${item.text}`);
const counts = Object.fromEntries([...new Set(candidates.map(x => x.ownerCollectionId))].map(group => [group, candidates.filter(x => x.ownerCollectionId === group).length]));
const collections = sourceCollections.map(({ id, name, label }) => ({ id, name, label, candidateCount: counts[id] || 0 }));
const output = { vixSeedRevision: manifest.source.seedRevision, scope: manifest.scope,
  collectionMeaning: 'ownerCollectionId is priority-allocated unique ownership. sourceCollectionIds preserves original visible General-English memberships, including later advanced lists for earlier owners. Neither field assigns CEFR to senses; do not score by highest list, number of lists or index rank.',
  collections, counts, candidates };
await mkdir(path.dirname(path.resolve(args.out)), { recursive: true });
await writeFile(args.out, JSON.stringify(output));
console.log(`可选未标注词 ${candidates.length} 条，已写入 ${args.out}`);
