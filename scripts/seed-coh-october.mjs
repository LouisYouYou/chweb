import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '7zy0rjbx',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const event = {
  _id: 'churchEvent-5',
  _type: 'churchEvent',
  titleZh: '榮耀COH｜十月份空間開放時段',
  titleEn: 'Glory COH | October Open Space Sessions',
  descriptionZh: '給寶貝一個自在探索、專注工作的空間，也給親子一段慢下來、用心陪伴的精心時刻。榮耀COH 用心設計多元活動，打造優質蒙式環境，讓寶貝在生活中探索、操作、學習與成長。歡迎爸爸媽媽帶著寶貝一起來體驗！\n\n🎁 全勤小禮：寶貝觀察記錄表 + 親子精心時刻照片',
  descriptionEn: 'A safe space for little ones to explore freely and focus deeply — and for parents to slow down and enjoy quality moments together. Glory COH offers thoughtfully designed Montessori-inspired activities. Join us with your child!',
  date: '2026-10-06',
  time: '週二 15:00-16:30 ／ 週三 13:30-15:00 ／ 週四 10:30-12:00',
  locationZh: '榮耀堂',
  locationEn: 'Glory Church',
  category: 'family',
  fee: 0,
  courseItems: [
    { nameZh: '週二', nameEn: 'Tuesday', day: '10/6、10/20、10/27', time: '下午 3:00－4:30' },
    { nameZh: '週三', nameEn: 'Wednesday', day: '10/7、10/28', time: '下午 1:30－3:00' },
    { nameZh: '週四', nameEn: 'Thursday', day: '10/8、10/22、10/29', time: '上午 10:30－12:00' },
  ],
}

const res = await client.createOrReplace(event)
console.log('Created:', res._id, res.titleZh)
