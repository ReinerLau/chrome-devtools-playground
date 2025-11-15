self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll(["./app.js"]);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.registration.navigationPreload.enable());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const preloadResponse = await event.preloadResponse;
      if (preloadResponse) {
        return preloadResponse;
      }
      const cache = await caches.open("v1");
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      const response = await fetch(event.request);
      return response;
    })()
  );
});

self.addEventListener("push", (event) => {
  const title = "Push Notification";
  const body = event.data.text();
  const options = {
    body,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("sync", (event) => {
  const title = "Sync Notification";
  const options = {
    body: `触发${event.tag}任务`,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
