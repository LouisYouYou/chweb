'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Clock, MapPin } from 'lucide-react';
import { serviceTimes } from '@/lib/data/events';

export default function ServiceTimesSection() {
  const t = useTranslations('home.service_times');
  const locale = useLocale();

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-wine-50 opacity-60 pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full bg-amber-50 opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-amber-600 text-xs font-bold tracking-[0.3em] uppercase mb-3">
            {locale === 'zh-TW' ? 'SERVICE TIMES' : '聚會時間'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-wine-900 mb-3">{t('title')}</h2>
          <p className="text-gray-400 text-sm">{t('subtitle')}</p>
          <div className="divider-gold" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceTimes.map((s, idx) => (
            <div
              key={s.id}
              className="group relative bg-white rounded-2xl border border-gray-100 p-7 card-lift overflow-hidden"
            >
              {/* Number accent */}
              <span className="absolute top-5 right-5 text-6xl font-black text-wine-50 select-none pointer-events-none leading-none">
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Icon */}
              <div className="w-14 h-14 church-gradient rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-wine-200 group-hover:scale-110 transition-transform">
                <Clock size={22} className="text-white" />
              </div>

              {/* Name */}
              <h3 className="font-bold text-wine-900 text-lg mb-1 leading-tight">
                {locale === 'zh-TW' ? s.nameZh : s.nameEn}
              </h3>

              {/* Day */}
              <p className="text-sm text-amber-600 font-semibold mb-2">
                {locale === 'zh-TW' ? s.dayZh : s.dayEn}
              </p>

              {/* Time */}
              <p className="text-2xl font-black text-wine-700 mb-4 tracking-tight">{s.time}</p>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-wine-100 via-amber-200 to-transparent mb-4" />

              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <MapPin size={12} className="text-wine-400" />
                <span>{locale === 'zh-TW' ? s.locationZh : s.locationEn}</span>
              </div>

              {/* Bottom accent on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-1 church-gradient scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-b-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
