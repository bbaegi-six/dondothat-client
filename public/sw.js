/* eslint-env serviceworker */

self.addEventListener('notificationclick', function (event) {
  console.log('Notification clicked:', event);

  const channel = new BroadcastChannel('sw-mensajes');

  event.notification.close();

  event.waitUntil(
    (async () => {
      if (event.action === 'aceptar') {
        channel.postMessage({ title: 'aceptar' });
      } else if (event.action === 'rechazar') {
        channel.postMessage({ title: 'rechazar' });
      } else {
        clients.openWindow('/');
      }
    })()
  );
});
