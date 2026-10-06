import Image from 'next/image'
import { BookOpen, Mic2, CalendarDays, Play } from 'lucide-react'
import { getLocale } from 'next-intl/server'
import { getLatestSundayMessage } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'
import FadeIn from '@/components/ui/FadeIn'

const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default async function SundayMessageSection() {
  const [msg, locale] = await Promise.all([
    getLatestSundayMessage(),
    getLocale(),
  ])
  if (!msg) return null

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

  const copy = {
    eyebrow:  my ? 'တနင်္ဂနွေ တရားဟောချက်' : ja ? '主日メッセージ' : 'SUNDAY MESSAGE',
    heading:  zh ? '本週主日信息' : my ? 'ဤပတ် တနင်္ဂနွေ တရားဟောချက်' : ja ? '今週の主日メッセージ' : "This Week's Message",
    noImage:  zh ? '尚未上傳信息主圖' : my ? 'ဓာတ်ပုံ မတင်ရသေးပါ' : ja ? 'メイン画像未アップロード' : 'No image uploaded yet',
    watchCta: zh ? '觀看完整講道' : my ? 'တရားဟောချက် ကြည့်ရန်' : ja ? '説教全体を見る' : 'Watch Full Sermon',
  }

  const imgW = msg.image?.asset?.metadata?.dimensions?.width ?? 1200
  const imgH = msg.image?.asset?.metadata?.dimensions?.height ?? 675
  const imageUrl = msg.image
    ? urlFor(msg.image).width(1200).auto('format').url()
    : null

  return (
    <section className="py-20 bg-[#fdfaf5] relative overflow-hidden">
      <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-wine-50 opacity-60 pointer-events-none" />
      <div className="absolute -right-16 bottom-0 w-56 h-56 rounded-full bg-amber-50 opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <FadeIn>
          <div className="mb-10">
            <p className="text-amber-600 text-xs font-bold tracking-[0.3em] uppercase mb-3 border-l-2 border-amber-500 pl-3">
              {copy.eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-wine-900 mb-1">{copy.heading}</h2>
            <div className="divider-gold" style={{ margin: '14px 0 0' }} />
          </div>
        </FadeIn>

        <FadeIn delay={80}>
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-wine-100/60 border border-gray-100 flex flex-col lg:flex-row">

            {/* Image side — natural aspect ratio, no crop */}
            <div className="lg:w-[52%] bg-wine-950 shrink-0 flex items-center justify-center">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={msg.title}
                  width={imgW}
                  height={imgH}
                  className="w-full h-auto block"
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  priority
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-16 opacity-20">
                  <BookOpen size={48} className="text-white" />
                  <span className="text-white text-sm font-medium">{copy.noImage}</span>
                </div>
              )}
            </div>

            {/* Info side */}
            <div className="flex flex-col justify-center px-8 py-10 lg:py-12 lg:px-12 gap-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-600">
                <CalendarDays size={14} />
                {dateLabel}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-wine-900 leading-tight">
                {msg.title}
              </h3>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Mic2 size={14} className="text-wine-400" />
                  {msg.preacher}
                </span>
                {msg.scripture && (
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} className="text-wine-400" />
                    {msg.scripture}
                  </span>
                )}
              </div>

              {msg.summary && (
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                  {msg.summary}
                </p>
              )}

              {msg.youtubeUrl && (
                <div className="pt-2">
                  <a
                    href={msg.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-3 church-gradient text-white text-sm font-bold rounded-full shadow-md hover:shadow-lg hover:opacity-90 active:scale-95 transition-all duration-200"
                  >
                    <Play size={15} fill="currentColor" />
                    {copy.watchCta}
                  </a>
                </div>
              )}
            </div>

          </div>
        </FadeIn>
      </div>
    </section>
  )
}
