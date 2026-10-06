import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server';
import EventsCalendar from '@/components/events/EventsCalendar';
import EventsJsonLd from '@/components/seo/EventsJsonLd';
import { getAllEvents, type DisplayEvent } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/client';

import { buildMetadata, pageSEO } from '@/lib/seo/metadata'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata(locale, pageSEO.events)
}

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const t = await getTranslations('events');
  const locale = await getLocale();

  const raw = await getAllEvents();
  const events: DisplayEvent[] = raw.map((ev) => ({
    id: ev._id,
    titleZh: ev.titleZh,
    titleEn: ev.titleEn,
    descriptionZh: ev.descriptionZh,
    descriptionEn: ev.descriptionEn,
    date: ev.date,
    time: ev.time,
    locationZh: ev.locationZh,
    locationEn: ev.locationEn,
    category: ev.category,
    fee: ev.fee,
    seats: ev.seats,
    seatsLeft: ev.seatsLeft,
    imageUrl: ev.image ? urlFor(ev.image).width(800).auto('format').url() : undefined,
    registrationUrl: ev.registrationUrl,
    courseItems: ev.courseItems,
  }));

  return (
    <div>
      <EventsJsonLd events={events} />
      {/* Hero */}
      <section className="church-gradient py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-wine-200 text-lg">{t('subtitle')}</p>
          <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mt-6" />
        </div>
      </section>

      <EventsCalendar locale={locale} events={events} />
    </div>
  );
}
