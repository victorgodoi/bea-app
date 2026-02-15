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
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listAllTables() {
  console.log('🔍 Buscando tabelas no banco de dados Supabase...\n');
  console.log('🔗 Projeto:', supabaseUrl);
  console.log('━'.repeat(70), '\n');

  try {
    // Método 1: Tentar usar a API REST para descobrir tabelas através da introspecção
    console.log('📊 Método 1: Verificando tabelas conhecidas...\n');
    
    const commonTables = [
      'users',
      'profiles', 
      'posts',
      'categories',
      'expenses',
      'payment_methods',
      'payment-methods',
      'transactions',
      'accounts',
      'budgets',
      'settings'
    ];

    const foundTables: string[] = [];
    
    for (const tableName of commonTables) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (!error || error.message.includes('permission') || error.message.includes('policy')) {
          foundTables.push(tableName);
          const status = error ? '🔒 (RLS ativo)' : `✓ (${count || 0} registros)`;
          console.log(`  ✓ ${tableName.padEnd(20)} ${status}`);
        }
      } catch (e) {
        // Ignora erros
      }
    }

    if (foundTables.length === 0) {
      console.log('  ⚠️  Nenhuma tabela comum encontrada\n');
    } else {
      console.log(`\n✅ ${foundTables.length} tabela(s) encontrada(s)!\n`);
    }

    // Método 2: Tentar query SQL via RPC (se houver função criada)
    console.log('━'.repeat(70));
    console.log('\n📊 Método 2: Tentando listar via SQL...\n');
    
    try {
      // Usando uma query direta do PostgREST
      const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseAnonKey}`, {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('  ✓ API REST respondendo');
        
        // Tentar extrair informações de schema
        if (data.definitions) {
          const tables = Object.keys(data.definitions);
          console.log(`\n  📋 Tabelas encontradas no schema: ${tables.length}`);
          tables.forEach(table => {
            console.log(`     • ${table}`);
          });
        }
      }
    } catch (e) {
      console.log('  ⚠️  Não foi possível acessar via API REST direta');
    }

    // Método 3: Verificar autenticação
    console.log('\n━'.repeat(70));
    console.log('\n🔐 Verificando sistema de autenticação...\n');
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('  ℹ️  Nenhum usuário autenticado (isso é normal)');
    } else if (user) {
      console.log(`  ✓ Usuário autenticado: ${user.email}`);
    }

    // Resumo final
    console.log('\n━'.repeat(70));
    console.log('\n📋 RESUMO DA VERIFICAÇÃO\n');
    console.log(`  • Conexão: ✅ Estabelecida`);
    console.log(`  • URL: ${supabaseUrl}`);
    console.log(`  • Tabelas encontradas: ${foundTables.length}`);
    
    if (foundTables.length > 0) {
      console.log(`  • Tabelas: ${foundTables.join(', ')}`);
    }

    console.log('\n💡 DICAS:\n');
    
    if (foundTables.length === 0) {
      console.log('  1. Verifique se você tem permissão para acessar as tabelas');
      console.log('  2. Confirme se as tabelas existem no dashboard:');
      console.log('     https://supabase.com/dashboard/project/pizeofrpzdvvgivvtuil/editor');
      console.log('  3. Verifique se as políticas RLS permitem acesso anônimo');
      console.log('  4. Tente fazer login antes de consultar');
    } else {
      console.log('  ✅ Suas tabelas estão acessíveis!');
      console.log('  📝 Algumas podem ter RLS (Row Level Security) ativo');
      console.log('  🔓 Você pode precisar autenticar para ver os dados');
    }

    console.log('\n━'.repeat(70), '\n');

  } catch (error: any) {
    console.error('❌ Erro durante a verificação:', error.message);
  }
}

listAllTables();
