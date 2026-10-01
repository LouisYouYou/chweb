import { YouTubeVideo } from '@/lib/youtube'

const BASE = 'https://nanshijiaoglory.vercel.app'
const CHANNEL = 'https://www.youtube.com/@winson651202'

interface Props {
  videos: YouTubeVideo[]
}

export default function SermonsJsonLd({ videos }: Props) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '行道會南勢角榮耀堂 講道媒體庫',
    description: '行道會南勢角榮耀堂主日講道影片、查經系列，持續更新。',
    url: `${BASE}/zh-TW/sermons`,
    numberOfItems: videos.length,
    itemListElement: videos.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'VideoObject',
        '@id': `https://www.youtube.com/watch?v=${v.id}`,
        name: v.title,
        description: v.description || '行道會南勢角榮耀堂主日講道',
        thumbnailUrl: v.thumbnail,
        uploadDate: v.publishedAt,
        embedUrl: `https://www.youtube.com/embed/${v.id}`,
        url: `https://www.youtube.com/watch?v=${v.id}`,
        publisher: {
          '@type': 'Church',
          '@id': `${BASE}/#church`,
          name: '行道會南勢角榮耀堂',
        },
        inLanguage: 'zh-TW',
        isPartOf: {
          '@type': 'VideoPlaylist',
          name: '行道會南勢角榮耀堂 講道系列',
          url: CHANNEL,
        },
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
