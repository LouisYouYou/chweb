import { NextResponse } from 'next/server'

export async function GET() {
  const API_KEY = process.env.YOUTUBE_API_KEY
  if (!API_KEY) return NextResponse.json({ error: 'No API key set' })

  // Test 1: get channel by handle
  const handleRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=id,snippet&forHandle=winson651202&key=${API_KEY}`
  )
  const handleData = await handleRes.json()

  // Test 2: search videos directly by channel name
  const searchRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=winson651202&type=channel&key=${API_KEY}`
  )
  const searchData = await searchRes.json()

  return NextResponse.json({ handleData, searchData })
}
