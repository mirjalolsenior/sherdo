'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';

type EventFormProps = {
  onSubmit: (data: {
    client_name: string;
    phone: string;
    date: string;
    time: 'Ertalab' | 'Abet' | 'Kechki';
    total_price: number;
    initial_payment: number;
    note: string;
  }) => Promise<void>;
};

export function EventForm({ onSubmit }: EventFormProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    phone: '',
    date: '',
    time: 'Ertalab' as const,
    total_price: '',
    initial_payment: '',
    note: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        client_name: formData.client_name,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        total_price: parseFloat(formData.total_price),
        initial_payment: parseFloat(formData.initial_payment),
        note: formData.note,
      });

      setFormData({
        client_name: '',
        phone: '',
        date: '',
        time: 'Ertalab',
        total_price: '',
        initial_payment: '',
        note: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6 shadow-lg backdrop-blur-sm">
      <div className="pb-4 border-b border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground">{t('addEvent')}</h2>
        </div>
        <p className="text-sm text-muted-foreground">{t('fillTheForm')}</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">{t('clientName')}</label>
          <input
            type="text"
            name="client_name"
            value={formData.client_name}
            onChange={handleChange}
            required
            placeholder={t('enterClientName')}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">{t('phone')}</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+998 91 123 45 67"
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">{t('date')}</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">{t('time')}</label>
          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          >
            <option value="Ertalab">{t('morning')}</option>
            <option value="Abet">{t('afternoon')}</option>
            <option value="Kechki">{t('evening')}</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{t('totalPrice')}</label>
            <input
              type="number"
              name="total_price"
              value={formData.total_price}
              onChange={handleChange}
              required
              step="0.01"
              placeholder="0"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{t('initialPayment')}</label>
            <input
              type="number"
              name="initial_payment"
              value={formData.initial_payment}
              onChange={handleChange}
              required
              step="0.01"
              placeholder="0"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">{t('note')}</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder={t('addNotes')}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
            rows={3}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:from-muted disabled:to-muted text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && (
          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 0116 0" />
          </svg>
        )}
        {loading ? t('creating') : t('addEvent')}
      </button>
    </form>
  );
}
