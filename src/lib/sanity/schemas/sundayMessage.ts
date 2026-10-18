import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'sundayMessage',
  title: '本週主日信息',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: '📅 主日日期',
      type: 'date',
      validation: (Rule) => Rule.required().error('請填寫主日日期'),
      options: { dateFormat: 'YYYY年MM月DD日' },
    }),
    defineField({
      name: 'title',
      title: '✝️ 信息標題',
      type: 'string',
      validation: (Rule) => Rule.required().error('請填寫信息標題'),
    }),
    defineField({
      name: 'preacher',
      title: '🎤 講道者',
      type: 'string',
      validation: (Rule) => Rule.required().error('請填寫講道者姓名'),
      description: '例：陳大明牧師、王小花傳道',
    }),
    defineField({
      name: 'scripture',
      title: '📖 本週經文',
      type: 'string',
      description: '例：約翰福音 3:16、詩篇 23:1-6',
    }),
    defineField({
      name: 'image',
      title: '🖼️ 信息主圖',
      type: 'image',
      options: { hotspot: true },
      description: '建議尺寸 1200×675（16:9），JPG 或 PNG',
    }),
    defineField({
      name: 'summary',
      title: '📝 信息摘要（選填）',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: '正文', value: 'normal' },
            { title: '大標題', value: 'h3' },
            { title: '小標題', value: 'h4' },
            { title: '引用語句', value: 'blockquote' },
          ],
          lists: [],
          marks: {
            decorators: [
              { title: '粗體 Bold', value: 'strong' },
              { title: '斜體 Italic', value: 'em' },
              { title: '底線 Underline', value: 'underline' },
            ],
            annotations: [],
          },
        }),
      ],
      description: '可設定文字樣式（大標題、小標題、引用語句）與粗體、斜體、底線，顯示於首頁信息預覽',
    }),
    defineField({
      name: 'youtubeUrl',
      title: '▶️ YouTube 連結（選填）',
      type: 'url',
      description: '貼上完整講道影片連結，有填才顯示「觀看完整講道」按鈕',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      preacher: 'preacher',
      media: 'image',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare({ title, date, preacher, media }: { title?: string; date?: string; preacher?: string; media?: any }) {
      const dateStr = date
        ? new Date(date + 'T00:00:00').toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
        : ''
      return {
        title: title ?? '（未填標題）',
        subtitle: `${dateStr}　${preacher ?? ''}`,
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
