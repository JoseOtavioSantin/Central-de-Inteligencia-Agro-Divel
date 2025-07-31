
const CACHE_NAME = 'agrodivel-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/form-comercial.js',
  '/js/municipios.js',
  '/js/consultores.js',
  '/firebase.js',
  '/assets/logo.png',
  '/pages/form-comercial.html',
  '/pages/form-PLM.html',
  '/pages/form-consorcio.html',
  '/pages/form-pecas.html',
  '/pages/form-planodemanutencao.html',
  '/pages/form-seguro.html',
  '/pages/form-servicos.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
