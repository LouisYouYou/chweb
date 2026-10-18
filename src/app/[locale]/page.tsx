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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)

  const [base, msg] = await Promise.all([
    Promise.resolve(buildMetadata(locale, pageSEO.home)),
    getLatestSundayMessage(),
  ])

  // opengraph-image.tsx generates the dynamic OG image — strip the static church.jpg
  const ogNoImages = base.openGraph
    ? { ...(base.openGraph as object), images: [] }
    : undefined

  if (!msg) {
    return { ...base, openGraph: ogNoImages as Metadata['openGraph'] }
  }

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

  return {
    ...base,
    title: { absolute: dynamicTitle },
    description: dynamicDesc,
    openGraph: {
      ...(ogNoImages as object),
      title: dynamicTitle,
      description: dynamicDesc,
    } as Metadata['openGraph'],
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
