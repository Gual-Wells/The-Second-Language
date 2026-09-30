import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { publisherConfig } from './lib/publisher-config.mjs';

const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('用法: node scripts/claim-run.mjs YYYY-MM-DD');
const { base, token } = await publisherConfig();
const response = await fetch(new URL('/api/runs/claim', base), {
  method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
  body: JSON.stringify({ runId: date, date })
});
const result = await response.json();
if (!response.ok) throw new Error(`领取每日运行失败：${result.error || response.status}`);
const folder = path.resolve('work/runs', date);
await mkdir(folder, { recursive: true });
await writeFile(path.join(folder, 'control.json'), JSON.stringify(result, null, 2));
console.log(result.rest ? `${date} 已领取休息：不建设、不标记 VIX、不发布日课；休息按钮已复位。` : `${date} 已领取日课；临时需求：${result.temporaryRequest?.text || '无'}`);
