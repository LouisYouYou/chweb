import { getTranslations, getLocale } from 'next-intl/server';
import { Clock, MapPin } from 'lucide-react';
import { serviceTimes } from '@/lib/data/events';
import FadeIn from '@/components/ui/FadeIn';

export default async function ServiceTimesSection() {
  const t = await getTranslations('home.service_times');
  const locale = await getLocale();

  return (
    <section className="py-20 bg-warm-white relative overflow-hidden">
      {/* Decorative background circles */}
      <div aria-hidden="true" className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-wine-50 opacity-40 pointer-events-none" />
      <div aria-hidden="true" className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full bg-gold-warm-50 opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <FadeIn>
        <div className="text-center mb-14">
          <div className="flex justify-center mb-3">
            <span className="type-eyebrow-light">
              {locale === 'my' ? 'ဝတ်ပြုကိုးကွယ်ချိန်' : 'SERVICE TIMES'}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-ink-800 mb-3">{t('title')}</h2>
          <p className="type-meta">{t('subtitle')}</p>
          <div className="divider-gold" />
        </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceTimes.map((s, idx) => (
            <FadeIn key={s.id} delay={idx * 100}>
            <div
              className="group relative bg-white rounded-2xl border border-warm-beige/60 p-7 haptic-service-card overflow-hidden h-full"
            >
              {/* Number accent */}
              <span aria-hidden="true" className="absolute top-5 right-5 text-6xl font-black text-forest-50 select-none pointer-events-none leading-none">
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Icon */}
              <div aria-hidden="true" className="w-14 h-14 church-gradient rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-wine-200 group-hover:scale-110 transition-transform">
                <Clock size={22} aria-hidden="true" className="text-white" />
              </div>

              {/* Name */}
              <h3 className="font-bold text-ink-800 text-lg mb-1 leading-tight">
                {locale === 'zh-TW' ? s.nameZh : locale === 'my' ? s.nameMy : locale === 'ja' ? s.nameJa : s.nameEn}
              </h3>

              {/* Day */}
              <p className="text-sm text-gold-warm-600 font-semibold mb-2">
                {locale === 'zh-TW' ? s.dayZh : locale === 'my' ? s.dayMy : locale === 'ja' ? s.dayJa : s.dayEn}
              </p>

              {/* Time */}
              {s.time && (
                <p className="text-2xl font-black text-forest-600 mb-4 tracking-tight">{s.time}</p>
              )}

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-warm-beige via-gold-warm-200 to-transparent mb-4" />

              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <MapPin size={12} aria-hidden="true" className="text-forest-400" />
                <span>{locale === 'zh-TW' ? s.locationZh : locale === 'my' ? s.locationMy : locale === 'ja' ? s.locationJa : s.locationEn}</span>
              </div>

              {/* Bottom accent on hover */}
              <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-1 wine-gradient scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-b-2xl" />
            </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
