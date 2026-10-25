'use client'

import { useState, useCallback } from 'react'
import { Lock, Send, Users, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, BookOpen } from 'lucide-react'

type Stage = 'locked' | 'composing' | 'sending' | 'done' | 'error'
type SundayStage = 'idle' | 'sending' | 'done' | 'error'

interface SundayResult { sent: number; failed: number; title: string; date: string }

export default function AdminNewsletterPage() {
  const [password, setPassword]     = useState('')
  const [pwError, setPwError]       = useState(false)
  const [showPw, setShowPw]         = useState(false)
  const [stage, setStage]           = useState<Stage>('locked')
  const [subCount, setSubCount]     = useState<number | null>(null)
  const [subject, setSubject]       = useState('')
  const [body, setBody]             = useState('')
  const [result, setResult]         = useState<{ sent: number; failed: number } | null>(null)

  // 主日信息寄送狀態
  const [sundayStage, setSundayStage]   = useState<SundayStage>('idle')
  const [sundayResult, setSundayResult] = useState<SundayResult | null>(null)

  const unlock = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return
    const res = await fetch(`/api/admin/send-newsletter?password=${encodeURIComponent(password)}`)
    if (res.ok) {
      const data = await res.json()
      setSubCount(data.count)
      setStage('composing')
      setPwError(false)
    } else {
      setPwError(true)
    }
  }, [password])

  const sendSundayMessage = useCallback(async () => {
    setSundayStage('sending')
    setSundayResult(null)
    try {
      const res = await fetch('/api/admin/send-sunday-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (res.ok) {
        setSundayResult({ sent: data.sent, failed: data.failed, title: data.title, date: data.date })
        setSundayStage('done')
      } else {
        setSundayStage('error')
      }
    } catch {
      setSundayStage('error')
    }
  }, [password])

  const sendNewsletter = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !body.trim()) return
    setStage('sending')
    try {
      const res = await fetch('/api/admin/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, subject, body }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult({ sent: data.sent, failed: data.failed })
        setStage('done')
      } else {
        setStage('error')
      }
    } catch {
      setStage('error')
    }
  }, [password, subject, body])

  /* ── Locked ── */
  if (stage === 'locked') {
    return (
      <main className="min-h-screen bg-wine-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-wine-900 rounded-3xl p-8 shadow-2xl border border-wine-800">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 flex items-center justify-center mb-4">
              <Lock size={24} className="text-amber-400" />
            </div>
            <h1 className="text-white text-xl font-bold">電子報管理後台</h1>
            <p className="text-wine-400 text-sm mt-1">行道會南勢角榮耀堂</p>
          </div>
          <form onSubmit={unlock} className="space-y-4">
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPwError(false) }}
                placeholder="管理員密碼"
                autoComplete="current-password"
                className={`w-full px-5 py-3.5 pr-12 rounded-full bg-wine-800 border text-white placeholder-wine-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all ${pwError ? 'border-red-500' : 'border-wine-700'}`}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-wine-400 hover:text-wine-200"
                aria-label={showPw ? '隱藏密碼' : '顯示密碼'}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {pwError && <p className="text-red-400 text-xs px-2">密碼錯誤，請重試。</p>}
            <button
              type="submit"
              className="w-full min-h-[44px] bg-amber-400 hover:bg-amber-300 text-wine-900 font-bold rounded-full text-sm transition-all shadow-lg"
            >
              進入後台
            </button>
          </form>
        </div>
      </main>
    )
  }

  /* ── Done (newsletter) ── */
  if (stage === 'done' && result) {
    return (
      <main className="min-h-screen bg-wine-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-wine-900 rounded-3xl p-10 shadow-2xl border border-wine-800 text-center">
          <CheckCircle size={48} className="text-green-400 mx-auto mb-6" />
          <h2 className="text-white text-2xl font-bold mb-2">發送完成</h2>
          <p className="text-wine-300 text-sm mb-6">
            成功發送 <span className="text-amber-400 font-bold text-lg">{result.sent}</span> 封
            {result.failed > 0 && <span className="text-red-400 ml-2">（{result.failed} 封失敗）</span>}
          </p>
          <button
            onClick={() => { setStage('composing'); setSubject(''); setBody(''); setResult(null) }}
            className="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-wine-900 font-bold rounded-full text-sm transition-all"
          >
            繼續撰寫下一封
          </button>
        </div>
      </main>
    )
  }

  /* ── Error ── */
  if (stage === 'error') {
    return (
      <main className="min-h-screen bg-wine-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-wine-900 rounded-3xl p-10 shadow-2xl border border-wine-800 text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-6" />
          <h2 className="text-white text-2xl font-bold mb-2">發送失敗</h2>
          <p className="text-wine-400 text-sm mb-6">請確認 Gmail 設定是否正確，或稍後再試。</p>
          <button
            onClick={() => setStage('composing')}
            className="px-8 py-3 bg-wine-700 hover:bg-wine-600 text-white font-bold rounded-full text-sm transition-all"
          >
            返回
          </button>
        </div>
      </main>
    )
  }

  /* ── Composing / Sending ── */
  const previewLines = body.split('\n').map((line, i) =>
    line.trim() === ''
      ? <br key={i} />
      : <p key={i} style={{ margin: '0 0 12px', fontSize: 15, lineHeight: 1.8, color: '#333' }}>{line}</p>
  )

  return (
    <main className="min-h-screen bg-wine-950 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">電子報發送中心</h1>
            <p className="text-wine-400 text-sm mt-1">行道會南勢角榮耀堂</p>
          </div>
          {subCount !== null && (
            <div className="flex items-center gap-2 bg-wine-900 border border-wine-700 rounded-2xl px-5 py-3">
              <Users size={16} className="text-amber-400" />
              <span className="text-white font-bold text-lg">{subCount}</span>
              <span className="text-wine-400 text-sm">位訂閱者</span>
            </div>
          )}
        </div>

        {/* ── 主日信息快速發送 ── */}
        <div className="bg-wine-900 rounded-3xl p-6 border border-wine-800">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 flex items-center justify-center shrink-0">
              <BookOpen size={18} className="text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold text-base">發送本週主日信息</h2>
              <p className="text-wine-400 text-sm mt-1">
                自動從 Sanity 讀取最新主日信息，保留完整段落與格式，發送給所有訂閱者。
              </p>

              {sundayStage === 'done' && sundayResult && (
                <div className="mt-4 flex items-start gap-2 p-3 bg-green-950/50 rounded-2xl border border-green-800">
                  <CheckCircle size={16} className="text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-300 text-sm font-semibold">「{sundayResult.title}」已寄出</p>
                    <p className="text-green-500 text-xs mt-0.5">
                      成功 {sundayResult.sent} 封
                      {sundayResult.failed > 0 && `・失敗 ${sundayResult.failed} 封`}
                    </p>
                  </div>
                </div>
              )}

              {sundayStage === 'error' && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-red-950/50 rounded-2xl border border-red-800">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <p className="text-red-300 text-sm">發送失敗，請確認 Gmail 設定與 Sanity 連線。</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={sendSundayMessage}
              disabled={sundayStage === 'sending'}
              className="shrink-0 min-h-[44px] px-6 bg-amber-400 hover:bg-amber-300 active:scale-[0.97] text-wine-900 font-bold rounded-full text-sm transition-all shadow-lg shadow-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sundayStage === 'sending' ? (
                <><Loader2 size={15} className="animate-spin" />發送中…</>
              ) : (
                <><Send size={15} />立即發送</>
              )}
            </button>
          </div>
        </div>

        {/* ── 自訂電子報 ── */}
        <form onSubmit={sendNewsletter}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-wine-400 text-xs font-semibold uppercase tracking-wider px-1">自訂電子報</p>
              <div className="bg-wine-900 rounded-3xl p-6 border border-wine-800">
                <label className="block text-wine-300 text-xs font-semibold uppercase tracking-wider mb-3">主旨</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="例：本週主日信息 · 10/20 聚會通知"
                  maxLength={100}
                  className="w-full px-5 py-3.5 rounded-2xl bg-wine-800 border border-wine-700 text-white placeholder-wine-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all"
                />
              </div>
              <div className="bg-wine-900 rounded-3xl p-6 border border-wine-800">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-wine-300 text-xs font-semibold uppercase tracking-wider">內文</label>
                  <span className="text-wine-500 text-xs">{body.length} 字</span>
                </div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={"親愛的弟兄姊妹，\n\n本週主日信息...\n\n願神祝福您，\n南勢角榮耀堂"}
                  rows={14}
                  className="w-full px-5 py-4 rounded-2xl bg-wine-800 border border-wine-700 text-white placeholder-wine-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all resize-none leading-relaxed"
                />
                <p className="text-wine-600 text-xs mt-2">每個空白行會成為段落間距</p>
              </div>
              <button
                type="submit"
                disabled={stage === 'sending' || !subject.trim() || !body.trim()}
                className="w-full min-h-[52px] bg-wine-700 hover:bg-wine-600 active:scale-[0.98] text-white font-bold rounded-full text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {stage === 'sending' ? (
                  <><Loader2 size={18} className="animate-spin" />發送中…</>
                ) : (
                  <><Send size={18} />發送自訂電子報</>
                )}
              </button>
            </div>

            {/* Preview */}
            <div className="bg-wine-900 rounded-3xl p-6 border border-wine-800">
              <p className="text-wine-300 text-xs font-semibold uppercase tracking-wider mb-4">預覽</p>
              <div className="rounded-2xl overflow-hidden border border-wine-700">
                <div style={{ background: 'linear-gradient(135deg,#380a14 0%,#76192a 50%,#92202f 100%)', padding: '24px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 6px', color: '#f6c8cd', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' }}>Glory Church Of Nanshijiao</p>
                  <h2 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 700, lineHeight: 1.4 }}>{subject || '（主旨）'}</h2>
                </div>
                <div style={{ background: '#fff', padding: '24px 24px 12px' }}>
                  {body ? previewLines : <p style={{ color: '#bbb', fontSize: 14 }}>（內文預覽）</p>}
                </div>
                <div style={{ background: '#f9f4f5', borderTop: '1px solid #f3e8ea', padding: '12px 24px', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: 11, color: '#bbb' }}>行道會南勢角榮耀堂・Glory Church Of Nanshijiao</p>
                </div>
              </div>
            </div>
          </div>
        </form>

      </div>
    </main>
  )
}
