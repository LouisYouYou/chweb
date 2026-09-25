import { NextResponse } from 'next/server'

const PAGE_ID = '100071633452675'

export async function GET() {
  const appId = process.env.FACEBOOK_APP_ID
  const appSecret = process.env.FACEBOOK_APP_SECRET

  if (!appId || !appSecret) {
    return NextResponse.json({ error: 'Missing FACEBOOK_APP_ID or FACEBOOK_APP_SECRET' })
  }

  const token = `${appId}|${appSecret}`

  // Test 1: verify page is accessible
  const pageRes = await fetch(
    `https://graph.facebook.com/v19.0/${PAGE_ID}?fields=name,id&access_token=${token}`
  )
  const pageData = await pageRes.json()

  if (pageData.error) {
    return NextResponse.json({ step: 'page_lookup_failed', error: pageData.error })
  }

  // Test 2: fetch photos
  const photosRes = await fetch(
    `https://graph.facebook.com/v19.0/${PAGE_ID}/photos?type=uploaded&fields=id,name,created_time&limit=5&access_token=${token}`
  )
  const photosData = await photosRes.json()

  return NextResponse.json({
    page: pageData,
    photoCount: photosData.data?.length ?? 0,
    firstPhoto: photosData.data?.[0] ?? null,
    photosError: photosData.error ?? null,
  })
}
