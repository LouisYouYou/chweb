import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { Bell, AlertCircle, Calendar, ExternalLink, Pin } from 'lucide-react';
import { getAnnouncements } from '@/lib/sanity/queries';

const typeConfig: Record<string, {
  icon: typeof Bell;
  badge: string;
  bar: string;
  labelZh: string;
  labelEn: string;
  labelMy: string;
  labelJa: string;
}> = {
  event:  { icon: Calendar,    badge: 'bg-amber-100 text-amber-700 border-amber-200', bar: 'bg-amber-400', labelZh: '活動', labelEn: 'Event',  labelMy: 'အစီအစဉ်',               labelJa: 'イベント' },
  notice: { icon: Bell,        badge: 'bg-sky-100 text-sky-700 border-sky-200',       bar: 'bg-sky-400',   labelZh: '通知', labelEn: 'Notice', labelMy: 'အကြောင်းကြားချက်',      labelJa: 'お知らせ' },
  urgent: { icon: AlertCircle, badge: 'bg-red-100 text-red-700 border-red-200',       bar: 'bg-red-500',   labelZh: '緊急', labelEn: 'Urgent', labelMy: 'အရေးပေါ်',               labelJa: '緊急' },
};

export default async function AnnouncementBanner() {
  const locale = await getLocale();
  const announcements = await getAnnouncements();

  if (!announcements.length) return null;

  const zh = locale === 'zh-TW';
  const badgeLabel = (cfg: typeof typeConfig[string]) =>
    zh ? cfg.labelZh : locale === 'my' ? cfg.labelMy : locale === 'ja' ? cfg.labelJa : cfg.labelEn;
  const headerText =
    zh ? '最新公告' : locale === 'my' ? 'ကြေငြာချက်' : locale === 'ja' ? 'お知らせ' : 'Announcements';
  const pinnedText =
    zh ? '置頂' : locale === 'ja' ? '固定' : 'Pinned';

  return (
    <section className="py-10 px-4 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center gap-2 text-sm font-bold text-wine-700 tracking-wide">
            <Bell aria-hidden="true" size={14} className="text-amber-500" />
            {headerText}
          </span>
          <div aria-hidden="true" className="flex-1 h-px bg-gradient-to-r from-amber-300/50 to-transparent" />
        </div>

        {/* Announcement cards */}
        <div className="space-y-3">
          {announcements.map((item) => {
            const cfg = typeConfig[item.type] ?? typeConfig.notice;
            const Icon = cfg.icon;
            const title   = zh ? item.titleZh   : (item.titleEn   || item.titleZh);
            const content = zh ? item.contentZh : (item.contentEn || item.contentZh);

            const inner = (
              <div className={`relative flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm overflow-hidden
                ${item.link ? 'hover:border-wine-200 hover:shadow-md transition-all group' : ''}`}>
                {/* Left colour bar */}
                <div aria-hidden="true" className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${cfg.bar}`} />

                {/* Icon */}
                <div aria-hidden="true" className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${cfg.badge}`}>
                  <Icon aria-hidden="true" size={16} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                      {badgeLabel(cfg)}
                    </span>
                    {item.isPinned && (
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Pin aria-hidden="true" size={10} />
                        {pinnedText}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-wine-900 text-base leading-snug">{title}</p>
                  {content && (
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed whitespace-pre-line line-clamp-4">{content}</p>
                  )}
                </div>

                {item.link && (
                  <ExternalLink aria-hidden="true" size={15} className="shrink-0 text-gray-300 group-hover:text-wine-500 transition-colors mt-1" />
                )}
              </div>
            );

            if (!item.link) return <div key={item._id}>{inner}</div>;

            const isExternal = item.link.startsWith('http');
            return isExternal ? (
              <a
                key={item._id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-2"
              >
                {inner}
              </a>
            ) : (
              <Link
                key={item._id}
                href={item.link}
                className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-2"
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
