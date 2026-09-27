const CHANNEL_ID = 'UCjZ3SAhHJ7-gVgZcMk0TFFw'
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
// Uploads playlist: replace leading "UC" with "UU"
const UPLOADS_PLAYLIST = 'UU' + CHANNEL_ID.slice(2)

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  publishedAt: string
  thumbnail: string
}

export async function getChannelVideos(maxResults = 24): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (apiKey) {
    const result = await getVideosViaAPI(apiKey, maxResults)
    if (result.length > 0) return result
  }
  return getVideosViaRSS(maxResults)
}

async function getVideosViaAPI(apiKey: string, maxResults: number): Promise<YouTubeVideo[]> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${UPLOADS_PLAYLIST}&part=snippet&maxResults=${maxResults}`
    const res = await fetch(url, { next: { revalidate: 1800 } })
    if (!res.ok) return []
    const data = await res.json()
    if (!data.items?.length) return []
    return data.items.map((item: {
      snippet: {
        resourceId: { videoId: string }
        title: string
        description: string
        publishedAt: string
        thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } }
      }
    }) => {
      const s = item.snippet
      const videoId = s.resourceId.videoId
      return {
        id: videoId,
        title: s.title,
        description: s.description ?? '',
        publishedAt: s.publishedAt.slice(0, 10),
        thumbnail: s.thumbnails.high?.url ?? s.thumbnails.medium?.url ?? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      }
    })
  } catch {
    return []
  }
}

async function getVideosViaRSS(maxResults: number): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 1800 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ChurchWebsite/1.0)' },
    })
    if (!res.ok) return []
    const xml = await res.text()
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
