import { MetadataRoute } from 'next'

const BASE = 'https://nanshijiaoglory.vercel.app'
const LOCALES = ['zh-TW', 'en', 'my'] as const

const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '',                  priority: 1.0, changeFrequency: 'weekly'  },
  { path: '/about',            priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services',         priority: 0.9, changeFrequency: 'monthly' },
  { path: '/sermons',          priority: 0.8, changeFrequency: 'weekly'  },
  { path: '/events',           priority: 0.8, changeFrequency: 'weekly'  },
  { path: '/daily-scripture',  priority: 0.9, changeFrequency: 'daily'   },
  { path: '/gallery',          priority: 0.7, changeFrequency: 'monthly' },
  { path: '/weekly-bulletin',  priority: 0.7, changeFrequency: 'weekly'  },
  { path: '/prayer-wall',      priority: 0.7, changeFrequency: 'weekly'  },
  { path: '/contact',          priority: 0.7, changeFrequency: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap(({ path, priority, changeFrequency }) =>
    LOCALES.map(locale => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: {
          'zh-TW':    `${BASE}/zh-TW${path}`,
          'en':       `${BASE}/en${path}`,
          'my':       `${BASE}/my${path}`,
          'x-default': `${BASE}/zh-TW${path}`,
        },
      },
    }))
  )
}
