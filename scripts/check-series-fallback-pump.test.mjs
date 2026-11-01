import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {PassThrough} from 'node:stream';
import {mkdtemp, mkdir, writeFile, readFile, rm} from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
import {fileURLToPath} from 'node:url';
import {PROJECTS, createPump, pendingStatus, runProject, acquireInstance, loadConfig, createFileLogger, safeEvent} from './series-fallback-pump.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureRoot = path.join(root, '.cache', 'series-fallback-pump-tests');
await mkdir(fixtureRoot, {recursive: true});
const temp = await mkdtemp(path.join(fixtureRoot, 'run-'));
const projects = Object.keys(PROJECTS).map(id => ({id, enabled: true, credential: {type: 'text', file: path.join(temp, 'token.txt')}, cwd: temp, script: path.join(temp, PROJECTS[id].script), args: []}));
const config = {schemaVersion: 1, projects, intervalMs: 15000, statusTimeoutMs: 8000, lockPort: 49763, workRoot: temp, nodeExecutable: process.execPath, codexExecutable: process.execPath};
await writeFile(path.join(temp, 'token.txt'), 'fixture-private-token');
for (const project of projects) await writeFile(project.script, '');
test.after(async () => {await rm(temp, {recursive: true, force: true});});
const fixtureResponse = value => new Response(JSON.stringify(value), {headers: {'content-type': 'application/json'}});
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

