'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Play, BookOpen, ArrowRight } from 'lucide-react';
import { sermons } from '@/lib/data/sermons';

export default function LatestSermons() {
  const t = useTranslations('home.latest_sermons');
  const st = useTranslations('sermons');
  const locale = useLocale();
  const recent = sermons.slice(0, 3);

  return (
    <section className="py-20 bg-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{t('title')}</h2>
            <p className="text-blue-300">{t('subtitle')}</p>
            <div className="w-16 h-1 bg-amber-500 mt-4 rounded-full" />
          </div>
          <Link
            href={`/${locale}/sermons`}
            className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors text-sm font-medium group"
          >
            {t('view_all')}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recent.map((sermon) => (
            <div
              key={sermon.id}
              className="group bg-blue-900/40 rounded-2xl overflow-hidden border border-blue-800 hover:border-blue-600 hover:bg-blue-900/60 transition-all duration-300"
            >
              {/* Thumbnail placeholder */}
              <div className="h-40 bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('/images/cross-pattern.png')] bg-center bg-cover" />
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-white/20">
                  <Play size={22} className="text-white ml-1" />
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-blue-400 mb-2">
                  <BookOpen size={12} />
                  <span>{sermon.scripture}</span>
                  <span>·</span>
                  <span>{sermon.date}</span>
                </div>
                <h3 className="font-semibold text-white text-lg mb-1 leading-tight">
                  {locale === 'zh-TW' ? sermon.titleZh : sermon.titleEn}
                </h3>
                <p className="text-sm text-blue-300 mb-3">
                  {locale === 'zh-TW' ? sermon.speakerZh : sermon.speakerEn}
                </p>
                <div className="flex items-center justify-between text-xs text-blue-400">
                  <span>{st('duration')}: {sermon.duration}</span>
                  <Link
                    href={`/${locale}/sermons`}
                    className="text-amber-400 hover:text-amber-300 font-medium"
                  >
                    {st('listen')} →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
