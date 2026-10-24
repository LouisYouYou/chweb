import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

// 簡易管理員手動清除快取端點
// 使用方式：POST /api/admin/revalidate-now  Body: { secret: "..." }
export async function POST(req: NextRequest) {
  try {
    const { secret } = await req.json()

    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    revalidateTag('sunday-message', 'max')
    revalidatePath('/[locale]', 'page')
    revalidatePath('/[locale]/sermons', 'page')

    return NextResponse.json({ ok: true, revalidated: true, now: new Date().toISOString() })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
