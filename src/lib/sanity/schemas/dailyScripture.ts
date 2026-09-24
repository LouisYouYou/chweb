import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'dailyScripture',
  title: '每日經文',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: '日期',
      type: 'date',
      validation: (Rule) => Rule.required(),
      options: { dateFormat: 'YYYY-MM-DD' },
    }),
    defineField({
      name: 'image',
      title: '配圖',
      type: 'image',
      validation: (Rule) => Rule.required(),
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'date',
      media: 'image',
    },
    prepare({ title, media }) {
      return {
        title: title ?? '（未填日期）',
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
