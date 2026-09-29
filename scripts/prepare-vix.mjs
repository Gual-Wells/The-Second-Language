import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repo = 'Gual-Wells/IELTS-Vocabulary-Index-List';
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const headers = { accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', ...(token ? { authorization: `Bearer ${token}` } : {}) };
const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('用法: node scripts/prepare-vix.mjs YYYY-MM-DD');

async function getJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`GitHub 读取失败 ${response.status}: ${url}`);
  return response.json();
}

const branch = await getJson(`https://api.github.com/repos/${repo}/branches/main`);
const commit = branch.commit?.sha;
if (!/^[0-9a-f]{40}$/.test(commit || '')) throw new Error('VIX 当前 HEAD 无效');
const tree = await getJson(`https://api.github.com/repos/${repo}/git/trees/${commit}?recursive=1`);
if (tree.truncated) throw new Error('VIX 文件树被截断');
const files = tree.tree.filter(item => item.type === 'blob' &&
  (/^data\/seed5-runtime\//.test(item.path) || /^data\/seed-access\//.test(item.path) || /^textbook\/.*\.md$/.test(item.path) || item.path === 'tools/build-seed-access.mjs'));
const dest = path.resolve('.cache/vix', commit);
await mkdir(dest, { recursive: true });
let next = 0;
async function worker() {
  while (next < files.length) {
    const item = files[next++];
    if (item.path.split('/').some(part => part === '..' || part === '.' || !part)) throw new Error('VIX 文件路径无效');
    const url = `https://raw.githubusercontent.com/${repo}/${commit}/${item.path.split('/').map(encodeURIComponent).join('/')}`;
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`VIX 文件读取失败 ${response.status}: ${item.path}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const blob = createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
    if (blob !== item.sha) throw new Error(`VIX 文件 Git blob 摘要不匹配: ${item.path}`);
    const target = path.join(dest, ...item.path.split('/'));
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, bytes);
  }
}
await Promise.all(Array.from({ length: Math.min(4, files.length) }, worker));
const lock = { repository: repo, branch: 'main', commit, files: files.length, capturedAt: new Date().toISOString(), localDirectory: dest };
const runDir = path.resolve('work/runs', date);
await mkdir(runDir, { recursive: true });
await writeFile(path.join(runDir, 'vix-source.json'), JSON.stringify(lock, null, 2));
console.log(`VIX ${commit} 已固定并取得 ${files.length} 个相关文件: ${dest}`);
