import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { Calendar, MapPin, ArrowRight, Users, Tag, ClipboardList, CalendarX2 } from 'lucide-react';
import { getUpcomingEvents } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/client';
import FadeIn from '@/components/ui/FadeIn';

const categoryColors: Record<string, string> = {
  worship:   'bg-wine-100 text-wine-700 border-wine-200',
  family:    'bg-rose-100 text-rose-700 border-rose-200',
  youth:     'bg-purple-100 text-purple-700 border-purple-200',
  community: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  retreat:   'bg-amber-400 text-amber-950 border-amber-500 font-bold',
  training:  'bg-teal-100 text-teal-700 border-teal-200',
};


const categoryAccent: Record<string, string> = {
  worship:   'border-l-wine-500',
  family:    'border-l-rose-400',
  youth:     'border-l-purple-500',
  community: 'border-l-emerald-500',
  retreat:   'border-l-amber-500',
  training:  'border-l-teal-500',
};

export default async function UpcomingEvents() {
  const t = await getTranslations('home.upcoming_events');
  const et = await getTranslations('events');
  const locale = await getLocale();

  const raw = await getUpcomingEvents(3);
  const upcoming = raw.map((ev) => ({
    id: ev._id,
    titleZh: ev.titleZh,
    titleEn: ev.titleEn,
    date: ev.date,
    time: ev.time,
    locationZh: ev.locationZh,
    locationEn: ev.locationEn,
    category: ev.category,
    fee: ev.fee,
    seats: ev.seats,
    seatsLeft: ev.seatsLeft,
    registrationUrl: ev.registrationUrl,
    imageUrl: ev.image ? urlFor(ev.image).width(400).auto('format').url() : undefined,
  }));

  const zh = locale === 'zh-TW';

  return (
    <section className="py-20 bg-gradient-to-b from-[#fdfaf5] to-white relative overflow-hidden">
      <div aria-hidden="true" className="absolute top-0 right-0 w-80 h-80 rounded-full bg-wine-50 opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
          <div>
            <p className="text-amber-600 text-xs font-bold tracking-[0.3em] uppercase mb-3 border-l-2 border-amber-500 pl-3">
              {et('eyebrow')}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-wine-900 mb-3">{t('title')}</h2>
            <p className="text-gray-400 text-sm">{t('subtitle')}</p>
            <div className="divider-gold" style={{ margin: '16px 0 0' }} />
          </div>
          <Link
            href={`/${locale}/events`}
            className="inline-flex items-center gap-2 text-wine-700 hover:text-wine-900 border border-wine-200 hover:border-wine-400 px-4 py-2 min-h-[44px] rounded-full text-sm font-semibold transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-2"
          >
            {t('view_all')}
            <ArrowRight aria-hidden="true" size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        </FadeIn>

        {upcoming.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarX2 aria-hidden="true" size={36} className="mx-auto mb-4 text-wine-300 opacity-50" />
            <p className="text-lg font-semibold text-wine-800">
              {et('empty_title')}
            </p>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              {et('empty_body')}
            </p>
            <Link
              href={`/${locale}/events`}
              className="mt-6 inline-flex items-center gap-2 min-h-[44px] church-gradient text-white px-6 py-2.5 text-sm font-semibold rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-2"
            >
              {et('view_all')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((event, i) => {
              const [year, month, day] = event.date.split('-');
              const catKey = event.category
                ? (`categories.${event.category}` as Parameters<typeof et>[0])
                : null;
              const categoryLabel = catKey && et.has(catKey) ? et(catKey) : (event.category ?? '');
              return (
                <FadeIn key={event.id} delay={i * 100}>
                <div
                  className={`group bg-white rounded-2xl border-l-4 ${categoryAccent[event.category]} border border-l-[inherit] border-t-gray-100 border-r-gray-100 border-b-gray-100 p-6 card-lift${event.category === 'retreat' ? ' ring-1 ring-amber-300/70 shadow-amber-50' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    {/* Date badge */}
                    <time
                      dateTime={event.date}
                      className="church-gradient rounded-2xl px-4 py-3 text-center shrink-0 min-w-[68px] shadow-md shadow-wine-200"
                    >
                      <p aria-hidden="true" className="text-[10px] font-bold text-wine-200 tracking-widest uppercase">{month}</p>
                      <p aria-hidden="true" className="text-3xl font-black text-white leading-tight">{day}</p>
                      <p aria-hidden="true" className="text-[10px] text-wine-300">{year}</p>
                      <span className="sr-only">{event.date}</span>
                    </time>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${categoryColors[event.category]}`}>
                          <Tag aria-hidden="true" size={9} className="inline mr-1 -mt-0.5" />
                          {categoryLabel}
                        </span>
                        {event.fee === 0
                          ? <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold">{et('free')}</span>
                          : event.fee != null && <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 font-semibold">NT${event.fee}</span>
                        }
                      </div>
                      <h3 className="font-bold text-wine-900 text-lg leading-tight group-hover:text-wine-700 transition-colors mb-2">
                        {zh ? event.titleZh : event.titleEn}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                        {event.time && <span className="flex items-center gap-1.5"><Calendar aria-hidden="true" size={12} className="text-wine-400" />{event.time}</span>}
                        {(zh ? event.locationZh : event.locationEn) && (
                          <span className="flex items-center gap-1.5"><MapPin aria-hidden="true" size={12} className="text-wine-400" />{zh ? event.locationZh : event.locationEn}</span>
                        )}
                        {event.seats != null && (
                          <span className={`flex items-center gap-1.5 font-semibold ${event.seatsLeft != null && event.seatsLeft < 5 ? 'text-red-500' : 'text-emerald-600'}`}>
                            <Users aria-hidden="true" size={12} />
                            {event.seatsLeft != null && event.seatsLeft < 5
                              ? et('almost_full')
                              : et('spots_available')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    {event.registrationUrl ? (
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2.5 church-gradient text-white text-sm font-bold rounded-full shadow-md hover:shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-2"
                      >
                        <ClipboardList aria-hidden="true" size={14} />
                        {et('register')}
                      </a>
                    ) : (
                      <Link
                        href={`/${locale}/events`}
                        className="shrink-0 inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 bg-gray-100 text-gray-500 text-sm font-medium rounded-full hover:bg-wine-50 hover:text-wine-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-2"
                      >
                        {et('view_detail')}
                      </Link>
                    )}
                  </div>
                </div>
                </FadeIn>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
