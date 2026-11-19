import { createAdminClient } from '@/lib/supabase/admin'
import { sendPush, type PushPayload } from './index'

export async function sendPushToAll(payload: PushPayload) {
  const supabase = createAdminClient()
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')

  if (!subs?.length) return { sent: 0, failed: 0, removed: 0 }

  let sent = 0, failed = 0
  const expired: string[] = []

  for (const sub of subs) {
    try {
      await sendPush({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload)
      sent++
    } catch (err: unknown) {
      const status = (err as { statusCode?: number }).statusCode
      if (status === 404 || status === 410) {
        expired.push(sub.endpoint)
      } else {
        failed++
      }
    }
  }

  if (expired.length) {
    await supabase.from('push_subscriptions').delete().in('endpoint', expired)
  }

  return { sent, failed, removed: expired.length }
}
