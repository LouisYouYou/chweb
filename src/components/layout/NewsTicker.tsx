import { getLocale } from 'next-intl/server';
import TickerTrack, { type TickerItem } from './TickerTrack';
import { getUpcomingEvents, getAnnouncements } from '@/lib/sanity/queries';

const categoryDot: Record<string, string> = {
  worship:   'bg-wine-700/80 text-wine-200',
  youth:     'bg-purple-700/80 text-purple-200',
  community: 'bg-emerald-700/80 text-emerald-200',
  retreat:   'bg-amber-700/80 text-amber-200',
  training:  'bg-teal-700/80 text-teal-200',
};

const typeBadge: Record<string, string> = {
  event:  'bg-amber-500/80 text-white',
  notice: 'bg-sky-500/80 text-white',
  urgent: 'bg-red-500/90 text-white',
};

const typeLabel: Record<string, { zh: string; en: string }> = {
  event:  { zh: '活動', en: 'Event' },
  notice: { zh: '通知', en: 'Notice' },
  urgent: { zh: '緊急', en: 'Urgent' },
};

const categoryLabel: Record<string, { zh: string; en: string }> = {
  worship:   { zh: '崇拜', en: 'Worship' },
  youth:     { zh: '青年', en: 'Youth' },
  community: { zh: '社區', en: 'Community' },
  retreat:   { zh: '退修', en: 'Retreat' },
  training:  { zh: '訓練', en: 'Training' },
};

const sectionLabels: Record<string, string> = {
  'zh-TW': '最新消息',
  en: 'NEWS',
  my: 'သတင်း',
};

export default async function NewsTicker() {
  const locale = await getLocale();
  const zh = locale !== 'en' && locale !== 'my';

  const [events, announcements] = await Promise.all([
    getUpcomingEvents(6),
    getAnnouncements(),
  ]);

  const items: TickerItem[] = [
    // Announcements first (pinned/urgent priority already sorted in query)
    ...announcements.map((a): TickerItem => ({
      id: `ann-${a._id}`,
      label: zh ? typeLabel[a.type]?.zh : typeLabel[a.type]?.en,
      labelColor: typeBadge[a.type] ?? typeBadge.notice,
      text: zh ? a.titleZh : (a.titleEn || a.titleZh),
      href: a.link,
    })),
    // Then upcoming events
    ...events.map((ev): TickerItem => {
      const [, month, day] = ev.date.split('-');
      const catKey = ev.category;
      return {
        id: `ev-${ev._id}`,
        label: zh
          ? categoryLabel[catKey]?.zh ?? catKey
          : categoryLabel[catKey]?.en ?? catKey,
        labelColor: categoryDot[catKey] ?? categoryDot.community,
        text: `${month}/${day}  ${zh ? ev.titleZh : ev.titleEn}`,
        href: `/${locale}/events`,
      };
    }),
  ];

  if (!items.length) return null;

  return <TickerTrack items={items} sectionLabel={sectionLabels[locale] ?? sectionLabels['zh-TW']} />;
}
