'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { useTranslations } from 'next-intl';

export default function SiteMap3DLoader({ locale, embedded = false }: { locale: string; embedded?: boolean }) {
  const t = useTranslations('nav');
  const [View, setView] = useState<ComponentType<{ locale: string; embedded?: boolean }> | null>(null);

  useEffect(() => {
    let active = true;
    import('./SiteMap3D').then((module) => {
      if (active) setView(() => module.default);
    });
    return () => { active = false; };
  }, []);

  if (!View) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-white/45" role="status">
        {t('sitemap')}
      </div>
    );
  }

  return <View locale={locale} embedded={embedded} />;
}
