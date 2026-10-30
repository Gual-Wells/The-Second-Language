// Contract QA across authoring, the shared browser/Worker parser and immutable
// material dispositions. Fixture prose is structural, not semantic certification.
// No publishing, VIX writes, model/TTS calls or real source adoption.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {parseUsageContextContent, isUsageContextContent} from '../web/usage-context.js';
import {parseTeachingUnits} from '../web/teaching-units.js';
import {validateAnnotatedContent, validateTeachingLayout} from '../web/annotations.js';
import {assembleUsageContextCollection} from './lib/usage-context-authoring.mjs';
import {prepareTeachingMaterials, readTeachingMaterials, checkMaterialDisposition, assembleRun} from './lib/teaching-authoring.mjs';
import {indexTextbook} from './lib/textbook-sources.mjs';
import {readerLayoutUpgrade} from '../protocol/reader-layout.mjs';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));
const legacyFile = path.join(repoRoot, 'chapters/history/2026-10-24/4cc6a2f9/chapter.md');
const legacyDigest = '4cc6a2f9edee37555418c365c1da29033b43c1f6854a3ac2dddf2aa9e03f7a78';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const clone = value => structuredClone(value);
const checks = [];
const check = (name, fn) => checks.push({name, fn});
const originalFetch = globalThis.fetch;
globalThis.fetch = async () => { throw Error('Network disabled in usage-context contract QA'); };

function partOne(text, wordId, useId) {
  return `<!-- WORD:${wordId} -->\n# ${text}\n\n**词源**：隔离结构样例，不主张真实词源。\n\n<!-- USE:${useId} -->\n## ${text} · 样例 /test/\n\`隔离测试用法，不代替语义审阅。\`\n\n<!-- CONTEXT_SLOT:${useId} -->\n\n本段只用于核对语境确实插在用法之下。\n`;
}

function sourcedContext(id, useId, text, sentenceId = `S_${id}`) {
  const url = `https://example.invalid/${id}`;
  return {
    id, kind: 'abridgment', uses: [useId], sourceUrls: [url],
    title: 'Isolated structural fixture',
    displayContext: 'This is fixture metadata, not a real adopted source.',
    paragraphs: [[{id: sentenceId, text, uses: [useId]}]],
    translation: '这是整份语境的译文测试块，不认证真实教学或外部事实。',
    sourceEvidence: [{
      url, readRecord: 'in-memory-fixture-only; no source downloaded',
      locator: 'fixture paragraph 1',
      senseEvidence: 'Transport presence only; the fixture does not certify genuine sense use.',
      changes: 'This complete fixture was authored for contract testing.',
      publicationBasis: 'No publication or real source adoption in this test.'
    }]
  };
}

function makeWords() {
  const budget = sourcedContext('C_budget', 'U001', 'The committee approved a budget.');
  budget.paragraphs.push([{id: 'S_support', text: 'A volunteer will verify the receipt.', uses: []}]);
  budget.paragraphs[0][0].speaker = 'Chair Li';
  budget.translation = '委员会批准了一份预算。\n\n一名志愿者将核对收据。';
  return [
    {text: 'budget', wordId: 'W001', partOne: partOne('budget', 'W001', 'U001'), contexts: [budget], contextChoices: [{useId: 'U001', contextIds: ['C_budget'], reason: 'One sufficiently self-contained fixture; no forced third example.'}]},
    {text: 'verify', wordId: 'W002', partOne: partOne('verify', 'W002', 'U002'), contexts: [sourcedContext('C_verify', 'U002', 'We verify the figures before paying.')], contextChoices: [{useId: 'U002', contextIds: ['C_verify'], reason: 'A separate explicit use reference; incidental spelling elsewhere is insufficient.'}]}
  ];
}

const assemble = words => assembleUsageContextCollection(words, {expectedWordCount: words.length});
function rejectsChange(mutator, pattern) {
  const words = makeWords();
  mutator(words);
  assert.throws(() => assemble(words), pattern);
}

function withCount(count) {
  const words = makeWords();
  words[0].contexts = Array.from({length: count}, (_, i) => sourcedContext(`C_budget_${i + 1}`, 'U001', `This budget fixture records variation number ${i + 1}.`));
  const contextIds = words[0].contexts.map(c => c.id);
  words[0].contextChoices = [{
    useId: 'U001', contextIds, reason: 'These are test transport variants, not a claim that more examples improve learning.',
    ...(count > 1 ? {contributions: contextIds.map((contextId, i) => ({contextId, reason: `Independently recorded fixture purpose ${i + 1}; actual teaching increment still needs semantic review.`}))} : {})
  }];
  return words;
}

