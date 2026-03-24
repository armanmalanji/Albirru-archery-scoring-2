// service-worker.js

const CACHE_NAME = 'app-shell-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                // List of static assets to cache
                '/',
                '/index.html',
                '/styles.css',
                '/script.js',
                // Add other assets here
            ]);
        })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME, DATA_CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then((cache) => {
                return fetch(event.request)
                    .then((response) => {
                        // If response is valid, clone it and store it in the cache
                        if (response.status === 200) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    })
                    .catch(() => cache.match(event.request));
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});

// Background Sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(
            // Your sync logic here
        );
    }
});

// Periodic Sync
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'periodic-sync-data') {
        event.waitUntil(
            // Your periodic sync logic here
        );
    }
});
