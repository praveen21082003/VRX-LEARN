self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = "/dashboard";

  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});
