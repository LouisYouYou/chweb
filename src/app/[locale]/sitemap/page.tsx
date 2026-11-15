import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import SiteMap3DLoader from '@/components/sitemap/SiteMap3DLoader';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '網站地圖 · Site Map',
    description: '以 3D 星球圖探索南勢角榮耀堂網站的所有頁面',
  };
}

export default async function SitemapPage() {
  const locale = await getLocale();

  return (
    <main className="fixed inset-0 bg-[#0a0608] overflow-hidden z-[9999]">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 pt-6 pb-4 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(10,6,8,0.85) 0%, transparent 100%)' }}
      >
        <p className="text-xs tracking-[0.3em] uppercase font-semibold text-[#c9a060]/70 mb-1">
          {locale === 'zh-TW' ? '網站地圖' : 'SITE MAP'}
        </p>
        <h1 className="text-2xl font-bold text-white/90">
          {locale === 'zh-TW' ? '探索我們的世界' : 'Explore Our World'}
        </h1>
      </div>

      {/* Back button */}
      <div className="absolute top-6 right-6 z-10">
        <a
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/60 text-xs hover:border-white/40 hover:text-white/90 transition-all backdrop-blur-sm"
        >
          ← {locale === 'zh-TW' ? '返回首頁' : 'Back'}
        </a>
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <SiteMap3DLoader locale={locale} />
      </div>
    </main>
  );
}
