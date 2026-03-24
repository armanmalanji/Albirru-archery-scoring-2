// notification.js

// Function to request user permission for notifications
function requestNotificationPermission() {
    Notification.requestPermission().then(function(permission) {
        if (permission === "granted") {
            console.log("Notification permission granted.");
        }
    });
}

// Function to show a notification
function showNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, { body: body });
    }
}

// Show notification when session ends
function onSessionEnd() {
    showNotification("Session Ended", "Your session has ended. Thank you for your participation!");
}

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://example.com') // replace with your app's URL
    );
});

// Register service worker for background notifications support
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(function(error) {
            console.error('Service Worker registration failed:', error);
        });
}