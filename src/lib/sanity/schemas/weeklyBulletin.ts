import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'weeklyBulletin',
  title: '教會週報',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: '📅 週報日期（主日）',
      type: 'date',
      description: '請選擇該份週報對應的主日日期',
      validation: (Rule) => Rule.required().error('請填寫日期'),
      options: { dateFormat: 'YYYY年MM月DD日' },
    }),
    defineField({
      name: 'file',
      title: '📄 週報檔案（PDF）',
      type: 'file',
      description: '上傳當週週報 PDF 檔案',
      validation: (Rule) => Rule.required().error('請上傳週報檔案'),
      options: {
        accept: '.pdf,application/pdf',
      },
    }),
  ],
  preview: {
    select: {
      title: 'date',
    },
    prepare({ title }) {
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
        subtitle: '教會週報',
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
