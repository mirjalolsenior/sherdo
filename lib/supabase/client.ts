import { createClient } from '@supabase/supabase-js';

const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase credentials. Please check your environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

let supabaseInstance: ReturnType<typeof createClient> | null = null;

try {
  supabaseInstance = getSupabaseClient();
} catch (error) {
  console.error('[v0] Failed to initialize Supabase:', error instanceof Error ? error.message : String(error));
  // Create a dummy client that will fail gracefully
  supabaseInstance = createClient('https://placeholder.supabase.co', 'placeholder-key');
}

export const supabase = supabaseInstance;

export type Event = {
  id: string;
  type: 'Sherdor' | 'Barxan';
  client_name: string;
  phone: string;
  date: string;
  time: 'Ertalab' | 'Abet' | 'Kechki';
  total_price: number;
  note: string;
  created_at: string;
};

export type Payment = {
  id: string;
  event_id: string;
  amount: number;
  created_at: string;
};
