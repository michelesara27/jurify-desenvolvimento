# Documentação do Fluxo de Criação e Geração de Peças Jurídicas

Este documento consolida o fluxo de criação, processamento via webhook e geração/baixar de peças jurídicas, além de mapear hooks, serviços, componentes de UI, schema do Supabase e dependências de build usadas no projeto.

## Visão Geral
- Objetivo: permitir que usuários criem peças jurídicas (petições) a partir de formulários, processem o conteúdo via webhook, formatem e baixem o documento gerado.
- Principais módulos:
  - Formulários: `NewLegalDocumentForm.tsx`, `SimpleLegalDocumentForm.tsx`
  - Geração/Download: `GenerateDocumentButton.tsx`
  - Serviços: `webhook.ts`, `document-generator.ts`, `document-word-generator.ts`
  - Hooks: `use-legal-documents.ts`, `use-webhook-responses.ts`, `use-templates.ts`, `use-auth.ts`, `use-clients.ts`, `use-cases.ts`, paginados
  - UI/Infra: `button.tsx`, `toast.tsx`, `toaster.tsx`, `sonner.tsx`, `App.tsx`
  - Banco: Migrations em `supabase/migrations` e client em `integrations/supabase`

---

## Fluxo de Criação de Documentos

### Formulário Completo — `NewLegalDocumentForm.tsx`
- Campos obrigatórios: `action_type`, `plaintiff`, `defendant`, `facts`, `legal_basis`, `request`.
- Campos opcionais e tags: gerenciamento de metadados e suporte a templates.
- Integrações principais:
  - `useCreateLegalDocument`: insere registro em `legal_documents` (suporta modo demo com `user_id` nulo).
  - `useTemplates`: sugere/seleciona modelos de documento.
  - `useAuth`: controla sessão para filtrar e associar dados.
  - `webhookService`: envia payload para processamento externo, com controle de duplicidade e timeout.
  - `useCreateWebhookResponse`: persiste respostas do webhook em `webhook_responses`.
- Lógica auxiliar: estimativa de contagem de palavras e páginas a partir dos campos do formulário.

Fluxo resumido:
1) Usuário preenche e valida o formulário.
2) Chama `useCreateLegalDocument` para salvar o documento.
3) Monta payload e envia ao webhook via `webhookService`.
4) Salva resposta com `useCreateWebhookResponse`.
5) Documento pode ser gerado/formatado e baixado posteriormente.

### Formulário Simplificado — `SimpleLegalDocumentForm.tsx`
- Foco nos campos essenciais: `action_type`, `plaintiff`, `defendant`, `facts`, `legal_basis`, `request`.
- Suporta criar ou atualizar documento (`useCreateLegalDocument`, `useUpdateLegalDocument`).
- Constrói conteúdo concatenando campos e interage com o `webhookService` para processamento e persistência (`useCreateWebhookResponse`).

---

## Processamento via Webhook — `src/services/webhook.ts`
- Interfaces: `WebhookPayload`, `WebhookResponse`, `ProcessedWebhookContent`.
- Classe `WebhookService`:
  - `sendAsyncWithData(payload)`: envia dados e retorna rapidamente (fire-and-forget).
  - `sendSyncWithData(payload)`: envia e aguarda resposta (timeout padrão ~75s).
  - Controle de duplicidade: evita envios simultâneos repetidos.
  - Tratamento robusto de erros: rede, CORS, timeouts; persiste falhas em `localStorage` (até 50) via `logFailedWebhook` para possível retry.
  - `processWebhookContent(res)`: extrai e normaliza o campo `content` da resposta (inclui parsing de JSON e limpeza de quebras de linha).

Boas práticas implementadas:
- Timeout elevado para serviços externos.
- Tratamento de CORS registrado em `WEBHOOK_CORS_SOLUTION.md`.
- Observabilidade básica com logs e persistência local de falhas.

---

## Geração e Download do Documento

