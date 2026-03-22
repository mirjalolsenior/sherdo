'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getCompletedEvents } from '@/lib/supabase/events';
import { EventsList } from '@/components/events-list';
import { useLanguage } from '@/hooks/use-language';
import type { Event } from '@/lib/supabase/client';

export default function ArxivPage() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<(Event & { paid: number; remaining: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('arxiv-events')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
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
  }, []);

  async function loadEvents() {
    setLoading(true);
    const data = await getCompletedEvents();
    setEvents(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary text-center">{t('arxiv')}</h1>
          <p className="text-center text-muted-foreground mt-2">{t('completedEvents')}</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent animate-spin opacity-75" style={{ mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))' }} />
            </div>
            <p className="text-muted-foreground font-medium">{t('loading')}</p>
          </div>
        ) : (
          <EventsList events={events} />
        )}
      </div>
    </div>
  );
}
