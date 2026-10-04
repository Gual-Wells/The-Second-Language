import {installNativeSpeech} from './native-speech.js?v=13';
import { parseParts, renderPart } from './render.js?v=13';
import { validateAnnotatedContent } from './annotations.js?v=13';
import { createPracticeUI } from './practice.js?v=13';

const $ = id => document.getElementById(id);
const todayParts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map(part => [part.type, part.value]));
const TODAY = `${todayParts.year}-${todayParts.month}-${todayParts.day}`;
const PENDING_KEY = 'second-language-progress-pending-v1';
const POSITION_KEY = 'second-language-reader-positions-v1';
const LAST_PART_KEY = 'second-language-last-part-v1';
const DISPLAY_KEY = 'second-language-article-display-v1';
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const state = { chapters: [], temporary: [], current: null, lastDailyId: null, parts: {}, words: [], useLabels: new Map(), hasAnnotations: false, highlight: false, translations: false, month: TODAY.slice(0, 7), part: 'one', difficulty: null, progress: {}, demo: false, authenticated: false, authStatus: null, installPrompt: null, chapterRequest: 0 };

if (standalone()) {
  const stopZoom = event => event.preventDefault();
  document.addEventListener('gesturestart', stopZoom, { passive: false });
  document.addEventListener('gesturechange', stopZoom, { passive: false });
  document.addEventListener('touchmove', event => { if (event.touches.length > 1) event.preventDefault(); }, { passive: false });
}

function toast(message) {
  const element = $('toast');
  element.textContent = message;
  element.classList.add('visible');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove('visible'), 3300);
}

const nativeSpeech=installNativeSpeech({toast});

function clearBadge() { if ('clearAppBadge' in navigator) { try { Promise.resolve(navigator.clearAppBadge()).catch(() => {}); } catch {} } }

function setSyncStatus(message, offline = false) {
  $('syncStatus').textContent = message;
  $('statusLamp').classList.toggle('offline', offline);
}

function showDialog(id) {
  nativeSpeech.stop();
  const dialog = $(id);
  if (!dialog.open) dialog.showModal();
}

function closeDialog(id) { if ($(id).open) $(id).close(); }

function formatDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return date || '';
  const [year, month, day] = date.split('-').map(Number);
  return `${year} 年 ${month} 月 ${day} 日`;
}

function monthShift(value, offset) {
  const [year, month] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offset, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function weekDates(anchor) {
  const date = new Date(`${anchor}T00:00:00Z`);
  const day = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - day);
  return Array.from({ length: 7 }, (_, index) => {
    const item = new Date(date);
    item.setUTCDate(date.getUTCDate() + index);
    return item.toISOString().slice(0, 10);
  });
}

function sortedChapters() { return [...state.chapters].sort((a, b) => a.date.localeCompare(b.date)); }

function renderDayStrip() {
  const strip = $('dayStrip');
  strip.replaceChildren();
  const byDate = new Map(state.chapters.map(chapter => [chapter.date, chapter]));
  const anchor = state.current?.date || sortedChapters().at(-1)?.date || TODAY;
  for (const [index, date] of weekDates(anchor).entries()) {
    const button = document.createElement('button');
    button.className = 'day-chip';
    button.type = 'button';
    button.disabled = !byDate.has(date);
    button.title = byDate.get(date)?.title || `${formatDate(date)} · 尚未发布`;
    button.setAttribute('aria-label', button.title);
    if (byDate.has(date)) button.classList.add('has-chapter');
    if (date === TODAY) button.classList.add('today');
    if (date === state.current?.date) button.classList.add('selected');
    const dow = document.createElement('span');
    dow.className = 'dow';
    dow.textContent = '一二三四五六日'[index];
    const dom = document.createElement('span');
    dom.className = 'dom';
    dom.textContent = String(Number(date.slice(-2)));
    button.append(dow, dom);
    if (byDate.has(date)) button.addEventListener('click', () => openChapter(byDate.get(date).id));
    strip.append(button);
  }
}

function renderChapterNavigation() {
  const chapters = sortedChapters();
  const index = chapters.findIndex(chapter => chapter.id === state.current?.id);
  $('previousChapter').disabled = index <= 0;
  $('nextChapter').disabled = index < 0 || index === chapters.length - 1;
  $('chapterJump').disabled = !state.authenticated;
  $('calendarButton').disabled = !state.authenticated;
  $('currentDateLabel').textContent = state.current ? formatDate(state.current.date) : chapters.length ? '选择阅读日期' : '今日课程';
  $('chapterNavSubtitle').textContent = state.current ? `${state.current.number || '每日课程'} · ${state.current.title}` : chapters.length ? `${chapters.length} 章已发布` : '按日期阅读每日一章';
  $('headerMeta').textContent = state.demo ? '本地预览 · 演示章节' : state.authenticated ? `每日阅读 · ${chapters.length} 章已发布` : '个人课程 · 通行密钥登录';
  renderDayStrip();
}

