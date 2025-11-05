self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("eco-cache-v1").then(cache => {
      return cache.addAll([
        "index.html",
        "style.css",
        "firebase.js",
        "menu.js",
        "manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
