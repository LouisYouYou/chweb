import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import PrayerWall from '@/components/prayer/PrayerWall'
import { Heart } from 'lucide-react'

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
      <section className="church-gradient py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Heart size={28} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {zh ? '代禱牆' : my ? 'ဆုတောင်းချက် နံရံ' : ja ? '祈祷の壁' : 'Prayer Wall'}
          </h1>
          <p className="text-wine-200 text-lg">
            {zh
              ? '彼此代禱，讓神的愛在群體中流動'
              : my
              ? 'တစ်ဦးကိုတစ်ဦး ဆုတောင်းပေးကြပြီး ဘုရားသခင်၏ ချစ်ခြင်းမေတ္တာကို မိသားစုအတွင်း စီးဆင်းစေပါ'
              : ja
              ? '互いのために祈り合い、神の愛をコミュニティに流しましょう'
              : "Praying for one another, letting God's love flow through community"}
          </p>
          <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mt-6" />
          {prayers && prayers.length > 0 && (
            <p className="text-wine-300 text-sm mt-4">
              {zh ? `共 ${prayers.length} 則代禱` : my ? `ဆုတောင်းချက် ${prayers.length} ခု` : ja ? `${prayers.length} 件の祈祷リクエスト` : `${prayers.length} prayer requests`}
            </p>
          )}
        </div>
      </section>

      <PrayerWall
        initialPrayers={prayers ?? []}
        currentUserId={user?.id ?? null}
        locale={locale}
      />
    </div>
  )
}
