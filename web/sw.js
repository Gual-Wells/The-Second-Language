const SHELL = 'second-language-shell-v32';
const CHAPTERS = 'second-language-chapters-v1';
const CORE = ['/', '/index.html', '/app.js?v=32', '/pure-reader.js?v=32', '/reader-jump.js?v=32', '/reader-focus.js?v=32', '/chapters.js?v=32', '/settings.js?v=32', '/audio-config.js?v=32', '/audio-plan.js?v=32', '/text.js?v=32', '/practice-workspace.js?v=32', '/balances.js?v=32', '/storage-usage.js?v=32', '/questions.js?v=32', '/question-pairs.js?v=32', '/chapter-tests.js?v=32', '/chapter-test-recorder.js?v=32', '/audio-library.js?v=32', '/practice.js?v=32', '/listening.js?v=32', '/reading.js?v=32', '/objective.js?v=32', '/exam-spec.js?v=32', '/recorder.js?v=32', '/reader-speech.js?v=32', '/render.js?v=32', '/annotations.js?v=32', '/styles.css?v=32', '/manifest.webmanifest?v=32', '/icon.svg?v=32', '/icon-192.png?v=32', '/icon-512.png?v=32', '/apple-touch-icon.png?v=32'];
self.addEventListener('install', event => { event.waitUntil(caches.open(SHELL).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(Promise.all([self.clients.claim(), caches.keys().then(keys => Promise.all(keys.filter(key => ![SHELL, CHAPTERS, 'second-language-point-audio-v1'].includes(key)).map(key => caches.delete(key))))])); });
self.addEventListener('message', event => { if (event.data?.type === 'CLEAR_CHAPTER_CACHE') event.waitUntil(caches.delete(CHAPTERS)); });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/auth/') || (url.pathname.startsWith('/api/') && !url.pathname.startsWith('/api/chapters'))) return;
  if (url.pathname === '/api/chapters' || url.pathname.startsWith('/api/chapters/')) {
    event.respondWith(fetch(event.request).then(response => { if (response.ok) { const copy = response.clone(); caches.open(CHAPTERS).then(cache => cache.put(event.request, copy)); } return response; }).catch(async () => (await caches.match(event.request)) || new Response(JSON.stringify({ error: '章节暂不可用' }), { status: 503, headers: { 'content-type': 'application/json' } })));
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
    await self.registration.showNotification(message.title || '第二语言 · 今日章节', { body: message.body || '新的章节已经可以阅读。', icon: '/icon-192.png?v=32', badge: '/icon-192.png?v=32', data: { target } });
    if ('setAppBadge' in self.navigator) { try { await self.navigator.setAppBadge(1); } catch {} }
  })());
});
self.addEventListener('notificationclick', event => {
  event.notification.close(); const url = new URL(event.notification.data?.target || '/', self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async clients => { const existing = clients.find(client => new URL(client.url).origin === self.location.origin); if (existing) { await existing.focus(); if (existing.navigate) await existing.navigate(url); } else await self.clients.openWindow(url); }));
});
