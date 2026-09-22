'use client'

import Image from 'next/image'
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { urlFor } from '@/lib/sanity/client'
import type { DailyScripture } from '@/lib/sanity/queries'

interface Props {
  scriptures: DailyScripture[]
  locale: string
}

export default function DailyScriptureList({ scriptures, locale }: Props) {
  const [expanded, setExpanded] = useState<string | null>(scriptures[0]?._id ?? null)
  const zh = locale === 'zh-TW'

  return (
    <div className="space-y-6">
      {scriptures.map((s, idx) => {
        const isOpen = expanded === s._id
        const isToday = s.date === new Date().toISOString().slice(0, 10)
        const verse = zh ? s.verseZh : (s.verseEn || s.verseZh)
        const ref = zh ? s.referenceZh : (s.referenceEn || s.referenceZh)
        const reflection = zh ? s.reflectionZh : (s.reflectionEn || s.reflectionZh)
        const imageUrl = s.image?.asset
          ? urlFor(s.image).width(800).height(400).fit('crop').url()
          : null

        return (
          <div
            key={s._id}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'border-wine-300 shadow-lg'
                : 'border-gray-100 hover:border-wine-200'
            }`}
          >
            {/* Header row — always visible */}
            <button
              className="w-full flex items-center gap-4 p-5 text-left"
              onClick={() => setExpanded(isOpen ? null : s._id)}
            >
              {/* Date badge */}
              <div className={`church-gradient rounded-xl p-3 text-center min-w-[56px] text-white shrink-0`}>
                <p className="text-xs font-medium opacity-80">{s.date.slice(5, 7)}</p>
                <p className="text-xl font-bold leading-tight">{s.date.slice(8, 10)}</p>
                <p className="text-xs opacity-80">{s.date.slice(0, 4)}</p>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {isToday && (
                    <span className="text-xs bg-amber-400 text-white font-semibold px-2 py-0.5 rounded-full">
                      {zh ? '今日' : 'Today'}
                    </span>
                  )}
                  {idx === 0 && !isToday && (
                    <span className="text-xs bg-wine-100 text-wine-600 font-medium px-2 py-0.5 rounded-full">
                      {zh ? '最新' : 'Latest'}
                    </span>
                  )}
                </div>
                <p className="font-semibold text-wine-900 truncate">{ref}</p>
                <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{verse}</p>
              </div>

              <div className="text-gray-400 shrink-0">
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            {/* Expanded content */}
            {isOpen && (
              <div className="px-5 pb-6 border-t border-gray-100">
                {/* Image */}
                {imageUrl && (
                  <div className="relative w-full h-52 sm:h-72 rounded-xl overflow-hidden my-5">
                    <Image
                      src={imageUrl}
                      alt={s.image?.alt ?? ref}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}

                {/* Verse */}
                <div className={`${imageUrl ? '' : 'mt-5'} bg-wine-50 rounded-2xl p-5`}>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={16} className="text-wine-500" />
                    <span className="text-sm font-semibold text-wine-700">{ref}</span>
                  </div>
                  <blockquote className="text-wine-900 text-lg leading-relaxed font-medium italic">
                    「{verse}」
                  </blockquote>
                </div>

                {/* Reflection */}
                {reflection && (
                  <div className="mt-4 text-gray-600 text-sm leading-relaxed">
                    {reflection}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
