const BASE = 'https://nanshijiaoglory.vercel.app'

export default function ChurchJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Church',
        '@id': `${BASE}/#church`,
        name: '行道會南勢角榮耀堂',
        alternateName: ['Glory Church Of Nanshijiao', '南勢角榮耀堂', '南勢角教會', 'NJC Glory Church'],
        url: BASE,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE}/logo.png`,
          width: 512,
          height: 512,
        },
        image: `${BASE}/church.jpg`,
        description:
          '行道會南勢角榮耀堂，位於新北市中和區忠孝街39-15號，主日崇拜每週日上午10:00至11:30，歡迎所有人前來。Glory Church Of Nanshijiao, located at No.39-15, Zhongxiao St., Zhonghe Dist., New Taipei City.',
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
        hasMap: 'https://www.google.com/maps/place/%E8%A1%8C%E9%81%93%E6%9C%83%E5%8D%97%E5%8B%A2%E8%A7%92%E6%A6%AE%E8%80%80%E5%A0%82/@24.9846438,121.5119889,17z',
        telephone: '+886-2-8668-5515',
        email: 'winson651202@gmail.com',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Sunday',
            opens: '10:00',
            closes: '11:30',
            name: '主日崇拜 Sunday Worship',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Tuesday',
            opens: '19:30',
            closes: '21:00',
            name: '小組聚會',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '19:00',
            closes: '21:30',
            name: '青年聚會',
          },
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+886-2-8668-5515',
          email: 'winson651202@gmail.com',
          contactType: 'customer support',
          availableLanguage: ['Chinese', 'English'],
          areaServed: 'TW',
        },
        sameAs: [
          'https://www.facebook.com/p/%E8%A1%8C%E9%81%93%E6%9C%83%E5%8D%97%E5%8B%A2%E8%A7%92%E6%A6%AE%E8%80%80%E5%A0%82-100071633452675/',
          'https://www.youtube.com/@winson651202',
        ],
        memberOf: {
          '@type': 'Organization',
          name: '行道會台北榮耀堂',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        url: BASE,
        name: '行道會南勢角榮耀堂',
        description: '行道會南勢角榮耀堂官方網站',
        inLanguage: ['zh-TW', 'en', 'my'],
        publisher: { '@id': `${BASE}/#church` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE}/zh-TW/sermons?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${BASE}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首頁', item: `${BASE}/zh-TW` },
          { '@type': 'ListItem', position: 2, name: '聚會資訊', item: `${BASE}/zh-TW/services` },
          { '@type': 'ListItem', position: 3, name: '講道媒體', item: `${BASE}/zh-TW/sermons` },
          { '@type': 'ListItem', position: 4, name: '活動行事曆', item: `${BASE}/zh-TW/events` },
          { '@type': 'ListItem', position: 5, name: '聯絡我們', item: `${BASE}/zh-TW/contact` },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
