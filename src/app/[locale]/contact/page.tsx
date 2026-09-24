'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

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

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold text-wine-900 mb-6">{t('form_title')}</h2>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle size={48} className="text-green-500 mb-4" />
                <p className="text-lg font-medium text-green-700">{t('success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-300 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('subject')}</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('message')}</label>
                  <textarea
                    rows={6}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wine-300 text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 church-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  {t('submit')}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold text-wine-900 mb-6">{t('info_title')}</h2>
            <div className="space-y-5">
              {[
                {
                  icon: MapPin,
                  label: t('address'),
                  value: locale === 'zh-TW' ? '新北市中和區忠孝街 39-15 號' : 'No.39-15, Zhongxiao St., Zhonghe Dist., New Taipei City',
                  color: 'bg-wine-50 text-wine-600',
                },
                {
                  icon: Phone,
                  label: t('phone'),
                  value: '(02) 8668-5515',
                  color: 'bg-green-50 text-green-600',
                },
                {
                  icon: Mail,
                  label: t('email_label'),
                  value: 'winson651202@gmail.com',
                  color: 'bg-amber-50 text-amber-600',
                },
                {
                  icon: Clock,
                  label: t('office_hours'),
                  value: t('office_hours_text'),
                  color: 'bg-purple-50 text-purple-600',
                },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="font-medium text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
