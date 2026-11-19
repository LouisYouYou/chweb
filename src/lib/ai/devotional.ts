import { GoogleGenerativeAI } from '@google/generative-ai'

export interface DevotionalInput {
  verseZh: string
  referenceZh: string
  reflectionZh?: string
  imageUrl?: string | null
}

export interface DevotionalOutput {
  notificationTitle: string
  notificationBody: string
  devotionalText: string
  prayerPrompt: string
  emailIntro: string
}

const PROMPT = (verseZh: string, referenceZh: string, reflectionZh?: string, hasImage?: boolean) => `
你是行道會南勢角榮耀堂的靈修文案助手，使用台灣正體中文。

今日牧師上傳的靈修材料：
📖 經文：「${verseZh}」（${referenceZh}）
${reflectionZh ? `✍️ 牧師默想：${reflectionZh}` : ''}
${hasImage ? '（附有配圖，請結合圖片意境）' : ''}

請根據以上材料，生成以下 JSON 格式的靈修文案，直接回傳純 JSON，不要加任何說明或 markdown：

{
  "notificationTitle": "推播通知標題，不超過 20 字，含日期或節期特色",
  "notificationBody": "推播通知內文，不超過 50 字，能引發今日靈修動機的一句話",
  "devotionalText": "靈修反思文案，100-150 字，結合經文意境幫助信徒默想，不直接複製貼上經文原文",
  "prayerPrompt": "禱告提示，20-30 字，今日可以為什麼具體事項禱告",
  "emailIntro": "Email 開場段落，50-80 字，溫暖邀請信徒進入今日靈修"
}

注意：語氣溫暖牧養，貼近台灣教會文化，只回傳 JSON。
`.trim()

async function fetchImageBase64(url: string): Promise<{ data: string; mimeType: string } | null> {
  try {
    const res = await fetch(`${url}?w=800&auto=format`)
    if (!res.ok) return null
    const contentType = res.headers.get('content-type') ?? 'image/jpeg'
    const buffer = await res.arrayBuffer()
    const data = Buffer.from(buffer).toString('base64')
    return { data, mimeType: contentType.split(';')[0] }
  } catch {
    return null
  }
}

export async function generateDevotional(input: DevotionalInput): Promise<DevotionalOutput> {
  const { verseZh, referenceZh, reflectionZh, imageUrl } = input

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  type Part = { text: string } | { inlineData: { mimeType: string; data: string } }
  const parts: Part[] = []

  if (imageUrl) {
    const img = await fetchImageBase64(imageUrl)
    if (img) parts.push({ inlineData: { mimeType: img.mimeType, data: img.data } })
  }

  parts.push({ text: PROMPT(verseZh, referenceZh, reflectionZh, !!imageUrl) })

  const result = await model.generateContent(parts)
  const raw = result.response.text()
  const jsonStr = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

  try {
    return JSON.parse(jsonStr) as DevotionalOutput
  } catch {
    return {
      notificationTitle: `📖 今日靈修 — ${referenceZh}`,
      notificationBody:  `願神的話語 ${referenceZh} 今天陪伴你`,
      devotionalText:    reflectionZh ?? verseZh,
      prayerPrompt:      '求神讓今日的話語深入心中',
      emailIntro:        `今天牧師分享了 ${referenceZh} 的靈修默想，邀請你一起進入今日靈修。`,
    }
  }
}

export function sanityImageUrl(assetRef: string): string {
  const match = assetRef.match(/^image-(.+)-(\d+x\d+)-(\w+)$/)
  if (!match) return ''
  const [, id, dimensions, format] = match
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`
}
