const BASE = 'https://nanshijiaoglory.vercel.app'

export default function ChurchJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Church',
        '@id': `${BASE}/#church`,
        name: '行道會南勢角榮耀堂',
        alternateName: [
          '南勢角榮耀堂',
          '南勢角教會',
          '中和教會',
          '中永和教會',
          '中和基督教教會',
          '中永和基督教',
          '南勢角基督教教會',
          'Glory Church Of Nanshijiao',
          'NJC Glory Church',
          'Nanshijiao Glory Church',
        ],
        url: BASE,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE}/logo.png`,
          width: 512,
          height: 512,
        },
        image: `${BASE}/church.jpg`,
        description:
          '行道會南勢角榮耀堂是位於新北市中和區南勢角的基督教教會，服務中永和地區的基督徒社群。主日崇拜每週日上午10:00至11:30，捷運南勢角站4號出口步行約10分鐘，地址：新北市中和區忠孝街39-15號。Glory Church Of Nanshijiao, a Christian church serving the Zhonghe and Yonghe (Zhongyonghe) community in New Taipei City.',
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
        areaServed: [
          {
            '@type': 'AdministrativeArea',
            name: '中和區',
            containedInPlace: { '@type': 'City', name: '新北市' },
          },
          {
            '@type': 'AdministrativeArea',
            name: '永和區',
            containedInPlace: { '@type': 'City', name: '新北市' },
          },
          {
            '@type': 'AdministrativeArea',
            name: '中永和',
            containedInPlace: { '@type': 'City', name: '新北市' },
          },
        ],
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
          availableLanguage: ['Chinese', 'English', 'Burmese'],
          areaServed: 'TW',
        },
        sameAs: [
          'https://www.facebook.com/p/%E8%A1%8C%E9%81%93%E6%9C%83%E5%8D%97%E5%8B%A2%E8%A7%92%E6%A6%AE%E8%80%80%E5%A0%82-100071633452675/',
          'https://www.youtube.com/@winson651202',
        ],
        keywords: [
          '中和教會', '中永和教會', '南勢角教會', '中和基督教', '台北榮耀堂',
          '行道會台北榮耀堂', '行道會南勢角榮耀堂', '行道會教會', '榮耀堂',
        ].join(', '),
        memberOf: {
          '@type': 'Organization',
          name: '行道會台北榮耀堂',
          url: 'https://www.facebook.com/gloryoftaipei',
          description: '行道會南勢角榮耀堂為行道會台北榮耀堂旗下的地區教會，服務新北市中永和地區。',
        },
        parentOrganization: {
          '@type': 'Organization',
          name: '行道會台北榮耀堂',
          description: '台北榮耀堂（行道會台北榮耀堂）旗下教會，涵蓋台北及新北市各地區會眾。',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${BASE}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: '中和區有哪些基督教教會？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '行道會南勢角榮耀堂是中和區的基督教教會，位於新北市中和區忠孝街39-15號（南勢角），服務中永和地區的基督徒社群。主日崇拜每週日上午10:00-11:30，歡迎前來。',
            },
          },
          {
            '@type': 'Question',
            name: '南勢角附近有教會嗎？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '有，行道會南勢角榮耀堂位於捷運南勢角站4號出口步行約10分鐘處（新北市中和區忠孝街39-15號），是南勢角地區的基督教教會，歡迎任何人前來參加主日崇拜。',
            },
          },
          {
            '@type': 'Question',
            name: '中和教會的主日崇拜幾點開始？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '行道會南勢角榮耀堂（中和教會）的主日崇拜每週日上午10:00開始，至11:30結束，歡迎全家大小前來敬拜。另有週二19:30小組聚會及週六19:00青年聚會。',
            },
          },
          {
            '@type': 'Question',
            name: '如何前往南勢角教會？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '搭乘台北捷運環狀線至「南勢角站」，由4號出口步行約10分鐘，即可到達新北市中和區忠孝街39-15號。也可開車前往，附近有停車場。',
            },
          },
          {
            '@type': 'Question',
            name: '中永和地區有沒有說華語的教會？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '行道會南勢角榮耀堂位於中永和交界的南勢角地區，以華語為主要聚會語言，同時提供緬甸語及英語服務，服務多元文化背景的信徒。',
            },
          },
          {
            '@type': 'Question',
            name: '行道會南勢角榮耀堂有兒童主日學嗎？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '是的，行道會南勢角榮耀堂提供主日學課程，讓全家大小都能在信仰中一同成長。歡迎帶孩子來參加主日崇拜。',
            },
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE}/#website`,
        url: BASE,
        name: '行道會南勢角榮耀堂',
        description: '中和教會・南勢角教會 行道會南勢角榮耀堂官方網站',
        inLanguage: ['zh-TW', 'en', 'my', 'ja'],
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
