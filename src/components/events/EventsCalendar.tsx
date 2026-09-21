'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, MapPin, Users, Clock, X, CheckCircle } from 'lucide-react';
import { events, ChurchEvent } from '@/lib/data/events';

const categoryColors: Record<string, string> = {
  worship: 'border-l-wine-500 bg-wine-50',
  youth: 'border-l-purple-500 bg-purple-50',
  community: 'border-l-green-500 bg-green-50',
  retreat: 'border-l-amber-500 bg-amber-50',
  training: 'border-l-teal-500 bg-teal-50',
};

const categoryBadge: Record<string, string> = {
  worship: 'bg-wine-100 text-wine-700',
  youth: 'bg-purple-100 text-purple-700',
  community: 'bg-green-100 text-green-700',
  retreat: 'bg-amber-100 text-amber-700',
  training: 'bg-teal-100 text-teal-700',
};

const categoryLabels: Record<string, { zh: string; en: string }> = {
  worship: { zh: '崇拜', en: 'Worship' },
  youth: { zh: '青年', en: 'Youth' },
  community: { zh: '社區', en: 'Community' },
  retreat: { zh: '退修', en: 'Retreat' },
  training: { zh: '訓練', en: 'Training' },
};

interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface EventsCalendarProps {
  locale: string;
}

export default function EventsCalendar({ locale }: EventsCalendarProps) {
  const t = useTranslations('events');
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);
  const [formData, setFormData] = useState<RegistrationFormData>({ name: '', email: '', phone: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = ['all', ...Object.keys(categoryLabels)];

  const filtered = activeFilter === 'all'
    ? events
    : events.filter((e) => e.category === activeFilter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedEvent(null);
      setFormData({ name: '', email: '', phone: '', notes: '' });
    }, 3000);
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === f
                  ? 'church-gradient text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-wine-50 hover:text-wine-700'
              }`}
            >
              {f === 'all'
                ? (locale === 'zh-TW' ? '全部' : 'All')
                : (locale === 'zh-TW' ? categoryLabels[f].zh : categoryLabels[f].en)}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div className="space-y-5">
          {filtered.map((event) => {
            const [year, month, day] = event.date.split('-');
            return (
              <div
                key={event.id}
                className={`rounded-2xl border-l-4 p-6 ${categoryColors[event.category]} hover:shadow-md transition-shadow`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Date */}
                  <div className="church-gradient rounded-xl p-3 text-center min-w-[60px] text-white shrink-0">
                    <p className="text-xs font-medium opacity-80">{month}</p>
                    <p className="text-2xl font-bold leading-tight">{day}</p>
                    <p className="text-xs opacity-80">{year}</p>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${categoryBadge[event.category]}`}>
                        {locale === 'zh-TW' ? categoryLabels[event.category].zh : categoryLabels[event.category].en}
                      </span>
                      {event.fee === 0 ? (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">{t('free')}</span>
                      ) : (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
                          NT${event.fee}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-wine-900 mb-2">
                      {locale === 'zh-TW' ? event.titleZh : event.titleEn}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {locale === 'zh-TW' ? event.descriptionZh : event.descriptionEn}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} />
                        {locale === 'zh-TW' ? event.locationZh : event.locationEn}
                      </span>
                      {event.seatsLeft !== undefined && (
                        <span className="flex items-center gap-1.5">
                          <Users size={12} />
                          {t('seats_left')}: <strong className={event.seatsLeft < 10 ? 'text-red-600' : 'text-green-600'}>{event.seatsLeft}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <span className="shrink-0 px-6 py-3 bg-gray-200 text-gray-400 font-medium text-sm rounded-xl line-through cursor-not-allowed select-none">
                    {t('register')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registration Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <div
            className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-wine-900 mb-2">{t('registration.success')}</h3>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-wine-900">{t('registration.title')}</h2>
                  <button onClick={() => setSelectedEvent(null)} className="p-1.5 hover:bg-gray-100 rounded-full">
                    <X size={18} />
                  </button>
                </div>
                <p className="text-sm font-medium text-wine-700 bg-wine-50 rounded-xl px-4 py-3 mb-5">
                  {locale === 'zh-TW' ? selectedEvent.titleZh : selectedEvent.titleEn}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('registration.name')} *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('registration.email')} *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('registration.phone')}</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('registration.notes')}</label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-300 text-sm resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(null)}
                      className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50"
                    >
                      {t('registration.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 church-gradient text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      {t('registration.submit')}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
