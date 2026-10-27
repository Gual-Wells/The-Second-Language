const SHELL = 'second-language-shell-v50';
const CHAPTERS = 'second-language-chapters-v3';
const CORE = ['/context-translations.js?v=50', '/usage-context.js', '/teaching-units.js', '/', '/index.html', '/app.js?v=50', '/pure-reader.js?v=50', '/reader-jump.js?v=50', '/reader-focus.js?v=50', '/chapters.js?v=41', '/settings.js?v=41', '/certification-reader.js?v=43', '/labs/certification-reader/sound.js?v=42', '/labs/certification-reader/sound-base.js?v=42', '/labs/certification-reader/keeper-sound.js?v=42', '/labs/certification-reader/material-motion.js?v=41', '/audio-config.js?v=50', '/audio-plan.js?v=50', '/text.js?v=41', '/practice-workspace.js?v=41', '/balances.js?v=41', '/storage-usage.js?v=41', '/questions.js?v=50', '/question-pairs.js?v=41', '/chapter-quality.js?v=50', '/chapter-tests.js?v=43', '/chapter-certification.js?v=43', '/chapter-test-recorder.js?v=41', '/audio-library.js?v=50', '/practice.js?v=41', '/listening.js?v=41', '/reading.js?v=41', '/objective.js?v=41', '/exam-spec.js?v=41', '/recorder.js?v=41', '/reader-speech.js?v=50', '/render.js?v=50', '/annotations.js?v=50', '/styles.css?v=50', '/manifest.webmanifest?v=41', '/icon.svg?v=41', '/icon-192.png?v=41', '/icon-512.png?v=41', '/apple-touch-icon.png?v=41'];
self.addEventListener('install', event => { event.waitUntil(caches.open(SHELL).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(Promise.all([self.clients.claim(), caches.keys().then(keys => Promise.all(keys.filter(key => ![SHELL, CHAPTERS, 'second-language-point-audio-v1'].includes(key)).map(key => caches.delete(key))))])); });
self.addEventListener('message', event => { if (event.data?.type === 'CLEAR_CHAPTER_CACHE') event.waitUntil(caches.delete(CHAPTERS)); });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/auth/') || (url.pathname.startsWith('/api/') && !url.pathname.startsWith('/api/chapters'))) return;
  if (url.pathname === '/api/chapters' || url.pathname.startsWith('/api/chapters/')) {
    event.respondWith(fetch(event.request).then(response => { if (response.ok) { const copy = response.clone(); event.waitUntil(caches.open(CHAPTERS).then(async cache => { await cache.put(event.request, copy); if (url.pathname === '/api/chapters' && !url.search) { const live = new Map((await response.clone().json()).chapters.map(c => [c.id,c.digest])); for (const key of await cache.keys()) { const cached = new URL(key.url), match = cached.pathname.match(/^\/api\/chapters\/([^/]+)/); if (match && (!live.has(decodeURIComponent(match[1])) || cached.searchParams.has('digest') && cached.searchParams.get('digest') !== live.get(decodeURIComponent(match[1])))) await cache.delete(key); } } })); } else if ([404,410].includes(response.status)) event.waitUntil(caches.open(CHAPTERS).then(cache => cache.delete(event.request))); return response; }).catch(async () => (await caches.match(event.request)) || new Response(JSON.stringify({ error: '章节暂不可用' }), { status: 503, headers: { 'content-type': 'application/json' } })));
    return;
  }
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
self.addEventListener('push', event => {
  let message = {}; try { message = event.data?.json() || {}; } catch {}
  const target = message.balances ? '/?balances=1' : message.temporaryId ? `/?temporary=${encodeURIComponent(message.temporaryId)}` : message.chapterId ? `/?chapter=${encodeURIComponent(message.chapterId)}` : '/';
  event.waitUntil((async () => {
    await self.registration.showNotification(message.title || '第二语言 · 今日章节', { body: message.body || '新的章节已经可以阅读。', icon: '/icon-192.png?v=41', badge: '/icon-192.png?v=41', data: { target } });
    if ('setAppBadge' in self.navigator) { try { await self.navigator.setAppBadge(1); } catch {} }
  })());
});
self.addEventListener('notificationclick', event => {
  event.notification.close(); const url = new URL(event.notification.data?.target || '/', self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async clients => { const existing = clients.find(client => new URL(client.url).origin === self.location.origin); if (existing) { await existing.focus(); if (existing.navigate) await existing.navigate(url); } else await self.clients.openWindow(url); }));
});
