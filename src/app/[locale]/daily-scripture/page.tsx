import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'

import { buildMetadata, pageSEO } from '@/lib/seo/metadata'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata(locale, pageSEO.dailyScripture)
}
import { getAllScriptures } from '@/lib/sanity/queries'
import DailyScriptureList from '@/components/scripture/DailyScriptureList'
import PageHero from '@/components/layout/PageHero'

export const revalidate = 3600

export default async function DailyScripturePage() {
  const t = await getTranslations('scripture')
  const locale = await getLocale()
  const scriptures = await getAllScriptures()

  return (
    <div>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {scriptures.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="text-lg">{t('empty')}</p>
            </div>
          ) : (
            <DailyScriptureList scriptures={scriptures} locale={locale} />
          )}
        </div>
      </section>
    </div>
  )
}
