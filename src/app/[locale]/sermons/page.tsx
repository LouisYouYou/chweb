import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server';
import SermonLibrary from '@/components/sermons/SermonLibrary';
import SundayMessagesList from '@/components/sermons/SundayMessagesList';
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
      {/* Page opening — editorial dark with amber bar, ink-950 */}
      <section
        className="relative bg-ink-950 overflow-hidden"
        style={{ minHeight: 'calc(13rem + 6.5rem)', marginTop: '-6.5rem', paddingTop: '6.5rem' }}
      >
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,#fff 1px,transparent 0)', backgroundSize:'32px 32px' }} />
        <div aria-hidden="true" className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(10,5,5,0.6), transparent)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div
            aria-hidden="true"
            className="w-14 h-0.5 mb-8"
            style={{ background: 'linear-gradient(90deg, #c9a84c, transparent)' }}
          />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5">{t('title')}</h1>
          <p className="text-ink-300 text-base max-w-xl leading-relaxed">{t('subtitle')}</p>
        </div>
      </section>

      <SundayMessagesList locale={locale} />

      <SermonLibrary locale={locale} videos={videos} />
    </div>
  );
}
