const CACHE = "bfix-v3";
const STATIC = /\/(_next\/static|icons|fonts)\//;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== location.origin || url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin")) return;
  if (STATIC.test(url.pathname)) {
    e.respondWith(caches.match(request).then((hit) => hit || fetch(request).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(request, copy)); return res; })));
    return;
  }
  e.respondWith(fetch(request).then((res) => { if (res.ok && request.mode === "navigate") { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(request, copy)); } return res; }).catch(() => caches.match(request)));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window" }).then((clients) => {
    if (clients.length > 0) return clients[0].focus();
    return self.clients.openWindow("/");
  }));
});
