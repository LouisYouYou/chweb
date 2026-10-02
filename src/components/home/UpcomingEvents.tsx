import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { Calendar, MapPin, ArrowRight, Users, Tag } from 'lucide-react';
import { getUpcomingEvents } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/client';

const categoryColors: Record<string, string> = {
  worship:   'bg-wine-100 text-wine-700 border-wine-200',
  youth:     'bg-purple-100 text-purple-700 border-purple-200',
  community: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  retreat:   'bg-amber-100 text-amber-700 border-amber-200',
  training:  'bg-teal-100 text-teal-700 border-teal-200',
};

const categoryLabels: Record<string, { zh: string; en: string }> = {
  worship:   { zh: '崇拜', en: 'Worship' },
  youth:     { zh: '青年', en: 'Youth' },
  community: { zh: '社區', en: 'Community' },
  retreat:   { zh: '退修', en: 'Retreat' },
  training:  { zh: '訓練', en: 'Training' },
};

const categoryAccent: Record<string, string> = {
  worship:   'border-l-wine-500',
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
    seatsLeft: ev.seatsLeft,
    imageUrl: ev.image ? urlFor(ev.image).width(400).auto('format').url() : undefined,
  }));

  if (!upcoming.length) return null;

  const zh = locale !== 'en' && locale !== 'my';

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-wine-50 opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
          <div>
            <p className="text-amber-600 text-xs font-bold tracking-[0.3em] uppercase mb-3">
              {zh ? 'EVENTS' : '活動'}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-wine-900 mb-3">{t('title')}</h2>
            <p className="text-gray-400 text-sm">{t('subtitle')}</p>
            <div className="divider-gold" style={{ margin: '16px 0 0' }} />
          </div>
          <Link
            href={`/${locale}/events`}
            className="flex items-center gap-2 text-wine-700 hover:text-wine-900 border border-wine-200 hover:border-wine-400 px-4 py-2 rounded-full text-sm font-semibold transition-all group"
          >
            {t('view_all')}
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="space-y-4">
          {upcoming.map((event) => {
            const [year, month, day] = event.date.split('-');
            return (
              <div
                key={event.id}
                className={`group bg-white rounded-2xl border-l-4 ${categoryAccent[event.category]} border border-l-[inherit] border-t-gray-100 border-r-gray-100 border-b-gray-100 p-6 card-lift`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  {/* Date badge */}
                  <div className="church-gradient rounded-2xl px-4 py-3 text-center shrink-0 min-w-[68px] shadow-md shadow-wine-200">
                    <p className="text-[10px] font-bold text-wine-200 tracking-widest uppercase">{month}</p>
                    <p className="text-3xl font-black text-white leading-tight">{day}</p>
                    <p className="text-[10px] text-wine-300">{year}</p>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${categoryColors[event.category]}`}>
                        <Tag size={9} className="inline mr-1 -mt-0.5" />
                        {zh ? categoryLabels[event.category].zh : categoryLabels[event.category].en}
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
                      {event.time && <span className="flex items-center gap-1.5"><Calendar size={12} className="text-wine-400" />{event.time}</span>}
                      {(zh ? event.locationZh : event.locationEn) && (
                        <span className="flex items-center gap-1.5"><MapPin size={12} className="text-wine-400" />{zh ? event.locationZh : event.locationEn}</span>
                      )}
                      {event.seatsLeft !== undefined && (
                        <span className="flex items-center gap-1.5">
                          <Users size={12} className="text-wine-400" />
                          <span className={event.seatsLeft < 10 ? 'text-red-500 font-semibold' : 'text-emerald-600 font-semibold'}>{event.seatsLeft}</span>
                          <span>{et('seats_left')}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/${locale}/events`}
                    className="shrink-0 px-5 py-2.5 church-gradient text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
                  >
                    {zh ? '查看詳情' : 'Details'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
