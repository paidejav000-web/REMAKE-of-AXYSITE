const CACHE_NAME = "axysite-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/polytrack.html",
  "/style.css",
  "/theme.js",
  "/main.bundle.js",
  "/simulation_worker.bundle.js",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("fetch", evt => {
  evt.respondWith(
    caches.match(evt.request).then(resp => resp || fetch(evt.request))
  );
});
