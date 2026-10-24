import { compileChapter, demoChapter, makeSession, buildPrompt, buildReportRequest, validateReport, applyReport } from './core.js';

const $ = id => document.getElementById(id);
const STORAGE_KEY = 'second-language-voice-dialogue-lab:v1';
const MAX_REPORT_BYTES = 200000;
const outcomeLabels = {
  independent: '独立使用', prompted: '提示后使用', imitation: '跟随示范',
  alternative: '使用了其他表达', error: '用法待改进', uncertain: '识别或判断存疑', not_observed: '尚未观察到'
};
let store = { version: 1, activeId: null, records: {}, history: {}, topic: '' };
let active = null;
let catalog = [];
let busy = false;
let canStore = true;
let pendingNew = null;
let catalogRequest = 0;
let saveTimer = null;
let freshCatalogVerified = false;

function status(message, tone = '') {
  $('status').textContent = message;
  $('status').dataset.tone = tone;
}
function storageUnavailable(message = '当前浏览器无法保存本机记录。你仍可复制和下载训练包、反馈；离开前请自行导出。') {
  canStore = false;
  $('storageNotice').textContent = message;
  $('storageNotice').hidden = false;
}
function persist() {
  clearTimeout(saveTimer);
  saveTimer = null;
  if (!canStore) return false;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeStore())); return true; }
  catch { storageUnavailable('本机保存失败，可能是浏览器限制或空间不足。当前内容仍在本页，请下载记录后再离开。'); return false; }
}
function persistLater() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(persist, 350);
}
function serializeStore() {
  const sourceSnapshots = {}, records = {};
  for (const [id, record] of Object.entries(store.records)) {
    if (!validRecord(record)) continue;
    const { source, ...rest } = record;
    const sourceKey = `${source.kind}:${source.id}:${source.digest}`;
    sourceSnapshots[sourceKey] = source;
    records[id] = { ...rest, sourceKey };
  }
  return { ...store, records, sourceSnapshots };
}
function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1 || typeof parsed.records !== 'object' || !parsed.records || typeof parsed.history !== 'object' || !parsed.history) throw new Error('invalid');
    const records = {};
    for (const [id, saved] of Object.entries(parsed.records)) {
      const source = parsed.sourceSnapshots?.[saved.sourceKey];
      const record = { ...saved, source };
      delete record.sourceKey;
      if (!validRecord(record)) throw new Error('invalid source snapshot');
      records[id] = record;
    }
    store = { version: 1, activeId: parsed.activeId || null, records, history: parsed.history, topic: typeof parsed.topic === 'string' ? parsed.topic : '' };
    const record = store.records[store.activeId];
    if (validRecord(record)) active = record;
  } catch {
    storageUnavailable('已有试验记录暂不可读取；为保护原件，本页不会覆盖它。你仍可复制、下载和试用新训练包。');
  }
}
function validRecord(record) {
  return Boolean(record?.session?.id && record?.source?.id && record?.source?.digest && Array.isArray(record.source.uses) && record.session.source?.digest === record.source.digest);
}
function saveActive(defer = false) {
  if (!active) return false;
  store.records[active.session.id] = active;
  store.activeId = active.session.id;
  if (defer) { persistLater(); return canStore; }
  return persist();
}
function create(tag, text, className) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (className) el.className = className;
  return el;
}
function errorText(error) { return String(error?.message || '操作未完成，请稍后再试。'); }
function labelFor(source) {
  return source.kind === 'demo' ? `原创示范 · ${source.title}` : `${source.number || '正式章节'} · ${source.title}`;
}
function setBusy(value) {
  busy = value;
  for (const id of ['generateButton', 'demoButton', 'refreshCatalog', 'confirmNewButton', 'restoreSession']) $(id).disabled = value;
  $('generateButton').disabled = value || !catalog.length || !$('chapterSelect').value;
  $('restoreSession').disabled = value || !$('sessionSelect').value;
  $('chapterSelect').disabled = value || !catalog.length;
  syncExportAvailability();
}
function exportAllowed() {
  return Boolean(active && (active.source.kind === 'demo' || navigator.onLine !== false && freshCatalogVerified && catalog.some(ch => ch.id === active.source.id && ch.digest === active.source.digest)));
}
function syncExportAvailability() {
  const allowed = exportAllowed();
  for (const id of ['copyPrompt', 'sharePrompt', 'downloadPrompt', 'downloadChapter']) $(id).disabled = !allowed;
  const blocked = Boolean(active && !allowed);
  $('exportNotice').hidden = !blocked;
  if (blocked) $('exportNotice').textContent = freshCatalogVerified && navigator.onLine !== false
    ? '原版本已保留，但已不在当前正式目录。你仍可查看原件与核对会后报告；请用当前章节新建训练。'
    : '原版本已保留。联网刷新目录后可继续训练；会后报告仍可核对。';
}
function requireExport() {
  if (exportAllowed()) return true;
  syncExportAvailability();
  status('此训练版本尚未通过当前正式目录复核，暂不能再次导出。会后报告仍可核对。', 'error');
  return false;
}
async function api(path) {
  const nonce = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const url = new URL(path, location.origin);
  url.searchParams.set('voice_lab', nonce);
  const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json' } });
  if (response.status === 401) {
    $('loginNotice').hidden = false;
    throw new Error('登录已失效，请返回主页登录后刷新。');
  }
  if (!response.ok) throw new Error(`章节读取失败（${response.status}），已保留当前训练与草稿。`);
  return response.json();
}
function formalChapters(result) {
  if (!Array.isArray(result?.chapters)) throw new Error('正式目录返回异常，未创建训练。');
  return result.chapters.filter(ch => ch && typeof ch.id === 'string' && /^[a-f0-9]{64}$/.test(ch.digest || '') && ch.sourcePolicy === 'current-affairs-v1' && !ch.archived && !ch.withdrawn && !ch.historical);
}
async function refreshCatalog() {
  const requestId = ++catalogRequest;
  freshCatalogVerified = false;
  syncExportAvailability();
  $('refreshCatalog').disabled = true;
  $('loginNotice').hidden = true;
  status('正在核对当前正式目录…');
  try {
    const session = await api('/api/session');
    if (!session.authenticated || session.demo) {
      catalog = [];
      $('loginNotice').hidden = false;
      renderCatalog();
      $('catalogNote').textContent = '先登录可选正式章节；也可以明确选择原创示范包。';
      status('尚未登录，现有训练与草稿保持不变。');
      return;
    }
    const result = formalChapters(await api('/api/chapters'));
    if (requestId !== catalogRequest) return;
    catalog = result;
    freshCatalogVerified = true;
    renderCatalog();
    $('catalogNote').textContent = catalog.length ? '目录已在线核对。生成前还会再次确认所选章节的固定版本。' : '当前正式目录为空。新章发布后可刷新；现在可先试原创示范包。';
    status(catalog.length ? '正式目录已更新。已有训练与草稿未改动。' : '正在等待新正式章节发布。示范包可独立试用。');
  } catch (error) {
    if (requestId !== catalogRequest) return;
    catalog = [];
    renderCatalog();
    $('catalogNote').textContent = '未取得最新正式目录，不能创建正式新训练；已有训练与草稿仍可查看。';
    status(errorText(error), 'error');
  } finally { if (requestId === catalogRequest) setBusy(busy); }
}
function renderCatalog() {
  const oldValue = $('chapterSelect').value;
  $('chapterSelect').replaceChildren();
  if (!catalog.length) $('chapterSelect').append(create('option', '暂无可选的正式章节'));
  else for (const ch of catalog) {
    const option = create('option', `${ch.number || '章节'} · ${ch.title}`);
    option.value = `${ch.id}|${ch.digest}`;
    $('chapterSelect').append(option);
  }
  if (catalog.some(ch => `${ch.id}|${ch.digest}` === oldValue)) $('chapterSelect').value = oldValue;
  setBusy(busy);
}
function renderSessions() {
  const select = $('sessionSelect');
  select.replaceChildren();
  const records = Object.values(store.records).filter(validRecord).sort((a, b) => String(b.session.createdAt).localeCompare(String(a.session.createdAt)));
  if (!records.length) { const option = create('option', '尚无本机训练'); option.value = ''; select.append(option); }
  for (const record of records) {
    const date = new Date(record.session.createdAt);
    const time = Number.isNaN(date.valueOf()) ? '' : date.toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const option = create('option', `${time} · ${labelFor(record.source)}${record.saved ? ' · 已存反馈' : ''}`);
    option.value = record.session.id;
    select.append(option);
  }
  if (active && records.some(record => record.session.id === active.session.id)) select.value = active.session.id;
  $('restoreSession').disabled = busy || !select.value;
}
function renderActive(restored = false) {
  const visible = Boolean(active);
  $('trainingSection').hidden = !visible;
  $('reportSection').hidden = !visible;
  $('endSession').hidden = !visible;
  syncExportAvailability();
  if (!active) { renderSessions(); return; }
  $('sessionTitle').textContent = labelFor(active.source);
  $('sessionMeta').textContent = `${active.session.targets.length} 个训练用法 · 固定版本 ${active.source.digest.slice(0, 8)}`;
  $('sessionIdentity').textContent = `训练身份 ${active.session.id}\n章节摘要 ${active.source.digest}`;
  $('restoredNotice').hidden = !restored;
  $('promptPreview').textContent = buildPrompt(active.session, active.source);
  $('reportInput').value = active.draft || '';
  $('reportError').hidden = true;
  $('targetsList').replaceChildren();
  for (const target of active.session.targets) {
    const use = typeof target === 'string' ? active.source.uses.find(use => use.id === target) : target;
    if (!use) continue;
    const row = create('div', undefined, 'target-row');
    row.append(create('strong', `${use.word || use.id}${use.label ? ` · ${use.label}` : ''}`));
    if (use.gloss) row.append(create('p', use.gloss));
    $('targetsList').append(row);
  }
  renderReport();
  renderSessions();
}
function askNew(kind) {
  if (busy) return;
  if (active) {
    pendingNew = kind;
    $('replaceText').textContent = canStore ? '当前训练与粘贴草稿会保留在本机，可随时恢复。新训练使用独立身份。' : '当前浏览器无法持久保存。旧训练暂留本页内存，请先下载本机记录；关闭页面后可能丢失。';
    $('replaceNotice').hidden = false;
    $('replaceNotice').scrollIntoView({ block: 'nearest' });
  } else generate(kind);
}
async function generate(kind) {
  if (busy) return;
  setBusy(true);
  $('replaceNotice').hidden = true;
  pendingNew = null;
  const chosen = catalog.find(ch => `${ch.id}|${ch.digest}` === $('chapterSelect').value);
  const topic = $('topicInput').value.trim();
  status(kind === 'demo' ? '正在准备原创示范训练…' : '正在核对正式章节版本并整理训练材料…');
  try {
    let source;
    if (kind === 'demo') source = await compileChapter(await demoChapter(), { demo: true });
    else {
      freshCatalogVerified = false;
      syncExportAvailability();
      ++catalogRequest;
      if (!chosen) throw new Error('请先刷新目录并选择正式章节。');
      const latest = formalChapters(await api('/api/chapters'));
      if (!latest.some(ch => ch.id === chosen.id && ch.digest === chosen.digest)) throw new Error('所选章节版本已不在当前正式目录。请刷新后重新选择；原训练保持不变。');
      const chapter = await api(`/api/chapters/${encodeURIComponent(chosen.id)}?digest=${encodeURIComponent(chosen.digest)}`);
      if (chapter.id !== chosen.id || chapter.digest !== chosen.digest || chapter.sourcePolicy !== 'current-affairs-v1' || chapter.archived || chapter.historical || chapter.withdrawn) throw new Error('章节回读版本与正式目录不一致，未创建训练。');
      source = await compileChapter(chapter);
      if (source.id !== chosen.id || source.digest !== chosen.digest) throw new Error('训练材料未通过固定版本核对。');
      catalog = latest;
      freshCatalogVerified = true;
      renderCatalog();
    }
    const session = makeSession(source, { history: store.history, topic, count: 4 });
    // A new record never mutates the previous session or its import draft.
    active = { source, session, draft: '', report: null, saved: false };
    store.topic = topic;
    const saved = saveActive();
    renderActive(false);
    status(saved ? '训练包已就绪，并已保留在本机。' : '训练包已就绪。请下载后再离开，本机保存当前不可用。', 'success');
    $('trainingSection').scrollIntoView({ block: 'start', behavior: 'auto' });
  } catch (error) { status(errorText(error), 'error'); }
  finally { setBusy(false); }
}
function fileName(kind, extension = 'txt') {
  return `second-language-${kind}-${active?.session.id || 'local'}.${extension}`.replace(/[^a-zA-Z0-9._-]/g, '-');
}
function download(text, name, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = create('a'); link.href = url; link.download = name;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
async function copyText(text, successMessage) {
  try { await navigator.clipboard.writeText(text); status(successMessage, 'success'); }
  catch {
    // Safari may lack clipboard permission. Select real text so the user can copy manually.
    const area = create('textarea'); area.value = text; area.readOnly = true;
    area.style.position = 'fixed'; area.style.left = '0'; area.style.top = '0'; area.style.width = '1px'; area.style.height = '1px';
    document.body.append(area); area.focus(); area.select(); area.setSelectionRange(0, text.length);
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* offer the existing downloadable file */ }
    area.remove();
    status(copied ? successMessage : '浏览器未允许复制，请下载文本文件，或展开完整指令后手动复制。', copied ? 'success' : 'error');
  }
}
async function sharePrompt() {
  if (!requireExport()) return;
  const file = new File([buildPrompt(active.session, active.source)], fileName('training'), { type: 'text/plain' });
  let supported = false;
  try { supported = Boolean(navigator.share && navigator.canShare?.({ files: [file] })); } catch { /* unsupported */ }
  if (!supported) { status('当前浏览器不支持文件分享，可使用“复制训练指令”或“下载训练包”。'); return; }
  try { await navigator.share({ files: [file], title: '第二语言 · 语音训练包' }); status('系统分享已结束。请在 ChatGPT 中确认文件已附上并发送。'); }
  catch (error) {
    if (error?.name === 'AbortError') { status('已取消分享。训练包保留在本页。'); return; }
    status('系统分享未完成，请改用复制或下载；没有自动发送资料。', 'error');
  }
}
function parseReport() {
  if (!active) return;
  if (active.saved) { status('此训练的原报告已保存锁定；新对话请另建一轮训练。'); return; }
  active.draft = $('reportInput').value;
  saveActive();
  try {
    const report = validateReport(active.draft, active.session);
    active.report = report;
    // Validation is a preview only; the learning history changes after explicit confirmation.
    saveActive();
    $('reportError').hidden = true;
    renderReport();
    status('报告已读取，请逐项核对对话证据。尚未写入练习记录。');
  } catch (error) {
    active.report = null;
    saveActive();
    renderReport();
    $('reportError').textContent = `未导入：${errorText(error)} 原始粘贴内容仍保留。`;
    $('reportError').hidden = false;
    status('报告未通过身份或格式核对，练习记录未改动。', 'error');
  }
}
function renderReport() {
  const report = active?.report;
  $('reportInput').readOnly = Boolean(active?.saved);
  $('reviewReport').disabled = Boolean(active?.saved);
  $('reportFile').disabled = Boolean(active?.saved);
  $('reportReview').hidden = !report;
  $('reportResults').replaceChildren();
  if (!report) return;
  for (const entry of report.entries) {
    const use = active.source.uses.find(use => use.id === entry.useId);
    const row = create('article', undefined, 'result-row');
    row.append(create('h3', `${use?.word || entry.useId} · ${outcomeLabels[entry.outcome] || entry.outcome}`));
    if (use?.gloss) row.append(create('p', use.gloss, 'field-note'));
    row.append(create('p', `提示程度：${String(entry.cueLevel)}`, 'result-label'));
    row.append(create('p', '你实际说的话', 'result-label'));
    row.append(create('blockquote', entry.learnerQuote || '未提供可核对原话，不据此证明独立产出。'));
    if (entry.assistantPrompt) { row.append(create('p', '当时的引导或提示', 'result-label')); row.append(create('blockquote', entry.assistantPrompt)); }
    if (entry.note) row.append(create('p', entry.note));
    for (const warning of entry.warnings || []) row.append(create('p', warning, 'field-note'));
    $('reportResults').append(row);
  }
  $('saveReport').disabled = Boolean(active.saved) || !canStore;
  $('saveReport').textContent = active.saved ? '本轮反馈已保存' : '核对并保存本机';
  $('savedNotice').textContent = active.saved ? '此训练仅保存一次，原报告已锁定。它是练习观察，不是掌握认证。新对话请生成另一轮训练。' : canStore ? '只有你确认后，这份反馈才会参与后续训练目标的选择。' : '本机保存不可用，请下载反馈。';
}
function saveReport() {
  if (!active?.report || active.saved || !canStore) return;
  const oldHistory = store.history;
  try {
    const nextHistory = applyReport(oldHistory, active.session, active.report);
    store.history = nextHistory;
    active.saved = true;
    if (!saveActive()) { store.history = oldHistory; active.saved = false; renderReport(); return; }
    renderReport(); renderSessions();
    status('已保存到本机练习记录。未产生章节认证。', 'success');
  } catch (error) { store.history = oldHistory; active.saved = false; status(`保存未完成：${errorText(error)}`, 'error'); }
}
function exportPracticeRecords() {
  // A user-requested original backup retains historical material for recovery;
  // it never changes current eligibility or becomes an active training export.
  return { ...serializeStore(), archiveOnly: true, exportedAt: new Date().toISOString(), purpose: 'Personal local backup of original chapter snapshots and practice records; not evidence of current training eligibility.' };
}

