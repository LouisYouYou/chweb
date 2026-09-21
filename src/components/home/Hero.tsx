'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('home.hero');
  const locale = useLocale();

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 church-gradient" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-950/30" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-blue-200 text-lg mb-3 tracking-widest uppercase font-light">
          {t('subtitle')}
        </p>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          {t('title')}
        </h1>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t('description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/services`}
            className="px-8 py-3.5 bg-white text-blue-800 font-semibold rounded-full hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl text-sm"
          >
            {t('cta_primary')}
          </Link>
          <Link
            href={`/${locale}/about`}
            className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors text-sm"
          >
            {t('cta_secondary')}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
        <ChevronDown size={24} />
      </div>
    </section>
  );
}
