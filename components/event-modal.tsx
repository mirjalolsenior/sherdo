'use client';

import { useState } from 'react';
import { getEventDetails, addPayment } from '@/lib/supabase/events';
import { useLanguage } from '@/hooks/use-language';
import type { Event, Payment } from '@/lib/supabase/client';

const ADMIN_PASSWORD = '942692222';

type EventModalProps = {
  event: Event & { paid: number; remaining: number };
  onClose: () => void;
  onPaymentAdded: () => void;
};

export function EventModal({ event, onClose, onPaymentAdded }: EventModalProps) {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [eventDetails, setEventDetails] = useState<(Event & { paid: number; remaining: number; payments: Payment[] }) | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      const details = await getEventDetails(event.id);
      setEventDetails(details);
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amount = parseFloat(paymentAmount);
      if (amount > 0) {
        await addPayment(event.id, amount);
        const details = await getEventDetails(event.id);
        setEventDetails(details);
        setPaymentAmount('');
        onPaymentAdded();
      }
    } catch (error) {
      console.error('Error adding payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFullyPaid = eventDetails && eventDetails.paid >= eventDetails.total_price;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border/50 p-4 md:p-6 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{event.client_name}</h2>
            <p className="text-sm text-muted-foreground">{event.phone}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-border rounded-lg transition-colors flex-shrink-0"
          >
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {!authenticated ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-foreground font-semibold mb-4">{t('enterPassword')}</p>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('password')}
                  autoFocus
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none mb-4"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all"
                >
                  {t('unlock')}
                </button>
              </div>
            </form>
          ) : eventDetails ? (
            <div className="space-y-6">
              {/* Status Bar */}
              {isFullyPaid && (
                <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-green-400">{t('completed')}</p>
                    <p className="text-sm text-green-400/80">{t('eventFullyPaid')}</p>
                  </div>
                </div>
              )}

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-background/50 border border-border/50">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('date')}</p>
                  <p className="text-lg font-bold text-foreground mt-1">{eventDetails.date}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('time')}</p>
                  <p className="text-lg font-bold text-foreground mt-1">{eventDetails.time}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('type')}</p>
                  <p className="text-lg font-bold text-foreground mt-1">{eventDetails.type}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('totalPrice')}</p>
                  <p className="text-lg font-bold text-primary mt-1">{eventDetails.total_price.toLocaleString()}</p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/30">
                  <p className="text-xs font-semibold text-green-400 uppercase tracking-wide">{t('paid')}</p>
                  <p className="text-2xl font-bold text-green-400 mt-2">{eventDetails.paid.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30">
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">{t('remaining')}</p>
                  <p className="text-2xl font-bold text-red-400 mt-2">{Math.max(0, eventDetails.remaining).toLocaleString()}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{t('progress')}</p>
                  <p className="text-sm font-bold text-primary">{Math.round((eventDetails.paid / eventDetails.total_price) * 100)}%</p>
                </div>
                <div className="w-full h-3 rounded-full bg-background border border-border overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                    style={{ width: `${Math.min(100, (eventDetails.paid / eventDetails.total_price) * 100)}%` }}
                  />
                </div>
              </div>

              {eventDetails.note && (
                <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('note')}</p>
                  <p className="text-foreground break-words">{eventDetails.note}</p>
                </div>
              )}

              {/* Payments Section */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <h3 className="font-bold text-lg text-foreground">{t('payments')}</h3>

                {/* Payment History */}
                {eventDetails.payments.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {eventDetails.payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-green-500/20">
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm text-muted-foreground">{new Date(payment.created_at).toLocaleDateString()}</span>
                        </div>
                        <span className="font-bold text-green-400">{payment.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Payment Form */}
                <form onSubmit={handleAddPayment} className="space-y-3 p-4 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-sm font-semibold text-foreground">{t('addPayment')}</p>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder={t('enterAmount')}
                    step="0.01"
                    min="0"
                    autoFocus
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading || !paymentAmount || isFullyPaid}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-600/90 hover:to-green-500/90 disabled:from-muted disabled:to-muted text-white font-semibold py-2.5 rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 0116 0" />
                      </svg>
                    )}
                    {loading ? t('adding') : t('addPayment')}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent animate-spin opacity-75" style={{ mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), black calc(100% - 3px))' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
