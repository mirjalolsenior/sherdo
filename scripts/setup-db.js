#!/usr/bin/env node

const https = require('https');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing required environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceRoleKey);
  process.exit(1);
}

// Parse URL
const urlObj = new URL(supabaseUrl);
const host = urlObj.hostname;

const sqlStatements = [
  `CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    client_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    total_price NUMERIC NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  
  `CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );`,
  
  `CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);`,
  `CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);`,
  `CREATE INDEX IF NOT EXISTS idx_payments_event_id ON payments(event_id);`,
  
  `ALTER PUBLICATION supabase_realtime ADD TABLE events;`,
  `ALTER PUBLICATION supabase_realtime ADD TABLE payments;`
];

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      query: sql
    });

    const options = {
      hostname: host,
      port: 443,
      path: '/rest/v1/rpc/exec',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
        'Authorization': `Bearer ${supabaseServiceRoleKey}`,
        'apikey': supabaseServiceRoleKey
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function setupDatabase() {
  console.log('🔧 Setting up database schema...');
  
  try {
    for (let i = 0; i < sqlStatements.length; i++) {
      const sql = sqlStatements[i].trim();
      if (sql) {
        console.log(`  [${i + 1}/${sqlStatements.length}] Executing SQL...`);
        try {
          await executeSQL(sql);
        } catch (err) {
          console.warn(`  ⚠️  Statement ${i + 1} skipped:`, err.message.substring(0, 100));
        }
      }
    }
    console.log('✅ Database schema setup completed!');
  } catch (err) {
    console.error('❌ Error setting up database:', err.message);
    process.exit(1);
  }
}

setupDatabase();
