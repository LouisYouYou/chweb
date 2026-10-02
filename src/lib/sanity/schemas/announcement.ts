import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'announcement',
  title: '首頁公告',
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
      name: 'contentZh',
      title: '📝 內容（中文）',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'contentEn',
      title: '📝 Content (English)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'type',
      title: '🏷️ 公告類型',
      type: 'string',
      options: {
        list: [
          { title: '📅 活動 Event', value: 'event' },
          { title: '📢 一般通知 Notice', value: 'notice' },
          { title: '🔴 緊急 Urgent', value: 'urgent' },
        ],
        layout: 'radio',
      },
      initialValue: 'notice',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: '🔗 連結（選填）',
      type: 'url',
      description: '點擊公告後跳轉的頁面，可留空',
    }),
    defineField({
      name: 'isPinned',
      title: '📍 置頂',
      type: 'boolean',
      description: '置頂公告會優先顯示',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: '🕐 發佈時間',
      type: 'datetime',
      description: '到達此時間才開始顯示',
      validation: (Rule) => Rule.required().error('請設定發佈時間'),
      options: { dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' },
    }),
    defineField({
      name: 'expiresAt',
      title: '⏰ 到期時間（選填）',
      type: 'datetime',
      description: '到期後自動隱藏，留空則永久顯示',
      options: { dateFormat: 'YYYY-MM-DD', timeFormat: 'HH:mm' },
    }),
  ],
  preview: {
    select: {
      titleZh: 'titleZh',
      type: 'type',
      isPinned: 'isPinned',
      publishedAt: 'publishedAt',
    },
    prepare({ titleZh, type, isPinned, publishedAt }) {
      const typeLabel: Record<string, string> = {
        event: '活動', notice: '通知', urgent: '緊急',
      }
      const pin = isPinned ? '📍 ' : ''
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })
        : ''
      return {
        title: `${pin}${titleZh ?? '（未填標題）'}`,
        subtitle: `${typeLabel[type] ?? ''} · ${date}`,
      }
    },
  },
  orderings: [
    {
      title: '發佈時間（最新在前）',
      name: 'publishedAtDesc',
      by: [
        { field: 'isPinned', direction: 'desc' },
        { field: 'publishedAt', direction: 'desc' },
      ],
    },
  ],
})
