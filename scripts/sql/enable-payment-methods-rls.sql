-- ============================================================
-- Script para REABILITAR RLS da tabela payment_methods
-- com políticas adequadas
-- ============================================================
-- 
-- Execute este script no SQL Editor do Supabase quando quiser
-- reativar a segurança de nível de linha.
-- 
-- ============================================================

-- 1. Reabilitar RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Enable all for authenticated users" ON payment_methods;
DROP POLICY IF EXISTS "Users can view their company payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can insert payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can update their company payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can delete their company payment methods" ON payment_methods;

-- 3. Criar políticas novas e mais permissivas
-- Estas políticas permitem que usuários autenticados acessem métodos de pagamento
-- da sua empresa (company_id)

-- Política SELECT (ler)
CREATE POLICY "Users can view their company payment methods"
ON payment_methods
FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id 
    FROM users_profile 
    WHERE id = auth.uid()
  )
);

-- Política INSERT (criar)
CREATE POLICY "Users can insert payment methods"
ON payment_methods
FOR INSERT
TO authenticated
WITH CHECK (
  company_id IN (
    SELECT company_id 
    FROM users_profile 
    WHERE id = auth.uid()
  )
);

-- Política UPDATE (atualizar)
CREATE POLICY "Users can update their company payment methods"
ON payment_methods
FOR UPDATE
TO authenticated
USING (
  company_id IN (
    SELECT company_id 
    FROM users_profile 
    WHERE id = auth.uid()
  )
)
WITH CHECK (
  company_id IN (
    SELECT company_id 
    FROM users_profile 
    WHERE id = auth.uid()
  )
);

-- Política DELETE (deletar)
CREATE POLICY "Users can delete their company payment methods"
ON payment_methods
FOR DELETE
TO authenticated
USING (
  company_id IN (
    SELECT company_id 
    FROM users_profile 
    WHERE id = auth.uid()
  )
);

-- ============================================================
-- VERIFICAÇÃO
-- ============================================================

-- Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'payment_methods';

-- Listar políticas criadas
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'payment_methods';

-- ============================================================
-- EXPLICAÇÃO DAS POLÍTICAS
-- ============================================================
-- 
-- As políticas acima funcionam da seguinte forma:
-- 
-- 1. Verificam o auth.uid() (ID do usuário autenticado no Supabase Auth)
-- 2. Buscam o company_id desse usuário na tabela users_profile
-- 3. Permitem acesso apenas aos payment_methods dessa empresa
-- 
-- IMPORTANTE: Estas políticas NÃO verificam o campo created_by,
-- apenas o company_id. Isso permite que qualquer usuário da mesma
-- empresa possa gerenciar os métodos de pagamento.
-- 
-- Se você quiser restringir ainda mais (apenas quem criou pode editar),
-- adicione: AND created_by = auth.uid() nas políticas UPDATE e DELETE.
-- 
-- ============================================================
