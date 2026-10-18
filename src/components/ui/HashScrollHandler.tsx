'use client'

import { useEffect } from 'react'

// Sticky header (navbar 64px + ticker 38px) = ~102px, add buffer → 112px
const HEADER_OFFSET = 112

// Scroll to element with explicit Y calculation.
// Using window.scrollTo instead of scrollIntoView for better webview compat.
function scrollToId(id: string): boolean {
  const el = document.getElementById(id)
  if (!el) return false
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
  window.scrollTo({ top: Math.max(0, top), behavior: 'instant' })
  return true
}

// HashScrollHandler — needed because SundayMessageSection is in a <Suspense>:
// the browser fires hash scroll before the element exists. We retry after
// hydration + Suspense resolution, and watch DOM in case it arrives later.
export default function HashScrollHandler() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const id = hash.slice(1)

    // Attempt 1 — right after hydration (element may already exist via SSR)
    const t1 = setTimeout(() => {
      if (scrollToId(id)) return

      // Attempt 2 — after Suspense + FadeIn settle (mobile webviews are slower)
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
