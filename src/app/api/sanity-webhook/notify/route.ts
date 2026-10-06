import { NextRequest, NextResponse } from 'next/server'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import nodemailer, { type Transporter } from 'nodemailer'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  dailyScriptureHtml, dailyScriptureSubject,
  announcementHtml,   announcementSubject,
  sundayMessageHtml,  sundayMessageSubject,
} from '@/lib/email/notifyTemplates'

// ── 固定管理者 / 牧師通知名單 ─────────────────────────────────────────────
const ADMIN_EMAILS = (process.env.ADMIN_NOTIFY_EMAILS ?? '')
  .split(',')
  .map(e => e.trim())
  .filter(Boolean)

// ── Nodemailer 轉接器 ─────────────────────────────────────────────────────
function buildTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) throw new Error('GMAIL_USER 或 GMAIL_APP_PASSWORD 未設定')
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

// ── 取得所有訂閱者 ────────────────────────────────────────────────────────
interface Subscriber { email: string; locale: string }

async function fetchSubscribers(): Promise<Subscriber[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('email, locale')
    .eq('is_active', true)

  if (error) throw error
  return data ?? []
}

// ── 批量寄信（串行，避免 Gmail 速率限制）────────────────────────────────
async function sendBulk(
  transporter: Transporter,
  recipients: Subscriber[],
  buildEmail: (locale: string) => { subject: string; html: string }
) {
  const fromAddress = `"行道會南勢角榮耀堂" <${process.env.GMAIL_USER}>`
  const results = { sent: 0, failed: 0 }

  for (const r of recipients) {
    const { subject, html } = buildEmail(r.locale)
    try {
      await transporter.sendMail({ from: fromAddress, to: r.email, subject, html })
      results.sent++
    } catch (err) {
      console.error(`寄信失敗 ${r.email}:`, err)
      results.failed++
    }
  }
  return results
}

// ── 主 Webhook Handler ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // 1. 讀取 body（必須是原始 string 才能驗證簽章）
  const rawBody = await req.text()
  const signature = req.headers.get(SIGNATURE_HEADER_NAME) ?? ''
  const secret = process.env.SANITY_WEBHOOK_SECRET ?? ''

  // 2. 驗證 Sanity 簽章（跳過測試端點：secret 為空時允許本地測試）
  if (secret && !(await isValidSignature(rawBody, signature, secret))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const type = payload._type as string
  const operation = (payload.operation ?? payload._operation ?? 'create') as string

  // 只處理新增 / 更新，忽略刪除
  if (operation === 'delete') {
    return NextResponse.json({ ok: true, skipped: 'delete' })
  }

  // 只處理已知內容類型
  const SUPPORTED = ['dailyScripture', 'announcement', 'sundayMessage']
  if (!SUPPORTED.includes(type)) {
    return NextResponse.json({ ok: true, skipped: `unsupported type: ${type}` })
  }

  // 3. 取得訂閱者列表 + 合併管理者
  let subscribers: Subscriber[] = []
  try {
    subscribers = await fetchSubscribers()
  } catch (e) {
    console.error('取得訂閱者失敗:', e)
    // 仍繼續寄給管理者
  }

  // 管理者統一使用 zh-TW
  const adminRecipients: Subscriber[] = ADMIN_EMAILS.map(email => ({ email, locale: 'zh-TW' }))
  // 合併（去重：若管理者也在訂閱名單中，訂閱名單已有 locale 設定，以訂閱設定為主）
  const subscriberEmails = new Set(subscribers.map(s => s.email))
  const allRecipients: Subscriber[] = [
    ...subscribers,
    ...adminRecipients.filter(a => !subscriberEmails.has(a.email)),
  ]

  if (allRecipients.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, skipped: 'no recipients' })
  }

  // 4. 建立 Transporter
  let transporter: Transporter
  try {
    transporter = buildTransporter()
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })
  }

  // 5. 依內容類型寄信
  let results = { sent: 0, failed: 0 }

  if (type === 'dailyScripture') {
    const date = (payload.date ?? payload._updatedAt ?? new Date().toISOString().slice(0, 10)) as string
    results = await sendBulk(transporter, allRecipients, (locale) => ({
      subject: dailyScriptureSubject(locale, date),
      html:    dailyScriptureHtml(locale, date),
    }))
  }

  else if (type === 'announcement') {
    const titleZh = (payload.titleZh ?? '') as string
    const titleEn = (payload.titleEn ?? titleZh) as string
    const contentZh = payload.contentZh as string | undefined
    const contentEn = payload.contentEn as string | undefined
    const link      = payload.link as string | undefined

    results = await sendBulk(transporter, allRecipients, (locale) => {
      const title   = locale === 'en' ? titleEn : titleZh
      const content = locale === 'en' ? (contentEn ?? contentZh) : contentZh
      return {
        subject: announcementSubject(locale, title),
        html:    announcementHtml(locale, title, content, link),
      }
    })
  }

  else if (type === 'sundayMessage') {
    const title      = (payload.title ?? '') as string
    const preacher   = (payload.preacher ?? '') as string
    const date       = (payload.date ?? new Date().toISOString().slice(0, 10)) as string
    const scripture  = payload.scripture as string | undefined
    const summary    = payload.summary as string | undefined
    const youtubeUrl = payload.youtubeUrl as string | undefined

    results = await sendBulk(transporter, allRecipients, (locale) => ({
      subject: sundayMessageSubject(locale, title),
      html:    sundayMessageHtml(locale, title, preacher, date, scripture, summary, youtubeUrl),
    }))
  }

  // 6. 寄送管理員作業報告（彙整，只寄一封給 ADMIN_EMAILS）
  if (ADMIN_EMAILS.length > 0) {
    const reportSubject = `【寄信報告】${type} — 成功 ${results.sent} 封，失敗 ${results.failed} 封`
    const reportHtml = `
<div style="font-family:Arial,sans-serif;max-width:540px;margin:auto;padding:24px;background:#f9f4f5;border-radius:12px;">
  <h2 style="color:#380a14;margin:0 0 16px;">📬 訂閱通知寄送報告</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:8px 0;color:#666;width:120px;">內容類型</td><td style="font-weight:600;">${type}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">操作</td><td>${operation}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">訂閱人數</td><td>${subscribers.length}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">管理者人數</td><td>${adminRecipients.length}</td></tr>
    <tr><td style="padding:8px 0;color:#666;">成功寄出</td><td style="color:#166534;font-weight:700;">${results.sent} 封</td></tr>
    <tr><td style="padding:8px 0;color:#666;">失敗</td><td style="color:${results.failed > 0 ? '#dc2626' : '#aaa'};font-weight:700;">${results.failed} 封</td></tr>
    <tr><td style="padding:8px 0;color:#666;">時間</td><td>${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}</td></tr>
  </table>
</div>`

    await transporter.sendMail({
      from:    `"榮耀堂系統" <${process.env.GMAIL_USER}>`,
      to:      ADMIN_EMAILS.join(','),
      subject: reportSubject,
      html:    reportHtml,
    }).catch((e: unknown) => console.error('作業報告寄送失敗:', e))
  }

  return NextResponse.json({
    ok: true,
    type,
    operation,
    subscribers: subscribers.length,
    admins: adminRecipients.length,
    sent: results.sent,
    failed: results.failed,
  })
}
