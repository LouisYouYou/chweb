import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'dailyScripture',
  title: '每日經文',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: '📅 日期',
      type: 'date',
      description: '請選擇這張經文圖片對應的日期',
      validation: (Rule) => Rule.required().error('請填寫日期'),
      options: { dateFormat: 'YYYY年MM月DD日' },
    }),
    defineField({
      name: 'image',
      title: '🖼️ 經文圖片',
      type: 'image',
      description: '上傳當天的每日經文圖片（支援 JPG、PNG，建議寬度 1080px 以上）',
      validation: (Rule) => Rule.required().error('請上傳圖片'),
      options: {
        hotspot: true,
        accept: 'image/*',
      },
    }),
  ],
  preview: {
    select: {
      title: 'date',
      media: 'image',
    },
    prepare({ title, media }) {
      const formatted = title
        ? new Date(title + 'T00:00:00').toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short',
          })
        : '（未填日期）'
      return {
        title: formatted,
        subtitle: '每日經文',
        media,
      }
    },
  },
  orderings: [
    {
      title: '日期（最新在前）',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
})
