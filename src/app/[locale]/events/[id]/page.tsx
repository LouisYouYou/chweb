import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Users, ArrowLeft, ClipboardList, CalendarDays, Tag } from 'lucide-react'
import { getEventById } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'
import PageHero from '@/components/layout/PageHero'

export const revalidate = 3600

const BASE_URL = 'https://nanshijiaoglory.vercel.app'

const categoryLabels: Record<string, { zh: string; en: string; my: string; ja: string }> = {
  worship:   { zh: '崇拜', en: 'Worship',   my: 'ဝတ်ပြုကိုးကွယ်ခြင်း', ja: '礼拝' },
  family:    { zh: '家庭', en: 'Family',    my: 'မိသားစု',               ja: 'ファミリー' },
  youth:     { zh: '青年', en: 'Youth',     my: 'လူငယ်',                 ja: '青年' },
  community: { zh: '社區', en: 'Community', my: 'လူ့အဖွဲ့',              ja: 'コミュニティ' },
  retreat:   { zh: '退修', en: 'Retreat',   my: 'နုတ်ပယ်ခြင်း',          ja: 'リトリート' },
  training:  { zh: '訓練', en: 'Training',  my: 'သင်တန်း',               ja: '訓練' },
}

const categoryBadge: Record<string, string> = {
  worship:   'bg-wine-100 text-wine-700 border-wine-200',
  family:    'bg-rose-100 text-rose-700 border-rose-200',
  youth:     'bg-purple-100 text-purple-700 border-purple-200',
  community: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  retreat:   'bg-amber-400 text-amber-950 border-amber-500 font-bold',
  training:  'bg-teal-100 text-teal-700 border-teal-200',
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const ev = await getEventById(id)
  if (!ev) return {}

  const zh = locale === 'zh-TW'
  const title = zh ? ev.titleZh : ev.titleEn
  const description = (zh ? ev.descriptionZh : ev.descriptionEn) ?? ''
  const ogImageUrl = ev.image
    ? urlFor(ev.image).width(1200).height(630).fit('crop').auto('format').url()
    : undefined
  const canonicalUrl = `${BASE_URL}/${locale}/events/${id}`

  return {
    title: `${title} | 行道會南勢角榮耀堂`,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630, alt: title }]
        : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const [ev, t] = await Promise.all([
    getEventById(id),
    getTranslations('events'),
  ])

  if (!ev) notFound()

  const zh = locale === 'zh-TW'
  const my = locale === 'my'
  const ja = locale === 'ja'
  const t4 = (zhStr: string, myStr: string, jaStr: string, enStr: string) =>
    zh ? zhStr : my ? myStr : ja ? jaStr : enStr

  const title = zh ? ev.titleZh : ev.titleEn
  const description = zh ? ev.descriptionZh : ev.descriptionEn
  const location = zh ? ev.locationZh : ev.locationEn
  const catLabel = categoryLabels[ev.category]
    ? (zh ? categoryLabels[ev.category].zh : my ? categoryLabels[ev.category].my : ja ? categoryLabels[ev.category].ja : categoryLabels[ev.category].en)
    : ev.category

  const [year, month, day] = ev.date.split('-')
  const m = parseInt(month)
  const d = parseInt(day)
  const dateLabel = zh
    ? `${year} 年 ${m} 月 ${d} 日`
    : my
    ? `${year} ခုနှစ် ${m} လ ${d} ရက်`
    : ja
    ? `${year}年${m}月${d}日`
    : `${MONTHS_EN[m - 1]} ${d}, ${year}`

  const imageUrl = ev.image
    ? urlFor(ev.image).width(1200).auto('format').url()
    : null
  const imageBlurData = ev.image?.asset?.metadata?.lqip

  const isAlmostFull = ev.seatsLeft != null && ev.seatsLeft < 5

  return (
    <div>
      <PageHero title={title} subtitle={`${catLabel} · ${dateLabel}`} />

      <section className="py-20 bg-[#fdfaf5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/events`}
            className="inline-flex items-center gap-2 text-sm text-wine-600 hover:text-wine-800 transition-colors mb-8 group"
          >
            <ArrowLeft size={14} aria-hidden="true" className="group-hover:-translate-x-0.5 transition-transform" />
            {t('back_to_events')}
          </Link>

          <div className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-wine-100/60 border border-gray-100">
            {/* Poster */}
            {imageUrl && (
              <div className="w-full bg-[#fdfaf5]">
                <Image
                  src={imageUrl}
                  alt={title}
                  width={1200}
                  height={1600}
                  className="w-full h-auto block"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                  placeholder={imageBlurData ? 'blur' : 'empty'}
                  blurDataURL={imageBlurData}
                />
              </div>
            )}

            <div className="px-8 py-10 lg:px-12 lg:py-12">
              {/* Category + fee badges */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${categoryBadge[ev.category]}`}>
                  <Tag aria-hidden="true" size={11} />
                  {catLabel}
                </span>
                {ev.fee === 0 ? (
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold">
                    {t('free')}
                  </span>
                ) : ev.fee != null && (
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 font-semibold">
                    NT${ev.fee.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap gap-5 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1.5">
                  <CalendarDays aria-hidden="true" size={14} className="text-amber-500" />
                  {dateLabel}
                </span>
                {ev.time && (
                  <span className="flex items-center gap-1.5">
                    <Clock aria-hidden="true" size={14} className="text-wine-400" />
                    {ev.time}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin aria-hidden="true" size={14} className="text-wine-400" />
                    {location}
                  </span>
                )}
                {ev.seats != null && (
                  <span className={`flex items-center gap-1.5 font-semibold ${isAlmostFull ? 'text-red-500' : 'text-emerald-600'}`}>
                    <Users aria-hidden="true" size={14} />
                    {isAlmostFull
                      ? t4('名額即將額滿', 'နေရာနီးပါး ပြည့်နေသည်', '残りわずか', 'Almost full')
                      : t4('尚有名額', 'နေရာရှိသေးသည်', '残席あり', 'Spots available')}
                    {ev.seatsLeft != null && ` (${ev.seatsLeft})`}
                  </span>
                )}
              </div>

              {/* Description */}
              {description && (
                <p className="type-body text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap">
                  {description}
                </p>
              )}

              {/* Course schedule */}
              {ev.courseItems && ev.courseItems.length > 0 && (
                <div className="bg-[#fdfaf5] rounded-2xl p-6 mb-8">
                  <p className="text-xs font-bold text-wine-700 tracking-wider uppercase mb-4 flex items-center gap-2">
                    <Clock aria-hidden="true" size={13} />
                    {t4('課程時間表', 'သင်တန်းဇယား', 'スケジュール', 'Course Schedule')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ev.courseItems.map((item) => (
                      <div
                        key={item.nameZh}
                        className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm"
                      >
                        <div className="w-8 h-8 church-gradient rounded-lg flex items-center justify-center shrink-0">
                          <Clock size={14} className="text-white" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-semibold text-wine-900 text-sm">
                            {zh ? item.nameZh : item.nameEn}
                          </p>
                          <p className="text-xs text-amber-600 font-medium">
                            {item.day} {item.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              {ev.registrationUrl && (
                <a
                  href={ev.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-[44px] px-7 py-3 church-gradient text-white text-sm font-bold rounded-full shadow-md hover:shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-500 focus-visible:ring-offset-2"
                >
                  <ClipboardList aria-hidden="true" size={15} />
                  {t4('立即報名', 'မှတ်ပုံတင်ရန်', '今すぐ登録', 'Register Now')}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
