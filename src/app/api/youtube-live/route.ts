import { NextResponse } from 'next/server'

const CHANNEL_ID = 'UCjZ3SAhHJ7-gVgZcMk0TFFw'
const UPLOADS_PLAYLIST = 'UU' + CHANNEL_ID.slice(2)

export const revalidate = 300 // cache 5 minutes server-side

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ isLive: false, videoId: null })
  }

  try {
    // Step 1: get latest 5 video IDs from uploads playlist (1 quota unit)
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${UPLOADS_PLAYLIST}&part=snippet&maxResults=5`,
      { next: { revalidate: 300 } }
    )
    if (!playlistRes.ok) return NextResponse.json({ isLive: false, videoId: null })
    const playlistData = await playlistRes.json()
    if (!playlistData.items?.length) return NextResponse.json({ isLive: false, videoId: null })

    const videoIds = playlistData.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => item.snippet.resourceId.videoId)
      .join(',')

    // Step 2: check liveBroadcastContent for each video (1 quota unit)
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=snippet&fields=items(id,snippet/liveBroadcastContent)`,
      { next: { revalidate: 300 } }
    )
    if (!videosRes.ok) return NextResponse.json({ isLive: false, videoId: null })
    const videosData = await videosRes.json()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const liveVideo = videosData.items?.find((v: any) => v.snippet.liveBroadcastContent === 'live')

    return NextResponse.json({
      isLive: !!liveVideo,
      videoId: liveVideo?.id ?? null,
    })
  } catch {
    return NextResponse.json({ isLive: false, videoId: null })
  }
}
