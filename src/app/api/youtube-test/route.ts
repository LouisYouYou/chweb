import { NextResponse } from 'next/server'

export async function GET() {
  const API_KEY = process.env.YOUTUBE_API_KEY
  if (!API_KEY) return NextResponse.json({ error: 'No API key set' })

  // Step 1: get channel ID by handle
  const handleRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=id,snippet&forHandle=winson651202&key=${API_KEY}`
  )
  const handleData = await handleRes.json()
  const channelId = handleData.items?.[0]?.id ?? null

  if (!channelId) {
    return NextResponse.json({ step: 'channel_lookup_failed', handleData })
  }

  // Step 2: fetch videos
  const videosRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=5&key=${API_KEY}`
  )
  const videosData = await videosRes.json()

  return NextResponse.json({
    channelId,
    channelTitle: handleData.items?.[0]?.snippet?.title,
    videoCount: videosData.items?.length ?? 0,
    videos: videosData.items?.map((v: { id: { videoId: string }; snippet: { title: string; publishedAt: string } }) => ({
      id: v.id.videoId,
      title: v.snippet.title,
      publishedAt: v.snippet.publishedAt,
    })) ?? [],
    error: videosData.error ?? null,
  })
}
