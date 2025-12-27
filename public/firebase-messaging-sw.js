importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCLOm27H_3BRN0EZtT8z0qg-Ff9suGzRl4",
  authDomain: "vrnexgen-learn.firebaseapp.com",
  projectId: "vrnexgen-learn",
  messagingSenderId: "120597976332",
  appId: "1:120597976332:web:90aad149a503dda6116529",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
    }
  );
});
