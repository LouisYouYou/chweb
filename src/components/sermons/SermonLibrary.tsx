'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Search, Play, X, BookOpen, User, Calendar } from 'lucide-react';
import {
  sermons,
  sermonCategories,
  getYoutubeThumbnail,
  getYoutubeEmbedUrl,
  type Sermon,
} from '@/lib/data/sermons';

interface SermonLibraryProps {
  locale: string;
}

export default function SermonLibrary({ locale }: SermonLibraryProps) {
  const t = useTranslations('sermons');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [playing, setPlaying] = useState<Sermon | null>(null);

  const filtered = sermons.filter((s) => {
    const title = locale === 'zh-TW' ? s.titleZh : s.titleEn;
    const speaker = locale === 'zh-TW' ? s.speakerZh : s.speakerEn;
    const matchSearch =
      search === '' ||
      title.toLowerCase().includes(search.toLowerCase()) ||
      speaker.toLowerCase().includes(search.toLowerCase()) ||
      s.scripture.toLowerCase().includes(search.toLowerCase()) ||
      s.series.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || s.category === activeCategory;
    return matchSearch && matchCat;
  });

  // Group by series within filtered results
  const seriesGroups = filtered.reduce<Record<string, Sermon[]>>((acc, s) => {
    const key = locale === 'zh-TW' ? s.series : s.seriesEn;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-300 text-sm"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-10">
          {sermonCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.key
                  ? 'church-gradient text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-wine-50 hover:text-wine-700'
              }`}
            >
              {locale === 'zh-TW' ? cat.zh : cat.en}
            </button>
          ))}
        </div>

        {/* No results */}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Play size={40} className="mx-auto mb-3 opacity-30" />
            <p>{t('no_results') ?? '找不到相關講道'}</p>
          </div>
        )}

        {/* Grouped by Series */}
        {Object.entries(seriesGroups).map(([seriesName, items]) => (
          <div key={seriesName} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 church-gradient rounded-full" />
              <h3 className="text-lg font-bold text-wine-900">{seriesName}</h3>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {items.length} {locale === 'zh-TW' ? '篇' : 'videos'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {items.map((sermon) => {
                const thumbnail = getYoutubeThumbnail(sermon.youtubeUrl);
                return (
                  <div
                    key={sermon.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-wine-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => setPlaying(sermon)}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-44 bg-wine-950 overflow-hidden">
                      {thumbnail ? (
                        <Image
                          src={thumbnail}
                          alt={locale === 'zh-TW' ? sermon.titleZh : sermon.titleEn}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full church-gradient" />
                      )}
                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <Play size={22} className="text-wine-700 ml-1" fill="currentColor" />
                        </div>
                      </div>
                      {/* Category badge */}
                      <span className="absolute top-2 left-2 text-xs bg-wine-700/90 text-white px-2 py-0.5 rounded-full">
                        {sermon.category}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h4 className="font-semibold text-wine-900 text-sm leading-tight mb-2 line-clamp-2 group-hover:text-wine-700 transition-colors">
                        {locale === 'zh-TW' ? sermon.titleZh : sermon.titleEn}
                      </h4>
                      <div className="space-y-1 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <User size={11} />
                          <span>{locale === 'zh-TW' ? sermon.speakerZh : sermon.speakerEn}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen size={11} />
                          <span>{sermon.scripture}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={11} />
                          <span>{sermon.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* YouTube Player Modal */}
      {playing && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPlaying(null)}
        >
          <div
            className="w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold text-lg leading-tight">
                  {locale === 'zh-TW' ? playing.titleZh : playing.titleEn}
                </h3>
                <p className="text-white/60 text-sm mt-0.5">
                  {locale === 'zh-TW' ? playing.speakerZh : playing.speakerEn}
                  {' · '}
                  {playing.scripture}
                  {' · '}
                  {playing.date}
                </p>
              </div>
              <button
                onClick={() => setPlaying(null)}
                className="ml-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* YouTube embed */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={getYoutubeEmbedUrl(playing.youtubeUrl)}
                title={locale === 'zh-TW' ? playing.titleZh : playing.titleEn}
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
