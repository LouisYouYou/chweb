import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, MessageCircle } from 'lucide-react'
import { FAQ_DATA } from '@/lib/data/faq'

const BASE = 'https://nanshijiaoglory.vercel.app'

const META: Record<string, { title: string; description: string }> = {
  'zh-TW': {
    title: '常見問題 | 行道會南勢角榮耀堂',
    description:
      '行道會南勢角榮耀堂常見問題：主日崇拜時間、交通方式、緬甸語崇拜、YouTube直播、聯絡電話、奉獻方式等完整解答。',
  },
  en: {
    title: 'FAQ | NJC Glory Church (Nanshijiao Glory Church)',
    description:
      'Frequently asked questions about NJC Glory Church: service times, directions, Burmese worship, YouTube livestream, contact, and giving.',
  },
  my: {
    title: 'မေးလေ့ရှိသောမေးခွန်းများ | NJC Glory Church',
    description:
      'NJC Glory Church အကြောင်း မေးလေ့ရှိသောမေးခွန်းများ — ဝတ်ပြုကိုးကွယ်ချိန်၊ တည်နေရာ၊ မြန်မာဘာသာ ဝန်ဆောင်မှု။',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] ?? META['zh-TW']
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.description,
      url: `${BASE}/${locale}/faq`,
      type: 'website',
    },
    alternates: {
      canonical: `${BASE}/${locale}/faq`,
      languages: {
        'zh-TW': `${BASE}/zh-TW/faq`,
        en: `${BASE}/en/faq`,
        my: `${BASE}/my/faq`,
      },
    },
  }
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const data = FAQ_DATA[locale] ?? FAQ_DATA['zh-TW']

  // Flatten all FAQs for JSON-LD
  const allFaqs = data.categories.flatMap((cat) => cat.faqs)

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        '@id': `${BASE}/${locale}/faq#faqpage`,
        url: `${BASE}/${locale}/faq`,
        name: data.title,
        description: data.subtitle,
        mainEntity: allFaqs.map((faq) => ({
          '@type': 'Question',
          '@id': `${BASE}/${locale}/faq#${faq.id}`,
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: data.backLabel,
            item: `${BASE}/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: data.title,
            item: `${BASE}/${locale}/faq`,
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="bg-gray-50 border-b border-gray-100 px-4 py-3">
          <ol className="max-w-4xl mx-auto flex items-center gap-1.5 text-sm text-gray-500">
            <li>
              <Link href={`/${locale}`} className="hover:text-wine-700 transition-colors">
                {data.backLabel}
              </Link>
            </li>
            <ChevronRight size={14} className="text-gray-300 shrink-0" aria-hidden="true" />
            <li className="text-gray-700 font-medium" aria-current="page">
              {data.title}
            </li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="church-gradient py-16 px-4" aria-labelledby="faq-page-title">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 id="faq-page-title" className="text-3xl sm:text-4xl font-bold mb-3">
              {data.title}
            </h1>
            <p className="text-wine-200 text-base max-w-xl mx-auto">{data.subtitle}</p>
            <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mt-5" />
          </div>
        </section>

        {/* Quick category jump */}
        <nav
          aria-label="FAQ 分類"
          className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10 shadow-sm"
        >
          <ul className="max-w-4xl mx-auto flex flex-wrap gap-2 justify-center">
            {data.categories
              .filter((cat) => cat.faqs.length > 0)
              .map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`#${cat.id}`}
                    className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-wine-50 text-wine-700 border border-wine-100 hover:bg-wine-100 transition-colors"
                  >
                    {cat.title}
                  </a>
                </li>
              ))}
          </ul>
        </nav>

        {/* FAQ body */}
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">
          {data.categories
            .filter((cat) => cat.faqs.length > 0)
            .map((cat) => (
              <section key={cat.id} id={cat.id} aria-labelledby={`cat-heading-${cat.id}`}>
                <h2
                  id={`cat-heading-${cat.id}`}
                  className="text-lg font-bold text-wine-900 mb-5 pb-2 border-b-2 border-wine-100 flex items-center gap-2"
                >
                  <span className="w-1.5 h-5 bg-amber-400 rounded-full inline-block" aria-hidden="true" />
                  {cat.title}
                </h2>

                <div className="space-y-3">
                  {cat.faqs.map((faq) => (
                    <article
                      key={faq.id}
                      id={faq.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden scroll-mt-28"
                    >
                      <details className="group">
                        <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none hover:bg-gray-50 transition-colors [&::-webkit-details-marker]:hidden">
                          <h3 className="font-semibold text-gray-900 text-[15px] leading-snug">
                            {faq.q}
                          </h3>
                          <span
                            aria-hidden="true"
                            className="shrink-0 w-7 h-7 rounded-full bg-wine-50 border border-wine-100 flex items-center justify-center text-wine-600 group-open:bg-wine-700 group-open:border-wine-700 group-open:text-white transition-all"
                          >
                            <ChevronRight
                              size={14}
                              className="group-open:rotate-90 transition-transform duration-200"
                            />
                          </span>
                        </summary>

                        <div className="px-5 pt-0 pb-5 border-t border-gray-50">
                          <p className="text-gray-600 text-sm leading-relaxed pt-4">{faq.a}</p>
                          <a
                            href={`#${faq.id}`}
                            className="mt-3 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-wine-600 transition-colors"
                            aria-label={`此問題的直接連結：${faq.q}`}
                          >
                            <span>#</span>
                            <span className="font-mono">{faq.id}</span>
                          </a>
                        </div>
                      </details>
                    </article>
                  ))}
                </div>
              </section>
            ))}
        </div>

        {/* Contact CTA */}
        <section className="bg-gray-50 border-t border-gray-100 py-12 px-4 text-center">
          <MessageCircle size={32} className="text-wine-300 mx-auto mb-4" />
          <p className="text-gray-600 text-sm mb-4">{data.contactLabel}</p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-wine-800 hover:bg-wine-700 text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
          >
            <MessageCircle size={16} />
            {data.contactLabel.split('？')[1]?.trim() ?? data.contactLabel}
          </Link>
        </section>
      </div>
    </>
  )
}
