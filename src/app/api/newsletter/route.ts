import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import nodemailer from 'nodemailer'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!rateLimit(ip, 3, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'too_many_requests' }, { status: 429 })
  }

  const { email, locale = 'zh-TW' } = await req.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email, locale })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'already_subscribed' }, { status: 409 })
    }
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'db_error' }, { status: 500 })
  }

  await sendEmails(email, locale).catch(console.error)

  return NextResponse.json({ ok: true })
}

async function sendEmails(email: string, locale: string) {
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD
  if (!gmailUser || !gmailPass) return

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass },
  })

  const subject =
    locale === 'my'
      ? 'ကျေးဇူးတင်ပါသည် — နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း'
      : locale === 'en'
      ? 'Thank you for subscribing — Glory Church Of Nanshijiao'
      : locale === 'ja'
      ? 'ご購読ありがとうございます — 行道会南勢角栄光教会'
      : '感謝訂閱 — 行道會南勢角榮耀堂'

  await transporter.sendMail({
    from: `"行道會南勢角榮耀堂" <${gmailUser}>`,
    to: email,
    subject,
    html: welcomeHtml(locale),
  })

  await transporter.sendMail({
    from: `"榮耀堂官網" <${gmailUser}>`,
    to: gmailUser,
    subject: `【新訂閱者】${email}`,
    text: `新訂閱者：${email}\n語言：${locale}\n時間：${new Date().toLocaleString('zh-TW')}`,
  })
}

function welcomeHtml(locale: string) {
  const content =
    locale === 'en'
      ? {
          greeting: 'Thank you for subscribing!',
          body: "You'll receive weekly updates including Sunday service announcements, upcoming events, and church news.",
          cta: 'Visit Our Website',
          unsub: 'If you did not subscribe, please ignore this email.',
        }
      : locale === 'my'
      ? {
          greeting: 'မှတ်ပုံတင်သည့်အတွက် ကျေးဇူးတင်ပါသည်！',
          body: 'အပတ်စဉ် တနင်္ဂနွေ ဝတ်ပြုကိုးကွယ်မှု ကြေညာချက်များ၊ ကျင်းပမည့် ပွဲများနှင့် ဘုရားကျောင်း သတင်းများ ရရှိမည်ဖြစ်သည်။',
          cta: 'ဝဘ်ဆိုက်သွားရန်',
          unsub: 'သင်မှတ်ပုံမတင်ပါက ဤအီးမေးကို လျစ်လျူရှုပါ။',
        }
      : locale === 'ja'
      ? {
          greeting: 'ご購読ありがとうございます！',
          body: '毎週の主日礼拝のお知らせ、近日のイベント情報、教会の最新ニュースをお届けします。',
          cta: '公式サイトへ',
          unsub: 'このメールに心当たりがない場合は、無視してください。',
        }
      : {
          greeting: '感謝您的訂閱！',
          body: '您將定期收到每週主日聚會公告、近期活動資訊及教會重要消息。',
          cta: '前往官方網站',
          unsub: '如果您沒有訂閱此服務，請忽略此郵件。',
        }

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="600" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#380a14 0%,#76192a 50%,#92202f 100%);padding:36px 32px;text-align:center;">
            <p style="margin:0;color:#f6c8cd;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Glory Church Of Nanshijiao</p>
            <h1 style="margin:8px 0 0;color:#fff;font-size:24px;font-weight:700;">🙏 ${content.greeting}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 24px;">
            <p style="color:#333;font-size:15px;line-height:1.8;margin:0 0 24px;">${content.body}</p>
            <div style="text-align:center;">
              <a href="https://nanshijiaoglory.vercel.app" style="display:inline-block;background:linear-gradient(135deg,#380a14,#92202f);color:#fff;padding:13px 32px;border-radius:9999px;text-decoration:none;font-weight:700;font-size:14px;">${content.cta}</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;background:#f9f4f5;border-top:1px solid #f3e8ea;text-align:center;">
            <p style="margin:0;font-size:12px;color:#aaa;">${content.unsub}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
