import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = '行道會南勢角榮耀堂 Glory Church Of Nanshijiao'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const SUBTITLES: Record<string, string> = {
  'zh-TW': '主日崇拜 每週日 10:00 AM ｜ 新北市中和區忠孝街39-15號',
  'en':    'Sunday Worship 10:00 AM ｜ No.39-15 Zhongxiao St., Zhonghe, New Taipei',
  'my':    'တနင်္ဂနွေ ဝတ်ပြုကိုးကွယ်ချိန် ၁၀:၀၀ AM ｜ နယူးတိုင်းပေ',
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const subtitle = SUBTITLES[locale] ?? SUBTITLES['zh-TW']

  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #5C1020 0%, #7A1D34 45%, #9B2645 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '70px 80px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Gold top bar */}
      <div style={{ display: 'flex', width: '120px', height: '4px', background: '#D4A843', marginBottom: '40px', borderRadius: '2px' }} />

      {/* Church name ZH */}
      <div style={{ display: 'flex', fontSize: 72, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px', marginBottom: '12px', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
        行道會南勢角榮耀堂
      </div>

      {/* Church name EN */}
      <div style={{ display: 'flex', fontSize: 34, fontWeight: 600, color: '#F5D27A', letterSpacing: '0.08em', marginBottom: '40px' }}>
        Glory Church Of Nanshijiao
      </div>

      {/* Gold bar */}
      <div style={{ display: 'flex', width: '80px', height: '3px', background: '#D4A843', marginBottom: '36px', borderRadius: '2px' }} />

      {/* Subtitle */}
      <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.80)', textAlign: 'center', lineHeight: 1.6 }}>
        {subtitle}
      </div>

      {/* Bottom domain */}
      <div style={{ display: 'flex', position: 'absolute', bottom: '40px', right: '60px', fontSize: 18, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
        nanshijiaoglory.vercel.app
      </div>
    </div>,
    { ...size }
  )
}
