'use client';

import { useTranslations, useLocale } from 'next-intl';
import SiteMap3DLoader from '@/components/sitemap/SiteMap3DLoader';

const HINT = {
  'zh-TW': '拖曳旋轉 · 點選星球後再開啟',
  ja: 'ドラッグで回転 · 惑星を選んで開く',
  my: 'ဆွဲ၍လှည့်ပါ · ရွေးပြီးမှ ဖွင့်ပါ',
  en: 'Drag to rotate · Select a planet, then open',
} as const;

export default function SitemapSection() {
  const t = useTranslations('home');
  const locale = useLocale();
  const hint = HINT[locale as keyof typeof HINT] ?? HINT.en;

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0a0608]"
      style={{
        height: 'clamp(560px, 72vh, 760px)',
        maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
      }}
    >
      <SiteMap3DLoader locale={locale} embedded />

      {/* Top blend — merges Hero's wine-950 bottom into deep-space background */}
      <div
        className="absolute inset-x-0 top-0 h-20 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to bottom, #2e0a11 0%, transparent 100%)' }}
      />

      <div className="absolute top-6 left-6 z-10 pointer-events-none select-none">
        <p className="text-[10px] font-bold tracking-[0.35em] uppercase" style={{ color: '#c9a040' }}>
          ✦ {t('sitemap_preview.eyebrow')}
        </p>
        <p className="mt-1 text-sm font-semibold text-white/80" style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1rem)' }}>
          {t('sitemap_preview.title')}
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none">
        <p className="text-[11px] text-white/35 tracking-wide text-center">
          {hint}
        </p>
      </div>
    </section>
  );
}
