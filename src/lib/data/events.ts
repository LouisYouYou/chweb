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
}

export const events: ChurchEvent[] = [
  {
    id: '1',
    titleZh: '秋季退修會',
    titleEn: 'Autumn Retreat',
    descriptionZh: '一年一度的教會退修會，帶著疲憊的心靈，在神的面前安靜，重新得力。今年主題：「歸回」。',
    descriptionEn: 'Our annual church retreat. Come with a weary heart and find rest in God\'s presence. This year\'s theme: "Return."',
    date: '2025-10-04',
    time: '08:00 - 17:00',
    locationZh: '宜蘭聖地休閒農場',
    locationEn: 'Holy Land Farm, Yilan',
    category: 'retreat',
    seats: 80,
    seatsLeft: 23,
    fee: 800,
    image: '/images/events/retreat.jpg',
  },
  {
    id: '2',
    titleZh: '青年主日特會',
    titleEn: 'Youth Sunday Special',
    descriptionZh: '青年世代的特別崇拜聚會，配合現代敬拜樂團，讓年輕人在信仰中找到歸屬感。',
    descriptionEn: 'A special worship service for the youth generation, featuring a modern praise band and relevant messages.',
    date: '2025-09-28',
    time: '14:00 - 16:30',
    locationZh: '教會主堂',
    locationEn: 'Main Sanctuary',
    category: 'youth',
    seats: 150,
    seatsLeft: 67,
    fee: 0,
    image: '/images/events/youth.jpg',
  },
  {
    id: '3',
    titleZh: '愛鄰舍社區服務日',
    titleEn: 'Love Thy Neighbor Community Day',
    descriptionZh: '走出教會，服事周圍的社區。今次我們將前往老人院探訪，以及協助社區清潔工作。',
    descriptionEn: 'Step outside the church walls and serve our community — visiting elderly care homes and helping with neighborhood cleanup.',
    date: '2025-10-11',
    time: '09:00 - 13:00',
    locationZh: '集合於教會大廳',
    locationEn: 'Meet at Church Lobby',
    category: 'community',
    seats: 40,
    seatsLeft: 15,
    fee: 0,
    image: '/images/events/community.jpg',
  },
  {
    id: '4',
    titleZh: '聖經研讀入門課程',
    titleEn: 'Bible Study Foundations',
    descriptionZh: '六週的聖經研讀基礎課程，適合初信者或想系統學習聖經的弟兄姊妹。',
    descriptionEn: 'A 6-week foundational Bible study course, ideal for new believers or anyone wanting to study Scripture systematically.',
    date: '2025-10-07',
    time: '19:30 - 21:00',
    locationZh: '教會 B203 教室',
    locationEn: 'Room B203',
    category: 'training',
    seats: 30,
    seatsLeft: 12,
    fee: 0,
    image: '/images/events/bible.jpg',
  },
  {
    id: '5',
    titleZh: '感恩節晚宴',
    titleEn: 'Thanksgiving Dinner',
    descriptionZh: '一年一度的感恩節大家庭晚宴，帶著感謝的心，與弟兄姊妹一起享用豐盛的愛筵。',
    descriptionEn: 'Our annual Thanksgiving family dinner — come with a grateful heart and enjoy a feast with fellow believers.',
    date: '2025-11-23',
    time: '18:00 - 21:00',
    locationZh: '教會多功能廳',
    locationEn: 'Multi-Purpose Hall',
    category: 'community',
    seats: 200,
    seatsLeft: 88,
    fee: 300,
    image: '/images/events/thanksgiving.jpg',
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
