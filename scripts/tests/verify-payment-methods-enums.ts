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

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY não encontrada no .env');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function verifyEnums() {
  console.log('🔍 Verificando ENUMs atualizados da tabela payment_methods...\n');
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
      
      if (schema.definitions?.payment_methods) {
        const tableDef = schema.definitions.payment_methods;
        
        console.log('📋 Estrutura da tabela payment_methods:\n');
        
        // Mostrar apenas os campos type e card_type
        const relevantFields = ['type', 'card_type'];
        
        Object.entries(tableDef.properties || {}).forEach(([colName, colDef]: [string, any]) => {
          if (relevantFields.includes(colName)) {
            const type = colDef.type || 'unknown';
            const format = colDef.format ? ` (${colDef.format})` : '';
            const enumValues = colDef.enum ? colDef.enum : [];
            
            console.log(`   📌 ${colName.padEnd(15)}: ${type}${format}`);
            if (enumValues.length > 0) {
              console.log(`      Valores: [${enumValues.join(', ')}]`);
            }
            console.log('');
          }
        });

        console.log('━'.repeat(70), '\n');

        // Verificar dados existentes na tabela
        console.log('📊 Verificando dados existentes:\n');
        
        const { data: records, error } = await supabaseAdmin
          .from('payment_methods')
          .select('type, card_type')
          .limit(100);

        if (error) {
          console.log('⚠️  Erro ao buscar dados:', error.message);
        } else if (records && records.length > 0) {
          // Agrupar e contar
          const counts: Record<string, number> = {};
          
          records.forEach((record: any) => {
            const key = `${record.type} / ${record.card_type || 'null'}`;
            counts[key] = (counts[key] || 0) + 1;
          });

          console.log(`   Total de registros: ${records.length}\n`);
          console.log('   Distribuição:\n');
          
          Object.entries(counts).forEach(([key, count]) => {
            console.log(`      • ${key.padEnd(30)} : ${count} registro(s)`);
          });
        } else {
          console.log('   ℹ️  Nenhum registro encontrado na tabela');
        }

        console.log('\n━'.repeat(70), '\n');

        // Validar se os valores esperados estão corretos
        const typeValues = tableDef.properties?.type?.enum || [];
        const cardTypeValues = tableDef.properties?.card_type?.enum || [];

        const expectedTypeValues = ['cash', 'pix', 'bank_transfer', 'card'];
        const expectedCardTypeValues = ['credit', 'debit', 'prepaid'];

        console.log('✅ Validação dos ENUMs:\n');

        // Validar type
        const typeMatch = expectedTypeValues.every(v => typeValues.includes(v)) && 
                         typeValues.every((v: string) => expectedTypeValues.includes(v));
        
        if (typeMatch) {
          console.log('   ✅ Campo "type" está correto!');
          console.log(`      Esperado: [${expectedTypeValues.join(', ')}]`);
          console.log(`      Atual:    [${typeValues.join(', ')}]\n`);
        } else {
          console.log('   ❌ Campo "type" precisa ser atualizado!');
          console.log(`      Esperado: [${expectedTypeValues.join(', ')}]`);
          console.log(`      Atual:    [${typeValues.join(', ')}]\n`);
        }

        // Validar card_type
        const cardTypeMatch = expectedCardTypeValues.every(v => cardTypeValues.includes(v)) && 
                              cardTypeValues.every((v: string) => expectedCardTypeValues.includes(v));
        
        if (cardTypeMatch) {
          console.log('   ✅ Campo "card_type" está correto!');
          console.log(`      Esperado: [${expectedCardTypeValues.join(', ')}]`);
          console.log(`      Atual:    [${cardTypeValues.join(', ')}]\n`);
        } else {
          console.log('   ❌ Campo "card_type" precisa ser atualizado!');
          console.log(`      Esperado: [${expectedCardTypeValues.join(', ')}]`);
          console.log(`      Atual:    [${cardTypeValues.join(', ')}]\n`);
        }

        console.log('━'.repeat(70), '\n');

        if (typeMatch && cardTypeMatch) {
          console.log('🎉 Todos os ENUMs estão configurados corretamente!\n');
        } else {
          console.log('⚠️  Execute o script SQL para atualizar os ENUMs:\n');
          console.log('   scripts/sql/update-payment-methods-enums.sql\n');
        }
      }
    }

  } catch (err: any) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

verifyEnums();
