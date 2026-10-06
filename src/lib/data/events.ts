export interface CourseItem {
  nameZh: string;
  nameEn: string;
  day: string;
  time: string;
}

export interface ChurchEvent {
  id: string;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  date: string;
  time: string;
  locationZh: string;
  locationEn: string;
  category: 'worship' | 'youth' | 'community' | 'retreat' | 'training';
  seats?: number;
  seatsLeft?: number;
  fee?: number;
  image?: string;
  courseItems?: CourseItem[];
}

export const events: ChurchEvent[] = [
  {
    id: '4',
    titleZh: '🎨 蒙式藝術手作課 — 搖滾大象',
    titleEn: '🎨 Montessori Art Workshop — The Rocking Elephant',
    descriptionZh: '讓孩子透過藝術與創作，享受一段自在探索、動手實作的美好時光！剪貼工作 × 創意彩繪，運用不同素材與色彩，讓孩子自由發揮想像力，創作屬於自己的「搖滾大象」。在操作中培養專注力、在創作中發現美感、在陪伴中珍藏親子時光。適合 3 歲以上，親子同樂，一起動手玩藝術！',
    descriptionEn: 'Let children freely explore and create with their hands through art! Paper cutting × creative painting — using different materials and colors for children to unleash their imagination and craft their very own Rocking Elephant. Builds focus through hands-on activity, nurtures aesthetic sense through creation, and treasures precious parent-child time. Suitable for ages 3+.',
    date: '2026-10-21',
    time: '13:30 - 15:00',
    locationZh: '教會主堂',
    locationEn: 'Main Sanctuary',
    category: 'community',
    fee: 200,
    seats: 20,
    image: '/images/events/montessori-elephant-2026-10-21.jpg',
  },
  {
    id: '3',
    titleZh: '聖經講座 — 歷代志上',
    titleEn: 'Bible Seminar — 1 Chronicles',
    descriptionZh: '邀請黃正人老師／博士主講歷代志上，深入認識神的話語，歡迎弟兄姊妹踴躍參加。',
    descriptionEn: 'Dr. Huang Zheng-Ren leads an in-depth seminar on 1 Chronicles. All are welcome.',
    date: '2026-10-03',
    time: '09:00',
    locationZh: '線上',
    locationEn: 'Online',
    category: 'training',
    fee: 0,
  },
  {
    id: '2',
    titleZh: '家庭團契',
    titleEn: 'Family Fellowship',
    descriptionZh: '讓愛重新在家庭中連結，邀請已婚的夫妻一同參加，一起經歷神在家庭中的恩典與更新。',
    descriptionEn: 'Rekindling love within families — all married couples are warmly invited to experience God\'s grace and renewal together.',
    date: '2026-10-17',
    time: '15:00 - 17:00',
    locationZh: '教會主堂',
    locationEn: 'Main Sanctuary',
    category: 'retreat',
    fee: 0,
  },
  {
    id: '1',
    titleZh: '致福益人學院課程',
    titleEn: 'Fu-Yi Community Learning Program',
    descriptionZh: '多樣化的社區互動課程，包含油性粉彩入門、創意拼豆世界、皮拉提斯等，歡迎社區鄰里一起來學習、交流、成長。',
    descriptionEn: 'A diverse range of community interactive courses including oil pastel basics, creative Hama bead art, and Pilates. All community members are warmly welcome.',
    date: '2026-10-01',
    time: '依各課程時間',
    locationZh: '教會主堂',
    locationEn: 'Main Sanctuary',
    category: 'community',
    fee: 1500,
    courseItems: [
      { nameZh: '油性粉彩', nameEn: 'Oil Pastel',    day: '週三', time: '09:30' },
      { nameZh: '皮拉提斯', nameEn: 'Pilates',        day: '週二', time: '14:00' },
      { nameZh: '拼豆創意', nameEn: 'Hama Bead Art',  day: '週六', time: '10:00' },
    ],
  },
];

export const serviceTimes = [
  {
    id: '1',
    nameZh: '主日崇拜（國語）',
    nameEn: 'Sunday Worship (Mandarin)',
    nameMy: 'တနင်္ဂနွေ ဝတ်ပြုကိုးကွယ်ပွဲ (တရုတ်ဘာသာ)',
    nameJa: '主日礼拝（中国語）',
    dayZh: '每週日',
    dayEn: 'Every Sunday',
    dayMy: 'တနင်္ဂနွေ တိုင်းတိုင်း',
    dayJa: '毎週日曜日',
    time: '10:00 - 11:30',
    locationZh: '主堂',
    locationEn: 'Main Sanctuary',
    locationMy: 'ဆောင်မကြီး',
    locationJa: 'メインサンクチュアリ',
  },
  {
    id: '2',
    nameZh: '小組聚會',
    nameEn: 'Cell Group Meeting',
    nameMy: 'အသေးစု ဝတ်ပြုကိုးကွယ်ပွဲ',
    nameJa: 'セルグループ',
    dayZh: '每週二',
    dayEn: 'Every Tuesday',
    dayMy: 'အင်္ဂါ တိုင်းတိုင်း',
    dayJa: '毎週火曜日',
    time: '19:30 - 21:00',
    locationZh: '主堂',
    locationEn: 'Main Sanctuary',
    locationMy: 'ဆောင်မကြီး',
    locationJa: 'メインサンクチュアリ',
  },
  {
    id: '3',
    nameZh: '青年聚會',
    nameEn: 'Youth Fellowship',
    nameMy: 'လူငယ် ဝတ်ပြုကိုးကွယ်ပွဲ',
    nameJa: '青年礼拝',
    dayZh: '每週六',
    dayEn: 'Every Saturday',
    dayMy: 'စနေ တိုင်းတိုင်း',
    dayJa: '毎週土曜日',
    time: '19:00 - 21:30',
    locationZh: '主堂',
    locationEn: 'Main Sanctuary',
    locationMy: 'ဆောင်မကြီး',
    locationJa: 'メインサンクチュアリ',
  },
];
