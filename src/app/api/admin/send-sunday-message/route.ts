import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createAdminClient } from '@/lib/supabase/admin'
import { noCdnClient } from '@/lib/sanity/client'
import { groq } from 'next-sanity'
import { sundayMessageHtml, sundayMessageSubject } from '@/lib/email/notifyTemplates'

interface Subscriber { email: string; locale: string }

type PTSpan = { _type?: string; text?: string; marks?: string[] }
type PTBlock = { _type?: string; style?: string; children?: PTSpan[]; listItem?: string }

function escHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function portableTextToEmailHtml(blocks: PTBlock[]): string {
  return blocks.map((block) => {
    if (block._type !== 'block') return ''
    const spans = (block.children ?? []).map((span) => {
      let t = escHtml(span.text ?? '')
      const marks = span.marks ?? []
      if (marks.includes('strong'))    t = `<strong>${t}</strong>`
      if (marks.includes('em'))        t = `<em>${t}</em>`
      if (marks.includes('underline')) t = `<span style="text-decoration:underline;">${t}</span>`
      return t
    }).join('')
    if (!spans.trim()) return '<br style="line-height:1.8;">'
    const pStyle = 'margin:0 0 10px;color:#555;font-size:14px;line-height:1.8;'
    switch (block.style) {
      case 'h1': return `<h2 style="margin:16px 0 8px;color:#380a14;font-size:17px;font-weight:700;line-height:1.4;">${spans}</h2>`
      case 'h2': return `<h3 style="margin:14px 0 6px;color:#380a14;font-size:15px;font-weight:700;line-height:1.4;">${spans}</h3>`
      case 'blockquote': return `<blockquote style="margin:12px 0;padding:10px 16px;border-left:3px solid #92202f;color:#666;font-style:italic;font-size:14px;line-height:1.8;">${spans}</blockquote>`
      default: return block.listItem === 'bullet'
        ? `<li style="${pStyle}">${spans}</li>`
        : `<p style="${pStyle}">${spans}</p>`
    }
  }).join('')
}

export async function POST(req: NextRequest) {
  const { password, dryRun } = await req.json()

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // 1. 從 Sanity 抓最新主日信息
  const msg = await noCdnClient.fetch(groq`
    *[_type == "sundayMessage"] | order(date desc) [0] {
      _id, date, title, preacher, scripture, summary, youtubeUrl
    }
  `)

  if (!msg) {
    return NextResponse.json({ error: 'no_sunday_message' }, { status: 404 })
  }

  // 2. 轉換 summary（PortableText → HTML）
  const summaryHtml: string | undefined = Array.isArray(msg.summary)
    ? portableTextToEmailHtml(msg.summary as PTBlock[]) || undefined
    : typeof msg.summary === 'string' ? msg.summary : undefined

  // 3. dryRun：只回傳預覽，不寄信
  if (dryRun) {
    const previewHtml = sundayMessageHtml('zh-TW', msg.title, msg.preacher, msg.date, msg.scripture, summaryHtml, msg.youtubeUrl)
    return NextResponse.json({ ok: true, dryRun: true, title: msg.title, date: msg.date, previewHtml })
  }

  // 4. 取得訂閱者
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD
  if (!gmailUser || !gmailPass) {
    return NextResponse.json({ error: 'gmail_not_configured' }, { status: 500 })
  }

  const supabase = createAdminClient()
  const { data: subscribers } = await supabase
    .from('newsletter_subscribers')
    .select('email, locale')
    .eq('is_active', true)

  const adminEmails = (process.env.ADMIN_NOTIFY_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean)
  const subSet = new Set((subscribers ?? []).map((s: Subscriber) => s.email))
  const allRecipients: Subscriber[] = [
    ...(subscribers ?? []),
    ...adminEmails.filter(e => !subSet.has(e)).map(e => ({ email: e, locale: 'zh-TW' })),
  ]

  if (allRecipients.length === 0) {
    return NextResponse.json({ error: 'no_recipients' }, { status: 400 })
  }

  // 5. 寄信
  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: gmailUser, pass: gmailPass } })
  const fromAddress = `"行道會南勢角榮耀堂" <${gmailUser}>`
  let sent = 0, failed = 0

  for (const r of allRecipients) {
    const html = sundayMessageHtml(r.locale, msg.title, msg.preacher, msg.date, msg.scripture, summaryHtml, msg.youtubeUrl)
    try {
      await transporter.sendMail({
        from: fromAddress,
        to: r.email,
        subject: sundayMessageSubject(r.locale, msg.title),
        html,
      })
      sent++
    } catch (err) {
      console.error(`寄信失敗 ${r.email}:`, err)
      failed++
    }
  }

  return NextResponse.json({ ok: true, title: msg.title, date: msg.date, sent, failed, total: allRecipients.length })
}

// GET：回傳最新主日信息預覽（不寄信）
export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get('password')
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const msg = await noCdnClient.fetch(groq`
    *[_type == "sundayMessage"] | order(date desc) [0] {
      _id, date, title, preacher, scripture, summary, youtubeUrl
    }
  `)

  if (!msg) return NextResponse.json({ error: 'no_sunday_message' }, { status: 404 })

  const summaryHtml: string | undefined = Array.isArray(msg.summary)
    ? portableTextToEmailHtml(msg.summary as PTBlock[]) || undefined
    : typeof msg.summary === 'string' ? msg.summary : undefined

  const previewHtml = sundayMessageHtml('zh-TW', msg.title, msg.preacher, msg.date, msg.scripture, summaryHtml, msg.youtubeUrl)

  return NextResponse.json({ title: msg.title, date: msg.date, previewHtml })
}
