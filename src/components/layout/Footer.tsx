'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5a3 3 0 0 0-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
    <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1c0 6 4.4 11 10.1 11.9v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.4l-.5 3.5h-2.8v8.4C19.6 23.1 24 18.1 24 12.1z" />
  </svg>
);
const LineIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
  </svg>
);

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const locale = useLocale();

  const navLinks = [
    { href: `/${locale}`, label: nav('home') },
    { href: `/${locale}/about`, label: nav('about') },
    { href: `/${locale}/services`, label: nav('services') },
    { href: `/${locale}/sermons`, label: nav('sermons') },
    { href: `/${locale}/events`, label: nav('events') },
    { href: `/${locale}/daily-scripture`, label: nav('daily_scripture') },
    { href: `/${locale}/weekly-bulletin`, label: nav('weekly_bulletin') },
    { href: `/${locale}/gallery`, label: nav('gallery') },
    { href: `/${locale}/contact`, label: nav('contact') },
  ];

  return (
    <footer className="bg-wine-950 text-wine-100">
      {/* Amber accent top line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/logo.png"
                alt="Glory Church Of Nanshijiao Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <p className="font-bold text-white text-lg">
                {locale === 'zh-TW' ? '行道會南勢角榮耀堂' : 'Glory Church Of Nanshijiao'}
              </p>
            </div>
            <p className="text-sm text-wine-300 leading-relaxed mb-4">{t('description')}</p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/p/%E8%A1%8C%E9%81%93%E6%9C%83%E5%8D%97%E5%8B%A2%E8%A7%92%E6%A6%AE%E8%80%80%E5%A0%82-100071633452675/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-wine-900 hover:bg-wine-700 transition-colors" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://www.youtube.com/@winson651202" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-wine-900 hover:bg-wine-700 transition-colors" aria-label="YouTube">
                <YoutubeIcon />
              </a>
              {process.env.NEXT_PUBLIC_LINE_ID && (
                <a href={`https://line.me/R/ti/p/${process.env.NEXT_PUBLIC_LINE_ID}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[#06C755]/20 hover:bg-[#06C755]/40 transition-colors text-[#06C755]" aria-label="LINE">
                  <LineIcon />
                </a>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('quick_links')}</h3>
            <ul className="space-y-2">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-wine-300 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('contact_info')}</h3>
            <ul className="space-y-3 text-sm text-wine-300">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-wine-400" />
                <span>
                  {locale === 'zh-TW'
                    ? '新北市中和區忠孝街 39-15 號'
                    : locale === 'my'
                    ? 'အမှတ် ၃၉-၁၅၊ ဇောင်းရှောင်လမ်း၊ ဇောင်းဟဲ ခရိုင်၊ နယူးတိုင်းပေ'
                    : locale === 'ja'
                    ? '新北市中和区忠孝街39-15号'
                    : 'No.39-15, Zhongxiao St., Zhonghe Dist., New Taipei City'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-wine-400" />
                <a href="tel:+886286685515" className="hover:text-white transition-colors">(02) 8668-5515</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-wine-400" />
                <a href="mailto:winson651202@gmail.com" className="hover:text-white transition-colors">winson651202@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="shrink-0 text-wine-400" />
                <span>
                  {locale === 'zh-TW' ? '週一至週五 9:00 - 17:00' : locale === 'my' ? 'တနင်္လာ – သောကြာ ၉:၀၀ – ၁၇:၀၀' : locale === 'ja' ? '月〜金 9:00 – 17:00' : 'Mon–Fri 9:00 AM – 5:00 PM'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-wine-900 mt-10 pt-6 text-center text-xs text-wine-400">
          {t('copyright')}
        </div>
      </div>
    </footer>
  );
}
