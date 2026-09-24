export default function ChurchJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Church",
    "name": "行道會南勢角榮耀堂",
    "alternateName": ["Glory Church Of Nanshijiao", "南勢角榮耀堂", "南勢角教會"],
    "url": "https://nanshijiaoglory.vercel.app",
    "logo": "https://nanshijiaoglory.vercel.app/logo.png",
    "image": "https://nanshijiaoglory.vercel.app/church.jpg",
    "description": "行道會南勢角榮耀堂，位於新北市中和區忠孝街39-15號，主日崇拜每週日上午10:00至11:30，歡迎所有人前來。",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "忠孝街39-15號",
      "addressLocality": "中和區",
      "addressRegion": "新北市",
      "postalCode": "235",
      "addressCountry": "TW"
    },
    "telephone": "+886-2-8668-5515",
    "email": "winson651202@gmail.com",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "10:00",
        "closes": "11:30",
        "name": "主日崇拜"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Tuesday",
        "opens": "19:30",
        "closes": "21:00",
        "name": "小組聚會"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "19:00",
        "closes": "21:30",
        "name": "青年聚會"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/p/%E8%A1%8C%E9%81%93%E6%9C%83%E5%8D%97%E5%8B%A2%E8%A7%92%E6%A6%AE%E8%80%80%E5%A0%82-100071633452675/"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
