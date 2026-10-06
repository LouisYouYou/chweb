import { defineType, defineField } from 'sanity'

const categoryList = [
  { title: '⛪ 崇拜 Worship',     value: 'worship' },
  { title: '👪 家庭 Family',       value: 'family' },
  { title: '👥 青年 Youth',        value: 'youth' },
  { title: '🌱 社區 Community',   value: 'community' },
  { title: '🏕️ 退修 Retreat',     value: 'retreat' },
  { title: '📖 訓練 Training',     value: 'training' },
]

const catLabel: Record<string, string> = {
  worship: '崇拜', family: '家庭', youth: '青年', community: '社區', retreat: '退修', training: '訓練',
}

export default defineType({
  name: 'churchEvent',
  title: '活動行事曆',
  type: 'document',
  fields: [
    defineField({
      name: 'titleZh',
      title: '📌 標題（中文）',
      type: 'string',
      validation: (Rule) => Rule.required().error('請填寫中文標題'),
    }),
    defineField({
      name: 'titleEn',
      title: '📌 Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required().error('Please enter English title'),
    }),
    defineField({
      name: 'descriptionZh',
      title: '📝 說明（中文）',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'descriptionEn',
      title: '📝 Description (English)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'date',
      title: '📅 活動日期',
      type: 'date',
      validation: (Rule) => Rule.required().error('請填寫活動日期'),
      options: { dateFormat: 'YYYY-MM-DD' },
    }),
    defineField({
      name: 'time',
      title: '🕐 時間',
      type: 'string',
      description: '例：10:00 - 11:30',
    }),
    defineField({
      name: 'locationZh',
      title: '📍 地點（中文）',
      type: 'string',
      description: '例：教會主堂、線上',
    }),
    defineField({
      name: 'locationEn',
      title: '📍 Location (English)',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: '🏷️ 類別',
      type: 'string',
      options: { list: categoryList, layout: 'radio' },
      initialValue: 'community',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fee',
      title: '💰 費用（NT$）',
      type: 'number',
      description: '免費請填 0，不確定可留空',
    }),
    defineField({
      name: 'seats',
      title: '🪑 名額上限',
      type: 'number',
    }),
    defineField({
      name: 'seatsLeft',
      title: '🔢 剩餘名額',
      type: 'number',
    }),
    defineField({
      name: 'registrationUrl',
      title: '📝 報名連結（Google 表單）',
      type: 'url',
      description: '貼上 Google 表單分享連結，有填才顯示「立即報名」按鈕',
    }),
    defineField({
      name: 'image',
      title: '🖼️ 活動海報（選填）',
      type: 'image',
      options: { hotspot: true },
      description: '建議長邊 1200px 以上，支援 JPG / PNG',
    }),
    defineField({
      name: 'courseItems',
      title: '📋 課程時間表（選填）',
      type: 'array',
      description: '適用多堂課程的活動，如：致福益人學院',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'nameZh', title: '課程名稱（中）', type: 'string' }),
            defineField({ name: 'nameEn', title: 'Course Name (EN)', type: 'string' }),
            defineField({ name: 'day', title: '星期', type: 'string', description: '例：週三' }),
            defineField({ name: 'time', title: '時間', type: 'string', description: '例：09:30' }),
          ],
          preview: {
            select: { title: 'nameZh', subtitle: 'day' },
            prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
              return { title: title ?? '（未填名稱）', subtitle }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      titleZh: 'titleZh',
      date: 'date',
      category: 'category',
      media: 'image',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare({ titleZh, date, category, media }: { titleZh?: string; date?: string; category?: string; media?: any }) {
      const dateStr = date
        ? new Date(date + 'T00:00:00').toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })
        : ''
      return {
        title: titleZh ?? '（未填標題）',
        subtitle: `${catLabel[category ?? ''] ?? ''} · ${dateStr}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: '日期（最近在前）',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
    {
      title: '日期（最舊在前）',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
})
