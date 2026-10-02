import type { DisplayEvent } from '@/lib/sanity/queries'

const BASE = 'https://nanshijiaoglory.vercel.app'

interface Props {
  events: DisplayEvent[]
}

export default function EventsJsonLd({ events }: Props) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '行道會南勢角榮耀堂 活動行事曆',
    url: `${BASE}/zh-TW/events`,
    numberOfItems: events.length,
    itemListElement: events.map((ev, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Event',
        '@id': `${BASE}/zh-TW/events#event-${ev.id}`,
        name: ev.titleZh,
        alternateName: ev.titleEn,
        description: ev.descriptionZh,
        startDate: ev.time
          ? `${ev.date}T${ev.time.split(' ')[0]}:00+08:00`
          : `${ev.date}T00:00:00+08:00`,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode:
          ev.locationZh === '線上'
            ? 'https://schema.org/OnlineEventAttendanceMode'
            : 'https://schema.org/OfflineEventAttendanceMode',
        location:
          ev.locationZh === '線上'
            ? { '@type': 'VirtualLocation', url: 'https://www.youtube.com/@winson651202/live' }
            : {
                '@type': 'Place',
                name: ev.locationZh,
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: '忠孝街39-15號',
                  addressLocality: '中和區',
                  addressRegion: '新北市',
                  postalCode: '235',
                  addressCountry: 'TW',
                },
              },
        organizer: {
          '@type': 'Church',
          '@id': `${BASE}/#church`,
          name: '行道會南勢角榮耀堂',
        },
        offers:
          ev.fee === 0
            ? { '@type': 'Offer', price: '0', priceCurrency: 'TWD', availability: 'https://schema.org/InStock' }
            : ev.fee != null
            ? { '@type': 'Offer', price: String(ev.fee), priceCurrency: 'TWD', availability: 'https://schema.org/InStock' }
            : undefined,
        inLanguage: 'zh-TW',
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
