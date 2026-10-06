'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const LINE_ID = process.env.NEXT_PUBLIC_LINE_ID;

export default function ContactForm() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSent(false), 8000);
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'contact_form_submit', {
            event_category: 'engagement',
            event_label: locale,
          });
        }
      } else {
        const data = await res.json();
        setError(data.error ?? '傳送失敗，請稍後再試');
      }
    } catch {
      setError('網路錯誤，請稍後再試');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="church-gradient py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-wine-200 text-lg">{t('subtitle')}</p>
          <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mt-6" />
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold text-wine-900 mb-6">{t('form_title')}</h2>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle size={48} className="text-green-500 mb-4" />
                <p className="text-lg font-medium text-green-700">{t('success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-300 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('subject')}</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('message')}</label>
                  <textarea
                    rows={6}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-300 text-sm resize-none"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    ⚠️ {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 church-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send size={16} className={sending ? 'animate-pulse' : ''} />
                  {sending ? '傳送中...' : t('submit')}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold text-wine-900 mb-6">{t('info_title')}</h2>
            <div className="space-y-5">
              {[
                {
                  icon: MapPin,
                  label: t('address'),
                  value: locale === 'zh-TW' ? '新北市中和區忠孝街 39-15 號' : locale === 'ja' ? '新北市中和区忠孝街39-15号' : 'No.39-15, Zhongxiao St., Zhonghe Dist., New Taipei City',
                  href: 'https://www.google.com/maps/place/%E8%A1%8C%E9%81%93%E6%9C%83%E5%8D%97%E5%8B%A2%E8%A7%92%E6%A6%AE%E8%80%80%E5%A0%82/@24.9846438,121.5119889,17z',
                  color: 'bg-wine-50 text-wine-600',
                },
                {
                  icon: Phone,
                  label: t('phone'),
                  value: '(02) 8668-5515',
                  href: 'tel:+886286685515',
                  color: 'bg-green-50 text-green-600',
                },
                {
                  icon: Mail,
                  label: t('email_label'),
                  value: 'winson651202@gmail.com',
                  href: 'mailto:winson651202@gmail.com',
                  color: 'bg-amber-50 text-amber-600',
                },
                {
                  icon: Clock,
                  label: t('office_hours'),
                  value: t('office_hours_text'),
                  href: null as string | null,
                  color: 'bg-purple-50 text-purple-600',
                },
              ].map(({ icon: Icon, label, value, href, color }) => (
                <div key={label} className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="font-medium text-gray-800 hover:text-wine-700 underline underline-offset-2 decoration-wine-200 transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="font-medium text-gray-800">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* LINE QR Code */}
            {LINE_ID && (
              <div className="mt-6 p-6 rounded-2xl border-2 border-[#06C755]/30 bg-[#06C755]/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#06C755] text-white">
                    <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">
                      {locale === 'zh-TW' ? '加入 LINE 官方帳號' : locale === 'my' ? 'LINE ထည့်ပါ' : locale === 'ja' ? 'LINE公式アカウントを追加' : 'Add LINE Official Account'}
                    </p>
                    <p className="text-xs text-gray-500">{LINE_ID}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-[#06C755]/20">
                    <QRCodeSVG
                      value={`https://line.me/ti/p/${LINE_ID}`}
                      size={140}
                      bgColor="#ffffff"
                      fgColor="#06C755"
                      level="M"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {locale === 'zh-TW'
                        ? '掃描 QR Code 或點擊下方按鈕，加入我們的 LINE 官方帳號，即時收到聚會公告與活動通知。'
                        : locale === 'my'
                        ? 'QR Code ကို စကင်ဖတ်ပါ သို့မဟုတ် အောက်ပါခလုတ်ကို နှိပ်ပါ။ ဝတ်ပြုကိုးကွယ်မှု ကြေညာချက်များ တိုက်ရိုက်ရရှိပါ။'
                        : locale === 'ja'
                        ? 'QRコードをスキャンするか、下のボタンをタップして、LINE公式アカウントに追加し、礼拝のお知らせをリアルタイムで受け取りましょう。'
                        : 'Scan the QR Code or tap the button below to add our LINE account and receive instant service announcements.'}
                    </p>
                    <a
                      href={`https://line.me/ti/p/${LINE_ID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold transition-opacity hover:opacity-90"
                      style={{ background: '#06C755' }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width={15} height={15}>
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                      </svg>
                      {locale === 'zh-TW' ? '立即加入' : locale === 'my' ? 'ထည့်ပါ' : locale === 'ja' ? '今すぐ追加' : 'Add Now'}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
