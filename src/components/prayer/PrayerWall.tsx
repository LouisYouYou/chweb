'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Heart, Send, Lock, Globe, Trash2, EyeOff, Eye } from 'lucide-react'

interface Prayer {
  id: string
  user_id: string
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

// Sticky note palette — bg / ruled-line / pin colour
const NOTE_STYLES = [
  { bg: '#fef9c3', line: 'rgba(202,138,4,0.15)',  pin: '#ca8a04' },  // yellow
  { bg: '#fce7f3', line: 'rgba(190,24,93,0.12)',  pin: '#be185d' },  // pink
  { bg: '#dbeafe', line: 'rgba(29,78,216,0.12)',  pin: '#1d4ed8' },  // blue
  { bg: '#dcfce7', line: 'rgba(21,128,61,0.12)',  pin: '#15803d' },  // green
  { bg: '#ede9fe', line: 'rgba(109,40,217,0.12)', pin: '#7c3aed' },  // purple
  { bg: '#ffedd5', line: 'rgba(194,65,12,0.12)',  pin: '#c2410c' },  // orange
]
const ROTATIONS = [-2.5, 1.2, -1.5, 2, 0.8, -0.8, 1.8, -2]

function noteStyle(index: number) {
  const s = NOTE_STYLES[index % NOTE_STYLES.length]
  const deg = ROTATIONS[index % ROTATIONS.length]
  return { s, deg }
}

export default function PrayerWall({ initialPrayers, currentUserId, locale }: PrayerWallProps) {
  const zh = locale === 'zh-TW'
  const supabase = createClient()

  const [prayers, setPrayers] = useState<Prayer[]>(initialPrayers)
  const [prayedIds, setPrayedIds] = useState<Set<string>>(new Set())
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [showName, setShowName] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!currentUserId || !content.trim()) return
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    const displayName = showName
      ? (user?.user_metadata?.display_name ?? (zh ? '匿名弟兄姊妹' : 'Anonymous'))
      : null
    const { data, error } = await supabase
      .from('prayer_requests')
      .insert({ user_id: currentUserId, display_name: displayName, content: content.trim(), is_public: isPublic })
      .select().single()
    if (!error && data) { setPrayers([data, ...prayers]); setContent(''); setShowForm(false) }
    setSubmitting(false)
  }

  async function handlePray(prayerId: string) {
    if (!currentUserId || prayedIds.has(prayerId)) return
    const { error } = await supabase.from('prayer_responses').insert({ prayer_id: prayerId, user_id: currentUserId })
    if (!error) {
      setPrayedIds(new Set([...prayedIds, prayerId]))
      setPrayers(prayers.map(p => p.id === prayerId ? { ...p, prayer_count: p.prayer_count + 1 } : p))
    }
  }

  async function handleDelete(prayerId: string) {
    const { error } = await supabase.from('prayer_requests').delete().eq('id', prayerId)
    if (!error) setPrayers(prayers.filter(p => p.id !== prayerId))
  }

  return (
    <div>
      {/* Form area */}
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-6">
        {currentUserId ? (
          !showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-4 border-2 border-dashed border-wine-200 text-wine-500 rounded-2xl hover:border-wine-400 hover:text-wine-700 hover:bg-wine-50 transition-all text-sm font-medium flex items-center justify-center gap-2"
            >
              <Send size={16} />
              {zh ? '新增我的代禱事項' : 'Add Prayer Request'}
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-wine-100 shadow-md p-6 space-y-4">
              <h3 className="font-bold text-wine-900">{zh ? '新增代禱事項' : 'New Prayer Request'}</h3>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder={zh ? '請分享您的代禱需求…（最多 500 字）' : 'Share your prayer request… (max 500 chars)'}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-wine-300"
              />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setIsPublic(!isPublic)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${isPublic ? 'border-green-300 text-green-700 bg-green-50' : 'border-gray-300 text-gray-500 bg-gray-50'}`}>
                    {isPublic ? <Globe size={13} /> : <Lock size={13} />}
                    {isPublic ? (zh ? '公開代禱' : 'Public') : (zh ? '僅自己' : 'Private')}
                  </button>
                  <button type="button" onClick={() => setShowName(!showName)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${showName ? 'border-blue-300 text-blue-700 bg-blue-50' : 'border-gray-300 text-gray-500 bg-gray-50'}`}>
                    {showName ? <Eye size={13} /> : <EyeOff size={13} />}
                    {showName ? (zh ? '顯示姓名' : 'Show Name') : (zh ? '匿名' : 'Anonymous')}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-xl">
                    {zh ? '取消' : 'Cancel'}
                  </button>
                  <button type="submit" disabled={submitting || !content.trim()}
                    className="px-5 py-2 church-gradient text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity">
                    {submitting ? (zh ? '送出中…' : 'Posting…') : (zh ? '送出' : 'Post')}
                  </button>
                </div>
              </div>
            </form>
          )
        ) : (
          <div className="text-center py-5 bg-wine-50 rounded-2xl border border-wine-100">
            <p className="text-wine-700 text-sm">
              {zh ? '請' : 'Please '}
              <a href={`/${locale}/login`} className="font-semibold underline">{zh ? '登入' : 'sign in'}</a>
              {zh ? '後才可以新增代禱事項' : ' to add a prayer request'}
            </p>
          </div>
        )}
      </div>

      {/* Board */}
      <div
        className="min-h-[400px] px-6 sm:px-12 pb-16"
        style={{ background: 'linear-gradient(135deg,#f5ede4 0%,#ede8e0 50%,#e8e0d8 100%)' }}
      >
        {prayers.length === 0 ? (
          <div className="text-center py-24 text-stone-400">
            <Heart size={44} className="mx-auto mb-4 opacity-25" />
            <p className="text-base">{zh ? '還沒有代禱事項，成為第一個分享的人吧！' : 'No prayers yet — be the first to share!'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 pt-10">
            {prayers.map((prayer, i) => {
              const { s, deg } = noteStyle(i)
              const hasPrayed = prayedIds.has(prayer.id)
              const isOwn = prayer.user_id === currentUserId
              const date = new Date(prayer.created_at).toLocaleDateString(
                zh ? 'zh-TW' : 'en-US', { month: 'short', day: 'numeric' }
              )
              return (
                <div
                  key={prayer.id}
                  className="group relative"
                  style={{ transform: `rotate(${deg}deg)`, transition: 'transform 0.25s ease, filter 0.25s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'rotate(0deg) scale(1.04)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = `rotate(${deg}deg) scale(1)`)}
                >
                  {/* Pin */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-white shadow-md" style={{ background: s.pin }} />
                    <div className="w-0.5 h-2 rounded-b" style={{ background: s.pin, opacity: 0.5 }} />
                  </div>

                  {/* Note */}
                  <div
                    className="rounded-sm overflow-hidden flex flex-col min-h-[180px] shadow-[0_4px_14px_rgba(0,0,0,0.18)] group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.22)] transition-shadow"
                    style={{
                      background: s.bg,
                      backgroundImage: `repeating-linear-gradient(transparent,transparent 23px,${s.line} 23px,${s.line} 24px)`,
                      backgroundPositionY: '28px',
                    }}
                  >
                    {/* Top bar */}
                    <div className="h-1.5 w-full" style={{ background: s.pin, opacity: 0.6 }} />

                    {/* Body */}
                    <div className="flex-1 p-4 pt-3">
                      <p className="text-[13px] leading-[24px] text-gray-800 whitespace-pre-wrap break-words line-clamp-6">
                        {prayer.content}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="px-4 pb-3 pt-1 border-t" style={{ borderColor: `${s.pin}30` }}>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold truncate" style={{ color: s.pin }}>
                            {prayer.display_name || (zh ? '匿名弟兄姊妹' : 'Anonymous')}
                          </p>
                          <p className="text-[10px] text-gray-400">{date}</p>
                        </div>
                        {isOwn && (
                          <button
                            onClick={() => handleDelete(prayer.id)}
                            className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all shrink-0"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handlePray(prayer.id)}
                        disabled={!currentUserId || hasPrayed}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                          hasPrayed
                            ? 'border-rose-300 text-rose-600 bg-rose-50'
                            : 'border-gray-300 text-gray-500 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 disabled:cursor-default disabled:opacity-60'
                        }`}
                      >
                        <Heart size={11} className={hasPrayed ? 'fill-rose-500 text-rose-500' : ''} />
                        {zh ? '我在禱告' : 'Praying'}
                        {prayer.prayer_count > 0 && <span className="ml-0.5">{prayer.prayer_count}</span>}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
