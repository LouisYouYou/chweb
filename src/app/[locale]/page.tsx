import { Suspense } from 'react';
import type { Metadata } from 'next'
import Hero from '@/components/home/Hero';
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

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata(locale, pageSEO.home)
}

const churchSchema = {
  '@context': 'https://schema.org',
  '@type': ['Church', 'LocalBusiness'],
  '@id': 'https://nanshijiaoglory.vercel.app/#church',
  name: '行道會南勢角榮耀堂',
  alternateName: [
    '南勢角榮耀堂',
    '台北榮耀堂',
    '大台北榮耀堂',
    'Glory Church Of Nanshijiao',
    'Nanshijiao Glory Church',
  ],
  description: '行道會南勢角榮耀堂是大台北地區的基督教會，歡迎台北、新北各地的朋友來聚會。主日崇拜每週日10:00–11:30，設有中文及緬甸語聚會。',
  url: 'https://nanshijiaoglory.vercel.app',
  logo: 'https://nanshijiaoglory.vercel.app/logo.png',
  image: 'https://nanshijiaoglory.vercel.app/church.jpg',
  telephone: '+886286685515',
  email: 'winson651202@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '忠孝街39-15號',
    addressLocality: '中和區',
    addressRegion: '新北市',
    postalCode: '235',
    addressCountry: 'TW',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 24.9846438,
    longitude: 121.5119889,
  },
  areaServed: [
    { '@type': 'City', name: '台北市' },
    { '@type': 'City', name: '新北市' },
    { '@type': 'AdministrativeArea', name: '大台北地區' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '10:00',
      closes: '11:30',
    },
  ],
  publicAccess: true,
  isAccessibleForFree: true,
  hasMap: 'https://www.google.com/maps/place/%E8%A1%8C%E9%81%93%E6%9C%83%E5%8D%97%E5%8B%A2%E8%A7%92%E6%A6%AE%E8%80%80%E5%A0%82/@24.9846438,121.5119889,17z',
  sameAs: [
    'https://www.facebook.com/nanshijiaoglory',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://nanshijiaoglory.vercel.app/#website',
  name: '行道會南勢角榮耀堂',
  url: 'https://nanshijiaoglory.vercel.app',
  inLanguage: ['zh-TW', 'en', 'my', 'ja'],
  publisher: { '@id': 'https://nanshijiaoglory.vercel.app/#church' },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://nanshijiaoglory.vercel.app/zh-TW/events?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '主日崇拜是什麼時間？',
      acceptedAnswer: { '@type': 'Answer', text: '每週日早上 10:00–11:30，歡迎提前到場。' },
    },
    {
      '@type': 'Question',
      name: '教會地址在哪裡？',
      acceptedAnswer: { '@type': 'Answer', text: '新北市中和區忠孝街 39-15 號。' },
    },
    {
      '@type': 'Question',
      name: '距離捷運站多遠？',
      acceptedAnswer: { '@type': 'Answer', text: '捷運南勢角站（環狀線）4號出口，步行約 10 分鐘。' },
    },
    {
      '@type': 'Question',
      name: '教會提供哪些語言的崇拜？',
      acceptedAnswer: { '@type': 'Answer', text: '目前以中文及緬甸語崇拜為主，歡迎說任何語言的朋友前來。' },
    },
    {
      '@type': 'Question',
      name: '如何報名教會活動？',
      acceptedAnswer: { '@type': 'Answer', text: '可至官網活動行事曆頁面查看近期活動並線上報名，或致電 (02) 8668-5515 洽詢。' },
    },
  ],
}

async function LatestSermonsLoader() {
  const videos = await getChannelVideos(3);
  return <LatestSermons videos={videos} />;
}

export default async function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(churchSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Hero />
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
