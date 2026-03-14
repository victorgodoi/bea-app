# Gerenciamento de RLS para Payment Methods

Este diretório contém scripts SQL para gerenciar as políticas de Row-Level Security (RLS) da tabela `payment_methods`.

## 🚨 Como desabilitar RLS (solução temporária)

### Passo 1: Acessar o SQL Editor do Supabase

1. Acesse [dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**

### Passo 2: Executar o script

1. Copie todo o conteúdo do arquivo `disable-payment-methods-rls.sql`
2. Cole no SQL Editor
3. Clique em **RUN** ou pressione `Ctrl+Enter`

### Passo 3: Verificar

Execute esta query para confirmar que o RLS foi desabilitado:

```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'payment_methods';
```

O resultado deve mostrar `rls_enabled = false`.

## ✅ Como reabilitar RLS (quando estiver pronto)

Quando você quiser reativar a segurança:

1. Abra o arquivo `enable-payment-methods-rls.sql`
2. Cole no SQL Editor do Supabase
3. Execute

Isso vai:
- ✅ Reabilitar o RLS
- ✅ Criar políticas que permitem acesso baseado no `company_id`
- ✅ Não verificar o campo `created_by` (mais flexível)

## 📝 O que muda no código

### Com RLS desabilitado:

O campo `created_by` ainda é obrigatório no banco, mas a política RLS não verifica mais se corresponde ao usuário autenticado. Você pode usar qualquer UUID válido.

### Com RLS habilitado (políticas novas):

As novas políticas verificam apenas se o usuário pertence à mesma empresa (`company_id`), permitindo que qualquer membro da empresa gerencie os métodos de pagamento.

## 🔒 Níveis de segurança

### 1. RLS Desabilitado (atual)
- Qualquer usuário autenticado pode acessar todos os dados
- ⚠️ **Apenas para desenvolvimento/testes**

### 2. RLS por Company (recomendado)
- Usuários só acessam dados da sua empresa
- Arquivo: `enable-payment-methods-rls.sql`
- ✅ **Bom para ambientes de produção**

### 3. RLS por Usuário (mais restritivo)
- Cada usuário só acessa o que criou
- Requer adicionar `AND created_by = auth.uid()` nas políticas
- ✅ **Máxima segurança**

## 🛠️ Troubleshooting

### Erro: "new row violates row-level security policy"

**Causa:** RLS está habilitado e o usuário não tem permissão.

**Solução:**
1. Execute `disable-payment-methods-rls.sql` (temporário)
2. OU configure as políticas corretas com `enable-payment-methods-rls.sql`

### Como ver as políticas atuais

```sql
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'payment_methods';
```

## 📚 Mais informações

- [Documentação RLS do Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
