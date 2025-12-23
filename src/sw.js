import { precacheAndRoute } from "workbox-precaching";

self.skipWaiting();
clients.claim();

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("push", (event) => {
  self.registration.showNotification("📘 Time to Learn!", {
    body: "Continue your course on VRNexGen Learn",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/dashboard")
  );
});

