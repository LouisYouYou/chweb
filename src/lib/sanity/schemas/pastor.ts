import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'pastor',
  title: '牧者團隊',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: '排列順序',
      type: 'number',
      description: '數字越小越前面（主任牧師填 1，傳道填 2）',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'photo',
      title: '📷 牧者照片',
      type: 'image',
      options: { hotspot: true },
      description: '建議正方形或接近正方形，JPG 或 PNG',
    }),
  ],
  preview: {
    select: { order: 'order' },
    prepare({ order }) {
      return {
        title: `牧者 #${order}`,
        subtitle: '點擊上傳照片',
      }
    },
  },
  orderings: [
    {
      title: '順序',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
