// Offline cross-layer construction check: actual authoring -> source pack ->
// chapter pack CLIs. Self-authored fixtures certify transport, not teaching,
// source permission, lexical sense judgement or a real external read.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {prepareTeachingMaterials, readTeachingMaterials, assembleRun} from './lib/teaching-authoring.mjs';
import {indexTextbook} from './lib/textbook-sources.mjs';
import {readMaterial, validateReadRecord} from './lib/current-affairs-reader.mjs';
import {canonicalSourcePackage, validateSourcePackage} from '../protocol/current-affairs.mjs';
import {validateTeachingLayout} from '../web/annotations.js';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));
const parent = path.join(repoRoot, '.cache/usage-context-packaging-checks');
await fs.mkdir(parent, {recursive: true});
const root = await fs.mkdtemp(path.join(parent, 'isolated-'));
const date = '2099-01-28', commit = 'a'.repeat(40), policy = 'authentic-context-v1';
const run = path.join(root, 'work/runs', date), folder = path.join(root, 'chapters', date);
const hash = text => createHash('sha256').update(text).digest('hex');
const clone = value => structuredClone(value);
const put = async (file, value) => { await fs.mkdir(path.dirname(file), {recursive: true}); await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n'); };
const json = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const selectionFile = path.join(run, 'selection.json'), lockFile = path.join(run, 'vix-source.json');
const chapterFile = path.join(folder, 'chapter.md'), metaFile = path.join(folder, 'meta.json');
const sourceFile = path.join(folder, 'sources.json'), packedFile = path.join(folder, 'chapter.json');
const notesFile = path.join(run, 'source-notes.json'), blocker = path.join(root, 'network-block.mjs');
const originalFetch = globalThis.fetch;
globalThis.fetch = async () => { throw Error('Network disabled in usage-context packaging QA'); };
let attempted = 0, passed = 0;
async function check(name, fn) {
  attempted++;
  try { const value = await fn(); passed++; console.log(`PASS ${name}`); return value; }
  catch (error) { console.error(`FAIL ${name}`); throw error; }
}
function cli(script, ...args) {
  const result = spawnSync(process.execPath, ['--import', pathToFileURL(blocker).href, fileURLToPath(new URL(script, import.meta.url)), ...args], {cwd: root, encoding: 'utf8', windowsHide: true, timeout: 30000, maxBuffer: 2 * 1024 * 1024});
  if (result.error) throw result.error;
  return result;
}
function succeeds(result) { assert.equal(result.status, 0, result.stderr || result.stdout); return result; }
function rejectsCLI(result, message) {
  assert.notEqual(result.status, 0, 'A deliberately inconsistent fixture must not be packaged.');
  assert.match(result.stderr + result.stdout, message);
}
async function withFile(file, bytes, fn) {
  const original = await fs.readFile(file);
  try { await fs.writeFile(file, bytes); return await fn(); }
  finally { await fs.writeFile(file, original); }
}
async function withJSON(file, value, fn) { return withFile(file, JSON.stringify(value), fn); }
async function assertOutputsUnchanged(fn) {
  const files = [metaFile, sourceFile, packedFile];
  const before = await Promise.all(files.map(file => fs.readFile(file)));
  await fn();
  for (let i = 0; i < files.length; i++) assert.deepEqual(await fs.readFile(files[i]), before[i], 'Rejected input must not change the last complete package.');
}

try {
  await fs.writeFile(blocker, "globalThis.fetch = async () => { throw Error('Network disabled in usage-context packaging child'); };\n");
  await check('all packaging children preload the offline fetch guard', async () => {
    const probe = spawnSync(process.execPath, ['--import', pathToFileURL(blocker).href, '--input-type=module', '-e', "await fetch('https://example.invalid/blocked-probe')"], {cwd: root, encoding: 'utf8', windowsHide: true, timeout: 10000});
    assert.notEqual(probe.status, 0);
    assert.match(probe.stderr, /Network disabled in usage-context packaging child/);
  });

  const names = Array.from({length: 50}, (_, i) => `fixture${String(i + 1).padStart(3, '0')}`);
  const selection = {studyDate: date, vixInputCommit: commit, authoringPolicy: policy, mainWords: names.map((text, i) => ({text, entryId: `e${i + 1}`, globalRank: i + 1, family: []}))};
  // Only the frozen fields consumed by these tools are synthesized. This test
  // does not acquire VIX, invoke prepare-vix or impersonate a real VIX cache.
  await put(lockFile, {commit, authoringPolicy: policy});
  await put(selectionFile, selection);
  await put(path.join(run, 'control.json'), {rest: false});
  await put(metaFile, {date, title: 'Isolated author-to-package fixture', number: '第 1 章', wordCount: 50, authoringPolicy: policy, sourcePolicy: 'current-affairs-v1', contentPolicy: 'etymology-fused-v1'});
  const frozenLock = await fs.readFile(lockFile), frozenSelection = await fs.readFile(selectionFile);
  const source = {id: 'fixture', name: 'Self-authored offline source fixture', home: 'https://example.org/', entryUrl: 'https://example.org/news', role: 'primary-announcement', topics: ['science'], language: 'en'};
  const url = 'https://example.org/fixture-source';
  await put(path.join(root, 'resources/current-affairs/sources.json'), {schemaVersion: 1, sources: [source]});
  await put(path.join(root, 'resources/current-affairs/feeds.json'), {schemaVersion: 1, feeds: [], limits: {maxFeeds: 6, concurrency: 2, maxRequests: 12, maxFeedBytes: 100000, maxArticleBytes: 100000, maxItemsPerFeed: 80, timeoutMs: 1000}});
  const sentence = name => `The isolated source discusses ${name} as a structural test token.`;
  const privateMarker = 'PRIVATE-FIXTURE-ORIGINAL-ONLY: this self-authored paragraph is never adopted into the public fixture.';
  const html = `<html><head><title>Offline original fixture</title></head><body><article>${names.map(name => `<p>${sentence(name)}</p>`).join('')}<p>${privateMarker}</p></article></body></html>`;
  const read = await check('a supported reader creates an original record verified by validateReadRecord', async () => {
    let mockRequests = 0;
    const value = await readMaterial(date, {root, sourceId: source.id, url, fetchImpl: async () => { mockRequests++; return new Response(html, {headers: {'content-type': 'text/html'}}); }});
    assert.equal(mockRequests, 1, 'Only the injected self-authored response is read.');
    assert.equal((await validateReadRecord(value.recordPath, {root, sourceId: source.id, url})).textDigest, value.textDigest);
    assert.equal(hash(await fs.readFile(value.textPath)), value.textDigest);
    return value;
  });

  const books = [
    indexTextbook(Buffer.from(names.map(name => `## ${name}\nA self-authored fixture definition.\n□ This original fixture uses ${name}.`).join('\n')), 'collins'),
    indexTextbook(Buffer.from(names.map(name => `## ${name}\nA second self-authored fixture definition.\n◊ Another original ${name} fixture.`).join('\n')), 'oxford')
  ];
  await prepareTeachingMaterials(root, date, {books});
  const {packets} = await readTeachingMaterials(root, date, selection);
  for (let i = 0; i < names.length; i++) {
    const n = String(i + 1).padStart(3, '0'), wordId = `W${n}`, useId = `U${n}`, contextId = `C${n}`, packet = packets.find(p => p.word === names[i]);
    const word = {
      text: names[i], wordId,
      partOne: `<!-- WORD:${wordId} -->\n# ${names[i]}\n\n**词源**：这是隔离结构样例，不主张真实词源。\n\n<!-- USE:${useId} -->\n## ${names[i]} · 验证义 /test/\n\`隔离测试用法，不认证真实教学。\`\n\n<!-- CONTEXT_SLOT:${useId} -->\n`,
      contexts: [{id: contextId, kind: 'excerpt', uses: [useId], sourceUrls: [url], title: 'Self-authored fixture excerpt', paragraphs: [[{id: `S${n}`, uses: [useId], text: sentence(names[i])}]], translation: `隔离原文以 ${names[i]} 作为结构测试词。`, sourceEvidence: [{url, readRecord: path.relative(root, read.recordPath), locator: `self-authored fixture paragraph ${i + 1}`, senseEvidence: 'The exact fixture token occurs in the retained sentence; this does not certify real lexical sense use.', changes: 'One exact self-authored sentence retained; unrelated fixture paragraphs omitted.', publicationBasis: 'Self-authored test fixture; no external text adoption or production publication.'}]}],
      contextChoices: [{useId, contextIds: [contextId], reason: 'One self-contained structural fixture suffices; no forced extra candidates.'}],
      materialDigest: packet.materialDigest,
      sourceCoverage: packet.entries.filter(e => ['collins', 'oxford'].includes(e.book)).map(e => ({sourceId: e.id, disposition: 'The complete self-authored book entry remains in the immutable fixture packet.'})),
      exampleCoverage: packet.exampleCandidates.map(e => ({exampleId: e.id, uses: [useId], disposition: 'Original remains traceable as an unshown candidate in this structural fixture.'}))
    };
    await put(path.join(run, 'teaching/authored', `word-${wordId}.json`), word);
  }
  const authored = await check('fifty full author objects and material dispositions pass the real assembler', () => assembleRun(root, date));
  let contextSources;
  await check('assemble-teaching CLI writes the actual Markdown and context-sources objects', async () => {
    const output = JSON.parse(succeeds(cli('./assemble-teaching.mjs', date)).stdout);
    assert.equal(output.policy, policy); assert.equal(output.format, 'usage-context-v1');
    assert.equal(output.words, 50); assert.equal(output.contexts, 50); assert.equal(output.articles, 0);
    assert.equal(await fs.readFile(path.join(run, 'teaching/chapter.md'), 'utf8'), authored.markdown);
    contextSources = await json(path.join(run, 'teaching/context-sources.json'));
    assert.deepEqual(contextSources, authored.contextSources);
    assert.equal(contextSources.length, 50);
    await fs.copyFile(path.join(run, 'teaching/chapter.md'), chapterFile);
  });
  const notes = {context: 'All source and teaching text is self-authored isolation material; no real-world claim, source permission or semantic quality is certified.', sources: [{sourceId: source.id, url, readRecord: path.relative(root, read.recordPath), facts: ['This original is a self-authored packaging fixture, not real news.']}], contexts: contextSources};
  await put(notesFile, notes);
  let sourcePackage, sourceDigest;
  await check('pack-current-affairs CLI binds actual read digest, final contexts and frozen VIX', async () => {
    const output = JSON.parse(succeeds(cli('./pack-current-affairs.mjs', date, notesFile)).stdout);
    sourcePackage = await json(sourceFile); sourceDigest = output.sourceDigest;
    assert.equal(output.chapterDigest, hash(authored.markdown));
    assert.equal(hash(canonicalSourcePackage(sourcePackage)), sourceDigest);
    assert.equal(sourcePackage.vixInputCommit, commit);
    assert.equal(sourcePackage.selectionDigest, hash(canonicalSourcePackage(selection)));
    assert.equal(sourcePackage.sources[0].readDigest, read.textDigest);
    assert.equal(sourcePackage.sources[0].readAt, read.readAt);
    assert.deepEqual(sourcePackage.contexts, contextSources);
    assert.equal(await fs.readFile(path.join(run, 'sources', `${sourceDigest}.json`), 'utf8'), canonicalSourcePackage(sourcePackage));
    const receipt = await json(path.join(run, 'sources', `${sourceDigest}.receipts.json`));
    assert.equal(receipt[0].readDigest, read.textDigest);
    assert(!canonicalSourcePackage(sourcePackage).includes(privateMarker));
    assert(!canonicalSourcePackage(sourcePackage).includes(read.textPath));
  });
  await check('pack-chapter CLI retains policy, format, exact authored body and identical source digest', async () => {
    succeeds(cli('./pack-chapter.mjs', date));
    const packed = await json(packedFile), meta = await json(metaFile);
    assert.equal(packed.authoringPolicy, policy); assert.equal(packed.format, 'usage-context-v1');
    assert.equal(packed.contentPolicy, 'etymology-fused-v1'); assert.equal(packed.sourcePolicy, 'current-affairs-v1');
    assert.equal(packed.wordCount, 50); assert.equal(packed.markdown, authored.markdown);
    assert.equal(packed.digest, hash(packed.markdown)); assert.equal(packed.digest, sourcePackage.chapterDigest);
    assert.equal(packed.sourceDigest, sourceDigest); assert.equal(meta.sourceDigest, sourceDigest);
    assert.equal(packed.vixInputCommit, commit); assert.deepEqual(packed.sourcePackage, sourcePackage);
    const parsed = validateTeachingLayout(packed.markdown, packed.contentPolicy);
    assert.equal(parsed.contexts.length, 50); assert.equal(parsed.articles.length, 0);
    assert(!/<!-- PART:/.test(packed.markdown));
  });
  await check('standalone new source-package readback validates structure and requires adopted readDigest', () => {
    assert.equal(validateSourcePackage(clone(sourcePackage)).contexts.length, 50);
    const missing = clone(sourcePackage); delete missing.sources[0].readDigest;
    assert.throws(() => validateSourcePackage(missing), /读件摘要/);
  });
  await check('chapter packing rejects a missing author context read record while preserving the completed package', async () => {
    const authorFile = path.join(run, 'teaching/authored/word-W001.json'), changed = await json(authorFile);
    const suffix = read.recordPath.endsWith('-00000000.json') ? '-11111111.json' : '-00000000.json';
    const missing = read.recordPath.replace(/-[a-f0-9]{8}\.json$/, suffix);
    assert.notEqual(missing, read.recordPath);
    await assert.rejects(fs.access(missing), {code: 'ENOENT'});
    changed.contexts[0].sourceEvidence[0].readRecord = path.relative(root, missing);
    await withJSON(authorFile, changed, () => assertOutputsUnchanged(async () => {
      assert.equal((await assembleRun(root, date)).markdown, authored.markdown, 'Private evidence changes must not masquerade as a public-body mismatch.');
      rejectsCLI(cli('./pack-chapter.mjs', date), /ENOENT/);
    }));
  });
  await check('chapter packing rejects another verified read of the same URL with different original bytes', async () => {
    const revisedHtml = html.replace(sentence(names[0]), 'A later self-authored fixture revision changes the first retained source sentence.');
    const revised = await readMaterial(date, {root, sourceId: source.id, url, refresh: true, fetchImpl: async () => new Response(revisedHtml, {headers: {'content-type': 'text/html'}})});
    assert.notEqual(revised.textDigest, read.textDigest, 'The fixture must create a real distinct original, rather than corrupting metadata.');
    assert.equal((await validateReadRecord(revised.recordPath, {root, sourceId: source.id, url})).textDigest, revised.textDigest);
    assert.equal(sourcePackage.sources[0].readDigest, read.textDigest, 'The adopted source package stays bound to the first read.');
    const authorFile = path.join(run, 'teaching/authored/word-W001.json'), changed = await json(authorFile);
    changed.contexts[0].sourceEvidence[0].readRecord = path.relative(root, revised.recordPath);
    await withJSON(authorFile, changed, () => assertOutputsUnchanged(async () => {
      assert.equal((await assembleRun(root, date)).markdown, authored.markdown, 'Only the private author read selection differs.');
      rejectsCLI(cli('./pack-chapter.mjs', date), /作者原文与采用来源readDigest不同/);
    }));
  });
  await check('a changed context URL is rejected by the actual source-pack CLI', async () => {
    const changed = clone(notes); changed.contexts[0].sourceUrls = ['https://example.org/unread-fixture'];
    await withJSON(notesFile, changed, () => assertOutputsUnchanged(async () => rejectsCLI(cli('./pack-current-affairs.mjs', date, notesFile), /实际读取|引用|来源/)));
  });
  await check('an omitted context mapping is rejected rather than silently dropping its source reference', async () => {
    const changed = clone(notes); changed.contexts.pop();
    await withJSON(notesFile, changed, () => assertOutputsUnchanged(async () => rejectsCLI(cli('./pack-current-affairs.mjs', date, notesFile), /语境来源与正文/)));
  });
  await check('a real context cannot omit its adopted source URL', async () => {
    const changed = clone(notes); changed.contexts[0].sourceUrls = [];
    await withJSON(notesFile, changed, () => assertOutputsUnchanged(async () => rejectsCLI(cli('./pack-current-affairs.mjs', date, notesFile), /实际读取|引用|来源/)));
  });
  await check('changed private original bytes fail read SHA verification before source packing', async () => {
    const original = await fs.readFile(read.textPath);
    await withFile(read.textPath, Buffer.concat([original, Buffer.from('\nDeliberate isolated SHA mismatch.')] ), () => assertOutputsUnchanged(async () => rejectsCLI(cli('./pack-current-affairs.mjs', date, notesFile), /digest verification/)));
    assert.equal((await validateReadRecord(read.recordPath, {root, sourceId: source.id, url})).textDigest, read.textDigest);
  });
  await check('chapter packing rejects a body that differs from the actual authoring output', async () => {
    await withFile(chapterFile, authored.markdown + '\n这是故意加入的隔离正文差异。\n', () => assertOutputsUnchanged(async () => rejectsCLI(cli('./pack-chapter.mjs', date), /正式正文与已核对的制作稿不同/)));
  });
  await check('a selected main word without any USE is rejected by authoring and chapter packing', async () => {
    const authorFile = path.join(run, 'teaching/authored/word-W050.json'), changed = await json(authorFile);
    changed.partOne = changed.partOne.slice(0, changed.partOne.indexOf('<!-- USE:'));
    changed.contexts = []; changed.contextChoices = [];
    for (const example of changed.exampleCoverage) example.uses = [];
    const missingUse = authored.markdown.slice(0, authored.markdown.indexOf('<!-- USE:U050 -->'));
    await withJSON(authorFile, changed, () => assertOutputsUnchanged(async () => {
      rejectsCLI(cli('./assemble-teaching.mjs', date), /主词 fixture050.*用法/);
      await withFile(chapterFile, missingUse, async () => rejectsCLI(cli('./pack-chapter.mjs', date), /主词 fixture050.*用法/));
    }));
  });
  await check('a new frozen input policy rejects selection downgrade through the authoring CLI', async () => {
    const changed = clone(selection); delete changed.authoringPolicy;
    await withJSON(selectionFile, changed, async () => rejectsCLI(cli('./assemble-teaching.mjs', date), /新输入制作策略与冻结selection不一致/));
    assert.deepEqual(await fs.readFile(lockFile), frozenLock);
    assert.deepEqual(await fs.readFile(selectionFile), frozenSelection);
  });
  await check('repeating both pack CLIs preserves the completed package and frozen input', async () => {
    await assertOutputsUnchanged(async () => {
      assert.equal(JSON.parse(succeeds(cli('./pack-current-affairs.mjs', date, notesFile)).stdout).sourceDigest, sourceDigest);
      succeeds(cli('./pack-chapter.mjs', date));
    });
    assert.deepEqual(await fs.readFile(lockFile), frozenLock);
    assert.deepEqual(await fs.readFile(selectionFile), frozenSelection);
  });
} catch (error) {
  process.exitCode = 1;
  console.error(String(error.stack || error).split('\n').slice(0, 7).join('\n'));
} finally {
  globalThis.fetch = originalFetch;
  // Only remove the fresh, verified D-drive fixture directory created above.
  const resolvedParent = await fs.realpath(parent), resolvedRoot = await fs.realpath(root);
  const relative = path.relative(resolvedParent, resolvedRoot);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative) || process.platform === 'win32' && !/^D:[\\/]/i.test(resolvedRoot)) throw Error('Unsafe packaging fixture cleanup target');
  await fs.rm(resolvedRoot, {recursive: true, force: true});
}
console.log(`Usage-context packaging QA: ${passed}/${attempted} attempted cases passed; ${attempted - passed} failed. Isolated D: fixtures removed; no publish, real network, paid calls or production/VIX writes.`);
