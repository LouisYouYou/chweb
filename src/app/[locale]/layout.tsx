import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Noto_Sans_Myanmar } from 'next/font/google';
import { routing } from '@/lib/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChurchJsonLd from '@/components/seo/ChurchJsonLd';

const notoMyanmar = Noto_Sans_Myanmar({
  subsets: ['myanmar'],
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
  if (!routing.locales.includes(locale as 'zh-TW' | 'en' | 'my')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <html lang={locale} className={locale === 'my' ? notoMyanmar.className : undefined}>
        <head>
          <ChurchJsonLd />
        </head>
        <body className="min-h-full flex flex-col">
          <Header locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
