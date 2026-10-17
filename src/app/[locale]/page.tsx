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
import { buildMetadata, pageSEO } from '@/lib/seo/metadata';

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  return buildMetadata(locale, pageSEO.home)
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
