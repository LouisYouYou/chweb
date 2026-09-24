import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server';
import EventsCalendar from '@/components/events/EventsCalendar';

export const metadata: Metadata = {
  title: '活動行事曆',
  description: '行道會南勢角榮耀堂近期活動與特會資訊，包含退修會、青年特會、社區服務、聖經研讀課程等。',
}

export default async function EventsPage() {
  const t = await getTranslations('events');
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

      <EventsCalendar locale={locale} />
    </div>
  );
}
