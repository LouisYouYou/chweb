import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'storyCard',
  title: '人物故事',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: '排列順序',
      type: 'number',
      description: '數字越小越前面',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'name',
      title: '姓名或暱稱',
      type: 'string',
      description: '可用暱稱或匿名，例如「第一次來的 Emily」',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: '標籤',
      type: 'string',
      description: '例如：志工、新朋友、親子班家長、課後班老師',
    }),
    defineField({
      name: 'quote',
      title: '一句話感受',
      type: 'text',
      rows: 3,
      description: '建議 60 字以內，用第一人稱寫',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'photo',
      title: '照片（選填）',
      type: 'image',
      options: { hotspot: true },
      description: '建議正方形，JPG 或 PNG',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'label', media: 'photo' },
  },
  orderings: [
    {
      title: '順序',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
