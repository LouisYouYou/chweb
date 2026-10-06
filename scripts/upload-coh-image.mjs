import { createClient } from '@sanity/client'
import { createReadStream } from 'fs'

const client = createClient({
  projectId: '7zy0rjbx',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const asset = await client.assets.upload('image', createReadStream('/Users/louis/Desktop/1328149.jpg'), {
  filename: 'coh-october-2026.jpg',
})
console.log('Uploaded asset:', asset._id)

const res = await client.patch('churchEvent-5')
  .set({ image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } })
  .commit()
console.log('Updated event image:', res._id)
