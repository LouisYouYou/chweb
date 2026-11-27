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
      className="relative w-full overflow-hidden bg-[#0d0608]"
      style={{
        height: 'clamp(560px, 72vh, 760px)',
        maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
      }}
    >
      {/* Radial wine ambient — anchors planets in brand colour space */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(56,10,20,0.18) 0%, transparent 70%)' }}
      />

      <SiteMap3DLoader locale={locale} embedded />

      {/* Top blend — warm tint at section edge, semi-transparent so Hero photo shows through */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to bottom, rgba(56,10,20,0.25) 0%, transparent 100%)' }}
      />

      {/* Left-edge wine vignette — echoes Hero's warm left wash */}
      <div
        className="absolute inset-y-0 left-0 w-32 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to right, rgba(56,10,20,0.14) 0%, transparent 100%)' }}
      />

      <div className="absolute top-6 left-6 z-10 pointer-events-none select-none">
        <p className="text-[10px] font-bold" style={{ color: '#c9a84c' }}>
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
