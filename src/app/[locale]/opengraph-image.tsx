import { ImageResponse } from 'next/og'
import { getLatestSundayMessage } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'

export const runtime = 'nodejs'
export const revalidate = 300
export const alt = '行道會南勢角榮耀堂 Glory Church Of Nanshijiao'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const WINE_BG = 'linear-gradient(135deg, #5C1020 0%, #7A1D34 45%, #9B2645 100%)'
const GOLD = '#D4A843'

function formatDate(date: string, locale: string): string {
  const [y, m, d] = date.split('-')
  return locale === 'zh-TW'
    ? `${y} 年 ${parseInt(m)} 月 ${parseInt(d)} 日`
    : `${y}.${m}.${d}`
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const msg = await getLatestSundayMessage()

  // ── No Sunday message: generic church card ─────────────────────────────────
  if (!msg) {
    const subtitles: Record<string, string> = {
      'zh-TW': '主日崇拜 每週日 10:00 AM ｜ 新北市中和區忠孝街39-15號',
      'en':    'Sunday Worship 10:00 AM ｜ No.39-15 Zhongxiao St., Zhonghe',
      'my':    'တနင်္ဂနွေ ဝတ်ပြုကိုးကွယ်ချိန် ၁၀:၀၀ AM ｜ နယူးတိုင်းပေ',
    }
    return new ImageResponse(
      <div style={{ background: WINE_BG, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '70px 80px', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', width: 120, height: 4, background: GOLD, marginBottom: 40, borderRadius: 2 }} />
        <div style={{ display: 'flex', fontSize: 68, fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: 12 }}>行道會南勢角榮耀堂</div>
        <div style={{ display: 'flex', fontSize: 32, fontWeight: 600, color: '#F5D27A', letterSpacing: '0.08em', marginBottom: 40 }}>Glory Church Of Nanshijiao</div>
        <div style={{ display: 'flex', width: 80, height: 3, background: GOLD, marginBottom: 36, borderRadius: 2 }} />
        <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.80)', textAlign: 'center', lineHeight: 1.6 }}>
          {subtitles[locale] ?? subtitles['zh-TW']}
        </div>
        <div style={{ display: 'flex', position: 'absolute', bottom: 40, right: 60, fontSize: 18, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
          nanshijiaoglory.vercel.app
        </div>
      </div>,
      { ...size }
    )
  }

  const dateLabel = formatDate(msg.date, locale)
  const titleSize = msg.title.length > 14 ? 38 : msg.title.length > 10 ? 44 : 52

  const msgImageUrl = msg.image
    ? urlFor(msg.image).width(660).height(630).fit('crop').auto('format').url()
    : null

  // ── Has image: split layout ────────────────────────────────────────────────
  if (msgImageUrl) {
    return new ImageResponse(
      <div style={{ background: WINE_BG, width: '100%', height: '100%', display: 'flex', fontFamily: 'sans-serif' }}>
        {/* Left: message image with right-edge fade */}
        <div style={{ display: 'flex', width: '55%', height: '100%', flexShrink: 0, position: 'relative' }}>
          <img src={msgImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            display: 'flex',
            position: 'absolute', top: 0, right: 0, bottom: 0,
            width: '55%',
            background: 'linear-gradient(to right, transparent, #7A1D34)',
          }} />
        </div>

        {/* Right: text panel */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1, padding: '50px 56px 50px 20px' }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', fontSize: 15, color: GOLD, letterSpacing: '0.18em', marginBottom: 14 }}>
            本 週 主 日 信 息
          </div>
          {/* Gold accent */}
          <div style={{ display: 'flex', width: 40, height: 3, background: GOLD, borderRadius: 2, marginBottom: 20 }} />
          {/* Title */}
          <div style={{ display: 'flex', fontSize: titleSize, fontWeight: 900, color: '#fff', lineHeight: 1.35, marginBottom: 22 }}>
            {msg.title}
          </div>
          {/* Preacher */}
          <div style={{ display: 'flex', fontSize: 20, color: 'rgba(255,255,255,0.85)', marginBottom: 8 }}>
            {msg.preacher}
          </div>
          {/* Scripture */}
          {msg.scripture ? (
            <div style={{ display: 'flex', fontSize: 17, color: 'rgba(255,255,255,0.60)' }}>
              {msg.scripture}
            </div>
          ) : null}
          {/* Date */}
          <div style={{ display: 'flex', fontSize: 14, color: 'rgba(255,255,255,0.38)', marginTop: 14 }}>
            {dateLabel}
          </div>
          {/* Church name pushed to bottom */}
          <div style={{ display: 'flex', flexGrow: 1 }} />
          <div style={{ display: 'flex', fontSize: 13, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.05em' }}>
            行道會南勢角榮耀堂
          </div>
        </div>
      </div>,
      { ...size }
    )
  }

  // ── Has message but no image: centred text card ────────────────────────────
  return new ImageResponse(
    <div style={{ background: WINE_BG, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 80px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', width: 80, height: 4, background: GOLD, borderRadius: 2, marginBottom: 28 }} />
      <div style={{ display: 'flex', fontSize: 18, color: GOLD, letterSpacing: '0.2em', marginBottom: 28 }}>本 週 主 日 信 息</div>
      <div style={{ display: 'flex', fontSize: 58, fontWeight: 900, color: '#fff', lineHeight: 1.3, marginBottom: 24, textAlign: 'center' }}>
        {msg.title}
      </div>
      <div style={{ display: 'flex', fontSize: 26, color: 'rgba(255,255,255,0.8)' }}>
        {msg.preacher}{msg.scripture ? ` ｜ ${msg.scripture}` : ''}
      </div>
      <div style={{ display: 'flex', fontSize: 18, color: 'rgba(255,255,255,0.45)', marginTop: 16 }}>
        {dateLabel}
      </div>
      <div style={{ display: 'flex', width: 60, height: 3, background: GOLD, borderRadius: 2, marginTop: 32, marginBottom: 24 }} />
      <div style={{ display: 'flex', fontSize: 20, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
        行道會南勢角榮耀堂
      </div>
    </div>,
    { ...size }
  )
}
