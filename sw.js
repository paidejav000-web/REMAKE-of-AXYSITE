const CACHE_NAME = "axysite-cache-v1";

// Files to cache for offline use
const FILES_TO_CACHE = [
  "/REMAKE-of-AXYSITE/index.html",
  "/REMAKE-of-AXYSITE/games.html",
  "/REMAKE-of-AXYSITE/style.css",
  "/REMAKE-of-AXYSITE/main.bundle.js",
  "/REMAKE-of-AXYSITE/simulation_worker.bundle.js",
  "/REMAKE-of-AXYSITE/192.png",
  "/REMAKE-of-AXYSITE/512.png"
];

// Install SW and cache files
self.addEventListener("install", evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Serve cached files if offline
self.addEventListener("fetch", evt => {
  evt.respondWith(
    caches.match(evt.request).then(resp => resp || fetch(evt.request))
  );
});
