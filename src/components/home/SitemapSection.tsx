'use client';

import { useTranslations, useLocale } from 'next-intl';
import SiteMap3DLoader from '@/components/sitemap/SiteMap3DLoader';

export default function SitemapSection() {
  const t = useTranslations('home');
  const locale = useLocale();

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0a0608]"
      style={{
        height: 'clamp(560px, 72vh, 760px)',
        // Fade out at bottom into next section (StatsBar)
        maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
      }}
    >
      {/* Full interactive 3D scene */}
      <SiteMap3DLoader locale={locale} />

      {/* Top-left label overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none select-none">
        <p className="text-[10px] font-bold tracking-[0.35em] uppercase" style={{ color: '#c9a040' }}>
          ✦ {locale === 'zh-TW' ? '網站地圖' : locale === 'ja' ? 'サイトマップ' : locale === 'my' ? 'ဆိုဒ်မြေပုံ' : 'Site Map'}
        </p>
        <p className="mt-1 text-sm font-semibold text-white/80" style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1rem)' }}>
          {t('sitemap_preview.title')}
        </p>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none">
        <p className="text-[11px] text-white/35 tracking-wide text-center">
          {locale === 'zh-TW' ? '拖曳旋轉 · 滾輪縮放 · 點擊星球前往' : locale === 'ja' ? 'ドラッグ回転 · スクロール拡縮 · クリックで移動' : locale === 'my' ? 'ဆွဲပြောင်းပါ · ချဲ့ကြည့်ပါ · နှိပ်၍သွားပါ' : 'Drag · Scroll · Click to navigate'}
        </p>
      </div>
    </section>
  );
}