### Componente — `src/components/legal-documents/GenerateDocumentButton.tsx`
- Busca respostas do webhook por documento: `useWebhookResponsesByDocument(documentId)`.
- Quando não há resposta, permite reenviar para o webhook e salvar uma nova `webhook_response`.
- Geração do documento formatado: `useGenerateFormattedDocument(webhookResponseId)` chama `DocumentGeneratorService` e atualiza `webhook_responses` com:
  - `gerado` = `true`
  - `documento_formatado` = conteúdo final
  - `data_geracao` = timestamp
- Download: usa `DocumentWordGenerator` para montar e baixar `.docx` (exibe status e opções de download/regen conforme estado da resposta).

### Serviços de Geração
- `src/services/document-generator.ts`:
  - Interfaces: `PeticaoData`, `DocumentoGerado`.
  - `DocumentGeneratorService` usa `templatePeticao` para construir o texto final, extraindo e substituindo variáveis.
  - `validarDados` verifica campos obrigatórios ausentes antes de gerar.
- `src/services/document-word-generator.ts`:
  - Constrói documento Word (via `docx`) a partir do texto formatado, aplicando estilos básicos e seções.

---

## Hooks e Fluxo de Dados

### Documentos Jurídicos — `use-legal-documents.ts`
- Lista e detalhe de documentos com relações (`clients`, `cases`, `document_templates`).
- Filtra `is_active = true` por padrão.
- Criação e atualização suportam modo demo (`user_id` nulo quando não autenticado).
- Soft delete: `useDeactivateLegalDocument` marca `is_active = false`.
- Estatísticas: `useLegalDocumentsStats` agrega contagens por `status` e páginas.

### Respostas de Webhook — `use-webhook-responses.ts`
- Listagem por usuário e por documento (`useWebhookResponsesByDocument`).
- Criação (`useCreateWebhookResponse`) e geração formatada (`useGenerateFormattedDocument`).
- Atualiza flags e conteúdo gerado no Supabase.

### Templates — `use-templates.ts`
- CRUD completo, duplicação (`useDuplicateTemplate`) e categorias (`template_categories`).
- Em modo demo, `user_id` pode ser `null` para evitar erros de FK.

### Autenticação — `use-auth.ts`
- Monitora sessão com Supabase (`getSession` + `onAuthStateChange`).
- Helpers: `signIn`, `signUp`, `signOut`, `getCurrentUserId`, `isAuthenticated`.

### Clientes e Casos — `use-clients.ts`, `use-cases.ts`
- CRUD completo com `react-query` e toasts.
- Modo demo: usa `demo-user-<uuid>` quando não autenticado.
- Relação de `cases` com `clients` para exibição.

### Paginados — `use-paginated-legal-documents.ts`, `use-paginated-generations.ts`
- Paginação com filtros (busca, status, data, modelo) e `count` exato.
- Mantém estado entre páginas com `keepPreviousData` quando aplicável.

---

## Componentes e Padrões de UI
- `button.tsx`: botão reutilizável com variantes e tamanhos (`cva`, `clsx`).
- `toast.tsx` + `toaster.tsx`: sistema de toasts com Radix, animações e variantes.
- `sonner.tsx`: Toaster alternativo com tema escuro/claro (`next-themes`), estilos Tailwind.
- `Header.tsx`: cabeçalho com avatar, relógio e ícone de notificação.
- `App.tsx`: providers globais (`QueryClientProvider`, `TooltipProvider`, Toasters) e rotas (`react-router-dom`) para páginas principais.

Páginas:
- `Dashboard`, `ClientesCasos`, `MinhasPecas`, `ModelosTemplates`, `HistoricoGeracoes`, `Configuracoes`, `NotFound`, `Index`.

---

## Supabase: Schema e Migrações
- `legal_documents`:
  - Campos novos obrigatórios: `action_type`, `plaintiff`, `defendant`, `facts`, `legal_basis`, `request`.
  - `is_active` para soft delete.
  - Relações com `clients`, `cases`, `document_templates` (FKs removidas/ajustadas para demo em migrations específicas).
