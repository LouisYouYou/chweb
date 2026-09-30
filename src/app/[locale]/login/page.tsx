'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { LogIn, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const locale = useLocale()
  const router = useRouter()
  const zh = locale === 'zh-TW'
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(zh ? '帳號或密碼錯誤，請再試一次。' : 'Invalid email or password.')
      setLoading(false)
      return
    }

    router.push(`/${locale}/profile`)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-wine-100 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 church-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-wine-900">
              {zh ? '會員登入' : 'Sign In'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {zh ? '歡迎回到榮耀堂' : 'Welcome back to Glory Church'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-wine-900 mb-1.5">
                {zh ? '電子郵件' : 'Email'}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-wine-300"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-wine-900 mb-1.5">
                {zh ? '密碼' : 'Password'}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-wine-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 church-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm mt-2"
            >
              {loading ? (zh ? '登入中…' : 'Signing in…') : (zh ? '登入' : 'Sign In')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            {zh ? '還沒有帳號？' : "Don't have an account?"}{' '}
            <Link href={`/${locale}/register`} className="text-wine-600 font-medium hover:underline">
              {zh ? '立即申請' : 'Register'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
