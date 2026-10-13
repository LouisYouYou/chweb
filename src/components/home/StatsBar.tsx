import { getLocale } from 'next-intl/server';
import { Clock, MapPin, Train } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatItem {
  Icon:  LucideIcon;
  value: string;
  label: string;
}

const STATS: Record<string, StatItem[]> = {
  'zh-TW': [
    { Icon: Clock,  value: '每週日 10:00',    label: '主日禮拜 10:00–11:30' },
    { Icon: Train,  value: '步行 10 分鐘',    label: '南勢角站 4 號出口' },
    { Icon: MapPin, value: '忠孝街 39-15 號', label: '新北市中和區' },
  ],
  en: [
    { Icon: Clock,  value: 'Sunday 10:00 AM', label: 'Worship Service 10:00–11:30' },
    { Icon: Train,  value: '10-min Walk',      label: 'MRT Nanshijiao Exit 4' },
    { Icon: MapPin, value: 'Zhongxiao St.',    label: 'No.39-15, Zhonghe, New Taipei' },
  ],
  my: [
    { Icon: Clock,  value: 'တနင်္ဂနွေ ၁၀:၀၀',     label: 'ဝတ်ပြုကိုးကွယ်ချိန် ၁၀:၀၀–၁၁:၃၀' },
    { Icon: Train,  value: '၁၀ မိနစ်',              label: 'နန်ရှိချောင် ဘူတာ ၄ ထွက်ပေါက်' },
    { Icon: MapPin, value: 'ဇောင်းရှောင်လမ်း ၃၉-၁၅', label: 'ဇောင်းဟဲ ခရိုင်၊ နယူးတိုင်းပေ' },
  ],
  ja: [
    { Icon: Clock,  value: '毎週日 10:00',    label: '主日礼拝 10:00–11:30' },
    { Icon: Train,  value: '徒歩 10 分',      label: '南勢角駅 4 番出口' },
    { Icon: MapPin, value: '忠孝街 39-15号', label: '新北市中和区' },
  ],
};

export default async function StatsBar() {
  const locale = await getLocale();
  const stats = STATS[locale] ?? STATS['zh-TW'];

  return (
    <section aria-label="教會基本資訊" className="bg-[#fdfaf5] border-b border-amber-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-amber-100">
          {stats.map(({ Icon, value, label }, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-5 sm:py-6 sm:px-8 first:sm:pl-0 last:sm:pr-0"
            >
              {/* Icon badge */}
              <div className="shrink-0 w-11 h-11 rounded-full church-gradient flex items-center justify-center shadow-md shadow-wine-200">
                <Icon size={18} className="text-white" aria-hidden="true" />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <p className="font-bold text-wine-900 text-base leading-snug truncate">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
