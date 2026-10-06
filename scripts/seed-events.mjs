/**
 * 把靜態活動資料匯入 Sanity CMS
 * 使用方式：
 *   SANITY_TOKEN=xxx node scripts/seed-events.mjs
 *
 * 取得 token：
 *   https://www.sanity.io/manage → 選專案 (7zy0rjbx) → API → Tokens → Add API token
 *   權限選 Editor（可寫入）
 */

import { createClient } from '@sanity/client'
import { createReadStream, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const token = process.env.SANITY_TOKEN
if (!token) {
  console.error('\n❌  缺少 SANITY_TOKEN 環境變數')
  console.error('   取得 token：https://www.sanity.io/manage → API → Tokens → Add API token（Editor 權限）')
  console.error('   執行方式：SANITY_TOKEN=xxx node scripts/seed-events.mjs\n')
  process.exit(1)
}

const client = createClient({
  projectId: '7zy0rjbx',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function uploadImage(relativePath) {
  const fullPath = join(__dirname, '..', 'public', relativePath)
  if (!existsSync(fullPath)) {
    console.warn(`   ⚠️  圖片不存在，跳過：${fullPath}`)
    return undefined
  }
  console.log(`   📤 上傳圖片：${relativePath}`)
  const asset = await client.assets.upload('image', createReadStream(fullPath), {
    filename: relativePath.split('/').pop(),
  })
  console.log(`   ✅ 圖片上傳完成：${asset._id}`)
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  }
}

// 對應 src/lib/data/events.ts 的 4 筆活動
const staticEvents = [
  {
    _localId: '4',
    titleZh: '🎨 蒙式藝術手作課 — 搖滾大象',
    titleEn: '🎨 Montessori Art Workshop — The Rocking Elephant',
    descriptionZh: '讓孩子透過藝術與創作，享受一段自在探索、動手實作的美好時光！剪貼工作 × 創意彩繪，運用不同素材與色彩，讓孩子自由發揮想像力，創作屬於自己的「搖滾大象」。在操作中培養專注力、在創作中發現美感、在陪伴中珍藏親子時光。適合 3 歲以上，親子同樂，一起動手玩藝術！',
    descriptionEn: 'Let children freely explore and create with their hands through art! Paper cutting × creative painting — using different materials and colors for children to unleash their imagination and craft their very own Rocking Elephant. Builds focus through hands-on activity, nurtures aesthetic sense through creation, and treasures precious parent-child time. Suitable for ages 3+.',
    date: '2026-10-21',
    time: '13:30 - 15:00',
    locationZh: '教會主堂',
    locationEn: 'Main Sanctuary',
    category: 'community',
    fee: 200,
    seats: 20,
    _imagePath: 'images/events/montessori-elephant-2026-10-21.jpg',
  },
  {
    _localId: '3',
    titleZh: '聖經講座 — 歷代志上',
    titleEn: 'Bible Seminar — 1 Chronicles',
    descriptionZh: '邀請黃正人老師／博士主講歷代志上，深入認識神的話語，歡迎弟兄姊妹踴躍參加。',
    descriptionEn: 'Dr. Huang Zheng-Ren leads an in-depth seminar on 1 Chronicles. All are welcome.',
    date: '2026-10-03',
    time: '09:00',
    locationZh: '線上',
    locationEn: 'Online',
    category: 'training',
    fee: 0,
  },
  {
    _localId: '2',
    titleZh: '家庭團契',
    titleEn: 'Family Fellowship',
    descriptionZh: '讓愛重新在家庭中連結，邀請已婚的夫妻一同參加，一起經歷神在家庭中的恩典與更新。',
    descriptionEn: "Rekindling love within families — all married couples are warmly invited to experience God's grace and renewal together.",
    date: '2026-10-17',
    time: '15:00 - 17:00',
    locationZh: '教會主堂',
    locationEn: 'Main Sanctuary',
    category: 'retreat',
    fee: 0,
  },
  {
    _localId: '1',
    titleZh: '致福益人學院課程',
    titleEn: 'Fu-Yi Community Learning Program',
    descriptionZh: '多樣化的社區互動課程，包含油性粉彩入門、創意拼豆世界、皮拉提斯等，歡迎社區鄰里一起來學習、交流、成長。',
    descriptionEn: 'A diverse range of community interactive courses including oil pastel basics, creative Hama bead art, and Pilates. All community members are warmly welcome.',
    date: '2026-10-01',
    time: '依各課程時間',
    locationZh: '教會主堂',
    locationEn: 'Main Sanctuary',
    category: 'community',
    fee: 1500,
    courseItems: [
      { nameZh: '油性粉彩', nameEn: 'Oil Pastel',   day: '週三', time: '09:30' },
      { nameZh: '皮拉提斯', nameEn: 'Pilates',       day: '週二', time: '14:00' },
      { nameZh: '拼豆創意', nameEn: 'Hama Bead Art', day: '週六', time: '10:00' },
    ],
  },
]

async function seed() {
  console.log('\n🌱 開始匯入活動資料到 Sanity...\n')

  for (const ev of staticEvents) {
    const { _localId, _imagePath, ...fields } = ev

    console.log(`➤  ${fields.titleZh} (${fields.date})`)

    const doc = {
      _type: 'churchEvent',
      _id: `churchEvent-${_localId}`,
      ...fields,
    }

    if (_imagePath) {
      doc.image = await uploadImage(_imagePath)
    }

    await client.createOrReplace(doc)
    console.log(`   ✅ 建立完成：churchEvent-${_localId}\n`)
  }

  console.log('🎉 全部匯入完成！到 /studio 的「活動行事曆」確認。\n')
}

seed().catch((err) => {
  console.error('\n❌ 發生錯誤：', err.message)
  process.exit(1)
})
