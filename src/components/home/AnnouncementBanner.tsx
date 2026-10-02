import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { Calendar, ChevronRight, MapPin } from 'lucide-react';
import { getUpcomingEvents } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/client';

const categoryConfig: Record<string, {
  zh: string; en: string;
  badge: string; bar: string;
}> = {
  worship:   { zh: '崇拜', en: 'Worship',   badge: 'bg-wine-100 text-wine-700 border-wine-200',       bar: 'bg-wine-500' },
  youth:     { zh: '青年', en: 'Youth',     badge: 'bg-purple-100 text-purple-700 border-purple-200', bar: 'bg-purple-500' },
  community: { zh: '社區', en: 'Community', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' },
  retreat:   { zh: '退修', en: 'Retreat',   badge: 'bg-amber-100 text-amber-700 border-amber-200',     bar: 'bg-amber-500' },
  training:  { zh: '訓練', en: 'Training',  badge: 'bg-teal-100 text-teal-700 border-teal-200',        bar: 'bg-teal-500' },
};

const localeLabel: Record<string, string> = {
  'zh-TW': '近期活動', en: 'Upcoming Events', my: 'ထိုင်းမာ',
};
const viewAllLabel: Record<string, string> = {
  'zh-TW': '查看全部', en: 'View all', my: 'အားလုံးကြည့်',
};

export default async function AnnouncementBanner() {
  const locale = await getLocale();
  const raw = await getUpcomingEvents(5);

  if (!raw.length) return null;

  const zh = locale !== 'en' && locale !== 'my';

  const events = raw.map((ev) => ({
    id: ev._id,
    titleZh: ev.titleZh,
    titleEn: ev.titleEn,
    date: ev.date,
    time: ev.time,
    locationZh: ev.locationZh,
    locationEn: ev.locationEn,
    category: ev.category,
    fee: ev.fee,
    imageUrl: ev.image ? urlFor(ev.image).width(120).height(120).auto('format').url() : undefined,
  }));

  return (
    <section className="py-10 px-4 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <span className="flex items-center gap-2 text-sm font-bold text-wine-700 tracking-wide">
            <Calendar size={14} className="text-amber-500" />
            {localeLabel[locale] ?? localeLabel['zh-TW']}
          </span>
          <Link
            href={`/${locale}/events`}
            className="text-xs text-gray-400 hover:text-wine-600 flex items-center gap-0.5 transition-colors"
          >
            {viewAllLabel[locale] ?? viewAllLabel['zh-TW']}
            <ChevronRight size={12} />
          </Link>
        </div>

        {/* Event rows */}
        <div className="divide-y divide-gray-50">
          {events.map((event) => {
            const [, month, day] = event.date.split('-');
            const cfg = categoryConfig[event.category] ?? categoryConfig.community;
            const title = zh ? event.titleZh : event.titleEn;
            const location = zh ? event.locationZh : event.locationEn;

            return (
              <Link
                key={event.id}
                href={`/${locale}/events`}
                className="flex items-center gap-4 py-3.5 group"
              >
                {/* Date badge */}
                <div className="church-gradient rounded-xl w-11 text-center py-1.5 shrink-0 shadow-sm">
                  <p className="text-[9px] font-bold text-wine-200 tracking-widest leading-none">{month}</p>
                  <p className="text-lg font-black text-white leading-tight">{day}</p>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-[10px] font-semibold px-2 py-px rounded-full border ${cfg.badge}`}>
                      {zh ? cfg.zh : cfg.en}
                    </span>
                    {event.fee === 0 && (
                      <span className="text-[10px] font-semibold px-2 py-px rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                        {zh ? '免費' : 'Free'}
                      </span>
                    )}
                    {event.fee != null && event.fee > 0 && (
                      <span className="text-[10px] font-medium text-gray-400">NT${event.fee}</span>
                    )}
                  </div>
                  <p className="font-semibold text-wine-900 text-sm leading-snug group-hover:text-wine-600 transition-colors">
                    {title}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                    {event.time && <span>{event.time}</span>}
                    {location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={10} className="text-wine-300" />
                        {location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Thumbnail */}
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt=""
                    aria-hidden="true"
                    className="w-12 h-12 rounded-lg object-cover shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                )}

                <ChevronRight size={14} className="text-gray-300 group-hover:text-wine-400 transition-colors shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
