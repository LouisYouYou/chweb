'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Menu, X, Globe, ChevronDown, BookOpen, Newspaper, Camera, Heart, HelpCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderProps {
  locale: string;
}

const LOCALE_LABELS: Record<string, string> = {
  'zh-TW': '中文',
  'en': 'EN',
  'my': 'မြန်မာ',
  'ja': '日本語',
};

export default function Header({ locale }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [resourcesMobileOpen, setResourcesMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langHoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);

  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const zh = locale === 'zh-TW';

  const mainLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/sermons`, label: t('sermons') },
    { href: `/${locale}/events`, label: t('events') },
  ];

  const resourceLinks = [
    { href: `/${locale}/daily-scripture`, label: t('daily_scripture'), icon: BookOpen },
    { href: `/${locale}/weekly-bulletin`, label: t('weekly_bulletin'), icon: Newspaper },
    { href: `/${locale}/gallery`, label: t('gallery'), icon: Camera },
    { href: `/${locale}/prayer-wall`, label: t('prayer_wall'), icon: Heart },
    { href: `/${locale}/faq`, label: t('faq'), icon: HelpCircle },
  ];

  const switchLocale = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setLangOpen(false);
  };

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(href);
  };

  const isResourcesActive = resourceLinks.some(r => pathname.startsWith(r.href));

  const openDropdown = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setDesktopDropdownOpen(true);
  };

  const closeDropdown = () => {
    hoverTimeout.current = setTimeout(() => setDesktopDropdownOpen(false), 120);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/97 backdrop-blur-md shadow-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Amber accent top line */}
      <div className="h-0.5 bg-gradient-to-r from-wine-700 via-amber-400 to-wine-700" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="Glory Church Of Nanshijiao Logo"
              width={40}
              height={40}
              className="rounded-full shadow-md group-hover:shadow-lg transition-shadow"
            />
            <div className="hidden sm:block">
              <p className="font-bold text-wine-900 text-sm leading-tight">
                {locale === 'zh-TW' ? '行道會南勢角榮耀堂' : 'Glory Church Of Nanshijiao'}
              </p>
              <p className="text-xs text-wine-500 leading-tight">
                {locale === 'zh-TW' ? 'Glory Church Of Nanshijiao' : '行道會南勢角榮耀堂'}
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainLinks.map(({ href, label }) => (
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

            {/* Resources dropdown */}
            <div
              className="relative"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isResourcesActive
                    ? 'text-wine-700 bg-wine-50'
                    : 'text-gray-600 hover:text-wine-700 hover:bg-wine-50'
                }`}
              >
                {t('resources')}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${desktopDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {desktopDropdownOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-wine-100 py-2 w-44 overflow-hidden">
                    {resourceLinks.map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                          isActive(href)
                            ? 'text-wine-700 bg-wine-50 font-medium'
                            : 'text-gray-600 hover:text-wine-700 hover:bg-wine-50'
                        }`}
                      >
                        <Icon size={14} className="text-wine-400 shrink-0" />
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`/${locale}/contact`}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(`/${locale}/contact`)
                  ? 'text-wine-700 bg-wine-50'
                  : 'text-gray-600 hover:text-wine-700 hover:bg-wine-50'
              }`}
            >
              {t('contact')}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language switcher dropdown */}
            <div
              className="relative"
              onMouseEnter={() => { if (langHoverTimeout.current) clearTimeout(langHoverTimeout.current); setLangOpen(true); }}
              onMouseLeave={() => { langHoverTimeout.current = setTimeout(() => setLangOpen(false), 120); }}
            >
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-wine-700 border border-gray-200 hover:border-wine-300 rounded-full transition-colors"
                onClick={() => setLangOpen(v => !v)}
              >
                <Globe size={14} />
                <span>{LOCALE_LABELS[locale] ?? locale}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div
                  className="absolute right-0 top-full pt-2"
                  onMouseEnter={() => { if (langHoverTimeout.current) clearTimeout(langHoverTimeout.current); }}
                  onMouseLeave={() => { langHoverTimeout.current = setTimeout(() => setLangOpen(false), 120); }}
                >
                  <div className="bg-white rounded-xl shadow-lg border border-wine-100 py-1.5 w-32 overflow-hidden">
                    {Object.entries(LOCALE_LABELS).map(([code, label]) => (
                      <button
                        key={code}
                        onClick={() => switchLocale(code)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          locale === code
                            ? 'text-wine-700 bg-wine-50 font-medium'
                            : 'text-gray-600 hover:text-wine-700 hover:bg-wine-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
            {mainLinks.map(({ href, label }) => (
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

            {/* Resources accordion */}
            <div>
              <button
                onClick={() => setResourcesMobileOpen(v => !v)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isResourcesActive
                    ? 'text-wine-700 bg-wine-50'
                    : 'text-gray-700 hover:text-wine-700 hover:bg-wine-50'
                }`}
              >
                {t('resources')}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${resourcesMobileOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {resourcesMobileOpen && (
                <div className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l-2 border-wine-100 pl-3">
                  {resourceLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive(href)
                          ? 'text-wine-700 font-medium'
                          : 'text-gray-600 hover:text-wine-700'
                      }`}
                    >
                      <Icon size={13} className="text-wine-400 shrink-0" />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={`/${locale}/contact`}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive(`/${locale}/contact`)
                  ? 'text-wine-700 bg-wine-50'
                  : 'text-gray-700 hover:text-wine-700 hover:bg-wine-50'
              }`}
            >
              {t('contact')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
