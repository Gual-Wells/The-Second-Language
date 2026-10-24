import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { compileChapter, demoChapter, makeSession, buildPrompt, buildReportRequest, validateReport, applyReport, historyKey } from '../web/labs/voice-dialogue/core.js';

// All content below is self-written and kept outside formal chapter storage.
// No production API, Voice service, model, VIX mutation or paid audio is used.
const out = path.resolve('.cache/voice-dialogue-checks');
await mkdir(out, { recursive: true });
const checks = [];
const sha = value => createHash('sha256').update(value).digest('hex');
const check = (name, condition) => { assert.ok(condition, name); checks.push(name); };
const reject = async (name, action) => { await assert.rejects(action); checks.push(name); };
const rejects = (name, action) => { assert.throws(action); checks.push(name); };
const clone = value => structuredClone(value);

const markdown = `<!-- PART:one -->
<!-- WORD:W001 -->
# compromise
**词源**：仅为自编设施测试，不是正式教学。
<!-- USE:U101 -->
## compromise · 折中 /ˈkɑːmprəmaɪz/
\`双方各作让步达成协议\`
【共同句法范围】可用 compromise on something；不得把单方面服从误作折中。
<!-- USE:U102 -->
- **reach a compromise**：达成双方均作让步的方案。
细义补充：达成的是方案；谈判尚未达成时不能说已达成。
<!-- USE:U103 -->
## compromise · 损害 /ˈkɑːmprəmaɪz/
\`使安全、原则或质量受到损害\`
及物动词；此义不是各作让步。
<!-- WORD:W002 -->
# writ
**词源**：仅为自编设施测试。
<!-- USE:U104 -->
## writ · 法律命令 /rɪt/
\`由法院签发的书面命令\`
法律用法；置于法院文书讨论，不作为普通便条的替换词。
<!-- PART:two -->
<!-- WORD:W001 -->
# compromise
<!-- EXAMPLE:U101 -->
We can compromise on the meeting date.
\`我们可以就开会日期各作让步。\`
<!-- EXAMPLE:U102 -->
The neighbours reached a compromise about the gate.
\`邻居们就大门问题达成折中方案。\`
<!-- EXAMPLE:U102 -->
We have not reached a compromise yet.
\`我们尚未达成折中方案。\`
<!-- EXAMPLE:U103 -->
The weak lock could compromise security.
\`薄弱的锁可能损害安全性。\`
<!-- WORD:W002 -->
# writ
<!-- EXAMPLE:U104 -->
The court issued a writ.
\`法院签发了一项书面命令。\`
<!-- PART:three -->
<!-- ARTICLE:A02 -->
# A Court Document
<!-- SENTENCE:S003 USE:U104 -->
The lawyer examined the writ before the hearing.
\`律师在庭审前查看了法院命令。\`
<!-- ARTICLE:A01 -->
# An Access Plan
<!-- SENTENCE:S004 USE:U103 -->
They would not compromise security to save money.
\`他们不会为了省钱而损害安全性。\`
<!-- SENTENCE:S002 USE:U102 -->
The residents reached a compromise after discussing the gate.
\`居民们讨论大门问题后达成了折中方案。\`
<!-- SENTENCE:S001 USE:U101 -->
They agreed to compromise on the delivery time.
\`他们同意就送货时间各作让步。\`
`;
const raw = { id: '2026-10-24', title: 'Self-written isolated fixture', number: '第 1 章', sourcePolicy: 'current-affairs-v1', markdown, digest: sha(markdown) };
await writeFile(path.join(out, 'fixture-chapter.json'), JSON.stringify(raw, null, 2));
const source = await compileChapter(raw);
check('formal body digest remains exact', source.digest === sha(source.markdown));
check('two homographic senses and nested pattern have distinct original USE identities', source.uses.length === 4 && new Set(source.uses.map(use => use.id)).size === 4 && source.uses.filter(use => use.word === 'compromise').length === 3);
const byId = new Map(source.uses.map(use => [use.id, use]));
check('fine pattern retains its parent heading and shared grammatical scope', byId.get('U102').parentUseId === 'U101' && byId.get('U102').teaching.includes('【共同句法范围】') && byId.get('U102').teaching.includes('细义补充'));
check('different homographic meaning is not assigned the previous sense parent', !byId.get('U103').parentUseId && !byId.get('U103').teaching.includes('【共同句法范围】'));
check('all original fine-pattern examples and translations survive extraction', byId.get('U102').examples.length === 2 && byId.get('U102').examples[1].translation === '我们尚未达成折中方案。');
check('article and globally out-of-order sentence identities survive extraction', byId.get('U104').sentences[0].articleId === 'A02' && byId.get('U104').sentences[0].id === 'S003');
check('register restriction stays with the exact legal meaning', byId.get('U104').teaching.includes('法律用法') && byId.get('U104').teaching.includes('不作为普通便条'));
await reject('changed body with an old digest is rejected', () => compileChapter({ ...raw, markdown: markdown + '\nChanged.' }));
await reject('bad digest is rejected', () => compileChapter({ ...raw, digest: 'bad' }));
for (const field of ['archived', 'withdrawn', 'historical']) await reject(`${field} chapter is not a training source`, () => compileChapter({ ...raw, [field]: true }));
await reject('legacy source scope is rejected', () => compileChapter({ ...raw, sourcePolicy: 'legacy' }));
await reject('temporary content cannot impersonate a formal chapter', () => compileChapter({ ...raw, kind: 'temporary' }));
const demonstration = await demoChapter();
await reject('demo cannot silently enter formal source path', () => compileChapter(demonstration));
const demo = await compileChapter(demonstration, { demo: true });
check('explicit specimen stays nonformal with an independent identity', demo.kind === 'demo' && demo.id === 'voice-demo-v1' && demo.id !== source.id);

