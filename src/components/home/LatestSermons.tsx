import Link from 'next/link';
import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import { Play, ArrowRight, Calendar, Youtube } from 'lucide-react';
import type { YouTubeVideo } from '@/lib/youtube';

interface LatestSermonsProps {
  videos: YouTubeVideo[];
}

export default async function LatestSermons({ videos }: LatestSermonsProps) {
  const t = await getTranslations('home.latest_sermons');
  const st = await getTranslations('sermons');
  const locale = await getLocale();
  const recent = videos.slice(0, 3);

  return (
    <section className="py-24 dark-section relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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

        {recent.length === 0 ? (
          <div className="text-center py-12 text-wine-400">
            <Youtube size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">{locale === 'zh-TW' ? '尚無影片，請稍後再來' : 'No videos yet'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recent.map((video) => (
              <Link
                key={video.id}
                href={`/${locale}/sermons`}
                className="group glass-card rounded-2xl overflow-hidden card-glow transition-all duration-300"
              >
                <div className="relative h-44 bg-wine-950 overflow-hidden">
                  {video.thumbnail && (
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl border-2 border-amber-400/60"
                      style={{ background: 'linear-gradient(135deg, #b8860b80, #d4a84380)' }}
                    >
                      <Play size={20} className="text-amber-300 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 text-xs bg-wine-700/90 text-wine-100 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    <Youtube size={10} />
                    {locale === 'zh-TW' ? '主日講道' : 'Sermon'}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-wine-400 mb-3">
                    <Calendar size={11} />
                    <span>{video.publishedAt}</span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug mb-4 line-clamp-2 group-hover:text-amber-200 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                    {st('listen')}
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
    </section>
  );
}
