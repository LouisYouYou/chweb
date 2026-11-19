/* eslint-disable @typescript-eslint/no-explicit-any */
// Custom Service Worker for push notifications
// Compiled by @ducanh2912/next-pwa and merged with the generated Workbox SW.
// TypeScript sees this as a browser module, so we cast globalThis to avoid conflicts.

const sw = globalThis as any

sw.addEventListener('push', (event: any) => {
  const data = event.data?.json() ?? {}
  const title: string = data.title ?? '行道會南勢角榮耀堂'
  const options = {
    body: data.body ?? '今日靈修提醒',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'daily-devotional',
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: data.url ?? '/' },
  }
  event.waitUntil(sw.registration.showNotification(title, options))
})

sw.addEventListener('notificationclick', (event: any) => {
  event.notification.close()
  const url: string = event.notification.data?.url ?? '/'
  event.waitUntil(sw.clients.openWindow(url))
})
