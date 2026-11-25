import * as webpush from 'web-push'

export type PushSubscriptionData = {
  endpoint: string
  keys: { p256dh: string; auth: string }
}

export type PushPayload = {
  title: string
  body: string
  url: string
}

export function getVapidConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
    process.env.VAPID_PRIVATE_KEY &&
    process.env.VAPID_SUBJECT
  )
}

export function configureVapid() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )
}

export async function sendPush(sub: PushSubscriptionData, payload: PushPayload) {
  configureVapid()
  return webpush.sendNotification(sub, JSON.stringify(payload))
}
