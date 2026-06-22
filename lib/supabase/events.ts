'use server';

import { supabase, Event, Payment } from './client';

export async function createEvent(eventData: {
  type: 'Sherdor' | 'Barxan';
  client_name: string;
  phone: string;
  date: string;
  time: 'Ertalab' | 'Abet' | 'Kechki';
  total_price: number;
  initial_payment: number;
  note: string;
}): Promise<Event | null> {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .insert([
        {
          type: eventData.type,
          client_name: eventData.client_name,
          phone: eventData.phone,
          date: eventData.date,
          time: eventData.time,
          total_price: eventData.total_price,
          note: eventData.note,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Create initial payment
    if (eventData.initial_payment > 0) {
      await supabase.from('payments').insert([
        {
          event_id: event.id,
          amount: eventData.initial_payment,
        },
      ]);
    }

    return event;
  } catch (error) {
    console.error('Error creating event:', error);
    return null;
  }
}

export async function getEventsByType(type: 'Sherdor' | 'Barxan'): Promise<(Event & { paid: number; remaining: number })[]> {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('type', type)
      .order('date', { ascending: false });

    if (error) throw error;

    // Get payments for each event
    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const { data: payments } = await supabase
          .from('payments')
          .select('amount')
          .eq('event_id', event.id);

        const paid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
        return {
          ...event,
          paid,
          remaining: Number(event.total_price) - paid,
        };
      })
    );

    // Filter: only show events that are NOT fully paid (paid < total_price)
    return enrichedEvents.filter((e) => e.paid < Number(e.total_price));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function getEventsByDate(date: string): Promise<(Event & { paid: number; remaining: number })[]> {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('date', date)
      .order('time', { ascending: true });

    if (error) throw error;

    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const { data: payments } = await supabase
          .from('payments')
          .select('amount')
          .eq('event_id', event.id);

        const paid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
        return {
          ...event,
          paid,
          remaining: Number(event.total_price) - paid,
        };
      })
    );

    return enrichedEvents;
  } catch (error) {
    console.error('Error fetching events by date:', error);
    return [];
  }
}

export async function getAllEvents(): Promise<(Event & { paid: number; remaining: number })[]> {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const { data: payments } = await supabase
          .from('payments')
          .select('amount')
          .eq('event_id', event.id);

        const paid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
        return {
          ...event,
          paid,
          remaining: Number(event.total_price) - paid,
        };
      })
    );

    return enrichedEvents;
  } catch (error) {
    console.error('Error fetching all events:', error);
    return [];
  }
}

export async function getEventDetails(eventId: string): Promise<(Event & { paid: number; remaining: number; payments: Payment[] }) | null> {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) throw error;

    const { data: payments } = await supabase
      .from('payments')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    const paid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    return {
      ...event,
      paid,
      remaining: Number(event.total_price) - paid,
      payments: payments || [],
    };
  } catch (error) {
    console.error('Error fetching event details:', error);
    return null;
  }
}

export async function addPayment(eventId: string, amount: number): Promise<Payment | null> {
  try {
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([{ event_id: eventId, amount }])
      .select()
      .single();

    if (error) throw error;

    return payment;
  } catch (error) {
    console.error('Error adding payment:', error);
    return null;
  }
}

export async function getCompletedEvents(): Promise<(Event & { paid: number; remaining: number })[]> {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const { data: payments } = await supabase
          .from('payments')
          .select('amount')
          .eq('event_id', event.id);

        const paid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
        return {
          ...event,
          paid,
          remaining: Number(event.total_price) - paid,
        };
      })
    );

    // Filter: paid >= total_price
    return enrichedEvents.filter((e) => e.paid >= Number(e.total_price));
  } catch (error) {
    console.error('Error fetching completed events:', error);
    return [];
  }
}

