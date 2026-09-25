const PAGE_ID = '100071633452675'

export interface FacebookPhoto {
  id: string
  url: string
  width: number
  height: number
  name?: string
  createdTime: string
}

export async function getFacebookPagePhotos(limit = 50): Promise<FacebookPhoto[]> {
  const appId = process.env.FACEBOOK_APP_ID
  const appSecret = process.env.FACEBOOK_APP_SECRET
  if (!appId || !appSecret) return []

  try {
    const token = `${appId}|${appSecret}`
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${PAGE_ID}/photos?type=uploaded&fields=images,name,created_time&limit=${limit}&access_token=${token}`,
      { next: { revalidate: 3600 } }
    )
    const data = await res.json()
    if (!data.data) return []

    return data.data.map((item: {
      id: string
      name?: string
      created_time: string
      images: { source: string; width: number; height: number }[]
    }) => {
      // Pick largest image
      const best = item.images?.sort((a, b) => b.width - a.width)[0]
      return {
        id: item.id,
        url: best?.source ?? '',
        width: best?.width ?? 800,
        height: best?.height ?? 600,
        name: item.name,
        createdTime: item.created_time?.slice(0, 10) ?? '',
      }
    }).filter((p: FacebookPhoto) => p.url)
  } catch {
    return []
  }
}
