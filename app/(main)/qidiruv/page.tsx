'use client';

import { useState } from 'react';
import { getEventsByDate } from '@/lib/supabase/events';
import { EventsList } from '@/components/events-list';
import { useLanguage } from '@/hooks/use-language';
import type { Event } from '@/lib/supabase/client';

export default function QidiruvPage() {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState('');
  const [sherdorEvents, setSherdorEvents] = useState<(Event & { paid: number; remaining: number })[]>([]);
  const [barxanEvents, setBarxanEvents] = useState<(Event & { paid: number; remaining: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    if (selectedDate) {
      const data = await getEventsByDate(selectedDate);
      const sherdor = data.filter((e) => e.type === 'Sherdor');
      const barxan = data.filter((e) => e.type === 'Barxan');
      setSherdorEvents(sherdor);
      setBarxanEvents(barxan);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary text-center">{t('qidiruv')}</h1>
          <p className="text-center text-muted-foreground mt-2">{t('searchEvents')}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 md:p-6 mb-6 md:mb-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-foreground mb-2">{t('selectDate')}</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-lg transition-all whitespace-nowrap"
            >
              {t('search')}
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent animate-spin opacity-75" style={{ mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))' }} />
            </div>
            <p className="text-muted-foreground font-medium">{t('loading')}</p>
          </div>
        ) : searched ? (
          sherdorEvents.length === 0 && barxanEvents.length === 0 ? (
            <div className="text-center py-16 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
              <div className="inline-flex p-4 rounded-full bg-accent/10 mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
              </div>
              <p className="text-foreground font-semibold mb-2">{t('no_events')}</p>
              <p className="text-muted-foreground text-sm">{t('selectDateAndSearch')}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {sherdorEvents.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{t('sherdor')}</h2>
                    <p className="text-sm text-muted-foreground">{sherdorEvents.length} {t('event')}</p>
                  </div>
                  <EventsList events={sherdorEvents} />
                </div>
              )}
              {barxanEvents.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{t('barxan')}</h2>
                    <p className="text-sm text-muted-foreground">{barxanEvents.length} {t('event')}</p>
                  </div>
                  <EventsList events={barxanEvents} />
                </div>
              )}
            </div>
          )
        ) : (
          <div className="text-center py-16 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-foreground font-semibold">{t('selectDateAndSearch')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
