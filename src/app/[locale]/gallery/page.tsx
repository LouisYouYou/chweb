import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import { Camera } from 'lucide-react'
import { getAllGalleryPhotos } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'
import GalleryClient from '@/components/gallery/GalleryClient'

export const metadata: Metadata = {
  title: '教會相片集',
  description: '行道會南勢角榮耀堂活動相片集，記錄主日崇拜、特別聚會與社區活動的美好時刻。',
}

export const revalidate = 3600

export default async function GalleryPage() {
  const t = await getTranslations('gallery')
  const locale = await getLocale()
  const zh = locale === 'zh-TW'
  const raw = await getAllGalleryPhotos()

  const photos = raw.map(p => ({
    _id: p._id,
    date: p.date,
    caption: p.caption,
    src: urlFor(p.image).width(600).height(450).auto('format').url(),
    srcFull: urlFor(p.image).width(1600).auto('format').url(),
  }))

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

      {/* Gallery */}
      {photos.length === 0 ? (
        <div className="text-center py-32 text-gray-400">
          <Camera size={52} className="mx-auto mb-4 opacity-25" />
          <p className="text-lg">{t('empty')}</p>
        </div>
      ) : (
        <GalleryClient photos={photos} locale={locale} />
      )}
    </div>
  )
}
