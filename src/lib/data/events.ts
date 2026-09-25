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
    dayZh: '每週日',
    dayEn: 'Every Sunday',
    time: '10:00 - 11:30',
    locationZh: '主堂',
    locationEn: 'Main Sanctuary',
  },
  {
    id: '2',
    nameZh: '小組聚會',
    nameEn: 'Cell Group Meeting',
    dayZh: '每週二',
    dayEn: 'Every Tuesday',
    time: '19:30 - 21:00',
    locationZh: '主堂',
    locationEn: 'Main Sanctuary',
  },
  {
    id: '3',
    nameZh: '青年聚會',
    nameEn: 'Youth Fellowship',
    dayZh: '每週六',
    dayEn: 'Every Saturday',
    time: '19:00 - 21:30',
    locationZh: '主堂',
    locationEn: 'Main Sanctuary',
  },
];
