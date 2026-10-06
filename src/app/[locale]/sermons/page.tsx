import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server';
import SermonLibrary from '@/components/sermons/SermonLibrary';
import SermonsJsonLd from '@/components/seo/SermonsJsonLd';
import { getChannelVideos } from '@/lib/youtube';

import { buildMetadata, pageSEO } from '@/lib/seo/metadata'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata(locale, pageSEO.sermons)
}

export default async function SermonsPage() {
  const t = await getTranslations('sermons');
  const locale = await getLocale();
  const videos = await getChannelVideos(24);

  return (
    <div>
      <SermonsJsonLd videos={videos} />
      <section className="church-gradient py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-wine-200 text-lg">{t('subtitle')}</p>
          <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mt-6" />
        </div>
      </section>

      <SermonLibrary locale={locale} videos={videos} />
    </div>
  );
}
