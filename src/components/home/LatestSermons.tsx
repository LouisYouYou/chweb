'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Play, BookOpen, ArrowRight } from 'lucide-react';
import { sermons, getYoutubeThumbnail } from '@/lib/data/sermons';

export default function LatestSermons() {
  const t = useTranslations('home.latest_sermons');
  const st = useTranslations('sermons');
  const locale = useLocale();
  const recent = sermons.slice(0, 3);

  return (
    <section className="py-20 bg-wine-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{t('title')}</h2>
            <p className="text-wine-300">{t('subtitle')}</p>
            <div className="w-16 h-1 bg-amber-500 mt-4 rounded-full" />
          </div>
          <Link
            href={`/${locale}/sermons`}
            className="flex items-center gap-2 text-wine-300 hover:text-white transition-colors text-sm font-medium group"
          >
            {t('view_all')}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recent.map((sermon) => {
            const thumbnail = getYoutubeThumbnail(sermon.youtubeUrl);
            return (
              <Link
                key={sermon.id}
                href={`/${locale}/sermons`}
                className="group bg-wine-900/40 rounded-2xl overflow-hidden border border-wine-800 hover:border-wine-600 hover:bg-wine-900/60 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="h-40 bg-gradient-to-br from-wine-700 to-wine-900 flex items-center justify-center relative overflow-hidden">
                  {thumbnail && (
                    <Image src={thumbnail} alt={sermon.titleZh} fill className="object-cover opacity-70 group-hover:opacity-80 transition-opacity" unoptimized />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-white/30">
                      <Play size={22} className="text-white ml-1" />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-wine-400 mb-2">
                    <BookOpen size={12} />
                    <span>{sermon.scripture}</span>
                    <span>·</span>
                    <span>{sermon.date}</span>
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-1 leading-tight">
                    {locale === 'zh-TW' ? sermon.titleZh : sermon.titleEn}
                  </h3>
                  <p className="text-sm text-wine-300 mb-3">
                    {locale === 'zh-TW' ? sermon.speakerZh : sermon.speakerEn}
                  </p>
                  <p className="text-xs text-amber-400 font-medium">{st('listen')} →</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
