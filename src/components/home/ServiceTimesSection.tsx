import { getTranslations, getLocale } from 'next-intl/server';
import { MapPin, Train, ExternalLink } from 'lucide-react';
import { serviceTimes } from '@/lib/data/events';
import FadeIn from '@/components/ui/FadeIn';

export default async function ServiceTimesSection() {
  const t = await getTranslations('home.service_times');
  const locale = await getLocale();
  const zh = locale === 'zh-TW';
  const my = locale === 'my';
  const ja = locale === 'ja';

  return (
    <section className="py-20 bg-warm-white relative overflow-hidden">
      <div aria-hidden="true" className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-wine-50 opacity-40 pointer-events-none" />
      <div aria-hidden="true" className="absolute -left-24 -bottom-24 w-72 h-72 rounded-full bg-gold-warm-50 opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Section header — editorial left-aligned */}
        <FadeIn>
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-3">
              <div aria-hidden="true" className="w-1 h-10 wine-gradient rounded-full shrink-0" />
              <h2 className="text-3xl md:text-4xl font-bold text-ink-800">{t('title')}</h2>
            </div>
            <p className="text-sm text-gray-400 pl-5">{t('subtitle')}</p>
          </div>
        </FadeIn>

        {/* Editorial typographic grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-wine-100">
          {serviceTimes.map((s, idx) => {
            const name     = zh ? s.nameZh     : my ? s.nameMy     : ja ? s.nameJa     : s.nameEn;
            const day      = zh ? s.dayZh      : my ? s.dayMy      : ja ? s.dayJa      : s.dayEn;
            const location = zh ? s.locationZh : my ? s.locationMy : ja ? s.locationJa : s.locationEn;
            const [timeStart, timeEnd] = s.time ? s.time.split(' - ') : [null, null];
            const pad = idx === 0 ? 'md:pr-12' : idx === serviceTimes.length - 1 ? 'md:pl-12' : 'md:px-12';

            return (
              <FadeIn key={s.id} delay={idx * 110}>
                <div className={`py-10 md:py-0 flex flex-col h-full ${pad}`}>
                  {/* Service name — amber accent */}
                  <p className="text-xs font-semibold text-gold-warm-600 mb-2">{name}</p>

                  {/* Day */}
                  <p className="text-sm text-gray-400 mb-6">{day}</p>

                  {/* Wine divider rule */}
                  <div aria-hidden="true" className="w-10 h-px bg-gradient-to-r from-wine-400 to-transparent mb-6" />

                  {/* Time — editorial centrepiece */}
                  {timeStart ? (
                    <div className="flex-1">
                      <p
                        className="font-black text-wine-700 leading-none tracking-tight"
                        style={{ fontSize: 'clamp(2.75rem, 5vw, 4rem)' }}
                      >
                        {timeStart}
                      </p>
                      {timeEnd && (
                        <p className="text-sm text-gray-400 mt-2">— {timeEnd}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex-1">
                      <p
                        className="font-black text-wine-400 leading-none tracking-tight"
                        style={{ fontSize: 'clamp(2.75rem, 5vw, 4rem)' }}
                      >
                        {zh ? '固定聚會' : my ? 'ပုံမှန်' : ja ? '定例' : 'Regular'}
                      </p>
                    </div>
                  )}

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-8">
                    <MapPin size={11} aria-hidden="true" className="text-gold-warm-400 shrink-0" />
                    <span>{location}</span>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Directions */}
        <FadeIn delay={300}>
          <a
            href="https://maps.google.com/?q=新北市中和區忠孝街39-15號"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 py-5 px-6 rounded-2xl border border-warm-beige/60 bg-gradient-to-r from-wine-50/40 to-gold-warm-50/30 hover:border-wine-200/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-500 focus-visible:ring-offset-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full wine-gradient flex items-center justify-center shrink-0 shadow-sm">
                <Train size={15} className="text-white" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400">
                  {zh ? '南勢角站 4 號出口' : ja ? '南勢角駅 4 番出口' : my ? 'နန်ရှိချောင် ဘူတာ ၄ ထွက်ပေါက်' : 'MRT Nanshijiao Exit 4'}
                </p>
                <p className="text-sm font-semibold text-ink-700">
                  {zh ? '步行 10 分鐘' : my ? '၁၀ မိနစ်' : ja ? '徒歩 10 分' : '10-min Walk'}
                </p>
              </div>
            </div>
            <div aria-hidden="true" className="hidden sm:block w-px h-8 bg-warm-beige" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full amber-gradient flex items-center justify-center shrink-0 shadow-sm">
                <MapPin size={15} className="text-white" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400">
                  {zh ? '新北市中和區' : ja ? '新北市中和区' : my ? 'ဇောင်းဟဲ ခရိုင်' : 'Zhonghe, New Taipei'}
                </p>
                <p className="text-sm font-semibold text-ink-700">
                  {zh ? '忠孝街 39-15 號' : ja ? '忠孝街 39-15号' : my ? 'ဇောင်းရှောင်လမ်း ၃၉-၁၅' : 'No.39-15, Zhongxiao St.'}
                </p>
              </div>
            </div>
            <ExternalLink size={14} aria-hidden="true" className="text-gray-300 group-hover:text-wine-400 transition-colors hidden sm:block ml-2 shrink-0" />
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
