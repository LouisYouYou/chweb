'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronDown, FileText, Radio } from 'lucide-react';

function isSundayInTaiwan(): boolean {
  const tw = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Taipei' }));
  return tw.getDay() === 0;
}

export default function Hero() {
  const t = useTranslations('home.hero');
  const locale = useLocale();
  const isSunday = isSundayInTaiwan();
  const zh = locale === 'zh-TW';

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background photo */}
      <Image
        src="/church.jpg"
        alt="行道會南勢角榮耀堂"
        fill
        className="object-cover object-center scale-105"
        priority
        quality={95}
      />

      {/* Multi-layer overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-wine-950/90 via-wine-900/70 to-wine-800/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-wine-950/90 via-transparent to-wine-950/30" />

      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />

      {/* Amber side accent */}
      <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-transparent via-amber-400/60 to-transparent rounded-r" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">

        {/* Subtitle with decorative lines */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/70" />
          <p className="text-amber-300 text-xs sm:text-sm tracking-[0.35em] uppercase font-semibold">
            {t('subtitle')}
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/70" />
        </div>

        {/* Main title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-4 leading-tight"
          style={{ textShadow: '0 4px 32px rgba(56,10,20,0.8)' }}>
          {t('title')}
        </h1>

        {/* Gold divider */}
        <div className="flex justify-center mb-6">
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full" />
        </div>

        {/* Description */}
        <p className="text-base sm:text-xl text-wine-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t('description')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${locale}/services`} className="px-8 py-3.5 border border-amber-400/60 text-amber-300 font-semibold rounded-full hover:bg-amber-400/10 hover:border-amber-400 transition-all text-sm backdrop-blur-sm">
            {t('cta_primary')}
          </Link>
          <Link
            href={`/${locale}/about`}
            className="px-8 py-3.5 border border-amber-400/60 text-amber-300 font-semibold rounded-full hover:bg-amber-400/10 hover:border-amber-400 transition-all text-sm backdrop-blur-sm"
          >
            {t('cta_secondary')}
          </Link>
          <Link
            href={`/${locale}/weekly-bulletin`}
            className="flex items-center justify-center gap-2 px-8 py-3.5 border border-amber-400/60 text-amber-300 font-semibold rounded-full hover:bg-amber-400/10 hover:border-amber-400 transition-all text-sm backdrop-blur-sm"
          >
            <FileText size={15} />
            {zh ? '教會週報' : 'Bulletin'}
          </Link>
          <a
            href="https://www.youtube.com/@winson651202/live"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-8 py-3.5 border border-red-400/60 text-red-300 font-semibold rounded-full hover:bg-red-400/10 hover:border-red-400 transition-all text-sm backdrop-blur-sm"
          >
            {isSunday ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                {zh ? '直播中' : 'Live Now'}
              </>
            ) : (
              <>
                <Radio size={15} />
                {zh ? '主日直播' : 'Live Stream'}
              </>
            )}
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 flex justify-center gap-8 sm:gap-16">
          {[
            { num: '7', label: locale === 'zh-TW' ? '週年' : 'Years' },
            { num: '∞', label: locale === 'zh-TW' ? '神的恩典' : "God's Grace" },
            { num: '3', label: locale === 'zh-TW' ? '週間聚會' : 'Weekly Meetings' },
            { num: '✦', label: locale === 'zh-TW' ? '課後輔導教育' : 'After-School Tutoring' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold gradient-text-gold">{num}</p>
              <p className="text-xs text-wine-300 mt-1 tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce">
        <ChevronDown size={22} />
      </div>
    </section>
  );
}
