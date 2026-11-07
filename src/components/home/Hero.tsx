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

  const isCJK = locale === 'zh-TW' || locale === 'ja';
  const titleText = t('title');
  const titleChars = isCJK ? [...titleText] : null;

  return (
    <section
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: 'calc(max(92svh, 92vh) + 6.5rem)', marginTop: '-6.5rem', paddingTop: '6.5rem' }}
    >
      {/* Background photo */}
      <Image
        src="/church.jpg"
        alt="行道會南勢角榮耀堂"
        fill
        className="object-cover object-center"
        priority
        quality={90}
      />

      {/* Cinematic overlay — editorial wine × ink vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-900/55 to-ink-900/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-wine-950/75 via-transparent to-ink-950/15" />
      <div className="absolute inset-0 bg-gradient-to-tr from-wine-950/50 via-transparent to-transparent" />

      {/* Warm Gold left accent bar */}
      <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-gradient-to-b from-transparent via-gold-warm-500/60 to-transparent rounded-r" />

      {/* Content — left-aligned editorial */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-2xl">

          {/* Eyebrow */}
          <p
            className="text-xs tracking-[0.3em] uppercase font-semibold mb-5"
            style={{
              color: '#AD8C60',
              animation: 'hero-title-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both',
            }}
          >
            {t('subtitle')}
          </p>

          {/* Main title */}
          <h1
            className="font-bold text-white mb-5 leading-tight"
            style={{
              fontSize: locale === 'ja'
                ? 'clamp(1.3rem, 7.2vw, 4.5rem)'
                : 'clamp(1.8rem, 6vw, 4.5rem)',
              whiteSpace: isCJK ? 'nowrap' : 'normal',
              animation: isCJK ? undefined : 'hero-title-in 0.9s cubic-bezier(0.22,1,0.36,1) both',
            }}
          >
            {titleChars
              ? titleChars.map((char, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      animation: `hero-char-in 0.65s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s both`,
                    }}
                  >
                    {char}
                  </span>
                ))
              : titleText}
          </h1>

          {/* Warm Gold editorial divider */}
          <div
            className="w-12 h-0.5 rounded-full mb-5"
            style={{
              backgroundColor: '#AD8C60',
              opacity: 0.7,
              animation: 'hero-title-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s both',
            }}
          />

          {/* Description */}
          <p
            className="text-base sm:text-lg text-white/80 mb-2 leading-relaxed"
            style={{ animation: 'hero-title-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both' }}
          >
            {t('description')}
          </p>
          <p
            className="text-sm sm:text-base mb-8 leading-relaxed font-medium"
            style={{
              color: '#c9a060cc',
              animation: 'hero-title-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.6s both',
            }}
          >
            {t('description2')}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col gap-3"
            style={{ animation: 'hero-title-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.7s both' }}
          >
            {/* Primary row */}
            <div className="flex flex-row flex-wrap gap-3">
              <Link
                href={`/${locale}/first-visit`}
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 bg-wine-700 text-white font-bold rounded-full hover:bg-wine-800 text-sm whitespace-nowrap shrink-0 cta-depth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-ink-900"
              >
                {t('cta_primary')}
              </Link>
              <Link
                href={`/${locale}/services`}
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 border border-white/50 text-white/90 font-semibold rounded-full hover:bg-white/10 hover:border-white/70 text-sm whitespace-nowrap shrink-0 backdrop-blur-sm cta-depth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-1 focus-visible:ring-offset-ink-900"
              >
                {t('cta_secondary')}
              </Link>
            </div>

            {/* Tertiary row */}
            <div className="flex flex-row gap-3">
              <Link
                href={`/${locale}/weekly-bulletin`}
                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 border border-white/20 text-white/45 font-medium rounded-full hover:bg-white/5 hover:border-white/35 hover:text-white/65 text-xs backdrop-blur-sm cta-depth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-1 focus-visible:ring-offset-ink-900"
              >
                <FileText size={12} aria-hidden="true" />
                {zh ? '教會週報' : 'Bulletin'}
              </Link>

              {liveStatus === 'live' ? (
                <a
                  href="https://www.youtube.com/@winson651202/live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 border border-red-400/70 text-red-300/80 font-medium rounded-full bg-red-400/10 hover:bg-red-400/20 text-xs backdrop-blur-sm cta-depth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-ink-900"
                >
                  <span aria-hidden="true" className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  {zh ? '直播中' : 'Live Now'}
                </a>
              ) : liveStatus === 'offline' ? (
                <a
                  href="https://www.youtube.com/@winson651202"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 border border-white/20 text-white/40 font-medium rounded-full hover:bg-white/5 hover:text-white/55 text-xs backdrop-blur-sm cta-depth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-1 focus-visible:ring-offset-ink-900"
                >
                  <Radio size={12} aria-hidden="true" className="opacity-45" />
                  {zh ? '主日直播' : 'Live'}
                </a>
              ) : (
                <span className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 border border-white/15 text-white/25 font-medium rounded-full text-xs backdrop-blur-sm cursor-default">
                  <Radio size={12} aria-hidden="true" className="opacity-25" />
                  {zh ? '主日直播' : 'Live'}
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div
            className="mt-10 sm:mt-14 flex flex-wrap gap-8 sm:gap-12"
            style={{ animation: 'hero-title-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.85s both' }}
          >
            {[
              { num: '7', label: locale === 'zh-TW' ? '週年' : 'Years' },
              { num: '∞', label: locale === 'zh-TW' ? '神的恩典' : "God's Grace", decorative: true },
              { num: '3', label: locale === 'zh-TW' ? '週間聚會' : 'Weekly Meetings' },
              { num: '✦', label: locale === 'zh-TW' ? '課後輔導教育' : 'After-School Tutoring', decorative: true },
            ].map(({ num, label, decorative }) => (
              <div key={label} className="text-left">
                <p
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: '#c9a060' }}
                  aria-hidden={decorative ? 'true' : undefined}
                >
                  {num}
                </p>
                <p className="text-xs text-white/50 mt-1 tracking-wide">{label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div aria-hidden="true" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-bounce">
        <ChevronDown size={22} />
      </div>
    </section>
  );
}
