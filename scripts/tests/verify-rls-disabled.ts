import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Carregar variáveis de ambiente
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

console.log('🔍 Verificando status do RLS na tabela payment_methods...\n');
console.log('━'.repeat(70), '\n');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRLSStatus() {
  try {
    console.log('📋 TESTE 1: Tentar inserir SEM autenticação\n');
    
    // Tentar inserir sem estar autenticado
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        description: 'Teste RLS Desabilitado',
        type: 'cash',
        company_id: '00000000-0000-0000-0000-000000000000',
        created_by: '00000000-0000-0000-0000-000000000000',
        is_active: true
      })
      .select()
      .single();

    if (error) {
      if (error.code === '42501') {
        console.log('❌ RLS AINDA ESTÁ HABILITADO');
        console.log('   Erro:', error.message);
        console.log('\n💡 Execute o script disable-payment-methods-rls.sql no Supabase');
      } else {
        console.log('⚠️  Erro diferente:', error.message);
        console.log('   Código:', error.code);
      }
    } else {
      console.log('✅ RLS FOI DESABILITADO COM SUCESSO!');
      console.log('   Registro criado:', data?.id);
      console.log('\n🧹 Limpando registro de teste...');
      
      // Criar cliente admin para deletar
      const supabaseAdmin = createClient(
        supabaseUrl,
        process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
      
      await supabaseAdmin
        .from('payment_methods')
        .delete()
        .eq('id', data.id);
      
      console.log('✅ Limpeza concluída');
    }

    console.log('\n━'.repeat(70), '\n');
    console.log('✅ Verificação concluída!\n');

  } catch (err: any) {
    console.error('❌ Erro:', err.message || err);
  }
}

checkRLSStatus();
