'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Calendar, MapPin, ArrowRight, Users } from 'lucide-react';
import { events } from '@/lib/data/events';

const categoryColors: Record<string, string> = {
  worship: 'bg-wine-100 text-wine-700',
  youth: 'bg-purple-100 text-purple-700',
  community: 'bg-green-100 text-green-700',
  retreat: 'bg-amber-100 text-amber-700',
  training: 'bg-teal-100 text-teal-700',
};

const categoryLabels: Record<string, { zh: string; en: string }> = {
  worship: { zh: '崇拜', en: 'Worship' },
  youth: { zh: '青年', en: 'Youth' },
  community: { zh: '社區', en: 'Community' },
  retreat: { zh: '退修', en: 'Retreat' },
  training: { zh: '訓練', en: 'Training' },
};

export default function UpcomingEvents() {
  const t = useTranslations('home.upcoming_events');
  const et = useTranslations('events');
  const locale = useLocale();
  const upcoming = events.slice(0, 3);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-wine-900 mb-3">{t('title')}</h2>
            <p className="text-gray-500">{t('subtitle')}</p>
            <div className="w-16 h-1 bg-amber-500 mt-4 rounded-full" />
          </div>
          <Link
            href={`/${locale}/events`}
            className="flex items-center gap-2 text-wine-600 hover:text-wine-800 transition-colors text-sm font-medium group"
          >
            {t('view_all')}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="space-y-4">
          {upcoming.map((event) => {
            const [year, month, day] = event.date.split('-');
            return (
              <div
                key={event.id}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-wine-200 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Date badge */}
                <div className="church-gradient rounded-xl p-3 text-center min-w-[60px] text-white">
                  <p className="text-xs font-medium opacity-80">{month}</p>
                  <p className="text-2xl font-bold leading-tight">{day}</p>
                  <p className="text-xs opacity-80">{year}</p>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[event.category]}`}>
                      {locale === 'zh-TW'
                        ? categoryLabels[event.category].zh
                        : categoryLabels[event.category].en}
                    </span>
                    {event.fee === 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">
                        {et('free')}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-wine-900 text-lg group-hover:text-wine-700 transition-colors">
                    {locale === 'zh-TW' ? event.titleZh : event.titleEn}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {locale === 'zh-TW' ? event.locationZh : event.locationEn}
                    </span>
                    {event.seatsLeft !== undefined && (
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {et('seats_left')}: {event.seatsLeft}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <span className="shrink-0 px-5 py-2.5 bg-gray-200 text-gray-400 text-sm font-medium rounded-full line-through cursor-not-allowed select-none">
                  {et('register')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
