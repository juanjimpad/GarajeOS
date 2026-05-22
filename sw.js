const CACHE = 'garajeos-v__VERSION__';
const ASSETS = ['./', './index.html', './manifest.json', './favicon.svg', './css/style.css', './js/app.js', './js/theme.js', './js/state.js', './js/config.js', './js/utils.js', './js/db.js', './js/render.js', './js/modals.js', './js/firebase.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('firebaseio') || e.request.url.includes('googleapis')) return;
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
});
