// Local executor only: the protected project queues remain the task authority.
// No API/model request, prompt, response body or credential is logged here.
import {readFile, mkdir, appendFile, realpath, stat} from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
import {spawn} from 'node:child_process';
import {setGlobalProxyFromEnv} from 'node:http';
import {fileURLToPath} from 'node:url';

export const PROJECTS = Object.freeze({
  language: {url: 'https://the-second-language.pages.dev/api/questions/jobs/fallback-status', method: 'GET', script: 'question-codex-fallback-worker.mjs'},
  algorithm: {url: 'https://second-algorithm.pages.dev/api/questions/jobs/status', method: 'POST', script: 'question-codex-worker.mjs'},
  schedule: {url: 'https://neu-schedule-push-api.pages.dev/runner/fallback-status', method: 'GET', script: 'agenda-runner.mjs'},
  ledger: {url: 'https://second-ledger.pages.dev/api/codex-fallback/status', method: 'GET', script: 'codex-fallback-worker.mjs'},
});
const LOCK_ID = 'second-series-fallback-pump-v1\n';
const MAX_STATUS_BYTES = 4096;
const failure = code => Object.assign(new Error(code), {code});
const isD = value => /^d:[\\/]/i.test(value);
const requireD = value => {if (process.platform === 'win32' && !isD(value)) throw failure('storage_not_d'); return value;};
const allowedEventKeys = new Set(['at', 'event', 'project', 'code', 'delayMs', 'exitCode', 'signal']);
export function safeEvent(event) {
  return Object.fromEntries(Object.entries(event).filter(([key, value]) => allowedEventKeys.has(key) &&
    (typeof value === 'string' || typeof value === 'number' || value === null)));
}
async function boundedFile(file, max = 1024 * 1024) {
  if ((await stat(file)).size > max) throw failure('file_too_large');
  return readFile(file, 'utf8');
}
async function readJson(file) {return JSON.parse(await boundedFile(file));}
export async function readCredential(source) {
  let token;
  if (source.type === 'publisher-config') {
    const local = await readJson(source.file);
    const reference = local.publisherCredentialFile;
    if (typeof reference !== 'string' || !path.isAbsolute(reference)) throw failure('credential_reference_invalid');
    token = (await readJson(reference)).PUBLISH_TOKEN;
  } else if (source.type === 'json') token = (await readJson(source.file))[source.key];
  else if (source.type === 'text') token = await boundedFile(source.file, 16384);
  else throw failure('credential_type_invalid');
  if (typeof token !== 'string' || !token.trim() || /[\r\n]/.test(token.trim())) throw failure('credential_invalid');
  return token.trim();
}
export async function loadConfig(file, {checkCredentials = false} = {}) {
  const filename = await realpath(path.resolve(file)); requireD(filename);
  const config = await readJson(filename);
  if (config.schemaVersion !== 1 || !Array.isArray(config.projects) || !config.projects.length) throw failure('config_invalid');
  if (!Number.isInteger(config.lockPort) || config.lockPort < 1024 || config.lockPort > 65535) throw failure('lock_port_invalid');
  if ((config.intervalMs ?? 15000) !== 15000) throw failure('interval_must_be_15000');
  config.intervalMs = 15000;
  config.statusTimeoutMs = config.statusTimeoutMs ?? 8000;
  if (!Number.isInteger(config.statusTimeoutMs) || config.statusTimeoutMs < 100 || config.statusTimeoutMs > 8000) throw failure('status_deadline_invalid');
  if (typeof config.nodeExecutable !== 'string' || !path.isAbsolute(config.nodeExecutable) || !(await stat(config.nodeExecutable)).isFile()) throw failure('node_executable_invalid');
  if (typeof config.codexExecutable !== 'string' || !path.isAbsolute(config.codexExecutable) || !(await stat(config.codexExecutable)).isFile()) throw failure('codex_executable_invalid');
  if (!path.isAbsolute(config.workRoot ?? '')) throw failure('work_root_invalid');
  requireD(config.workRoot);
  await mkdir(config.workRoot, {recursive: true});
  config.workRoot = requireD(await realpath(config.workRoot));
  if (config.proxyUrl) {
    const proxy = new URL(config.proxyUrl);
    if (proxy.protocol !== 'http:' || !['127.0.0.1', 'localhost'].includes(proxy.hostname) || proxy.username || proxy.password) throw failure('proxy_invalid');
  }
  const seen = new Set();
  for (const project of config.projects) {
    if (!PROJECTS[project.id] || seen.has(project.id)) throw failure('project_invalid');
    seen.add(project.id);
    project.enabled = project.enabled !== false;
    project.cwd = requireD(await realpath(project.cwd));
    project.script = requireD(await realpath(project.script));
    if (path.basename(project.script) !== PROJECTS[project.id].script || !(await stat(project.script)).isFile()) throw failure('runner_invalid');
    if (!Array.isArray(project.args) || project.args.some(arg => typeof arg !== 'string' || /[\r\n\0]/.test(arg))) throw failure('runner_args_invalid');
    const source = project.credential;
    if (!source || !['publisher-config', 'json', 'text'].includes(source.type) || !path.isAbsolute(source.file ?? '')) throw failure('credential_source_invalid');
    if (source.type === 'json' && source.key !== 'runnerKey') throw failure('credential_key_invalid');
    // Status URLs and Origin are fixed in source, not configurable destinations.
    if ('url' in project || 'status' in project) throw failure('status_destination_not_configurable');
    if (checkCredentials && project.enabled) await readCredential(source);
  }
  return config;
}

