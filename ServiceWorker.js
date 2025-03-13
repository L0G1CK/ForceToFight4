const version = "1.3";  // Меняй версию при деплое
const cacheName = `RussianCryptoCat-ForceToFight-${version}`;
const contentToCache = [
    "Build/ForceToFight.loader.js",
    "Build/ForceToFight.framework.js",
    "Build/ForceToFight.data",
    "Build/ForceToFight.wasm",
    "TemplateData/style.css"
];

self.addEventListener("install", (event) => {
    console.log("[Service Worker] Installing...");
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log("[Service Worker] Caching all content");
            return cache.addAll(contentToCache);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== cacheName)
                    .map((name) => caches.delete(name))
            );
        })
    );
    console.log("[Service Worker] Old caches cleared!");
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                return caches.open(cacheName).then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            })
            .catch(() => caches.match(event.request))
    );
});
