import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { loadVixIndex, familyRecords } from './lib/vix-index.mjs';

const args = Object.fromEntries(process.argv.slice(2).map(item => item.replace(/^--/, '').split(/=(.*)/s).slice(0, 2)));
if (!args.vix || !args.selection) throw new Error('用法: node scripts/publish-vix.mjs --vix=<VIX目录> --selection=<selection.json>');
function gitCredentialToken() {
  const result = spawnSync('git', ['credential', 'fill'], { input: 'protocol=https\nhost=github.com\n\n', encoding: 'utf8', timeout: 10000 });
  if (result.status !== 0) return null;
  return result.stdout.split(/\r?\n/).find(line => line.startsWith('password='))?.slice('password='.length) || null;
}
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || gitCredentialToken();
if (!token) throw new Error('缺少 GITHUB_TOKEN、GH_TOKEN 或 GitHub Git 凭据');
const root = path.resolve(args.vix), selection = JSON.parse(await readFile(args.selection, 'utf8'));
if (!/^[0-9a-f]{40}$/.test(selection.vixInputCommit || '')) throw new Error('selection 缺少 VIX 输入 commit');
const index = await loadVixIndex(root);
for (const item of familyRecords(selection)) {
  const actual = index.byRank.get(item.globalRank);
  if (!actual || actual.entryId !== item.entryId || actual.text !== item.text || !actual.markDates.includes(selection.vixMarkLabel)) throw new Error(`VIX 标注尚未生成或身份不匹配: ${item.text}`);
}
const check = spawnSync(process.execPath, ['tools/build-seed-access.mjs', '--check'], { cwd: root, encoding: 'utf8' });
if (check.status !== 0) throw new Error(`VIX 索引校验失败:\n${check.stderr || check.stdout}`);
const repo = 'Gual-Wells/IELTS-Vocabulary-Index-List', base = `https://api.github.com/repos/${repo}`;
const headers = { accept: 'application/vnd.github+json', authorization: `Bearer ${token}`, 'content-type': 'application/json', 'x-github-api-version': '2022-11-28' };
async function api(url, method = 'GET', body) {
  const response = await fetch(url, { method, headers, body: body == null ? undefined : JSON.stringify(body) });
  const result = await response.json();
  if (!response.ok) throw new Error(`GitHub ${method} ${url}: ${response.status} ${result.message || ''}`);
  return result;
}
const branch = await api(`${base}/branches/main`);
if (branch.commit.sha !== selection.vixInputCommit) throw new Error('VIX main 已变化；请重新核对索引和本次选择');
const parent = await api(`${base}/git/commits/${branch.commit.sha}`);
const paths = [
  `data/seed-access/dates/${selection.vixMarkLabel}.json`,
  'data/seed-access/manifest.json', 'data/seed-access/mark-hash.json', 'data/seed-access/structure.json',
  ...index.manifest.records.map(item => item.path)
];
const elements = [];
for (const file of paths) {
  const bytes = await readFile(path.join(root, ...file.split('/')));
  const blob = await api(`${base}/git/blobs`, 'POST', { content: bytes.toString('base64'), encoding: 'base64' });
  elements.push({ path: file, mode: '100644', type: 'blob', sha: blob.sha });
}
const tree = await api(`${base}/git/trees`, 'POST', { base_tree: parent.tree.sha, tree: elements });
const commit = await api(`${base}/git/commits`, 'POST', { message: `Mark Second Language ${selection.studyDate} vocabulary`, tree: tree.sha, parents: [branch.commit.sha] });
await api(`${base}/git/refs/heads/main`, 'PATCH', { sha: commit.sha, force: false });
console.log(JSON.stringify({ vixCommit: commit.sha, markedRecords: new Set(familyRecords(selection).map(item => item.globalRank)).size }));
