import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
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

const CHUNK = 1024 * 1024;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const gitBlobSha = bytes => createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');

async function rangeBytes(url, start, end, total) {
  let lastError;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await fetch(url, { headers: { ...headers, range: `bytes=${start}-${end}` }, signal: AbortSignal.timeout(30_000) });
      if (response.status !== 206 || response.headers.get('content-range') !== `bytes ${start}-${end}/${total}`) {
        throw new Error(`GitHub 分段响应无效: HTTP ${response.status}, ${response.headers.get('content-range')}`);
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length !== end - start + 1) throw new Error('GitHub 分段长度不符');
      return bytes;
    } catch (error) {
      lastError = error;
      if (attempt < 4) await pause(500 * 2 ** attempt);
    }
  }
  throw lastError;
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
    const target = path.join(dest, ...item.path.split('/'));
    try { if (gitBlobSha(await readFile(target)) === item.sha) continue; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    const url = `https://raw.githubusercontent.com/${repo}/${commit}/${item.path.split('/').map(encodeURIComponent).join('/')}`;
    const chunks = [];
    for (let start = 0; start < item.size; start += CHUNK) chunks.push(await rangeBytes(url, start, Math.min(start + CHUNK, item.size) - 1, item.size));
    const bytes = Buffer.concat(chunks);
    const blob = gitBlobSha(bytes);
    if (blob !== item.sha) throw new Error(`VIX 文件 Git blob 摘要不匹配: ${item.path}`);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, bytes);
    console.log(`已验证 ${item.path}`);
  }
}
await Promise.all(Array.from({ length: Math.min(4, files.length) }, worker));
const lock = { repository: repo, branch: 'main', commit, files: files.length, capturedAt: new Date().toISOString(), localDirectory: dest };
const runDir = path.resolve('work/runs', date);
await mkdir(runDir, { recursive: true });
await writeFile(path.join(runDir, 'vix-source.json'), JSON.stringify(lock, null, 2));
console.log(`VIX ${commit} 已固定并取得 ${files.length} 个相关文件: ${dest}`);
