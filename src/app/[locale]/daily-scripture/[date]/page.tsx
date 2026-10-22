import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getScriptureByDate } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'
import ScriptureInteractions from '@/components/scripture/ScriptureInteractions'

const BASE_URL = 'https://nanshijiaoglory.vercel.app'

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatTitle(date: string, locale: string): string {
  const [year, month, day] = date.split('-')
  const m = parseInt(month)
  const d = parseInt(day)
  if (locale === 'zh-TW') return `每日經文 ${year}年${m}月${d}日`
  if (locale === 'ja')    return `日々の聖書 ${year}年${m}月${d}日`
  if (locale === 'my')    return `နေ့စဉ် သမ္မာကျမ်း ${year}/${m}/${d}`
  return `Daily Scripture ${MONTHS_EN[m - 1]} ${d}, ${year}`
}

type Props = { params: Promise<{ locale: string; date: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, date } = await params
  const scripture = await getScriptureByDate(date)
  if (!scripture) return {}

  const title = formatTitle(date, locale)
  const description =
    locale === 'zh-TW' ? '每日一節，紮根神的話語｜行道會南勢角榮耀堂' :
    locale === 'ja'    ? '毎日一節、神の言葉に根ざして｜行道会南勢角栄光教会' :
    locale === 'my'    ? 'နေ့စဉ် ဘုရားသခင်၏ နှုတ်ကပတ်တော်' :
                        'Daily scripture · Glory Church Of Nanshijiao'

  const ogImage = scripture.image?.asset
    ? urlFor(scripture.image).width(1200).height(630).fit('crop').auto('format').url()
    : `${BASE_URL}/church.jpg`

  const pageUrl = `${BASE_URL}/${locale}/daily-scripture/${date}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export const revalidate = 3600

export default async function ScriptureDatePage({ params }: Props) {
  const { locale, date } = await params
  const [scripture, t] = await Promise.all([
    getScriptureByDate(date),
    getTranslations('scripture'),
  ])

  if (!scripture) notFound()

  const imageUrl = scripture.image?.asset
    ? urlFor(scripture.image).width(1200).url()
    : null

  const shareTitle = formatTitle(date, locale)
  const pageUrl    = `${BASE_URL}/${locale}/daily-scripture/${date}`

  return (
    <div className="min-h-screen bg-[#fdfaf5]">
      {/* Back link */}
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-4">
        <Link
          href={`/${locale}/daily-scripture`}
          className="inline-flex items-center gap-1.5 text-sm text-wine-700 hover:text-wine-500 transition-colors"
        >
          <ChevronLeft size={15} aria-hidden="true" />
          {t('title')}
        </Link>
      </div>

      {/* Scripture card */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white">
          {/* Date header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-wine-50 border-b border-wine-100">
            <div className="church-gradient rounded-xl p-3 text-center min-w-[56px] text-white shrink-0">
              <p className="text-xs font-medium opacity-80">{date.slice(5, 7)}</p>
              <p className="text-xl font-bold leading-tight">{date.slice(8, 10)}</p>
              <p className="text-xs opacity-80">{date.slice(0, 4)}</p>
            </div>
            <h1 className="font-bold text-wine-900 text-lg">{shareTitle}</h1>
          </div>

          {/* Image */}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={shareTitle}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto"
              unoptimized
              priority
            />
          ) : (
            <div className="p-8 text-center text-gray-300">（尚未上傳配圖）</div>
          )}

          {/* Interactions */}
          <ScriptureInteractions
            sanityId={scripture._id}
            shareTitle={shareTitle}
            shareUrl={pageUrl}
            socialUrl={pageUrl}
          />
        </div>
      </div>
    </div>
  )
}
