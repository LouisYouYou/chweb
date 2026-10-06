const BASE = 'https://nanshijiaoglory.vercel.app'

const HEADER_STYLE = `background:linear-gradient(135deg,#380a14 0%,#76192a 50%,#92202f 100%);padding:36px 32px;border-radius:12px 12px 0 0;text-align:center;`
const FOOTER_STYLE = `padding:16px 32px;background:#f9f4f5;border-top:1px solid #f3e8ea;text-align:center;`
const BODY_STYLE   = `background:#fff;padding:28px 32px;border:1px solid #f0e0e3;border-top:none;border-radius:0 0 12px 12px;`

function shell(inner: string, unsubNote: string) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,'Noto Sans TC',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
<tr><td align="center">
<table width="600" style="max-width:600px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08);">
${inner}
<tr><td style="${FOOTER_STYLE}">
  <p style="margin:0 0 6px;font-size:12px;color:#aaa;">${unsubNote}</p>
  <p style="margin:0;font-size:11px;color:#ccc;">行道會南勢角榮耀堂 · Glory Church Of Nanshijiao</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

// ── 每日經文 ─────────────────────────────────────────────────────────────────

export function dailyScriptureHtml(locale: string, date: string): string {
  const pageUrl = `${BASE}/${locale}/daily-scripture`
  const fmt = new Date(date).toLocaleDateString(
    locale === 'zh-TW' ? 'zh-TW' : locale === 'ja' ? 'ja-JP' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Taipei' }
  )

  const t = {
    subject:  locale === 'en' ? `📖 Daily Scripture ${fmt}` : locale === 'my' ? `📖 နေ့စဉ်သမ္မာကျမ်း ${fmt}` : locale === 'ja' ? `📖 今日のみことば ${fmt}` : `📖 每日經文 ${fmt}`,
    title:    locale === 'en' ? 'New Daily Scripture' : locale === 'my' ? 'နေ့စဉ်သမ္မာကျမ်း အသစ်' : locale === 'ja' ? '今日のみことばが更新されました' : `每日經文已更新`,
    body:     locale === 'en' ? `Today's scripture (${fmt}) has been published. Click below to read and meditate.` : locale === 'my' ? `ယနေ့ (${fmt}) သမ္မာကျမ်းစာ ထုတ်ဝေပြီးပါပြီ။` : locale === 'ja' ? `${fmt}のみことばが公開されました。下のボタンから読むことができます。` : `${fmt} 的每日經文已上傳，點擊下方按鈕閱讀今日靈修。`,
    cta:      locale === 'en' ? 'Read Scripture' : locale === 'my' ? 'ကျမ်းစာ ဖတ်ရန်' : locale === 'ja' ? 'みことばを読む' : '閱讀今日經文',
    unsub:    locale === 'en' ? 'You are receiving this because you subscribed to Glory Church updates.' : locale === 'ja' ? 'このメールは南勢角榮耀堂のニュースレターに登録したため送信されました。' : '您收到此信是因為您訂閱了行道會南勢角榮耀堂的最新資訊。',
  }

  const inner = `
<tr><td style="${HEADER_STYLE}">
  <p style="margin:0;color:#f6c8cd;font-size:12px;letter-spacing:2px;">GLORY CHURCH OF NANSHIJIAO</p>
  <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700;">${t.title}</h1>
  <p style="margin:6px 0 0;color:#f6c8cd;font-size:13px;">${fmt}</p>
</td></tr>
<tr><td style="${BODY_STYLE}">
  <p style="color:#333;font-size:15px;line-height:1.8;margin:0 0 24px;">${t.body}</p>
  <div style="text-align:center;">
    <a href="${pageUrl}" style="display:inline-block;background:linear-gradient(135deg,#380a14,#92202f);color:#fff;padding:13px 32px;border-radius:9999px;text-decoration:none;font-weight:700;font-size:14px;">${t.cta}</a>
  </div>
</td></tr>`

  return shell(inner, t.unsub)
}

export function dailyScriptureSubject(locale: string, date: string): string {
  const fmt = date.replace(/-/g, '/')
  if (locale === 'en')    return `📖 Daily Scripture ${fmt}`
  if (locale === 'my')    return `📖 နေ့စဉ်သမ္မာကျမ်း ${fmt}`
  if (locale === 'ja')    return `📖 今日のみことば ${fmt}`
  return `📖 每日經文 ${fmt} — 行道會南勢角榮耀堂`
}

// ── 公告 ─────────────────────────────────────────────────────────────────────

