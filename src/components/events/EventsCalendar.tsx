'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MapPin, Clock, X, ZoomIn, ClipboardList, Users } from 'lucide-react';
import type { DisplayEvent } from '@/lib/sanity/queries';

const categoryColors: Record<string, string> = {
  worship:   'border-l-wine-500 bg-wine-50/60',
  family:    'border-l-rose-400 bg-rose-50/60',
  youth:     'border-l-purple-500 bg-purple-50/60',
  community: 'border-l-emerald-500 bg-emerald-50/60',
  retreat:   'border-l-amber-400 bg-amber-50/80 ring-1 ring-amber-200',
  training:  'border-l-teal-500 bg-teal-50/60',
};

const categoryBadge: Record<string, string> = {
  worship:   'bg-wine-100 text-wine-700 border-wine-200',
  family:    'bg-rose-100 text-rose-700 border-rose-200',
  youth:     'bg-purple-100 text-purple-700 border-purple-200',
  community: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  retreat:   'bg-amber-400 text-amber-950 border-amber-500 font-bold',
  training:  'bg-teal-100 text-teal-700 border-teal-200',
};

const categoryLabels: Record<string, { zh: string; en: string; my: string; ja: string }> = {
  worship:   { zh: '崇拜', en: 'Worship',   my: 'ဝတ်ပြုကိုးကွယ်ခြင်း', ja: '礼拝' },
  family:    { zh: '家庭', en: 'Family',    my: 'မိသားစု',               ja: 'ファミリー' },
  youth:     { zh: '青年', en: 'Youth',     my: 'လူငယ်',                 ja: '青年' },
  community: { zh: '社區', en: 'Community', my: 'လူ့အဖွဲ့',              ja: 'コミュニティ' },
  retreat:   { zh: '退修', en: 'Retreat',   my: 'နုတ်ပယ်ခြင်း',          ja: 'リトリート' },
  training:  { zh: '訓練', en: 'Training',  my: 'သင်တန်း',               ja: '訓練' },
};

interface EventsCalendarProps {
  locale: string;
  events: DisplayEvent[];
}

