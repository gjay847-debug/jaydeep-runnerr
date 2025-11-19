const CACHE_NAME = 'jaydeep-runner-v1';
const FILES_TO_CACHE = [
  '/jaydeep-runnerr/',
  '/jaydeep-runnerr/index.html',
  '/jaydeep-runnerr/style.css',
  '/jaydeep-runnerr/script.js',
  '/jaydeep-runnerr/icon-192.png',
  '/jaydeep-runnerr/icon-512.png'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(clients.claim());
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(caches.match(evt.request).then(res => res || fetch(evt.request)));
});
