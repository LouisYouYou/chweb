import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Noto_Sans_Myanmar, Noto_Sans_JP } from 'next/font/google';
import { routing } from '@/lib/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NewsTicker from '@/components/layout/NewsTicker';
import ChurchJsonLd from '@/components/seo/ChurchJsonLd';
import NewsletterSection from '@/components/home/NewsletterSection';
import LineFloatButton from '@/components/layout/LineFloatButton';
import SkipToContent from '@/components/layout/SkipToContent';

const notoMyanmar = Noto_Sans_Myanmar({
  subsets: ['myanmar'],
  weight: ['400', '700'],
  display: 'swap',
});

const notoJapanese = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'zh-TW' | 'en' | 'my' | 'ja')) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <html lang={locale} className={locale === 'my' ? notoMyanmar.className : locale === 'ja' ? notoJapanese.className : undefined}>
        <head>
          <ChurchJsonLd />
        </head>
        <body className="min-h-full flex flex-col">
          <SkipToContent />
          <Header locale={locale} />
          <NewsTicker />
          <main id="main-content" tabIndex={-1} className="flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-inset">{children}</main>
          <NewsletterSection />
          <Footer />
          <LineFloatButton />
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
