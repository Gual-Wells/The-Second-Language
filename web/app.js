const $ = id => document.getElementById(id);
const todayParts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map(part => [part.type, part.value]));
const TODAY = `${todayParts.year}-${todayParts.month}-${todayParts.day}`;
const STORAGE = 'second-language-progress-pending-v1';
const state = { chapters: [], current: null, month: TODAY.slice(0, 7), part: 'one', difficulty: null, progress: {}, demo: false, authenticated: false, installPrompt: null };

function toast(message) {
  const el = $('toast'); el.textContent = message; el.classList.add('visible');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('visible'), 3000);
}

function formatDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const [year, month, day] = date.split('-'); return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}

function parseParts(markdown) {
  const parts = { one: '', two: '', three: '' };
  const matches = [...markdown.matchAll(/^<!-- PART:(one|two|three) -->\s*$/gm)];
  matches.forEach((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? markdown.length;
    parts[match[1]] = markdown.slice(start, end).trim();
  });
  return parts;
}

function renderMarkdown(source, target) {
  target.replaceChildren();
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  let paragraph = [], list = null, quote = null;
  const inline = (el, value) => {
    const pattern = /\*\*([^*]+)\*\*|`([^`]+)`/g; let last = 0, match;
    while ((match = pattern.exec(value))) { el.append(document.createTextNode(value.slice(last, match.index))); const child = document.createElement(match[1] ? 'strong' : 'code'); child.textContent = match[1] || match[2]; el.append(child); last = pattern.lastIndex; }
    el.append(document.createTextNode(value.slice(last)));
  };
  const flushParagraph = () => { if (paragraph.length) { const p = document.createElement('p'); inline(p, paragraph.join(' ').trim()); (quote || target).append(p); paragraph = []; } };
  const flushList = () => { list = null; };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushParagraph(); flushList(); quote = null; continue; }
    const h = /^(#{1,2})\s+(.+)$/.exec(line);
    if (h) { flushParagraph(); flushList(); quote = null; const el = document.createElement(`h${h[1].length}`); el.textContent = h[2]; target.append(el); continue; }
    if (/^---+$/.test(line)) { flushParagraph(); flushList(); quote = null; target.append(document.createElement('hr')); continue; }
    if (/^`[^`]+`$/.test(line)) { flushParagraph(); flushList(); quote = null; const el = document.createElement('code'); el.className = 'mono'; el.textContent = line.slice(1, -1); target.append(el); continue; }
    if (line.startsWith('> ')) { flushParagraph(); flushList(); if (!quote) { quote = document.createElement('blockquote'); target.append(quote); } paragraph.push(line.slice(2)); continue; }
    if (/^[-*]\s+/.test(line)) { flushParagraph(); quote = null; if (!list) { list = document.createElement('ul'); target.append(list); } const li = document.createElement('li'); inline(li, line.slice(2)); list.append(li); continue; }
    flushList(); paragraph.push(line);
  }
  flushParagraph();
}

function monthShift(value, offset) {
  const [year, month] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offset, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function renderCalendar() {
  const [year, month] = state.month.split('-').map(Number);
  $('monthPicker').value = state.month;
  const start = new Date(Date.UTC(year, month - 1, 1));
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const offset = (start.getUTCDay() + 6) % 7;
  const map = new Map(state.chapters.map(chapter => [chapter.date, chapter]));
  const calendar = $('calendar'); calendar.replaceChildren();
  for (let i = 0; i < offset; i++) calendar.append(document.createElement('span'));
  for (let day = 1; day <= days; day++) {
    const date = `${state.month}-${String(day).padStart(2, '0')}`;
    const button = document.createElement('button'); button.type = 'button'; button.textContent = String(day);
    if (map.has(date)) { button.classList.add('has-chapter'); button.title = map.get(date).title; button.addEventListener('click', () => openChapter(map.get(date).id)); }
    else button.disabled = true;
    if (date === TODAY) button.classList.add('today');
    if (state.current?.date === date) button.classList.add('selected');
    calendar.append(button);
  }
}

function renderList() {
  $('chapterCount').textContent = `${state.chapters.length} 章`;
  const list = $('chapterList'); list.replaceChildren();
  for (const chapter of [...state.chapters].sort((a, b) => b.date.localeCompare(a.date))) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'chapter-item';
    if (state.current?.id === chapter.id) button.classList.add('active');
    const small = document.createElement('span'); small.textContent = `${formatDate(chapter.date)} · ${chapter.number || '每日课程'}`;
    const title = document.createElement('strong'); title.textContent = chapter.title;
    button.append(small, title); button.addEventListener('click', () => openChapter(chapter.id)); list.append(button);
  }
}

async function api(path, options = {}) {
  const response = await fetch(path, { credentials: 'same-origin', cache: 'no-store', ...options });
  let data; try { data = await response.json(); } catch { data = {}; }
  if (!response.ok) throw new Error(data.error || `请求失败 (${response.status})`);
  return data;
}

