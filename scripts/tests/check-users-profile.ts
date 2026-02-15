import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Carregar variáveis de ambiente do arquivo .env
function loadEnv() {
  const envPath = path.join(__dirname, '..', '..', '.env');
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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkUsersProfile() {
  console.log('🔍 Estrutura detalhada da tabela "users_profile"\n');
  console.log('━'.repeat(70), '\n');

  try {
    // Buscar schema da API REST
    const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseServiceKey}`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    });

    if (response.ok) {
      const schema = await response.json();
      
      if (schema.definitions && schema.definitions.users_profile) {
        const usersDef = schema.definitions.users_profile;
        
        console.log('📊 Colunas da tabela "users_profile":\n');
        
        if (usersDef.properties) {
          Object.entries(usersDef.properties).forEach(([colName, colDef]: [string, any]) => {
            const type = colDef.type || 'unknown';
            const format = colDef.format ? ` (${colDef.format})` : '';
            const nullable = colDef.nullable !== false ? ' [nullable]' : '';
            const description = colDef.description ? ` - ${colDef.description}` : '';
            console.log(`   • ${colName.padEnd(20)} ${type}${format}${nullable}${description}`);
          });
        }
        
        console.log('\n━'.repeat(70), '\n');
        
        // Buscar dados de exemplo
        const { data: sampleData, error } = await supabaseAdmin
          .from('users_profile')
          .select('*')
          .limit(1);
        
        if (sampleData && sampleData.length > 0) {
          console.log('📝 Exemplo de registro:\n');
          console.log(JSON.stringify(sampleData[0], null, 2));
        } else if (error) {
          console.log('⚠️  Erro ao buscar exemplo:', error.message);
        } else {
          console.log('ℹ️  Tabela vazia - sem registros para exemplo');
        }
      }
    }
  } catch (error: any) {
    console.error('❌ Erro:', error.message);
  }
}

checkUsersProfile().then(() => {
  console.log('\n✅ Verificação completa!\n');
  process.exit(0);
});
