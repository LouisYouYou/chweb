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
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12c0-3.2 0-3.6.1-4.8.1-3.3 1.7-4.8 4.9-4.9 1.3-.1 1.7-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7C24 15.7 24 15.3 24 12c0-3.3 0-3.7-.1-4.9-.2-4.3-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z" />
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
    { href: `/${locale}/contact`, label: nav('contact') },
  ];

  return (
    <footer className="bg-wine-950 text-wine-100">
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
              <a href="#" className="p-2 rounded-full bg-wine-900 hover:bg-wine-700 transition-colors" aria-label="YouTube">
                <YoutubeIcon />
              </a>
              <a href="#" className="p-2 rounded-full bg-wine-900 hover:bg-wine-700 transition-colors" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="#" className="p-2 rounded-full bg-wine-900 hover:bg-wine-700 transition-colors" aria-label="Instagram">
                <InstagramIcon />
              </a>
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
                    : 'No.39-15, Zhongxiao St., Zhonghe Dist., New Taipei City'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-wine-400" />
                <span>(02) 8668-5515</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-wine-400" />
                <span>info@gracelight.org.tw</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="shrink-0 text-wine-400" />
                <span>
                  {locale === 'zh-TW' ? '週一至週五 9:00 - 17:00' : 'Mon–Fri 9:00 AM – 5:00 PM'}
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
