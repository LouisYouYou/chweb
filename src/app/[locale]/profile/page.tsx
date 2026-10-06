import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { LogOut, User, Mail, Calendar } from 'lucide-react'

export default async function ProfilePage() {
  const locale = await getLocale()
  const zh = locale === 'zh-TW'
  const ja = locale === 'ja'
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const displayName = user.user_metadata?.display_name ?? user.email
  const joinedAt = new Date(user.created_at).toLocaleDateString(
    zh ? 'zh-TW' : ja ? 'ja-JP' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-wine-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 church-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-wine-900">{displayName}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {zh ? '榮耀堂會員' : ja ? '榮耀堂メンバー' : 'Glory Church Member'}
            </p>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
              <Mail size={16} className="text-wine-400 shrink-0" />
              <span className="text-sm text-gray-600 truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
              <Calendar size={16} className="text-wine-400 shrink-0" />
              <span className="text-sm text-gray-600">
                {zh ? `加入於 ${joinedAt}` : ja ? `${joinedAt} に参加` : `Joined ${joinedAt}`}
              </span>
            </div>
          </div>

          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 text-red-500 font-semibold rounded-xl hover:bg-red-50 transition-colors text-sm"
            >
              <LogOut size={16} />
              {zh ? '登出' : ja ? 'ログアウト' : 'Sign Out'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
