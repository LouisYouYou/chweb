import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server';

import { buildMetadata, pageSEO } from '@/lib/seo/metadata'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata(locale, pageSEO.services)
}
import { MapPin, Car, Train, ExternalLink, CreditCard } from 'lucide-react';
import { serviceTimes } from '@/lib/data/events';

export default async function ServicesPage() {
  const t = await getTranslations('services');
  const locale = await getLocale();

  return (
    <div>
      {/* Page opening — service times editorial, wine-950 */}
      <section
        className="relative bg-wine-950 overflow-hidden"
        style={{ minHeight: 'calc(13rem + 6.5rem)', marginTop: '-6.5rem', paddingTop: '6.5rem' }}
      >
        <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(90,10,30,0.7) 0%, transparent 65%)' }} />
        <div aria-hidden="true" className="absolute bottom-0 right-0 w-96 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 100% 100%, rgba(201,168,76,0.1) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-end md:items-center gap-8 md:gap-16">
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">{t('title')}</h1>
            <p className="text-wine-200 text-base max-w-md leading-relaxed">{t('subtitle')}</p>
          </div>
          <div aria-hidden="true" className="shrink-0 select-none hidden md:block text-right">
            <p className="font-black text-wine-700 leading-none tracking-tight" style={{ fontSize: 'clamp(5rem, 10vw, 8rem)' }}>10:00</p>
            <p className="text-wine-600 text-sm mt-1">主日崇拜</p>
          </div>
        </div>
      </section>

      {/* Service Times — editorial typographic grid */}
      <section className="py-20 px-4 bg-warm-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-wine-100">
            {serviceTimes.map((s, idx) => {
              const name     = locale === 'zh-TW' ? s.nameZh : locale === 'my' ? s.nameMy : locale === 'ja' ? s.nameJa : s.nameEn;
              const day      = locale === 'zh-TW' ? s.dayZh  : locale === 'my' ? s.dayMy  : locale === 'ja' ? s.dayJa  : s.dayEn;
              const location = locale === 'zh-TW' ? s.locationZh : locale === 'my' ? s.locationMy : locale === 'ja' ? s.locationJa : s.locationEn;
              const [timeStart, timeEnd] = s.time ? s.time.split(' - ') : [null, null];
              const pad = idx === 0 ? 'md:pr-12' : idx === serviceTimes.length - 1 ? 'md:pl-12' : 'md:px-12';
              return (
                <div key={s.id} className={`py-10 md:py-0 flex flex-col h-full ${pad}`}>
                  <p className="text-xs font-semibold text-gold-warm-600 mb-2">{name}</p>
                  <p className="text-sm text-gray-400 mb-6">{day}</p>
                  <div aria-hidden="true" className="w-10 h-px bg-gradient-to-r from-wine-400 to-transparent mb-6" />
                  {timeStart ? (
                    <div className="flex-1">
                      <p className="font-black text-wine-700 leading-none tracking-tight" style={{ fontSize: 'clamp(2.75rem, 5vw, 4rem)' }}>
                        {timeStart}
                      </p>
                      {timeEnd && <p className="text-sm text-gray-400 mt-2">— {timeEnd}</p>}
                    </div>
                  ) : (
                    <div className="flex-1">
                      <p className="font-black text-wine-400 leading-none tracking-tight" style={{ fontSize: 'clamp(2.75rem, 5vw, 4rem)' }}>
                        {locale === 'zh-TW' ? '固定聚會' : locale === 'my' ? 'ပုံမှန်' : locale === 'ja' ? '定例' : 'Regular'}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-8">
                    <MapPin size={11} aria-hidden="true" className="text-gold-warm-400 shrink-0" />
                    <span>{location}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 px-4 bg-warm-beige/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-ink-800 mb-10 text-center">{t('location_title')}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Google Map */}
            <div className="rounded-2xl overflow-hidden shadow-md flex flex-col">
              <iframe
                src="https://maps.google.com/maps?q=24.9846438,121.5119889&t=&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="行道會南勢角榮耀堂地圖"
              />
              <a
                href="https://www.google.com/maps/place/%E8%A1%8C%E9%81%93%E6%9C%83%E5%8D%97%E5%8B%A2%E8%A7%92%E6%A6%AE%E8%80%80%E5%A0%82/@24.9846438,121.509414,17z/data=!4m15!1m8!3m7!1s0x3468026d71f8fd71:0x9bc891e67ea791c7!2zMjM1NjjmlrDljJfluILkuK3lkozljYDmnbHljZfph4zlv6DlrZ3ooZczOS0xNeiZnw!3b1!8m2!3d24.9846438!4d121.5119889!16s%2Fg%2F11k99p6trw!3m5!1s0x3468037ce5095e09:0xc5132716d44891e0!8m2!3d24.9846438!4d121.5119889!16s%2Fg%2F11h7q1fpz6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-wine-900 text-white text-sm font-medium hover:bg-wine-700 transition-colors"
              >
                <ExternalLink size={14} />
                {locale === 'zh-TW' ? '在 Google 地圖開啟' : locale === 'ja' ? 'Googleマップで開く' : 'Open in Google Maps'}
              </a>
            </div>

            {/* Info */}
            <div className="border border-warm-beige/60 divide-y divide-warm-beige/60 rounded-2xl overflow-hidden bg-warm-white">
              <div className="flex items-start gap-4 p-5">
                <MapPin size={18} className="text-wine-600 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-ink-800 text-sm">{t('location_title')}</p>
                  <p className="text-ink-600 text-sm mt-1">{t('location_address')}</p>
                  <p className="text-xs text-ink-400 mt-0.5">{t('location_hint')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5">
                <Train size={18} className="text-green-600 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-ink-800 text-sm">{t('transport_title')}</p>
                  <p className="text-ink-600 text-sm mt-1">{t('transport_text')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5">
                <Car size={18} className="text-gold-warm-600 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-ink-800 text-sm">{t('parking_title')}</p>
                  <p className="text-ink-600 text-sm mt-1">{t('parking_text')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 奉獻匯款 */}
      <section className="py-16 px-4 border-t border-warm-beige/40">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-2.5 mb-6">
              <CreditCard size={16} className="text-wine-600 shrink-0" aria-hidden="true" />
              <h2 className="text-xl font-bold text-ink-800">
                {locale === 'zh-TW' ? '奉獻匯款' : locale === 'ja' ? '献金・振込' : 'Offering & Donation'}
              </h2>
            </div>
            <div className="divide-y divide-warm-beige/60 text-sm">
              <div className="flex justify-between py-3.5">
                <span className="text-ink-500 shrink-0 mr-4">{locale === 'zh-TW' ? '銀行' : locale === 'ja' ? '銀行' : 'Bank'}</span>
                <span className="font-medium text-ink-800 text-right">{locale === 'zh-TW' ? '華南銀行南勢角分行（008）' : locale === 'ja' ? '華南銀行 南勢角支店（008）' : 'Hua Nan Bank Nanshijiao Branch (008)'}</span>
              </div>
              <div className="flex justify-between py-3.5">
                <span className="text-ink-500 shrink-0 mr-4">{locale === 'zh-TW' ? '戶名' : locale === 'ja' ? '口座名義' : 'Account Name'}</span>
                <span className="font-medium text-ink-800 text-right break-all">{locale === 'zh-TW' ? '財團法人中華基督教行道會南勢角榮耀堂' : locale === 'ja' ? '行道会南勢角栄光教会' : 'Glory Church of Nanshijiao'}</span>
              </div>
              <div className="flex justify-between py-3.5">
                <span className="text-ink-500 shrink-0 mr-4">{locale === 'zh-TW' ? '帳號' : locale === 'ja' ? '口座番号' : 'Account No.'}</span>
                <span className="font-mono font-bold text-gold-warm-600 tracking-wider">183-10-0034556</span>
              </div>
              <div className="flex justify-between py-3.5">
                <span className="text-ink-500 shrink-0 mr-4">{locale === 'zh-TW' ? '備註' : locale === 'ja' ? '備考' : 'Note'}</span>
                <span className="font-medium text-ink-800 text-right">{locale === 'zh-TW' ? '請註明姓名及奉獻用途' : locale === 'ja' ? 'お名前と献金の用途をご記入ください' : 'Please include your name and purpose'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
