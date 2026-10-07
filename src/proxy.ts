import { createServerClient } from '@supabase/ssr'
import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './lib/i18n/routing'

const handleI18nRouting = createMiddleware(routing)

export default async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired — must not remove this line
  await supabase.auth.getUser()

  // Run next-intl locale routing
  const i18nResponse = handleI18nRouting(request)

  // next-intl emits 307 for locale redirects; upgrade to 301 for SEO canonical signals
  if (i18nResponse.status === 307) {
    const location = i18nResponse.headers.get('location')
    if (location) {
      const permanent = NextResponse.redirect(new URL(location, request.url), { status: 301 })
      supabaseResponse.cookies.getAll().forEach((c) => permanent.cookies.set(c.name, c.value))
      return permanent
    }
  }

  // Copy Supabase session cookies to i18n response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    i18nResponse.cookies.set(cookie.name, cookie.value)
  })

  return i18nResponse
}

export const config = {
  matcher: ['/((?!_next|_vercel|studio|api|.*\\..*).*)'],
}
