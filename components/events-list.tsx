'use client';

import { useState } from 'react';
import { EventModal } from './event-modal';
import { useLanguage } from '@/hooks/use-language';
import type { Event } from '@/lib/supabase/client';

type EventsListProps = {
  events: (Event & { paid: number; remaining: number })[];
  onPaymentAdded?: () => void;
};

export function EventsList({ events, onPaymentAdded }: EventsListProps) {
  const { t } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState<(Event & { paid: number; remaining: number }) | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleEventClick = (event: Event & { paid: number; remaining: number }) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  return (
    <>
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-12 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
            <div className="inline-flex p-4 rounded-full bg-accent/10 mb-4">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
            </div>
            <p className="text-foreground font-semibold mb-2">{t('no_events_found')}</p>
            <p className="text-muted-foreground text-sm">{t('addFirstEvent')}</p>
          </div>
        ) : (
          events.map((event) => {
            const isCompleted = event.paid >= event.total_price;
            return (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="group bg-card border border-border rounded-xl p-4 md:p-6 cursor-pointer hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{event.client_name}</h3>
                      {isCompleted && (
                        <span className="px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {t('completed')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{event.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4 pb-4 border-b border-border/50">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('date')}</p>
                    <p className="text-sm font-bold text-foreground mt-1">{event.date}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('time')}</p>
                    <p className="text-sm font-bold text-foreground mt-1">{event.time}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('total')}</p>
                    <p className="text-sm font-bold text-foreground mt-1">{event.total_price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-400 uppercase tracking-wide">{t('paid')}</p>
                    <p className="text-sm font-bold text-green-400 mt-1">{event.paid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">{t('remaining')}</p>
                    <p className="text-sm font-bold text-red-400 mt-1">{event.remaining.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('progress')}</p>
                    <p className="text-sm font-bold text-primary mt-1">{Math.round((event.paid / event.total_price) * 100)}%</p>
                  </div>
                </div>

                {event.note && (
                  <div className="text-sm text-muted-foreground italic">{event.note}</div>
                )}

                <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <span>{t('clickToViewDetails')}</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setShowModal(false)}
          onPaymentAdded={() => {
            setShowModal(false);
            onPaymentAdded?.();
          }}
        />
      )}
    </>
  );
}
