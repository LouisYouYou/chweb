import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import { Camera } from 'lucide-react'
import { getAllGalleryPhotos } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'
import GalleryClient from '@/components/gallery/GalleryClient'
import PageHero from '@/components/layout/PageHero'

import { buildMetadata, pageSEO } from '@/lib/seo/metadata'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata(locale, pageSEO.gallery)
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
    lqip: p.image.asset.metadata?.lqip,
  }))

  return (
    <div>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

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