function renderCalendar() {
  $('monthPicker').value = state.month;
  const [year, month] = state.month.split('-').map(Number);
  const first = new Date(Date.UTC(year, month - 1, 1));
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const offset = (first.getUTCDay() + 6) % 7;
  const byDate = new Map(state.chapters.map(chapter => [chapter.date, chapter]));
  const calendar = $('calendar');
  calendar.replaceChildren();
  for (let i = 0; i < offset; i++) calendar.append(document.createElement('span'));
  for (let day = 1; day <= days; day++) {
    const date = `${state.month}-${String(day).padStart(2, '0')}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = String(day);
    button.disabled = !byDate.has(date);
    button.setAttribute('aria-label', `${formatDate(date)}${byDate.has(date) ? `，${byDate.get(date).title}` : '，尚未发布'}`);
    if (byDate.has(date)) { button.classList.add('has-chapter'); button.addEventListener('click', () => openChapter(byDate.get(date).id)); }
    if (date === TODAY) button.classList.add('today');
    if (date === state.current?.date) button.classList.add('selected');
    calendar.append(button);
  }
  const monthly = sortedChapters().filter(chapter => chapter.date.startsWith(state.month)).reverse();
  $('chapterCount').textContent = `${monthly.length} 章`;
  const list = $('chapterList');
  list.replaceChildren();
  if (!monthly.length) { const p = document.createElement('p'); p.className = 'chapter-list-empty'; p.textContent = '这个月还没有已发布的章节。'; list.append(p); }
  for (const chapter of monthly) {
    const button = document.createElement('button');
    button.className = 'chapter-item';
    button.type = 'button';
    if (chapter.id === state.current?.id) button.classList.add('active');
    const date = document.createElement('span');
    date.textContent = `${formatDate(chapter.date)} · ${chapter.number || '每日课程'}`;
    const title = document.createElement('strong');
    title.textContent = chapter.title;
    button.append(date, title);
    button.addEventListener('click', () => openChapter(chapter.id));
    list.append(button);
  }
}

async function api(path, options = {}) {
  const response = await fetch(path, { credentials: 'same-origin', cache: 'no-store', ...options });
  let data;
  try { data = await response.json(); } catch { data = {}; }
  if (!response.ok) throw new Error(data.error || `请求失败 (${response.status})`);
  return data;
}

function readStored(key) { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; } }
function writeStored(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
function positionId(part = state.part) { return `${state.current?.digest || state.current?.id || ''}:${part}`; }
function saveReadingPosition() {
  if (!state.current) return;
  const positions = readStored(POSITION_KEY);
  positions[positionId()] = Math.round($('readingScroll').scrollTop);
  const keys = Object.keys(positions);
  for (const key of keys.slice(0, Math.max(0, keys.length - 90))) delete positions[key];
  writeStored(POSITION_KEY, positions);
}

function localPending() { return readStored(PENDING_KEY); }
async function flushPending() {
  if (state.demo || !state.authenticated || !navigator.onLine) return;
  const pending = localPending();
  for (const [id, progress] of Object.entries(pending)) {
    try {
      await api(`/api/progress/${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(progress) });
      delete pending[id];
      writeStored(PENDING_KEY, pending);
    } catch { setSyncStatus('学习反馈等待联网同步', true); return; }
  }
  setSyncStatus('课程与反馈已同步');
}

async function loadProgress(id) {
  const pending = localPending();
  if (pending[id]) return pending[id];
  if (state.demo) return readStored(`second-language-demo-${id}`);
  try { return await api(`/api/progress/${encodeURIComponent(id)}`); } catch { return {}; }
}

function renderProgress() {
  state.difficulty = state.progress.difficulty || null;
  $('readingNote').value = state.progress.note || '';
  $('readState').textContent = state.progress.completed ? '已完成阅读' : '尚未记录完成';
  for (const button of document.querySelectorAll('[data-difficulty]')) button.classList.toggle('selected', button.dataset.difficulty === state.difficulty);
}

function updateReadingPosition() {
  if (!state.current) { $('readingPosition').textContent = ''; return; }
  if (state.words.length) {
    const top = $('readingScroll').getBoundingClientRect().top + 12;
    let active = 0;
    for (let index = 0; index < state.words.length; index++) {
      if (state.words[index].element.getBoundingClientRect().top <= top) active = index;
      else break;
    }
    $('readingPosition').textContent = `${active + 1} / ${state.words.length} · ${state.words[active]?.text || ''}`;
  } else {
    const panel = $('readingScroll');
    const total = Math.max(1, panel.scrollHeight - panel.clientHeight);
    $('readingPosition').textContent = `阅读进度 ${Math.min(100, Math.round(panel.scrollTop / total * 100))}%`;
  }
}