export function announcementHtml(
  locale: string,
  title: string,
  content: string | undefined,
  link: string | undefined,
): string {
  const pageUrl = link ?? `${BASE}/${locale}`
  const t = {
    badge: locale === 'en' ? 'New Announcement' : locale === 'my' ? 'ကြေငြာချက်အသစ်' : locale === 'ja' ? '新しいお知らせ' : '最新公告',
    cta:   locale === 'en' ? 'Read More' : locale === 'my' ? 'ဆက်ဖတ်ရန်' : locale === 'ja' ? '詳しく見る' : '查看詳情',
    unsub: locale === 'en' ? 'You are receiving this because you subscribed to Glory Church updates.' : locale === 'ja' ? 'このメールは南勢角榮耀堂のニュースレターに登録したため送信されました。' : '您收到此信是因為您訂閱了行道會南勢角榮耀堂的最新資訊。',
  }

  const inner = `
<tr><td style="${HEADER_STYLE}">
  <p style="margin:0;color:#f6c8cd;font-size:12px;letter-spacing:2px;">GLORY CHURCH OF NANSHIJIAO</p>
  <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700;">📢 ${t.badge}</h1>
</td></tr>
<tr><td style="${BODY_STYLE}">
  <h2 style="margin:0 0 12px;color:#380a14;font-size:18px;line-height:1.4;">${title}</h2>
  ${content ? `<p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 24px;white-space:pre-line;">${content}</p>` : ''}
  <div style="text-align:center;">
    <a href="${pageUrl}" style="display:inline-block;background:linear-gradient(135deg,#380a14,#92202f);color:#fff;padding:13px 32px;border-radius:9999px;text-decoration:none;font-weight:700;font-size:14px;">${t.cta}</a>
  </div>
</td></tr>`

  return shell(inner, t.unsub)
}

export function announcementSubject(locale: string, title: string): string {
  if (locale === 'en') return `📢 ${title} — Glory Church`
  if (locale === 'ja') return `📢 ${title} — 行道会南勢角栄光教会`
  return `📢 ${title} — 行道會南勢角榮耀堂`
}

// ── 主日訊息 ─────────────────────────────────────────────────────────────────

export function sundayMessageHtml(
  locale: string,
  title: string,
  preacher: string,
  date: string,
  scripture: string | undefined,
  summary: string | undefined,
  youtubeUrl: string | undefined,
): string {
  const pageUrl = `${BASE}/${locale}`
  const fmt = new Date(date).toLocaleDateString(
    locale === 'zh-TW' ? 'zh-TW' : locale === 'ja' ? 'ja-JP' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Taipei' }
  )
  const t = {
    badge:   locale === 'en' ? 'Sunday Message' : locale === 'ja' ? '主日メッセージ' : '主日訊息',
    preacher:locale === 'en' ? 'Preacher' : locale === 'ja' ? '説教者' : '講員',
    passage: locale === 'en' ? 'Scripture' : locale === 'ja' ? '聖書箇所' : '經文',
    watch:   locale === 'en' ? 'Watch on YouTube' : locale === 'ja' ? 'YouTubeで視聴' : '前往 YouTube 觀看',
    more:    locale === 'en' ? 'View Message' : locale === 'ja' ? 'メッセージを見る' : '查看本週訊息',
    unsub:   locale === 'en' ? 'You are receiving this because you subscribed to Glory Church updates.' : locale === 'ja' ? 'このメールは南勢角榮耀堂のニュースレターに登録したため送信されました。' : '您收到此信是因為您訂閱了行道會南勢角榮耀堂的最新資訊。',
  }

  const inner = `
<tr><td style="${HEADER_STYLE}">
  <p style="margin:0;color:#f6c8cd;font-size:12px;letter-spacing:2px;">${fmt}</p>
  <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700;">✝️ ${t.badge}</h1>
</td></tr>
<tr><td style="${BODY_STYLE}">
  <h2 style="margin:0 0 16px;color:#380a14;font-size:20px;line-height:1.4;">${title}</h2>
  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
    <tr>
      <td style="padding:8px 0;color:#888;font-size:13px;width:80px;">${t.preacher}</td>
      <td style="padding:8px 0;font-weight:600;font-size:14px;color:#333;">${preacher}</td>
    </tr>
    ${scripture ? `<tr>
      <td style="padding:8px 0;color:#888;font-size:13px;">${t.passage}</td>
      <td style="padding:8px 0;font-size:14px;color:#555;">${scripture}</td>
    </tr>` : ''}
  </table>
  ${summary ? `<p style="color:#555;font-size:14px;line-height:1.8;margin:0 0 24px;padding:16px;background:#fdf8f8;border-left:3px solid #92202f;border-radius:0 8px 8px 0;">${summary}</p>` : ''}
  <div style="text-align:center;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
    ${youtubeUrl ? `<a href="${youtubeUrl}" style="display:inline-block;background:#ff0000;color:#fff;padding:12px 24px;border-radius:9999px;text-decoration:none;font-weight:700;font-size:13px;">▶ ${t.watch}</a>` : ''}
    <a href="${pageUrl}" style="display:inline-block;background:linear-gradient(135deg,#380a14,#92202f);color:#fff;padding:12px 24px;border-radius:9999px;text-decoration:none;font-weight:700;font-size:13px;">${t.more}</a>
  </div>
</td></tr>`

  return shell(inner, t.unsub)
}

export function sundayMessageSubject(locale: string, title: string): string {
  if (locale === 'en') return `✝️ Sunday Message: ${title}`
  if (locale === 'ja') return `✝️ 主日メッセージ：${title}`
  return `✝️ 本週主日訊息：${title} — 行道會南勢角榮耀堂`
}