export async function updateEvent(eventId: string, updates: Partial<Event>): Promise<Event | null> {
  try {
    const { data: event, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();

    if (error) throw error;

    return event;
  } catch (error) {
    console.error('Error updating event:', error);
    return null;
  }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    // Delete payments first
    await supabase.from('payments').delete().eq('event_id', eventId);

    // Delete event
    const { error } = await supabase.from('events').delete().eq('id', eventId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    return false;
  }
}

export async function getReportStats(): Promise<{
  total_events: number;
  total_money: number;
  total_paid: number;
  remaining: number;
}> {
  try {
    const { data: events, error: eventsError } = await supabase.from('events').select('id, total_price');

    if (eventsError) throw eventsError;

    const total_events = events.length;
    const total_money = events.reduce((sum, e) => sum + Number(e.total_price), 0);

    const { data: payments, error: paymentsError } = await supabase.from('payments').select('amount');

    if (paymentsError) throw paymentsError;

    const total_paid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const remaining = total_money - total_paid;

    return {
      total_events,
      total_money,
      total_paid,
      remaining,
    };
  } catch (error) {
    console.error('Error getting report stats:', error);
    return {
      total_events: 0,
      total_money: 0,
      total_paid: 0,
      remaining: 0,
    };
  }
}

// Payment Status Functions
export async function getPaymentStatus(paid: number, total: number): Promise<'pending' | 'partial' | 'complete' | 'overdue'> {
  if (paid >= total) return 'complete';
  if (paid === 0) return 'pending';
  if (paid > 0 && paid < total) return 'partial';
  return 'pending';
}

export async function getEventsByPaymentStatus(status: 'pending' | 'partial' | 'complete'): Promise<(Event & { paid: number; remaining: number; payment_status: string })[]> {
  try {
    const { data: events, error } = await supabase.from('events').select('*').order('date', { ascending: false });

    if (error) throw error;

    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const { data: payments } = await supabase.from('payments').select('amount').eq('event_id', event.id);

        const paid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
        const payment_status = await getPaymentStatus(paid, Number(event.total_price));

        return {
          ...event,
          paid,
          remaining: Number(event.total_price) - paid,
          payment_status,
        };
      })
    );

    return enrichedEvents.filter((e) => e.payment_status === status);
  } catch (error) {
    console.error('Error fetching events by payment status:', error);
    return [];
  }
}

// Daily Orders Functions
export async function getDailyStats(date: string): Promise<{
  total_events: number;
  total_revenue: number;
  total_paid: number;
  total_remaining: number;
  events: (Event & { paid: number; remaining: number })[];
}> {
  try {
    const { data: events, error } = await supabase.from('events').select('*').eq('date', date);

    if (error) throw error;

    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const { data: payments } = await supabase.from('payments').select('amount').eq('event_id', event.id);

        const paid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
        return {
          ...event,
          paid,
          remaining: Number(event.total_price) - paid,
        };
      })
    );

    const total_revenue = enrichedEvents.reduce((sum, e) => sum + Number(e.total_price), 0);
    const total_paid = enrichedEvents.reduce((sum, e) => sum + e.paid, 0);
    const total_remaining = enrichedEvents.reduce((sum, e) => sum + e.remaining, 0);

    return {
      total_events: enrichedEvents.length,
      total_revenue,
      total_paid,
      total_remaining,
      events: enrichedEvents,
    };
  } catch (error) {
    console.error('Error getting daily stats:', error);
    return {
      total_events: 0,
      total_revenue: 0,
      total_paid: 0,
      total_remaining: 0,
      events: [],
    };
  }
}

export async function getMonthlyDailyData(year: number, month: number): Promise<
  Array<{
    date: string;
    total_events: number;
    total_revenue: number;
    total_paid: number;
  }>
> {
  try {
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    const dailyMap = new Map<string, any>();

    for (const event of events) {
      const { data: payments } = await supabase.from('payments').select('amount').eq('event_id', event.id);

      const paid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const date = event.date;

      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          total_events: 0,
          total_revenue: 0,
          total_paid: 0,
        });
      }

      const daily = dailyMap.get(date);
      daily.total_events += 1;
      daily.total_revenue += Number(event.total_price);
      daily.total_paid += paid;
    }

    return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Error getting monthly daily data:', error);
    return [];
  }
}

