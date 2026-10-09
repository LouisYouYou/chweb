'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Heart, Send, Lock, Globe, EyeOff, Eye, User, X } from 'lucide-react'

interface Prayer {
  id: string
  user_id: string | null
  display_name: string | null
  content: string
  is_public: boolean
  prayer_count: number
  created_at: string
}

interface PrayerWallProps {
  initialPrayers: Prayer[]
  currentUserId: string | null
  locale: string
}

// ── Design tokens ────────────────────────────────────────────────────────────

const NOTE_STYLES = [
  { bg: '#fefca0', adhesive: '#f5d900', adhLight: '#fef44a', line: 'rgba(155,135,0,0.18)',  pin: '#9a7e00' },
  { bg: '#ffd5c8', adhesive: '#f08070', adhLight: '#f9b0a0', line: 'rgba(185,55,38,0.14)',  pin: '#c03020' },
  { bg: '#c5e8ff', adhesive: '#50b0f0', adhLight: '#88cdf8', line: 'rgba(12,95,185,0.13)',  pin: '#0868b0' },
  { bg: '#c8f5d4', adhesive: '#48c870', adhLight: '#78d898', line: 'rgba(12,125,42,0.13)',  pin: '#0c6828' },
  { bg: '#e8d4fa', adhesive: '#b870dc', adhLight: '#cc9ae8', line: 'rgba(95,12,165,0.13)',  pin: '#8018b0' },
  { bg: '#ffeec0', adhesive: '#ffc030', adhLight: '#ffd060', line: 'rgba(155,85,0,0.13)',   pin: '#a86800' },
]
const ROTATIONS = [-2.5, 1.2, -1.8, 2.2, 0.6, -1.5, 1.8, -2.8, 0.4, -1.0]
const ADHESIVE_H = 30

// SVG feTurbulence noise → paper grain texture
const PAPER_GRAIN = `url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'200'%20height%3D'200'%3E%3Cfilter%20id%3D'n'%3E%3CfeTurbulence%20type%3D'fractalNoise'%20baseFrequency%3D'0.75'%20numOctaves%3D'4'%20stitchTiles%3D'stitch'%2F%3E%3CfeColorMatrix%20type%3D'saturate'%20values%3D'0'%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D'200'%20height%3D'200'%20filter%3D'url(%23n)'%20opacity%3D'0.042'%2F%3E%3C%2Fsvg%3E")`

// Cork board texture
const CORK_GRAIN = `url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'120'%20height%3D'120'%3E%3Cfilter%20id%3D'c'%3E%3CfeTurbulence%20type%3D'fractalNoise'%20baseFrequency%3D'0.28%200.09'%20numOctaves%3D'4'%20stitchTiles%3D'stitch'%2F%3E%3CfeColorMatrix%20type%3D'saturate'%20values%3D'0.35'%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D'120'%20height%3D'120'%20filter%3D'url(%23c)'%20opacity%3D'0.18'%2F%3E%3C%2Fsvg%3E")`

function noteStyle(index: number) {
  return {
    s: NOTE_STYLES[index % NOTE_STYLES.length],
    deg: ROTATIONS[index % ROTATIONS.length],
  }
}

// ── Thumbtack component ───────────────────────────────────────────────────────

