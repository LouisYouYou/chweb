import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildMetadata, pageSEO } from '@/lib/seo/metadata'
import ContactForm from './ContactForm'
import PageHero from '@/components/layout/PageHero'

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
      <PageHero title={t('title')} subtitle={t('subtitle')} />
      <ContactForm />
    </>
  )
}
