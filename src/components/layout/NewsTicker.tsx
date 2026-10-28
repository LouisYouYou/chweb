import { getLocale } from 'next-intl/server';
import TickerTrack, { type TickerItem } from './TickerTrack';
import { getUpcomingEvents, getAnnouncements } from '@/lib/sanity/queries';

const categoryDot: Record<string, string> = {
  worship:   'bg-wine-700/80 text-wine-200',
  family:    'bg-rose-700/80 text-rose-200',
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

const typeLabel: Record<string, { zh: string; en: string; my: string; ja: string }> = {
  event:  { zh: '活動', en: 'Event',  my: 'ပွဲ',            ja: 'イベント' },
  notice: { zh: '通知', en: 'Notice', my: 'အကြောင်းကြား', ja: 'お知らせ' },
  urgent: { zh: '緊急', en: 'Urgent', my: 'အရေးပေါ်',      ja: '緊急' },
};

const categoryLabel: Record<string, { zh: string; en: string; my: string; ja: string }> = {
  worship:   { zh: '崇拜', en: 'Worship',   my: 'ဝတ်ပြုကိုးကွယ်ခြင်း', ja: '礼拝' },
  family:    { zh: '家庭', en: 'Family',    my: 'မိသားစု',               ja: 'ファミリー' },
  youth:     { zh: '青年', en: 'Youth',     my: 'လူငယ်',                 ja: '青年' },
  community: { zh: '社區', en: 'Community', my: 'လူ့အဖွဲ့',              ja: 'コミュニティ' },
  retreat:   { zh: '退修', en: 'Retreat',   my: 'နုတ်ပယ်ခြင်း',          ja: 'リトリート' },
  training:  { zh: '訓練', en: 'Training',  my: 'သင်တန်း',               ja: '訓練' },
};

const sectionLabels: Record<string, string> = {
  'zh-TW': '最新消息',
  en: 'NEWS',
  my: 'သတင်း',
  ja: '最新情報',
};

export default async function NewsTicker() {
  const locale = await getLocale();
  const zh = locale === 'zh-TW';

  const [events, announcements] = await Promise.all([
    getUpcomingEvents(6),
    getAnnouncements(),
  ]);

  const items: TickerItem[] = [
    // Announcements first (pinned/urgent priority already sorted in query)
    ...announcements.map((a): TickerItem => ({
      id: `ann-${a._id}`,
      label: zh ? typeLabel[a.type]?.zh : locale === 'my' ? typeLabel[a.type]?.my : locale === 'ja' ? typeLabel[a.type]?.ja : typeLabel[a.type]?.en,
      labelColor: typeBadge[a.type] ?? typeBadge.notice,
      text: zh ? a.titleZh : (a.titleEn || a.titleZh),
      href: a.link ?? `/${locale}#announcements`,
    })),
    // Then upcoming events
    ...events.map((ev): TickerItem => {
      const [, month, day] = ev.date.split('-');
      const catKey = ev.category;
      return {
        id: `ev-${ev._id}`,
        label: zh
          ? categoryLabel[catKey]?.zh ?? catKey
          : locale === 'my'
          ? categoryLabel[catKey]?.my ?? catKey
          : locale === 'ja'
          ? categoryLabel[catKey]?.ja ?? catKey
          : categoryLabel[catKey]?.en ?? catKey,
        labelColor: categoryDot[catKey] ?? categoryDot.community,
        text: `${month}/${day}  ${zh ? ev.titleZh : (ev.titleEn || ev.titleZh)}`,
        href: `/${locale}/events`,
      };
    }),
  ];

  // Fallback: always show recurring weekly gatherings so ticker is never empty
  if (!items.length) {
    const fallbackItems: TickerItem[] = [
      {
        id: 'fallback-sunday',
        label: zh ? '崇拜' : locale === 'my' ? 'ဝတ်ပြုကိုးကွယ်ခြင်း' : locale === 'ja' ? '礼拝' : 'Worship',
        labelColor: categoryDot.worship,
        text: zh
          ? '主日崇拜 — 每週日 10:00–11:30'
          : locale === 'ja'
          ? '主日礼拝 — 毎週日曜日 10:00–11:30'
          : locale === 'my'
          ? 'မိုးနေ့ ကိုးကွယ်ဝတ်ပြုခြင်း — တနင်္ဂနွေ 10:00–11:30'
          : 'Sunday Worship — Every Sunday 10:00–11:30',
        href: `/${locale}/services`,
      },
      {
        id: 'fallback-small-group',
        label: zh ? '小組' : locale === 'my' ? 'အုပ်စု' : locale === 'ja' ? '小グループ' : 'Group',
        labelColor: categoryDot.community,
        text: zh
          ? '小組聚會 — 每週二 19:30–21:00'
          : locale === 'ja'
          ? '小グループ集会 — 毎週火曜日 19:30–21:00'
          : locale === 'my'
          ? 'အုပ်စုကိုးကွယ်ဝတ်ပြုခြင်း — အင်္ဂါ 19:30–21:00'
          : 'Small Group — Every Tuesday 19:30–21:00',
        href: `/${locale}/services`,
      },
      {
        id: 'fallback-youth',
        label: zh ? '青年' : locale === 'my' ? 'လူငယ်' : locale === 'ja' ? '青年' : 'Youth',
        labelColor: categoryDot.youth,
        text: zh
          ? '青年聚會 — 每週六固定聚會'
          : locale === 'ja'
          ? '青年集会 — 毎週土曜日'
          : locale === 'my'
          ? 'လူငယ်ကိုးကွယ်ဝတ်ပြုခြင်း — စနေနေ့'
          : 'Youth Meeting — Every Saturday',
        href: `/${locale}/services`,
      },
    ];
    return <TickerTrack items={fallbackItems} sectionLabel={sectionLabels[locale] ?? sectionLabels['zh-TW']} />;
  }

  return <TickerTrack items={items} sectionLabel={sectionLabels[locale] ?? sectionLabels['zh-TW']} />;
}