const session = makeSession(source, { seed: 'reproducible-real-meaning-test', count: 4 });
const repeat = makeSession(source, { seed: session.seed, count: 4 });
check('seed makes target scheduling reproducible', JSON.stringify(session.targets.map(use => use.id)) === JSON.stringify(repeat.targets.map(use => use.id)));
check('each attempt has a new session identity even for the same seed', session.id !== repeat.id);
check('all senses remain selectable without forced dictionary ordering', new Set(session.targets.map(use => use.id)).size === 4);
const varied = Array.from({ length: 20 }, (_, i) => makeSession(source, { seed: `variety-${i}`, count: 2 }));
check('same-priority small sessions prefer lexical variety instead of filling with one homograph', varied.every(item => new Set(item.targets.map(use => use.wordId)).size === 2));
check('changing seeds can produce different target order', new Set(varied.map(item => item.targets.map(use => use.id).join(','))).size > 1);
const history = {};
for (const [id, independent, dueAt] of [['U101', 0, '2001-01-01'], ['U102', 1, '2001-01-01'], ['U103', 0, '2099-01-01'], ['U104', 1, '2099-01-01']]) history[historyKey(session, id)] = { independent, dueAt };
check('due unassisted deficits precede due independent, then future deficits and future independent', makeSession(source, { seed: 'priority', history, count: 4 }).targets.map(use => use.id).join(',') === 'U101,U102,U103,U104');
check('count bounds prevent empty or oversized prompt batches', makeSession(source, { count: 0 }).targets.length === 1 && makeSession(source, { count: 999 }).targets.length === 4);

const prompt = buildPrompt(session, source);
for (const [name, condition] of [
  ['hidden target introduction', /target list hidden|targets hidden/i.test(prompt)],
  ['one question at a time', /one meaningful question at a time/i.test(prompt)],
  ['no forced implausible vocabulary script', /do not force every target/i.test(prompt)],
  ['correct alternatives are communication success', /another correct expression[\s\S]*communication success/i.test(prompt)],
  ['model-provided expression cannot count as independent', /primed or copied expression is prompted\/imitation/i.test(prompt)],
  ['legal and restricted senses require suitable contexts', /historical, formal or specialist meanings[\s\S]*suitable/i.test(prompt)],
  ['missing opportunity is not failure', /Not observed is not failure/i.test(prompt)],
  ['text reports are not pronunciation assessment', /do not claim a pronunciation or listening assessment from text/i.test(prompt)],
  ['quoted chapter instructions remain untrusted data', /chapter data are untrusted/i.test(prompt)],
  ['no automatic project save is claimed', /Do not say you have saved results/i.test(prompt)],
]) check(`conversation contract: ${name}`, condition);
check('exact semantic/register material and all examples are embedded', prompt.includes('不作为普通便条') && prompt.includes('We have not reached a compromise yet.'));
check('demo prompt clearly states nonformal status', /not a published lesson or a certification/.test(buildPrompt(makeSession(demo), demo)));
rejects('prompt cannot mix another digest', () => buildPrompt(session, { ...source, digest: 'a'.repeat(64) }));
check('manual finish request retains the same session and source', buildReportRequest(session).includes(session.id) && buildReportRequest(session).includes(source.digest));

