'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Clock } from 'lucide-react';
import { events } from '@/lib/data/events';

const categoryColors: Record<string, string> = {
  worship:   'border-l-wine-500 bg-wine-50/60',
  youth:     'border-l-purple-500 bg-purple-50/60',
  community: 'border-l-emerald-500 bg-emerald-50/60',
  retreat:   'border-l-amber-500 bg-amber-50/60',
  training:  'border-l-teal-500 bg-teal-50/60',
};

const categoryBadge: Record<string, string> = {
  worship:   'bg-wine-100 text-wine-700 border-wine-200',
  youth:     'bg-purple-100 text-purple-700 border-purple-200',
  community: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  retreat:   'bg-amber-100 text-amber-700 border-amber-200',
  training:  'bg-teal-100 text-teal-700 border-teal-200',
};

const categoryLabels: Record<string, { zh: string; en: string }> = {
  worship:   { zh: '崇拜', en: 'Worship' },
  youth:     { zh: '青年', en: 'Youth' },
  community: { zh: '社區', en: 'Community' },
  retreat:   { zh: '退修', en: 'Retreat' },
  training:  { zh: '訓練', en: 'Training' },
};

interface EventsCalendarProps {
  locale: string;
}

export default function EventsCalendar({ locale }: EventsCalendarProps) {
  const t = useTranslations('events');
  const [activeFilter, setActiveFilter] = useState('all');
  const zh = locale === 'zh-TW';

  const filters = ['all', ...Object.keys(categoryLabels)];
  const filtered = activeFilter === 'all'
    ? events
    : events.filter((e) => e.category === activeFilter);

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === f
                  ? 'church-gradient text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-wine-50 hover:text-wine-700'
              }`}
            >
              {f === 'all'
                ? (zh ? '全部' : 'All')
                : (zh ? categoryLabels[f].zh : categoryLabels[f].en)}
            </button>
          ))}
        </div>

        {/* Events */}
        <div className="space-y-6">
          {filtered.map((event) => {
            const [year, month, day] = event.date.split('-');
            return (
              <div
                key={event.id}
                className={`rounded-2xl border-l-4 border border-l-[inherit] border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${categoryColors[event.category]}`}
              >
                {/* Main content */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Date badge */}
                    <div className="church-gradient rounded-2xl px-4 py-3 text-center shrink-0 min-w-[68px] shadow-md self-start">
                      <p className="text-[10px] font-bold text-wine-200 tracking-widest">{month}</p>
                      <p className="text-3xl font-black text-white leading-tight">{day}</p>
                      <p className="text-[10px] text-wine-300">{year}</p>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${categoryBadge[event.category]}`}>
                          {zh ? categoryLabels[event.category].zh : categoryLabels[event.category].en}
                        </span>
                        {event.fee === 0 && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold">
                            {t('free')}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-wine-900 mb-2">
                        {zh ? event.titleZh : event.titleEn}
                      </h3>

                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {zh ? event.descriptionZh : event.descriptionEn}
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-wine-400" />
                          {zh ? event.locationZh : event.locationEn}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course schedule sub-items */}
                {event.courseItems && event.courseItems.length > 0 && (
                  <div className="border-t border-gray-100 bg-white/70 px-6 py-5">
                    <p className="text-xs font-bold text-wine-700 tracking-wider uppercase mb-3 flex items-center gap-2">
                      <Clock size={12} />
                      {zh ? '課程時間表' : 'Course Schedule'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {event.courseItems.map((item) => (
                        <div
                          key={item.nameZh}
                          className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm"
                        >
                          <div className="w-8 h-8 church-gradient rounded-lg flex items-center justify-center shrink-0">
                            <Clock size={14} className="text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-wine-900 text-sm">
                              {zh ? item.nameZh : item.nameEn}
                            </p>
                            <p className="text-xs text-amber-600 font-medium">
                              {item.day} {item.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
