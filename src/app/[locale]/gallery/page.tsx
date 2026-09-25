import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { getAllGalleryPhotos } from '@/lib/sanity/queries'
import { getFacebookPagePhotos } from '@/lib/facebook'
import { urlFor } from '@/lib/sanity/client'

export const metadata: Metadata = {
  title: '教會相片集',
  description: '行道會南勢角榮耀堂活動相片集，記錄主日崇拜、特別聚會與社區活動的美好時刻。',
}

export const revalidate = 3600

interface DisplayPhoto {
  id: string
  src: string
  caption?: string
  date: string
}

export default async function GalleryPage() {
  const t = await getTranslations('gallery')
  const locale = await getLocale()
  const zh = locale === 'zh-TW'

  // Fetch from both sources in parallel
  const [sanityPhotos, fbPhotos] = await Promise.all([
    getAllGalleryPhotos(),
    getFacebookPagePhotos(60),
  ])

  // Merge: Sanity first, then Facebook, deduplicate by id
  const photos: DisplayPhoto[] = [
    ...sanityPhotos.map((p) => ({
      id: p._id,
      src: urlFor(p.image).width(800).auto('format').url(),
      caption: p.caption,
      date: p.date,
    })),
    ...fbPhotos.map((p) => ({
      id: `fb_${p.id}`,
      src: p.url,
      caption: p.name,
      date: p.createdTime,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div>
      {/* Hero */}
      <section className="church-gradient py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-wine-200 text-lg">{t('subtitle')}</p>
          <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mt-6" />
          {photos.length > 0 && (
            <p className="text-wine-300 text-sm mt-4">
              {zh ? `共 ${photos.length} 張照片` : `${photos.length} photos`}
            </p>
          )}
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {photos.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <Camera size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">{t('empty')}</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {photos.map((photo) => {
                const formatted = photo.date
                  ? new Date(photo.date + 'T00:00:00').toLocaleDateString(
                      zh ? 'zh-TW' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )
                  : ''
                return (
                  <div
                    key={photo.id}
                    className="break-inside-avoid group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 bg-gray-100"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.caption || formatted}
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover"
                      unoptimized
                    />
                    {(photo.caption || formatted) && (
                      <div className="absolute inset-0 bg-gradient-to-t from-wine-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div>
                          {photo.caption && (
                            <p className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">
                              {photo.caption}
                            </p>
                          )}
                          {formatted && (
                            <p className="text-wine-300 text-xs">{formatted}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
