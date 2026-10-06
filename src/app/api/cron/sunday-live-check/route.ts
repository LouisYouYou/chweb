import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const CHANNEL_ID    = 'UCjZ3SAhHJ7-gVgZcMk0TFFw'
const UPLOADS_PL    = 'UU' + CHANNEL_ID.slice(2)
const YOUTUBE_URL   = `https://www.youtube.com/@winson651202/live`
const SERVICE_TIME  = '10:00 AM'

// ── 直播狀態偵測 ────────────────────────────────────────────────────────────
async function checkLiveStatus(): Promise<{ isLive: boolean; videoId: string | null; error?: string }> {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return { isLive: false, videoId: null, error: 'YOUTUBE_API_KEY 未設定' }

  try {
    const plRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${UPLOADS_PL}&part=snippet&maxResults=5`
    )
    if (!plRes.ok) return { isLive: false, videoId: null, error: `Playlist API ${plRes.status}` }
    const plData = await plRes.json()
    if (!plData.items?.length) return { isLive: false, videoId: null }

    const ids = plData.items.map((i: { snippet: { resourceId: { videoId: string } } }) => i.snippet.resourceId.videoId).join(',')

    const vRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${ids}&part=snippet&fields=items(id,snippet/liveBroadcastContent)`
    )
    if (!vRes.ok) return { isLive: false, videoId: null, error: `Videos API ${vRes.status}` }
    const vData = await vRes.json()

    const live = vData.items?.find((v: { snippet: { liveBroadcastContent: string }; id: string }) => v.snippet.liveBroadcastContent === 'live')
    return { isLive: !!live, videoId: live?.id ?? null }
  } catch (e) {
    return { isLive: false, videoId: null, error: String(e) }
  }
}

// ── Email 模板 ───────────────────────────────────────────────────────────────
function buildEmail(isLive: boolean, videoId: string | null, error?: string) {
  const now = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
  const videoLink = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : YOUTUBE_URL

  if (isLive) {
    return {
      subject: `✅ 主日直播正常啟動 — ${now}`,
      html: `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;">
  <div style="background:linear-gradient(135deg,#380a14,#92202f);padding:28px 32px;border-radius:12px 12px 0 0;">
    <h1 style="color:#fff;margin:0;font-size:22px;">✅ 主日直播正常啟動</h1>
    <p style="color:#f6c8cd;margin:6px 0 0;font-size:13px;">行道會南勢角榮耀堂 自動監控報告</p>
  </div>
  <div style="background:#fff;padding:28px 32px;border:1px solid #f0e0e3;border-top:none;border-radius:0 0 12px 12px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:10px 0;color:#666;font-size:13px;width:100px;">偵測時間</td>
        <td style="padding:10px 0;font-weight:600;font-size:14px;">${now}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#666;font-size:13px;">直播狀態</td>
        <td style="padding:10px 0;"><span style="background:#dcfce7;color:#166534;padding:3px 10px;border-radius:99px;font-size:13px;font-weight:700;">🔴 直播中</span></td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#666;font-size:13px;">聚會時間</td>
        <td style="padding:10px 0;font-weight:600;font-size:14px;">${SERVICE_TIME}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#666;font-size:13px;">直播連結</td>
        <td style="padding:10px 0;">
          <a href="${videoLink}" style="color:#92202f;font-size:14px;">${videoLink}</a>
        </td>
      </tr>
    </table>
    <div style="margin-top:20px;text-align:center;">
      <a href="${videoLink}" style="display:inline-block;background:#92202f;color:#fff;padding:12px 28px;border-radius:99px;text-decoration:none;font-weight:700;font-size:14px;">
        觀看直播
      </a>
    </div>
  </div>
  <p style="text-align:center;color:#aaa;font-size:11px;margin-top:12px;">此為系統自動發送，每週日 09:30 執行</p>
</div>`,
    }
  }

  return {
    subject: `⚠️ 主日直播尚未開始 — ${now}`,
    html: `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;">
  <div style="background:linear-gradient(135deg,#92400e,#b45309);padding:28px 32px;border-radius:12px 12px 0 0;">
    <h1 style="color:#fff;margin:0;font-size:22px;">⚠️ 主日直播尚未開始</h1>
    <p style="color:#fde68a;margin:6px 0 0;font-size:13px;">行道會南勢角榮耀堂 自動監控報告</p>
  </div>
  <div style="background:#fff;padding:28px 32px;border:1px solid #fde68a;border-top:none;border-radius:0 0 12px 12px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:10px 0;color:#666;font-size:13px;width:100px;">偵測時間</td>
        <td style="padding:10px 0;font-weight:600;font-size:14px;">${now}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#666;font-size:13px;">直播狀態</td>
        <td style="padding:10px 0;"><span style="background:#fef3c7;color:#92400e;padding:3px 10px;border-radius:99px;font-size:13px;font-weight:700;">⏸ 尚未開始</span></td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#666;font-size:13px;">聚會時間</td>
        <td style="padding:10px 0;font-weight:600;font-size:14px;">${SERVICE_TIME}（距離開始還有約 30 分鐘）</td>
      </tr>
      ${error ? `<tr><td style="padding:10px 0;color:#666;font-size:13px;">錯誤訊息</td><td style="padding:10px 0;color:#dc2626;font-size:13px;">${error}</td></tr>` : ''}
    </table>
    <div style="margin-top:20px;padding:16px;background:#fef3c7;border-radius:10px;border-left:4px solid #f59e0b;">
      <p style="margin:0;font-size:13px;color:#92400e;font-weight:600;">請確認以下事項：</p>
      <ul style="margin:8px 0 0;padding-left:18px;font-size:13px;color:#78350f;line-height:1.8;">
        <li>YouTube Studio 直播已啟動</li>
        <li>OBS 或直播軟體已連線</li>
        <li>網路連線正常</li>
      </ul>
    </div>
    <div style="margin-top:20px;text-align:center;">
      <a href="https://studio.youtube.com" style="display:inline-block;background:#b45309;color:#fff;padding:12px 28px;border-radius:99px;text-decoration:none;font-weight:700;font-size:14px;">
        開啟 YouTube Studio
      </a>
    </div>
  </div>
  <p style="text-align:center;color:#aaa;font-size:11px;margin-top:12px;">此為系統自動發送，每週日 09:30 執行</p>
</div>`,
  }
}

// ── Cron Handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Vercel Cron 驗證
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { isLive, videoId, error } = await checkLiveStatus()
  const { subject, html } = buildEmail(isLive, videoId, error)

  // 寄送報告郵件
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    })
    await transporter.sendMail({
      from: `"榮耀堂系統監控" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject,
      html,
    })
  }

  return NextResponse.json({
    ok: true,
    isLive,
    videoId,
    timestamp: new Date().toISOString(),
    emailSent: !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD),
    error: error ?? null,
  })
}
