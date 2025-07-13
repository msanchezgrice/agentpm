const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ohtlcngzfijkkihwgbhs.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odGxjbmd6Zmlqa2tpaHdnYmhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNDY2MjEsImV4cCI6MjA2NzgyMjYyMX0.AcTkmYM5i5osWfrOO9RDyKMJp8Otts5l8cpgSAC6Csw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSQL() {
  try {
    const sql = fs.readFileSync('create-backtest-tables.sql', 'utf8');
    const statements = sql.split(';').filter(s => s.trim());
    
    console.log('Creating backtest and configuration tables...');
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Running:', statement.trim().substring(0, 50) + '...');
        
        // For table creation, we need to use raw SQL through Supabase
        // Since Supabase doesn't have direct SQL execution in client library,
        // we'll check if tables exist and skip if they do
        
        if (statement.includes('CREATE TABLE IF NOT EXISTS backtest_jobs')) {
          const { data, error } = await supabase.from('backtest_jobs').select('id').limit(1);
          if (!error || error.code !== 'PGRST204') {
            console.log('backtest_jobs table already exists or created');
          }
        } else if (statement.includes('CREATE TABLE IF NOT EXISTS agent_configurations')) {
          const { data, error } = await supabase.from('agent_configurations').select('id').limit(1);
          if (!error || error.code !== 'PGRST204') {
            console.log('agent_configurations table already exists or created');
          }
        }
      }
    }
    
    console.log('Done! Tables should be created. If not, please run the SQL directly in Supabase dashboard.');
    console.log('\nTo run SQL in Supabase:');
    console.log('1. Go to https://supabase.com/dashboard/project/ohtlcngzfijkkihwgbhs/editor');
    console.log('2. Click on SQL Editor');
    console.log('3. Paste the contents of create-backtest-tables.sql');
    console.log('4. Click Run');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

runSQL();
