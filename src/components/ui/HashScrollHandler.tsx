'use client'

import { useEffect } from 'react'

// After hydration + Suspense resolution, scroll to the hash target.
// Needed because SundayMessageSection is in a Suspense boundary — the element
// doesn't exist when the browser first processes the hash from the URL.
export default function HashScrollHandler() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    const id = hash.slice(1)

    const scrollToTarget = (el: HTMLElement) => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const el = document.getElementById(id)
    if (el) {
      scrollToTarget(el)
      return
    }

    // Watch for the element to appear after Suspense resolves
    const observer = new MutationObserver(() => {
      const target = document.getElementById(id)
      if (target) {
        observer.disconnect()
        scrollToTarget(target)
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
    const cleanup = setTimeout(() => observer.disconnect(), 8000)

    return () => {
      observer.disconnect()
      clearTimeout(cleanup)
    }
  }, [])

  return null
}
