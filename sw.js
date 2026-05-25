const CACHE = 'garajeos-v3';
const ASSETS = [
  './css/style.css',
  './js/app.js', './js/theme.js', './js/state.js', './js/config.js',
  './js/utils.js', './js/db.js', './js/render.js', './js/modals.js',
  './js/i18n.js', './js/agenda.js', './js/ics.js',
  './manifest.json', './favicon.svg',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  // No skipWaiting automático — el cliente decide cuándo activar
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('firebaseio') || e.request.url.includes('googleapis')) return;

  const url = new URL(e.request.url);
  const isHTML = url.pathname === '/' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');

  if (isHTML) {
    // HTML siempre de red; caché solo como fallback offline
    e.respondWith(fetch(e.request).catch(() => caches.match('./index.html')));
    return;
  }

  e.respondWith(
    fetch(e.request).then(res => {
      caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
