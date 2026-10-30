import { createHash, randomUUID } from 'node:crypto';
import { link, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { vixDateLabel } from './lib/vix-date.mjs';
import {CONTEXT_AUTHORING_POLICY} from '../protocol/usage-context.mjs';

const repo = 'Gual-Wells/IELTS-Vocabulary-Index-List';
const LOCK_PROTOCOL = 'second-language-vix-inputs/1';
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const headers = { accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', ...(token ? { authorization: `Bearer ${token}` } : {}) };
const CHUNK = 1024 * 1024;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const gitBlobSha = bytes => createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
const wanted = value => /^data\/seed5-runtime\//.test(value) || /^data\/seed-access\//.test(value) || /^textbook\/.*\.md$/.test(value) || value === 'textbook/Etymology_Sources.json' || value === 'tools/build-seed-access.mjs';

async function readJson(filename) {
  try { return JSON.parse(await readFile(filename, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return undefined; throw error; }
}

function validateInputs(inputs) {
  if (!Array.isArray(inputs) || !inputs.length) throw new Error('VIX 原输入锁缺少可核验 inputs；不得刷新 main 或迁移旧运行');
  const names = new Set();
  for (const item of inputs) {
    if (!item || typeof item.path !== 'string' || item.path.includes('\\') || item.path.split('/').some(part => !part || part === '.' || part === '..') || !wanted(item.path) || !/^[0-9a-f]{40}$/.test(item.sha || '') || !Number.isSafeInteger(item.size) || item.size < 0 || names.has(item.path)) throw new Error('VIX 原输入锁的文件身份、大小或路径无效');
    names.add(item.path);
  }
  if (!names.has('data/seed-access/manifest.json') || !names.has('tools/build-seed-access.mjs') || !inputs.some(item => /^textbook\/.*\.md$/.test(item.path))) throw new Error('VIX 原输入锁缺少索引、教材或构建脚本');
}

function validateLock(lock, root, date) {
  if (!lock || lock.protocol !== LOCK_PROTOCOL || lock.repository !== repo || lock.branch !== 'main' || lock.studyDate !== date || !/^[0-9a-f]{40}$/.test(lock.commit || '') || !Number.isFinite(Date.parse(lock.capturedAt))) throw new Error('VIX 原输入锁无效；不得覆盖锁或重新获取 main');
  validateInputs(lock.inputs);
  if(lock.authoringPolicy!=null&&![CONTEXT_AUTHORING_POLICY,'sourced-collection-v1'].includes(lock.authoringPolicy))throw new Error('VIX输入锁制作协议无效');
  if(lock.teachingLayoutVersion!=null&&lock.teachingLayoutVersion!==2)throw new Error('VIX输入锁正文层级版本无效');
  if(lock.quickGlossVersion!=null&&lock.quickGlossVersion!==1)throw new Error('VIX输入锁用法快释版本无效');
  const dest = path.resolve(root, '.cache/vix', lock.commit);
  if (lock.files !== lock.inputs.length || typeof lock.localDirectory !== 'string' || path.resolve(lock.localDirectory) !== dest) throw new Error('VIX 原输入锁的文件数或缓存目录不一致');
  return dest;
}

async function getJson(url) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`GitHub 读取失败 ${response.status}: ${url}`);
  return response.json();
}

async function rangeBytes(url, start, end, total) {
  let lastError;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await fetch(url, { headers: { ...headers, range: `bytes=${start}-${end}` }, signal: AbortSignal.timeout(30_000) });
      if (response.status !== 206 || response.headers.get('content-range') !== `bytes ${start}-${end}/${total}`) throw new Error(`GitHub 分段响应无效: HTTP ${response.status}, ${response.headers.get('content-range')}`);
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

async function installLock(filename, value) {
  const temporary = `${filename}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
    try { await link(temporary, filename); }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
  } finally { await rm(temporary, { force: true }); }
  return readJson(filename);
}

async function writeVerifiedFile(filename, bytes) {
  await mkdir(path.dirname(filename), { recursive: true });
  const temporary = `${filename}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, bytes, { flag: 'wx' });
    await rename(temporary, filename);
  } finally { await rm(temporary, { force: true }); }
}

export async function prepareVix(date, { root = process.cwd(), log = console.log } = {}) {
  vixDateLabel(date);
  root = path.resolve(root);
  const runDir = path.join(root, 'work/runs', date);
  const lockFile = path.join(runDir, 'vix-source.json');
  let lock = await readJson(lockFile);
  const resumed = lock !== undefined;
  const selection = await readJson(path.join(runDir, 'selection.json'));
  if (selection !== undefined && (!selection || typeof selection !== 'object' || Array.isArray(selection) || selection.studyDate !== date)) throw new Error('已有 selection 身份无效；不得刷新输入或重选');
  if (lock === undefined) {
    if (selection !== undefined || await readJson(path.join(runDir, 'vix-publication.json')) !== undefined) throw new Error('本次选词已固定或已标 VIX，但原输入锁缺失；请恢复原输入，不重新选词或获取 main');
    const branch = await getJson(`https://api.github.com/repos/${repo}/branches/main`);
    const commit = branch.commit?.sha;
    if (!/^[0-9a-f]{40}$/.test(commit || '')) throw new Error('VIX 当前 HEAD 无效');
    const tree = await getJson(`https://api.github.com/repos/${repo}/git/trees/${commit}?recursive=1`);
    if (tree.truncated || !Array.isArray(tree.tree)) throw new Error('VIX 文件树被截断或无效');
    const inputs = tree.tree.filter(item => item.type === 'blob' && wanted(item.path)).map(({ path, sha, size }) => ({ path, sha, size })).sort((a, b) => a.path.localeCompare(b.path, 'en'));
    validateInputs(inputs);
    await mkdir(runDir, { recursive: true });
    // Publish the complete manifest before downloading. A competing start cannot overwrite it.
    lock = await installLock(lockFile, { protocol: LOCK_PROTOCOL, repository: repo, branch: 'main', studyDate: date, authoringPolicy:CONTEXT_AUTHORING_POLICY, teachingLayoutVersion:2, quickGlossVersion:1, commit, files: inputs.length, capturedAt: new Date().toISOString(), localDirectory: path.join(root, '.cache/vix', commit), inputs });
  }
  const dest = validateLock(lock, root, date);
  if (selection !== undefined && selection.vixInputCommit !== lock.commit) throw new Error('已固定 selection 与 VIX 原输入 commit 不一致；不得刷新输入或重选');
  if(selection!==undefined&&lock.authoringPolicy===CONTEXT_AUTHORING_POLICY&&selection.authoringPolicy!==CONTEXT_AUTHORING_POLICY)throw new Error('新输入已固定真实语境策略，冻结选择不得退回旧制作合同');
  await mkdir(dest, { recursive: true });
  const cacheRoot = path.join(root, '.cache/vix');
  const cachedCommits = (await readdir(cacheRoot, { withFileTypes: true })).filter(item => item.isDirectory() && /^[0-9a-f]{40}$/.test(item.name) && item.name !== lock.commit).map(item => item.name);
  let verified = 0, reusedFiles = 0, fetchedFiles = 0;
  // Each file is installed atomically; interruption leaves the original lock recoverable.
  for (const item of lock.inputs) {
    const target = path.join(dest, ...item.path.split('/'));
    try {
      const bytes = await readFile(target);
      if (bytes.length === item.size && gitBlobSha(bytes) === item.sha) { verified++; continue; }
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    let bytes;
    for (const oldCommit of cachedCommits) {
      try {
        const candidate = await readFile(path.join(cacheRoot, oldCommit, ...item.path.split('/')));
        if (candidate.length !== item.size || gitBlobSha(candidate) !== item.sha) continue;
        bytes = candidate; reusedFiles++; break;
      } catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
    if (!bytes) {
      const url = `https://raw.githubusercontent.com/${repo}/${lock.commit}/${item.path.split('/').map(encodeURIComponent).join('/')}`;
      try {
        const blob = await getJson(`https://api.github.com/repos/${repo}/git/blobs/${item.sha}`);
        if (blob.encoding !== 'base64' || typeof blob.content !== 'string') throw new Error('GitHub blob 响应无效');
        bytes = Buffer.from(blob.content.replace(/\s/g, ''), 'base64');
      } catch (apiError) {
        const chunks = [];
        for (let start = 0; start < item.size; start += CHUNK) chunks.push(await rangeBytes(url, start, Math.min(start + CHUNK, item.size) - 1, item.size));
        bytes = Buffer.concat(chunks);
      }
      fetchedFiles++;
    }
    if (bytes.length !== item.size || gitBlobSha(bytes) !== item.sha) throw new Error(`VIX 文件 Git blob 摘要或大小不匹配: ${item.path}`);
    await writeVerifiedFile(target, bytes);
    verified++;
  }
  log(`VIX ${lock.commit} ${resumed ? '原输入已恢复并校验' : '已固定并校验'} ${verified} 个文件；复用 ${reusedFiles}，获取 ${fetchedFiles}。原输入锁未覆盖：${lockFile}`);
  return { lock, resumed, verified, reusedFiles, fetchedFiles };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  if (process.argv.length !== 3) throw new Error('用法: node scripts/prepare-vix.mjs YYYY-MM-DD');
  await prepareVix(process.argv[2]);
}
