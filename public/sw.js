const VERSION = "v1";
const SCOPE_PATH = new URL("./", self.location.href).pathname;
const APP_SHELL_URL = new URL(SCOPE_PATH, self.location.origin).toString();
const RUNTIME_CACHE = `xira-runtime-${VERSION}`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(RUNTIME_CACHE)
      .then((cache) => cache.add(APP_SHELL_URL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith("xira-runtime-") && cacheName !== RUNTIME_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      ).then(() => self.clients.claim())
    )
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin || !url.pathname.startsWith(SCOPE_PATH)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest());
    return;
  }

  if (isRuntimeAssetRequest(request, url)) {
    event.respondWith(handleAssetRequest(request));
  }
});

function isRuntimeAssetRequest(request, url) {
  if (request.destination === "script" || request.destination === "style" || request.destination === "image" || request.destination === "font") {
    return true;
  }

  return url.pathname.endsWith(".webmanifest");
}

async function handleNavigationRequest() {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedShell = await cache.match(APP_SHELL_URL);

  if (cachedShell) {
    void refreshAppShell(cache);
    return cachedShell;
  }

  return refreshAppShell(cache);
}

async function refreshAppShell(cache) {
  const response = await fetch(APP_SHELL_URL, { cache: "no-cache" });

  if (response.ok) {
    await cache.put(APP_SHELL_URL, response.clone());
  }

  return response;
}

async function handleAssetRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    void updateCachedAsset(cache, request);
    return cachedResponse;
  }

  return updateCachedAsset(cache, request);
}

async function updateCachedAsset(cache, request) {
  const response = await fetch(request);

  if (response.ok) {
    await cache.put(request, response.clone());
  }

  return response;
}
