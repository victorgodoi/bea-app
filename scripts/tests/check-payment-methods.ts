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

console.log('🔍 Analisando tabela payment_methods...\n');
console.log('━'.repeat(70), '\n');

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY não encontrada no .env');
  process.exit(1);
}

// Criar cliente com service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function analyzePaymentMethods() {
  try {
    // 1. Buscar schema via API REST
    const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseServiceKey}`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    });

    if (response.ok) {
      const schema = await response.json();
      
      if (schema.definitions && schema.definitions.payment_methods) {
        const tableDef = schema.definitions.payment_methods;
        
        console.log('📋 ESTRUTURA DA TABELA payment_methods\n');
        console.log('━'.repeat(70), '\n');
        
        if (tableDef.properties) {
          const columns = Object.entries(tableDef.properties);
          console.log(`✅ Total de colunas: ${columns.length}\n`);
          
          columns.forEach(([colName, colDef]: [string, any]) => {
            const type = colDef.type || 'unknown';
            const format = colDef.format ? `(${colDef.format})` : '';
            const description = colDef.description ? `\n      ${colDef.description}` : '';
            console.log(`   📌 ${colName}`);
            console.log(`      Tipo: ${type} ${format}`);
            if (description) console.log(description);
            console.log('');
          });
        }

        console.log('━'.repeat(70), '\n');
      }
    }

    // 2. Verificar número de registros
    const { error, count } = await supabaseAdmin
      .from('payment_methods')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log('⚠️  Erro ao acessar payment_methods:', error.message);
    } else {
      console.log(`📊 Total de registros: ${count}\n`);
    }

    // 3. Se houver registros, mostrar uma amostra
    if (count && count > 0) {
      const { data, error: dataError } = await supabaseAdmin
        .from('payment_methods')
        .select('*')
        .limit(5);

      if (!dataError && data) {
        console.log('📝 Amostra de dados (primeiros 5 registros):\n');
        console.log(JSON.stringify(data, null, 2));
        console.log('\n');
      }
    }

    console.log('━'.repeat(70), '\n');
    console.log('✅ Análise concluída!\n');

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

analyzePaymentMethods();