function makeShared() {
  const words = makeWords();
  const context = sourcedContext('C_shared', 'U001', 'We approved the budget and will verify the figures.');
  context.uses = ['U001', 'U002'];
  context.paragraphs[0][0].uses = ['U001', 'U002'];
  words[0].contexts = [context];
  words[1].contexts = [];
  for (let i = 0; i < words.length; i++) words[i].contextChoices = [{useId: `U00${i + 1}`, contextIds: ['C_shared'], reason: 'Natural sharing in this fixture; only one object, with an explicit local reference at each use.'}];
  return words;
}

check('fused layout pairs POS per form, puts all explanation before context and preserves fixed v1',()=>{
  const words=makeWords();
  words[0].layoutVersion=2;
  words[0].partOne='<!-- WORD:W001 -->\n# budget\n\n<!-- USE:U001 -->\n## budget /test/ n.; budgeting /testɪŋ/ n.\n`A complete fixture explanation including the actual restriction.`\n\n<!-- CONTEXT_SLOT:U001 -->';
  const result=assemble(words);
  assert.equal(result.parsed.uses.get('U001').forms.length,2);
  assert.equal(result.parsed.uses.get('U001').forms[1].partOfSpeech,'n.');
  assert.equal(assemble(makeWords()).parsed.uses.size,2);
  const invalid=clone(words);invalid[0].partOne+='\n\nA second explanation after the example.';
  assert.throws(()=>assemble(invalid),/全部解释须在唯一语境插槽前/);
  invalid[0].partOne=words[0].partOne.replace('/test/ n.; budgeting /testɪŋ/ n.','/test/');
  assert.throws(()=>assemble(invalid),/配对音标和词性/);
});

check('old open reader cannot receive unsupported POS headings; publisher and capable reader keep exact content',()=>{
  const modern='<!-- FORMAT:usage-context-v1 -->\n## adapt /əˈdæpt/ v.\n`Complete explanation.`';
  const old='<!-- FORMAT:usage-context-v1 -->\n## adapt · 适应 /əˈdæpt/\n`Old explanation.`';
  const plain=new Request('https://example.invalid/api/chapters/chapter');
  assert.equal(readerLayoutUpgrade(plain,modern),true);
  assert.equal(readerLayoutUpgrade(plain,old),false);
  assert.equal(readerLayoutUpgrade(plain,modern,{isPublisher:true}),false);
  assert.equal(readerLayoutUpgrade(new Request(plain,{headers:{'x-reader-layout':'2'}}),modern),false);
});

check('authoring -> shared parser keeps a single stream and one whole translation per context', () => {
  const result = assemble(makeWords());
  assert.equal(result.authoringPolicy, 'authentic-context-v1');
  assert(isUsageContextContent(result.markdown));
  assert(!/<!-- (?:PART|ARTICLE):/.test(result.markdown));
  assert.equal((result.markdown.match(/<!-- TRANSLATION:/g) || []).length, 2);
  const parsed = validateAnnotatedContent(result.markdown, {expectedWordCount: 2});
  assert.equal(parsed.contexts.length, 2);
  assert.equal(parsed.contexts[0].paragraphs.length, 2);
  assert.equal(parsed.contexts[0].translation, '委员会批准了一份预算。\n\n一名志愿者将核对收据。');
  assert(parsed.sentences.every(s => !Object.hasOwn(s, 'translation')));
  assert.equal(parsed.sentences[0].speaker, 'Chair Li');
  assert.equal(parseTeachingUnits(parsed.definitions).uses.size, 2);
});

