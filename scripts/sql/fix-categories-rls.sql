-- ============================================================
-- Script para corrigir políticas RLS da tabela categories
-- ============================================================
--
-- Execute este script no SQL Editor do Supabase:
-- 1. Acesse seu projeto no dashboard do Supabase
-- 2. Vá em "SQL Editor"
-- 3. Cole e execute este script
--
-- ============================================================

-- 1. Garantir que o RLS está habilitado
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Enable all for authenticated users" ON categories;
DROP POLICY IF EXISTS "Users can view their company categories" ON categories;
DROP POLICY IF EXISTS "Users can insert categories" ON categories;
DROP POLICY IF EXISTS "Users can update their company categories" ON categories;
DROP POLICY IF EXISTS "Users can delete their company categories" ON categories;

-- 3. Criar políticas baseadas no company_id do usuário autenticado

-- Política SELECT (ler)
CREATE POLICY "Users can view their company categories"
ON categories
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
CREATE POLICY "Users can insert categories"
ON categories
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
CREATE POLICY "Users can update their company categories"
ON categories
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

-- Política DELETE (excluir)
CREATE POLICY "Users can delete their company categories"
ON categories
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
-- Verificação: listar políticas criadas
-- ============================================================
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'categories';
