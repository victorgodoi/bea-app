import * as dotenv from 'dotenv';
dotenv.config();

const projectRef = process.env.EXPO_PUBLIC_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '') ?? '';
const accessToken = process.env.SUPABASE_ACCESS_TOKEN ?? '';

async function query(sql: string) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function main() {
  console.log('\n=== COLUMNS ===');
  const cols = await query(
    `SELECT column_name, data_type, is_nullable, column_default
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'purposes'
     ORDER BY ordinal_position`
  );
  console.table(cols);

  console.log('\n=== FOREIGN KEYS ===');
  const fks = await query(
    `SELECT kcu.column_name, ccu.table_name AS foreign_table, ccu.column_name AS foreign_column
     FROM information_schema.table_constraints tc
     JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
     JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
     WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'purposes'`
  );
  console.table(fks);

  console.log('\n=== RLS STATUS ===');
  const rls = await query(
    `SELECT relname, relrowsecurity, relforcerowsecurity FROM pg_class WHERE relname = 'purposes'`
  );
  console.table(rls);

  console.log('\n=== POLICIES ===');
  const policies = await query(
    `SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = 'purposes'`
  );
  console.table(policies);

  console.log('\n=== SAMPLE DATA (5 rows) ===');
  const data = await query(`SELECT * FROM purposes LIMIT 5`);
  console.table(data);

  console.log('\n=== INDEXES ===');
  const indexes = await query(
    `SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'purposes'`
  );
  console.table(indexes);
}

main().catch(console.error);