check('one selected context needs no extra candidates, contributions or forced three', () => {
  const result = assemble(withCount(1));
  assert.deepEqual(result.parsed.uses.get('U001').contextIds, ['C_budget_1']);
});
check('every selected main word needs an encoded use in author objects and raw new-format text', () => {
  const words = makeWords(), valid = assemble(words).markdown;
  words[1].partOne = words[1].partOne.slice(0, words[1].partOne.indexOf('<!-- USE:'));
  words[1].contexts = []; words[1].contextChoices = [];
  assert.throws(() => assemble(words), /主词 verify.*用法/);
  const missingUse = valid.slice(0, valid.indexOf('<!-- USE:U002 -->'));
  assert.throws(() => validateAnnotatedContent(missingUse, {expectedWordCount: 2}), /主词 verify.*用法/);
});
check('five is an accepted upper boundary when every retained context has a contribution', () => assert.equal(assemble(withCount(5)).parsed.uses.get('U001').contextIds.length, 5));
check('zero selected contexts is rejected', () => {
  const words = withCount(1); words[0].contextChoices[0].contextIds = [];
  assert.throws(() => assemble(words), /1至5|1至|选/);
});
check('six selected contexts is rejected', () => assert.throws(() => assemble(withCount(6)), /1至5|1至|选/));
check('multiple retained contexts require a contribution for each exact context identity', () => {
  const words = withCount(2); words[0].contextChoices[0].contributions.pop();
  assert.throws(() => assemble(words), /增量/);
});
check('a missing contribution reason is rejected', () => {
  const words = withCount(2); words[0].contextChoices[0].contributions[1].reason = '   ';
  assert.throws(() => assemble(words), /增量/);
});
check('candidate notes do not impose a fixed candidate count', () => {
  const words = withCount(1);
  words[0].contextChoices[0].candidates = [{id: 'actually-compared-one', decision: 'The only candidate actually compared for this fixture.'}];
  assert.equal(assemble(words).parsed.contexts.length, 2);
});

check('natural sharing emits one context object and a local CONTEXT_REF for the other use', () => {
  const result = assemble(makeShared());
  assert.equal(result.contexts.length, 1);
  assert.equal((result.markdown.match(/<!-- CONTEXT:C_shared /g) || []).length, 1);
  assert.equal((result.markdown.match(/<!-- CONTEXT_REF:C_shared USE:U002 -->/g) || []).length, 1);
  assert.equal(result.parsed.occurrences.length, 2);
  for (const use of ['U001', 'U002']) assert.deepEqual(result.parsed.uses.get(use).contextIds, ['C_shared']);
});
check('a distant shared declaration cannot replace the second use local slot', () => {
  const words = makeShared(); words[1].partOne = words[1].partOne.replace('<!-- CONTEXT_SLOT:U002 -->', '');
  assert.throws(() => assemble(words), /就地|语境|插槽/);
});
check('a repeated slot cannot display the same selected context twice beneath one use', () => {
  const words = makeWords();
  words[0].partOne += '\n<!-- CONTEXT_SLOT:U001 -->\n';
  assert.throws(() => assemble(words), undefined, 'Repeated slots must not silently duplicate retained context prose.');
});
check('raw markdown cannot repeat a local context reference hidden by set-based coverage', () => {
  const markdown = assemble(makeWords()).markdown.replace('<!-- END_CONTEXT:C_budget -->', '<!-- END_CONTEXT:C_budget -->\n\n<!-- CONTEXT_REF:C_budget USE:U001 -->');
  assert.throws(() => validateAnnotatedContent(markdown), /重复/);
});
check('every shared selected context needs its own local reference even when another context is already local', () => {
  const words = makeShared();
  words[1].contexts = [sourcedContext('C_verify', 'U002', 'We verify the separate figures.')];
  words[1].contextChoices[0].contextIds = ['C_shared', 'C_verify'];
  words[1].contextChoices[0].contributions = [
    {contextId: 'C_shared', reason: 'An integrated structural fixture.'},
    {contextId: 'C_verify', reason: 'A separate local structural fixture.'}
  ];
  const markdown = assemble(words).markdown.replace('<!-- CONTEXT_REF:C_shared USE:U002 -->', '');
  assert.throws(() => validateAnnotatedContent(markdown), undefined, 'A distant declaration must not silently count as a locally presented second context.');
});
check('incidental word spelling without a USE reference creates no coverage', () => {
  const result = assemble(makeWords());
  assert(result.parsed.contexts[0].sentences.some(s => s.text.includes('verify') && !s.refs.length));
  assert.deepEqual(result.parsed.uses.get('U002').contextIds, ['C_verify']);
  assert(!result.parsed.contexts[0].refs.includes('U002'));
});
check('declared shared sense without a corresponding sentence reference is rejected', () => rejectsChange(words => words[0].contexts[0].uses.push('U002'), /引用承接/));
check('a use cannot be assigned a slot in another word', () => rejectsChange(words => { words[0].partOne = words[0].partOne.replace('CONTEXT_SLOT:U001', 'CONTEXT_SLOT:U002'); }, /本词条|插槽/));
check('a slot cannot interrupt the USE marker before its actual teaching definition', () => {
  for (const anchor of ['<!-- USE:U001 -->', '## budget · 样例 /test/']) {
    const words = makeWords();
    words[0].partOne = words[0].partOne.replace('<!-- CONTEXT_SLOT:U001 -->', '').replace(anchor, `${anchor}\n<!-- CONTEXT_SLOT:U001 -->`);
    assert.throws(() => assemble(words), undefined, 'The use heading and gloss must be complete before its local learning context.');
  }
});
check('unknown use references are rejected', () => rejectsChange(words => {
  const c = words[0].contexts[0]; c.uses.push('U_unknown'); c.paragraphs[0][0].uses.push('U_unknown');
}, /不存在|引用/));
check('unknown context references are rejected', () => rejectsChange(words => { words[0].contextChoices[0].contextIds = ['C_unknown']; }, /不存在/));
check('duplicate context definitions are rejected instead of silently deduplicating prose', () => rejectsChange(words => words[1].contexts.push(clone(words[0].contexts[0])), /定义重复/));
check('duplicate sentence identities across contexts are rejected', () => rejectsChange(words => { words[1].contexts[0].paragraphs[0][0].id = 'S_C_budget'; }, /重复/));
check('duplicate USE definitions are rejected by the teaching-unit parser', () => rejectsChange(words => { words[0].partOne += '\n<!-- USE:U001 -->\n## budget · another /test/\n`重复身份。`\n'; }, /编码重复/));

