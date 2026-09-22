import { getTranslations, getLocale } from 'next-intl/server'
import { getAllScriptures } from '@/lib/sanity/queries'
import DailyScriptureList from '@/components/scripture/DailyScriptureList'

export const revalidate = 3600

export default async function DailyScripturePage() {
  const t = await getTranslations('scripture')
  const locale = await getLocale()
  const scriptures = await getAllScriptures()

  return (
    <div>
      {/* Hero */}
      <section className="church-gradient py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-wine-200 text-lg">{t('subtitle')}</p>
          <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mt-6" />
        </div>
      </section>

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
