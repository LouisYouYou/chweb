import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server';
import SermonLibrary from '@/components/sermons/SermonLibrary';
import SundayMessagesList from '@/components/sermons/SundayMessagesList';
import PageHero from '@/components/layout/PageHero';
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
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <SundayMessagesList locale={locale} />

      <SermonLibrary locale={locale} videos={videos} />
    </div>
  );
}
