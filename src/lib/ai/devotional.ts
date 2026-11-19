import Anthropic from '@anthropic-ai/sdk'

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

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function fetchImageBase64(url: string): Promise<{ data: string; mediaType: 'image/jpeg' | 'image/png' | 'image/webp' } | null> {
  try {
    const res = await fetch(`${url}?w=800&auto=format`)
    if (!res.ok) return null
    const contentType = res.headers.get('content-type') ?? 'image/jpeg'
    const mediaType = (
      contentType.includes('png') ? 'image/png' :
      contentType.includes('webp') ? 'image/webp' : 'image/jpeg'
    ) as 'image/jpeg' | 'image/png' | 'image/webp'
    const buffer = await res.arrayBuffer()
    const data = Buffer.from(buffer).toString('base64')
    return { data, mediaType }
  } catch {
    return null
  }
}

export async function generateDevotional(input: DevotionalInput): Promise<DevotionalOutput> {
  const { verseZh, referenceZh, reflectionZh, imageUrl } = input

  const textContent = `
今日牧師上傳的靈修材料：
📖 經文：「${verseZh}」（${referenceZh}）
${reflectionZh ? `✍️ 牧師默想：${reflectionZh}` : ''}

請根據以上材料（${imageUrl ? '包含配圖' : '純文字'}），以台灣正體中文生成以下 JSON 格式的靈修文案，直接回傳 JSON，不需加其他說明：

{
  "notificationTitle": "推播通知標題，不超過 20 字，含日期或節期特色",
  "notificationBody": "推播通知內文，不超過 50 字，能引發今日靈修動機的一句話",
  "devotionalText": "靈修反思文案，100-150 字，結合經文意境幫助信徒默想，不直接複製貼上經文原文",
  "prayerPrompt": "禱告提示，20-30 字，今日可以為什麼具體事項禱告",
  "emailIntro": "Email 開場段落，50-80 字，溫暖邀請信徒進入今日靈修"
}

注意：語氣溫暖牧養，貼近台灣教會文化，回傳純 JSON 不含 markdown。
  `.trim()

  type ContentBlock = Anthropic.TextBlockParam | Anthropic.ImageBlockParam
  const content: ContentBlock[] = []

  if (imageUrl) {
    const img = await fetchImageBase64(imageUrl)
    if (img) {
      content.push({ type: 'image', source: { type: 'base64', media_type: img.mediaType, data: img.data } })
    }
  }
  content.push({ type: 'text', text: textContent })

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content }],
  })

  const raw = response.content.find(b => b.type === 'text')?.text ?? '{}'
  // Strip any markdown code fences if model wraps response
  const jsonStr = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

  try {
    return JSON.parse(jsonStr) as DevotionalOutput
  } catch {
    // Fallback: return minimal content
    return {
      notificationTitle: `📖 今日靈修 — ${referenceZh}`,
      notificationBody: `願神的話語 ${referenceZh} 今天陪伴你`,
      devotionalText: reflectionZh ?? verseZh,
      prayerPrompt: '求神讓今日的話語深入心中',
      emailIntro: `今天牧師分享了 ${referenceZh} 的靈修默想，邀請你一起進入今日靈修。`,
    }
  }
}

export function sanityImageUrl(assetRef: string): string {
  const match = assetRef.match(/^image-(.+)-(\d+x\d+)-(\w+)$/)
  if (!match) return ''
  const [, id, dimensions, format] = match
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`
}
