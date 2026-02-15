# Scripts de Teste - Supabase

Este diretório contém scripts para testar e verificar a conexão com o Supabase.

## 📋 Scripts Disponíveis

### 1. `test-supabase-connection.ts`
**Descrição:** Testa a conexão básica com o Supabase  
**Uso:**
```bash
npm run test:connection
# ou
npx tsx scripts/tests/test-supabase-connection.ts
```
**O que verifica:**
- ✅ Cliente Supabase criado corretamente
- ✅ Verificação de sessão funciona
- ✅ Tentativa de query básica
- ⚠️ Detecta problemas de permissão/RLS

---

### 2. `check-database.ts`
**Descrição:** Verifica o status geral do banco de dados  
**Uso:**
```bash
npm run test:database
# ou
npx tsx scripts/tests/check-database.ts
```
**O que verifica:**
- ✅ Status da conexão
- ✅ Sistema de autenticação
- 📊 Link para dashboard do projeto
- 💡 Dicas de próximos passos

---

### 3. `list-tables.ts`
**Descrição:** Lista todas as tabelas disponíveis no banco  
**Uso:**
```bash
npm run test:tables
# ou
npx tsx scripts/tests/list-tables.ts
```
**O que mostra:**
- 📋 Lista de tabelas acessíveis
- 🔒 Status de RLS (Row Level Security)
- 📊 Número de registros por tabela
- 🔗 Informações via API REST

---

### 4. `test-mcp.ts`
**Descrição:** Testa a integração do MCP (Model Context Protocol) com Service Role Key  
**Uso:**
```bash
npm run test:mcp
# ou
npx tsx scripts/tests/test-mcp.ts
```
**O que verifica:**
- ✅ Service Role Key funcionando
- 📊 Acesso completo ao schema
- 📝 Estrutura detalhada das tabelas
- 🔍 Número de registros em cada tabela
- 🎯 Validação da integração com GitHub Copilot

---

## 🚀 Execução Rápida

Execute todos os testes sequencialmente:
```bash
npm run test:supabase
```

## ⚙️ Configuração Necessária

Antes de executar os testes, certifique-se de ter o arquivo `.env` configurado com:

```env
EXPO_PUBLIC_SUPABASE_URL=sua-url-do-supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

## 🔧 Troubleshooting

### Erro: "supabaseUrl is required"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme se as variáveis estão definidas corretamente

### Erro: "Could not find the table"
- A tabela pode não existir ainda no banco
- Ou as políticas RLS podem estar bloqueando o acesso

### Erro relacionado a permissões
- Verifique se a Service Role Key está correta
- Confirme se as políticas RLS estão configuradas

## 📚 Mais Informações

- [Documentação do Supabase](https://supabase.com/docs)
- [Configuração MCP](../../SUPABASE_MCP_SETUP.md)
- [Dashboard do Projeto](https://supabase.com/dashboard)

---

**Nota:** Estes scripts são apenas para desenvolvimento/teste. Não devem ser usados em produção.
