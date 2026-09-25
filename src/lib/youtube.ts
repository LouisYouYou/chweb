const API_KEY = process.env.YOUTUBE_API_KEY
const CHANNEL_ID = 'UCjZ3SAhHJ7-gVgZcMk0TFFw'

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  publishedAt: string
  thumbnail: string
}

export async function getChannelVideos(maxResults = 24): Promise<YouTubeVideo[]> {
  if (!API_KEY) return []
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&order=date&maxResults=${maxResults}&key=${API_KEY}`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    if (!data.items) return []

    return data.items.map((item: { id: { videoId: string }; snippet: { title: string; description: string; publishedAt: string; thumbnails: { high?: { url: string }; medium?: { url: string }; default?: { url: string } } } }) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt.slice(0, 10),
      thumbnail:
        item.snippet.thumbnails.high?.url ??
        item.snippet.thumbnails.medium?.url ??
        item.snippet.thumbnails.default?.url ??
        '',
    }))
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
