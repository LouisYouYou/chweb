'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Play, BookOpen, ArrowRight, Calendar } from 'lucide-react';
import { sermons, getYoutubeThumbnail } from '@/lib/data/sermons';

export default function LatestSermons() {
  const t = useTranslations('home.latest_sermons');
  const st = useTranslations('sermons');
  const locale = useLocale();
  const recent = sermons.slice(0, 3);

  return (
    <section className="py-24 dark-section relative overflow-hidden">
      {/* Decorative dot grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />
      {/* Amber glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
          <div>
            <p className="text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-3">
              {locale === 'zh-TW' ? 'SERMONS' : '講道媒體'}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{t('title')}</h2>
            <p className="text-wine-300 text-sm">{t('subtitle')}</p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-transparent mt-4 rounded-full" />
          </div>
          <Link
            href={`/${locale}/sermons`}
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm font-semibold group border border-amber-400/30 hover:border-amber-400/60 px-4 py-2 rounded-full"
          >
            {t('view_all')}
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recent.map((sermon) => {
            const thumbnail = getYoutubeThumbnail(sermon.youtubeUrl);
            return (
              <Link
                key={sermon.id}
                href={`/${locale}/sermons`}
                className="group glass-card rounded-2xl overflow-hidden card-glow transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative h-44 bg-wine-950 overflow-hidden">
                  {thumbnail && (
                    <Image src={thumbnail} alt={sermon.titleZh} fill className="object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500" unoptimized />
                  )}
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl border-2 border-amber-400/60"
                      style={{ background: 'linear-gradient(135deg, #b8860b80, #d4a84380)' }}>
                      <Play size={20} className="text-amber-300 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  {/* Category */}
                  <span className="absolute top-3 left-3 text-xs bg-wine-700/90 text-wine-100 px-2.5 py-1 rounded-full font-medium">
                    {sermon.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-wine-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={11} />{sermon.date}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><BookOpen size={11} />{sermon.scripture}</span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug mb-2 group-hover:text-amber-200 transition-colors">
                    {locale === 'zh-TW' ? sermon.titleZh : sermon.titleEn}
                  </h3>
                  <p className="text-sm text-wine-300 mb-4">
                    {locale === 'zh-TW' ? sermon.speakerZh : sermon.speakerEn}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                    {st('listen')}
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Amber glow bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
    </section>
  );
}
