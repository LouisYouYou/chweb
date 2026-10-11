import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Clock, Users, MapPin, Mail, ArrowRight } from 'lucide-react';

const steps = [
  { key: 'step1', icon: Clock, color: 'bg-wine-50 text-wine-600', href: 'services' },
  { key: 'step2', icon: Users, color: 'bg-amber-50 text-amber-600', href: 'about' },
  { key: 'step3', icon: MapPin, color: 'bg-green-50 text-green-600', href: 'services' },
  { key: 'step4', icon: Mail, color: 'bg-purple-50 text-purple-600', href: 'contact' },
] as const;

export default function WelcomeSection() {
  const t = useTranslations('welcome');
  const locale = useLocale();

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-[#fdfaf5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full tracking-wide mb-4">
            {t('badge')}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-wine-900 mb-4">{t('title')}</h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">{t('subtitle')}</p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-6" aria-hidden="true" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(({ key, icon: Icon, color, href }) => (
            <Link
              key={key}
              href={`/${locale}/${href}`}
              className="bezel-card welcome-haptic-cta group"
            >
              <div className="bezel-card-inner flex flex-col p-6 h-full">
                <div aria-hidden="true" className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="font-bold text-wine-900 mb-2 text-base">{t(`${key}_title` as Parameters<typeof t>[0])}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{t(`${key}_text` as Parameters<typeof t>[0])}</p>
                <div className="mt-4 flex items-center justify-between gap-2" aria-hidden="true">
                  <span className="text-xs font-semibold text-wine-500 group-hover:text-wine-700 transition-colors">
                    {t('cta')}
                  </span>
                  <span className="cta-icon-island">
                    <ArrowRight size={12} aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
