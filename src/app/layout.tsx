import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nanshijiaoglory.vercel.app"),
  title: {
    default: "中和教會・南勢角教會 | 行道會南勢角榮耀堂",
    template: "%s | 行道會南勢角榮耀堂・中和教會",
  },
  description:
    "中永和地區基督教教會──行道會南勢角榮耀堂，位於新北市中和區忠孝街39-15號。主日崇拜每週日10:00-11:30，捷運南勢角站4號出口步行約10分鐘。中和教會・中永和教會・南勢角教會，歡迎你來！",
  keywords: [
    "中和教會",
    "中永和教會",
    "中和基督教",
    "中和基督教教會",
    "中永和基督教",
    "南勢角教會",
    "南勢角基督教教會",
    "行道會南勢角榮耀堂",
    "南勢角榮耀堂",
    "中和區教會",
    "新北市中和教會",
    "捷運南勢角教會",
    "行道會南勢角",
    "榮耀堂",
    "新北市教會",
    "Glory Church Of Nanshijiao",
    "Nanshijiao Church",
    "行道會",
    "台北榮耀堂",
    "行道會台北榮耀堂",
    "行道會南勢角",
    "榮耀堂系統",
    "行道會教會",
  ],
  authors: [{ name: "行道會南勢角榮耀堂" }],
  creator: "行道會南勢角榮耀堂",
  publisher: "行道會南勢角榮耀堂",
  alternates: {
    canonical: "/zh-TW",
    languages: {
      "zh-TW": "/zh-TW",
      en: "/en",
      my: "/my",
      ja: "/ja",
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    alternateLocale: "en_US",
    title: "中和教會・南勢角教會 | 行道會南勢角榮耀堂",
    description:
      "中永和地區基督教教會──行道會南勢角榮耀堂，新北市中和區忠孝街39-15號。主日崇拜每週日10:00-11:30，歡迎你來。",
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
  verification: {
    google: 'KhRrzPkvjjL8c-taSNX18PGtspxcUbSeuCHRt-XqBfc',
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
    icon: [
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#380a14',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
