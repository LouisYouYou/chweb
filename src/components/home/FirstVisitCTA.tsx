import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';

const COPY = {
  'zh-TW': {
    heading: '第一次來？',
    sub: '不管你帶著什麼問題或期待，我們為你留了位置。',
    ctaPrimary: '第一次來的朋友',
    ctaSecondary: '聯絡我們',
  },
  en: {
    heading: 'First Time Visiting?',
    sub: 'Whatever questions or expectations you bring — there is a seat for you.',
    ctaPrimary: 'New Visitor Guide',
    ctaSecondary: 'Contact Us',
  },
  my: {
    heading: 'ပထမဆုံးကြိမ် ကြွဆောင်မလားဆိုရင်?',
    sub: 'ဘယ်မေးခွန်းများ သို့မဟုတ် မျှော်လင့်ချက်များ ဆောင်ပြည်အောင်၊ ကျွန်ုပ်တို့ သင့်အတွက် နေရာထားပေးသည်။',
    ctaPrimary: 'ပထမကြိမ် ကြွဆောင်မည်',
    ctaSecondary: 'ဆက်သွယ်ရန်',
  },
  ja: {
    heading: '初めての方へ',
    sub: 'どんな問いや期待を持ってきても、あなたのための席があります。',
    ctaPrimary: '初めての方へ',
    ctaSecondary: 'お問い合わせ',
  },
} as const;

export default async function FirstVisitCTA() {
  const locale = await getLocale();
  const c = COPY[locale as keyof typeof COPY] ?? COPY['zh-TW'];

  return (
    <section className="relative bg-wine-950 overflow-hidden">
      {/* Top wave: warm-white/beige → dark */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block h-14">
          <path d="M0,0 L1440,0 C1080,56 360,56 0,0 Z" fill="#EDE8DF"/>
        </svg>
      </div>

      {/* Depth: radial wine glow from center-top */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(90,10,30,0.7) 0%, transparent 65%)' }}
      />

      {/* Amber glow from below */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.15) 0%, transparent 70%)' }}
      />

      {/* Faint grid texture */}
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />

      {/* Decorative large character — atmospheric depth */}
      <span
        aria-hidden="true"
        className="absolute right-[5%] bottom-0 select-none pointer-events-none font-black text-white leading-none"
        style={{ fontSize: 'clamp(14rem, 32vw, 26rem)', opacity: 0.025, lineHeight: 0.85 }}
      >
        光
      </span>

      <div className="relative z-10 py-24 max-w-3xl mx-auto px-6 text-center">
        {/* Amber divider */}
        <div
          aria-hidden="true"
          className="w-16 h-0.5 mx-auto mb-10 rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }}
        />

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {c.heading}
        </h2>

        <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          {c.sub}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/first-visit`}
            className="glass-btn glass-btn-primary inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-3 text-white font-bold rounded-full text-sm whitespace-nowrap"
          >
            {c.ctaPrimary}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="glass-btn glass-btn-secondary inline-flex items-center justify-center gap-2 min-h-[48px] px-8 py-3 text-white/90 font-semibold rounded-full text-sm whitespace-nowrap"
          >
            {c.ctaSecondary}
          </Link>
        </div>

        {/* Bottom amber line */}
        <div
          aria-hidden="true"
          className="w-24 h-px mx-auto mt-16 opacity-20"
          style={{ background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }}
        />
      </div>
    </section>
  );
}
