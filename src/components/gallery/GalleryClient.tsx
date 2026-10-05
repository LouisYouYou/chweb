'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Calendar, ZoomIn } from 'lucide-react'

interface Photo {
  _id: string
  date: string
  caption?: string
  src: string
  srcFull: string
}

interface GalleryClientProps {
  photos: Photo[]
  locale: string
}

// Group photos by year-month
function groupByMonth(photos: Photo[], zh: boolean) {
  const map = new Map<string, { label: string; photos: Photo[] }>()
  for (const p of photos) {
    const d = new Date(p.date + 'T00:00:00')
    const key = p.date.slice(0, 7) // YYYY-MM
    const label = d.toLocaleDateString(zh ? 'zh-TW' : 'en-US', { year: 'numeric', month: 'long' })
    if (!map.has(key)) map.set(key, { label, photos: [] })
    map.get(key)!.photos.push(p)
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
}

export default function GalleryClient({ photos, locale }: GalleryClientProps) {
  const zh = locale === 'zh-TW'
  const [lightbox, setLightbox] = useState<number | null>(null) // global index
  const [imgLoaded, setImgLoaded] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const groups = groupByMonth(photos, zh)
  const total = photos.length

  const openAt = useCallback((idx: number) => {
    setImgLoaded(false)
    setLightbox(idx)
  }, [])

  const close = useCallback(() => setLightbox(null), [])

  const prev = useCallback(() => {
    setImgLoaded(false)
    setLightbox(i => (i === null ? null : (i - 1 + total) % total))
  }, [total])

  const next = useCallback(() => {
    setImgLoaded(false)
    setLightbox(i => (i === null ? null : (i + 1) % total))
  }, [total])

  // Keyboard navigation
  useEffect(() => {
    if (lightbox === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, close, prev, next])

  // Lock body scroll when lightbox open — iOS Safari requires position:fixed
  useEffect(() => {
    if (lightbox !== null) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflowY = 'scroll'
    } else {
      const scrollY = Math.abs(parseInt(document.body.style.top || '0', 10))
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflowY = ''
      if (scrollY) window.scrollTo(0, scrollY)
    }
    return () => {
      const scrollY = Math.abs(parseInt(document.body.style.top || '0', 10))
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflowY = ''
      if (scrollY) window.scrollTo(0, scrollY)
    }
  }, [lightbox])

  const current = lightbox !== null ? photos[lightbox] : null

  return (
    <>
      {/* ── Grouped masonry ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {groups.map(([key, { label, photos: gPhotos }]) => {
          const startIdx = photos.findIndex(p => p._id === gPhotos[0]._id)
          return (
            <div key={key}>
              {/* Month header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 text-wine-700">
                  <Calendar size={16} className="text-wine-400" />
                  <h2 className="text-lg font-bold tracking-wide">{label}</h2>
                </div>
                <div className="flex-1 h-px bg-wine-100" />
                <span className="text-xs text-gray-400 shrink-0">
                  {zh ? `${gPhotos.length} 張` : `${gPhotos.length} photos`}
                </span>
              </div>

              {/* Masonry grid */}
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
                {gPhotos.map((photo, localIdx) => {
                  const globalIdx = startIdx + localIdx
                  const formattedDate = new Date(photo.date + 'T00:00:00').toLocaleDateString(
                    zh ? 'zh-TW' : 'en-US', { month: 'short', day: 'numeric' }
                  )
                  return (
                    <div
                      key={photo._id}
                      className="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                      onClick={() => openAt(globalIdx)}
                    >
                      {/* Skeleton placeholder */}
                      <div className="w-full bg-gray-200 animate-pulse" style={{ paddingBottom: '75%', position: 'relative' }}>
                        <Image
                          src={photo.src}
                          alt={photo.caption || formattedDate}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          unoptimized
                        />
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                        <div className="flex justify-end">
                          <div className="w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <ZoomIn size={13} className="text-white" />
                          </div>
                        </div>
                        <div>
                          {photo.caption && (
                            <p className="text-white font-semibold text-xs sm:text-sm leading-tight mb-1 line-clamp-2">
                              {photo.caption}
                            </p>
                          )}
                          <p className="text-white/70 text-xs">{formattedDate}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────── */}
      {current && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onClick={close}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-4 sm:px-6 py-3 shrink-0"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-white/60 text-sm">
              {lightbox! + 1} / {total}
            </div>
            <div className="flex-1 text-center px-4">
              {current.caption && (
                <p className="text-white text-sm sm:text-base font-medium line-clamp-1">{current.caption}</p>
              )}
            </div>
            <button
              onClick={close}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Main image area */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden"
            onClick={e => e.stopPropagation()}
            onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
            onTouchEnd={e => {
              if (touchStartX.current === null) return
              const dx = e.changedTouches[0].clientX - touchStartX.current
              if (dx > 50) prev()
              else if (dx < -50) next()
              touchStartX.current = null
            }}
          >
            {/* Prev button */}
            <button
              onClick={prev}
              className="absolute left-2 sm:left-4 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 active:bg-white/30 transition-colors text-white backdrop-blur-sm"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center px-14 sm:px-20 py-2">
              {!imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                </div>
              )}
              <Image
                key={current._id}
                src={current.srcFull}
                alt={current.caption || current.date}
                fill
                className={`object-contain transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImgLoaded(true)}
                unoptimized
                priority
              />
            </div>

            {/* Next button */}
            <button
              onClick={next}
              className="absolute right-2 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 active:bg-white/30 transition-colors text-white backdrop-blur-sm"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Bottom info bar */}
          <div
            className="shrink-0 px-4 sm:px-6 py-3 text-center"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-white/50 text-xs">
              {new Date(current.date + 'T00:00:00').toLocaleDateString(
                zh ? 'zh-TW' : 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              )}
            </p>
            {/* Dot indicators (show up to 20) */}
            {total <= 20 && (
              <div className="flex justify-center gap-1 mt-2">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => openAt(i)}
                    className={`rounded-full transition-all ${
                      i === lightbox
                        ? 'w-4 h-1.5 bg-white'
                        : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
