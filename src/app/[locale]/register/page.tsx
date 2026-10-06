'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { UserPlus, Mail, Lock, User } from 'lucide-react'

export default function RegisterPage() {
  const locale = useLocale()
  const zh = locale === 'zh-TW'
  const ja = locale === 'ja'
  const supabase = createClient()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const redirectTo = `${window.location.origin}/api/auth/callback?locale=${locale}`

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name },
        emailRedirectTo: redirectTo,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-wine-100 p-8 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail size={24} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-wine-900 mb-2">
            {zh ? '請確認您的電子郵件' : ja ? 'メールをご確認ください' : 'Check your email'}
          </h2>
          <p className="text-gray-500 text-sm">
            {zh
              ? `已傳送確認信到 ${email}，請點擊信中連結完成註冊。`
              : ja
              ? `${email} に確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。`
              : `A confirmation email was sent to ${email}. Please click the link to complete registration.`}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-wine-100 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 church-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-wine-900">
              {zh ? '申請會員帳號' : ja ? 'アカウント作成' : 'Create Account'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {zh ? '加入榮耀堂線上服務' : ja ? '榮耀堂オンラインに参加' : 'Join Glory Church online'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-wine-900 mb-1.5">
                {zh ? '姓名' : ja ? 'お名前' : 'Name'}
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-wine-300"
                  placeholder={zh ? '您的姓名' : ja ? 'お名前を入力' : 'Your name'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-wine-900 mb-1.5">
                {zh ? '電子郵件' : ja ? 'メールアドレス' : 'Email'}
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
                {zh ? '密碼（至少 6 位）' : ja ? 'パスワード（6文字以上）' : 'Password (min 6 chars)'}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
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
              {loading ? (zh ? '申請中…' : ja ? '作成中…' : 'Creating…') : (zh ? '申請帳號' : ja ? 'アカウント作成' : 'Create Account')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            {zh ? '已有帳號？' : ja ? '既にアカウントをお持ちですか？' : 'Already have an account?'}{' '}
            <Link href={`/${locale}/login`} className="text-wine-600 font-medium hover:underline">
              {zh ? '立即登入' : ja ? 'ログインする' : 'Sign In'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
