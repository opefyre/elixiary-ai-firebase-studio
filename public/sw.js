// Service Worker for Elixiary PWA
const BUILD_ID_FALLBACK = 'development';

/**
 * Attempt to discover the build identifier so that we can version our caches.
 *
 * Priority order:
 * 1. Global injected at build time via NEXT_PUBLIC_GIT_SHA / NEXT_PUBLIC_BUILD_ID.
 * 2. Next.js build identifier exposed at /_next/static/BUILD_ID.
 * 3. A fallback string to ensure SW continues to work locally.
 */
const buildIdPromise = (async () => {
  const injected = self?.ENV?.NEXT_PUBLIC_GIT_SHA
    || self?.ENV?.NEXT_PUBLIC_BUILD_ID
    || self?.NEXT_PUBLIC_GIT_SHA
    || self?.NEXT_PUBLIC_BUILD_ID;

  if (injected && typeof injected === 'string') {
    return injected;
  }

  try {
    const response = await fetch('/_next/static/BUILD_ID', { cache: 'no-store' });
    if (response.ok) {
      const text = (await response.text()).trim();
      if (text) {
        return text;
      }
    }
  } catch (error) {
    console.warn('[ServiceWorker] Unable to fetch build identifier', error);
  }

  return BUILD_ID_FALLBACK;
})();

const cacheKey = (segment, buildId) => `elixiary-${segment}-${buildId}`;
const getStaticCacheName = (buildId) => cacheKey('static', buildId);
const getDynamicCacheName = (buildId) => cacheKey('dynamic', buildId);

// Files to cache for offline functionality
const NETWORK_TIMEOUT_MS = 3000;

const STATIC_FILES = [
  '/manifest.json',
  '/favicon.ico',
  '/favicon.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/android-chrome-72x72.png',
  '/android-chrome-96x96.png',
  '/android-chrome-144x144.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/icon.png'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    buildIdPromise.then((buildId) =>
      caches.open(getStaticCacheName(buildId))
        .then((cache) => cache.addAll(STATIC_FILES))
        .then(() => self.skipWaiting())
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    buildIdPromise.then((buildId) =>
      caches.keys()
        .then((cacheNames) => Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('elixiary-') && !cacheName.endsWith(buildId)) {
              return caches.delete(cacheName);
            }
            return undefined;
          })
        ))
        .then(() => self.clients.claim())
    )
  );
});

const fetchWithTimeout = (request, timeout = NETWORK_TIMEOUT_MS) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Network timeout'));
    }, timeout);

    fetch(request)
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  const isNavigationRequest = request.mode === 'navigate' || request.destination === 'document';

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip API requests (let them go to network)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Skip external requests
  if (url.origin !== self.location.origin) {
    return;
  }

  if (isNavigationRequest) {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetchWithTimeout(request);

        if (networkResponse && networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          const cache = await caches.open(DYNAMIC_CACHE);
          cache.put(request, responseToCache);
        }

        return networkResponse;
      } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.match('/');
      }
    })());

    return;
  }

  event.respondWith(
    buildIdPromise.then((buildId) =>
      caches.match(request)
        .then((cachedResponse) => {
          // Return cached version if available
          if (cachedResponse) {
            return cachedResponse;
          }

          // Otherwise, fetch from network
          return fetch(request)
            .then((response) => {
              // Don't cache if not a valid response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Clone the response
              const responseToCache = response.clone();

              // Cache dynamic content
              caches.open(getDynamicCacheName(buildId))
                .then((cache) => {
                  cache.put(request, responseToCache);
                });

            return response;
          })
          .catch((error) => {
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/');
            }

            throw error;
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any pending offline actions here
      Promise.resolve()
    );
  }
});

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from Elixiary',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/android-chrome-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon-32x32.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Elixiary', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