function localPending() { try { return JSON.parse(localStorage.getItem(STORAGE) || '{}'); } catch { return {}; } }
function savePending(value) { localStorage.setItem(STORAGE, JSON.stringify(value)); }
async function flushPending() {
  if (state.demo || !navigator.onLine || !state.authenticated) return;
  const pending = localPending();
  for (const [id, progress] of Object.entries(pending)) {
    try { await api(`/api/progress/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(progress) }); delete pending[id]; savePending(pending); }
    catch { $('syncStatus').textContent = '反馈等待同步'; return; }
  }
  $('syncStatus').textContent = '课程已同步';
}

async function loadProgress(id) {
  const pending = localPending();
  if (pending[id]) return pending[id];
  if (state.demo) return JSON.parse(localStorage.getItem(`second-language-demo-${id}`) || '{}');
  try { return await api(`/api/progress/${encodeURIComponent(id)}`); } catch { return {}; }
}

function renderProgress() {
  const progress = state.progress;
  state.difficulty = progress.difficulty || null;
  $('readingNote').value = progress.note || '';
  document.querySelectorAll('[data-difficulty]').forEach(button => button.classList.toggle('selected', button.dataset.difficulty === state.difficulty));
  $('readState').textContent = progress.completed ? '已阅读' : '尚未标记阅读';
}

async function openChapter(id) {
  try {
    const chapter = await api(`/api/chapters/${encodeURIComponent(id)}`);
    state.current = chapter; state.part = 'one'; state.month = chapter.date.slice(0, 7);
    state.progress = await loadProgress(id);
    $('chapterDate').textContent = formatDate(chapter.date);
    $('chapterNumber').textContent = chapter.number || '每日课程';
    $('chapterTitle').textContent = chapter.title;
    $('chapterSubtitle').textContent = chapter.subtitle || '今天，从新的词语走向新的表达。';
    $('wordCount').textContent = `${chapter.wordCount || 0} 个主词`;
    $('reader').hidden = false; $('emptyState').hidden = true;
    renderProgress(); renderCalendar(); renderList(); showPart('one');
    history.replaceState(null, '', `/?chapter=${encodeURIComponent(id)}`);
    $('reader').scrollIntoView({ behavior: 'smooth', block: 'start' });
    $('rail').classList.remove('open');
  } catch (error) { toast(error.message); }
}

function showPart(part) {
  if (!state.current) return;
  state.part = part;
  document.querySelectorAll('[data-part]').forEach(button => button.classList.toggle('active', button.dataset.part === part));
  renderMarkdown(parseParts(state.current.markdown)[part], $('article'));
}

const fromBase64url = value => Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=')), c => c.charCodeAt(0));
const toBase64url = value => btoa(String.fromCharCode(...new Uint8Array(value))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function passkey(kind, setupKey) {
  if (!window.PublicKeyCredential) throw new Error('此浏览器不支持通行密钥');
  const payload = kind === 'enroll' ? { setupKey } : {};
  const { options, ticket } = await api(`/auth/${kind}/options`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  let credential, response;
  if (kind === 'enroll') {
    const publicKey = window.PublicKeyCredential.parseCreationOptionsFromJSON
      ? PublicKeyCredential.parseCreationOptionsFromJSON(options)
      : { ...options, challenge: fromBase64url(options.challenge), user: { ...options.user, id: fromBase64url(options.user.id) }, excludeCredentials: (options.excludeCredentials || []).map(x => ({ ...x, id: fromBase64url(x.id) })) };
    credential = await navigator.credentials.create({ publicKey });
    response = { id: credential.id, rawId: toBase64url(credential.rawId), type: credential.type, response: { attestationObject: toBase64url(credential.response.attestationObject), clientDataJSON: toBase64url(credential.response.clientDataJSON), transports: credential.response.getTransports?.() || [] }, clientExtensionResults: credential.getClientExtensionResults() };
  } else {
    const publicKey = window.PublicKeyCredential.parseRequestOptionsFromJSON
      ? PublicKeyCredential.parseRequestOptionsFromJSON(options)
      : { ...options, challenge: fromBase64url(options.challenge), allowCredentials: (options.allowCredentials || []).map(x => ({ ...x, id: fromBase64url(x.id) })) };
    credential = await navigator.credentials.get({ publicKey });
    response = { id: credential.id, rawId: toBase64url(credential.rawId), type: credential.type, response: { authenticatorData: toBase64url(credential.response.authenticatorData), clientDataJSON: toBase64url(credential.response.clientDataJSON), signature: toBase64url(credential.response.signature), userHandle: credential.response.userHandle ? toBase64url(credential.response.userHandle) : undefined }, clientExtensionResults: credential.getClientExtensionResults() };
  }
  await api(`/auth/${kind}/verify`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ticket, response, setupKey }) });
}

async function signIn() {
  try {
    const status = await api('/auth/status');
    if (!status.enrolled) {
      if (!status.enrollmentOpen) { toast('登记窗口尚未开放'); return; }
      const key = prompt('请输入后台设置的初始化密钥'); if (!key) return;
      await passkey('enroll', key);
    }
    await passkey('login');
    await initialize();
  } catch (error) { toast(error.message); }
}

async function initialize() {
  try {
    const session = await api('/api/session');
    state.demo = Boolean(session.demo); state.authenticated = Boolean(session.authenticated);
    $('loginButton').hidden = state.authenticated; $('logoutButton').hidden = !state.authenticated || state.demo;
    $('pushButton').hidden = !state.authenticated || state.demo || !('PushManager' in window);
    if (!state.authenticated) { $('emptyState').hidden = false; $('reader').hidden = true; $('syncStatus').textContent = '登录后阅读'; return; }
    const result = await api('/api/chapters');
    state.chapters = result.chapters || [];
    renderCalendar(); renderList();
    if (state.demo) $('studyGoal').value = localStorage.getItem('second-language-demo-goal') || '';
    else { try { $('studyGoal').value = (await api('/api/settings')).goal || ''; } catch {} }
    $('syncStatus').textContent = state.demo ? '演示章节 · 本地预览' : '课程已同步';
    await flushPending();
    const requested = new URLSearchParams(location.search).get('chapter');
    const selected = state.chapters.find(chapter => chapter.id === requested) || state.chapters.find(chapter => chapter.date === TODAY) || [...state.chapters].sort((a, b) => b.date.localeCompare(a.date))[0];
    if (selected) await openChapter(selected.id); else $('emptyState').hidden = false;
  } catch (error) { $('syncStatus').textContent = '连接暂不可用'; toast(error.message); }
}

$('prevMonth').addEventListener('click', () => { state.month = monthShift(state.month, -1); renderCalendar(); });
$('nextMonth').addEventListener('click', () => { state.month = monthShift(state.month, 1); renderCalendar(); });
$('monthPicker').addEventListener('change', event => { if (/^\d{4}-\d{2}$/.test(event.target.value)) { state.month = event.target.value; renderCalendar(); } });
$('todayMonth').addEventListener('click', () => { state.month = TODAY.slice(0, 7); renderCalendar(); });
$('menuButton').addEventListener('click', () => $('rail').classList.toggle('open'));
document.querySelectorAll('[data-part]').forEach(button => button.addEventListener('click', () => showPart(button.dataset.part)));
document.querySelectorAll('[data-difficulty]').forEach(button => button.addEventListener('click', () => { state.difficulty = button.dataset.difficulty; renderProgressChoice(); }));
function renderProgressChoice() { document.querySelectorAll('[data-difficulty]').forEach(button => button.classList.toggle('selected', button.dataset.difficulty === state.difficulty)); }
$('saveProgress').addEventListener('click', async () => {
  if (!state.current) return;
  const progress = { completed: true, difficulty: state.difficulty, note: $('readingNote').value.trim().slice(0, 2000), updatedAt: new Date().toISOString() };
  state.progress = progress; renderProgress();
  if (state.demo) { localStorage.setItem(`second-language-demo-${state.current.id}`, JSON.stringify(progress)); toast('已保存到本机'); return; }
  const pending = localPending(); pending[state.current.id] = progress; savePending(pending);
  await flushPending(); toast(localPending()[state.current.id] ? '已保存，联网后同步' : '学习反馈已保存');
});
$('loginButton').addEventListener('click', signIn);
$('saveGoal').addEventListener('click', async () => {
  const goal = $('studyGoal').value.trim();
  if (state.demo) { localStorage.setItem('second-language-demo-goal', goal); toast('学习目标已保存在本机'); return; }
  try { await api('/api/settings', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ goal }) }); toast('学习目标已保存'); }
  catch (error) { toast(error.message); }
});
$('pushButton').addEventListener('click', async () => {
  try {
    const { publicKey } = await api('/api/push/public-key');
    if (!publicKey) throw new Error('提醒尚未配置');
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: fromBase64url(publicKey) });
    await api('/api/push/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(subscription.toJSON()) });
    $('pushButton').textContent = '提醒已开启'; toast('新章节发布后将尝试推送提醒');
  } catch (error) { toast(error.message); }
});
$('logoutButton').addEventListener('click', async () => { try { await api('/auth/logout', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }); navigator.serviceWorker?.controller?.postMessage({ type: 'CLEAR_CHAPTER_CACHE' }); state.authenticated = false; state.chapters = []; state.current = null; renderCalendar(); renderList(); $('reader').hidden = true; $('emptyState').hidden = false; $('loginButton').hidden = false; $('logoutButton').hidden = true; toast('已退出'); } catch (error) { toast(error.message); } });
window.addEventListener('online', () => flushPending());
window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); state.installPrompt = event; $('installButton').hidden = false; });
$('installButton').addEventListener('click', async () => { if (state.installPrompt) { await state.installPrompt.prompt(); state.installPrompt = null; $('installButton').hidden = true; } });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
initialize();
