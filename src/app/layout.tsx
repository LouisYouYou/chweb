import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nanshijiaoglory.vercel.app"),
  title: {
    default: "行道會南勢角榮耀堂 | Glory Church Of Nanshijiao",
    template: "%s | 行道會南勢角榮耀堂",
  },
  description:
    "行道會南勢角榮耀堂，位於新北市中和區忠孝街39-15號。主日崇拜每週日10:00-11:30，捷運南勢角站4號出口步行約10分鐘。Glory Church Of Nanshijiao, Zhonghe District, New Taipei City.",
  keywords: [
    "行道會南勢角榮耀堂",
    "南勢角榮耀堂",
    "南勢角教會",
    "中和教會",
    "新北市教會",
    "行道會南勢角",
    "榮耀堂",
    "中和區教會",
    "Glory Church Of Nanshijiao",
    "Nanshijiao Church",
    "行道會",
  ],
  authors: [{ name: "行道會南勢角榮耀堂" }],
  creator: "行道會南勢角榮耀堂",
  publisher: "行道會南勢角榮耀堂",
  alternates: {
    canonical: "/zh-TW",
    languages: {
      "zh-TW": "/zh-TW",
      en: "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    alternateLocale: "en_US",
    title: "行道會南勢角榮耀堂 | Glory Church Of Nanshijiao",
    description:
      "行道會南勢角榮耀堂，位於新北市中和區忠孝街39-15號。主日崇拜每週日10:00-11:30，歡迎你來。",
    siteName: "行道會南勢角榮耀堂",
    images: [
      {
        url: "/church.jpg",
        width: 1281,
        height: 719,
        alt: "行道會南勢角榮耀堂教會外觀",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "行道會南勢角榮耀堂 | Glory Church Of Nanshijiao",
    description: "行道會南勢角榮耀堂，位於新北市中和區忠孝街39-15號。主日崇拜每週日10:00-11:30。",
    images: ["/church.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
