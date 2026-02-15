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

async function testSupabaseConnection() {
  console.log('🔍 Testando conexão com Supabase...\n');

  try {
    // Teste 1: Verificar se o cliente foi criado
    console.log('✓ Cliente Supabase criado');
    console.log(`  URL: ${supabaseUrl}\n`);

    // Teste 2: Tentar obter a sessão atual
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.log('⚠️  Nenhuma sessão ativa (normal se não estiver logado)');
    } else {
      console.log('✓ Verificação de sessão funcionou');
      console.log(`  Sessão: ${sessionData.session ? 'Ativa' : 'Inativa'}\n`);
    }

    // Teste 3: Fazer uma query simples para verificar conexão
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('⚠️  Tabela "users" não encontrada no banco de dados');
        console.log('   Isso é normal se você ainda não criou as tabelas\n');
      } else if (error.message.includes('permission') || error.message.includes('policy')) {
        console.log('⚠️  Sem permissão para acessar a tabela (RLS ativo)');
        console.log('   A conexão está funcionando, mas precisa de autenticação\n');
      } else {
        console.log('❌ Erro na query:', error.message, '\n');
      }
    } else {
      console.log('✓ Query executada com sucesso!');
      console.log('  Conexão com o banco de dados está funcionando\n');
    }

    // Teste 4: Listar tabelas públicas (requer service role)
    console.log('📊 Testando conexão MCP...');
    const { data: health, error: healthError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .limit(5);

    if (healthError) {
      console.log('⚠️  Não foi possível listar tabelas (pode precisar de service role key)');
    } else {
      console.log('✓ Listagem de tabelas funcionou!');
      if (health && health.length > 0) {
        console.log('  Tabelas encontradas:', health.map((t: any) => t.tablename).join(', '));
      }
    }

    console.log('\n✅ Teste de conexão concluído!');
    console.log('\n💡 Dica: Use o GitHub Copilot Chat e pergunte sobre sua base de dados!');
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
    console.log('\n🔍 Verificações:');
    console.log('   1. As variáveis de ambiente estão corretas no arquivo .env?');
    console.log('   2. O projeto Supabase está ativo?');
    console.log('   3. As chaves não expiraram?');
  }
}

testSupabaseConnection();
