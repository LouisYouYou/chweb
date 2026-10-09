import { getLocale } from 'next-intl/server';

export default async function SkipToContent() {
  const locale = await getLocale();
  const label =
    locale === 'zh-TW' ? '跳至主要內容' :
    locale === 'my'    ? 'အဓိကအကြောင်းအရာသို့ ကျော်ပါ' :
    locale === 'ja'    ? 'メインコンテンツへスキップ' :
    'Skip to main content';

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-amber-400 focus:text-wine-900 focus:font-bold focus:text-sm focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-wine-700"
    >
      {label}
    </a>
  );
}
