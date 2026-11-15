'use client';

import { useState, useEffect, type ComponentType } from 'react';

export default function SiteMap3DLoader({ locale }: { locale: string }) {
  const [SiteMap3D, setSiteMap3D] = useState<ComponentType<{ locale: string }> | null>(null);

  useEffect(() => {
    import('./SiteMap3D').then((m) => setSiteMap3D(() => m.default));
  }, []);

  if (!SiteMap3D) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/40 text-sm animate-pulse">載入星球地圖中…</div>
      </div>
    );
  }

  return <SiteMap3D locale={locale} />;
}
