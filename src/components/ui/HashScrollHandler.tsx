'use client'

import { useEffect } from 'react'

const HEADER_OFFSET = 112

function scrollToId(id: string): boolean {
  const el = document.getElementById(id)
  if (!el) return false
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
  window.scrollTo({ top: Math.max(0, top) })
  return true
}

// Supports two triggers:
// 1. ?goto=sunday-message — used by social share links (survives all server
//    redirects: Facebook l.php, Twitter t.co, LINE, Instagram webview).
// 2. #sunday-message      — used by the copy-link button (internal anchor).
//
// Uses polling (100ms × 40 = 4s) so it works on slow mobile in-app browsers
// (Facebook IAB, LINE webview) where React hydration + Suspense resolution
// takes significantly longer than on desktop.
export default function HashScrollHandler() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const gotoId = params.get('goto')
    const hashId = window.location.hash ? window.location.hash.slice(1) : null
    const id = gotoId ?? hashId
    if (!id) return

    // Clean ?goto= from URL immediately so it doesn't stay in history
    if (gotoId) {
      params.delete('goto')
      const newSearch = params.toString()
      const cleanUrl =
        window.location.pathname +
        (newSearch ? `?${newSearch}` : '') +
        (window.location.hash || '')
      history.replaceState(null, '', cleanUrl)
    }

    // Poll every 100ms up to 4 seconds — handles slow IAB + Suspense timing
    let attempts = 0
    const timer = setInterval(() => {
      attempts++
      if (scrollToId(id) || attempts >= 40) clearInterval(timer)
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return null
}
