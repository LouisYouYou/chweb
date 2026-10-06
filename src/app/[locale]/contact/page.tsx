import type { Metadata } from 'next'
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

export default function ContactPage() {
  return <ContactForm />
}
