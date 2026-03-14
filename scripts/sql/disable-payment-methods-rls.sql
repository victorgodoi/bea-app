-- ============================================================
-- Script para DESABILITAR RLS da tabela payment_methods
-- ============================================================
-- 
-- ⚠️ ATENÇÃO: Este script remove a segurança de nível de linha.
-- Use apenas para testes em ambiente de desenvolvimento.
-- 
-- Execute este script no SQL Editor do Supabase:
-- 1. Acesse seu projeto no dashboard do Supabase
-- 2. Vá em "SQL Editor"
-- 3. Cole e execute este script
-- 
-- ============================================================

-- OPÇÃO 1: Desabilitar RLS completamente (mais simples)
-- Isso permite que qualquer usuário autenticado acesse todos os dados
ALTER TABLE payment_methods DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- OPÇÃO 2: Remover apenas as políticas existentes (mantém RLS ativo)
-- Descomente as linhas abaixo se preferir remover apenas as políticas
-- ============================================================

-- -- Listar todas as políticas existentes
-- SELECT policyname 
-- FROM pg_policies 
-- WHERE tablename = 'payment_methods';

-- -- Remover políticas (substitua os nomes pelos nomes reais das suas políticas)
-- -- Exemplo:
-- -- DROP POLICY IF EXISTS "payment_methods_select_policy" ON payment_methods;
-- -- DROP POLICY IF EXISTS "payment_methods_insert_policy" ON payment_methods;
-- -- DROP POLICY IF EXISTS "payment_methods_update_policy" ON payment_methods;
-- -- DROP POLICY IF EXISTS "payment_methods_delete_policy" ON payment_methods;

-- ============================================================
-- OPÇÃO 3: Criar política permissiva (permite tudo para usuários autenticados)
-- Descomente se quiser manter RLS mas permitir acesso total
-- ============================================================

-- -- Remover políticas existentes
-- DROP POLICY IF EXISTS "Enable all for authenticated users" ON payment_methods;

-- -- Criar política que permite tudo para usuários autenticados
-- CREATE POLICY "Enable all for authenticated users"
-- ON payment_methods
-- FOR ALL
-- TO authenticated
-- USING (true)
-- WITH CHECK (true);

-- ============================================================
-- VERIFICAÇÃO
-- ============================================================

-- Verificar se RLS está desabilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'payment_methods';

-- Resultado esperado: rls_enabled = false

-- ============================================================
-- NOTAS IMPORTANTES
-- ============================================================
-- 
-- 1. Com RLS desabilitado, qualquer usuário autenticado pode:
--    • Ler todos os métodos de pagamento
--    • Criar novos métodos de pagamento
--    • Atualizar qualquer método de pagamento
--    • Deletar qualquer método de pagamento
-- 
-- 2. Para REABILITAR RLS no futuro, execute:
--    ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
-- 
-- 3. Depois será necessário criar políticas adequadas.
-- 
-- ============================================================
