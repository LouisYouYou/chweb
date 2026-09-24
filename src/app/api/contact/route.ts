import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: '欄位不完整' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    const html = `
<!DOCTYPE html>
<html lang="zh-TW">
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#380a14 0%,#76192a 50%,#92202f 100%);padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;color:#f6c8cd;font-size:12px;letter-spacing:1px;text-transform:uppercase;">行道會南勢角榮耀堂</p>
                  <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:700;">📩 新訊息通知</h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0">

              <!-- 姓名 -->
              <tr style="border-bottom:1px solid #f3e8ea;">
                <td width="120" style="padding:18px 24px;background:#fdf3f4;font-size:13px;font-weight:700;color:#380a14;vertical-align:top;">
                  👤 姓名
                </td>
                <td style="padding:18px 24px;font-size:14px;color:#1a1a1a;">
                  ${name}
                </td>
              </tr>

              <!-- 電子郵件 -->
              <tr style="border-bottom:1px solid #f3e8ea;">
                <td width="120" style="padding:18px 24px;background:#fdf3f4;font-size:13px;font-weight:700;color:#380a14;vertical-align:top;">
                  ✉️ 電子郵件
                </td>
                <td style="padding:18px 24px;font-size:14px;color:#1a1a1a;">
                  <a href="mailto:${email}" style="color:#92202f;text-decoration:none;font-weight:600;">${email}</a>
                  <br><span style="font-size:12px;color:#999;">（直接回覆此郵件即可回覆對方）</span>
                </td>
              </tr>

              <!-- 主旨 -->
              <tr style="border-bottom:1px solid #f3e8ea;">
                <td width="120" style="padding:18px 24px;background:#fdf3f4;font-size:13px;font-weight:700;color:#380a14;vertical-align:top;">
                  📌 主旨
                </td>
                <td style="padding:18px 24px;font-size:14px;color:#1a1a1a;font-weight:600;">
                  ${subject}
                </td>
              </tr>

              <!-- 訊息內容 -->
              <tr>
                <td width="120" style="padding:18px 24px;background:#fdf3f4;font-size:13px;font-weight:700;color:#380a14;vertical-align:top;">
                  💬 訊息內容
                </td>
                <td style="padding:18px 24px;font-size:14px;color:#1a1a1a;line-height:1.8;white-space:pre-wrap;">
                  ${message}
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9f4f5;padding:16px 24px;border-top:1px solid #f3e8ea;">
            <p style="margin:0;font-size:12px;color:#aaa;text-align:center;">
              此郵件由 <a href="https://nanshijiaoglory.vercel.app" style="color:#92202f;text-decoration:none;">nanshijiaoglory.vercel.app</a> 聯絡表單自動發送
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`

    await transporter.sendMail({
      from: `"榮耀堂官網" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: `"${name}" <${email}>`,
      subject: `【榮耀堂官網訊息】${subject}`,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('sendMail error', err)
    return NextResponse.json({ error: '傳送失敗，請稍後再試' }, { status: 500 })
  }
}
