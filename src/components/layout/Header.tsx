'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Menu, X, Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/sermons`, label: t('sermons') },
    { href: `/${locale}/events`, label: t('events') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  const switchLocale = () => {
    const newLocale = locale === 'zh-TW' ? 'en' : 'zh-TW';
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-wine-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="Glory Church Nanshijiao Logo"
              width={40}
              height={40}
              className="rounded-full shadow-md group-hover:shadow-lg transition-shadow"
            />
            <div className="hidden sm:block">
              <p className="font-bold text-wine-900 text-sm leading-tight">
                {locale === 'zh-TW' ? '行道會南勢角榮耀堂' : 'Glory Church Nanshijiao'}
              </p>
              <p className="text-xs text-wine-500 leading-tight">
                {locale === 'zh-TW' ? 'Glory Church Nanshijiao' : '行道會南勢角榮耀堂'}
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(href)
                    ? 'text-wine-700 bg-wine-50'
                    : 'text-gray-600 hover:text-wine-700 hover:bg-wine-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={switchLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-wine-700 border border-gray-200 hover:border-wine-300 rounded-full transition-colors"
            >
              <Globe size={14} />
              <span>{locale === 'zh-TW' ? 'EN' : '中文'}</span>
            </button>
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-wine-700 hover:bg-wine-50"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-wine-100 bg-white">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(href)
                    ? 'text-wine-700 bg-wine-50'
                    : 'text-gray-700 hover:text-wine-700 hover:bg-wine-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
