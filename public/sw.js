/**
 * MyBabyCare service worker.
 *
 * __APP_VERSION__ is replaced with the package version at build time (see the
 * stamp-service-worker-version plugin in vite.config.js). That matters twice
 * over: the worker's bytes change on every release, which is what makes the
 * browser notice an update at all, and the cache name changes with it, so the
 * previous release's assets are dropped rather than served forever.
 */
const VERSION = '__APP_VERSION__';
const CACHE_NAME = `mybabycare-${VERSION}`;

// The shell needed to boot offline. Hashed assets are cached on demand.
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch((error) => console.error('[SW] Precache failed:', error))
  );
  // Deliberately no skipWaiting() here. The new worker waits so the app can
  // offer "a new version is ready" and let the user pick the moment. Swapping
  // under a running page can pair a new index.html with old chunks.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Claim before cleaning up, not after. Upgrading from the pre-1.6.1
      // worker, the old page asks us to activate and then reloads immediately;
      // whichever worker controls at that moment serves the navigation. Waiting
      // on cache deletion first widened that window and the old, cache-first
      // worker answered — which is why that one upgrade appeared to do nothing.
      await self.clients.claim();

      const names = await caches.keys();
      await Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)));
    })()
  );
});

/** Hashed build output and static files: safe to serve from cache first. */
const isStaticAsset = (url) =>
  /\.(?:js|css|woff2?|ttf|otf|png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname);

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only same-origin GETs are ours to cache. Firestore, ReliefWeb, Google
  // Fonts and the rest must always go to the network.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Never interfere with the dev server.
  if (url.pathname.includes('/@vite') || url.pathname.includes('__vite') || url.pathname.includes('node_modules')) {
    return;
  }

  // Navigations go to the network first, so a deployed release is picked up on
  // the next load instead of being masked by a cached index.html. Cache is the
  // offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response && response.status === 200 && response.type === 'basic') {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data?.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: VERSION });
  }
});
