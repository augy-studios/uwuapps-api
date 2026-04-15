/**
 * Seed script: populates the `no_reasons` Supabase table from the
 * hotheadhacker/no-as-a-service reasons.json dataset.
 *
 * Prerequisites:
 *   1. Create the table in Supabase SQL editor:
 *        CREATE TABLE no_reasons (
 *          id BIGSERIAL PRIMARY KEY,
 *          reason TEXT NOT NULL
 *        );
 *   2. Install dependencies:  npm install
 *   3. Run with env vars set:
 *        SUPABASE_URL=https://xxx.supabase.co \
 *        SUPABASE_SERVICE_KEY=your-service-key \
 *        node scripts/seed-no-reasons.js
 */

const { createClient } = require('@supabase/supabase-js');

const REASONS_URL =
  'https://raw.githubusercontent.com/hotheadhacker/no-as-a-service/main/reasons.json';
const BATCH_SIZE = 100;

async function seed() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Fetching reasons from GitHub...');
  const res = await fetch(REASONS_URL);
  if (!res.ok) throw new Error(`Failed to fetch reasons: HTTP ${res.status}`);
  const reasons = await res.json();
  console.log(`Fetched ${reasons.length} reasons.`);

  const rows = reasons.map((reason) => ({ reason }));

  console.log('Inserting into no_reasons...');
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('no_reasons').insert(batch);
    if (error) throw error;
    console.log(
      `  Inserted rows ${i + 1}–${Math.min(i + BATCH_SIZE, rows.length)}`
    );
  }

  console.log(`Done! ${rows.length} reasons seeded.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
