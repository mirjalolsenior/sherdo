'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getAllEvents, updateEvent, deleteEvent } from '@/lib/supabase/events';
import { useLanguage } from '@/hooks/use-language';
import type { Event } from '@/lib/supabase/client';

const ADMIN_PASSWORD = '942692222';

export default function AdminPage() {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [events, setEvents] = useState<(Event & { paid: number; remaining: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Event>>({});
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Check if app is running as PWA (installed mobile app)
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true ||
                          document.referrer.includes('android-app://');
      setIsPWA(isStandalone);
    };
    
    checkPWA();
    window.addEventListener('load', checkPWA);
    return () => window.removeEventListener('load', checkPWA);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      loadEvents();
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

  async function loadEvents() {
    setLoading(true);
    const data = await getAllEvents();
    setEvents(data);
    setLoading(false);
  }

  const handleEdit = (event: Event & { paid: number; remaining: number }) => {
    setEditingId(event.id);
    setEditData(event);
  };

  const handleSaveEdit = async (eventId: string) => {
    await updateEvent(eventId, editData);
    setEditingId(null);
    await loadEvents();
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(eventId);
      await loadEvents();
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Header Section */}
          <div className="mb-12 text-center">
            {isPWA && <p className="text-xs text-primary font-semibold mb-4">{t('appTitle') || 'Toyxona'}</p>}
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent text-center">{t('admin')}</h1>
            <p className="text-center text-muted-foreground mt-2 text-sm">{t('adminPanel')}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg backdrop-blur-sm">
            <form onSubmit={handleLogin} className="space-y-5">
              <p className="text-foreground font-semibold text-center">{t('enterPasswordForAdmin')}</p>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('password')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-95"
              >
                {t('login')}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-8">
            {isPWA && (
              <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                <p className="text-xs text-primary font-semibold">{t('appTitle') || 'Toyxona'}</p>
              </div>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent text-center">{t('admin')}</h1>
          <p className="text-center text-muted-foreground mt-2 text-sm">{t('adminPanel')}</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent animate-spin opacity-75" style={{ mask: 'radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))' }} />
            </div>
            <p className="text-muted-foreground font-medium">{t('loading')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-16 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                <div className="inline-flex p-4 rounded-full bg-accent/10 mb-4">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                  </svg>
                </div>
                <p className="text-foreground font-semibold">{t('no_events')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                <div key={event.id} className="bg-card border border-border rounded-xl shadow-lg backdrop-blur-sm p-4 md:p-6">
                {editingId === event.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('clientName')}</label>
                        <input
                          type="text"
                          value={editData.client_name || ''}
                          onChange={(e) => setEditData({ ...editData, client_name: e.target.value })}
                          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('phone')}</label>
                        <input
                          type="tel"
                          value={editData.phone || ''}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('date')}</label>
                        <input
                          type="date"
                          value={editData.date || ''}
                          onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('totalPrice')}</label>
                        <input
                          type="number"
                          value={editData.total_price || ''}
                          onChange={(e) => setEditData({ ...editData, total_price: parseFloat(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('note')}</label>
                      <textarea
                        value={editData.note || ''}
                        onChange={(e) => setEditData({ ...editData, note: e.target.value })}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        rows={2}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={() => handleSaveEdit(event.id)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-600/90 hover:to-green-500/90 text-white font-semibold px-4 py-2.5 rounded-lg transition-all"
                      >
                        {t('save')}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-border text-foreground hover:bg-border/80 font-semibold px-4 py-2.5 rounded-lg transition-all"
                      >
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{t('client')}</p>
                        <p className="font-semibold text-foreground truncate">{event.client_name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{t('phone')}</p>
                        <p className="font-semibold text-foreground truncate text-sm">{event.phone}</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{t('date')}</p>
                        <p className="font-semibold text-foreground text-sm">{event.date}</p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{t('type')}</p>
                        <p className="font-semibold text-foreground text-sm">{event.type}</p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{t('total')}</p>
                        <p className="font-semibold text-accent text-sm">{event.total_price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleEdit(event)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-600/90 hover:to-blue-500/90 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                      >
                        {t('edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-600/90 hover:to-red-500/90 text-white font-semibold px-4 py-2 rounded-lg transition-all"
                      >
                        {t('delete')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
