import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server';
import EventsCalendar from '@/components/events/EventsCalendar';
import PageHero from '@/components/layout/PageHero';
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
    imageBlurData: ev.image?.asset?.metadata?.lqip,
    registrationUrl: ev.registrationUrl,
    courseItems: ev.courseItems,
  }));

  return (
    <div>
      <EventsJsonLd events={events} />
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      <EventsCalendar locale={locale} events={events} />
    </div>
  );
}
