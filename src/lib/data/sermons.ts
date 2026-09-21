export interface Sermon {
  id: string;
  titleZh: string;
  titleEn: string;
  speakerZh: string;
  speakerEn: string;
  date: string;
  series: string;
  scripture: string;
  duration: string;
  audioUrl?: string;
  pdfUrl?: string;
  thumbnail?: string;
}

export const sermons: Sermon[] = [
  {
    id: '1',
    titleZh: '恩典夠用',
    titleEn: 'Grace Is Sufficient',
    speakerZh: '林大衛牧師',
    speakerEn: 'Pastor David Lin',
    date: '2025-09-15',
    series: 'Corinthians',
    scripture: '哥林多後書 12:9',
    duration: '45:32',
    thumbnail: '/images/sermons/sermon1.jpg',
  },
  {
    id: '2',
    titleZh: '信心的根基',
    titleEn: 'Foundation of Faith',
    speakerZh: '陳約翰牧師',
    speakerEn: 'Pastor John Chen',
    date: '2025-09-08',
    series: 'Hebrews',
    scripture: '希伯來書 11:1',
    duration: '42:10',
    thumbnail: '/images/sermons/sermon2.jpg',
  },
  {
    id: '3',
    titleZh: '愛的呼召',
    titleEn: 'The Call of Love',
    speakerZh: '林大衛牧師',
    speakerEn: 'Pastor David Lin',
    date: '2025-09-01',
    series: 'John',
    scripture: '約翰福音 15:12',
    duration: '38:45',
    thumbnail: '/images/sermons/sermon3.jpg',
  },
  {
    id: '4',
    titleZh: '平安超越理解',
    titleEn: 'Peace Beyond Understanding',
    speakerZh: '王瑪利亞姐妹',
    speakerEn: 'Sister Maria Wang',
    date: '2025-08-25',
    series: 'Philippians',
    scripture: '腓立比書 4:7',
    duration: '40:18',
    thumbnail: '/images/sermons/sermon4.jpg',
  },
  {
    id: '5',
    titleZh: '禱告的力量',
    titleEn: 'The Power of Prayer',
    speakerZh: '陳約翰牧師',
    speakerEn: 'Pastor John Chen',
    date: '2025-08-18',
    series: 'Prayer Series',
    scripture: '雅各書 5:16',
    duration: '44:55',
    thumbnail: '/images/sermons/sermon5.jpg',
  },
  {
    id: '6',
    titleZh: '盼望的錨',
    titleEn: 'Anchor of Hope',
    speakerZh: '林大衛牧師',
    speakerEn: 'Pastor David Lin',
    date: '2025-08-11',
    series: 'Hebrews',
    scripture: '希伯來書 6:19',
    duration: '41:30',
    thumbnail: '/images/sermons/sermon6.jpg',
  },
];

export const sermonSeries = [...new Set(sermons.map(s => s.series))];
