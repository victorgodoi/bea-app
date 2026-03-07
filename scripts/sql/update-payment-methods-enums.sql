-- Script para atualizar os ENUMs da tabela payment_methods
-- Execute este script no SQL Editor do Supabase

-- ============================================================
-- PARTE 1: Atualizar o ENUM payment_method_type
-- ============================================================

-- Passo 1: Remover o valor DEFAULT da coluna (se existir)
ALTER TABLE payment_methods 
  ALTER COLUMN type DROP DEFAULT;

-- Passo 2: Criar novo tipo ENUM com os valores corretos
CREATE TYPE payment_method_type_new AS ENUM ('cash', 'pix', 'bank_transfer', 'card');

-- Passo 3: Alterar a coluna para usar o novo tipo
-- A cláusula USING faz a conversão/migração automaticamente
ALTER TABLE payment_methods 
  ALTER COLUMN type TYPE payment_method_type_new 
  USING (
    CASE type::text
      WHEN 'physical' THEN 'cash'
      WHEN 'electronic' THEN 'card'
      WHEN 'cash' THEN 'cash'
      WHEN 'pix' THEN 'pix'
      WHEN 'bank_transfer' THEN 'bank_transfer'
      WHEN 'card' THEN 'card'
      ELSE 'cash' -- valor padrão para casos inesperados
    END
  )::payment_method_type_new;

-- Passo 4: Remover o tipo antigo
DROP TYPE IF EXISTS payment_method_type;

-- Passo 5: Renomear o novo tipo para o nome original
ALTER TYPE payment_method_type_new RENAME TO payment_method_type;

-- Passo 6: Recriar o valor DEFAULT (opcional - ajuste conforme necessário)
-- Descomente a linha abaixo se quiser definir um valor padrão
-- ALTER TABLE payment_methods 
--   ALTER COLUMN type SET DEFAULT 'card'::payment_method_type;

-- ============================================================
-- PARTE 2: Verificar o ENUM card_type (já deve estar correto)
-- ============================================================

-- O card_type já tem os valores corretos: 'credit', 'debit', 'prepaid'
-- Mas se precisar recriar, aqui está o código:

-- Descomente as linhas abaixo APENAS se precisar recriar o card_type

-- CREATE TYPE card_type_new AS ENUM ('credit', 'debit', 'prepaid');
-- 
-- ALTER TABLE payment_methods 
--   ALTER COLUMN card_type TYPE card_type_new 
--   USING card_type::text::card_type_new;
-- 
-- DROP TYPE IF EXISTS card_type;
-- 
-- ALTER TYPE card_type_new RENAME TO card_type;

-- ============================================================
-- VERIFICAÇÕES FINAIS
-- ============================================================

-- Verificar os valores do ENUM payment_method_type
SELECT 
  'payment_method_type' as enum_name,
  enumlabel as valor,
  enumsortorder as ordem
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname = 'payment_method_type'
ORDER BY e.enumsortorder;

-- Verificar os valores do ENUM card_type
SELECT 
  'card_type' as enum_name,
  enumlabel as valor,
  enumsortorder as ordem
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname = 'card_type'
ORDER BY e.enumsortorder;

-- Verificar os dados da tabela
SELECT 
  type,
  card_type,
  COUNT(*) as total
FROM payment_methods
GROUP BY type, card_type
ORDER BY type, card_type;

-- ============================================================
-- NOTAS IMPORTANTES
-- ============================================================
-- 
-- 1. BACKUP: Faça backup dos seus dados antes de executar!
-- 
-- 2. MAPEAMENTO: O script mapeia automaticamente:
--    - 'physical' → 'cash'
--    - 'electronic' → 'card'
--    Se você tiver dados diferentes, ajuste o CASE na linha de UPDATE
-- 
-- 3. POLICIES: Se você tiver Row Level Security (RLS) policies que 
--    referenciam os valores antigos do ENUM, atualize-as também!
-- 
-- 4. VALORES PADRÃO: Se houver constraints de NOT NULL ou valores 
--    padrão, eles serão preservados automaticamente
-- 
-- 5. TESTE: Execute primeiro em um ambiente de desenvolvimento!
-- 
-- ============================================================
