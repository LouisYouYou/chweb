import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Mic2, CalendarDays, Play, ArrowLeft } from 'lucide-react'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { getSundayMessageById } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'
import PageHero from '@/components/layout/PageHero'
import SundayMessageInteractions from '@/components/home/SundayMessageInteractions'

export const revalidate = 3600

const BASE_URL = 'https://nanshijiaoglory.vercel.app'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const msg = await getSundayMessageById(id)
  if (!msg) return {}

  const ogImageUrl = msg.image
    ? urlFor(msg.image).width(1200).height(630).fit('crop').auto('format').url()
    : undefined

  const description = [msg.preacher, msg.scripture, msg.date].filter(Boolean).join(' · ')
  const canonicalUrl = `${BASE_URL}/${locale}/sermons/${id}`

  return {
    title: `${msg.title} | 行道會南勢角榮耀堂`,
    description,
    openGraph: {
      title: msg.title,
      description,
      url: canonicalUrl,
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630, alt: msg.title }]
        : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: msg.title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  }
}

const summaryComponents: PortableTextComponents = {
  block: {
    normal:       ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    textXxl:      ({ children }) => <p className="text-2xl leading-relaxed mb-2 last:mb-0">{children}</p>,
    textXl:       ({ children }) => <p className="text-xl leading-relaxed mb-2 last:mb-0">{children}</p>,
    textLg:       ({ children }) => <p className="text-lg leading-relaxed mb-2 last:mb-0">{children}</p>,
    textSm:       ({ children }) => <p className="text-sm leading-relaxed mb-2 last:mb-0 text-gray-500">{children}</p>,
    h2:           ({ children }) => <h2 className="text-2xl font-extrabold text-wine-900 mb-3 mt-4 first:mt-0">{children}</h2>,
    h3:           ({ children }) => <h3 className="text-xl font-bold text-wine-900 mb-2 mt-3 first:mt-0">{children}</h3>,
    h4:           ({ children }) => <h4 className="text-base font-semibold text-wine-800 mb-1 mt-2 first:mt-0">{children}</h4>,
    blockquote:   ({ children }) => (
      <blockquote className="border-l-4 border-amber-400 pl-4 italic text-gray-500 my-2">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5 text-gray-700">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5 text-gray-700">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong:           ({ children }) => <strong className="font-bold text-wine-900">{children}</strong>,
    em:               ({ children }) => <em className="italic">{children}</em>,
    underline:        ({ children }) => <span className="underline">{children}</span>,
    'strike-through': ({ children }) => <s className="line-through text-gray-400">{children}</s>,
    code:             ({ children }) => <code className="bg-gray-100 text-wine-800 text-xs px-1.5 py-0.5 rounded font-mono">{children}</code>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : '_self'}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        className="text-wine-600 underline underline-offset-2 hover:text-wine-800 transition-colors"
      >
        {children}
      </a>
    ),
  },
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default async function SermonDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const [msg, t, ts] = await Promise.all([
    getSundayMessageById(id),
    getTranslations('sermons'),
    getTranslations('sundayMessage'),
  ])

  if (!msg) notFound()

  const zh = locale === 'zh-TW'
  const my = locale === 'my'
  const ja = locale === 'ja'

  const [year, month, day] = msg.date.split('-')
  const m = parseInt(month)
  const d = parseInt(day)
  const dateLabel = zh
    ? `${year} 年 ${m} 月 ${d} 日`
    : my
    ? `${year} ခုနှစ် ${m} လ ${d} ရက်`
    : ja
    ? `${year}年${m}月${d}日`
    : `${MONTHS_EN[m - 1]} ${d}, ${year}`

  const imgW = msg.image?.asset?.metadata?.dimensions?.width ?? 1200
  const imgH = msg.image?.asset?.metadata?.dimensions?.height ?? 675
  const imageUrl = msg.image ? urlFor(msg.image).width(1200).auto('format').url() : null
  const imageLqip = msg.image?.asset?.metadata?.lqip

  const canonicalUrl = `${BASE_URL}/${locale}/sermons/${id}`

  return (
    <div>
      <PageHero title={msg.title} subtitle={`${msg.preacher} · ${dateLabel}`} />

      <section className="py-20 bg-[#fdfaf5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/sermons`}
            className="inline-flex items-center gap-2 text-sm text-wine-600 hover:text-wine-800 transition-colors mb-8 group"
          >
            <ArrowLeft size={14} aria-hidden="true" className="group-hover:-translate-x-0.5 transition-transform" />
            {t('back_to_sermons')}
          </Link>

          <div className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-wine-100/60 border border-gray-100">
            {imageUrl && (
              <div className="w-full bg-[#fdfaf5]">
                <Image
                  src={imageUrl}
                  alt={msg.title}
                  width={imgW}
                  height={imgH}
                  className="w-full h-auto block"
                  sizes="(max-width: 896px) 100vw, 896px"
                  priority
                  placeholder={imageLqip ? 'blur' : 'empty'}
                  blurDataURL={imageLqip}
                />
              </div>
            )}

            <div className="px-8 py-10 lg:px-12 lg:py-12">
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1.5">
                  <CalendarDays aria-hidden="true" size={14} className="text-amber-500" />
                  {dateLabel}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mic2 aria-hidden="true" size={14} className="text-wine-400" />
                  {msg.preacher}
                </span>
                {msg.scripture && (
                  <span className="flex items-center gap-1.5">
                    <BookOpen aria-hidden="true" size={14} className="text-wine-400" />
                    {msg.scripture}
                  </span>
                )}
              </div>

              {msg.summary && (
                <div className="type-body mb-8">
                  {Array.isArray(msg.summary) ? (
                    <PortableText
                      value={msg.summary as PortableTextBlock[]}
                      components={summaryComponents}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.summary}</p>
                  )}
                </div>
              )}

              {msg.youtubeUrl && (
                <div className="mb-6">
                  <a
                    href={msg.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 min-h-[44px] px-7 py-3 church-gradient text-white text-sm font-bold rounded-full shadow-md hover:shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-500 focus-visible:ring-offset-2"
                  >
                    <Play aria-hidden="true" size={15} fill="currentColor" />
                    {ts('watch_cta')}
                  </a>
                </div>
              )}

              <SundayMessageInteractions
                sanityId={msg._id}
                title={msg.title}
                shareUrl={canonicalUrl}
                socialUrl={canonicalUrl}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