- `webhook_responses`:
  - Colunas: `id`, `user_id`, `legal_document_id`, `company_id`, `document_type`, `webhook_response_content` (JSONB), `gerado` (boolean), `documento_formatado` (text), `data_geracao` (timestamp), `created_at`, `updated_at`.
  - Índices e trigger de `updated_at` configurados.
  - RLS desabilitado para demonstração em `20250127000012_disable_rls_webhook_responses.sql` (recomenda-se reativar em produção).
- `companies`:
  - Tabela com campos básicos de cadastro e RLS habilitada por padrão (também foi desativada para demo em algumas migrações).
- Políticas de RLS:
  - Foram removidas/desativadas para fins de demonstração em `legal_documents` e `webhook_responses`.
  - Em produção, reabilitar RLS e ajustar permissões conforme autenticação do Supabase.

Referências úteis:
- `supabase/config.toml` (project_id).
- Pastas `supabase/migrations/` com histórico de alterações.

---

## Dependências e Build
- `package.json`:
  - Core: `react`, `react-dom`, `@tanstack/react-query`, `react-router-dom`, `@supabase/supabase-js`.
  - UI: `@radix-ui/*`, `sonner`, `tailwindcss`, `tailwindcss-animate`, `clsx`, `class-variance-authority`.
  - Docs/Export: `docx`.
  - Utilitários: `zod`, `recharts`.
- `vite.config.ts`:
  - Plugin `@vitejs/plugin-react-swc`.
  - Dev server em `5173`.
  - Alias de paths: `@` -> `src`.
- `tailwind.config.ts`:
  - Modo escuro via `class`.
  - Paleta customizada (`primary`, `secondary`, `destructive`, `sidebar`, etc.).
  - `keyframes`/`animation` para accordions.
- Entradas da aplicação:
  - `main.tsx` renderiza `App`.
  - `App.tsx` registra providers e define rotas.

---

## Erros, Logs e Observabilidade
- Webhook: falhas são logadas em `localStorage` via `logFailedWebhook` com cap de 50 entradas.
- UI: feedback ao usuário via toasts (`toast.tsx`/`sonner.tsx`).
- Console: logs informativos em operações de CRUD, geração e erros.

Sugestões de produção:
- Reativar RLS em tabelas sensíveis e vincular registros ao `user_id` real.
- Configurar monitoramento (Sentry/LogRocket) e alertas.
- Padronizar tratamento de erros com uma camada dedicada.
- Adicionar retries com backoff e circuit breaker para o webhook.
- Criar testes unitários para serviços de geração e integração para hooks.

---

## Principais Sequências (E2E)

1) Criação completa de peça:
- Preencher `NewLegalDocumentForm` → salvar com `useCreateLegalDocument` → enviar ao webhook com `webhookService` → persistir resposta com `useCreateWebhookResponse` → gerar formato com `useGenerateFormattedDocument` → baixar `.docx` com `DocumentWordGenerator`.

2) Criação simplificada:
- Preencher `SimpleLegalDocumentForm` → salvar/atualizar documento → enviar ao webhook → salvar resposta → gerar e baixar documento.

3) Reprocessamento/Download:
- `GenerateDocumentButton` verifica respostas existentes → se vazio, permite reenviar → se gerado, baixa `.docx`; caso não gerado, chama geração formatada e atualiza flags.

---

## FAQ Rápido
- Por que há `user_id` nulo em alguns inserts? Modo demo para evitar FK quando não autenticado.
- Onde configurar CORS do webhook? Ver `WEBHOOK_CORS_SOLUTION.md`.
- Como mudar o tema dos toasts? Ajustar `sonner.tsx` e classes do Tailwind.
- Como controlar paginação? Usar os hooks paginados com `page`/`pageSize` e filtros.

---

Atualizado conforme o estado atual do código em `src/` e `supabase/`.
