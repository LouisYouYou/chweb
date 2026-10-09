'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Menu, X, ChevronDown, BookOpen, Newspaper, Camera, Heart } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderProps {
  locale: string;
}

const LOCALE_DATA: Record<string, { code: string; label: string }> = {
  'zh-TW': { code: 'tw', label: '繁體中文' },
  'en':    { code: 'us', label: 'English' },
  'my':    { code: 'mm', label: 'မြန်မာ' },
  'ja':    { code: 'jp', label: '日本語' },
};

export default function Header({ locale }: HeaderProps) {
  const [menuOpen, setMenuOpen]                     = useState(false);
  const [resourcesMobileOpen, setResourcesMobileOpen] = useState(false);
  const [langOpen, setLangOpen]                     = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);

  const hoverTimeout      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langHoverTimeout  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hamburgerRef      = useRef<HTMLButtonElement>(null);
  const mobileMenuRef     = useRef<HTMLDivElement>(null);
  const resourcesTriggerRef = useRef<HTMLButtonElement>(null);
  const resourcesMenuRef  = useRef<HTMLDivElement>(null);
  const langTriggerRef    = useRef<HTMLButtonElement>(null);

  const t        = useTranslations('nav');
  const pathname = usePathname();
  const router   = useRouter();

  const mainLinks = [
    { href: `/${locale}`,          label: t('home') },
    { href: `/${locale}/about`,    label: t('about') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/sermons`,  label: t('sermons') },
    { href: `/${locale}/events`,   label: t('events') },
  ];

  const resourceLinks = [
    { href: `/${locale}/daily-scripture`,  label: t('daily_scripture'),  icon: BookOpen },
    { href: `/${locale}/weekly-bulletin`,  label: t('weekly_bulletin'),  icon: Newspaper },
    { href: `/${locale}/gallery`,          label: t('gallery'),           icon: Camera },
    { href: `/${locale}/prayer-wall`,      label: t('prayer_wall'),      icon: Heart },
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

  // Desktop Resources dropdown hover
  const openDropdown  = () => { if (hoverTimeout.current) clearTimeout(hoverTimeout.current); setDesktopDropdownOpen(true); };
  const closeDropdown = () => { hoverTimeout.current = setTimeout(() => setDesktopDropdownOpen(false), 120); };

  // Move focus to first item when mobile menu opens
  useEffect(() => {
    if (menuOpen && mobileMenuRef.current) {
      const first = mobileMenuRef.current.querySelector<HTMLElement>('a[href], button:not([disabled])');
      first?.focus();
    }
  }, [menuOpen]);

  // ── Mobile menu: focus trap + Escape ─────────────────────────────────────
  const handleMobileMenuKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      setMenuOpen(false);
      hamburgerRef.current?.focus();
      return;
    }
    if (e.key === 'Tab' && mobileMenuRef.current) {
      const focusable = Array.from(
        mobileMenuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      );
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  // ── Desktop Resources dropdown keyboard ──────────────────────────────────
  const handleResourcesTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Escape') {
      setDesktopDropdownOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setDesktopDropdownOpen(true);
      setTimeout(() => {
        resourcesMenuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
      }, 0);
    }
  };

  const handleResourcesMenuKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, idx: number) => {
    const items = resourcesMenuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    const count = items?.length ?? 0;
    if (e.key === 'Escape') {
      setDesktopDropdownOpen(false);
      resourcesTriggerRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      items?.[(idx + 1) % count]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items?.[(idx - 1 + count) % count]?.focus();
    } else if (e.key === 'Tab') {
      setDesktopDropdownOpen(false);
    }
  };

  // ── Language dropdown keyboard ────────────────────────────────────────────
  const handleLangItemKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Escape') { setLangOpen(false); langTriggerRef.current?.focus(); }
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white/[.97] backdrop-blur-md shadow-sm"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Brand accent bar */}
      <div aria-hidden="true" className="h-0.5 bg-gradient-to-r from-wine-700 via-amber-400 to-wine-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-2"
          >
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

          {/* ── Desktop nav ── */}
          <nav aria-label={t('main_nav')} className="hidden lg:flex items-center gap-1">
            {mainLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center px-3 py-2.5 min-h-[44px] rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-1 ${
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
                ref={resourcesTriggerRef}
                aria-haspopup="menu"
                aria-expanded={desktopDropdownOpen}
                aria-controls="resources-menu"
                onClick={() => setDesktopDropdownOpen(v => !v)}
                onKeyDown={handleResourcesTriggerKeyDown}
                className={`inline-flex items-center gap-1 px-3 py-2.5 min-h-[44px] rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-1 ${
                  isResourcesActive
                    ? 'text-wine-700 bg-wine-50'
                    : 'text-gray-600 hover:text-wine-700 hover:bg-wine-50'
                }`}
              >
                {t('resources')}
                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  className={`transition-transform duration-200 ${desktopDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {desktopDropdownOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                >
                  <div
                    id="resources-menu"
                    role="menu"
                    ref={resourcesMenuRef}
                    className="bg-white rounded-2xl shadow-lg border border-wine-100 py-2 w-44 overflow-hidden"
                  >
                    {resourceLinks.map(({ href, label, icon: Icon }, idx) => (
                      <Link
                        key={href}
                        href={href}
                        role="menuitem"
                        onKeyDown={(e) => handleResourcesMenuKeyDown(e, idx)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:bg-wine-50 focus:text-wine-700 ${
                          isActive(href)
                            ? 'text-wine-700 bg-wine-50 font-medium'
                            : 'text-gray-600 hover:text-wine-700 hover:bg-wine-50'
                        }`}
                      >
                        <Icon size={14} aria-hidden="true" className="text-wine-400 shrink-0" />
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`/${locale}/contact`}
              className={`inline-flex items-center px-3 py-2.5 min-h-[44px] rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-1 ${
                isActive(`/${locale}/contact`)
                  ? 'text-wine-700 bg-wine-50'
                  : 'text-gray-600 hover:text-wine-700 hover:bg-wine-50'
              }`}
            >
              {t('contact')}
            </Link>
          </nav>

          {/* ── Actions ── */}
          <div className="flex items-center gap-2">

            {/* Language switcher */}
            <div
              className="relative"
              onMouseEnter={() => { if (langHoverTimeout.current) clearTimeout(langHoverTimeout.current); setLangOpen(true); }}
              onMouseLeave={() => { langHoverTimeout.current = setTimeout(() => setLangOpen(false), 120); }}
            >
              <button
                ref={langTriggerRef}
                aria-label={LOCALE_DATA[locale]?.label ?? locale}
                aria-expanded={langOpen}
                aria-controls="lang-menu"
                onClick={() => setLangOpen(v => !v)}
                onKeyDown={(e) => { if (e.key === 'Escape') setLangOpen(false); }}
                className="flex items-center gap-2 px-3 py-1.5 min-h-[44px] text-sm text-gray-600 hover:text-wine-700 border border-gray-200 hover:border-wine-300 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-1"
              >
                <span
                  aria-hidden="true"
                  className={`fi fi-${LOCALE_DATA[locale]?.code ?? 'tw'} fis rounded-full shrink-0`}
                  style={{ width: 18, height: 18 }}
                />
                <span className="hidden sm:inline">{LOCALE_DATA[locale]?.label ?? locale}</span>
                <ChevronDown size={12} aria-hidden="true" className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div
                  id="lang-menu"
                  className="absolute right-0 top-full pt-2"
                  onMouseEnter={() => { if (langHoverTimeout.current) clearTimeout(langHoverTimeout.current); }}
                  onMouseLeave={() => { langHoverTimeout.current = setTimeout(() => setLangOpen(false), 120); }}
                >
                  <div className="bg-white rounded-xl shadow-lg border border-wine-100 py-1.5 w-44 overflow-hidden">
                    {Object.entries(LOCALE_DATA).map(([localeCode, { code, label }]) => (
                      <button
                        key={localeCode}
                        onClick={() => switchLocale(localeCode)}
                        onKeyDown={handleLangItemKeyDown}
                        className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 min-h-[44px] text-sm transition-colors focus:outline-none focus:bg-wine-50 focus:text-wine-700 ${
                          locale === localeCode
                            ? 'text-wine-700 bg-wine-50 font-medium'
                            : 'text-gray-600 hover:text-wine-700 hover:bg-wine-50'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`fi fi-${code} fis rounded-full shrink-0`}
                          style={{ width: 18, height: 18 }}
                        />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button
              ref={hamburgerRef}
              aria-label={menuOpen ? t('close_menu') : t('open_menu')}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(v => !v)}
              className="lg:hidden inline-flex items-center justify-center p-2 min-h-[44px] min-w-[44px] rounded-md text-gray-600 hover:text-wine-700 hover:bg-wine-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-1"
            >
              {menuOpen
                ? <X    size={20} aria-hidden="true" />
                : <Menu size={20} aria-hidden="true" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          onKeyDown={handleMobileMenuKeyDown}
          className="lg:hidden border-t border-wine-100 bg-white"
        >
          <nav aria-label={t('main_nav')} className="px-4 py-3 flex flex-col gap-1">
            {mainLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center px-3 py-2.5 min-h-[44px] rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-1 ${
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
                aria-expanded={resourcesMobileOpen}
                aria-controls="mobile-resources-menu"
                onClick={() => setResourcesMobileOpen(v => !v)}
                className={`w-full flex items-center justify-between px-3 py-2.5 min-h-[44px] rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-1 ${
                  isResourcesActive
                    ? 'text-wine-700 bg-wine-50'
                    : 'text-gray-700 hover:text-wine-700 hover:bg-wine-50'
                }`}
              >
                {t('resources')}
                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  className={`transition-transform duration-200 ${resourcesMobileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {resourcesMobileOpen && (
                <div
                  id="mobile-resources-menu"
                  className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l-2 border-wine-100 pl-3"
                >
                  {resourceLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2.5 min-h-[44px] rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-1 ${
                        isActive(href)
                          ? 'text-wine-700 font-medium'
                          : 'text-gray-600 hover:text-wine-700'
                      }`}
                    >
                      <Icon size={13} aria-hidden="true" className="text-wine-400 shrink-0" />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={`/${locale}/contact`}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center px-3 py-2.5 min-h-[44px] rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-1 ${
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
