import Hero from '@/components/home/Hero';
import ServiceTimesSection from '@/components/home/ServiceTimesSection';
import LatestSermons from '@/components/home/LatestSermons';
import UpcomingEvents from '@/components/home/UpcomingEvents';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceTimesSection />
      <LatestSermons />
      <UpcomingEvents />
    </>
  );
}
