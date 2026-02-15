# Configuração do MCP Supabase

## O que foi configurado

Este projeto agora está configurado para usar o **Model Context Protocol (MCP)** do Supabase com o GitHub Copilot.

## Arquivos modificados/criados

1. **`.vscode/extensions.json`** - Adicionada a extensão Supabase às recomendações
2. **`.vscode/settings.json`** - Configurado o servidor MCP do Supabase
3. **`.env.example`** - Arquivo de exemplo com as variáveis de ambiente necessárias

## Como usar

### 1. Instalar a extensão do Supabase

A extensão já foi adicionada às recomendações do VS Code. Para instalá-la:

1. Pressione `Ctrl+Shift+X` para abrir o painel de extensões
2. Procure por "Supabase" ou veja as recomendações
3. Clique em "Install" na extensão **Supabase**

### 2. Configurar as variáveis de ambiente

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e adicione suas credenciais do Supabase:
   - `EXPO_PUBLIC_SUPABASE_URL` - URL do seu projeto Supabase
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` - Chave de service role (apenas para desenvolvimento local)

**⚠️ IMPORTANTE:** A chave `SUPABASE_SERVICE_ROLE_KEY` tem privilégios administrativos. **NUNCA** faça commit dela ou a compartilhe publicamente.

### 3. Como obter as credenciais do Supabase

1. Acesse o [dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Copie:
   - URL em "Project URL"
   - `anon` key em "Project API keys"
   - `service_role` key em "Project API keys" (clique em "Reveal" para visualizar)

### 4. Usar o MCP com GitHub Copilot

Após configurar tudo:

1. Recarregue o VS Code (`Ctrl+Shift+P` > "Developer: Reload Window")
2. Abra o GitHub Copilot Chat
3. Agora você pode fazer perguntas sobre sua base de dados Supabase e o Copilot terá contexto sobre:
   - Estrutura das tabelas
   - Relacionamentos
   - Políticas RLS
   - Funções SQL
   - E muito mais!

### Exemplos de uso

No Copilot Chat, você pode fazer perguntas como:

- "Quais tabelas existem no meu banco de dados?"
- "Mostre a estrutura da tabela users"
- "Crie uma query para buscar todos os usuários com seus posts"
- "Quais políticas RLS existem na tabela posts?"

## Recursos do MCP Supabase

O servidor MCP do Supabase fornece:

- ✅ Acesso ao esquema do banco de dados
- ✅ Informações sobre tabelas e relacionamentos
- ✅ Políticas Row Level Security (RLS)
- ✅ Funções e triggers
- ✅ Tipos customizados
- ✅ Views

## Troubleshooting

Se o MCP não estiver funcionando:

1. Verifique se as variáveis de ambiente estão corretas no arquivo `.env`
2. Recarregue o VS Code completamente
3. Verifique se o pacote `@supabase/mcp-server-supabase` está acessível via npx
4. Confira se o GitHub Copilot está ativo e atualizado

## Scripts de Teste

O projeto inclui scripts para testar e verificar a conexão com o Supabase. Todos estão localizados em `scripts/tests/`:

### Execução rápida

```bash
# Testar conexão básica
npm run test:connection

# Listar todas as tabelas
npm run test:tables

# Testar MCP com Service Role Key
npm run test:mcp

# Executar todos os testes
npm run test:supabase
```

Para mais detalhes sobre cada script, consulte [scripts/tests/README.md](scripts/tests/README.md).

## Mais informações

- [Documentação do Supabase](https://supabase.com/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Supabase MCP Server](https://github.com/supabase/mcp-server-supabase)
