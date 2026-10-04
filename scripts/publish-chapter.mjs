import {finishTaskBalances} from './check-balances.mjs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { publisherConfig } from './lib/publisher-config.mjs';
const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('用法: node scripts/publish-chapter.mjs YYYY-MM-DD');
const { base, token } = await publisherConfig();
const folder = path.resolve('chapters', date);
const chapter = JSON.parse(await readFile(path.join(folder, 'chapter.json'), 'utf8'));
const meta = JSON.parse(await readFile(path.join(folder, 'meta.json'), 'utf8'));
if (!/^[0-9a-f]{40}$/.test(meta.vixCommit || '') || !/^[0-9a-f]{40}$/.test(meta.protocolCommit || '')) throw new Error('缺少已提交的 VIX 或课程协议 commit');
const runId = meta.runId || date;
async function post(route, body) {
  const response = await fetch(new URL(route, base), { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const payload = await response.json(); if (!response.ok) throw new Error(`${route}: ${payload.error || response.status}`); return payload;
}
const staged = await post('/api/publish/stage', { ...chapter, runId, vixCommit: meta.vixCommit, protocolCommit: meta.protocolCommit });
if (staged.digest !== chapter.digest) throw new Error('后端暂存摘要与本地章节不一致');
const published = await post('/api/publish/commit', { runId, digest: staged.digest });
if (published.digest !== chapter.digest) throw new Error('后端发布摘要不一致');
console.log(`已发布 ${date}，章节 ${published.id}，摘要 ${published.digest}`);

await finishTaskBalances();
