import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildMetadata, pageSEO } from '@/lib/seo/metadata'
import ContactForm from './ContactForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata(locale, pageSEO.contact)
}

export default async function ContactPage() {
  const t = await getTranslations('contact')
  return (
    <>
      {/* Page opening — split: title left, contact info right, ink-950 */}
      <section
        className="relative bg-ink-950 overflow-hidden"
        style={{ minHeight: 'calc(13rem + 6.5rem)', marginTop: '-6.5rem', paddingTop: '6.5rem' }}
      >
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,#fff 1px,transparent 0)', backgroundSize:'32px 32px' }} />
        <div aria-hidden="true" className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 40%, rgba(201,168,76,0.06) 0%, transparent 65%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">{t('title')}</h1>
            <p className="text-ink-300 text-base max-w-md leading-relaxed">{t('subtitle')}</p>
          </div>
          <div className="hidden md:block border-l border-wine-800 pl-10 space-y-6">
            <div>
              <p className="text-xs text-wine-400 mb-1">{t('address')}</p>
              <p className="text-white text-sm font-medium leading-relaxed">新北市中和區忠孝街 39-15 號</p>
            </div>
            <div>
              <p className="text-xs text-wine-400 mb-1">{t('phone')}</p>
              <p className="text-white text-sm font-medium">(02) 8668-5515</p>
            </div>
            <div>
              <p className="text-xs text-wine-400 mb-1">{t('office_hours')}</p>
              <p className="text-white text-sm font-medium">{t('office_hours_text')}</p>
            </div>
          </div>
        </div>
      </section>
      <ContactForm />
    </>
  )
}
