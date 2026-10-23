import { client } from './client'
import { groq } from 'next-sanity'
import type { PortableTextBlock } from '@portabletext/types'

export type SanityBlock = PortableTextBlock

export interface Announcement {
  _id: string
  titleZh: string
  titleEn: string
  contentZh?: string
  contentEn?: string
  type: 'event' | 'notice' | 'urgent'
  image?: { asset: { _ref: string }; hotspot?: { x: number; y: number } }
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
      type, image { asset, hotspot }, link, isPinned, publishedAt, expiresAt
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

export async function getScriptureByDate(date: string): Promise<DailyScripture | null> {
  return client.fetch(
    groq`*[_type == "dailyScripture" && date == $date][0]{ ${scriptureFields} }`,
    { date }
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
    asset: { _ref: string; metadata?: { lqip?: string } }
    hotspot?: { x: number; y: number }
  }
}

export async function getAllGalleryPhotos(): Promise<GalleryPhoto[]> {
  return client.fetch(
    groq`*[_type == "galleryPhoto"] | order(date desc) { _id, date, caption, image { asset->{ "_ref": _id, metadata { lqip } }, hotspot } }`
  )
}

export interface Pastor {
  _id: string
  order: number
  photo?: { asset: { _ref: string }; hotspot?: { x: number; y: number } }
}

export interface StoryCard {
  _id: string
  order: number
  name: string
  label?: string
  quote: string
  photo?: { asset: { _ref: string }; hotspot?: { x: number; y: number } }
}

export async function getStoryCards(): Promise<StoryCard[]> {
  return client.fetch(
    groq`*[_type == "storyCard"] | order(order asc) { _id, order, name, label, quote, photo { asset, hotspot } }`
  )
}

export async function getPastors(): Promise<Pastor[]> {
  return client.fetch(
    groq`*[_type == "pastor"] | order(order asc) { _id, order, photo { asset, hotspot } }`
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
  image?: { asset: { _ref: string; metadata?: { lqip?: string } }; hotspot?: { x: number; y: number } }
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
  imageBlurData?: string
  courseItems?: Array<{ nameZh: string; nameEn: string; day: string; time: string }>
}

const eventFields = groq`
  _id, titleZh, titleEn, descriptionZh, descriptionEn,
  date, time, locationZh, locationEn, category,
  fee, seats, seatsLeft, registrationUrl,
  image { asset->{ "_ref": _id, metadata { lqip } }, hotspot },
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

export async function getEventById(id: string): Promise<SanityEvent | null> {
  return client.fetch(
    groq`*[_type == "churchEvent" && _id == $id][0] { ${eventFields} }`,
    { id },
    { next: { tags: [`event-${id}`], revalidate: 3600 } }
  )
}

export interface SundayMessage {
  _id: string
  date: string
  title: string
  preacher: string
  scripture?: string
  summary?: string | SanityBlock[]
  youtubeUrl?: string
  image?: {
    asset: {
      _ref: string
      url: string
      metadata: { dimensions: { width: number; height: number }; lqip?: string }
    }
    hotspot?: { x: number; y: number }
  }
}

export async function getLatestSundayMessage(): Promise<SundayMessage | null> {
  return client.fetch(
    groq`*[_type == "sundayMessage"] | order(date desc) [0] {
      _id, date, title, preacher, scripture, summary, youtubeUrl,
      image { asset->{ "_ref": _id, url, metadata { dimensions { width, height }, lqip } }, hotspot }
    }`,
    {},
    { next: { tags: ['sunday-message'], revalidate: 60 } }
  )
}

export async function getAllSundayMessages(): Promise<Pick<SundayMessage, '_id' | 'date' | 'title' | 'preacher' | 'scripture' | 'image'>[]> {
  return client.fetch(
    groq`*[_type == "sundayMessage"] | order(date desc) {
      _id, date, title, preacher, scripture,
      image { asset->{ "_ref": _id, url, metadata { dimensions { width, height }, lqip } }, hotspot }
    }`,
    {},
    { next: { tags: ['sunday-message'], revalidate: 3600 } }
  )
}

export async function getSundayMessageById(id: string): Promise<SundayMessage | null> {
  return client.fetch(
    groq`*[_type == "sundayMessage" && _id == $id][0] {
      _id, date, title, preacher, scripture, summary, youtubeUrl,
      image { asset->{ "_ref": _id, url, metadata { dimensions { width, height }, lqip } }, hotspot }
    }`,
    { id },
    { next: { tags: [`sunday-message-${id}`], revalidate: 3600 } }
  )
}

export async function getAllSundayMessageIds(): Promise<{ _id: string }[]> {
  return client.fetch(
    groq`*[_type == "sundayMessage"] | order(date desc) { _id }`
  )
}
