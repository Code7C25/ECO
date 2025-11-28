// Evento que se ejecuta cuando se instala el Service Worker
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("eco-cache-v1").then(cache => {
      // Archivos que se guardan en caché para usar sin conexión
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

// Evento que intercepta las peticiones de red
self.addEventListener("fetch", e => {
  e.respondWith(
    // Busca el recurso en caché y, si no está, lo pide a la red
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
