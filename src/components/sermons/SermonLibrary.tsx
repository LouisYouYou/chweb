'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Play, FileText, Clock, User, BookOpen } from 'lucide-react';
import { sermons, sermonSeries } from '@/lib/data/sermons';

interface SermonLibraryProps {
  locale: string;
}

export default function SermonLibrary({ locale }: SermonLibraryProps) {
  const t = useTranslations('sermons');
  const [search, setSearch] = useState('');
  const [activeSeries, setActiveSeries] = useState('all');

  const filtered = sermons.filter((s) => {
    const title = locale === 'zh-TW' ? s.titleZh : s.titleEn;
    const speaker = locale === 'zh-TW' ? s.speakerZh : s.speakerEn;
    const matchSearch =
      search === '' ||
      title.toLowerCase().includes(search.toLowerCase()) ||
      speaker.toLowerCase().includes(search.toLowerCase()) ||
      s.scripture.toLowerCase().includes(search.toLowerCase());
    const matchSeries = activeSeries === 'all' || s.series === activeSeries;
    return matchSearch && matchSeries;
  });

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveSeries('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeSeries === 'all'
                  ? 'church-gradient text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {t('filter_all')}
            </button>
            {sermonSeries.map((series) => (
              <button
                key={series}
                onClick={() => setActiveSeries(series)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeSeries === series
                    ? 'church-gradient text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {series}
              </button>
            ))}
          </div>
        </div>

        {/* Sermon Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">{t('filter_all')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((sermon) => (
              <div
                key={sermon.id}
                className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="h-44 bg-gradient-to-br from-blue-700 to-blue-950 flex items-center justify-center relative">
                  <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={24} className="text-white ml-1" />
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Clock size={10} />
                    {sermon.duration}
                  </div>
                  <div className="absolute top-3 left-3 bg-blue-600/80 text-white text-xs px-2 py-1 rounded-full">
                    {sermon.series}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                    <BookOpen size={12} />
                    <span>{sermon.scripture}</span>
                    <span className="ml-auto">{sermon.date}</span>
                  </div>
                  <h3 className="font-bold text-blue-900 text-lg mb-1 leading-tight group-hover:text-blue-700 transition-colors">
                    {locale === 'zh-TW' ? sermon.titleZh : sermon.titleEn}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                    <User size={13} />
                    {locale === 'zh-TW' ? sermon.speakerZh : sermon.speakerEn}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 church-gradient text-white text-sm rounded-xl hover:opacity-90 transition-opacity">
                      <Play size={14} />
                      {t('listen')}
                    </button>
                    {sermon.pdfUrl && (
                      <button className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                        <FileText size={14} />
                        PDF
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
