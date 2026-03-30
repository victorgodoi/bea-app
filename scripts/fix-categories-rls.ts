import * as fs from 'fs';
import * as path from 'path';

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...values] = line.split('=');
        const value = values.join('=').trim();
        if (key && value) {
          process.env[key] = value;
        }
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const accessToken = process.env.SUPABASE_ACCESS_TOKEN || '';

if (!supabaseUrl || !accessToken) {
  console.error('❌ Variáveis EXPO_PUBLIC_SUPABASE_URL e SUPABASE_ACCESS_TOKEN são necessárias no arquivo .env');
  process.exit(1);
}

const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');

const statements = [
  `ALTER TABLE categories ENABLE ROW LEVEL SECURITY`,
  `DROP POLICY IF EXISTS "Enable all for authenticated users" ON categories`,
  `DROP POLICY IF EXISTS "Users can view their company categories" ON categories`,
  `DROP POLICY IF EXISTS "Users can insert categories" ON categories`,
  `DROP POLICY IF EXISTS "Users can update their company categories" ON categories`,
  `DROP POLICY IF EXISTS "Users can delete their company categories" ON categories`,
  `CREATE POLICY "Users can view their company categories" ON categories FOR SELECT TO authenticated USING (company_id IN (SELECT company_id FROM users_profile WHERE id = auth.uid()))`,
  `CREATE POLICY "Users can insert categories" ON categories FOR INSERT TO authenticated WITH CHECK (company_id IN (SELECT company_id FROM users_profile WHERE id = auth.uid()))`,
  `CREATE POLICY "Users can update their company categories" ON categories FOR UPDATE TO authenticated USING (company_id IN (SELECT company_id FROM users_profile WHERE id = auth.uid())) WITH CHECK (company_id IN (SELECT company_id FROM users_profile WHERE id = auth.uid()))`,
  `CREATE POLICY "Users can delete their company categories" ON categories FOR DELETE TO authenticated USING (company_id IN (SELECT company_id FROM users_profile WHERE id = auth.uid()))`,
];

async function runSql(query: string): Promise<void> {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body}`);
  }
}

async function fixCategoriesRls() {
  console.log('Aplicando políticas RLS na tabela categories...');

  for (const stmt of statements) {
    await runSql(stmt);
  }

  console.log('✅ Políticas RLS aplicadas com sucesso na tabela categories!');
}

fixCategoriesRls().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
