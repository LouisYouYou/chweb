import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '7zy0rjbx',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const res = await client.patch('churchEvent-2')
  .set({ category: 'family' })
  .commit()

console.log('Updated:', res._id, '→ category:', res.category)
