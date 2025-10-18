-- Migração para desabilitar RLS na tabela webhook_responses para demonstração
-- Esta migração permite operações sem autenticação para fins de teste

-- Desabilitar RLS na tabela webhook_responses
ALTER TABLE public.webhook_responses DISABLE ROW LEVEL SECURITY;

-- Remover políticas existentes para webhook_responses
DROP POLICY IF EXISTS "Users can view their own webhook responses" ON public.webhook_responses;
DROP POLICY IF EXISTS "Users can insert their own webhook responses" ON public.webhook_responses;
DROP POLICY IF EXISTS "Users can update their own webhook responses" ON public.webhook_responses;
DROP POLICY IF EXISTS "Users can delete their own webhook responses" ON public.webhook_responses;

-- Comentário: Em produção, você deve implementar um sistema de autenticação
-- adequado e reabilitar o RLS com políticas apropriadas
