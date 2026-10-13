'use client';

import { useLocale } from 'next-intl';
import { Phone } from 'lucide-react';

const LINE_ID = process.env.NEXT_PUBLIC_LINE_ID;

const phoneLabel: Record<string, string> = {
  'zh-TW': '電話聯絡',
  en:      'Call Us',
  my:      'ဖုန်းဆက်ရန်',
  ja:      '電話する',
};
const lineLabel: Record<string, string> = {
  'zh-TW': 'LINE 聯絡',
  en:      'LINE Chat',
  my:      'LINE',
  ja:      'LINE',
};

const LineIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18}>
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
  </svg>
);

export default function LineFloatButton() {
  const locale = useLocale();

  return (
    <div
      className="fixed right-4 sm:right-5 z-50 flex flex-col gap-2.5 items-end"
      style={{ bottom: 'max(1.5rem, calc(1.5rem + env(safe-area-inset-bottom)))' }}
    >
      {/* 電話按鈕 */}
      <a
        href="tel:+886286685515"
        aria-label="撥打電話 (02) 8668-5515"
        className="flex items-center gap-2 min-h-[44px] px-3 sm:px-4 rounded-full shadow-xl text-white text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 bg-wine-700 hover:bg-wine-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-400 focus-visible:ring-offset-2"
      >
        <Phone size={18} />
        <span className="hidden sm:inline">{phoneLabel[locale] ?? phoneLabel['zh-TW']}</span>
      </a>

      {/* LINE 按鈕 */}
      {LINE_ID && (
        <a
          href={`https://line.me/R/ti/p/${LINE_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="加入 LINE 官方帳號"
          className="flex items-center gap-2 min-h-[44px] px-3 sm:px-4 rounded-full shadow-xl text-white text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06C755] focus-visible:ring-offset-2"
          style={{ background: '#06C755' }}
        >
          <LineIcon />
          <span className="hidden sm:inline">{lineLabel[locale] ?? lineLabel['zh-TW']}</span>
        </a>
      )}
    </div>
  );
}
