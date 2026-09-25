import { client } from './client'
import { groq } from 'next-sanity'

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