async function smallStatusBody(response) {
  const advertised = Number(response.headers.get('content-length'));
  if (Number.isFinite(advertised) && advertised > MAX_STATUS_BYTES) {await response.body?.cancel(); throw failure('status_too_large');}
  if (!response.body) throw failure('status_invalid');
  const reader = response.body.getReader(); let length = 0; const chunks = [];
  try {
    for (;;) {
      const {done, value} = await reader.read(); if (done) break;
      length += value.length;
      if (length > MAX_STATUS_BYTES) {await reader.cancel(); throw failure('status_too_large');}
      chunks.push(Buffer.from(value));
    }
  } finally {reader.releaseLock();}
  let value;
  try {value = JSON.parse(Buffer.concat(chunks, length).toString('utf8'));} catch {throw failure('status_invalid');}
  if (!value || typeof value.pending !== 'boolean') throw failure('status_invalid');
  return value.pending; // Nothing else from the response leaves this function.
}
export async function pendingStatus(project, {fetchImpl = fetch, credential = readCredential, timeoutMs = 8000} = {}) {
  const wire = PROJECTS[project.id]; if (!wire) throw failure('project_invalid');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 8000) throw failure('status_deadline_invalid');
  const controller = new AbortController(); let timer;
  const deadline = new Promise((_, reject) => {timer = setTimeout(() => {controller.abort(); reject(failure('status_timeout'));}, timeoutMs);});
  const request = (async () => {
    let token;
    try {token = await credential(project.credential);} catch {throw failure('credential_unavailable');}
    if (controller.signal.aborted) throw failure('status_timeout');
    let response;
    try {
      response = await fetchImpl(wire.url, {method: wire.method, redirect: 'manual', signal: controller.signal,
        headers: {authorization: 'Bearer ' + token, Origin: new URL(wire.url).origin,
          ...(wire.method === 'POST' ? {'content-type': 'application/json'} : {})},
        ...(wire.method === 'POST' ? {body: '{}'} : {})});
    } catch {throw failure(controller.signal.aborted ? 'status_timeout' : 'status_network');}
    if (!response.ok) {await response.body?.cancel(); throw failure('status_http_' + response.status);}
    return smallStatusBody(response);
  })();
  try {return await Promise.race([request, deadline]);} finally {clearTimeout(timer); controller.abort();}
}

