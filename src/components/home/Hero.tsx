'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { ChevronDown, FileText, Radio } from 'lucide-react';

type LiveStatus = 'loading' | 'live' | 'offline'

export default function Hero() {
  const t = useTranslations('home.hero');
  const locale = useLocale();
  const zh = locale === 'zh-TW';
  const [liveStatus, setLiveStatus] = useState<LiveStatus>('loading');

  useEffect(() => {
    fetch('/api/youtube-live')
      .then((r) => r.json())
      .then((d) => setLiveStatus(d.isLive ? 'live' : 'offline'))
      .catch(() => setLiveStatus('offline'));
  }, []);

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
        <h1 className="text-3xl sm:text-6xl md:text-7xl font-bold text-white mb-4 leading-tight break-words"
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

        {/* CTAs — 2×2 grid on mobile, single row on sm+ */}
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-3 justify-center max-w-xs sm:max-w-none mx-auto">
          <Link
            href={`/${locale}/services`}
            className="flex items-center justify-center px-4 sm:px-7 py-3 sm:py-3.5 bg-amber-400 text-wine-900 font-bold rounded-full hover:bg-amber-300 active:bg-amber-300 transition-all text-xs sm:text-sm shadow-lg shadow-amber-400/30"
          >
            {t('cta_primary')}
          </Link>
          <Link
            href={`/${locale}/about`}
            className="flex items-center justify-center px-4 sm:px-7 py-3 sm:py-3.5 border border-amber-400/60 text-amber-300 font-semibold rounded-full hover:bg-amber-400/10 hover:border-amber-400 active:bg-amber-400/10 transition-all text-xs sm:text-sm backdrop-blur-sm"
          >
            {t('cta_secondary')}
          </Link>
          <Link
            href={`/${locale}/weekly-bulletin`}
            className="flex items-center justify-center gap-1.5 px-4 sm:px-7 py-3 sm:py-3.5 border border-amber-400/60 text-amber-300 font-semibold rounded-full hover:bg-amber-400/10 hover:border-amber-400 active:bg-amber-400/10 transition-all text-xs sm:text-sm backdrop-blur-sm"
          >
            <FileText size={13} />
            {zh ? '教會週報' : 'Bulletin'}
          </Link>

          {liveStatus === 'live' ? (
            <a
              href="https://www.youtube.com/@winson651202/live"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-4 sm:px-7 py-3 sm:py-3.5 border border-red-400 text-red-300 font-semibold rounded-full bg-red-400/10 hover:bg-red-400/20 transition-all text-xs sm:text-sm backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-red-500" />
              </span>
              {zh ? '直播中' : 'Live Now'}
            </a>
          ) : liveStatus === 'offline' ? (
            <a
              href="https://www.youtube.com/@winson651202"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-4 sm:px-7 py-3 sm:py-3.5 border border-white/20 text-white/40 font-semibold rounded-full hover:bg-white/5 transition-all text-xs sm:text-sm backdrop-blur-sm"
            >
              <Radio size={13} className="opacity-50" />
              <span className="sm:hidden">{zh ? '主日直播' : 'Live'}</span>
              <span className="hidden sm:inline">{zh ? '現在沒有線上直播' : 'No Live Stream'}</span>
            </a>
          ) : (
            <span className="flex items-center justify-center gap-1.5 px-4 sm:px-7 py-3 sm:py-3.5 border border-white/20 text-white/30 font-semibold rounded-full text-xs sm:text-sm backdrop-blur-sm">
              <Radio size={13} className="opacity-30" />
              {zh ? '主日直播' : 'Live'}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="mt-10 sm:mt-16 grid grid-cols-2 sm:flex sm:justify-center gap-5 sm:gap-16">
          {[
            { num: '7', label: locale === 'zh-TW' ? '週年' : 'Years' },
            { num: '∞', label: locale === 'zh-TW' ? '神的恩典' : "God's Grace", decorative: true },
            { num: '3', label: locale === 'zh-TW' ? '週間聚會' : 'Weekly Meetings' },
            { num: '✦', label: locale === 'zh-TW' ? '課後輔導教育' : 'After-School Tutoring', decorative: true },
          ].map(({ num, label, decorative }) => (
            <div key={label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold gradient-text-gold" aria-hidden={decorative ? 'true' : undefined}>{num}</p>
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
