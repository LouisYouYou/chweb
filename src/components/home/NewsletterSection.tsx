'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

const copy = {
  'zh-TW': {
    eyebrow: '每週聚會通知',
    heading: '訂閱榮耀堂消息',
    sub: '每週主日公告、活動預告、教會最新消息，直接送到您的信箱。',
    placeholder: '請輸入您的 Email',
    cta: '立即訂閱',
    loading: '處理中…',
    success: '訂閱成功！歡迎加入榮耀堂家族。',
    duplicate: '此 Email 已訂閱過，感謝您的支持！',
    error: '訂閱失敗，請稍後再試。',
    privacy: '我們尊重您的隱私，絕不將您的資料提供給第三方。',
  },
  en: {
    eyebrow: 'Weekly Updates',
    heading: 'Subscribe to Our Newsletter',
    sub: 'Get Sunday service announcements, upcoming events, and church news delivered to your inbox.',
    placeholder: 'Enter your email address',
    cta: 'Subscribe',
    loading: 'Sending…',
    success: 'Subscribed! Welcome to the Glory Church family.',
    duplicate: 'This email is already subscribed. Thank you!',
    error: 'Subscription failed. Please try again.',
    privacy: 'We respect your privacy and will never share your data.',
  },
  my: {
    eyebrow: 'အပတ်စဉ် သတင်းများ',
    heading: 'သတင်းလွှာ မှတ်ပုံတင်ပါ',
    sub: 'တနင်္ဂနွေ ကြေညာချက်များ၊ ပွဲများ နှင့် ဘုရားကျောင်း သတင်းများ သင့် Email သို့ ပေးပို့မည်။',
    placeholder: 'Email လိပ်စာ ထည့်ပါ',
    cta: 'မှတ်ပုံတင်ရန်',
    loading: 'ပေးပို့နေသည်…',
    success: 'မှတ်ပုံတင်ပြီး！ ကြိုဆိုပါသည်။',
    duplicate: 'ဤ Email မှာ မှတ်ပုံတင်ပြီးသားဖြစ်သည်။ ကျေးဇူးတင်ပါသည်！',
    error: 'မှတ်ပုံတင်မရပါ။ နောက်မှ ထပ်ကြိုးစားပါ။',
    privacy: 'သင့် ကိုယ်ရေးအချက်အလက်ကို တတိယပါတီများနှင့် မျှဝေမည် မဟုတ်ပါ။',
  },
  ja: {
    eyebrow: '毎週のお知らせ',
    heading: 'ニュースレターを購読する',
    sub: '主日礼拝のお知らせ、イベント情報、教会ニュースをメールでお届けします。',
    placeholder: 'メールアドレスを入力',
    cta: '購読する',
    loading: '送信中…',
    success: '購読完了！栄光教会ファミリーへようこそ。',
    duplicate: 'このメールアドレスはすでに購読済みです。ありがとうございます！',
    error: '購読に失敗しました。後ほど再度お試しください。',
    privacy: 'プライバシーを尊重し、個人情報を第三者に提供することはありません。',
  },
} as const

type Locale = keyof typeof copy
type Status = 'idle' | 'loading' | 'success' | 'duplicate' | 'error'

export default function NewsletterSection() {
  const locale = useLocale() as Locale
  const c = copy[locale] ?? copy['zh-TW']

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'newsletter_subscribe', {
            event_category: 'engagement',
            event_label: locale,
          })
        }
      } else if (res.status === 409) {
        setStatus('duplicate')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const done = status === 'success' || status === 'duplicate'

  return (
    <section className="bg-wine-950 pt-24 pb-14 px-4 relative overflow-hidden">
      {/* Wave: UpcomingEvents (gray-50) dips into newsletter top */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block h-14">
          <path d="M0,0 L1440,0 C1080,56 360,56 0,0 Z" fill="#ffffff"/>
        </svg>
      </div>
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px,#fff 1px,transparent 0)', backgroundSize: '36px 36px' }}
      />
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-400/5 pointer-events-none" />
      <div className="absolute -right-16 bottom-0 w-48 h-48 rounded-full bg-wine-800/40 pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center relative">
        {/* Eyebrow */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-semibold tracking-widest uppercase mb-4">
          <Mail size={12} />
          {c.eyebrow}
        </span>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{c.heading}</h2>
        <p className="text-wine-300 text-sm sm:text-base mb-8 leading-relaxed">{c.sub}</p>

        {done ? (
          <div className="flex items-center justify-center gap-3 py-4 px-6 bg-green-900/40 border border-green-500/30 rounded-2xl text-green-300 text-sm font-medium">
            <CheckCircle size={20} className="shrink-0 text-green-400" />
            {c[status as 'success' | 'duplicate']}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={c.placeholder}
              className="flex-1 px-5 py-3.5 rounded-full bg-wine-900 border border-wine-700 text-white placeholder-wine-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-7 py-3.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-300 text-wine-900 font-bold rounded-full text-sm transition-all shadow-lg shadow-amber-400/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {status === 'loading' && <Loader2 size={14} className="animate-spin" />}
              {status === 'loading' ? c.loading : c.cta}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-red-400 text-xs">{c.error}</p>
        )}

        <p className="mt-5 text-wine-500 text-xs">{c.privacy}</p>
      </div>
    </section>
  )
}
