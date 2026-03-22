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
