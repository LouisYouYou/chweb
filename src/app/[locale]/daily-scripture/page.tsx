import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'

import { buildMetadata, pageSEO } from '@/lib/seo/metadata'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata(locale, pageSEO.dailyScripture)
}
import { getAllScriptures } from '@/lib/sanity/queries'
import { createAdminClient } from '@/lib/supabase/admin'
import DailyScriptureList from '@/components/scripture/DailyScriptureList'
import PageHero from '@/components/layout/PageHero'
import PushSubscribeButton from '@/components/push/PushSubscribeButton'

export const revalidate = 3600

export interface AiDevotional {
  date: string
  devotional_text: string | null
  prayer_prompt: string | null
}

async function getAiDevotionals(): Promise<Record<string, AiDevotional>> {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('ai_devotional_content')
      .select('date, devotional_text, prayer_prompt')
      .order('date', { ascending: false })
      .limit(30)
    return Object.fromEntries((data ?? []).map((r) => [r.date, r]))
  } catch {
    return {}
  }
}

export default async function DailyScripturePage() {
  const t = await getTranslations('scripture')
  const locale = await getLocale()
  const [scriptures, aiMap] = await Promise.all([getAllScriptures(), getAiDevotionals()])

  return (
    <div>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      {/* 訂閱靈修提醒 */}
      <div className="flex justify-center py-6 px-4">
        <PushSubscribeButton />
      </div>

      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {scriptures.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="text-lg">{t('empty')}</p>
            </div>
          ) : (
            <DailyScriptureList scriptures={scriptures} locale={locale} aiMap={aiMap} />
          )}
        </div>
      </section>
    </div>
  )
}