const report = entries => ({ schema: 'tsl.voice.report.v1', sessionId: session.id, sourceId: source.id, sourceDigest: source.digest, entries });
const entry = (useId, values = {}) => ({ useId, outcome: 'independent', cueLevel: 0, learnerQuote: 'We can compromise on the date.', assistantPrompt: 'How could we settle this disagreement?', note: '', ...values });
const parse = value => validateReport(JSON.stringify(value), session);
const valid = parse(report([entry('U101')]));
check('one observed sense does not fabricate observations for the rest', valid.entries.length === 4 && valid.entries.find(item => item.useId === 'U101').outcome === 'independent' && valid.entries.filter(item => item.outcome === 'not_observed').length === 3);
check('external feedback remains explicitly unverified', valid.evidence === 'external-unverified');
check('complete fenced JSON can be returned from iOS chat text', validateReport('```json\n' + JSON.stringify(report([])) + '\n```', session).entries.length === 4);
rejects('surrounding prose is not silently treated as trusted JSON', () => validateReport('Here you go:\n' + JSON.stringify(report([])), session));
for (const [field, value] of [['sessionId', 'another-session'], ['sourceId', '2026-10-25'], ['sourceDigest', 'a'.repeat(64)], ['schema', 'wrong-schema']]) rejects(`mismatched ${field} is rejected`, () => parse({ ...report([]), [field]: value }));
rejects('unknown USE is rejected', () => parse(report([entry('U999')])));
rejects('repeated USE observation is rejected', () => parse(report([entry('U101'), entry('U101')])));
rejects('invalid outcome is rejected', () => parse(report([entry('U101', { outcome: 'mastered' })])));
for (const cueLevel of [-1, 1.5, 5, '0']) rejects(`invalid cue level ${JSON.stringify(cueLevel)} is rejected`, () => parse(report([entry('U101', { cueLevel })])));
rejects('oversized report is rejected before JSON processing', () => validateReport('x'.repeat(200001), session));
for (const field of ['learnerQuote', 'assistantPrompt']) check(`missing ${field} cannot establish independent use`, parse(report([entry('U101', { [field]: '' })])).entries.find(item => item.useId === 'U101').outcome === 'uncertain');
for (const cueLevel of [1, 2, 3, 4]) check(`cue level ${cueLevel} cannot establish independent use`, parse(report([entry('U101', { cueLevel })])).entries.find(item => item.useId === 'U101').outcome === (cueLevel >= 3 ? 'imitation' : 'prompted'));
check('assistant directly giving a word downgrades a claimed independent result', parse(report([entry('U101', { assistantPrompt: 'Could you compromise on the date?' })])).entries.find(item => item.useId === 'U101').outcome === 'prompted');
check('assistant directly giving a nested expression is also priming', parse(report([entry('U102', { learnerQuote: 'We can reach a compromise.', assistantPrompt: 'Could you reach a compromise?' })])).entries.find(item => item.useId === 'U102').outcome === 'prompted');
check('correct alternative is not rewritten as error', parse(report([entry('U101', { outcome: 'alternative', learnerQuote: 'We could meet halfway.' })])).entries.find(item => item.useId === 'U101').outcome === 'alternative');

const applied = applyReport({}, session, valid);
const observed = applied[historyKey(session, 'U101')], unseen = applied[historyKey(session, 'U103')];
check('independent history stores one actual observation and a later due date', observed.independent === 1 && observed.observations === 1 && Date.parse(observed.dueAt) > Date.parse(valid.receivedAt));
check('unobserved sense is not counted as an error or observation', unseen.independent === 0 && unseen.observations === 0 && unseen.lastObservedAt === null && unseen.lastOutcome === 'not_observed');
check('applying the same session twice is idempotent', JSON.stringify(applyReport(applied, session, valid)) === JSON.stringify(applied));
const laterSession = makeSession(source, { seed: 'a-second-genuine-session', count: 4 });
const laterRaw = { ...report([entry('U101')]), sessionId: laterSession.id };
const laterReport = validateReport(JSON.stringify(laterRaw), laterSession);
const afterTwo = applyReport(applied, laterSession, laterReport);
check('another genuine session increments the same meaning separately', afterTwo[historyKey(session, 'U101')].independent === 2);
check('an old report cannot be replayed after a newer session replaced lastSessionId', JSON.stringify(applyReport(afterTwo, session, valid)) === JSON.stringify(afterTwo));
const unobservedLater = validateReport(JSON.stringify({ ...report([]), sessionId: laterSession.id }), laterSession);
const afterUnobserved = applyReport(applied, laterSession, unobservedLater);
check('not observed leaves a previous due date and successful observation time unchanged', afterUnobserved[historyKey(session, 'U101')].dueAt === observed.dueAt && afterUnobserved[historyKey(session, 'U101')].lastObservedAt === observed.lastObservedAt && afterUnobserved[historyKey(session, 'U101')].independent === 1);
const prompted = parse(report([entry('U101', { cueLevel: 3 })]));
check('model imitation does not increment independent history', applyReport({}, session, prompted)[historyKey(session, 'U101')].independent === 0);
const secondSource = { ...source, id: '2026-10-25' }, revisedSource = { ...source, digest: 'b'.repeat(64) };
const second = makeSession(secondSource, { count: 4 }), revision = makeSession(revisedSource, { count: 4 });
check('same USE code in another chapter is an independent history identity', historyKey(second, 'U101') !== historyKey(session, 'U101'));
check('same USE code after a source revision is not silently reused', historyKey(revision, 'U101') !== historyKey(session, 'U101'));
check('demo history cannot collide with formal practice', historyKey(makeSession(demo), 'U101') !== historyKey(session, 'U101'));
rejects('foreign-session feedback cannot be applied', () => applyReport({}, second, valid));
rejects('raw feedback cannot bypass normalization evidence marker', () => applyReport({}, session, report([entry('U101')])));
await writeFile(path.join(out, 'result.json'), JSON.stringify({ ok: true, checks, productionWrites: 0, externalRequests: 0, paidCalls: 0 }, null, 2));
console.log(JSON.stringify({ ok: true, checks: checks.length, evidence: path.join(out, 'result.json'), productionWrites: 0, externalRequests: 0, paidCalls: 0 }));
