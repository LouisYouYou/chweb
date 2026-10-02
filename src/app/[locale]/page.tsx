import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server';
import Hero from '@/components/home/Hero';
import AnnouncementBanner from '@/components/home/AnnouncementBanner';
import WelcomeSection from '@/components/home/WelcomeSection';
import ServiceTimesSection from '@/components/home/ServiceTimesSection';
import LatestSermons from '@/components/home/LatestSermons';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import { getChannelVideos } from '@/lib/youtube';
import { getAnnouncements } from '@/lib/sanity/queries';

export const metadata: Metadata = {
  title: '行道會南勢角榮耀堂 | Glory Church Of Nanshijiao',
  description: '行道會南勢角榮耀堂，位於新北市中和區忠孝街39-15號。主日崇拜每週日10:00-11:30，捷運南勢角站4號出口步行約10分鐘。歡迎你來！',
}

export default async function HomePage() {
  const [videos, announcements, locale] = await Promise.all([
    getChannelVideos(3),
    getAnnouncements(),
    getLocale(),
  ]);

  return (
    <>
      <Hero />
      <AnnouncementBanner announcements={announcements} locale={locale} />
      <WelcomeSection />
      <ServiceTimesSection />
      <LatestSermons videos={videos} />
      <UpcomingEvents />
    </>
  );
}
