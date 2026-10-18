'use client'

import { useEffect } from 'react'

// Sticky header (navbar 64px + ticker 38px) = ~102px, add buffer → 112px
const HEADER_OFFSET = 112

function scrollToId(id: string): boolean {
  const el = document.getElementById(id)
  if (!el) return false
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
  window.scrollTo({ top: Math.max(0, top), behavior: 'instant' })
  return true
}

// Supports two scroll triggers:
// 1. ?goto=sunday-message  — query param used by social share links.
//    Survives all server-side redirects (Facebook l.php, Twitter t.co, etc.)
//    Hash fragments get stripped by these redirect chains; query params don't.
// 2. #sunday-message       — hash used by internal anchor links (copy link btn).
//
// After scrolling via ?goto=, we clean the URL so it doesn't linger.
export default function HashScrollHandler() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const gotoId = params.get('goto')
    const hashId = window.location.hash ? window.location.hash.slice(1) : null
    const id = gotoId ?? hashId
    if (!id) return

    // Clean up ?goto= from URL immediately (before scroll)
    if (gotoId) {
      params.delete('goto')
      const newSearch = params.toString()
      const cleanUrl =
        window.location.pathname +
        (newSearch ? `?${newSearch}` : '') +
        (window.location.hash || '')
      history.replaceState(null, '', cleanUrl)
    }

    // Attempt 1 — right after hydration
    const t1 = setTimeout(() => {
      if (scrollToId(id)) return

      // Attempt 2 — after Suspense + FadeIn settle
      const t2 = setTimeout(() => {
        if (scrollToId(id)) return

        // Fallback — watch DOM until element appears
        const observer = new MutationObserver(() => {
          if (scrollToId(id)) observer.disconnect()
        })
        observer.observe(document.body, { childList: true, subtree: true })
        setTimeout(() => observer.disconnect(), 8000)
      }, 600)

      return () => clearTimeout(t2)
    }, 150)

    return () => clearTimeout(t1)
  }, [])

  return null
}
