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

console.log('🧪 Testando criação de método de pagamento COM autenticação...\n');
console.log('━'.repeat(70), '\n');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPaymentMethodCreation() {
  try {
    // 1. Fazer login com o usuário de teste
    console.log('🔐 Fazendo login com usuário de teste...\n');
    
    const email = process.env.TEST_USER_EMAIL || '';
    const password = process.env.TEST_USER_PASSWORD || '';

    if (!email || !password) {
      console.log('❌ Variáveis TEST_USER_EMAIL e TEST_USER_PASSWORD não definidas no .env');
      return;
    }
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.log('❌ Erro ao fazer login:', authError.message);
      console.log('\n💡 Certifique-se de que o usuário existe no Supabase Auth');
      console.log('   Email:', email);
      return;
    }

    console.log('✅ Login realizado com sucesso!');
    console.log('   User ID:', authData.user?.id);
    console.log('   Email:', authData.user?.email);
    console.log('');

    // 2. Buscar perfil do usuário para obter company_id
    console.log('━'.repeat(70), '\n');
    console.log('📋 Buscando perfil do usuário...\n');

    const { data: profile, error: profileError } = await supabase
      .from('users_profile')
      .select('*')
      .eq('email', email)
      .single();

    if (profileError) {
      console.log('❌ Erro ao buscar perfil:', profileError.message);
      return;
    }

    console.log('✅ Perfil encontrado:');
    console.log('   ID:', profile.id);
    console.log('   Nome:', profile.name);
    console.log('   Company ID:', profile.company_id);
    console.log('');

    // 3. Verificar o user atual (deve ser o mesmo do auth)
    console.log('━'.repeat(70), '\n');
    console.log('🔍 Verificando usuário autenticado...\n');

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log('❌ Erro ao obter usuário:', userError?.message);
      return;
    }

    console.log('✅ Usuário autenticado:');
    console.log('   Auth User ID:', user.id);
    console.log('   Email:', user.email);
    console.log('');

    // 4. Tentar criar um método de pagamento
    console.log('━'.repeat(70), '\n');
    console.log('💳 Tentando criar método de pagamento...\n');

    const paymentMethodData = {
      description: 'Teste RLS - Cartão Nubank',
      type: 'card',
      card_type: 'credit',
      flag: 'mastercard',
      bank_name: 'Nubank',
      owner_card: 'Teste User',
      company_id: profile.company_id,
      created_by: user.id, // ✅ UUID do Supabase Auth
      is_active: true,
      due_day: 10,
      closing_day: 5,
    };

    console.log('📝 Dados a serem inseridos:');
    console.log(JSON.stringify(paymentMethodData, null, 2));
    console.log('');

    const { data: paymentMethod, error: paymentError } = await supabase
      .from('payment_methods')
      .insert(paymentMethodData)
      .select()
      .single();

    if (paymentError) {
      console.log('❌ ERRO ao criar método de pagamento:');
      console.log('   Mensagem:', paymentError.message);
      console.log('   Código:', paymentError.code);
      console.log('   Detalhes:', paymentError.details);
      console.log('');
      
      if (paymentError.code === '42501') {
        console.log('🚨 ERRO DE RLS DETECTADO!\n');
        console.log('❓ Possíveis causas:\n');
        console.log('   1. A política RLS permite apenas auth.uid() = created_by');
        console.log('   2. O campo created_by está usando profile.id em vez de user.id');
        console.log('   3. O company_id não pertence ao usuário autenticado');
        console.log('');
        console.log('🔍 Verificação:');
        console.log('   Auth User ID: ', user.id);
        console.log('   Profile ID:   ', profile.id);
        console.log('   created_by:   ', paymentMethodData.created_by);
        console.log('   Match:        ', user.id === paymentMethodData.created_by ? '✅ OK' : '❌ DIFERENTE');
        console.log('');
      }
    } else {
      console.log('✅ SUCESSO! Método de pagamento criado:');
      console.log(JSON.stringify(paymentMethod, null, 2));
      console.log('');
      
      // Limpar - deletar o registro de teste
      console.log('🧹 Limpando registro de teste...');
      await supabase
        .from('payment_methods')
        .delete()
        .eq('id', paymentMethod.id);
      console.log('✅ Registro removido');
      console.log('');
    }

    console.log('━'.repeat(70), '\n');
    console.log('✅ Teste concluído!\n');

    // Logout
    await supabase.auth.signOut();

  } catch (error: any) {
    console.error('❌ Erro no teste:', error.message || error);
  }
}

testPaymentMethodCreation();