export default function EventsCalendar({ locale, events }: EventsCalendarProps) {
  const t = useTranslations('events');
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const zh = locale === 'zh-TW';
  const t4 = (zhStr: string, myStr: string, jaStr: string, enStr: string) =>
    zh ? zhStr : locale === 'my' ? myStr : locale === 'ja' ? jaStr : enStr;
  const catLabel = (cat: string) =>
    zh ? categoryLabels[cat].zh : locale === 'my' ? categoryLabels[cat].my : locale === 'ja' ? categoryLabels[cat].ja : categoryLabels[cat].en;

  const filters = ['all', ...Object.keys(categoryLabels)];
  const filtered = activeFilter === 'all'
    ? events
    : events.filter((e) => e.category === activeFilter);

  if (!events.length) {
    return (
      <section className="py-24 px-4 text-center text-gray-400">
        {t4('目前沒有即將到來的活動，請稍後回來查看。', 'ကျင်းပမည့် ပွဲများ မရှိသေးပါ။ နောက်မှ ပြန်ကြည့်ပါ။', '現在、予定されているイベントはありません。後でご確認ください。', 'No upcoming events at the moment. Please check back later.')}
      </section>
    );
  }

  return (
    <>
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === f
                  ? 'church-gradient text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-wine-50 hover:text-wine-700'
              }`}
            >
              {f === 'all'
                ? t4('全部', 'အားလုံး', 'すべて', 'All')
                : catLabel(f)}
            </button>
          ))}
        </div>

        {/* Events */}
        <div className="space-y-6">
          {filtered.map((event) => {
            const [year, month, day] = event.date.split('-');
            return (
              <div
                key={event.id}
                className={`rounded-2xl border-l-4 border border-l-[inherit] border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${categoryColors[event.category]}`}
              >
                {/* Poster image */}
                {event.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setLightboxSrc(event.imageUrl!)}
                    className="relative w-full block group focus:outline-none"
                    aria-label={t4('查看完整海報', 'ပိုစတာ အပြည့်ကြည့်ရန်', 'ポスターを見る', 'View full poster')}
                  >
                    <Image
                      src={event.imageUrl}
                      alt={zh ? event.titleZh : event.titleEn}
                      width={800}
                      height={1200}
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.01]"
                      sizes="(max-width: 896px) 100vw, 896px"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold text-wine-900 shadow-lg">
                        <ZoomIn size={15} />
                        {t4('查看完整海報', 'ပိုစတာ အပြည့်ကြည့်ရန်', 'ポスターを見る', 'View full poster')}
                      </div>
                    </div>
                  </button>
                )}

                {/* Main content */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Date badge */}
                    <div className="church-gradient rounded-2xl px-4 py-3 text-center shrink-0 min-w-[68px] shadow-md self-start">
                      <p className="text-[10px] font-bold text-wine-200 tracking-widest">{month}</p>
                      <p className="text-3xl font-black text-white leading-tight">{day}</p>
                      <p className="text-[10px] text-wine-300">{year}</p>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${categoryBadge[event.category]}`}>
                          {catLabel(event.category)}
                        </span>
                        {event.fee === 0 ? (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold">
                            {t('free')}
                          </span>
                        ) : event.fee != null && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 font-semibold">
                            NT${event.fee.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-wine-900 mb-2">
                        {zh ? event.titleZh : event.titleEn}
                      </h3>

                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {zh ? event.descriptionZh : event.descriptionEn}
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={12} className="text-wine-400" />
                          {zh ? event.locationZh : event.locationEn}
                        </span>
                        {event.seats != null && (
                          <span className={`flex items-center gap-1.5 font-semibold ${event.seatsLeft != null && event.seatsLeft < 5 ? 'text-red-500' : 'text-emerald-600'}`}>
                            <Users size={12} />
                            {event.seatsLeft != null && event.seatsLeft < 5
                              ? t4('名額即將額滿', 'နေရာနီးပါး ပြည့်နေသည်', '残りわずか', 'Almost full')
                              : t4('尚有名額', 'နေရာရှိသေးသည်', '残席あり', 'Spots available')}
                          </span>
                        )}
                      </div>

                      {/* Registration button */}
                      {event.registrationUrl && (
                        <a
                          href={event.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white church-gradient shadow-md hover:shadow-lg hover:opacity-90 active:scale-95 transition-all duration-200"
                        >
                          <ClipboardList size={15} />
                          {t4('立即報名', 'မှတ်ပုံတင်ရန်', '今すぐ登録', 'Register Now')}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Course schedule sub-items */}
                {event.courseItems && event.courseItems.length > 0 && (
                  <div className="border-t border-gray-100 bg-white/70 px-6 py-5">
                    <p className="text-xs font-bold text-wine-700 tracking-wider uppercase mb-3 flex items-center gap-2">
                      <Clock size={12} />
                      {t4('課程時間表', 'သင်တန်းဇယား', 'スケジュール', 'Course Schedule')}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {event.courseItems.map((item) => (
                        <div
                          key={item.nameZh}
                          className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm"
                        >
                          <div className="w-8 h-8 church-gradient rounded-lg flex items-center justify-center shrink-0">
                            <Clock size={14} className="text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-wine-900 text-sm">
                              {zh ? item.nameZh : item.nameEn}
                            </p>
                            <p className="text-xs text-amber-600 font-medium">
                              {item.day} {item.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* Poster lightbox */}
    {lightboxSrc && (
      <div
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        onClick={() => setLightboxSrc(null)}
      >
        <button
          onClick={() => setLightboxSrc(null)}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <div
          className="relative max-w-lg w-full max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          <Image
            src={lightboxSrc}
            alt="Event poster"
            width={600}
            height={900}
            className="w-full h-auto max-h-[90vh] object-contain rounded-xl shadow-2xl"
            unoptimized
          />
        </div>
      </div>
    )}
    </>
  );
}
