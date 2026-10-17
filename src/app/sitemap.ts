import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

const BASE = 'https://nanshijiaoglory.vercel.app'
const LOCALES = ['zh-TW', 'en', 'my', 'ja'] as const

type Route = {
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  lastModified?: Date
}

async function fetchLatestUpdatedAt(type: string): Promise<Date | undefined> {
  try {
    const result = await client.fetch<string | null>(
      groq`*[_type == $type] | order(_updatedAt desc)[0]._updatedAt`,
      { type },
      { next: { revalidate: 3600 } }
    )
    return result ? new Date(result) : undefined
  } catch {
    return undefined
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [latestEvent, latestScripture, latestBulletin, latestAnnouncement, latestSundayMsg] =
    await Promise.all([
      fetchLatestUpdatedAt('churchEvent'),
      fetchLatestUpdatedAt('dailyScripture'),
      fetchLatestUpdatedAt('weeklyBulletin'),
      fetchLatestUpdatedAt('announcement'),
      fetchLatestUpdatedAt('sundayMessage'),
    ])

  // Home page: use latest of sundayMessage / event / announcement as signal
  const homeLastMod = [latestSundayMsg, latestEvent, latestAnnouncement]
    .filter((d): d is Date => d !== undefined)
    .sort((a, b) => b.getTime() - a.getTime())[0]

  const routes: Route[] = [
    { path: '',                 priority: 1.0, changeFrequency: 'weekly',  lastModified: homeLastMod },
    { path: '/about',           priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services',        priority: 0.9, changeFrequency: 'monthly' },
    { path: '/sermons',         priority: 0.8, changeFrequency: 'weekly',  lastModified: latestSundayMsg },
    { path: '/events',          priority: 0.8, changeFrequency: 'weekly',  lastModified: latestEvent },
    { path: '/daily-scripture', priority: 0.9, changeFrequency: 'daily',   lastModified: latestScripture },
    { path: '/gallery',         priority: 0.7, changeFrequency: 'monthly' },
    { path: '/weekly-bulletin', priority: 0.7, changeFrequency: 'weekly',  lastModified: latestBulletin },
    { path: '/prayer-wall',     priority: 0.6, changeFrequency: 'weekly' },
    { path: '/contact',         priority: 0.7, changeFrequency: 'monthly' },
    { path: '/faq',             priority: 0.8, changeFrequency: 'monthly' },
  ]

  return routes.flatMap(({ path, priority, changeFrequency, lastModified }) =>
    LOCALES.map(locale => ({
      url: `${BASE}/${locale}${path}`,
      ...(lastModified ? { lastModified } : {}),
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
