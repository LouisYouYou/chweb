export interface Sermon {
  id: string;
  titleZh: string;
  titleEn: string;
  speakerZh: string;
  speakerEn: string;
  date: string;
  series: string;
  seriesEn: string;
  category: '主日講道' | '聖經研讀' | '特別聚會' | '青年講道';
  scripture: string;
  youtubeUrl: string;
}

export const sermonCategories = [
  { key: 'all', zh: '全部', en: 'All' },
  { key: '主日講道', zh: '主日講道', en: 'Sunday Sermon' },
  { key: '聖經研讀', zh: '聖經研讀', en: 'Bible Study' },
  { key: '特別聚會', zh: '特別聚會', en: 'Special Service' },
  { key: '青年講道', zh: '青年講道', en: 'Youth Message' },
];

export function extractYoutubeId(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : '';
}

export function getYoutubeThumbnail(url: string): string {
  const id = extractYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

export function getYoutubeEmbedUrl(url: string): string {
  const id = extractYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : '';
}

export const sermons: Sermon[] = [
  {
    id: '1',
    titleZh: '講道標題（請更新）',
    titleEn: 'Sermon Title (Please Update)',
    speakerZh: '講員姓名',
    speakerEn: 'Speaker Name',
    date: '2026-09-14',
    series: '主日系列',
    seriesEn: 'Sunday Series',
    category: '主日講道',
    scripture: '請填入經文',
    youtubeUrl: 'https://www.youtube.com/watch?v=-irNdmLFjVA',
  },
];