check('legacy PART markers cannot be mixed into a new stream', () => {
  const markdown = assemble(makeWords()).markdown + '\n<!-- PART:three -->\n';
  assert.throws(() => validateAnnotatedContent(markdown), /三部分|FORMAT/);
});
check('the authoring contract rejects an independent partTwo', () => rejectsChange(words => { words[0].partTwo = 'Old examples cannot become a hidden second part.'; }, /第二部分/));
check('sentence-level translation fields are rejected even when a whole translation is present', () => rejectsChange(words => { words[0].contexts[0].paragraphs[0][0].translation = '不得逐句配译。'; }, /逐句翻译/));
check('inline old monospace sentence translations are rejected by the actual markdown parser', () => {
  const markdown = assemble(makeWords()).markdown.replace('The committee approved a budget.', 'The committee approved a budget.\n`旧式逐句译文。`');
  assert.throws(() => parseUsageContextContent(markdown), /逐句译文|完整编码/);
});
check('a context without its whole translation is rejected', () => rejectsChange(words => { words[0].contexts[0].translation = ''; }, /整份语境译文/));
check('a second translation block is rejected rather than treated as prose', () => {
  const markdown = assemble(makeWords()).markdown.replace('<!-- END_CONTEXT:C_budget -->', '<!-- TRANSLATION:C_budget -->\n另一个块。\n<!-- END_CONTEXT:C_budget -->');
  assert.throws(() => validateAnnotatedContent(markdown), /结构/);
});

check('a transparent teaching fallback with a specific fixture reason is accepted', () => {
  const words = makeWords(), c = words[0].contexts[0];
  c.kind = 'example'; c.sourceUrls = []; c.sourceEvidence = [];
  c.fallbackReason = 'No external source is adopted in this isolated fixture; it explicitly tests the example fallback transport.';
  assert.equal(assemble(words).parsed.contexts[0].kind, 'example');
});
check('a teaching fallback without its reason is rejected', () => rejectsChange(words => {
  const c = words[0].contexts[0]; c.kind = 'example'; c.sourceUrls = []; c.sourceEvidence = [];
}, /具体原因/));
check('an example declaring an adopted source URL still requires complete source evidence', () => {
  const words = makeWords(), c = words[0].contexts[0];
  c.kind = 'example';
  c.fallbackReason = 'The fixture tests a targeted teaching example with an explicitly declared adopted source.';
  c.sourceEvidence = [];
  assert.throws(() => assemble(words), /原文证据|来源/);
  c.sourceEvidence = clone(makeWords()[0].contexts[0].sourceEvidence);
  assert.equal(assemble(words).parsed.contexts[0].kind, 'example');
});
check('an adopted source with no corresponding evidence is rejected', () => rejectsChange(words => { words[0].contexts[0].sourceEvidence = []; }, /原文证据/));
check('incomplete source evidence is rejected', () => rejectsChange(words => { delete words[0].contexts[0].sourceEvidence[0].senseEvidence; }, /senseEvidence/));
check('raw CONTEXT markup inside partOne cannot bypass source-evidence authoring checks', () => {
  const original = assemble(makeWords()).markdown;
  const start = original.indexOf('<!-- CONTEXT:C_budget '), endMarker = '<!-- END_CONTEXT:C_budget -->';
  const block = original.slice(start, original.indexOf(endMarker, start) + endMarker.length);
  assert(start > 0 && block.includes('TRANSLATION:C_budget'));
  const words = makeWords();
  words[0].partOne = words[0].partOne.replace('<!-- CONTEXT_SLOT:U001 -->', block);
  words[0].contexts = [];
  // The raw block has public URLs but no authoring sourceEvidence at all.
  assert.throws(() => assemble(words), undefined, 'Raw embedded context must not bypass the contexts[] provenance path.');
});
check('unsafe source protocols and URL credentials are rejected', () => {
  for (const url of ['javascript:alert(1)', 'data:text/plain,test', 'file:///D:/private.txt', 'http://example.invalid/source', 'https://user:password@example.invalid/source']) {
    rejectsChange(words => { const c = words[0].contexts[0]; c.sourceUrls = [url]; c.sourceEvidence[0].url = url; }, /HTTPS|链接|来源/);
  }
});
check('speaker metadata cannot inject markup or point to an absent sentence', () => {
  rejectsChange(words => { words[0].contexts[0].paragraphs[0][0].speaker = '<script>bad</script>'; }, /说话者/);
  const markdown = assemble(makeWords()).markdown.replace('"S_C_budget":"Chair Li"', '"S_missing":"Chair Li"');
  assert.throws(() => validateAnnotatedContent(markdown), /不存在句子/);
});