// Child stdout/stderr can contain private model details. Drain without retaining it.
export function childEnvironment(config, inherited = process.env) {
  const env = Object.fromEntries(Object.entries(inherited).filter(([key]) => !/(?:API.*KEY|KEY.*API|TOKEN|SECRET|PASSWORD|CREDENTIAL|PUBLISH|RUNNER_KEY)/i.test(key)));
  const temporary = path.join(config.workRoot, 'tmp');
  return {...env, TEMP: temporary, TMP: temporary, TMPDIR: temporary,
    SECOND_SERIES_CODEX_EXECUTABLE: config.codexExecutable,
    ...(config.proxyUrl ? {HTTPS_PROXY: config.proxyUrl, HTTP_PROXY: config.proxyUrl, NO_PROXY: '127.0.0.1,localhost'} : {})};
}
export async function runProject(project, config, {spawnImpl = spawn, inheritedEnv = process.env} = {}) {
  await mkdir(path.join(config.workRoot, 'tmp'), {recursive: true});
  return new Promise((resolve, reject) => {
    let child;
    try {child = spawnImpl(config.nodeExecutable, ['--use-env-proxy', project.script, ...project.args], {
      cwd: project.cwd, env: childEnvironment(config, inheritedEnv), shell: false, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe']});}
    catch {reject(failure('runner_start_failed')); return;}
    child.stdout?.on('data', () => {}); child.stderr?.on('data', () => {});
    child.once('error', () => reject(failure('runner_start_failed')));
    child.once('close', (exitCode, signal) => resolve({exitCode, signal}));
  });
}

export function createPump(config, {status = pendingStatus, run = runProject, now = Date.now, log = () => {}} = {}) {
  const projects = config.projects.filter(project => project.enabled !== false);
  const state = new Map(projects.map(project => [project.id, {statusFailures: 0, statusAfter: 0, runFailures: 0, runAfter: 0}]));
  let busy = false, cursor = 0;
  const emit = event => {try {log(safeEvent({at: new Date(now()).toISOString(), ...event}));} catch { /* A logging failure never resends a model task. */ }};
  const backoff = failures => Math.min(300000, 15000 * (2 ** Math.min(10, failures - 1)));
  async function cycle() {
    if (busy) return {busy: true}; busy = true;
    try {
      const pending = new Set();
      await Promise.all(projects.map(async project => {
        const s = state.get(project.id); if (now() < s.statusAfter || now() < s.runAfter) return;
        try {
          if (await status(project, {timeoutMs: config.statusTimeoutMs})) pending.add(project.id);
          if (s.statusFailures) emit({event: 'status_recovered', project: project.id});
          s.statusFailures = 0; s.statusAfter = 0;
        } catch (error) {
          s.statusFailures++; const delayMs = backoff(s.statusFailures); s.statusAfter = now() + delayMs;
          const code = /^(credential_unavailable|status_(timeout|network|invalid|too_large|http_\d{3}))$/.test(error.code ?? '') ? error.code : 'status_unavailable';
          emit({event: 'status_failed', project: project.id, code, delayMs});
        }
      }));
      let project;
      for (let offset = 0; offset < projects.length; offset++) {
        const index = (cursor + offset) % projects.length;
        if (pending.has(projects[index].id)) {project = projects[index]; cursor = (index + 1) % projects.length; break;}
      }
      if (!project) return {idle: true};
      const s = state.get(project.id); emit({event: 'runner_started', project: project.id});
      try {
        const result = await run(project, config);
        if (result.exitCode !== 0) throw failure('runner_failed');
        s.runFailures = 0; s.runAfter = 0;
        emit({event: 'runner_completed', project: project.id, exitCode: 0});
      } catch {
        s.runFailures++; const delayMs = backoff(s.runFailures); s.runAfter = now() + delayMs;
        emit({event: 'runner_failed', project: project.id, code: 'runner_failed', delayMs});
      }
      return {project: project.id};
    } finally {busy = false;}
  }
  return {cycle, get busy() {return busy;}, inspect: () => ({cursor, busy, states: Object.fromEntries(state)})};
}

// The OS owns lock lifetime; a crash cannot leave a stale PID lock blocking recovery.
export async function acquireInstance(port) {
  const server = net.createServer(socket => {socket.end(LOCK_ID); socket.on('error', () => {});});
  try {
    await new Promise((resolve, reject) => {server.once('error', reject); server.listen({host: '127.0.0.1', port, exclusive: true}, resolve);});
    return {alreadyRunning: false, port: server.address().port, close: () => new Promise(resolve => server.close(resolve))};
  } catch (error) {
    server.close(); if (error.code !== 'EADDRINUSE') throw failure('instance_lock_unavailable');
    const identity = await new Promise(resolve => {
      const socket = net.connect({host: '127.0.0.1', port}); let value = '';
      const finish = result => {socket.destroy(); resolve(result);};
      socket.setTimeout(1000, () => finish(false)); socket.on('error', () => finish(false));
      socket.on('data', chunk => {value += chunk.toString('utf8'); if (value.length > 128 || value.includes('\n')) finish(value === LOCK_ID);});
      socket.on('end', () => finish(value === LOCK_ID));
    });
    if (identity) return {alreadyRunning: true, close: async () => {}};
    throw failure('instance_port_occupied');
  }
}
export async function createFileLogger(directory) {
  requireD(directory); await mkdir(directory, {recursive: true}); let chain = Promise.resolve();
  const log = event => {
    const entry = safeEvent(event), day = String(entry.at).slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return;
    chain = chain.then(() => appendFile(path.join(directory, 'pump-' + day + '.jsonl'), JSON.stringify(entry) + '\n')).catch(() => {});
  };
  log.flush = () => chain; return log;
}
export async function main(args = process.argv.slice(2)) {
  const index = args.indexOf('--config');
  if (index < 0 || !args[index + 1]) throw failure('config_argument_required');
  const config = await loadConfig(args[index + 1], {checkCredentials: true});
  if (args.includes('--check')) {console.log(JSON.stringify({valid: true, projects: config.projects.filter(project => project.enabled).map(project => project.id), intervalMs: 15000, statusTimeoutMs: config.statusTimeoutMs, modelCalls: 0, networkRequests: 0})); return;}
  const log = await createFileLogger(path.join(config.workRoot, 'logs'));
  const lock = await acquireInstance(config.lockPort);
  if (lock.alreadyRunning) {console.log(JSON.stringify({alreadyRunning: true})); return;}
  const pump = createPump(config, {log}); const stop = new AbortController();
  const stopSoon = () => stop.abort(); process.once('SIGINT', stopSoon); process.once('SIGTERM', stopSoon);
  log({at: new Date().toISOString(), event: 'started'});
  try {
    if (config.proxyUrl) {process.env.HTTPS_PROXY = config.proxyUrl; process.env.HTTP_PROXY = config.proxyUrl; process.env.NO_PROXY = '127.0.0.1,localhost'; setGlobalProxyFromEnv({https_proxy: config.proxyUrl, http_proxy: config.proxyUrl, no_proxy: process.env.NO_PROXY});}
    do {
      await pump.cycle(); if (stop.signal.aborted || args.includes('--once')) break;
      // Stop wakes the idle interval. Running children finish under their own claim.
      await new Promise(resolve => {const timer = setTimeout(done, 15000); function done() {clearTimeout(timer); stop.signal.removeEventListener('abort', done); resolve();} stop.signal.addEventListener('abort', done, {once: true});});
    } while (!stop.signal.aborted);
  } finally {
    process.removeListener('SIGINT', stopSoon); process.removeListener('SIGTERM', stopSoon);
    log({at: new Date().toISOString(), event: 'stopped'}); await log.flush(); await lock.close();
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {console.error(JSON.stringify({event: 'pump_unavailable', code: /^[a-z_]+$/.test(error.code ?? '') ? error.code : 'startup_failed'})); process.exitCode = 1;});
}
