import { NextRequest, NextResponse } from 'next/server'
import { sendPushToAll } from '@/lib/push/sendAll'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }

  // Find today's AI-generated content (Taiwan time)
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' })
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('ai_devotional_content')
    .select('notification_title, notification_body')
    .eq('date', today)
    .maybeSingle()

  const title = data?.notification_title ?? '🌅 今日靈修提醒'
  const body  = data?.notification_body  ?? '願神的話語今天陪伴你，點擊開始靈修與禱告。'
  const url   = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.gcns.org.tw'}/zh-TW/daily-scripture`

  const result = await sendPushToAll({ title, body, url })
  return NextResponse.json({ ok: true, date: today, ...result })
}
