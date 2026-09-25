import type { Metadata } from 'next'
import Hero from '@/components/home/Hero';
import ServiceTimesSection from '@/components/home/ServiceTimesSection';
import LatestSermons from '@/components/home/LatestSermons';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import { getChannelVideos } from '@/lib/youtube';

export const metadata: Metadata = {
  title: '行道會南勢角榮耀堂 | Glory Church Of Nanshijiao',
  description: '行道會南勢角榮耀堂，位於新北市中和區忠孝街39-15號。主日崇拜每週日10:00-11:30，捷運南勢角站4號出口步行約10分鐘。歡迎你來！',
}

export default async function HomePage() {
  const videos = await getChannelVideos(3);

  return (
    <>
      <Hero />
      <ServiceTimesSection />
      <LatestSermons videos={videos} />
      <UpcomingEvents />
    </>
  );
}
