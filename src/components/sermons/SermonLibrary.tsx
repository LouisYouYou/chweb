'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Search, Play, X, Calendar, PlayCircle, ExternalLink } from 'lucide-react';
import { getEmbedUrl, getWatchUrl, type YouTubeVideo } from '@/lib/youtube';

interface SermonLibraryProps {
  locale: string;
  videos: YouTubeVideo[];
}

export default function SermonLibrary({ locale, videos }: SermonLibraryProps) {
  const t = useTranslations('sermons');
  const zh = locale === 'zh-TW';
  const [search, setSearch] = useState('');
  const [playing, setPlaying] = useState<YouTubeVideo | null>(null);

  const filtered = videos.filter((v) =>
    search === '' || v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Search */}
        <div className="relative mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-300 text-sm"
          />
        </div>

        {/* No API key notice */}
        {videos.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <PlayCircle size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">{zh ? '尚無影片資料' : 'No videos found'}</p>
            <p className="text-sm text-gray-300">
              {zh ? '請確認 YOUTUBE_API_KEY 已設定於 Vercel 環境變數' : 'Please set YOUTUBE_API_KEY in Vercel env vars'}
            </p>
          </div>
        )}

        {/* No search results */}
        {videos.length > 0 && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Play size={40} className="mx-auto mb-3 opacity-30" />
            <p>{t('no_results') ?? (zh ? '找不到相關影片' : 'No results found')}</p>
          </div>
        )}

        {/* Video Grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((video) => (
              <div
                key={video.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-wine-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setPlaying(video)}
              >
                {/* Thumbnail */}
                <div className="relative h-44 bg-wine-950 overflow-hidden">
                  {video.thumbnail ? (
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full church-gradient" />
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play size={22} className="text-wine-700 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <span className="absolute top-2 left-2 text-xs bg-wine-700/90 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                    <PlayCircle size={10} />
                    {zh ? '主日講道' : 'Sermon'}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h4 className="font-semibold text-wine-900 text-sm leading-tight mb-2 line-clamp-2 group-hover:text-wine-700 transition-colors">
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar size={11} />
                    <span>{video.publishedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* YouTube channel link */}
        {filtered.length > 0 && (
          <div className="mt-10 text-center">
            <a
              href="https://www.youtube.com/@winson651202"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-wine-200 text-wine-700 font-semibold rounded-full hover:bg-wine-50 transition-colors text-sm"
            >
              <PlayCircle size={16} />
              {zh ? '前往 YouTube 頻道觀看更多' : 'View more on YouTube'}
              <ExternalLink size={13} />
            </a>
          </div>
        )}
      </div>

      {/* YouTube Player Modal */}
      {playing && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPlaying(null)}
        >
          <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2">
                  {playing.title}
                </h3>
                <p className="text-white/60 text-sm mt-0.5">{playing.publishedAt}</p>
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                <a
                  href={getWatchUrl(playing.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title={zh ? '在 YouTube 開啟' : 'Open in YouTube'}
                >
                  <ExternalLink size={18} />
                </a>
                <button
                  onClick={() => setPlaying(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={getEmbedUrl(playing.id)}
                title={playing.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