test('idle checks all four protected queues, makes zero runner/model calls and writes no idle noise', async () => {
  const checked = [], logs = []; let calls = 0;
  const pump = createPump(config, {status: async project => {checked.push(project.id); return false;}, run: async () => {calls++;}, log: event => logs.push(event)});
  assert.deepEqual(await pump.cycle(), {idle: true});
  assert.deepEqual(checked.sort(), Object.keys(PROJECTS).sort()); assert.equal(calls, 0); assert.equal(logs.length, 0);
});
test('persistent pending work rotates fairly across all four queues with global concurrency one', async () => {
  const order = []; let active = 0, maximum = 0;
  const pump = createPump(config, {status: async () => true, run: async project => {active++; maximum = Math.max(maximum, active); order.push(project.id); await pause(2); active--; return {exitCode: 0};}});
  for (let i = 0; i < 8; i++) await pump.cycle();
  assert.deepEqual(order, [...Object.keys(PROJECTS), ...Object.keys(PROJECTS)]); assert.equal(maximum, 1);
});
test('overlapping timers cannot poll/claim a second task while a child is active', async () => {
  let release, runs = 0, checks = 0;
  const blocked = new Promise(resolve => {release = resolve;});
  const pump = createPump(config, {status: async () => {checks++; return true;}, run: async () => {runs++; await blocked; return {exitCode: 0};}});
  const first = pump.cycle(); await pause(0);
  assert.equal(pump.busy, true); assert.deepEqual(await pump.cycle(), {busy: true}); assert.equal(runs, 1); assert.equal(checks, 4);
  release(); await first; assert.equal(pump.busy, false);
});
test('wire uses fixed HTTPS destinations, fixed Origin, manual redirect and minimal status bodies', async () => {
  const calls = [];
  for (const project of projects) assert.equal(await pendingStatus(project, {credential: async () => 'opaque-fixture', fetchImpl: async (url, options) => {calls.push({url, options}); return fixtureResponse({pending: true, privateIgnored: 'never-leave-response'});}}), true);
  for (let i = 0; i < calls.length; i++) {
    const {url, options} = calls[i], wire = PROJECTS[projects[i].id];
    assert.equal(url, wire.url); assert.equal(options.method, wire.method); assert.equal(options.redirect, 'manual');
    assert.equal(options.headers.Origin, new URL(wire.url).origin); assert.equal(options.headers.authorization, 'Bearer opaque-fixture');
    assert.equal(options.body, wire.method === 'POST' ? '{}' : undefined);
  }
});
test('deadline bounds hung credentials, fetch ignoring abort and a streaming body; never exceeds configured eight-second maximum', async () => {
  const forever = () => new Promise(() => {});
  for (const options of [
    {credential: forever, fetchImpl: async () => {throw Error('must not send');}},
    {credential: async () => 'opaque', fetchImpl: forever},
    {credential: async () => 'opaque', fetchImpl: async () => new Response(new ReadableStream({start() {}}))},
  ]) {
    const start = performance.now();
    await assert.rejects(pendingStatus(projects[0], {...options, timeoutMs: 25}), {code: 'status_timeout'});
    assert.ok(performance.now() - start < 500, 'whole status attempt must finish at the deadline');
  }
  await assert.rejects(pendingStatus(projects[0], {timeoutMs: 8001}), {code: 'status_deadline_invalid'});
});
test('malformed, redirect and oversized status cannot leak error bodies or token strings', async () => {
  const secret = 'private-account-body-never-log', logs = [];
  let index = 0;
  const responses = [new Response(secret, {status: 401}), new Response(secret, {status: 302, headers: {location: 'https://untrusted.invalid'}}), new Response(secret), fixtureResponse({pending: 'yes'}), new Response('x'.repeat(4097))];
  for (const response of responses) {
    const pump = createPump({...config, projects: [projects[0]]}, {status: project => pendingStatus(project, {credential: async () => secret, fetchImpl: async () => response}), log: event => logs.push(event), run: async () => {throw Error('must not run');}});
    assert.deepEqual(await pump.cycle(), {idle: true}); index++;
  }
  assert.equal(logs.length, 5); assert.equal(JSON.stringify(logs).includes(secret), false);
  assert.deepEqual(logs.map(entry => entry.code), ['status_http_401', 'status_http_302', 'status_invalid', 'status_invalid', 'status_too_large']);
  assert.deepEqual(safeEvent({event: 'test', body: secret, token: secret, error: secret}), {event: 'test'});
});
test('status failures back off without starving healthy siblings and recovery clears only status backoff', async () => {
  let clock = 0, broken = true; const statusCalls = [], runs = [], logs = [];
  const pump = createPump(config, {now: () => clock, status: async project => {statusCalls.push(project.id); if (project.id === 'language' && broken) throw Object.assign(Error('private hidden'), {code: 'status_network'}); return true;}, run: async project => {runs.push(project.id); return {exitCode: 0};}, log: event => logs.push(event)});
  await pump.cycle(); assert.equal(runs[0], 'algorithm');
  clock = 1000; await pump.cycle(); assert.equal(statusCalls.filter(id => id === 'language').length, 1);
  clock = 15000; await pump.cycle(); assert.equal(pump.inspect().states.language.statusAfter, 45000);
  clock = 45000; broken = false; await pump.cycle();
  assert.equal(pump.inspect().states.language.statusAfter, 0); assert.ok(logs.some(entry => entry.event === 'status_recovered'));
});
test('runner failure has independent bounded backoff and unknown work is not blindly repeated', async () => {
  let clock = 0, pending = true, runs = 0;
  const pump = createPump({...config, projects: [projects[0]]}, {now: () => clock, status: async () => pending, run: async () => {runs++; return {exitCode: 1};}});
  await pump.cycle(); assert.equal(runs, 1); assert.equal(pump.inspect().states.language.runAfter, 15000);
  clock = 15000; await pump.cycle(); assert.equal(runs, 2); assert.equal(pump.inspect().states.language.runAfter, 45000);
  // A project authority removes unknown work from pending. The pump never derives
  // retries from a child result, an old prompt, the private body or a local spool.
  pending = false; clock = 45000; await pump.cycle(); assert.equal(runs, 2);
});
test('spawn is hidden, shell-free and global Codex path is injected without API/publisher credentials; all new temp is D', async () => {
  let captured;
  const result = await runProject(projects[0], config, {inheritedEnv: {PATH: 'keep', CODEX_HOME: 'D:/CodexData', OPENAI_API_KEY: 'do-not-pass', PUBLISH_TOKEN: 'do-not-pass', SECRET_TOKEN: 'do-not-pass', SECOND_LANGUAGE_PUBLISH_TOKEN: 'do-not-pass'}, spawnImpl: (executable, args, options) => {
    captured = {executable, args, options}; const child = new EventEmitter(); child.stdout = new PassThrough(); child.stderr = new PassThrough();
    queueMicrotask(() => {child.stdout.write('private answer'); child.stderr.write('private error'); child.emit('close', 0, null);}); return child;
  }});
  assert.equal(result.exitCode, 0); assert.equal(captured.options.windowsHide, true); assert.equal(captured.options.shell, false);
  assert.deepEqual(captured.options.stdio, ['ignore', 'pipe', 'pipe']); assert.equal(captured.executable, process.execPath);
  assert.deepEqual(captured.args, ['--use-env-proxy', projects[0].script]); assert.equal(captured.options.cwd, temp);
  assert.equal(captured.options.env.SECOND_SERIES_CODEX_EXECUTABLE, process.execPath); assert.equal(captured.options.env.CODEX_HOME, 'D:/CodexData');
  for (const key of ['OPENAI_API_KEY', 'PUBLISH_TOKEN', 'SECRET_TOKEN', 'SECOND_LANGUAGE_PUBLISH_TOKEN']) assert.equal(captured.options.env[key], undefined);
  assert.equal(captured.options.env.TEMP, path.join(temp, 'tmp')); assert.equal(captured.options.env.TMP, captured.options.env.TEMP);
  if (process.platform === 'win32') assert.match(captured.options.cwd, /^d:[\\/]/i);
});
test('one OS lock admits one pump, released locks recover, unrelated occupied ports are not killed', async () => {
  const first = await acquireInstance(0);
  try {const second = await acquireInstance(first.port); assert.equal(second.alreadyRunning, true); await second.close();} finally {await first.close();}
  const recovered = await acquireInstance(first.port); assert.equal(recovered.alreadyRunning, false); await recovered.close();
  const other = net.createServer(socket => socket.end('some-other-program\n'));
  await new Promise(resolve => other.listen(0, '127.0.0.1', resolve));
  try {await assert.rejects(acquireInstance(other.address().port), {code: 'instance_port_occupied'}); assert.equal(other.listening, true);} finally {await new Promise(resolve => other.close(resolve));}
});
test('config validates only fixed project runners and credential file references, without network or models', async () => {
  const filename = path.join(temp, 'config.json');
  await writeFile(filename, JSON.stringify(config)); const loaded = await loadConfig(filename, {checkCredentials: true}); assert.equal(loaded.projects.length, 4);
  await writeFile(filename, JSON.stringify({...config, projects: [{...projects[0], status: {url: 'https://untrusted.invalid'}}]}));
  await assert.rejects(loadConfig(filename), {code: 'status_destination_not_configurable'});
  await writeFile(filename, JSON.stringify({...config, statusTimeoutMs: 9000})); await assert.rejects(loadConfig(filename), {code: 'status_deadline_invalid'});
});
test('file logger drops business fields and hidden installer requires explicit apply/start', async () => {
  const logger = await createFileLogger(path.join(temp, 'logs')); logger({at: '2026-11-01T00:00:00Z', event: 'runner_started', project: 'language', answer: 'NEVER', token: 'NEVER'}); await logger.flush();
  assert.deepEqual(JSON.parse(await readFile(path.join(temp, 'logs/pump-2026-11-01.jsonl'), 'utf8')), {at: '2026-11-01T00:00:00Z', event: 'runner_started', project: 'language'});
  const installer = await readFile(path.join(root, 'scripts/install-series-fallback-pump.ps1'), 'utf8');
  assert.match(installer, /if \(-not \$Apply\)/); assert.match(installer, /sh\.Run\(/); assert.match(installer, /, 0, True/);
  assert.match(installer, /-MultipleInstances IgnoreNew/); assert.match(installer, /-ExecutionTimeLimit \(\[TimeSpan\]::Zero\)/);
  assert.match(installer, /-AtLogOn -User/); assert.match(installer, /-RestartCount 999/); assert.doesNotMatch(installer, /Stop-Process|taskkill|Stop-ScheduledTask/);
});
