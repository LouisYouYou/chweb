import { client } from './client'
import { groq } from 'next-sanity'

export interface Announcement {
  _id: string
  titleZh: string
  titleEn: string
  contentZh?: string
  contentEn?: string
  type: 'event' | 'notice' | 'urgent'
  link?: string
  isPinned: boolean
  publishedAt: string
  expiresAt?: string
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const now = new Date().toISOString()
  return client.fetch(
    groq`*[
      _type == "announcement" &&
      publishedAt <= $now &&
      (expiresAt == null || expiresAt > $now)
    ] | order(isPinned desc, publishedAt desc) [0...5] {
      _id, titleZh, titleEn, contentZh, contentEn,
      type, link, isPinned, publishedAt, expiresAt
    }`,
    { now }
  )
}

export interface WeeklyBulletin {
  _id: string
  date: string
  file?: {
    asset: { url: string }
  }
}

export interface DailyScripture {
  _id: string
  date: string
  image?: {
    asset: { _ref: string }
    hotspot?: { x: number; y: number }
  }
}

const scriptureFields = groq`
  _id, date, image { asset, hotspot }
`

export async function getTodayScripture(): Promise<DailyScripture | null> {
  const today = new Date().toISOString().slice(0, 10)
  return client.fetch(
    groq`*[_type == "dailyScripture" && date == $today][0]{ ${scriptureFields} }`,
    { today }
  )
}

export async function getLatestScripture(): Promise<DailyScripture | null> {
  return client.fetch(
    groq`*[_type == "dailyScripture"] | order(date desc) [0]{ ${scriptureFields} }`
  )
}

export async function getAllScriptures(): Promise<DailyScripture[]> {
  return client.fetch(
    groq`*[_type == "dailyScripture"] | order(date desc) { ${scriptureFields} }`
  )
}

export interface GalleryPhoto {
  _id: string
  date: string
  caption?: string
  image: {
    asset: { _ref: string }
    hotspot?: { x: number; y: number }
  }
}

export async function getAllGalleryPhotos(): Promise<GalleryPhoto[]> {
  return client.fetch(
    groq`*[_type == "galleryPhoto"] | order(date desc) { _id, date, caption, image { asset, hotspot } }`
  )
}

export async function getAllBulletins(): Promise<WeeklyBulletin[]> {
  return client.fetch(
    groq`*[_type == "weeklyBulletin"] | order(date desc) { _id, date, file { asset->{ url } } }`
  )
}

export interface SanityEvent {
  _id: string
  titleZh: string
  titleEn: string
  descriptionZh?: string
  descriptionEn?: string
  date: string
  time?: string
  locationZh?: string
  locationEn?: string
  category: 'worship' | 'family' | 'youth' | 'community' | 'retreat' | 'training'
  fee?: number
  seats?: number
  seatsLeft?: number
  registrationUrl?: string
  image?: { asset: { _ref: string }; hotspot?: { x: number; y: number } }
  courseItems?: Array<{ nameZh: string; nameEn: string; day: string; time: string }>
}

export interface DisplayEvent {
  id: string
  titleZh: string
  titleEn: string
  descriptionZh?: string
  descriptionEn?: string
  date: string
  time?: string
  locationZh?: string
  locationEn?: string
  category: 'worship' | 'family' | 'youth' | 'community' | 'retreat' | 'training'
  fee?: number
  seats?: number
  seatsLeft?: number
  registrationUrl?: string
  imageUrl?: string
  courseItems?: Array<{ nameZh: string; nameEn: string; day: string; time: string }>
}

const eventFields = groq`
  _id, titleZh, titleEn, descriptionZh, descriptionEn,
  date, time, locationZh, locationEn, category,
  fee, seats, seatsLeft, registrationUrl,
  image { asset, hotspot },
  courseItems[] { nameZh, nameEn, day, time }
`

export async function getUpcomingEvents(limit = 3): Promise<SanityEvent[]> {
  const today = new Date().toISOString().slice(0, 10)
  return client.fetch(
    groq`*[_type == "churchEvent" && date >= $today] | order(date asc) [0...$limit] { ${eventFields} }`,
    { today, limit }
  )
}

export async function getAllEvents(): Promise<SanityEvent[]> {
  const today = new Date().toISOString().slice(0, 10)
  return client.fetch(
    groq`*[_type == "churchEvent" && date >= $today] | order(date asc) { ${eventFields} }`,
    { today }
  )
}

export interface SundayMessage {
  _id: string
  date: string
  title: string
  preacher: string
  scripture?: string
  summary?: string
  youtubeUrl?: string
  image?: {
    asset: {
      _ref: string
      url: string
      metadata: { dimensions: { width: number; height: number } }
    }
    hotspot?: { x: number; y: number }
  }
}

export async function getLatestSundayMessage(): Promise<SundayMessage | null> {
  return client.fetch(
    groq`*[_type == "sundayMessage"] | order(date desc) [0] {
      _id, date, title, preacher, scripture, summary, youtubeUrl,
      image { asset->{ _ref, url, metadata { dimensions { width, height } } }, hotspot }
    }`
  )
}
