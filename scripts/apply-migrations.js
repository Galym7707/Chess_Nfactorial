const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

async function applyMigrations() {
  console.log('🔄 Applying migrations to Supabase via REST API...');

  const migrationSQL = fs.readFileSync(
    path.join(__dirname, '..', 'supabase', 'APPLY_ALL_MIGRATIONS.sql'),
    'utf8'
  );

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ query: migrationSQL })
    });

    const result = await response.text();
    console.log('Response:', result);

    if (!response.ok) {
      console.error('❌ Failed to apply migrations');
      console.error('Status:', response.status);
      console.error('Response:', result);
    } else {
      console.log('✅ Migrations applied successfully!');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

applyMigrations().catch(console.error);
