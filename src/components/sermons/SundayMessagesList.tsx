import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Mic2, CalendarDays } from 'lucide-react'
import { getAllSundayMessages } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'
import FadeIn from '@/components/ui/FadeIn'

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface Props {
  locale: string
}

export default async function SundayMessagesList({ locale }: Props) {
  const messages = await getAllSundayMessages()
  if (!messages.length) return null

  const zh = locale === 'zh-TW'
  const my = locale === 'my'
  const ja = locale === 'ja'

  const dateLabel = (date: string) => {
    const [year, month, day] = date.split('-')
    const m = parseInt(month)
    const d = parseInt(day)
    return zh
      ? `${year} 年 ${m} 月 ${d} 日`
      : my
      ? `${year} ခုနှစ် ${m} လ ${d} ရက်`
      : ja
      ? `${year}年${m}月${d}日`
      : `${MONTHS_EN[m - 1]} ${d}, ${year}`
  }

  const heading = zh ? '主日信息記錄' : my ? 'တနင်္ဂနွေ ဟောတရား မှတ်တမ်း' : ja ? '主日メッセージアーカイブ' : 'Sunday Message Archive'
  const subtitle = zh ? '每週主日信息完整記錄，點擊查看詳情' : my ? 'တနင်္ဂနွေ တရားဟောချက်များ၏ မှတ်တမ်း' : ja ? '毎週の主日メッセージを振り返る' : 'A complete record of weekly Sunday messages'

  return (
    <section className="py-16 px-4 bg-[#fdfaf5]">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="mb-10">
            <p className="type-eyebrow-light mb-3">SUNDAY MESSAGE</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-wine-900 mb-2">{heading}</h2>
            <p className="text-gray-500 text-sm">{subtitle}</p>
            <div className="divider-gold mt-4" />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {messages.map((msg, i) => {
            const imageUrl = msg.image
              ? urlFor(msg.image).width(600).height(338).fit('crop').auto('format').url()
              : null
            const lqip = msg.image?.asset?.metadata?.lqip

            return (
              <FadeIn key={msg._id} delay={i < 6 ? i * 40 : 0}>
                <Link
                  href={`/${locale}/sermons/${msg._id}`}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-wine-200 transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-video bg-wine-50 overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={msg.title}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        placeholder={lqip ? 'blur' : 'empty'}
                        blurDataURL={lqip}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen size={32} className="text-wine-200" aria-hidden="true" />
                      </div>
                    )}
                    {/* Date overlay */}
                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
                      <span className="flex items-center gap-1 text-white/90 text-xs font-medium">
                        <CalendarDays size={11} aria-hidden="true" />
                        {dateLabel(msg.date)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-2 p-4 flex-1">
                    <h3 className="font-bold text-wine-900 text-sm leading-snug group-hover:text-wine-700 transition-colors line-clamp-2">
                      {msg.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-auto pt-2 border-t border-gray-50">
                      <span className="flex items-center gap-1">
                        <Mic2 size={11} className="text-wine-300" aria-hidden="true" />
                        {msg.preacher}
                      </span>
                      {msg.scripture && (
                        <span className="flex items-center gap-1">
                          <BookOpen size={11} className="text-wine-300" aria-hidden="true" />
                          {msg.scripture}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
