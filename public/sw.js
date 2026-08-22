// Kadashe PWA Service Worker — Offline & Instant Launch Engine
const CACHE_VERSION = "kadashe-v1.3.0";
const STATIC_CACHE = `kadashe-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `kadashe-dynamic-${CACHE_VERSION}`;

// Core assets required for instantaneous offline startup
const PRECACHE_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/kadashe-logo-icon.svg",
];

// Install Event — Pre-cache essential app shell and activate immediately
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn("[Kadashe SW] Pre-cache warning:", err);
        return self.skipWaiting();
      })
  );
});

// Activate Event — Clean up outdated caches and take control of all clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== STATIC_CACHE && name !== DYNAMIC_CACHE) {
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Event — Resilient routing strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests and non-HTTP(S) schemes (e.g. chrome-extension:)
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // Bypass service worker for API endpoints and Supabase Auth calls
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/auth/") ||
    url.hostname.includes("supabase.co")
  ) {
    return;
  }

  // Strategy 1: HTML Navigation Requests (Network-First with Offline Fallback)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Cache successful page navigations for offline reading
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Attempt to retrieve cached version of the requested page
          const cachedPage = await caches.match(request);
          if (cachedPage) {
            return cachedPage;
          }
          // Fallback to the dedicated branded /offline page
          const offlinePage = await caches.match("/offline");
          if (offlinePage) {
            return offlinePage;
          }
          // Generic fallback response if /offline isn't in cache yet
          return new Response(
            `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kadashe — Offline</title><style>body{background:#071322;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;padding:20px;}</style></head><body><div><h2>You are offline</h2><p>Please check your internet connection and try again.</p><button onclick="location.reload()" style="background:#0284C7;color:#fff;border:none;padding:10px 20px;border-radius:20px;cursor:pointer;font-weight:bold;">Retry</button></div></body></html>`,
            { headers: { "Content-Type": "text/html" } }
          );
        })
    );
    return;
  }

  // Strategy 2: Static Next.js Bundles, Icons, and Images (Stale-While-Revalidate)
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico|woff2|woff|ttf|css|js)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const copy = networkResponse.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }
});
