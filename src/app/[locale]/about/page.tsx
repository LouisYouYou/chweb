import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server';
import { Heart, BookOpen, Users, Globe } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import PageHero from '@/components/layout/PageHero';
import { getPastors, getStoryCards } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'

import { buildMetadata, pageSEO } from '@/lib/seo/metadata'
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata(locale, pageSEO.about)
}

const iconMap = { heart: Heart, book: BookOpen, users: Users, globe: Globe };

export default async function AboutPage() {
  const t = await getTranslations('about');
  const pastors = await getPastors();
  const stories = await getStoryCards();

  const values = [
    { icon: 'heart' as const, title: t('values.0.title'), text: t('values.0.text') },
    { icon: 'book' as const, title: t('values.1.title'), text: t('values.1.text') },
    { icon: 'users' as const, title: t('values.2.title'), text: t('values.2.text') },
    { icon: 'globe' as const, title: t('values.3.title'), text: t('values.3.text') },
  ];

  return (
    <div>
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-wine-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-wine-900 mb-4">{t('mission_title')}</h2>
            <p className="text-gray-600 leading-relaxed">{t('mission_text')}</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-wine-900 mb-4">{t('vision_title')}</h2>
            <p className="text-gray-700 leading-relaxed text-base mb-4">{t('vision_intro')}</p>
            <div className="border-t border-amber-200 pt-4">
              <p className="text-xs text-gray-400 leading-relaxed">{t('vision_text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-wine-900 mb-2">{t('values_title')}</h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon, title, text }, i) => {
              const Icon = iconMap[icon];
              return (
                <FadeIn key={title} delay={i * 100} className="flex flex-col">
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow flex-1">
                  <div className="w-14 h-14 church-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-bold text-wine-900 text-lg mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
                </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pastoral Team */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-wine-50/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex justify-center mb-3">
              <span className="text-amber-600 text-xs font-semibold tracking-[0.3em] uppercase border-l-2 border-amber-400 pl-3">Our Shepherds</span>
            </div>
            <h2 className="text-3xl font-bold text-wine-900 mb-2">{t('team_title')}</h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mt-4" />
          </div>

          <div className="flex flex-col gap-6">
            {[0, 1].map((i) => {
              const pastor = pastors[i]
              const initials = i === 0 ? '陳' : '羅'
              return (
                <FadeIn key={i} delay={i * 150}>
                <div className="bg-white rounded-3xl border border-wine-100 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div className="flex flex-row items-stretch">
                    <div className="w-1.5 shrink-0 church-gradient rounded-l-3xl" />

                    <div className="flex flex-col sm:flex-row items-center gap-6 p-7 sm:p-8 w-full">
                      {/* Photo circle */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md ring-2 ring-wine-100 shrink-0">
                        {pastor?.photo?.asset ? (
                          <Image
                            src={urlFor(pastor.photo).width(224).height(224).fit('crop').auto('format').url()}
                            alt={t(`team.${i}.name`)}
                            width={112}
                            height={112}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full church-gradient flex items-center justify-center">
                            <span className="text-white text-4xl font-bold select-none">{initials}</span>
                          </div>
                        )}
                      </div>

                      {/* Text */}
                      <div className="text-center sm:text-left">
                        <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold tracking-wider mb-2">
                          {t(`team.${i}.role`)}
                        </span>
                        <h3 className="text-2xl font-bold text-wine-900 mb-2">{t(`team.${i}.name`)}</h3>
                        <div className="w-8 h-0.5 bg-amber-400 rounded-full mb-3 mx-auto sm:mx-0" />
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
                          {t(`team.${i}.desc`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* Story Cards — only rendered when Sanity has content */}
      {stories.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-3">
                <span className="text-amber-600 text-xs font-semibold tracking-[0.3em] uppercase border-l-2 border-amber-400 pl-3">Our People</span>
              </div>
              <h2 className="text-3xl font-bold text-wine-900 mb-2">{t('stories_title')}</h2>
              <p className="text-gray-400 text-sm mt-3">{t('stories_subtitle')}</p>
              <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story, i) => (
                <FadeIn key={story._id} delay={i * 80}>
                  <div className="bg-gray-50 rounded-2xl p-6 flex flex-col gap-4 h-full border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all duration-300">
                    {/* Quote */}
                    <p className="text-gray-700 leading-relaxed text-sm flex-1">
                      <span className="text-amber-400 text-2xl leading-none mr-1 select-none">"</span>
                      {story.quote}
                      <span className="text-amber-400 text-2xl leading-none ml-1 select-none">"</span>
                    </p>

                    {/* Person */}
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-amber-100">
                        {story.photo?.asset ? (
                          <Image
                            src={urlFor(story.photo).width(80).height(80).fit('crop').auto('format').url()}
                            alt={story.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full church-gradient flex items-center justify-center">
                            <span className="text-white text-sm font-bold select-none">
                              {story.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-wine-900">{story.name}</p>
                        {story.label && (
                          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                            {story.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* History */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-wine-900 mb-6">{t('history_title')}</h2>
          <p className="text-gray-600 leading-relaxed text-lg">{t('history_text')}</p>
        </div>
      </section>
    </div>
  );
}

