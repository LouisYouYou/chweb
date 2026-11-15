import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Clock, Users, MapPin, Mail, ArrowRight } from 'lucide-react';

const steps = [
  { key: 'step1', icon: Clock,  iconBg: 'bg-gradient-to-br from-wine-500 to-rose-600',     iconText: 'text-white', ctaColor: 'text-wine-600 group-hover:text-wine-700',     href: 'services' },
  { key: 'step2', icon: Users,  iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',  iconText: 'text-white', ctaColor: 'text-emerald-600 group-hover:text-emerald-700', href: 'first-visit' },
  { key: 'step3', icon: MapPin, iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',  iconText: 'text-white', ctaColor: 'text-amber-600 group-hover:text-amber-700',     href: 'services' },
  { key: 'step4', icon: Mail,   iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-600', iconText: 'text-white', ctaColor: 'text-purple-600 group-hover:text-purple-700',   href: 'contact' },
] as const;

export default function WelcomeSection() {
  const t = useTranslations('welcome');
  const locale = useLocale();

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-warm-white to-[#EDE8DF]/40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-wine-50 text-wine-700 text-xs font-semibold rounded-full tracking-wide mb-4">
            {t('badge')}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink-800 mb-4">{t('title')}</h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">{t('subtitle')}</p>
          <div className="w-16 h-0.5 mx-auto mt-6" style={{ background: 'linear-gradient(90deg, transparent, #AD8C60, transparent)' }} aria-hidden="true" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(({ key, icon: Icon, iconBg, iconText, ctaColor, href }) => (
            <Link
              key={key}
              href={`/${locale}/${href}`}
              className="bezel-card welcome-haptic-cta group"
            >
              <div className="bezel-card-inner flex flex-col p-6 h-full">
                <div aria-hidden="true" className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBg} ${iconText} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="font-bold text-ink-800 mb-2 text-base">{t(`${key}_title` as Parameters<typeof t>[0])}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{t(`${key}_text` as Parameters<typeof t>[0])}</p>
                <div className="mt-4 flex items-center justify-between gap-2" aria-hidden="true">
                  <span className={`text-xs font-semibold transition-colors ${ctaColor}`}>
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
