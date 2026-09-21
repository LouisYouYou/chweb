import { getTranslations, getLocale } from 'next-intl/server';
import { Clock, MapPin, Car, Train } from 'lucide-react';
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden shadow-md h-72 bg-wine-100 flex items-center justify-center">
              <div className="text-center text-wine-400">
                <MapPin size={40} className="mx-auto mb-2" />
                <p className="font-medium">{t('location_address')}</p>
                <p className="text-sm mt-1">{t('location_hint')}</p>
              </div>
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