function packetFor(word) {
  return {materialDigest: 'isolated-material-digest', entries: [{id: 'collins-budget', book: 'collins'}, {id: 'oxford-budget', book: 'oxford'}], exampleCandidates: [{id: 'original-example-budget', sourceId: 'collins-budget'}]};
}
function withDisposition() {
  const word = makeWords()[0], packet = packetFor(word);
  word.materialDigest = packet.materialDigest;
  word.sourceCoverage = packet.entries.map(e => ({sourceId: e.id, disposition: 'Retained original and fixture teaching scope; not a semantic certificate.'}));
  word.exampleCoverage = [{exampleId: packet.exampleCandidates[0].id, uses: ['U001'], disposition: 'Not selected for display; original remains traceable as a compared candidate.'}];
  return {word, packet, parsed: assemble(makeWords()).parsed};
}
check('existing material disposition permits an original candidate to remain unshown but traceable', () => {
  const {word, packet, parsed} = withDisposition(); checkMaterialDisposition(word, packet, parsed);
});
check('existing material disposition still rejects an omitted original example', () => {
  const {word, packet, parsed} = withDisposition(); word.exampleCoverage = [];
  assert.throws(() => checkMaterialDisposition(word, packet, parsed), /原例句候选尚未交代/);
});
check('existing material disposition still requires both textbook entry dispositions', () => {
  const {word, packet, parsed} = withDisposition(); word.sourceCoverage.pop();
  assert.throws(() => checkMaterialDisposition(word, packet, parsed), /教材条目尚未交代/);
});
check('an original example cannot be mapped into a different word family', () => {
  const {word, packet, parsed} = withDisposition(); word.exampleCoverage[0].uses = ['U002'];
  assert.throws(() => checkMaterialDisposition(word, packet, parsed), /其他词族/);
});

