/* 
   - Precaches core files for offline use
   - Uses network-first for HTML (fresh pages)
   - Uses cache-first for assets (fast load)
 */


const CACHE_VERSION = "readify-v1";

/* Main cache name */
const CACHE_NAME = `readify-cache-${CACHE_VERSION}`;

/* Files to pre-cache */
const PRECACHE_URLS = [
  /* Pages */
  "./",
  "./index.html",
  "./explorer.html",
  "./tracker.html",
  "./recommender.html",
  "./flow.html",
  "./feedback.html",

  /* Styles */
  "./css/style.css",

  /* JS */
  "./js/main.js",
  "./js/data.js",
  "./js/explorer.js",
  "./js/tracker.js",
  "./js/recommender.js",
  "./js/flow.js",
  "./js/feedback.js",

  /* PWA files */
  "./manifest.json",
  "./favicon.ico"
];

/* install: cache important files */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );

  // activate immediately after install
  self.skipWaiting();
});

/* active: delete old caches */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      const oldCaches = keys.filter((k) => k.startsWith("readify-cache-") && k !== CACHE_NAME);
      return Promise.all(oldCaches.map((k) => caches.delete(k)));
    })
  );

  self.clients.claim();
});

/* helper: cache-first (good for images, css, js) */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
}

/* helper: network-first (good for HTML pages) */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (err) {
    // offline fallback
    const cached = await caches.match(request);
    if (cached) return cached;

    // last resort: show home page if available
    return caches.match("./index.html");
  }
}

/* fetch: decide how to handle requests */
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // If it’s your own site (same origin)
  if (url.origin === self.location.origin) {
    const isHTML =
      req.headers.get("accept")?.includes("text/html") ||
      url.pathname.endsWith(".html") ||
      url.pathname === "/" ||
      url.pathname === "";

    // HTML pages: try network first, fallback to cache
    if (isHTML) {
      event.respondWith(networkFirst(req));
      return;
    }

    // Images + sounds + css + js: cache first
    const isAsset =
      url.pathname.includes("/images/") ||
      url.pathname.includes("/sound/") ||
      url.pathname.endsWith(".css") ||
      url.pathname.endsWith(".js") ||
      url.pathname.endsWith(".png") ||
      url.pathname.endsWith(".jpg") ||
      url.pathname.endsWith(".jpeg") ||
      url.pathname.endsWith(".webp") ||
      url.pathname.endsWith(".svg") ||
      url.pathname.endsWith(".ico") ||
      url.pathname.endsWith(".mp3") ||
      url.pathname.endsWith(".wav") ||
      url.pathname.endsWith(".ogg");

    if (isAsset) {
      event.respondWith(cacheFirst(req));
      return;
    }
  }

  // For anything else (external), just do normal fetch
  event.respondWith(fetch(req));
});
