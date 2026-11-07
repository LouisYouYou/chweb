import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { Play, ArrowRight, Calendar, PlayCircle } from 'lucide-react';
import type { YouTubeVideo } from '@/lib/youtube';
import FadeIn from '@/components/ui/FadeIn';
import { SermonThumbnail } from '@/components/home/SermonThumbnail';

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
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />
      {/* Wave: ServiceTimesSection (warm white) dips into dark top */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block h-14">
          <path d="M0,0 L1440,0 C1080,56 360,56 0,0 Z" fill="#F7F5F0"/>
        </svg>
      </div>
      {/* Wave: warm white rises from dark bottom into UpcomingEvents */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block h-14">
          <path d="M0,56 L1440,56 C1080,0 360,0 0,56 Z" fill="#F7F5F0"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
          <div>
            <p className="type-eyebrow-dark mb-3">
              {locale === 'my' ? 'တရားဟောချက်မှတ်တမ်း' : 'SERMONS'}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{t('title')}</h2>
            <p className="text-white/50 text-sm">{t('subtitle')}</p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-gold-warm-500/60 to-transparent mt-4 rounded-full" aria-hidden="true" />
          </div>
          <Link
            href={`/${locale}/sermons`}
            className="inline-flex items-center gap-2 text-gold-warm-400 hover:text-gold-warm-300 transition-colors text-sm font-semibold group border border-gold-warm-400/30 hover:border-gold-warm-400/60 px-4 py-2 min-h-[44px] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-warm-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-ink-900"
          >
            {t('view_all')}
            <ArrowRight aria-hidden="true" size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        </FadeIn>

        {recent.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            <PlayCircle aria-hidden="true" size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">{locale === 'zh-TW' ? '尚無影片，請稍後再來' : locale === 'my' ? 'ဗီဒီယို မရှိသေးပါ' : locale === 'ja' ? 'まだ動画がありません' : 'No videos yet'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recent.map((video, i) => (
              <FadeIn key={video.id} delay={i * 120} className="flex flex-col">
              <Link
                href={`/${locale}/sermons`}
                className="group glass-card rounded-2xl overflow-hidden haptic-sermon-card flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-warm-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-ink-900"
              >
                <div className="relative h-44 bg-ink-900 overflow-hidden">
                  <SermonThumbnail src={video.thumbnail} alt={video.title} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      aria-hidden="true"
                      className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl border-2 border-gold-warm-400/60"
                      style={{ background: 'rgba(173,140,96,0.35)' }}
                    >
                      <Play aria-hidden="true" size={20} className="text-gold-warm-300 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 text-xs bg-wine-800/90 text-white px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    <PlayCircle aria-hidden="true" size={10} />
                    {locale === 'zh-TW' ? '主日講道' : locale === 'my' ? 'တနင်္ဂနွေ တရားဟောချက်' : locale === 'ja' ? '主日説教' : 'Sermon'}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
                    <Calendar aria-hidden="true" size={11} />
                    <span>{video.publishedAt}</span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug mb-4 line-clamp-2 group-hover:text-gold-warm-300 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gold-warm-400 group-hover:text-gold-warm-300">
                    {st('listen')}
                    <ArrowRight aria-hidden="true" size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </div>

      <div aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-gold-warm-500/40 to-transparent" />
    </section>
  );
}
