'use client'

import { useState } from 'react'
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react'

export default function AdminRevalidatePage() {
  const [secret, setSecret] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleRevalidate = async () => {
    if (!secret) return
    setStatus('loading')
    try {
      const res = await fetch('/api/admin/revalidate-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('ok')
        setMessage(`快取已清除：${data.now}`)
      } else {
        setStatus('error')
        setMessage(data.error ?? '失敗')
      }
    } catch {
      setStatus('error')
      setMessage('網路錯誤')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <h1 className="text-xl font-bold text-gray-900 mb-1">手動清除前端快取</h1>
        <p className="text-sm text-gray-400 mb-6">
          發佈新主日信息後，點擊「立即更新」強制前端重新載入最新資料。
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">管理員密碼</label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="輸入 SANITY_REVALIDATE_SECRET"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-300 text-sm"
            />
          </div>

          <button
            onClick={handleRevalidate}
            disabled={!secret || status === 'loading'}
            className="w-full py-3 bg-wine-700 text-white font-semibold rounded-xl hover:bg-wine-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={16} className={status === 'loading' ? 'animate-spin' : ''} />
            {status === 'loading' ? '更新中...' : '立即更新首頁'}
          </button>

          {status === 'ok' && (
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
              <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-xl border border-red-200">
              <XCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{message}</p>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-300 mt-6 text-center">
          /admin/revalidate — 僅供管理員使用
        </p>
      </div>
    </div>
  )
}
