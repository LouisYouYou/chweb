import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'galleryPhoto',
  title: '教會相片集',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: '📅 活動日期',
      type: 'date',
      description: '這張照片的拍攝或活動日期',
      validation: (Rule) => Rule.required().error('請填寫日期'),
      options: { dateFormat: 'YYYY年MM月DD日' },
    }),
    defineField({
      name: 'caption',
      title: '📝 照片說明（選填）',
      type: 'string',
      description: '活動名稱或照片描述，例如：主日崇拜、感恩節聚會',
    }),
    defineField({
      name: 'image',
      title: '🖼️ 照片',
      type: 'image',
      description: '支援 JPG、PNG，建議長邊 1200px 以上',
      validation: (Rule) => Rule.required().error('請上傳照片'),
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      subtitle: 'date',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      const dateStr = subtitle
        ? new Date(subtitle + 'T00:00:00').toLocaleDateString('zh-TW', {
            year: 'numeric', month: 'long', day: 'numeric',
          })
        : ''
      return {
        title: title || '（未填說明）',
        subtitle: dateStr,
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
