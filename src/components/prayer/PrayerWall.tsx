'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Heart, Send, Lock, Globe, Trash2 } from 'lucide-react'

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

export default function PrayerWall({ initialPrayers, currentUserId, locale }: PrayerWallProps) {
  const zh = locale === 'zh-TW'
  const supabase = createClient()

  const [prayers, setPrayers] = useState<Prayer[]>(initialPrayers)
  const [prayedIds, setPrayedIds] = useState<Set<string>>(new Set())
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!currentUserId || !content.trim()) return
    setSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()
    const displayName = user?.user_metadata?.display_name ?? zh ? '匿名弟兄姊妹' : 'Anonymous'

    const { data, error } = await supabase
      .from('prayer_requests')
      .insert({ user_id: currentUserId, display_name: displayName, content: content.trim(), is_public: isPublic })
      .select()
      .single()

    if (!error && data) {
      setPrayers([data, ...prayers])
      setContent('')
      setShowForm(false)
    }
    setSubmitting(false)
  }

  async function handlePray(prayerId: string) {
    if (!currentUserId || prayedIds.has(prayerId)) return

    const { error } = await supabase
      .from('prayer_responses')
      .insert({ prayer_id: prayerId, user_id: currentUserId })

    if (!error) {
      setPrayedIds(new Set([...prayedIds, prayerId]))
      setPrayers(prayers.map(p =>
        p.id === prayerId ? { ...p, prayer_count: p.prayer_count + 1 } : p
      ))
    }
  }

  async function handleDelete(prayerId: string) {
    const { error } = await supabase
      .from('prayer_requests')
      .delete()
      .eq('id', prayerId)

    if (!error) {
      setPrayers(prayers.filter(p => p.id !== prayerId))
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* Submit button / form */}
      {currentUserId && (
        <div className="mb-8">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-4 border-2 border-dashed border-wine-200 text-wine-500 rounded-2xl hover:border-wine-400 hover:text-wine-700 hover:bg-wine-50 transition-all text-sm font-medium flex items-center justify-center gap-2"
            >
              <Send size={16} />
              {zh ? '新增代禱事項' : 'Add Prayer Request'}
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-wine-100 shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-wine-900 text-base">
                {zh ? '新增代禱事項' : 'New Prayer Request'}
              </h3>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder={zh ? '請分享您的代禱需求…（最多 500 字）' : 'Share your prayer request… (max 500 chars)'}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-wine-300"
              />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    isPublic
                      ? 'border-green-300 text-green-700 bg-green-50'
                      : 'border-gray-300 text-gray-500 bg-gray-50'
                  }`}
                >
                  {isPublic ? <Globe size={14} /> : <Lock size={14} />}
                  {isPublic ? (zh ? '公開' : 'Public') : (zh ? '僅自己' : 'Private')}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-xl transition-colors"
                  >
                    {zh ? '取消' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !content.trim()}
                    className="px-5 py-2 church-gradient text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {submitting ? (zh ? '送出中…' : 'Posting…') : (zh ? '送出' : 'Post')}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Not logged in hint */}
      {!currentUserId && (
        <div className="mb-8 text-center py-6 bg-wine-50 rounded-2xl border border-wine-100">
          <p className="text-wine-700 text-sm">
            {zh ? '請' : 'Please '}
            <a href={`/${locale}/login`} className="font-semibold underline">{zh ? '登入' : 'sign in'}</a>
            {zh ? '後才可以新增代禱事項' : ' to add a prayer request'}
          </p>
        </div>
      )}

      {/* Prayer list */}
      {prayers.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Heart size={40} className="mx-auto mb-3 opacity-30" />
          <p>{zh ? '目前沒有代禱事項，成為第一個分享的人吧！' : 'No prayer requests yet. Be the first to share!'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prayers.map((prayer) => {
            const hasPrayed = prayedIds.has(prayer.id)
            const isOwn = prayer.user_id === currentUserId
            const date = new Date(prayer.created_at).toLocaleDateString(
              zh ? 'zh-TW' : 'en-US',
              { month: 'short', day: 'numeric' }
            )
            return (
              <div key={prayer.id} className="bg-white rounded-2xl border border-gray-100 hover:border-wine-200 shadow-sm p-6 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="font-semibold text-wine-900 text-sm">
                      {prayer.display_name || (zh ? '匿名弟兄姊妹' : 'Anonymous')}
                    </span>
                    <span className="text-gray-400 text-xs ml-2">{date}</span>
                    {!prayer.is_public && (
                      <span className="ml-2 text-xs text-gray-400 inline-flex items-center gap-0.5">
                        <Lock size={10} />{zh ? '私密' : 'Private'}
                      </span>
                    )}
                  </div>
                  {isOwn && (
                    <button
                      onClick={() => handleDelete(prayer.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
                      title={zh ? '刪除' : 'Delete'}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{prayer.content}</p>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => handlePray(prayer.id)}
                    disabled={!currentUserId || hasPrayed}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      hasPrayed
                        ? 'border-wine-300 text-wine-600 bg-wine-50'
                        : 'border-gray-200 text-gray-500 hover:border-wine-300 hover:text-wine-600 hover:bg-wine-50 disabled:cursor-default'
                    }`}
                  >
                    <Heart size={13} className={hasPrayed ? 'fill-wine-500 text-wine-500' : ''} />
                    {zh ? '我在禱告' : 'Praying'}
                    {prayer.prayer_count > 0 && (
                      <span className="ml-0.5 text-xs">{prayer.prayer_count}</span>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
