import { getTranslations, getLocale } from 'next-intl/server';
import SermonLibrary from '@/components/sermons/SermonLibrary';

export default async function SermonsPage() {
  const t = await getTranslations('sermons');
  const locale = await getLocale();

  return (
    <div>
      {/* Hero */}
      <section className="church-gradient py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-blue-200 text-lg">{t('subtitle')}</p>
          <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mt-6" />
        </div>
      </section>

      <SermonLibrary locale={locale} />
    </div>
  );
}
