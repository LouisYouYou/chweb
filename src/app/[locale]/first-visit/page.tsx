import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import Link from 'next/link'
import {
  Heart, CalendarCheck, Clock3, UserRound,
  Baby, MapPin, ShieldCheck, Phone,
} from 'lucide-react'
import { buildMetadata, pageSEO } from '@/lib/seo/metadata'
import PageHero from '@/components/layout/PageHero'
import FadeIn from '@/components/ui/FadeIn'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata(locale, pageSEO.first_visit)
}

export default async function FirstVisitPage() {
  const [t, locale] = await Promise.all([
    getTranslations('first_visit'),
    getLocale(),
  ])

  const sections = [
    { icon: Heart,         q: t('q1_q'), a: t('q1_a') },
    { icon: CalendarCheck, q: t('q2_q'), a: t('q2_a') },
    { icon: Clock3,        q: t('q3_q'), a: t('q3_a') },
    { icon: UserRound,     q: t('q4_q'), a: t('q4_a') },
    { icon: Baby,          q: t('q5_q'), a: t('q5_a') },
    { icon: MapPin,        q: t('q6_q'), a: t('q6_a') },
    { icon: ShieldCheck,   q: t('q7_q'), a: t('q7_a') },
  ]

  return (
    <div>
      <PageHero title={t('page_title')} subtitle={t('page_subtitle')} />

      <section className="py-20 bg-[#fdfaf5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Intro */}
          <FadeIn>
            <p className="text-center text-gray-500 text-base sm:text-lg leading-relaxed mb-16 max-w-2xl mx-auto">
              {t('intro')}
            </p>
          </FadeIn>

          {/* Q&A cards */}
          <div className="space-y-4">
            {sections.map(({ icon: Icon, q, a }, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 flex gap-5 group hover:border-wine-100 hover:shadow-md transition-all duration-300">
                  <div className="shrink-0 w-11 h-11 church-gradient rounded-xl flex items-center justify-center shadow-sm shadow-wine-200 mt-0.5 group-hover:scale-105 transition-transform duration-300">
                    <Icon size={18} className="text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-bold text-wine-900 text-base sm:text-lg mb-2 leading-snug">
                      {q}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {a}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* CTA strip */}
          <FadeIn delay={500}>
            <div className="mt-20 bg-wine-900 rounded-3xl px-8 py-10 sm:px-12 sm:py-12 text-center relative overflow-hidden">
              <div aria-hidden="true" className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-wine-800/50 pointer-events-none" />
              <div aria-hidden="true" className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-amber-400/5 pointer-events-none" />

              <div className="relative">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {t('cta_heading')}
                </h3>
                <p className="text-wine-300 text-sm mb-8">
                  {t('cta_sub')}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 bg-amber-400 text-wine-900 font-bold rounded-full hover:bg-amber-300 text-sm transition-colors"
                  >
                    <Phone size={14} aria-hidden="true" />
                    {t('cta_contact')}
                  </Link>
                  <Link
                    href={`/${locale}/services`}
                    className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 text-sm transition-colors"
                  >
                    {t('cta_services')}
                  </Link>
                  <Link
                    href={`/${locale}/faq`}
                    className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 border border-white/15 text-wine-400 font-medium rounded-full hover:bg-white/5 hover:text-wine-300 text-sm transition-colors"
                  >
                    {t('cta_faq')}
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>

        </div>
      </section>
    </div>
  )
}
