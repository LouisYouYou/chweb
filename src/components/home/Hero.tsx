'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('home.hero');
  const locale = useLocale();

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
      {/* Church photo background */}
      <Image
        src="/church.jpg"
        alt="行道會南勢角榮耀堂"
        fill
        className="object-cover object-center"
        priority
        quality={90}
      />
      {/* Wine red overlay */}
      <div className="absolute inset-0 bg-wine-950/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-wine-950/30 via-transparent to-wine-950/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-wine-200 text-lg mb-3 tracking-widest uppercase font-light">
          {t('subtitle')}
        </p>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
          {t('title')}
        </h1>
        <p className="text-xl text-wine-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t('description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/services`}
            className="px-8 py-3.5 bg-white text-wine-800 font-semibold rounded-full hover:bg-wine-50 transition-colors shadow-lg hover:shadow-xl text-sm"
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
