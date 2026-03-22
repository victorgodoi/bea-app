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

// Criar cliente com service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function analyzeCategoriesTables() {
  console.log('🔍 Analisando tabelas categories e sub_categories...\n');
  console.log('━'.repeat(70), '\n');

  try {
    // Buscar schema detalhado via API REST
    const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseServiceKey}`, {
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    });

    if (response.ok) {
      const schema = await response.json();
      
      // Analisar tabela categories
      if (schema.definitions.categories) {
        console.log('📊 TABELA: categories\n');
        console.log('Colunas:\n');
        
        const categoriesDef = schema.definitions.categories;
        if (categoriesDef.properties) {
          Object.entries(categoriesDef.properties).forEach(([colName, colDef]: [string, any]) => {
            const type = colDef.type || 'unknown';
            const format = colDef.format ? ` (${colDef.format})` : '';
            const nullable = colDef.nullable ? ' [nullable]' : ' [required]';
            const description = colDef.description ? ` - ${colDef.description}` : '';
            console.log(`   • ${colName.padEnd(20)} ${type}${format}${nullable}${description}`);
          });
        }
        
        if (categoriesDef.required) {
          console.log('\nCampos obrigatórios:', categoriesDef.required.join(', '));
        }
        
        console.log('\n' + '━'.repeat(70) + '\n');
      }
      
      // Analisar tabela sub_categories
      if (schema.definitions.sub_categories) {
        console.log('📊 TABELA: sub_categories\n');
        console.log('Colunas:\n');
        
        const subCategoriesDef = schema.definitions.sub_categories;
        if (subCategoriesDef.properties) {
          Object.entries(subCategoriesDef.properties).forEach(([colName, colDef]: [string, any]) => {
            const type = colDef.type || 'unknown';
            const format = colDef.format ? ` (${colDef.format})` : '';
            const nullable = colDef.nullable ? ' [nullable]' : ' [required]';
            const description = colDef.description ? ` - ${colDef.description}` : '';
            console.log(`   • ${colName.padEnd(20)} ${type}${format}${nullable}${description}`);
          });
        }
        
        if (subCategoriesDef.required) {
          console.log('\nCampos obrigatórios:', subCategoriesDef.required.join(', '));
        }
        
        console.log('\n' + '━'.repeat(70) + '\n');
      }
    }

    // Buscar dados das tabelas
    console.log('📋 DADOS DAS TABELAS\n');
    
    const { data: categories, error: catError, count: catCount } = await supabaseAdmin
      .from('categories')
      .select('*', { count: 'exact' });

    if (!catError && categories) {
      console.log(`✅ categories: ${catCount} registro(s)\n`);
      if (categories.length > 0) {
        console.log('Exemplo de registro:');
        console.log(JSON.stringify(categories[0], null, 2));
        console.log('');
      }
    } else if (catError) {
      console.log('❌ Erro ao buscar categories:', catError.message);
    }

    const { data: subCategories, error: subError, count: subCount } = await supabaseAdmin
      .from('sub_categories')
      .select('*', { count: 'exact' });

    if (!subError && subCategories) {
      console.log(`\n✅ sub_categories: ${subCount} registro(s)\n`);
      if (subCategories.length > 0) {
        console.log('Exemplo de registro:');
        console.log(JSON.stringify(subCategories[0], null, 2));
        console.log('');
      }
    } else if (subError) {
      console.log('❌ Erro ao buscar sub_categories:', subError.message);
    }

    // Buscar relacionamento
    console.log('\n' + '━'.repeat(70) + '\n');
    console.log('🔗 RELACIONAMENTO\n');
    
    const { data: withRelation, error: relError } = await supabaseAdmin
      .from('sub_categories')
      .select('*, categories(*)')
      .limit(1);

    if (!relError && withRelation && withRelation.length > 0) {
      console.log('✅ Relacionamento detectado entre sub_categories e categories\n');
      console.log('Exemplo de join:');
      console.log(JSON.stringify(withRelation[0], null, 2));
    } else {
      console.log('ℹ️  Nenhum registro com relacionamento encontrado');
    }

    console.log('\n' + '━'.repeat(70) + '\n');

  } catch (error: any) {
    console.error('❌ Erro:', error.message);
  }
}

analyzeCategoriesTables();
