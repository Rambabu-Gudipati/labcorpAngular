importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyB1p6x4GJMx9hLI-Y3G6WiBZlBaXH3ksyU",
  authDomain: "labcorp-b7623.firebaseapp.com",
  projectId: "labcorp-b7623",
  storageBucket: "labcorp-b7623.firebasestorage.app",
  messagingSenderId: "66291095859",
  appId: "1:66291095859:web:8314b6eee1561964998646",
  measurementId: "G-QRD2ELMH03"
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

    console.log('Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
        data: {
            url: 'video/join-call',
            sos_data: JSON.stringify(payload)
        }
    };

    // Only show the notification if it hasn't been shown before
    if (!payload.notification.data || !payload.notification.data.alreadyShown) {
        self.registration.showNotification(notificationTitle, notificationOptions);
        payload.notification.data = payload.notification.data || {};
        payload.notification.data.alreadyShown = true; // Mark as shown
    }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const { url, sos_data } = event.notification.data;

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            const hasClient = clientList.some((client) => {
                return client.url === url && 'focus' in client;
            });

            if (hasClient) {
                return clientList[0].focus(); // Focus existing window
            } else {
                // Optionally pass the sos_data in the URL as a query parameter
                const targetUrl = new URL(url, self.location.origin);
                targetUrl.searchParams.set('sos_data', encodeURIComponent(sos_data));
                return clients.openWindow(targetUrl.toString()); // Open the new URL
            }
        })
    );
});