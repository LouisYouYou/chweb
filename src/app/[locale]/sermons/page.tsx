import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server';
import SermonLibrary from '@/components/sermons/SermonLibrary';
import { getChannelVideos } from '@/lib/youtube';

export const metadata: Metadata = {
  title: '講道媒體庫',
  description: '行道會南勢角榮耀堂講道媒體庫。收聽主日講道、聖經研讀、青年講道影片，在家也能靈命成長。',
}

export default async function SermonsPage() {
  const t = await getTranslations('sermons');
  const locale = await getLocale();
  const videos = await getChannelVideos(24);

  return (
    <div>
      <section className="church-gradient py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-wine-200 text-lg">{t('subtitle')}</p>
          <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mt-6" />
        </div>
      </section>

      <SermonLibrary locale={locale} videos={videos} />
    </div>
  );
}
