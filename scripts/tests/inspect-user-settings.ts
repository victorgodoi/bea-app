import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

function loadEnv() {
  const envPath = path.join(__dirname, '..', '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
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
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, serviceKey);

async function run() {
  console.log('🔍 Inspecionando tabela user_settings...\n');

  const { data, error } = await supabase.from('user_settings').select('*').limit(2);
  console.log('DATA:', JSON.stringify(data, null, 2));
  if (error) console.log('ERROR:', JSON.stringify(error, null, 2));
}

run().catch(console.error);
