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

async function checkUserRoleEnum() {
  console.log('🔍 Consultando enum user_role\n');
  console.log('━'.repeat(70), '\n');

  try {
    // Método 1: Buscar via schema da API REST
    const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseServiceKey}`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    });

    if (response.ok) {
      const schema = await response.json();
      
      if (schema.definitions?.users_profile?.properties?.role) {
        const roleProp = schema.definitions.users_profile.properties.role;
        console.log('📊 Informações do campo role:\n');
        console.log(JSON.stringify(roleProp, null, 2));
        
        if (roleProp.enum) {
          console.log('\n✨ Valores do enum user_role:');
          roleProp.enum.forEach((role: string) => {
            console.log(`   • ${role}`);
          });
        }
      }
    }

    // Método 2: Valores atuais no banco
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data } = await supabase
      .from('users_profile')
      .select('role');

    if (data) {
      const roles = [...new Set(data.map((u: any) => u.role).filter((r: any) => r))];
      console.log('\n📝 Valores atualmente em uso no banco:');
      roles.forEach((role: string) => {
        console.log(`   • ${role}`);
      });
    }

  } catch (error: any) {
    console.error('❌ Erro:', error.message);
  }
}

checkUserRoleEnum().then(() => {
  console.log('\n✅ Verificação completa!\n');
  process.exit(0);
});
