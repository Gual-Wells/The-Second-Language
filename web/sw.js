const SHELL = 'second-language-shell-v38';
const CHAPTERS = 'second-language-chapters-v1';
const CORE = ['/', '/index.html', '/app.js?v=38', '/pure-reader.js?v=38', '/reader-jump.js?v=38', '/reader-focus.js?v=38', '/chapters.js?v=38', '/settings.js?v=38', '/certification-reader.js?v=38', '/labs/certification-reader/sound.js?v=38', '/audio-config.js?v=38', '/audio-plan.js?v=38', '/text.js?v=38', '/practice-workspace.js?v=38', '/balances.js?v=38', '/storage-usage.js?v=38', '/questions.js?v=38', '/question-pairs.js?v=38', '/chapter-quality.js?v=38', '/chapter-tests.js?v=38', '/chapter-test-recorder.js?v=38', '/audio-library.js?v=38', '/practice.js?v=38', '/listening.js?v=38', '/reading.js?v=38', '/objective.js?v=38', '/exam-spec.js?v=38', '/recorder.js?v=38', '/reader-speech.js?v=38', '/render.js?v=38', '/annotations.js?v=38', '/styles.css?v=38', '/manifest.webmanifest?v=38', '/icon.svg?v=38', '/icon-192.png?v=38', '/icon-512.png?v=38', '/apple-touch-icon.png?v=38'];
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
    await self.registration.showNotification(message.title || '第二语言 · 今日章节', { body: message.body || '新的章节已经可以阅读。', icon: '/icon-192.png?v=38', badge: '/icon-192.png?v=38', data: { target } });
    if ('setAppBadge' in self.navigator) { try { await self.navigator.setAppBadge(1); } catch {} }
  })());
});
self.addEventListener('notificationclick', event => {
  event.notification.close(); const url = new URL(event.notification.data?.target || '/', self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async clients => { const existing = clients.find(client => new URL(client.url).origin === self.location.origin); if (existing) { await existing.focus(); if (existing.navigate) await existing.navigate(url); } else await self.clients.openWindow(url); }));
});