check('persisted fifty-word new run uses the real assembler and retains original-example checks', async () => {
  const parent = path.join(repoRoot, '.cache/usage-context-authoring-checks');
  await fs.mkdir(parent, {recursive: true});
  const root = await fs.mkdtemp(path.join(parent, 'isolated-'));
  const date = '2099-01-27', run = path.join(root, 'work/runs', date), commit = 'a'.repeat(40);
  const put = async (file, value) => { await fs.mkdir(path.dirname(file), {recursive: true}); await fs.writeFile(file, JSON.stringify(value)); };
  try {
    const names = Array.from({length: 50}, (_, i) => `fixture${String(i + 1).padStart(3, '0')}`);
    const books = [
      indexTextbook(Buffer.from(names.map(name => `## ${name}\nFixture definition.\n□ This original fixture is retained for ${name}.`).join('\n')), 'collins'),
      indexTextbook(Buffer.from(names.map(name => `## ${name}\nAnother fixture definition.\n◊ An original ${name} fragment.`).join('\n')), 'oxford')
    ];
    const selection = {studyDate: date, vixInputCommit: commit, authoringPolicy: 'authentic-context-v1', mainWords: names.map(text => ({text, family: []}))};
    await put(path.join(run, 'vix-source.json'), {commit});
    await put(path.join(run, 'selection.json'), selection);
    await prepareTeachingMaterials(root, date, {books});
    const {packets} = await readTeachingMaterials(root, date, selection);
    const authors = [];
    for (let i = 0; i < names.length; i++) {
      const n = String(i + 1).padStart(3, '0'), wordId = `W${n}`, useId = `U${n}`, contextId = `C${n}`;
      const packet = packets.find(p => p.word === names[i]);
      const context = {id: contextId, kind: 'example', uses: [useId], sourceUrls: [], sourceEvidence: [], fallbackReason: 'This isolated fixture adopts no real external material; it tests persisted fallback authorship only.', paragraphs: [[{id: `S${n}`, uses: [useId], text: `This independently authored fixture checks ${names[i]}.`}]], translation: '这是一整块隔离测试译文。'};
      const word = {text: names[i], wordId, partOne: partOne(names[i], wordId, useId), contexts: [context], contextChoices: [{useId, contextIds: [contextId], reason: 'One fixture context is sufficient for this transport check.'}], materialDigest: packet.materialDigest, sourceCoverage: packet.entries.filter(e => ['collins', 'oxford'].includes(e.book)).map(e => ({sourceId: e.id, disposition: 'Fixture source retained; content inference remains outside this test.'})), exampleCoverage: packet.exampleCandidates.map(e => ({exampleId: e.id, uses: [useId], disposition: 'Original fixture kept as a traceable unshown candidate.'}))};
      authors.push(word);
      await put(path.join(run, 'teaching/authored', `word-${wordId}.json`), word);
    }
    const result = await assembleRun(root, date);
    assert.equal(result.authoringPolicy, 'authentic-context-v1');
    assert.equal(result.words.length, 50);
    assert.equal(result.parsed.uses.size, 50);
    assert.equal(result.parsed.contexts.length, 50);
    assert.equal(validateTeachingLayout(result.markdown, 'etymology-fused-v1').words.length, 50);
    assert(!/<!-- PART:/.test(result.markdown));
    assert.equal(result.articles.length, 0);
    const changed = clone(authors[0]); changed.exampleCoverage = [];
    await put(path.join(run, 'teaching/authored/word-W001.json'), changed);
    await assert.rejects(assembleRun(root, date), /原例句候选尚未交代/);
    await put(path.join(run, 'teaching/authored/word-W001.json'), authors[0]);
    const oldFrozen = clone(selection); delete oldFrozen.authoringPolicy;
    await put(path.join(run, 'selection.json'), oldFrozen);
    await assert.rejects(assembleRun(root, date), /旧冻结运行不能静默切换/);
  } finally {
    // Verify the final absolute target immediately before recursive removal.
    // Only this test's freshly created D-drive fixture directory is removable.
    const resolvedParent = await fs.realpath(parent), resolvedRoot = await fs.realpath(root);
    const relative = path.relative(resolvedParent, resolvedRoot);
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative) || process.platform === 'win32' && !/^D:[\\/]/i.test(resolvedRoot)) throw Error('Unsafe fixture cleanup target');
    await fs.rm(resolvedRoot, {recursive: true, force: true});
  }
});

check('legacy official chapter retains its exact hash and old parser behaviour', async () => {
  const before = await fs.readFile(legacyFile);
  assert.equal(hash(before), legacyDigest, 'Official chapter bytes must remain the recorded legacy original.');
  const result = validateAnnotatedContent(before.toString('utf8'), {expectedWordCount: 50});
  assert.equal(result.words.length, 50);
  assert.equal(result.uses.size, 680);
  assert.equal(result.articles.length, 51);
  assert.equal(result.sentences.length, 613);
  assert.deepEqual(Object.keys(result.parts), ['one', 'two', 'three']);
  assert.equal(hash(await fs.readFile(legacyFile)), legacyDigest);
});

let passed = 0, failed = 0;
try {
  for (const {name, fn} of checks) {
    try { await fn(); passed++; console.log(`PASS ${name}`); }
    catch (error) { failed++; console.error(`FAIL ${name}\n${String(error.stack || error).split('\n').slice(0, 4).join('\n')}`); }
  }
} finally { globalThis.fetch = originalFetch; }
console.log(`Usage-context contract QA: ${passed}/${checks.length} cases passed; ${failed} failed. No network, production writes, VIX changes or paid calls.`);
if (failed) process.exitCode = 1;
