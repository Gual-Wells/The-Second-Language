import {finishTaskBalances} from './check-balances.mjs';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { publisherConfig } from './lib/publisher-config.mjs';
import { validateAnnotatedContent } from '../web/annotations.js';

const options = Object.fromEntries(process.argv.slice(2).map(arg => {
  const match = /^--([a-z-]+)=(.*)$/.exec(arg);
  if (!match) throw new Error(`参数格式错误：${arg}`);
  return [match[1], match[2]];
}));
if (!options.page && !options.file) throw new Error('用法: node scripts/publish-temporary.mjs --page=work/reviews/ID/page.json；或 --file=已有文档.md --kind=test --id=ID --title=标题');
let page;
if (options.page) page = JSON.parse(await readFile(path.resolve(options.page), 'utf8'));
else page = { id: options.id, kind: options.kind, title: options.title, subtitle: options.subtitle || '', requestId: options['request-id'] || null, markdown: await readFile(path.resolve(options.file), 'utf8') };
if (page.requestId === undefined) page.requestId = null;
validateAnnotatedContent(page.markdown, { maxWordCount: page.kind === 'review' ? 40 : 200 });
const { base, token } = await publisherConfig();
const response = await fetch(new URL('/api/temporary', base), {
  method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(page)
});
const result = await response.json();
if (!response.ok) throw new Error(`临时页发布失败：${result.error || response.status}`);
const digest = createHash('sha256').update(page.markdown).digest('hex');
if (result.digest !== digest) throw new Error('临时页发布摘要与本地正文不一致');
console.log(`临时页已发布：${result.id}，${page.kind}，${new Date(result.expiresAt).toISOString()} 到期，摘要 ${result.digest}`);

await finishTaskBalances();
