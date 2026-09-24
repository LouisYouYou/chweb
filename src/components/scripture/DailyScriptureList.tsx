'use client'

import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import type { DailyScripture } from '@/lib/sanity/queries'

interface Props {
  scriptures: DailyScripture[]
  locale: string
}

export default function DailyScriptureList({ scriptures }: Props) {
  return (
    <div className="space-y-10">
      {scriptures.map((s) => {
        const imageUrl = s.image?.asset
          ? urlFor(s.image).width(1200).url()
          : null
        const isToday = s.date === new Date().toISOString().slice(0, 10)

        return (
          <div key={s._id} className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Date header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-wine-50 border-b border-wine-100">
              <div className="church-gradient rounded-xl p-3 text-center min-w-[56px] text-white shrink-0">
                <p className="text-xs font-medium opacity-80">{s.date.slice(5, 7)}</p>
                <p className="text-xl font-bold leading-tight">{s.date.slice(8, 10)}</p>
                <p className="text-xs opacity-80">{s.date.slice(0, 4)}</p>
              </div>
              {isToday && (
                <span className="text-sm bg-amber-400 text-white font-semibold px-3 py-1 rounded-full">
                  今日經文
                </span>
              )}
            </div>

            {/* Image */}
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`每日經文 ${s.date}`}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto"
                unoptimized
              />
            ) : (
              <div className="p-8 text-center text-gray-300">（尚未上傳配圖）</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
