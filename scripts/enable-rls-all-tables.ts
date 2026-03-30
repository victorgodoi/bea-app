import * as fs from 'fs';
import * as path from 'path';

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...values] = line.split('=');
        const value = values.join('=').trim();
        if (key && value) process.env[key] = value;
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const accessToken = process.env.SUPABASE_ACCESS_TOKEN || '';
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');

async function run(sql: string) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

const statements = [
  // ── users_profile ─────────────────────────────────────────────────────────
  // Habilita RLS (as políticas existentes já estão corretas)
  `ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY`,

  // ── payment_methods ───────────────────────────────────────────────────────
  // Remove políticas antigas/duplicadas
  `DROP POLICY IF EXISTS "Allow company users to manage payment methods" ON payment_methods`,
  `DROP POLICY IF EXISTS "Users can delete payment_methods" ON payment_methods`,
  `DROP POLICY IF EXISTS "Users can insert payment_methods" ON payment_methods`,
  `DROP POLICY IF EXISTS "Users can view payment_methods from same company" ON payment_methods`,
  `DROP POLICY IF EXISTS "Users can update payment_methods" ON payment_methods`,
  `DROP POLICY IF EXISTS "Enable all for authenticated users" ON payment_methods`,
  `DROP POLICY IF EXISTS "Users can view their company payment methods" ON payment_methods`,
  `DROP POLICY IF EXISTS "Users can insert payment methods" ON payment_methods`,
  `DROP POLICY IF EXISTS "Users can update their company payment methods" ON payment_methods`,
  `DROP POLICY IF EXISTS "Users can delete their company payment methods" ON payment_methods`,

  // Cria políticas limpas
  `CREATE POLICY "Users can view their company payment methods"
   ON payment_methods FOR SELECT TO authenticated
   USING (company_id IN (SELECT company_id FROM users_profile WHERE id = auth.uid()))`,

  `CREATE POLICY "Users can insert payment methods"
   ON payment_methods FOR INSERT TO authenticated
   WITH CHECK (company_id IN (SELECT company_id FROM users_profile WHERE id = auth.uid()))`,

  `CREATE POLICY "Users can update their company payment methods"
   ON payment_methods FOR UPDATE TO authenticated
   USING (company_id IN (SELECT company_id FROM users_profile WHERE id = auth.uid()))
   WITH CHECK (company_id IN (SELECT company_id FROM users_profile WHERE id = auth.uid()))`,

  `CREATE POLICY "Users can delete their company payment methods"
   ON payment_methods FOR DELETE TO authenticated
   USING (company_id IN (SELECT company_id FROM users_profile WHERE id = auth.uid()))`,

  // Habilita RLS
  `ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY`,
];

async function main() {
  console.log('Aplicando RLS em users_profile e payment_methods...\n');

  for (const stmt of statements) {
    const label = stmt.trim().split('\n')[0].substring(0, 70);
    try {
      await run(stmt);
      console.log(`✅ ${label}`);
    } catch (err: any) {
      console.error(`❌ ${label}\n   ${err.message}`);
      process.exit(1);
    }
  }

  console.log('\n✅ RLS ativado com sucesso nas duas tabelas!');
}

main();
