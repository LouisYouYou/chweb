import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server';
import { Heart, BookOpen, Users, Globe } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
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
      {/* Page opening — editorial left-aligned, ink-950 */}
      <section
        className="relative bg-ink-950 overflow-hidden"
        style={{ minHeight: 'calc(13rem + 6.5rem)', marginTop: '-6.5rem', paddingTop: '6.5rem' }}
      >
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,#fff 1px,transparent 0)', backgroundSize:'32px 32px' }} />
        <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 40% 30%, rgba(90,10,30,0.4) 0%, transparent 60%)' }} />
        <span aria-hidden="true" className="absolute right-0 bottom-0 select-none pointer-events-none font-black text-white leading-none"
          style={{ fontSize: 'clamp(14rem, 28vw, 22rem)', opacity: 0.025, lineHeight: 0.8 }}>榮</span>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-stretch gap-5 mb-6">
            <div aria-hidden="true" className="w-px self-stretch bg-gradient-to-b from-wine-500 to-transparent shrink-0" />
            <div aria-hidden="true" className="self-center w-10 h-px bg-gradient-to-r from-gold-warm-500 to-transparent" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-5">{t('title')}</h1>
          <p className="text-wine-200 text-base sm:text-lg max-w-xl leading-relaxed">{t('subtitle')}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-wine-50/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-ink-800 mb-4">{t('mission_title')}</h2>
            <p className="text-ink-600 leading-relaxed">{t('mission_text')}</p>
          </div>
          <div className="bg-gold-warm-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-ink-800 mb-4">{t('vision_title')}</h2>
            <p className="text-ink-700 leading-relaxed text-base mb-4">{t('vision_intro')}</p>
            <div className="border-t border-gold-warm-200 pt-4">
              <p className="text-xs text-ink-400 leading-relaxed">{t('vision_text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-warm-beige/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ink-800 mb-2">{t('values_title')}</h2>
            <div className="w-16 h-1 bg-gold-warm-500 mx-auto rounded-full mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {values.map(({ icon, title, text }, i) => {
              const Icon = iconMap[icon];
              return (
                <FadeIn key={title} delay={i * 100}>
                  <div className="flex gap-5">
                    <div aria-hidden="true" className="shrink-0 w-10 h-10 wine-gradient rounded-lg flex items-center justify-center mt-0.5">
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-ink-800 text-base mb-1.5">{title}</h3>
                      <p className="text-sm text-ink-500 leading-relaxed">{text}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pastoral Team */}
      <section className="py-20 px-4 bg-gradient-to-b from-warm-white to-wine-50/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex justify-center mb-3">
              <span className="text-gold-warm-600 text-xs font-semibold border-l-2 border-gold-warm-400 pl-3">Our Shepherds</span>
            </div>
            <h2 className="text-3xl font-bold text-ink-800 mb-2">{t('team_title')}</h2>
            <div className="w-16 h-1 bg-gold-warm-500 mx-auto rounded-full mt-4" />
          </div>

          {/* Pastoral team — editorial divide-y rows, no card containers */}
          <div className="divide-y divide-wine-50">
            {[0, 1].map((i) => {
              const pastor = pastors[i]
              const initials = i === 0 ? '陳' : '羅'
              return (
                <FadeIn key={i} delay={i * 150}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 py-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 ring-2 ring-wine-100">
                      {pastor?.photo?.asset ? (
                        <Image
                          src={urlFor(pastor.photo).width(160).height(160).fit('crop').auto('format').url()}
                          alt={t(`team.${i}.name`)}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full wine-gradient flex items-center justify-center">
                          <span className="text-white text-2xl font-bold select-none">{initials}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gold-warm-600 mb-1">{t(`team.${i}.role`)}</p>
                      <h3 className="text-xl font-bold text-ink-800 mb-2">{t(`team.${i}.name`)}</h3>
                      <div aria-hidden="true" className="w-8 h-px bg-gold-warm-400 mb-3" />
                      <p className="text-sm text-ink-500 leading-relaxed max-w-xl">{t(`team.${i}.desc`)}</p>
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
        <section className="py-20 px-4 bg-warm-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-3">
                <span className="text-gold-warm-600 text-xs font-semibold border-l-2 border-gold-warm-400 pl-3">Our People</span>
              </div>
              <h2 className="text-3xl font-bold text-ink-800 mb-2">{t('stories_title')}</h2>
              <p className="text-ink-400 text-sm mt-3">{t('stories_subtitle')}</p>
              <div className="w-16 h-1 bg-gold-warm-500 mx-auto rounded-full mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story, i) => (
                <FadeIn key={story._id} delay={i * 80}>
                  <div className="bg-warm-beige/20 rounded-2xl p-6 flex flex-col gap-4 h-full border border-warm-beige/40 hover:border-gold-warm-200 hover:shadow-md transition-all duration-300">
                    {/* Quote */}
                    <p className="text-ink-700 leading-relaxed text-sm flex-1">
                      <span className="text-gold-warm-400 text-2xl leading-none mr-1 select-none">"</span>
                      {story.quote}
                      <span className="text-gold-warm-400 text-2xl leading-none ml-1 select-none">"</span>
                    </p>

                    {/* Person */}
                    <div className="flex items-center gap-3 pt-3 border-t border-warm-beige/40">
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-gold-warm-100">
                        {story.photo?.asset ? (
                          <Image
                            src={urlFor(story.photo).width(80).height(80).fit('crop').auto('format').url()}
                            alt={story.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full wine-gradient flex items-center justify-center">
                            <span className="text-white text-sm font-bold select-none">
                              {story.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink-800">{story.name}</p>
                        {story.label && (
                          <span className="text-xs text-gold-warm-600 bg-gold-warm-50 px-2 py-0.5 rounded-full border border-gold-warm-100">
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
      <section className="py-20 px-4 bg-warm-beige/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-ink-800 mb-6">{t('history_title')}</h2>
          <p className="text-ink-600 leading-relaxed text-lg">{t('history_text')}</p>
        </div>
      </section>
    </div>
  );
}

