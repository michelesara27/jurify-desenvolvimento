-- Migração para desabilitar RLS na tabela ai_generations para demonstração
-- Esta migração permite operações sem autenticação para fins de teste

-- Desabilitar RLS na tabela ai_generations
ALTER TABLE public.ai_generations DISABLE ROW LEVEL SECURITY;

-- Remover políticas existentes para ai_generations
DROP POLICY IF EXISTS "Users can view their own AI generations" ON public.ai_generations;
DROP POLICY IF EXISTS "Users can create their own AI generations" ON public.ai_generations;
DROP POLICY IF EXISTS "Users can update their own AI generations" ON public.ai_generations;

-- Comentário: Em produção, você deve implementar um sistema de autenticação
-- adequado e reabilitar o RLS com políticas apropriadas