function renderIndex(filter = '') {
  const query = filter.trim().toLocaleLowerCase();
  const list = $('indexList');
  list.replaceChildren();
  for (const [index, word] of state.words.entries()) {
    if (query && !word.text.toLocaleLowerCase().includes(query)) continue;
    const button = document.createElement('button');
    button.className = 'index-item';
    button.type = 'button';
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    const label = document.createElement('strong');
    label.textContent = word.text;
    button.append(number, label);
    button.addEventListener('click', () => { closeDialog('indexDialog'); word.element.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    list.append(button);
  }
  if (!list.childElementCount) { const p = document.createElement('p'); p.className = 'chapter-list-empty'; p.textContent = '没有匹配的词条。'; list.append(p); }
}

function prepareContent(markdown, id) {
  state.parts = parseParts(markdown);
  try {
    const annotated = validateAnnotatedContent(markdown);
    state.useLabels = new Map([...annotated.uses].map(([code, item]) => [code, item.label]));
    state.hasAnnotations = true;
  } catch { state.useLabels = new Map(); state.hasAnnotations = false; }
  const display = readStored(DISPLAY_KEY)[id] || {};
  state.highlight = Boolean(display.highlight);
  state.translations = Boolean(display.translations);
}

function rememberDisplay() {
  const display = readStored(DISPLAY_KEY);
  display[state.current.id] = { highlight: state.highlight, translations: state.translations };
  const keys = Object.keys(display);
  for (const key of keys.slice(0, Math.max(0, keys.length - 90))) delete display[key];
  writeStored(DISPLAY_KEY, display);
}

function jumpTo(part, code) {
  showPart(part, true);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const target = [...$('article').querySelectorAll('[data-use-id]')].find(element => element.dataset.useId === code);
    if (!target) { toast(`没有找到 ${code} 的对应内容`); return; }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

function openSentenceReference(codes) {
  const refs = [...new Set(codes)].filter(code => state.useLabels.has(code));
  if (!refs.length) { toast('这一句没有可定位的用法'); return; }
  if (refs.length === 1) { jumpTo('one', refs[0]); return; }
  const list = $('usageChoices'); list.replaceChildren();
  for (const code of refs) {
    const button = document.createElement('button'); button.type = 'button';
    const small = document.createElement('small'); small.textContent = code;
    const label = document.createElement('strong'); label.textContent = state.useLabels.get(code);
    button.append(small, label);
    button.addEventListener('click', () => { closeDialog('usageDialog'); jumpTo('one', code); });
    list.append(button);
  }
  showDialog('usageDialog');
}

function showPart(part, restore = false, rememberCurrent = true) {
  nativeSpeech.stop();
  if (!state.current || !['one', 'two', 'three'].includes(part)) return;
  if (rememberCurrent) saveReadingPosition();
  state.part = part;
  const labels = { one: ['PART 01', '词汇与用法', '按词序阅读'], two: ['PART 02', '例句与翻译', '联系语境'], three: ['PART 03', state.current.kind === 'review' ? '原文摘句' : '任意文', '完整阅读'] };
  $('partNumber').textContent = labels[part][0];
  $('partTitle').textContent = labels[part][1];
  $('partSummary').textContent = labels[part][2];
  for (const button of document.querySelectorAll('[data-part]')) {
    const active = button.dataset.part === part;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  }
  state.words = renderPart(state.parts[part] || '', part, $('article'), { highlight: state.highlight, translations: state.translations, onJump: jumpTo, onSentence: openSentenceReference });
  $('articleTools').hidden = part !== 'three' || !state.hasAnnotations;
  $('highlightButton').setAttribute('aria-pressed', String(state.highlight));
  $('translationButton').setAttribute('aria-pressed', String(state.translations));
  $('wordIndexButton').hidden = !state.words.length;
  $('reflection').hidden = part !== 'three' || Boolean(state.current.kind);
  $('indexTitle').textContent = part === 'one' ? '词汇与用法索引' : '例句与翻译索引';
  const lastParts = readStored(LAST_PART_KEY);
  lastParts[state.current.id] = part;
  writeStored(LAST_PART_KEY, lastParts);
  requestAnimationFrame(() => {
    $('readingScroll').scrollTop = restore ? Number(readStored(POSITION_KEY)[positionId(part)] || 0) : 0;
    updateReadingPosition();
  });
}

async function openChapter(id, resume = true) {
  nativeSpeech.stop();
  const request = ++state.chapterRequest;
  saveReadingPosition();
  setSyncStatus(navigator.onLine ? '正在打开章节…' : '正在读取离线章节', !navigator.onLine);
  try {
    const chapter = await api(`/api/chapters/${encodeURIComponent(id)}`);
    const progress = await loadProgress(id);
    if (request !== state.chapterRequest) return;
    state.current = chapter;
    state.lastDailyId = id;
    state.current.digest = state.chapters.find(item => item.id === id)?.digest || chapter.digest;
    prepareContent(chapter.markdown, id);
    state.progress = progress;
    state.month = chapter.date.slice(0, 7);
    $('chapterDate').textContent = formatDate(chapter.date);
    $('chapterNumber').textContent = chapter.number || '每日课程';
    $('chapterTitle').textContent = chapter.title;
    $('chapterSubtitle').textContent = chapter.subtitle || '';
    $('wordCount').textContent = `${chapter.wordCount || 0} 个主词`;
    $('loadingState').hidden = true;
    $('loginState').hidden = true;
    $('emptyState').hidden = true;
    $('reader').hidden = false;
    $('app').classList.remove('empty-mode');
    $('app').classList.remove('temporary-mode');
    $('temporaryRibbon').hidden = true;
    renderProgress();
    renderChapterNavigation();
    renderCalendar();
    const saved = readStored(LAST_PART_KEY)[id];
    showPart(resume && ['one', 'two', 'three'].includes(saved) ? saved : 'one', resume, false);
    closeDialog('calendarDialog');
    history.replaceState(null, '', `/?chapter=${encodeURIComponent(id)}`);
    setSyncStatus(state.demo ? '演示章节 · 本地预览' : navigator.onLine ? '课程与反馈已同步' : '离线阅读', !navigator.onLine);
  } catch (error) { if (request === state.chapterRequest) { setSyncStatus('章节暂不可用', true); toast(error.message); } }
}

function expiryText(timestamp) {
  const remaining = Math.max(0, timestamp - Date.now());
  if (!remaining) return '已到期';
  const hours = Math.ceil(remaining / 3600000);
  return hours >= 24 ? `剩余 ${Math.floor(hours / 24)} 天 ${hours % 24} 小时` : `剩余 ${hours} 小时`;
}

function renderTemporaryList() {
  const pages = state.temporary.filter(page => page.expiresAt > Date.now());
  $('temporaryCount').hidden = pages.length === 0;
  $('temporaryCount').textContent = String(pages.length);
  const list = $('temporaryList');
  list.replaceChildren();
  if (!pages.length) {
    const empty = document.createElement('p'); empty.className = 'chapter-list-empty';
    empty.textContent = '目前没有有效的临时页。'; list.append(empty); return;
  }
  for (const page of pages) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'temporary-item';
    if (state.current?.id === page.id) button.classList.add('active');
    const title = document.createElement('strong'); title.textContent = `${page.kind === 'review' ? '复习' : '测试'} · ${page.title}`;
    const expiry = document.createElement('small'); expiry.textContent = expiryText(page.expiresAt);
    const subtitle = document.createElement('span'); subtitle.textContent = page.subtitle || `${page.wordCount} 个词条`;
    button.append(title, expiry, subtitle);
    button.addEventListener('click', () => openTemporary(page.id));
    list.append(button);
  }
}

async function refreshTemporary() {
  if (state.demo || !state.authenticated) return;
  try { state.temporary = (await api('/api/temporary')).pages || []; renderTemporaryList(); }
  catch (error) { toast(error.message); }
}

function showTemporaryRequestBox() { $('temporaryRequestBox').hidden = !$('temporaryRequestToggle').checked; }

async function refreshSettings() {
  if (!state.authenticated || state.demo) return;
  try {
    const settings = await api('/api/settings');
    $('studyGoal').value = settings.goal || '';
    $('temporaryRequestToggle').checked = Boolean(settings.temporaryRequested);
    $('temporaryRequestText').value = settings.temporaryRequestText || '';
    $('restToggle').checked = Boolean(settings.restRequested);
    showTemporaryRequestBox();
  } catch (error) { toast(error.message); }
}

async function openTemporary(id, resume = true) {
  nativeSpeech.stop();
  const request = ++state.chapterRequest;
  saveReadingPosition();
  setSyncStatus('正在打开临时页…');
  try {
    const page = await api(`/api/temporary/${encodeURIComponent(id)}`);
    if (request !== state.chapterRequest) return;
    state.current = page;
    prepareContent(page.markdown, id);
    $('chapterDate').textContent = page.kind === 'review' ? '复习阅读' : '测试阅读';
    $('chapterNumber').textContent = '48 小时临时页';
    $('chapterTitle').textContent = page.title;
    $('chapterSubtitle').textContent = page.subtitle || '';
    $('wordCount').textContent = `${page.wordCount} 个词条`;
    $('readState').textContent = expiryText(page.expiresAt);
    $('temporaryKind').textContent = page.kind === 'review' ? '复习页 · 已有章节摘录' : '测试页 · 现有文档';
    $('temporaryExpiry').textContent = `发布后 48 小时到期 · ${expiryText(page.expiresAt)}`;
    $('temporaryRibbon').hidden = false;
    $('loadingState').hidden = true; $('loginState').hidden = true; $('emptyState').hidden = true; $('reader').hidden = false;
    $('app').classList.remove('empty-mode'); $('app').classList.add('temporary-mode');
    for (const button of document.querySelectorAll('[data-part]')) button.disabled = false;
    const saved = readStored(LAST_PART_KEY)[id];
    showPart(resume && ['one', 'two', 'three'].includes(saved) ? saved : 'one', resume, false);
    renderTemporaryList(); closeDialog('temporaryDialog');
    history.replaceState(null, '', `/?temporary=${encodeURIComponent(id)}`);
    setSyncStatus('临时页已同步 · 到期自动移除');
    clearTimeout(openTemporary.expiryTimer);
    openTemporary.expiryTimer = setTimeout(() => { if (state.current?.id === id) { refreshTemporary(); $('backToCourse').click(); } }, Math.max(0, page.expiresAt - Date.now()));
  } catch (error) {
    if (request !== state.chapterRequest) return;
    setSyncStatus('临时页暂不可用', true);
    toast(error.message);
    if (error.message === '临时页已过期') { await refreshTemporary(); $('backToCourse').click(); }
  }
}

function moveChapter(offset) {
  const chapters = sortedChapters();
  const index = chapters.findIndex(chapter => chapter.id === state.current?.id);
  const next = chapters[index + offset];
  if (next) openChapter(next.id);
}

const practiceUI = createPracticeUI({ api, toast, showDialog,
  getContext: () => ({ authenticated: state.authenticated, demo: state.demo, chapters: state.chapters, current: state.current }),
  openSource: async (chapterId, useId) => { await openChapter(chapterId); if (useId) jumpTo('one', useId); } });

const fromBase64url = value => Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=')), char => char.charCodeAt(0));
const toBase64url = value => btoa(String.fromCharCode(...new Uint8Array(value))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function passkey(kind, setupKey) {
  if (!window.PublicKeyCredential) throw new Error('此浏览器不支持通行密钥');
  const payload = kind === 'enroll' ? { setupKey } : {};
  const { options, ticket } = await api(`/auth/${kind}/options`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  let credential, response;
  if (kind === 'enroll') {
    const publicKey = PublicKeyCredential.parseCreationOptionsFromJSON
      ? PublicKeyCredential.parseCreationOptionsFromJSON(options)
      : { ...options, challenge: fromBase64url(options.challenge), user: { ...options.user, id: fromBase64url(options.user.id) }, excludeCredentials: (options.excludeCredentials || []).map(item => ({ ...item, id: fromBase64url(item.id) })) };
    credential = await navigator.credentials.create({ publicKey });
    response = { id: credential.id, rawId: toBase64url(credential.rawId), type: credential.type, response: { attestationObject: toBase64url(credential.response.attestationObject), clientDataJSON: toBase64url(credential.response.clientDataJSON), transports: credential.response.getTransports?.() || [] }, clientExtensionResults: credential.getClientExtensionResults() };
  } else {
    const publicKey = PublicKeyCredential.parseRequestOptionsFromJSON
      ? PublicKeyCredential.parseRequestOptionsFromJSON(options)
      : { ...options, challenge: fromBase64url(options.challenge), allowCredentials: (options.allowCredentials || []).map(item => ({ ...item, id: fromBase64url(item.id) })) };
    credential = await navigator.credentials.get({ publicKey });
    response = { id: credential.id, rawId: toBase64url(credential.rawId), type: credential.type, response: { authenticatorData: toBase64url(credential.response.authenticatorData), clientDataJSON: toBase64url(credential.response.clientDataJSON), signature: toBase64url(credential.response.signature), userHandle: credential.response.userHandle ? toBase64url(credential.response.userHandle) : undefined }, clientExtensionResults: credential.getClientExtensionResults() };
  }
  await api(`/auth/${kind}/verify`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ticket, response, setupKey }) });
}

function showLogin(status, message = '') {
  $('app').classList.add('login-mode');
  $('app').classList.remove('empty-mode');
  state.authStatus = status;
  state.authenticated = false;
  state.chapters = [];
  state.temporary = [];
  state.current = null;
  state.words = [];
  $('readingScroll').scrollTop = 0;
  $('loadingState').hidden = true;
  $('reader').hidden = true;
  $('app').classList.remove('temporary-mode');
  $('emptyState').hidden = true;
  $('loginState').hidden = false;
  $('loginMessage').textContent = message;
  $('setupKeyRow').hidden = status.enrolled || !status.enrollmentOpen;
  $('setupKey').hidden = status.enrolled || !status.enrollmentOpen;
  $('loginDescription').textContent = status.enrolled ? '使用已登记的通行密钥登录，继续按日期阅读。' : status.enrollmentOpen ? '登记窗口已开放。输入初始化密钥，再创建唯一的通行密钥。' : '尚未登记通行密钥。请先在后台打开登记窗口。';
  $('loginButton').textContent = status.enrolled ? '使用通行密钥登录' : status.enrollmentOpen ? '登记通行密钥' : '检查登记窗口';
  $('loginButton').disabled = false;
  $('logoutButton').hidden = true;
  $('pushButton').disabled = true;
  $('disablePushButton').hidden = true;
  $('wordIndexButton').hidden = true;
  for (const button of document.querySelectorAll('[data-part]')) button.disabled = true;
  renderChapterNavigation();
  renderCalendar();
  setSyncStatus(navigator.onLine ? '登录后读取个人课程' : '当前离线，无法登录', !navigator.onLine);
}

async function initialize() {
  try {
    const session = await api('/api/session');
    state.demo = Boolean(session.demo);
    state.authenticated = Boolean(session.authenticated);
    clearBadge();
    if (!state.authenticated) {
      const status = await api('/auth/status');
      showLogin(status);
      return;
    }
    $('app').classList.remove('login-mode');
    const result = await api('/api/chapters');
    state.chapters = result.chapters || [];
    if (!state.demo) await refreshTemporary();
    for (const button of document.querySelectorAll('[data-part]')) button.disabled = !state.chapters.length;
    $('logoutButton').hidden = state.demo;
    $('pushButton').disabled = state.demo;
    $('loadingState').hidden = true;
    $('loginState').hidden = true;
    renderChapterNavigation();
    renderCalendar();
    if (state.demo) $('studyGoal').value = localStorage.getItem('second-language-demo-goal') || '';
    else await refreshSettings();
    await flushPending();
    refreshPushStatus();
    const requestedTemporary = new URLSearchParams(location.search).get('temporary');
    if (requestedTemporary && state.temporary.some(page => page.id === requestedTemporary)) { await openTemporary(requestedTemporary); return; }
    const requested = new URLSearchParams(location.search).get('chapter');
    const selected = state.chapters.find(chapter => chapter.id === requested) || state.chapters.find(chapter => chapter.date === TODAY) || sortedChapters().at(-1);
    if (selected) await openChapter(selected.id);
    else { $('app').classList.add('empty-mode'); $('reader').hidden = true; $('readingScroll').scrollTop = 0; $('emptyState').hidden = false; setSyncStatus(state.demo ? '本地预览' : '等待第一章发布'); }
  } catch (error) {
    $('loadingState').hidden = true;
    showLogin({ enrolled: true, enrollmentOpen: false }, `连接暂不可用：${error.message}`);
  }
}

async function signIn() {
  const button = $('loginButton');
  button.disabled = true;
  $('loginMessage').textContent = '正在检查登录状态…';
  try {
    const status = await api('/auth/status');
    if (!status.enrolled && !status.enrollmentOpen) { showLogin(status); return; }
    if (!status.enrolled) {
      const key = $('setupKey').value.trim();
      if (!key) throw new Error('请输入初始化密钥');
      $('loginMessage').textContent = '正在登记通行密钥…';
      await passkey('enroll', key);
      $('setupKey').value = '';
    }
    $('loginMessage').textContent = '正在验证通行密钥…';
    await passkey('login');
    await initialize();
  } catch (error) {
    $('loginMessage').textContent = error.message || '登录未完成';
    button.disabled = false;
  }
}

async function refreshPushStatus() {
  if (state.demo || !state.authenticated) { $('pushStatus').textContent = '演示模式不会发送新章提醒。'; return; }
  if (isIOS && !standalone()) { $('pushStatus').textContent = 'iPhone 请先添加到主屏幕，再从主屏幕打开并开启提醒。'; $('pushButton').disabled = true; return; }
  if (!('PushManager' in window) || !('serviceWorker' in navigator)) { $('pushStatus').textContent = '当前浏览器不支持系统推送。'; $('pushButton').disabled = true; return; }
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    $('pushStatus').textContent = subscription ? '这台设备已经订阅新章提醒。' : '发布新章后，可向这台设备发送系统通知。';
    $('pushButton').hidden = Boolean(subscription);
    $('disablePushButton').hidden = !subscription;
    $('pushButton').disabled = false;
  } catch { $('pushStatus').textContent = '暂时无法读取这台设备的提醒状态。'; }
}

