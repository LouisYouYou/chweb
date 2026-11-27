import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Clock, Users, MapPin, Mail } from 'lucide-react';

const steps = [
  { key: 'step2', icon: Users,  iconBg: 'bg-gradient-to-br from-wine-500 to-wine-700',       ctaColor: 'text-wine-600 group-hover:text-wine-700',          href: 'first-visit' },
  { key: 'step1', icon: Clock,  iconBg: 'bg-gradient-to-br from-wine-600 to-rose-700',       ctaColor: 'text-wine-600 group-hover:text-wine-700',          href: 'services'    },
  { key: 'step3', icon: MapPin, iconBg: 'bg-gradient-to-br from-gold-warm-500 to-amber-600', ctaColor: 'text-gold-warm-600 group-hover:text-gold-warm-700', href: 'services'    },
  { key: 'step4', icon: Mail,   iconBg: 'bg-gradient-to-br from-wine-800 to-rose-900',       ctaColor: 'text-wine-700 group-hover:text-wine-800',          href: 'contact'     },
] as const;

export default function WelcomeSection() {
  const t = useTranslations('welcome');
  const locale = useLocale();

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-warm-white to-[#EDE8DF]/40">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-wine-50 text-wine-700 text-xs font-semibold rounded-full tracking-wide mb-4">
            {t('badge')}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink-800 mb-4">
            {t('title')}
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
          <div
            aria-hidden="true"
            className="w-16 h-0.5 mx-auto mt-6"
            style={{ background: 'linear-gradient(90deg, transparent, #AD8C60, transparent)' }}
          />
        </div>

        {/* Editorial chapter list */}
        <div className="divide-y divide-wine-50">
          {steps.map(({ key, icon: Icon, iconBg, ctaColor, href }, idx) => (
            <Link
              key={key}
              href={`/${locale}/${href}`}
              className="group relative flex items-center gap-5 sm:gap-8 py-7 -mx-4 px-4 transition-colors duration-200 hover:bg-wine-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-500 focus-visible:ring-inset"
            >
              {/* Faint ordinal — decorative only */}
              <span
                aria-hidden="true"
                className="hidden md:block font-black text-wine-100 select-none leading-none shrink-0 w-16 text-right transition-colors duration-200 group-hover:text-wine-200"
                style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)' }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Icon badge */}
              <div
                aria-hidden="true"
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg} shadow-md transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none`}
              >
                <Icon size={21} className="text-white" aria-hidden="true" />
              </div>

              {/* Title + body */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-ink-800 text-base sm:text-lg mb-1 transition-colors duration-200 group-hover:text-wine-800">
                  {t(`${key}_title` as Parameters<typeof t>[0])}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {t(`${key}_text` as Parameters<typeof t>[0])}
                </p>
              </div>

              {/* CTA — right column, text with reveal underline */}
              <div className="shrink-0 pl-5 sm:pl-8 border-l border-wine-100 self-stretch flex items-center">
                <span className={`text-xs sm:text-sm font-semibold relative inline-block pb-px ${ctaColor}`}>
                  {t('cta')}
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out motion-reduce:transition-none"
                    style={{ background: 'currentColor' }}
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
