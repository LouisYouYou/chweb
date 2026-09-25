const CHANNEL_ID = 'UCjZ3SAhHJ7-gVgZcMk0TFFw'
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  publishedAt: string
  thumbnail: string
}

export async function getChannelVideos(maxResults = 24): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(RSS_URL, { next: { revalidate: 1800 } })
    if (!res.ok) return []
    const xml = await res.text()

    // Parse <entry> blocks from Atom feed
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]

    return entries.slice(0, maxResults).map((match) => {
      const block = match[1]
      const videoId = (block.match(/<yt:videoId>(.*?)<\/yt:videoId>/) ?? [])[1] ?? ''
      const title = (block.match(/<title>(.*?)<\/title>/) ?? [])[1] ?? ''
      const published = (block.match(/<published>(.*?)<\/published>/) ?? [])[1] ?? ''
      const description = (block.match(/<media:description>([\s\S]*?)<\/media:description>/) ?? [])[1]?.trim() ?? ''

      return {
        id: videoId,
        title: title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'),
        description,
        publishedAt: published.slice(0, 10),
        thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '',
      }
    })
  } catch {
    return []
  }
}

export function getEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`
}

export function getWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}