// Month-over-Month Comparison Functions
export async function getMonthOverMonthComparison(year: number, month: number): Promise<{
  currentMonth: { count: number; revenue: number; paid: number };
  previousMonth: { count: number; revenue: number; paid: number };
  growth: { countGrowth: number; revenueGrowth: number; paidGrowth: number };
}> {
  try {
    // Current month
    const currentStartDate = new Date(year, month, 1).toISOString().split('T')[0];
    const currentEndDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const { data: currentEvents, error: currentError } = await supabase
      .from('events')
      .select('id, total_price')
      .gte('date', currentStartDate)
      .lte('date', currentEndDate);

    if (currentError) throw currentError;

    let currentRevenue = 0;
    let currentPaid = 0;

    for (const event of currentEvents) {
      currentRevenue += Number(event.total_price);
      const { data: payments } = await supabase.from('payments').select('amount').eq('event_id', event.id);
      currentPaid += payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    }

    // Previous month
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;

    const prevStartDate = new Date(prevYear, prevMonth, 1).toISOString().split('T')[0];
    const prevEndDate = new Date(prevYear, prevMonth + 1, 0).toISOString().split('T')[0];

    const { data: prevEvents, error: prevError } = await supabase
      .from('events')
      .select('id, total_price')
      .gte('date', prevStartDate)
      .lte('date', prevEndDate);

    if (prevError) throw prevError;

    let prevRevenue = 0;
    let prevPaid = 0;

    for (const event of prevEvents) {
      prevRevenue += Number(event.total_price);
      const { data: payments } = await supabase.from('payments').select('amount').eq('event_id', event.id);
      prevPaid += payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    }

    // Calculate growth percentages
    const countGrowth = prevEvents.length > 0 ? ((currentEvents.length - prevEvents.length) / prevEvents.length) * 100 : 0;
    const revenueGrowth = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;
    const paidGrowth = prevPaid > 0 ? ((currentPaid - prevPaid) / prevPaid) * 100 : 0;

    return {
      currentMonth: { count: currentEvents.length, revenue: currentRevenue, paid: currentPaid },
      previousMonth: { count: prevEvents.length, revenue: prevRevenue, paid: prevPaid },
      growth: { countGrowth, revenueGrowth, paidGrowth },
    };
  } catch (error) {
    console.error('[v0] Error calculating month-over-month:', error);
    return {
      currentMonth: { count: 0, revenue: 0, paid: 0 },
      previousMonth: { count: 0, revenue: 0, paid: 0 },
      growth: { countGrowth: 0, revenueGrowth: 0, paidGrowth: 0 },
    };
  }
}

// Reports Analytics Functions
export async function getTodayStats(): Promise<{ count: number; revenue: number; paid: number }> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data: events, error } = await supabase.from('events').select('id, total_price').eq('date', today);

    if (error) throw error;

    const revenue = events.reduce((sum, e) => sum + Number(e.total_price), 0);

    let paid = 0;
    for (const event of events) {
      const { data: payments } = await supabase.from('payments').select('amount').eq('event_id', event.id);
      paid += payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    }

    return { count: events.length, revenue, paid };
  } catch (error) {
    console.error('[v0] Error getting today stats:', error);
    return { count: 0, revenue: 0, paid: 0 };
  }
}

export async function getMonthStats(year: number, month: number): Promise<{ count: number; revenue: number; paid: number }> {
  try {
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const { data: events, error } = await supabase
      .from('events')
      .select('id, total_price')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    const revenue = events.reduce((sum, e) => sum + Number(e.total_price), 0);

    let paid = 0;
    for (const event of events) {
      const { data: payments } = await supabase.from('payments').select('amount').eq('event_id', event.id);
      paid += payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    }

    return { count: events.length, revenue, paid };
  } catch (error) {
    console.error('[v0] Error getting month stats:', error);
    return { count: 0, revenue: 0, paid: 0 };
  }
}

export async function searchEvents(searchTerm: string): Promise<(Event & { paid: number; remaining: number })[]> {
  try {
    const { data: events, error } = await supabase.from('events').select('*').order('date', { ascending: false });

    if (error) throw error;

    const searchLower = searchTerm.toLowerCase();
    const filtered = events.filter(
      (e) =>
        e.client_name.toLowerCase().includes(searchLower) ||
        e.phone.includes(searchTerm) ||
        e.id.includes(searchTerm)
    );

    const enrichedEvents = await Promise.all(
      filtered.map(async (event) => {
        const { data: payments } = await supabase.from('payments').select('amount').eq('event_id', event.id);
        const paid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
        return {
          ...event,
          paid,
          remaining: Number(event.total_price) - paid,
        };
      })
    );

    return enrichedEvents;
  } catch (error) {
    console.error('[v0] Error searching events:', error);
    return [];
  }
}

export async function getMonthlyRevenueData(year: number): Promise<Array<{ month: string; revenue: number }>> {
  try {
    const data: Array<{ month: string; revenue: number }> = [];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

      const { data: events, error } = await supabase
        .from('events')
        .select('total_price')
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;

      const revenue = events.reduce((sum, e) => sum + Number(e.total_price), 0);
      const monthName = new Date(year, month).toLocaleDateString('uz-UZ', { month: 'short' });

      data.push({ month: monthName, revenue });
    }

    return data;
  } catch (error) {
    console.error('[v0] Error getting monthly revenue data:', error);
    return [];
  }
}
