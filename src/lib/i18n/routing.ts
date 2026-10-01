import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['zh-TW', 'en', 'my'],
  defaultLocale: 'zh-TW',
  localeDetection: false,
});
