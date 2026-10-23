// Offline launcher/input contracts. Fixtures stay in this workspace's D-drive cache.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { prepareVix } from './prepare-vix.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureParent = path.join(projectRoot, '.cache/daily-affairs-checks');
await mkdir(fixtureParent, { recursive: true });
const root = await mkdtemp(path.join(fixtureParent, 'vix-'));
const relativeRoot = path.relative(fixtureParent, root);
assert.ok(relativeRoot && !relativeRoot.startsWith('..') && !path.isAbsolute(relativeRoot), 'Fixture cleanup stays within its explicit cache directory');
const date = '2099-01-01', originalCommit = 'a'.repeat(40), laterCommit = 'b'.repeat(40);
const bodies = new Map([
  ['data/seed-access/manifest.json', Buffer.from('{"fixture":"isolated input, not a course"}\n')],
  ['textbook/Collins.md', Buffer.from('Isolated textbook bytes for input recovery.\n')],
  ['tools/build-seed-access.mjs', Buffer.from('// Isolated build input; never executed.\n')]
]);
const blobSha = bytes => createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
const inputs = [...bodies].map(([name, bytes]) => ({ type: 'blob', path: name, sha: blobSha(bytes), size: bytes.length }));
const bySha = new Map(inputs.map(item => [item.sha, bodies.get(item.path)]));
const calls = [];
let remoteCommit = originalCommit, corruptDownload = true;
const originalFetch = globalThis.fetch;
const mockFetch = async target => {
  const url = new URL(target);
  calls.push(url.href);
  assert.equal(url.origin, 'https://api.github.com', 'No real service or fallback may be called by this fixture');
  if (url.pathname.endsWith('/branches/main')) return Response.json({ commit: { sha: remoteCommit } });
  if (url.pathname.endsWith(`/git/trees/${originalCommit}`)) return Response.json({ truncated: false, tree: inputs });
  const sha = url.pathname.match(/\/git\/blobs\/([a-f0-9]{40})$/)?.[1];
  assert.ok(bySha.has(sha), 'Only the original manifest blobs may be recovered');
  return Response.json({ encoding: 'base64', content: (corruptDownload ? Buffer.from('invalid bytes') : bySha.get(sha)).toString('base64') });
};
const options = { root, log: () => {} };
const runDir = path.join(root, 'work/runs', date), lockFile = path.join(runDir, 'vix-source.json');
try {
  globalThis.fetch = mockFetch;
  await assert.rejects(prepareVix(date, options), /摘要或大小不匹配/);
  const originalLockBytes = await readFile(lockFile, 'utf8'), lock = JSON.parse(originalLockBytes);
  assert.equal(lock.commit, originalCommit, 'A complete original manifest survives an interrupted download');
  assert.equal(lock.inputs.length, bodies.size);
  remoteCommit = laterCommit;
  corruptDownload = false;
  calls.length = 0;
  const resumed = await prepareVix(date, options);
  assert.equal(resumed.resumed, true);
  assert.equal(resumed.lock.commit, originalCommit);
  assert.ok(calls.length && calls.every(url => url.includes('/git/blobs/')), 'Recovery cannot consult the advanced mutable branch or rebuild a new tree');
  assert.equal(await readFile(lockFile, 'utf8'), originalLockBytes, 'Recovery never overwrites the input lock');

  calls.length = 0;
  globalThis.fetch = async () => { calls.push('unexpected'); throw new Error('Offline fixture'); };
  const offline = await prepareVix(date, options);
  assert.equal(offline.fetchedFiles, 0);
  assert.equal(offline.verified, bodies.size);
  assert.equal(calls.length, 0, 'A complete snapshot must validate with no network');

  const textbook = inputs.find(item => item.path.startsWith('textbook/'));
  await rm(path.join(lock.localDirectory, textbook.path));
  globalThis.fetch = mockFetch;
  const repaired = await prepareVix(date, options);
  assert.equal(repaired.fetchedFiles, 1);
  assert.deepEqual(calls, [`https://api.github.com/repos/Gual-Wells/IELTS-Vocabulary-Index-List/git/blobs/${textbook.sha}`]);
  assert.deepEqual(await readFile(path.join(lock.localDirectory, textbook.path)), bodies.get(textbook.path));

  calls.length = 0;
  const tool = inputs.find(item => item.path.startsWith('tools/'));
  await writeFile(path.join(lock.localDirectory, tool.path), 'corrupted fixture');
  await prepareVix(date, options);
  assert.deepEqual(calls, [`https://api.github.com/repos/Gual-Wells/IELTS-Vocabulary-Index-List/git/blobs/${tool.sha}`]);
  assert.equal(await readFile(lockFile, 'utf8'), originalLockBytes);

  calls.length = 0;
  const otherCached = path.join(root, '.cache/vix', laterCommit, textbook.path);
  await mkdir(path.dirname(otherCached), { recursive: true });
  await writeFile(otherCached, bodies.get(textbook.path));
  await rm(path.join(lock.localDirectory, textbook.path));
  globalThis.fetch = async () => { calls.push('unexpected'); throw new Error('Offline fixture'); };
  const reused = await prepareVix(date, options);
  assert.equal(reused.reusedFiles, 1);
  assert.equal(calls.length, 0, 'Identical verified blobs in another cache can restore the original input offline');

  const selectionFile = path.join(runDir, 'selection.json');
  await writeFile(selectionFile, JSON.stringify({ studyDate: date, vixInputCommit: originalCommit }));
  await prepareVix(date, options);
  await writeFile(selectionFile, JSON.stringify({ studyDate: date, vixInputCommit: laterCommit }));
  await assert.rejects(prepareVix(date, options), /selection 与 VIX 原输入 commit 不一致/);
  await rm(selectionFile);

  const missingDate = '2099-01-02', missingDir = path.join(root, 'work/runs', missingDate);
  await mkdir(missingDir, { recursive: true });
  await writeFile(path.join(missingDir, 'selection.json'), JSON.stringify({ studyDate: missingDate, vixInputCommit: originalCommit }));
  await assert.rejects(prepareVix(missingDate, options), /原输入锁缺失/);
  await rm(path.join(missingDir, 'selection.json'));
  await writeFile(path.join(missingDir, 'vix-publication.json'), 'null');
  await assert.rejects(prepareVix(missingDate, options), /原输入锁缺失/);
  assert.equal(calls.length, 0, 'A frozen run never initializes from a new HEAD');

  const tampered = structuredClone(lock);
  tampered.inputs[0].path = '../outside';
  await writeFile(lockFile, JSON.stringify(tampered));
  await assert.rejects(prepareVix(date, options), /路径无效/);
  await writeFile(lockFile, 'null');
  await assert.rejects(prepareVix(date, options), /原输入锁无效/);
  await writeFile(lockFile, originalLockBytes);
  await assert.rejects(prepareVix('2099-02-30', options), /真实日历日期/);
  assert.equal(calls.length, 0, 'Invalid input is rejected before any network or replacement');

  const launcherPath = path.join(projectRoot, 'scripts/run-daily.ps1');
  const feedbackPath=path.join(root,'work/runs',date,'feedback.json');
  const feedbackBytes=JSON.stringify({capturedAt:'2099-01-01T00:00:00.000Z',data:{fixture:'frozen feedback'}});
  await writeFile(feedbackPath,feedbackBytes);
  const feedbackArgs=[path.join(projectRoot,'scripts/feedback-snapshot.mjs'),date];
  const childOptions={cwd:root,encoding:'utf8',windowsHide:true,env:{...process.env,SECOND_LANGUAGE_API_URL:'http://127.0.0.1:1',SECOND_LANGUAGE_CREDENTIAL_FILE:path.join(root,'absent-private-credentials.json'),SECOND_LANGUAGE_PUBLISH_TOKEN:''}};
  const reusedFeedback=spawnSync(process.execPath,feedbackArgs,childOptions);
  assert.equal(reusedFeedback.status,0,'Existing feedback must be reusable without credentials or network');
  assert.equal(await readFile(feedbackPath,'utf8'),feedbackBytes,'A resumed feedback snapshot cannot be overwritten');
  await writeFile(feedbackPath,'null');
  assert.notEqual(spawnSync(process.execPath,feedbackArgs,childOptions).status,0,'Invalid feedback must remain unresolved, not refreshed');
  assert.equal(await readFile(feedbackPath,'utf8'),'null');
  const launcherBytes = await readFile(launcherPath), launcher = launcherBytes.toString('utf8');
  assert.deepEqual([...launcherBytes.subarray(0, 3)], [239, 187, 191], 'Windows PowerShell 5.1 must decode the Chinese prompt as UTF-8');
  assert.ok(launcher.indexOf('if ($control.rest)') < launcher.indexOf('$prompt ='), 'Rest is handled before the model and material preparation');
  assert.match(launcher, /-m gpt-6\.1-sol -c model_reasoning_effort=max/);
  for (const value of ['protocol/CURRENT_AFFAIRS.md', 'node scripts/prepare-vix.mjs $studyDate', 'node scripts/current-affairs.mjs discover $studyDate', 'current-affairs.mjs read', '不重抓热点', '旧章已经封存', '按服务端现行新章序列取得章号']) assert.ok(launcher.includes(value), `Launcher prompt must include ${value}`);
  if (process.platform === 'win32') {
    const psLiteral = launcherPath.replaceAll("'", "''");
    const parse = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', `$tokens=$null;$errors=$null;$ast=[System.Management.Automation.Language.Parser]::ParseFile('${psLiteral}',[ref]$tokens,[ref]$errors);if($errors.Count){exit 1};$promptNode=$ast.Find({param($n) $n -is [System.Management.Automation.Language.ExpandableStringExpressionAst] -and $n.Value.Contains('CURRENT_AFFAIRS.md')},$true);if(-not $promptNode -or -not $promptNode.Value.Contains('旧章已经封存')){exit 2}`], { encoding: 'utf8' });
    assert.equal(parse.status, 0, `Windows PowerShell launcher syntax/Unicode failed: ${parse.stderr}`);
  }
  console.log('Daily affairs contracts passed: immutable input recovery, offline reuse, frozen selection guards, launcher rest ordering and Windows PowerShell prompt. No production calls or task changes.');
} finally {
  globalThis.fetch = originalFetch;
  // root was resolved and checked against fixtureParent before any recursive cleanup.
  await rm(root, { recursive: true, force: true });
}
