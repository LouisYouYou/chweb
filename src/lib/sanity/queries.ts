import { client } from './client'
import { groq } from 'next-sanity'

export interface DailyScripture {
  _id: string
  date: string
  verseZh: string
  verseEn?: string
  referenceZh: string
  referenceEn?: string
  reflectionZh?: string
  reflectionEn?: string
  image?: {
    asset: { _ref: string }
    alt?: string
    hotspot?: { x: number; y: number }
  }
}

const scriptureFields = groq`
  _id, date, verseZh, verseEn,
  referenceZh, referenceEn,
  reflectionZh, reflectionEn,
  image { asset, alt, hotspot }
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
