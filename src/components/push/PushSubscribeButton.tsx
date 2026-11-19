'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, BellRing } from 'lucide-react'
import { useLocale } from 'next-intl'

type State = 'loading' | 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed'

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const bytes = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i)
  return bytes.buffer
}

const LABEL: Record<string, Record<State, string>> = {
  'zh-TW': {
    loading:      '...',
    unsupported:  '此裝置不支援推播',
    denied:       '推播已被封鎖',
    subscribed:   '已訂閱靈修提醒',
    unsubscribed: '訂閱每日靈修提醒',
  },
  en: {
    loading:      '...',
    unsupported:  'Push not supported',
    denied:       'Push blocked',
    subscribed:   'Subscribed',
    unsubscribed: 'Get daily reminders',
  },
}

function label(state: State, locale: string): string {
  return (LABEL[locale] ?? LABEL['zh-TW'])[state]
}

export default function PushSubscribeButton() {
  const locale = useLocale()
  const [state, setState] = useState<State>('loading')

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setState('unsupported')
      return
    }
    if (Notification.permission === 'denied') {
      setState('denied')
      return
    }
    navigator.serviceWorker.ready.then((reg) =>
      reg.pushManager.getSubscription()
    ).then((sub) => {
      setState(sub ? 'subscribed' : 'unsubscribed')
    }).catch(() => setState('unsubscribed'))
  }, [])

  async function subscribe() {
    setState('loading')
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      })
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON(), locale }),
      })
      setState('subscribed')
    } catch {
      setState('unsubscribed')
    }
  }

  async function unsubscribe() {
    setState('loading')
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setState('unsubscribed')
    } catch {
      setState('unsubscribed')
    }
  }

  if (state === 'unsupported' || state === 'denied') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
        <BellOff size={13} /> {label(state, locale)}
      </span>
    )
  }

  if (state === 'subscribed') {
    return (
      <button
        onClick={unsubscribe}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-wine-200 text-wine-700 text-sm font-medium hover:bg-wine-50 transition-colors"
      >
        <BellRing size={15} />
        {label(state, locale)}
      </button>
    )
  }

  return (
    <button
      onClick={subscribe}
      disabled={state === 'loading'}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wine-700 text-white text-sm font-semibold hover:bg-wine-800 disabled:opacity-50 transition-colors"
    >
      <Bell size={15} />
      {label(state, locale)}
    </button>
  )
}
