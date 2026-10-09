const SHELL = 'second-language-shell-v26';
const CHAPTERS = 'second-language-chapters-v1';
const CORE = ['/', '/index.html', '/app.js?v=26', '/pure-reader.js?v=26', '/reader-focus.js?v=26', '/chapters.js?v=26', '/settings.js?v=26', '/audio-config.js?v=26', '/audio-plan.js?v=26', '/text.js?v=26', '/practice-workspace.js?v=26', '/balances.js?v=26', '/questions.js?v=26', '/audio-library.js?v=26', '/practice.js?v=26', '/listening.js?v=26', '/reading.js?v=26', '/objective.js?v=26', '/exam-spec.js?v=26', '/recorder.js?v=26', '/reader-speech.js?v=26', '/render.js?v=26', '/annotations.js?v=26', '/styles.css?v=26', '/manifest.webmanifest?v=26', '/icon.svg?v=26', '/icon-192.png?v=26', '/icon-512.png?v=26', '/apple-touch-icon.png?v=26'];
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
    await self.registration.showNotification(message.title || '第二语言 · 今日章节', { body: message.body || '新的章节已经可以阅读。', icon: '/icon-192.png?v=26', badge: '/icon-192.png?v=26', data: { target } });
    if ('setAppBadge' in self.navigator) { try { await self.navigator.setAppBadge(1); } catch {} }
  })());
});
self.addEventListener('notificationclick', event => {
  event.notification.close(); const url = new URL(event.notification.data?.target || '/', self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async clients => { const existing = clients.find(client => new URL(client.url).origin === self.location.origin); if (existing) { await existing.focus(); if (existing.navigate) await existing.navigate(url); } else await self.clients.openWindow(url); }));
});
