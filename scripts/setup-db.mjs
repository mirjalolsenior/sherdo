import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const setupDatabase = async () => {
  try {
    console.log('Setting up database schema...');

    // Execute the SQL script using admin API
    const { error } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          type TEXT NOT NULL,
          client_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          date DATE NOT NULL,
          time TEXT NOT NULL,
          total_price NUMERIC NOT NULL,
          note TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS payments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
          amount NUMERIC NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
        CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
        CREATE INDEX IF NOT EXISTS idx_payments_event_id ON payments(event_id);

        ALTER PUBLICATION supabase_realtime ADD TABLE events;
        ALTER PUBLICATION supabase_realtime ADD TABLE payments;
      `
    });

    if (error) throw error;
    console.log('✓ Database schema setup completed successfully!');
  } catch (err) {
    console.error('Error setting up database:', err);
    process.exit(1);
  }
};

setupDatabase();