readLocal();
$('topicInput').value = store.topic || '';
renderActive(Boolean(active));
$('refreshCatalog').addEventListener('click', refreshCatalog);
$('chapterSelect').addEventListener('change', () => setBusy(busy));
$('topicInput').addEventListener('input', () => { store.topic = $('topicInput').value; persistLater(); });
$('generateButton').addEventListener('click', () => askNew('formal'));
$('demoButton').addEventListener('click', () => askNew('demo'));
$('confirmNewButton').addEventListener('click', () => pendingNew && generate(pendingNew));
$('cancelNewButton').addEventListener('click', () => { pendingNew = null; $('replaceNotice').hidden = true; });
$('copyPrompt').addEventListener('click', () => requireExport() && copyText(buildPrompt(active.session, active.source), '训练指令已复制，可粘贴到 ChatGPT 新对话。'));
$('sharePrompt').addEventListener('click', sharePrompt);
$('downloadPrompt').addEventListener('click', () => requireExport() && download(buildPrompt(active.session, active.source), fileName('training')));
$('downloadChapter').addEventListener('click', () => requireExport() && download(active.source.markdown, fileName('chapter')));
$('copyReportRequest').addEventListener('click', () => active && copyText(buildReportRequest(active.session), '会后请求已复制，请发回刚才的 ChatGPT 对话。'));
$('reportInput').addEventListener('input', () => { if (!active) return; active.draft = $('reportInput').value; active.report = null; saveActive(true); renderReport(); });
$('reviewReport').addEventListener('click', parseReport);
$('reportFile').addEventListener('change', async event => {
  const file = event.target.files?.[0]; event.target.value = '';
  if (!file || !active) return;
  if (file.size > MAX_REPORT_BYTES) { $('reportError').textContent = '文件过大，请选择不超过 200 KB 的会后 JSON。'; $('reportError').hidden = false; return; }
  const sessionId = active.session.id;
  try {
    const text = await file.text();
    if (active?.session.id !== sessionId) { status('训练已切换，未把文件混入当前会话。', 'error'); return; }
    if (active.saved) { status('此训练的原报告已保存，未用文件覆盖。'); return; }
    if (active.draft?.trim()) { status('当前已有报告草稿。请先导出保留，或明确清空输入框后再选文件，避免覆盖。', 'error'); return; }
    $('reportInput').value = text; active.draft = text; saveActive(); parseReport();
  } catch { status('无法读取本地文件。原报告草稿保持不变。', 'error'); }
});
$('saveReport').addEventListener('click', saveReport);
$('downloadReport').addEventListener('click', () => active?.report && download(JSON.stringify(active.report, null, 2), fileName('feedback', 'json'), 'application/json'));
$('sessionSelect').addEventListener('change', () => { $('restoreSession').disabled = busy || !$('sessionSelect').value; });
$('restoreSession').addEventListener('click', () => {
  const record = store.records[$('sessionSelect').value]; if (!validRecord(record) || busy) return;
  if (active) saveActive(); active = record; store.activeId = active.session.id; persist(); renderActive(true);
  status('已恢复所选训练及其报告草稿。'); $('trainingSection').scrollIntoView({ block: 'start' });
});
$('exportRecords').addEventListener('click', () => download(JSON.stringify(exportPracticeRecords(), null, 2), 'second-language-voice-lab-local-records.json', 'application/json'));
$('endSession').addEventListener('click', () => {
  if (!active || busy) return;
  const saved = saveActive();
  if (!saved) { status('当前浏览器无法保留草稿，请先下载本机记录，再新建训练。', 'error'); return; }
  active = null; store.activeId = null; persist(); renderActive();
  $('replaceNotice').hidden = true; pendingNew = null;
  status('当前训练已结束，原训练与草稿保留在本机，可从列表恢复。');
});
$('clearRecords').addEventListener('click', () => { $('clearNotice').hidden = false; });
$('cancelClear').addEventListener('click', () => { $('clearNotice').hidden = true; });
$('confirmClear').addEventListener('click', () => {
  clearTimeout(saveTimer);
  saveTimer = null;
  try { localStorage.removeItem(STORAGE_KEY); }
  catch { status('浏览器未允许清除，请使用浏览器的站点数据管理。', 'error'); return; }
  store = { version: 1, activeId: null, records: {}, history: {}, topic: '' }; active = null;
  canStore = true; $('storageNotice').hidden = true;
  $('topicInput').value = ''; $('clearNotice').hidden = true; $('replaceNotice').hidden = true; pendingNew = null;
  renderActive(); status('已清除此设备的语音试验记录，其他项目数据未改动。');
});
window.addEventListener('pagehide', () => { if (saveTimer !== null) persist(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && saveTimer !== null) persist(); });
window.addEventListener('offline', () => {
  freshCatalogVerified = false; syncExportAvailability();
  if (active?.source.kind !== 'demo') status('网络已离线。原训练与报告草稿保留，联网刷新目录后可继续训练。');
});
refreshCatalog();
