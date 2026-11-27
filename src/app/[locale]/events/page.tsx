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
    imageBlurData: ev.image?.asset?.metadata?.lqip,
    registrationUrl: ev.registrationUrl,
    courseItems: ev.courseItems,
  }));

  return (
    <div>
      <EventsJsonLd events={events} />
      {/* Page opening — editorial wine-950 with decorative character */}
      <section
        className="relative bg-wine-950 overflow-hidden"
        style={{ minHeight: 'calc(13rem + 6.5rem)', marginTop: '-6.5rem', paddingTop: '6.5rem' }}
      >
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px,#fff 1px,transparent 0)', backgroundSize:'36px 36px' }} />
        <div aria-hidden="true" className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(90,10,30,0.5) 0%, transparent 55%)' }} />
        <span aria-hidden="true" className="absolute right-0 bottom-0 select-none pointer-events-none font-black text-white leading-none"
          style={{ fontSize: 'clamp(14rem, 26vw, 20rem)', opacity: 0.025, lineHeight: 0.8 }}>活</span>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">{t('title')}</h1>
          <p className="text-wine-200 text-base max-w-md leading-relaxed">{t('subtitle')}</p>
        </div>
      </section>

      <EventsCalendar locale={locale} events={events} />
    </div>
  );
}
