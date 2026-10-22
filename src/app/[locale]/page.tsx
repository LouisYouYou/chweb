import { Suspense } from 'react';
import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import Hero from '@/components/home/Hero';
import StatsBar from '@/components/home/StatsBar';
import AnnouncementBanner from '@/components/home/AnnouncementBanner';
import WelcomeSection from '@/components/home/WelcomeSection';
import ServiceTimesSection from '@/components/home/ServiceTimesSection';
import SundayMessageSection from '@/components/home/SundayMessageSection';
import SundayMessageSkeleton from '@/components/home/SundayMessageSkeleton';
import LatestSermons from '@/components/home/LatestSermons';
import SermonsSkeleton from '@/components/home/SermonsSkeleton';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import EventsSkeleton from '@/components/home/EventsSkeleton';
import { getChannelVideos } from '@/lib/youtube';
import { buildMetadata, pageSEO } from '@/lib/seo/metadata'
import { getLatestSundayMessage } from '@/lib/sanity/queries'
import HashScrollHandler from '@/components/ui/HashScrollHandler';

export const revalidate = 300

const SITE_URL = 'https://nanshijiaoglory.vercel.app'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)

  const [base, msg] = await Promise.all([
    Promise.resolve(buildMetadata(locale, pageSEO.home)),
    getLatestSundayMessage(),
  ])

  // No Sunday message: keep default layout metadata (church.jpg)
  if (!msg) return base

  const [y, m, d] = msg.date.split('-')

  const dynamicTitle =
    ({
      'zh-TW': `${msg.title}｜本週主日信息・行道會南勢角榮耀堂`,
      'en':    `${msg.title} | Sunday Message · Glory Church Of Nanshijiao`,
      'my':    `${msg.title} | နန်ရှိချောင် ဂလိုရီဘုရားကျောင်း`,
      'ja':    `${msg.title}｜今週の主日メッセージ・行道会南勢角栄光教会`,
    } as Record<string, string>)[locale]
    ?? `${msg.title}｜本週主日信息・行道會南勢角榮耀堂`

  const dynamicDesc =
    ({
      'zh-TW': `${y} 年 ${parseInt(m)} 月 ${parseInt(d)} 日 主日信息：${msg.title}，講員 ${msg.preacher}${msg.scripture ? `，經文 ${msg.scripture}` : ''}。`,
      'en':    `Sunday message: "${msg.title}" by ${msg.preacher}${msg.scripture ? `, ${msg.scripture}` : ''}.`,
      'my':    `${msg.title} — ${msg.preacher}${msg.scripture ? `, ${msg.scripture}` : ''}.`,
      'ja':    `${msg.title}（${msg.preacher}）${msg.scripture ? `、${msg.scripture}` : ''}。行道会南勢角栄光教会。`,
    } as Record<string, string>)[locale]
    ?? `${y} 年 ${parseInt(m)} 月 ${parseInt(d)} 日 主日信息：${msg.title}，講員 ${msg.preacher}。`

  // Explicit dynamic OG image URL — overrides layout's church.jpg for both og: and twitter:
  const ogImageUrl = `${SITE_URL}/${locale}/opengraph-image`
  const ogImage = { url: ogImageUrl, width: 1200, height: 630, alt: dynamicTitle }

  return {
    ...base,
    title: { absolute: dynamicTitle },
    description: dynamicDesc,
    openGraph: {
      ...(base.openGraph as object),
      title: dynamicTitle,
      description: dynamicDesc,
      images: [ogImage],
    } as Metadata['openGraph'],
    twitter: {
      card: 'summary_large_image',
      title: dynamicTitle,
      description: dynamicDesc,
      images: [ogImageUrl],
    },
  }
}


async function LatestSermonsLoader() {
  const videos = await getChannelVideos(3);
  return <LatestSermons videos={videos} />;
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <>
      <HashScrollHandler />
      <Hero />
      <StatsBar />
      <AnnouncementBanner />
      <WelcomeSection />
      <ServiceTimesSection />
      <Suspense fallback={<SundayMessageSkeleton />}>
        <SundayMessageSection />
      </Suspense>
      <Suspense fallback={<SermonsSkeleton />}>
        <LatestSermonsLoader />
      </Suspense>
      <Suspense fallback={<EventsSkeleton />}>
        <UpcomingEvents />
      </Suspense>
    </>
  );
}
