'use client'

import { useState, useEffect, useRef } from 'react'
import { Heart, Eye, Share2, Link } from 'lucide-react'

function InstagramIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function LineIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.631-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

interface Props {
  sanityId: string
  title: string
  shareUrl: string   // with #sunday-message — used for copy link (internal)
  socialUrl: string  // with ?goto=sunday-message — used for social platforms (survives server redirects)
}

const LIKE_KEY = (id: string) => `msg_liked_${id}`

export default function SundayMessageInteractions({ sanityId, title, shareUrl, socialUrl }: Props) {
  const [views, setViews] = useState<number | null>(null)
  const [likes, setLikes] = useState<number | null>(null)
  const [liked, setLiked] = useState(false)
  const [likeLoading, setLikeLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [igCopied, setIgCopied] = useState(false)
  const viewTracked = useRef(false)

  useEffect(() => {
    setLiked(localStorage.getItem(LIKE_KEY(sanityId)) === '1')

    if (!viewTracked.current) {
      viewTracked.current = true
      fetch('/api/sunday-message/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sanityId, action: 'view' }),
      })
        .then(r => r.json())
        .then(d => { setViews(d.views); setLikes(d.likes) })
        .catch(() => {
          fetch(`/api/sunday-message/stats?id=${encodeURIComponent(sanityId)}`)
            .then(r => r.json())
            .then(d => { setViews(d.views); setLikes(d.likes) })
            .catch(() => {})
        })
    }
  }, [sanityId])

  async function handleLike() {
    if (likeLoading) return
    setLikeLoading(true)
    const newLiked = !liked

    setLiked(newLiked)
    setLikes(prev => Math.max(0, (prev ?? 0) + (newLiked ? 1 : -1)))
    localStorage.setItem(LIKE_KEY(sanityId), newLiked ? '1' : '0')

    try {
      const res = await fetch('/api/sunday-message/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sanityId, action: newLiked ? 'like' : 'unlike' }),
      })
      const d = await res.json()
      setLikes(d.likes)
    } catch {
      setLiked(!newLiked)
      setLikes(prev => Math.max(0, (prev ?? 0) + (newLiked ? -1 : 1)))
      localStorage.setItem(LIKE_KEY(sanityId), newLiked ? '0' : '1')
    }
    setLikeLoading(false)
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  async function handleInstagram() {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url: socialUrl })
      } catch {
        // 用戶取消或不支援，靜默忽略
      }
    } else {
      // 桌機：複製連結，提示貼至 IG
      navigator.clipboard.writeText(socialUrl).then(() => {
        setIgCopied(true)
        setTimeout(() => setIgCopied(false), 2500)
      })
    }
  }

  // Social platforms: use ?goto= URL (survives server-side redirects)
  const encodedSocialUrl = encodeURIComponent(socialUrl)
  const encodedTitle = encodeURIComponent(title)
  // LINE: title + newline + URL embedded as plain text in message
  const lineText = encodeURIComponent(`${title}\n${socialUrl}`)

  return (
    <div className="pt-4 border-t border-gray-100 space-y-4">
      {/* 統計列 */}
      <div className="flex items-center gap-5 text-sm text-gray-500">
        <span className="flex items-center gap-1.5">
          <Eye size={14} className="text-gray-400" aria-hidden="true" />
          <span aria-label={`${views ?? 0} 次瀏覽`}>
            {views === null ? '—' : views.toLocaleString()}
          </span>
        </span>
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className={`flex items-center gap-1.5 transition-colors duration-200 cursor-pointer ${
            liked
              ? 'text-red-500'
              : 'text-gray-400 hover:text-red-400'
          } disabled:opacity-60`}
          aria-label={liked ? '取消按讚' : '按讚'}
          aria-pressed={liked}
        >
          <Heart
            size={14}
            fill={liked ? 'currentColor' : 'none'}
            className="transition-transform duration-200 hover:scale-110"
          />
          <span aria-live="polite">
            {likes === null ? '—' : likes.toLocaleString()}
          </span>
        </button>
      </div>

      {/* 分享列 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400 flex items-center gap-1 mr-1">
          <Share2 size={12} aria-hidden="true" />
          分享
        </span>

        {/* LINE — 使用 msg/text 格式才能帶入標題文字 */}
        <a
          href={`https://line.me/R/msg/text/?${lineText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 bg-[#06C755] hover:bg-[#05b04c] text-white text-xs font-semibold rounded-full transition-colors duration-200"
          aria-label="分享至 LINE"
        >
          <LineIcon />
          LINE
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedSocialUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 bg-[#1877F2] hover:bg-[#1565c0] text-white text-xs font-semibold rounded-full transition-colors duration-200"
          aria-label="分享至 Facebook"
        >
          <FacebookIcon />
          Facebook
        </a>

        {/* X (Twitter) */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedSocialUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold rounded-full transition-colors duration-200"
          aria-label="分享至 X (Twitter)"
        >
          <XIcon />
          X
        </a>

        {/* Instagram */}
        <button
          onClick={handleInstagram}
          className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 text-white text-xs font-semibold rounded-full transition-colors duration-200 cursor-pointer"
          style={{ background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' }}
          aria-label="分享至 Instagram"
        >
          <InstagramIcon />
          {igCopied ? '已複製！貼至 IG' : 'Instagram'}
        </button>

        {/* 複製連結 */}
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-full transition-colors duration-200 cursor-pointer"
          aria-label="複製連結"
        >
          <Link size={12} aria-hidden="true" />
          {copied ? '已複製！' : '複製連結'}
        </button>
      </div>
    </div>
  )
}
