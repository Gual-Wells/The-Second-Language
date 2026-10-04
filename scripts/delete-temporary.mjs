import {finishTaskBalances} from './check-balances.mjs';
import { publisherConfig } from './lib/publisher-config.mjs';

const id = process.argv[2];
if (!/^[A-Za-z0-9._:-]{1,110}$/.test(id || '')) throw new Error('用法: node scripts/delete-temporary.mjs 临时页ID');
const { base, token } = await publisherConfig();
const response = await fetch(new URL(`/api/temporary/${encodeURIComponent(id)}`, base), {
  method: 'DELETE', headers: { authorization: `Bearer ${token}` }
});
const result = await response.json();
if (!response.ok) throw new Error(result.error || `删除失败：HTTP ${response.status}`);
console.log(result.deleted ? `已删除临时页 ${id}` : `临时页 ${id} 已不存在`);

await finishTaskBalances();
