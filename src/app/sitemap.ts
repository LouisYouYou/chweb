import { MetadataRoute } from 'next'

const BASE = 'https://nanshijiaoglory.vercel.app'
const LOCALES = ['zh-TW', 'en', 'my', 'ja'] as const

const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; lastModified: string }[] = [
  { path: '',                 priority: 1.0, changeFrequency: 'weekly',  lastModified: '2025-10-01' },
  { path: '/about',           priority: 0.8, changeFrequency: 'monthly', lastModified: '2025-09-01' },
  { path: '/services',        priority: 0.9, changeFrequency: 'monthly', lastModified: '2025-09-01' },
  { path: '/sermons',         priority: 0.8, changeFrequency: 'weekly',  lastModified: '2025-10-01' },
  { path: '/events',          priority: 0.8, changeFrequency: 'weekly',  lastModified: '2025-10-01' },
  { path: '/daily-scripture', priority: 0.9, changeFrequency: 'daily',   lastModified: '2025-10-01' },
  { path: '/gallery',         priority: 0.7, changeFrequency: 'monthly', lastModified: '2025-09-01' },
  { path: '/weekly-bulletin', priority: 0.7, changeFrequency: 'weekly',  lastModified: '2025-10-01' },
  { path: '/prayer-wall',     priority: 0.6, changeFrequency: 'weekly',  lastModified: '2025-09-01' },
  { path: '/contact',         priority: 0.7, changeFrequency: 'monthly', lastModified: '2025-09-01' },
  { path: '/faq',             priority: 0.8, changeFrequency: 'monthly', lastModified: '2025-10-01' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap(({ path, priority, changeFrequency, lastModified }) =>
    LOCALES.map(locale => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: new Date(lastModified),
      changeFrequency,
      priority,
      alternates: {
        languages: {
          'zh-TW':     `${BASE}/zh-TW${path}`,
          'en':        `${BASE}/en${path}`,
          'my':        `${BASE}/my${path}`,
          'ja':        `${BASE}/ja${path}`,
          'x-default': `${BASE}/zh-TW${path}`,
        },
      },
    }))
  )
}
