import { MetadataRoute } from 'next'

const baseUrl = 'https://nanshijiaoglory.vercel.app'
const locales = ['zh-TW', 'en']
const routes = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/sermons', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/events', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/daily-scripture', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    routes.map(({ path, priority, changeFrequency }) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }))
  )
}
