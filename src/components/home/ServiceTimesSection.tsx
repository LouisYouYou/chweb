'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Clock, MapPin } from 'lucide-react';
import { serviceTimes } from '@/lib/data/events';

export default function ServiceTimesSection() {
  const t = useTranslations('home.service_times');
  const locale = useLocale();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">{t('title')}</h2>
          <p className="text-gray-500">{t('subtitle')}</p>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceTimes.map((s) => (
            <div
              key={s.id}
              className="group p-6 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 church-gradient rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-blue-900 mb-2 leading-tight">
                {locale === 'zh-TW' ? s.nameZh : s.nameEn}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                {locale === 'zh-TW' ? s.dayZh : s.dayEn}
              </p>
              <p className="text-lg font-bold text-blue-700 mb-3">{s.time}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <MapPin size={12} />
                <span>{locale === 'zh-TW' ? s.locationZh : s.locationEn}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
