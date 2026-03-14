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

console.log('🔒 Analisando políticas RLS da tabela payment_methods...\n');
console.log('━'.repeat(70), '\n');

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY não encontrada no .env');
  process.exit(1);
}

// Criar cliente com service role key (bypassa RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkRLSPolicies() {
  try {
    console.log('📋 Estrutura da tabela payment_methods:\n');

    // Buscar estrutura via API REST
    const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseServiceKey}`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    });

    if (response.ok) {
      const schema = await response.json();
      
      if (schema.definitions?.payment_methods) {
        const tableDef = schema.definitions.payment_methods;
        
        console.log('Colunas encontradas:\n');
        
        if (tableDef.properties) {
          Object.entries(tableDef.properties).forEach(([colName, colDef]: [string, any]) => {
            const type = colDef.type || 'unknown';
            const format = colDef.format ? ` (${colDef.format})` : '';
            const required = tableDef.required?.includes(colName) ? ' [REQUIRED]' : '';
            console.log(`   • ${colName.padEnd(20)} ${type}${format}${required}`);
          });
        }
        
        console.log('\n   Campos obrigatórios:', tableDef.required?.join(', ') || 'Nenhum');
      }
    }

    console.log('\n━'.repeat(70), '\n');

    // Teste prático: tentar inserir um registro com anon key
    console.log('🧪 TESTE PRÁTICO: Tentando inserir com anon key...\n');

    const supabaseAnon = createClient(
      supabaseUrl, 
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Simular inserção SEM autenticação (deve falhar)
    const { data: insertData, error: insertError } = await supabaseAnon
      .from('payment_methods')
      .insert({
        description: 'Teste RLS',
        type: 'cash',
        company_id: '00000000-0000-0000-0000-000000000000',
        created_by: '00000000-0000-0000-0000-000000000000',
        is_active: true
      })
      .select();

    if (insertError) {
      console.log('❌ Inserção sem autenticação BLOQUEADA (esperado)');
      console.log(`   Erro: ${insertError.message}`);
      console.log(`   Código: ${insertError.code}\n`);
      
      if (insertError.code === '42501') {
        console.log('✅ RLS ESTÁ FUNCIONANDO CORRETAMENTE!\n');
        console.log('📝 O erro 42501 indica que a política RLS está ativa.\n');
        console.log('💡 SOLUÇÃO: Certifique-se de que:\n');
        console.log('   1. O usuário está autenticado via supabase.auth.getUser()');
        console.log('   2. O campo "created_by" contém o UUID do usuário autenticado');
        console.log('   3. O campo "company_id" é válido e pertence ao usuário\n');
      }
    } else {
      console.log('⚠️  Inserção sem autenticação PERMITIDA (possível problema)\n');
      console.log('   Isso indica que o RLS pode não estar configurado corretamente.\n');
    }

    console.log('━'.repeat(70), '\n');

    // Informações sobre a estrutura da tabela
    console.log('📊 Estrutura da tabela payment_methods:\n');

    const { data: columns, error: columnsError } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'payment_methods')
      .eq('table_schema', 'public')
      .order('ordinal_position');

    if (!columnsError && columns) {
      columns.forEach((col: any) => {
        const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(required)';
        const defaultVal = col.column_default ? ` [default: ${col.column_default}]` : '';
        console.log(`   • ${col.column_name.padEnd(20)} ${col.data_type.padEnd(15)} ${nullable}${defaultVal}`);
      });
    } else {
      console.log('   ⚠️  Não foi possível obter estrutura das colunas');
    }

    console.log('\n━'.repeat(70), '\n');
    console.log('✅ Análise de RLS concluída!\n');

  } catch (error: any) {
    console.error('❌ Erro na análise:', error.message || error);
  }
}

checkRLSPolicies();
