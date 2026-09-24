import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server';
import { Heart, BookOpen, Users, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: '關於我們',
  description: '認識行道會南勢角榮耀堂。我們的使命、異象與核心價值，以及教會的歷史與信仰立場。',
}

const iconMap = { heart: Heart, book: BookOpen, users: Users, globe: Globe };

export default async function AboutPage() {
  const t = await getTranslations('about');

  const values = [
    { icon: 'heart' as const, title: t('values.0.title'), text: t('values.0.text') },
    { icon: 'book' as const, title: t('values.1.title'), text: t('values.1.text') },
    { icon: 'users' as const, title: t('values.2.title'), text: t('values.2.text') },
    { icon: 'globe' as const, title: t('values.3.title'), text: t('values.3.text') },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="church-gradient py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full" />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-wine-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-wine-900 mb-4">{t('mission_title')}</h2>
            <p className="text-gray-600 leading-relaxed">{t('mission_text')}</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-wine-900 mb-4">{t('vision_title')}</h2>
            <p className="text-gray-600 leading-relaxed">{t('vision_text')}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-wine-900 mb-2">{t('values_title')}</h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon, title, text }) => {
              const Icon = iconMap[icon];
              return (
                <div key={title} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 church-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-bold text-wine-900 text-lg mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-wine-900 mb-6">{t('history_title')}</h2>
          <p className="text-gray-600 leading-relaxed text-lg">{t('history_text')}</p>
        </div>
      </section>
    </div>
  );
}
