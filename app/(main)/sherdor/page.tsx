'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { createEvent, getEventsByType } from '@/lib/supabase/events';
import { EventForm } from '@/components/event-form';
import { EventsList } from '@/components/events-list';
import { useLanguage } from '@/hooks/use-language';
import type { Event } from '@/lib/supabase/client';

export default function SherdorPage() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<(Event & { paid: number; remaining: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();

    try {
      // Subscribe to realtime changes
      const channel = supabase
        .channel('sherdor-events')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'events', filter: `type=eq.Sherdor` },
          () => loadEvents()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'payments' },
          () => loadEvents()
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    } catch (err) {
      console.error('[v0] Failed to subscribe to realtime:', err);
      setError('Failed to connect to real-time updates');
    }
  }, []);

  async function loadEvents() {
    try {
      setLoading(true);
      setError(null);
      const data = await getEventsByType('Sherdor');
      setEvents(data);
    } catch (err) {
      console.error('[v0] Error loading events:', err);
      setError('Failed to load events. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateEvent(formData: {
    client_name: string;
    phone: string;
    date: string;
    time: 'Ertalab' | 'Abet' | 'Kechki';
    total_price: number;
    initial_payment: number;
    note: string;
  }) {
    try {
      const result = await createEvent({ ...formData, type: 'Sherdor' });
      if (result) {
        await loadEvents();
      } else {
        setError('Failed to create event. Please try again.');
      }
    } catch (err) {
      console.error('[v0] Error creating event:', err);
      setError('Failed to create event. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary text-center">{t('sherdor')}</h1>
          <p className="text-center text-muted-foreground mt-2">{t('eventType')}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            <p className="font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-sm mt-2 underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <EventForm onSubmit={handleCreateEvent} />
            </div>
          </div>

          {/* Events List Section */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-foreground">{t('upcomingEvents')}</h2>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {events.length}
                </span>
              </div>
              <div className="h-1.5 w-16 bg-gradient-to-r from-primary to-accent rounded-full mt-3" />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent animate-spin opacity-75" style={{ mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))' }} />
                </div>
                <p className="text-muted-foreground font-medium">{t('loading')}</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-16 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-foreground font-semibold mb-2">{t('no_events')}</p>
                <p className="text-muted-foreground">{t('addFirstEvent')}</p>
              </div>
            ) : (
              <EventsList events={events} onPaymentAdded={loadEvents} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
