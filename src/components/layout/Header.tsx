'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Menu, X, Globe, LogIn, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string | null } | null>(null);
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const zh = locale === 'zh-TW';

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/sermons`, label: t('sermons') },
    { href: `/${locale}/events`, label: t('events') },
    { href: `/${locale}/daily-scripture`, label: t('daily_scripture') },
    { href: `/${locale}/weekly-bulletin`, label: t('weekly_bulletin') },
    { href: `/${locale}/gallery`, label: t('gallery') },
    { href: `/${locale}/prayer-wall`, label: t('prayer_wall') },
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
    <header className="sticky top-0 z-50 bg-white/97 backdrop-blur-md shadow-sm">
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
            {user ? (
              <Link
                href={`/${locale}/profile`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-wine-700 border border-wine-200 hover:bg-wine-50 rounded-full transition-colors"
              >
                <User size={14} />
                <span className="hidden sm:inline">{zh ? '我的帳號' : 'Profile'}</span>
              </Link>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white church-gradient hover:opacity-90 rounded-full transition-opacity"
              >
                <LogIn size={14} />
                <span className="hidden sm:inline">{zh ? '登入' : 'Sign In'}</span>
              </Link>
            )}
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
