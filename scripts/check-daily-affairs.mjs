// Offline launcher/input contracts. Fixtures stay in this workspace's D-drive cache.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { prepareVix } from './prepare-vix.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureParent = path.join(projectRoot, '.cache/daily-affairs-checks');
await mkdir(fixtureParent, { recursive: true });
const root = await mkdtemp(path.join(fixtureParent, 'vix-'));
const relativeRoot = path.relative(fixtureParent, root);
assert.ok(relativeRoot && !relativeRoot.startsWith('..') && !path.isAbsolute(relativeRoot), 'Fixture cleanup stays within its explicit cache directory');
const date = '2099-01-01', originalCommit = 'a'.repeat(40), laterCommit = 'b'.repeat(40);
const authoringPolicy = 'authentic-context-v1';
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
  assert.equal(lock.authoringPolicy, authoringPolicy, 'A new input fixes the new authoring contract before selection');
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
  await writeFile(selectionFile, JSON.stringify({ studyDate: date, vixInputCommit: originalCommit, authoringPolicy }));
  await prepareVix(date, options);
  for (const downgraded of [undefined, 'sourced-collection-v1']) {
    const frozen = JSON.stringify({ studyDate: date, vixInputCommit: originalCommit, ...(downgraded ? { authoringPolicy: downgraded } : {}) });
    await writeFile(selectionFile, frozen);
    await assert.rejects(prepareVix(date, options), /冻结选择不得退回旧制作合同/);
    assert.equal(await readFile(selectionFile, 'utf8'), frozen, 'A rejected downgrade is not silently migrated');
    assert.equal(await readFile(lockFile, 'utf8'), originalLockBytes);
  }
  await writeFile(selectionFile, JSON.stringify({ studyDate: date, vixInputCommit: laterCommit, authoringPolicy }));
  await assert.rejects(prepareVix(date, options), /selection 与 VIX 原输入 commit 不一致/);
  await rm(selectionFile);

  const legacyDate = '2099-01-03', legacyDir = path.join(root, 'work/runs', legacyDate);
  await mkdir(legacyDir, { recursive: true });
  const legacyLockFile = path.join(legacyDir, 'vix-source.json'), legacySelectionFile = path.join(legacyDir, 'selection.json');
  const legacyLock = { ...lock, studyDate: legacyDate };
  delete legacyLock.authoringPolicy;
  for (const legacyPolicy of [undefined, 'sourced-collection-v1']) {
    const frozen = JSON.stringify({ studyDate: legacyDate, vixInputCommit: originalCommit, ...(legacyPolicy ? { authoringPolicy: legacyPolicy } : {}) });
    const frozenLock = JSON.stringify({ ...legacyLock, ...(legacyPolicy ? { authoringPolicy: legacyPolicy } : {}) });
    await writeFile(legacySelectionFile, frozen);
    await writeFile(legacyLockFile, frozenLock);
    const replay = await prepareVix(legacyDate, options);
    assert.equal(replay.resumed, true);
    assert.equal(replay.fetchedFiles, 0);
    assert.equal(await readFile(legacySelectionFile, 'utf8'), frozen, 'Old frozen selection retains its original contract and bytes');
    assert.equal(await readFile(legacyLockFile, 'utf8'), frozenLock, 'Old input locks are neither upgraded nor overwritten');
  }
  assert.equal(calls.length, 0, 'Old frozen replay cannot query the current branch or replace old inputs');

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
  const baselineBytes = await readFile(path.join(projectRoot, 'protocol/learner-baseline.json'));
  const baseline = JSON.parse(baselineBytes.toString('utf8'));
  const fixtureData = {fixture: 'new isolated feedback',goals: ['Self-authored transport fixture; no real learner measurement.']};
  const fetchLog = path.join(root, 'feedback-fetch.log'), preload = path.join(root, 'feedback-fetch-fixture.mjs');
  await writeFile(preload, `import {appendFileSync} from 'node:fs';
globalThis.fetch = async (target, options) => {
  appendFileSync(process.env.SECOND_LANGUAGE_FIXTURE_FETCH_LOG, 'fixture-fetch\\n');
  if (process.env.SECOND_LANGUAGE_FIXTURE_FORBID_FETCH === '1') throw Error('Frozen feedback fixture forbids all fetch calls');
  if (String(target) !== 'https://daily-feedback-fixture.invalid/api/feedback-snapshot' || options?.headers?.authorization !== 'Bearer isolated-feedback-fixture-token') throw Error('Unexpected request in isolated feedback fixture');
  return Response.json(${JSON.stringify(fixtureData)});
};\n`);
  const feedbackCLI = ['--import', pathToFileURL(preload).href, path.join(projectRoot, 'scripts/feedback-snapshot.mjs')];
  const freshDate = '2099-01-04', freshFeedbackPath = path.join(root, 'work/runs', freshDate, 'feedback.json');
  const freshOptions = {cwd: root, encoding: 'utf8', windowsHide: true, env: {...process.env, SECOND_LANGUAGE_API_URL: 'https://daily-feedback-fixture.invalid/', SECOND_LANGUAGE_PUBLISH_TOKEN: 'isolated-feedback-fixture-token', SECOND_LANGUAGE_FIXTURE_FETCH_LOG: fetchLog, SECOND_LANGUAGE_FIXTURE_FORBID_FETCH: '0'}};
  const createdFeedback = spawnSync(process.execPath, [...feedbackCLI, freshDate], freshOptions);
  assert.equal(createdFeedback.status, 0, `Actual feedback CLI must create its isolated snapshot: ${createdFeedback.stderr}`);
  const freshFeedbackBytes = await readFile(freshFeedbackPath, 'utf8'), freshFeedback = JSON.parse(freshFeedbackBytes);
  assert.deepEqual(freshFeedback.data, fixtureData);
  // This proves lossless delivery of the current selection guidance (including
  // levelMeaning), not that its prose or the eventual word selection is sound.
  assert.deepEqual(freshFeedback.learnerBaseline, baseline, 'The current complete prior, not an older or shortened copy, enters a new snapshot');
  assert.equal(freshFeedback.learnerBaselineDigest, createHash('sha256').update(baselineBytes).digest('hex'), 'The prior digest binds the actual authoritative bytes');
  const forbiddenOptions = {...freshOptions, env: {...freshOptions.env, SECOND_LANGUAGE_FIXTURE_FORBID_FETCH: '1'}};
  assert.equal(spawnSync(process.execPath, [...feedbackCLI, freshDate], forbiddenOptions).status, 0, 'A completed new snapshot replays without another request');
  assert.equal(await readFile(freshFeedbackPath, 'utf8'), freshFeedbackBytes, 'New snapshots also remain byte-for-byte immutable on resume');
  const feedbackPath=path.join(root,'work/runs',date,'feedback.json');
  const feedbackBytes=JSON.stringify({capturedAt:'2099-01-01T00:00:00.000Z',data:{fixture:'frozen feedback'}});
  await writeFile(feedbackPath,feedbackBytes);
  const feedbackArgs=[...feedbackCLI,date];
  const childOptions={cwd:root,encoding:'utf8',windowsHide:true,env:{...forbiddenOptions.env,SECOND_LANGUAGE_CREDENTIAL_FILE:path.join(root,'absent-private-credentials.json'),SECOND_LANGUAGE_PUBLISH_TOKEN:''}};
  const reusedFeedback=spawnSync(process.execPath,feedbackArgs,childOptions);
  assert.equal(reusedFeedback.status,0,'Existing feedback must be reusable without credentials or network');
  assert.equal(await readFile(feedbackPath,'utf8'),feedbackBytes,'A resumed feedback snapshot cannot be overwritten');
  await writeFile(feedbackPath,'null');
  assert.notEqual(spawnSync(process.execPath,feedbackArgs,childOptions).status,0,'Invalid feedback must remain unresolved, not refreshed');
  assert.equal(await readFile(feedbackPath,'utf8'),'null');
  assert.equal(await readFile(fetchLog, 'utf8'), 'fixture-fetch\n', 'Only the initial injected response is requested; new/old replay and invalid old snapshots do not fetch');
  const launcherBytes = await readFile(launcherPath), launcher = launcherBytes.toString('utf8');
  const templatePath = path.join(projectRoot, 'protocol/daily-prompt.txt');
  const template = await readFile(templatePath, 'utf8');
  const dailyProtocol = await readFile(path.join(projectRoot, 'protocol/DAILY_RUN.md'), 'utf8');
  const schedule = await readFile(path.join(projectRoot, 'scripts/set-daily-schedule.ps1'), 'utf8');
  assert.deepEqual([...launcherBytes.subarray(0, 3)], [239, 187, 191], 'Windows PowerShell 5.1 must decode the Chinese prompt as UTF-8');
  assert.ok(launcher.indexOf('node scripts/claim-run.mjs $studyDate') >= 0, 'The launcher claims the run before deciding rest');
  const restAt = launcher.indexOf('if ($control.rest)'), promptAt = launcher.indexOf('$prompt ='), modelAt = launcher.indexOf('& $codexExecutable --search');
  assert.ok(restAt >= 0 && restAt < promptAt && promptAt < modelAt, 'Rest is handled before loading the prompt, model and material preparation');
  assert.match(launcher, /if \(\$control\.rest\)\s*\{[^]*?exit 0\s*\}/);
  assert.match(launcher, /-m gpt-6\.1-sol -c model_reasoning_effort=ultra/);
  assert.match(launcher, /-c agents\.enabled=true -c agents\.default_subagent_reasoning_effort=max --enable multi_agent/);
  assert.match(launcher, /--search -a never exec -C \$projectRoot/);
  assert.match(launcher, /\$promptTemplate = Join-Path \$projectRoot 'protocol\/daily-prompt\.txt'/);
  assert.match(launcher, /\$prompt = \[System\.IO\.File\]::ReadAllText\(\$promptTemplate, \[System\.Text\.Encoding\]::UTF8\)\.Replace\('\{STUDY_DATE\}', \$studyDate\)/);
  assert.ok(!launcher.includes('CURRENT_AFFAIRS.md'), 'Versioned prompt semantics come from the referenced template, not a second inline copy');
  assert.ok(template.includes('{STUDY_DATE}') && template.replaceAll('{STUDY_DATE}', date).includes(`work/runs/${date}`));
  for (const value of ['protocol/DAILY_RUN.md', 'protocol/AUTHENTIC_CONTEXT.md', 'protocol/RECOMMENDATION.md', 'protocol/CURRENT_AFFAIRS.md', 'protocol/TEACHING_AUTHORING.md']) assert.ok(template.includes(value), `Actual prompt template must reference ${value}`);
  const fullMaterialsAt = template.indexOf('实际读完整Collins'), recommendationAt = template.indexOf('执行RECOMMENDATION'), freezeAt = template.indexOf('后冻结50主词');
  assert.ok(fullMaterialsAt >= 0 && fullMaterialsAt < recommendationAt && recommendationAt < freezeAt, 'The actual prompt routes complete material reading into recommendation review before freezing; this does not certify that review');
  for (const value of ['正式50主词', 'gpt-6.1-sol/ultra', 'rest=true立即结束', '默认休息与音频空选配不改', '05:00开始生成', 'prepare-vix', 'feedback-snapshot', '不把05:00开始生成当发布截止']) assert.ok(template.includes(value), `Prompt must preserve daily control ${value}`);
  for (const value of ['实际读完整Collins', '再完整Oxford', '全部相关义项', '发现原文不等于已读', 'read/import', 'textPath', '不全池爬取', '原例去向', '原件留存', '只续缺项', '不重做成功付费资源']) assert.ok(template.includes(value), `Prompt must preserve material/original recovery ${value}`);
  for (const value of ['逐义真实语境单正文', '不生产第二/第三部分', 'authoringPolicy:authentic-context-v1', 'CONTEXT_SLOT', 'context-sources.json', '每份只撰写一个连贯的整块中文translation', '最终每用法1–5份', '不是目标或默认最低数', '共享只是允许自然关系']) assert.ok(template.includes(value), `Prompt must preserve new authoring requirement ${value}`);
  for (const value of ['已冻结selection若无authoringPolicy或为sourced-collection-v1', '继续其原三部分合同与原作者稿', 'meta.protocolCommit/已有材料恢复旧协议', '不转换、不重选、不重新标注', '只有尚未冻结的新运行采用authentic-context-v1']) assert.ok(template.includes(value), `Prompt must preserve old frozen replay ${value}`);
  assert.match(schedule, /China Standard Time/);
  assert.match(schedule, /T05:00:00\+08:00/);
  assert.ok(dailyProtocol.includes('每日北京时间05:00开始生成'));
  assert.ok(dailyProtocol.includes('章号由服务端新正式序列确认') && dailyProtocol.includes('旧流程封存，不从历史数量推算新章'), 'The actually referenced daily protocol retains server-owned numbering and old chapter archive boundaries');
  if (process.platform === 'win32') {
    const psLiteral = launcherPath.replaceAll("'", "''");
    const templateLiteral = templatePath.replaceAll("'", "''");
    const parse = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', `$tokens=$null;$errors=$null;$ast=[System.Management.Automation.Language.Parser]::ParseFile('${psLiteral}',[ref]$tokens,[ref]$errors);if($errors.Count){exit 1};$promptNode=$ast.Find({param($n) $n -is [System.Management.Automation.Language.AssignmentStatementAst] -and $n.Left.Extent.Text -eq '$prompt'},$true);if(-not $promptNode -or -not $promptNode.Right.Extent.Text.Contains('ReadAllText') -or -not $promptNode.Right.Extent.Text.Contains('UTF8')){exit 2};$rendered=[System.IO.File]::ReadAllText('${templateLiteral}',[System.Text.Encoding]::UTF8).Replace('{STUDY_DATE}','${date}');if(-not $rendered.Contains('真实语境') -or -not $rendered.Contains('work/runs/${date}') -or $rendered.Contains('{STUDY_DATE}')){exit 3}`], { encoding: 'utf8', windowsHide: true });
    assert.equal(parse.status, 0, `Windows PowerShell launcher syntax/Unicode failed: ${parse.stderr}`);
  }
  console.log('Daily affairs contracts passed: immutable input recovery, offline reuse, new policy downgrade rejection, old frozen replay, real feedback CLI with exact current baseline/digest and immutable new/old snapshots, actual versioned template/recommendation order, 50/ultra/subagent-max/05:00/rest/originals, server numbering, and Windows PowerShell syntax/Unicode. Configuration transport only, not semantic quality certification. No production calls or task changes.');
} finally {
  globalThis.fetch = originalFetch;
  const physicalParent = await realpath(fixtureParent), physicalRoot = await realpath(root), relative = path.relative(physicalParent, physicalRoot);
  assert.ok(relative && !relative.startsWith('..') && !path.isAbsolute(relative) && (process.platform !== 'win32' || /^D:[\\/]/i.test(physicalRoot)), 'Only the fresh physical D-drive fixture is recursively removed');
  await rm(root, { recursive: true, force: true });
}
