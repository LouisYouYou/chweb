'use client'

import Image from 'next/image'
import { useState } from 'react'

const SERMON_PLACEHOLDER = '/images/sermon-placeholder.svg'

interface SermonThumbnailProps {
  src: string
  alt: string
}

export function SermonThumbnail({ src, alt }: SermonThumbnailProps) {
  const [imageSrc, setImageSrc] = useState(src || SERMON_PLACEHOLDER)
  const [prevSrc, setPrevSrc] = useState(src)

  // React "adjusting state while rendering" pattern:
  // when src changes (same instance, new URL), reset imageSrc immediately
  // before the next paint — no useEffect, no extra commit.
  if (prevSrc !== src) {
    setPrevSrc(src)
    setImageSrc(src || SERMON_PLACEHOLDER)
  }

  const isFallback = imageSrc === SERMON_PLACEHOLDER

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(50vw - 34px), (max-width: 1279px) calc(33.333vw - 35px), 392px"
      className="object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
      onError={() => { if (!isFallback) setImageSrc(SERMON_PLACEHOLDER) }}
      unoptimized={isFallback}
    />
  )
}
