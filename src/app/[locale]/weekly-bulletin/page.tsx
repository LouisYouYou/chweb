import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import { FileText, Download, Calendar } from 'lucide-react'
import { getAllBulletins } from '@/lib/sanity/queries'

export const metadata: Metadata = {
  title: '教會週報',
  description: '行道會南勢角榮耀堂每週週報，依主日日期排序，點擊即可下載閱讀。',
}

export const revalidate = 3600

export default async function WeeklyBulletinPage() {
  const t = await getTranslations('bulletin')
  const locale = await getLocale()
  const zh = locale === 'zh-TW'
  const bulletins = await getAllBulletins()

  return (
    <div>
      {/* Hero */}
      <section className="church-gradient py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-wine-200 text-lg">{t('subtitle')}</p>
          <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mt-6" />
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {bulletins.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <FileText size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">{t('empty')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bulletins.map((bulletin) => {
                const [year, month, day] = bulletin.date.split('-')
                const formatted = new Date(bulletin.date + 'T00:00:00').toLocaleDateString(
                  zh ? 'zh-TW' : 'en-US',
                  { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }
                )
                return (
                  <div
                    key={bulletin._id}
                    className="flex items-center gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5"
                  >
                    {/* Date badge */}
                    <div className="church-gradient rounded-2xl px-4 py-3 text-center shrink-0 min-w-[60px] shadow-md">
                      <p className="text-[10px] font-bold text-wine-200 tracking-widest">{month}</p>
                      <p className="text-2xl font-black text-white leading-tight">{day}</p>
                      <p className="text-[10px] text-wine-300">{year}</p>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText size={14} className="text-wine-400 shrink-0" />
                        <p className="text-sm font-semibold text-wine-900 truncate">
                          {zh ? '教會週報' : 'Church Bulletin'} · {formatted}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar size={11} />
                        <span>{zh ? '主日週報' : 'Sunday Bulletin'}</span>
                      </div>
                    </div>

                    {/* Download */}
                    {bulletin.file?.asset?.url && (
                      <a
                        href={bulletin.file.asset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="flex items-center gap-2 btn-amber shrink-0 text-sm"
                      >
                        <Download size={14} />
                        {zh ? '下載' : 'Download'}
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
