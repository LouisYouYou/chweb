import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ views: 0, likes: 0 })

  const { data } = await supabase
    .from('sunday_message_stats')
    .select('views, likes')
    .eq('sanity_id', id)
    .maybeSingle()

  return NextResponse.json({ views: data?.views ?? 0, likes: data?.likes ?? 0 })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const id: string | undefined = body?.id
  const action: string | undefined = body?.action

  if (!id || !['view', 'like', 'unlike'].includes(action ?? '')) {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 })
  }

  const viewsDelta = action === 'view' ? 1 : 0
  const likesDelta = action === 'like' ? 1 : action === 'unlike' ? -1 : 0

  const { data, error } = await supabase.rpc('upsert_sunday_stat', {
    p_id: id,
    p_views_delta: viewsDelta,
    p_likes_delta: likesDelta,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const row = Array.isArray(data) ? data[0] : data
  return NextResponse.json({ views: row?.views ?? 0, likes: row?.likes ?? 0 })
}
