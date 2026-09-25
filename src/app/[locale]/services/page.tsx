import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: '聚會資訊',
  description: '行道會南勢角榮耀堂聚會時間：主日崇拜每週日10:00-11:30、小組聚會每週二19:30、青年聚會每週六19:00。地址：新北市中和區忠孝街39-15號，捷運南勢角站4號出口。',
}
import { Clock, MapPin, Car, Train, ExternalLink } from 'lucide-react';
import { serviceTimes } from '@/lib/data/events';

export default async function ServicesPage() {
  const t = await getTranslations('services');
  const locale = await getLocale();

  return (
    <div>
      {/* Hero */}
      <section className="church-gradient py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-wine-200 text-lg">{t('subtitle')}</p>
          <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mt-6" />
        </div>
      </section>

      {/* Service Times */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceTimes.map((s) => (
              <div key={s.id} className="bg-white border border-wine-100 rounded-2xl p-6 hover:shadow-lg transition-shadow hover:border-wine-300">
                <div className="w-12 h-12 church-gradient rounded-xl flex items-center justify-center mb-4">
                  <Clock size={20} className="text-white" />
                </div>
                <h3 className="font-bold text-wine-900 mb-2">
                  {locale === 'zh-TW' ? s.nameZh : s.nameEn}
                </h3>
                <p className="text-sm text-gray-500">{locale === 'zh-TW' ? s.dayZh : s.dayEn}</p>
                <p className="text-2xl font-bold text-wine-700 my-2">{s.time}</p>
                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                  <MapPin size={14} />
                  {locale === 'zh-TW' ? s.locationZh : s.locationEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-wine-900 mb-10 text-center">{t('location_title')}</h2>
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
                {locale === 'zh-TW' ? '在 Google 地圖開啟' : 'Open in Google Maps'}
              </a>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-wine-100 rounded-xl flex items-center justify-center">
                    <MapPin size={18} className="text-wine-600" />
                  </div>
                  <h3 className="font-bold text-wine-900">{t('location_title')}</h3>
                </div>
                <p className="text-gray-600">{t('location_address')}</p>
                <p className="text-sm text-gray-400 mt-1">{t('location_hint')}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Train size={18} className="text-green-600" />
                  </div>
                  <h3 className="font-bold text-wine-900">{t('transport_title')}</h3>
                </div>
                <p className="text-gray-600 text-sm">{t('location_hint')}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Car size={18} className="text-amber-600" />
                  </div>
                  <h3 className="font-bold text-wine-900">{t('parking_title')}</h3>
                </div>
                <p className="text-gray-600 text-sm">{t('parking_text')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
