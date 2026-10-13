import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import PrayerWall from '@/components/prayer/PrayerWall'
import { Heart } from 'lucide-react'
import PageHero from '@/components/layout/PageHero'

import { buildMetadata, pageSEO } from '@/lib/seo/metadata'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata(locale, pageSEO.prayerWall)
}

export const revalidate = 0

export default async function PrayerWallPage() {
  const locale = await getLocale()
  const zh = locale === 'zh-TW'
  const my = locale === 'my'
  const ja = locale === 'ja'
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: prayers } = await supabase
    .from('prayer_requests')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div>
      <PageHero
        title={zh ? '代禱牆' : my ? 'ဆုတောင်းချက် နံရံ' : ja ? '祈祷の壁' : 'Prayer Wall'}
        subtitle={zh
          ? '彼此代禱，讓神的愛在群體中流動'
          : my
          ? 'တစ်ဦးကိုတစ်ဦး ဆုတောင်းပေးကြပြီး ဘုရားသခင်၏ ချစ်ခြင်းမေတ္တာကို မိသားစုအတွင်း စီးဆင်းစေပါ'
          : ja
          ? '互いのために祈り合い、神の愛をコミュニティに流しましょう'
          : "Praying for one another, letting God's love flow through community"}
      />

      <PrayerWall
        initialPrayers={prayers ?? []}
        currentUserId={user?.id ?? null}
        locale={locale}
      />
    </div>
  )
}