function Thumbtack({ color }: { color: string }) {
  return (
    <div className="absolute -top-[22px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none select-none">
      {/* Pin head with radial metallic sheen */}
      <div
        className="w-[18px] h-[18px] sm:w-5 sm:h-5 rounded-full relative"
        style={{
          background: `radial-gradient(circle at 36% 32%, #ffffff90, ${color}dd 45%, ${color} 80%)`,
          boxShadow: `0 2px 6px rgba(0,0,0,0.5), 0 0 0 1.5px rgba(0,0,0,0.14), inset 0 1px 2px rgba(255,255,255,0.3)`,
        }}
      >
        {/* Specular highlight */}
        <div
          className="absolute rounded-full"
          style={{ top: '3px', left: '4px', width: '6px', height: '4px', background: 'rgba(255,255,255,0.55)', filter: 'blur(1px)' }}
        />
      </div>
      {/* Needle */}
      <div
        className="w-[2px] h-[11px] rounded-b-full"
        style={{ background: `linear-gradient(to bottom, ${color}bb, rgba(60,40,20,0.55))` }}
      />
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function PrayerModal({ prayer, index, hasPrayed, zh, my, ja, onClose, onPray }: {
  prayer: Prayer; index: number; hasPrayed: boolean; zh: boolean; my: boolean; ja: boolean
  onClose: () => void; onPray: () => void
}) {
  const { s } = noteStyle(index >= 0 ? index : 0)
  const date = new Date(prayer.created_at).toLocaleDateString(
    zh ? 'zh-TW' : my ? 'my-MM' : ja ? 'ja-JP' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-[3px] overflow-hidden max-h-[88vh] overflow-y-auto"
        style={{
          background: s.bg,
          backgroundImage: `${PAPER_GRAIN}, repeating-linear-gradient(transparent, transparent 27px, ${s.line} 27px, ${s.line} 28px)`,
          backgroundPositionY: `${ADHESIVE_H + 10}px`,
          boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-0.5 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-black/20" />
        </div>

        {/* Adhesive strip */}
        <div style={{
          height: `${ADHESIVE_H}px`,
          background: `linear-gradient(to bottom, ${s.adhLight}, ${s.adhesive})`,
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(255,255,255,0.09) 5px, rgba(255,255,255,0.09) 6px)`,
        }} />

        <button
          onClick={onClose}
          className="absolute right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors z-10"
          style={{ top: `${ADHESIVE_H + 8}px` }}
        >
          <X size={18} />
        </button>

        {/* Red margin line */}
        <div className="absolute pointer-events-none"
          style={{ left: '38px', top: `${ADHESIVE_H}px`, bottom: '80px', width: '1px', background: 'rgba(210,45,45,0.22)' }} />

        <div className="pl-12 pr-6 pt-4 pb-8">
          <p className="text-base font-bold mb-0.5" style={{ color: s.pin }}>
            {prayer.display_name || (zh ? '匿名弟兄姊妹' : my ? 'အမည်မသိ ညီအကိုမောင်နှမ' : ja ? '匿名の兄弟姉妹' : 'Anonymous')}
          </p>
          <p className="text-xs text-gray-400 mb-5">{date}</p>

          <p className="text-[15px] leading-7 text-gray-800 whitespace-pre-wrap break-words mb-8">
            {prayer.content}
          </p>

          <button
            onClick={onPray}
            disabled={hasPrayed}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border transition-all ${
              hasPrayed
                ? 'border-rose-300 text-rose-600 bg-rose-50'
                : 'border-gray-300 text-gray-600 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 active:scale-95 disabled:cursor-default'
            }`}
          >
            <Heart size={16} className={hasPrayed ? 'fill-rose-500 text-rose-500' : ''} />
            {zh ? '我在禱告' : my ? 'ဆုတောင်းနေသည်' : ja ? 'お祈りしています' : 'Praying'}
            {prayer.prayer_count > 0 && (
              <span className="ml-0.5 text-xs bg-rose-100 text-rose-500 px-1.5 py-0.5 rounded-full">
                {prayer.prayer_count}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Note card ─────────────────────────────────────────────────────────────────

const NOTE_BODY_SHADOW = '4px 7px 18px rgba(0,0,0,0.22), -2px 3px 10px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.14)'

function NoteCard({ prayer, index, hasPrayed, zh, my, ja, onClick, onPray }: {
  prayer: Prayer; index: number; hasPrayed: boolean; zh: boolean; my: boolean; ja: boolean
  onClick: () => void; onPray: (e: React.MouseEvent) => void
}) {
  // Only enable hover-flip on pointer devices (not touch) to avoid double-tap on iOS
  const [hovered, setHovered] = useState(false)
  const [isPointer] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(hover: hover) and (pointer: fine)').matches
      : false
  )
  const { s, deg } = noteStyle(index)
  const date = new Date(prayer.created_at).toLocaleDateString(
    zh ? 'zh-TW' : my ? 'my-MM' : ja ? 'ja-JP' : 'en-US', { month: 'short', day: 'numeric' }
  )

  return (
    /* ── Perspective wrapper ── */
    <div
      className="relative cursor-pointer"
      style={{ perspective: '900px', zIndex: hovered ? 20 : undefined }}
      onMouseEnter={() => isPointer && setHovered(true)}
      onMouseLeave={() => isPointer && setHovered(false)}
      onClick={onClick}
    >
      {/* ── Tilt + lift ── */}
      <div
        style={{
          position: 'relative',
          transform: hovered ? 'rotate(0deg) scale(1.07)' : `rotate(${deg}deg) scale(1)`,
          transition: 'transform 0.30s ease',
          filter: hovered ? 'drop-shadow(0 14px 28px rgba(0,0,0,0.32))' : undefined,
        }}
      >
        <Thumbtack color={s.pin} />

        {/* ── 3-D flip container ── */}
        <div
          style={{
            position: 'relative',
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d' as React.CSSProperties['WebkitTransformStyle'],
            transform: hovered ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >

          {/* ── FRONT face ── */}
          <div
            className="flex flex-col rounded-[2px] overflow-hidden min-h-[170px] sm:min-h-[200px] relative"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden' as React.CSSProperties['WebkitBackfaceVisibility'],
              background: s.bg,
              backgroundImage: `${PAPER_GRAIN}, repeating-linear-gradient(transparent, transparent 22px, ${s.line} 22px, ${s.line} 23px)`,
              backgroundPositionY: `${ADHESIVE_H + 8}px`,
              boxShadow: NOTE_BODY_SHADOW,
            }}
          >
            {/* Adhesive strip */}
            <div className="shrink-0" style={{
              height: `${ADHESIVE_H}px`,
              background: `linear-gradient(to bottom, ${s.adhLight}e0, ${s.adhesive}cc)`,
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(255,255,255,0.09) 5px, rgba(255,255,255,0.09) 6px)`,
            }} />

            {/* Red margin line */}
            <div className="absolute pointer-events-none" style={{
              left: '24px', top: `${ADHESIVE_H}px`, bottom: '38px',
              width: '1px', background: 'rgba(205,42,42,0.22)',
            }} />

            {/* Text content */}
            <div className="flex-1 pl-8 pr-2.5 pt-2">
              <p className="text-[11px] sm:text-[12.5px] leading-[22px] sm:leading-[23px] text-gray-800 break-words line-clamp-5">
                {prayer.content}
              </p>
            </div>

            {/* Footer */}
            <div className="px-2.5 sm:px-3 pb-2.5 pt-1.5" style={{ borderTop: `1px solid ${s.pin}30` }}>
              <p className="text-[10px] sm:text-[10.5px] font-bold truncate leading-tight" style={{ color: s.pin }}>
                {prayer.display_name || (zh ? '匿名弟兄姊妹' : my ? 'အမည်မသိ ညီအကိုမောင်နှမ' : ja ? '匿名の兄弟姉妹' : 'Anonymous')}
              </p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[9px] sm:text-[9.5px] text-gray-400">{date}</p>
                <button
                  onClick={onPray}
                  disabled={hasPrayed}
                  className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10px] border font-medium transition-all active:scale-95 ${
                    hasPrayed
                      ? 'border-rose-300 text-rose-500 bg-rose-50'
                      : 'border-gray-300 text-gray-500 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 disabled:cursor-default'
                  }`}
                >
                  <Heart size={8} className={`mr-0.5 ${hasPrayed ? 'fill-rose-500 text-rose-500' : ''}`} />
                  {prayer.prayer_count > 0 ? prayer.prayer_count : ''}
                </button>
              </div>
            </div>

            {/* Corner fold shadow */}
            <div className="absolute bottom-0 right-0 pointer-events-none" style={{
              width: '18px', height: '18px',
              background: 'linear-gradient(225deg, rgba(0,0,0,0.13) 44%, transparent 45%)',
            }} />
            <div className="absolute bottom-0 right-0 pointer-events-none" style={{
              width: '17px', height: '17px',
              background: 'linear-gradient(225deg, #ddd4c8 44%, transparent 45%)',
            }} />
          </div>

          {/* ── BACK face ── */}
          <div
            className="absolute inset-0 flex flex-col rounded-[2px] overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden' as React.CSSProperties['WebkitBackfaceVisibility'],
              transform: 'rotateY(180deg)',
              background: s.bg,
              backgroundImage: PAPER_GRAIN,
              boxShadow: NOTE_BODY_SHADOW,
            }}
          >
            {/* Top colour strip (same hue as adhesive, back side) */}
            <div className="shrink-0" style={{
              height: '8px',
              background: `linear-gradient(to right, ${s.adhesive}80, ${s.adhLight}80, ${s.adhesive}80)`,
            }} />

            {/* Centred prayer info */}
            <div className="flex-1 flex flex-col items-center justify-center gap-2 px-3 py-2">
              {/* Cross */}
              <span
                className="text-3xl sm:text-4xl select-none leading-none"
                style={{ color: `${s.pin}70` }}
              >✝</span>

              {/* Prayer count */}
              <div className="flex items-center gap-1">
                <Heart
                  size={11}
                  className={hasPrayed ? 'fill-rose-400 text-rose-400' : 'text-rose-300'}
                  style={hasPrayed ? {} : { fill: 'none' }}
                />
                <span className="text-[11px] sm:text-[12px] font-semibold text-rose-500">
                  {prayer.prayer_count > 0
                    ? `${prayer.prayer_count} ${zh ? '人代禱' : my ? 'ဦး ဆုတောင်းနေ' : ja ? '人が祈っています' : 'praying'}`
                    : (zh ? '成為第一位' : my ? 'ပထမဆုံး ဖြစ်ပါ' : ja ? '最初の一人になる' : 'Be first')}
                </span>
              </div>

              {/* Author */}
              <p className="text-[10px] sm:text-[11px] font-bold text-center max-w-full truncate" style={{ color: s.pin }}>
                {prayer.display_name || (zh ? '匿名弟兄姊妹' : my ? 'အမည်မသိ ညီအကိုမောင်နှမ' : ja ? '匿名の兄弟姉妹' : 'Anonymous')}
              </p>

              {/* Hint */}
              <p className="text-[9px] text-gray-400 mt-1">
                {zh ? '點擊閱讀全文 →' : my ? 'ဖတ်ရန် နှိပ်ပါ →' : ja ? 'クリックして読む →' : 'Click to read →'}
              </p>
            </div>
          </div>

        </div>{/* /flip container */}
      </div>{/* /tilt wrapper */}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const STORAGE_KEY = 'glory_prayed_ids'

export default function PrayerWall({ initialPrayers, locale }: PrayerWallProps) {
  const zh = locale === 'zh-TW'
  const my = locale === 'my'
  const ja = locale === 'ja'
  const supabase = createClient()

  const [prayers, setPrayers] = useState<Prayer[]>(initialPrayers)
  const [prayedIds, setPrayedIds] = useState<Set<string>>(() => {
    try {
      if (typeof window === 'undefined') return new Set()
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? new Set<string>(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })
  const [selected, setSelected] = useState<Prayer | null>(null)
  const [content, setContent] = useState('')
  const [name, setName] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [showName, setShowName] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Lock body scroll for modal — iOS Safari requires position:fixed
  useEffect(() => {
    if (selected) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflowY = 'scroll'
    } else {
      const scrollY = Math.abs(parseInt(document.body.style.top || '0', 10))
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflowY = ''
      if (scrollY) window.scrollTo(0, scrollY)
    }
    return () => {
      const scrollY = Math.abs(parseInt(document.body.style.top || '0', 10))
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflowY = ''
      if (scrollY) window.scrollTo(0, scrollY)
    }
  }, [selected])

  function savePrayed(ids: Set<string>) {
    setPrayedIds(ids)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids])) } catch { /* ignore */ }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    const displayName = showName ? (name.trim() || (zh ? '匿名弟兄姊妹' : my ? 'အမည်မသိ ညီအကိုမောင်နှမ' : ja ? '匿名の兄弟姉妹' : 'Anonymous')) : null
    const { data, error } = await supabase
      .from('prayer_requests')
      .insert({ display_name: displayName, content: content.trim(), is_public: isPublic })
      .select().single()
    if (!error && data) { setPrayers([data, ...prayers]); setContent(''); setName(''); setShowForm(false) }
    setSubmitting(false)
  }

  async function handlePray(prayerId: string) {
    if (prayedIds.has(prayerId)) return
    const { error } = await supabase.from('prayer_responses').insert({ prayer_id: prayerId })
    if (!error) {
      savePrayed(new Set([...prayedIds, prayerId]))
      setPrayers(prayers.map(p => p.id === prayerId ? { ...p, prayer_count: p.prayer_count + 1 } : p))
    }
  }

  return (
    <>
      {/* ── Submission form ── */}
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-5">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-4 border-2 border-dashed border-wine-200 text-wine-500 rounded-2xl hover:border-wine-400 hover:text-wine-700 hover:bg-wine-50 active:bg-wine-50 transition-all text-sm font-medium flex items-center justify-center gap-2"
          >
            <Send size={16} />
            {zh ? '新增代禱事項' : my ? 'ဆုတောင်းချက် ထည့်ပါ' : ja ? '祈祷リクエストを追加' : 'Add Prayer Request'}
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-wine-100 shadow-md p-5 sm:p-6 space-y-4">
            <h3 className="font-bold text-wine-900 text-base">{zh ? '新增代禱事項' : my ? 'ဆုတောင်းချက် ထည့်ပါ' : ja ? '祈祷リクエストを追加' : 'New Prayer Request'}</h3>

            {showName && (
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={30}
                  placeholder={zh ? '您的姓名（留空顯示匿名）' : my ? 'နာမည် (ရွေးချယ်နိုင်သည်)' : ja ? 'お名前（任意）' : 'Your name (optional)'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-wine-300"
                />
              </div>
            )}

            <textarea
              required
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder={zh ? '請分享您的代禱需求…（最多 500 字）' : my ? 'သင်၏ ဆုတောင်းချက် မျှဝေပါ…' : ja ? '祈祷リクエストを共有…（最大500文字）' : 'Share your prayer request… (max 500 chars)'}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-wine-300"
            />

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setIsPublic(!isPublic)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-colors ${isPublic ? 'border-green-300 text-green-700 bg-green-50' : 'border-gray-300 text-gray-500 bg-gray-50'}`}>
                {isPublic ? <Globe size={13} /> : <Lock size={13} />}
                {isPublic ? (zh ? '公開代禱' : my ? 'အများသိ' : ja ? '公開' : 'Public') : (zh ? '僅自己' : my ? 'ကိုယ်တိုင်သာ' : ja ? '非公開' : 'Private')}
              </button>
              <button type="button" onClick={() => setShowName(!showName)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-colors ${showName ? 'border-blue-300 text-blue-700 bg-blue-50' : 'border-gray-300 text-gray-500 bg-gray-50'}`}>
                {showName ? <Eye size={13} /> : <EyeOff size={13} />}
                {showName ? (zh ? '顯示姓名' : my ? 'နာမည် ပြပါ' : ja ? '名前を表示' : 'Show Name') : (zh ? '匿名' : my ? 'အမည်မသိ' : ja ? '匿名' : 'Anonymous')}
              </button>
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 rounded-xl border border-transparent hover:border-gray-200 transition-colors">
                {zh ? '取消' : my ? 'မလုပ်တော့ပါ' : ja ? 'キャンセル' : 'Cancel'}
              </button>
              <button type="submit" disabled={submitting || !content.trim()}
                className="px-6 py-2.5 church-gradient text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all">
                {submitting ? (zh ? '送出中…' : my ? 'ပေးပို့နေသည်…' : ja ? '送信中…' : 'Posting…') : (zh ? '送出' : my ? 'ပေးပို့ရန်' : ja ? '送信' : 'Post')}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Cork board ── */}
      <div
        className="min-h-[400px] px-3 sm:px-8 lg:px-14 pb-16"
        style={{
          backgroundImage: `${CORK_GRAIN}, linear-gradient(145deg, #c49060 0%, #ae7438 30%, #c49262 65%, #ae7438 100%)`,
          boxShadow: 'inset 0 4px 24px rgba(0,0,0,0.22)',
        }}
      >
        {prayers.length === 0 ? (
          <div className="text-center py-24" style={{ color: 'rgba(255,240,210,0.55)' }}>
            <Heart size={44} className="mx-auto mb-4 opacity-40" />
            <p className="text-sm sm:text-base px-4">
              {zh ? '還沒有代禱事項，成為第一個分享的人吧！' : my ? 'ဆုတောင်းချက် မရှိသေးပါ — ပထမဦးဆုံး မျှဝေပါ!' : ja ? 'まだ祈祷リクエストはありません。最初に共有してみましょう！' : 'No prayers yet — be the first to share!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pt-10">
            {prayers.map((prayer, i) => (
              <NoteCard
                key={prayer.id}
                prayer={prayer}
                index={i}
                hasPrayed={prayedIds.has(prayer.id)}
                zh={zh}
                my={my}
                ja={ja}
                onClick={() => setSelected(prayer)}
                onPray={e => { e.stopPropagation(); handlePray(prayer.id) }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Detail modal ── */}
      {selected && (
        <PrayerModal
          prayer={prayers.find(p => p.id === selected.id) ?? selected}
          index={prayers.findIndex(p => p.id === selected.id)}
          hasPrayed={prayedIds.has(selected.id)}
          zh={zh}
          my={my}
          ja={ja}
          onClose={() => setSelected(null)}
          onPray={() => handlePray(selected.id)}
        />
      )}
    </>
  )
}
