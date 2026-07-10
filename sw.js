
const CACHE_NAME = 'es-gishoma-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=Playfair+Display:wght@700;900&display=swap'
];

// Helper to check if a request is for an external dependency
const isDependency = (url) => 
  url.includes('esm.sh') || 
  url.includes('tailwindcss.com') || 
  url.includes('gstatic.com') || 
  url.includes('googleapis.com') ||
  url.includes('lucide-react');

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Pre-caching core assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // 1. Handle SPA Navigation requests with robust fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If response is valid and successful, return it
          if (response && response.status >= 200 && response.status < 300) {
            return response;
          }
          // If response is a 404/500, serve the SPA index.html so React Router can render the route
          return caches.match('./index.html') || caches.match('./') || response;
        })
        .catch(() => {
          // Network failure (offline) - return cached index.html
          return caches.match('./index.html') || caches.match('./');
        })
    );
    return;
  }

  // 2. Handle static assets & other requests (cache-first then network)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Only cache GET requests with standard HTTP/HTTPS schemes
        const url = event.request.url;
        if (url.startsWith('http')) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      }).catch((err) => {
        console.warn('Non-navigation fetch failed:', err);
      });
    })
  );
});
