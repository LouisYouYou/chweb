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
      name: 'verseZh',
      title: '經文（中文）',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'verseEn',
      title: '經文（英文）',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'referenceZh',
      title: '經文出處（中文）',
      type: 'string',
      description: '例：約翰福音 3:16',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'referenceEn',
      title: '經文出處（英文）',
      type: 'string',
      description: 'e.g. John 3:16',
    }),
    defineField({
      name: 'reflectionZh',
      title: '默想/短文（中文）',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'reflectionEn',
      title: '默想/短文（英文）',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'image',
      title: '配圖',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: '圖片說明',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'referenceZh',
      subtitle: 'date',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? '（未填出處）',
        subtitle: subtitle,
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