function refreshInstallStatus() {
  if (standalone()) { $('installStatus').textContent = '已从主屏幕以独立窗口打开。'; $('installButton').hidden = true; }
  else if (isIOS) { $('installStatus').textContent = '在 Safari 中添加到主屏幕，再从主屏幕打开，即可使用独立的 PWA 窗口。'; $('installButton').hidden = false; }
  else { $('installStatus').textContent = '把阅读器安装到设备，保留独立窗口与本机离线缓存。'; $('installButton').hidden = false; }
}

$('previousChapter').addEventListener('click', () => moveChapter(-1));
$('nextChapter').addEventListener('click', () => moveChapter(1));
$('calendarButton').addEventListener('click', () => { state.month = (state.current?.date || TODAY).slice(0, 7); renderCalendar(); showDialog('calendarDialog'); });
$('chapterJump').addEventListener('click', () => { state.month = (state.current?.date || TODAY).slice(0, 7); renderCalendar(); showDialog('calendarDialog'); });
$('settingsButton').addEventListener('click', () => { refreshInstallStatus(); refreshPushStatus(); refreshSettings(); showDialog('settingsDialog'); });
$('temporaryButton').addEventListener('click', async () => { await refreshTemporary(); renderTemporaryList(); showDialog('temporaryDialog'); });
$('practiceButton').addEventListener('click', () => practiceUI.open());
$('backToCourse').addEventListener('click', () => {
  const id = state.lastDailyId || sortedChapters().at(-1)?.id;
  if (id) openChapter(id);
  else { state.current = null; $('reader').hidden = true; $('temporaryRibbon').hidden = true; $('emptyState').hidden = false; $('app').classList.remove('temporary-mode'); $('app').classList.add('empty-mode'); history.replaceState(null, '', '/'); }
});
$('emptySettingsButton').addEventListener('click', () => showDialog('settingsDialog'));
$('prevMonth').addEventListener('click', () => { state.month = monthShift(state.month, -1); renderCalendar(); });
$('nextMonth').addEventListener('click', () => { state.month = monthShift(state.month, 1); renderCalendar(); });
$('todayMonth').addEventListener('click', () => { state.month = TODAY.slice(0, 7); renderCalendar(); });
$('monthPicker').addEventListener('change', event => { if (/^\d{4}-\d{2}$/.test(event.target.value)) { state.month = event.target.value; renderCalendar(); } });
$('wordIndexButton').addEventListener('click', () => { $('indexFilter').value = ''; renderIndex(); showDialog('indexDialog'); });
$('highlightButton').addEventListener('click', () => { state.highlight = !state.highlight; rememberDisplay(); showPart('three', true); });
$('translationButton').addEventListener('click', () => { state.translations = !state.translations; rememberDisplay(); showPart('three', true); });
$('indexFilter').addEventListener('input', event => renderIndex(event.target.value));
for (const button of document.querySelectorAll('[data-close]')) button.addEventListener('click', () => closeDialog(button.dataset.close));
for (const dialog of document.querySelectorAll('dialog')) dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
for (const button of document.querySelectorAll('[data-part]')) button.addEventListener('click', () => showPart(button.dataset.part, true));
for (const button of document.querySelectorAll('[data-difficulty]')) button.addEventListener('click', () => {
  state.difficulty = button.dataset.difficulty;
  for (const choice of document.querySelectorAll('[data-difficulty]')) choice.classList.toggle('selected', choice === button);
});
$('readingScroll').addEventListener('scroll', () => { updateReadingPosition(); clearTimeout(saveReadingPosition.timer); saveReadingPosition.timer = setTimeout(saveReadingPosition, 250); }, { passive: true });
window.addEventListener('pagehide', saveReadingPosition);
$('loginButton').addEventListener('click', signIn);
$('loginInstallButton').addEventListener('click', () => showDialog('installDialog'));
$('setupKey').addEventListener('keydown', event => { if (event.key === 'Enter') signIn(); });
$('saveProgress').addEventListener('click', async () => {
  if (!state.current) return;
  const progress = { completed: true, difficulty: state.difficulty, note: $('readingNote').value.trim().slice(0, 2000), updatedAt: new Date().toISOString() };
  state.progress = progress;
  renderProgress();
  if (state.demo) { writeStored(`second-language-demo-${state.current.id}`, progress); toast('学习反馈已保存到本机'); return; }
  const pending = localPending(); pending[state.current.id] = progress; writeStored(PENDING_KEY, pending);
  await flushPending();
  toast(localPending()[state.current.id] ? '已保存，联网后同步' : '学习反馈已保存');
});
$('saveGoal').addEventListener('click', async () => {
  const goal = $('studyGoal').value.trim();
  if (state.demo) { localStorage.setItem('second-language-demo-goal', goal); toast('学习目标已保存在本机'); return; }
  if (!state.authenticated) { toast('请先登录再保存学习目标'); return; }
  try { await api('/api/settings', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ goal }) }); toast('学习目标已保存'); }
  catch (error) { toast(error.message); }
});
$('temporaryRequestToggle').addEventListener('change', showTemporaryRequestBox);
$('saveTemporaryRequest').addEventListener('click', async () => {
  if (!state.authenticated || state.demo) { toast('请先登录再保存需求'); return; }
  try {
    const temporaryRequested = $('temporaryRequestToggle').checked;
    const temporaryRequestText = temporaryRequested ? $('temporaryRequestText').value.trim() : '';
    await api('/api/settings', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ temporaryRequested, temporaryRequestText }) });
    await refreshSettings(); toast(temporaryRequested ? '临时推送需求已保存' : '临时推送需求已关闭');
  } catch (error) { toast(error.message); }
});
$('saveRest').addEventListener('click', async () => {
  if (!state.authenticated || state.demo) { toast('请先登录再安排休息'); return; }
  try {
    const restRequested = $('restToggle').checked;
    await api('/api/settings', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ restRequested }) });
    await refreshSettings(); toast(restRequested ? '下一次日课已安排休息' : '休息安排已关闭');
  } catch (error) { toast(error.message); }
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' || !state.authenticated || state.demo) return;
  refreshTemporary(); refreshSettings();
  if (state.current?.kind && state.current.expiresAt <= Date.now()) $('backToCourse').click();
});
$('pushButton').addEventListener('click', async () => {
  try {
    const { publicKey } = await api('/api/push/public-key');
    if (!publicKey) throw new Error('提醒尚未配置');
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: fromBase64url(publicKey) });
    await api('/api/push/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(subscription.toJSON()) });
    await refreshPushStatus();
    toast('这台设备已开启新章提醒');
  } catch (error) { $('pushStatus').textContent = error.message; }
});
$('disablePushButton').addEventListener('click', async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await api('/api/push/unregister', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ endpoint: subscription.endpoint }) });
      await subscription.unsubscribe();
    }
    await refreshPushStatus();
    toast('这台设备的新章提醒已关闭');
  } catch (error) { $('pushStatus').textContent = error.message; }
});
$('logoutButton').addEventListener('click', async () => {
  nativeSpeech.stop();
  try {
    await api('/auth/logout', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
    navigator.serviceWorker?.controller?.postMessage({ type: 'CLEAR_CHAPTER_CACHE' });
    state.chapterRequest++;
    closeDialog('settingsDialog');
    const status = await api('/auth/status');
    showLogin(status);
    toast('已退出登录');
  } catch (error) { toast(error.message); }
});
$('installButton').addEventListener('click', async () => {
  if (state.installPrompt) { await state.installPrompt.prompt(); state.installPrompt = null; refreshInstallStatus(); }
  else showDialog('installDialog');
});
window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); state.installPrompt = event; refreshInstallStatus(); });
window.addEventListener('online', () => { setSyncStatus('正在同步…'); flushPending(); });
window.addEventListener('offline', () => setSyncStatus('离线阅读 · 反馈等待同步', true));
window.addEventListener('pagehide', saveReadingPosition);
document.addEventListener('visibilitychange', () => { if (!document.hidden) clearBadge(); });
document.addEventListener('keydown', event => {
  if (!event.altKey || ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
  if (event.key === 'ArrowLeft') moveChapter(-1);
  if (event.key === 'ArrowRight') moveChapter(1);
});
let swipeStart;
$('chapterNav').addEventListener('touchstart', event => { swipeStart = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }, { passive: true });
$('chapterNav').addEventListener('touchend', event => {
  if (!swipeStart) return;
  const dx = event.changedTouches[0].clientX - swipeStart.x;
  const dy = event.changedTouches[0].clientY - swipeStart.y;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) moveChapter(dx < 0 ? 1 : -1);
  swipeStart = null;
}, { passive: true });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js?v=13', { updateViaCache: 'none' }).catch(() => {});
refreshInstallStatus();
initialize();
