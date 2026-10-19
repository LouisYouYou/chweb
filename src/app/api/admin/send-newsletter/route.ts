import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const { password, subject, body } = await req.json()

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }

  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD
  if (!gmailUser || !gmailPass) {
    return NextResponse.json({ error: 'gmail_not_configured' }, { status: 500 })
  }

  const supabase = createAdminClient()
  const { data: subscribers, error } = await supabase
    .from('newsletter_subscribers')
    .select('email, locale')

  if (error) {
    console.error('Supabase fetch error:', error)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0 })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass },
  })

  let sent = 0
  let failed = 0

  for (const sub of subscribers) {
    try {
      await transporter.sendMail({
        from: `"行道會南勢角榮耀堂" <${gmailUser}>`,
        to: sub.email,
        subject,
        html: newsletterHtml(subject, body, sub.email),
      })
      sent++
    } catch (err) {
      console.error(`Failed to send to ${sub.email}:`, err)
      failed++
    }
  }

  return NextResponse.json({ sent, failed, total: subscribers.length })
}

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get('password')
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { count, error } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })

  if (error) return NextResponse.json({ error: 'db_error' }, { status: 500 })
  return NextResponse.json({ count: count ?? 0 })
}

function newsletterHtml(subject: string, body: string, email: string) {
  const bodyHtml = body
    .split('\n')
    .map((line) =>
      line.trim() === ''
        ? '<br>'
        : `<p style="margin:0 0 14px;color:#333;font-size:15px;line-height:1.8;">${line}</p>`
    )
    .join('')

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="600" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#380a14 0%,#76192a 50%,#92202f 100%);padding:36px 32px;text-align:center;">
            <p style="margin:0 0 6px;color:#f6c8cd;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Glory Church Of Nanshijiao</p>
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;line-height:1.4;">${subject}</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 32px 8px;">
            ${bodyHtml}
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:16px 32px 32px;text-align:center;">
            <a href="https://nanshijiaoglory.vercel.app"
               style="display:inline-block;background:linear-gradient(135deg,#380a14,#92202f);color:#fff;padding:13px 32px;border-radius:9999px;text-decoration:none;font-weight:700;font-size:14px;">
              前往官方網站
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;background:#f9f4f5;border-top:1px solid #f3e8ea;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:#999;">行道會南勢角榮耀堂・新北市中和區忠孝街 39-15 號</p>
            <p style="margin:0;font-size:11px;color:#bbb;">
              您收到此信是因為您訂閱了教會電子報。
              如要取消訂閱，請回覆此信件。
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
