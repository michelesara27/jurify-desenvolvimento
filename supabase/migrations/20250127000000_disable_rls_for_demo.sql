-- Migração para desabilitar RLS temporariamente para demonstração
-- Esta migração permite operações sem autenticação para fins de teste

-- Desabilitar RLS na tabela clients
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;

-- Remover políticas existentes para clients
DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can create their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clients;

-- Desabilitar RLS na tabela cases também
ALTER TABLE public.cases DISABLE ROW LEVEL SECURITY;

-- Remover políticas existentes para cases
DROP POLICY IF EXISTS "Users can view their own cases" ON public.cases;
DROP POLICY IF EXISTS "Users can create their own cases" ON public.cases;
DROP POLICY IF EXISTS "Users can update their own cases" ON public.cases;
DROP POLICY IF EXISTS "Users can delete their own cases" ON public.cases;

-- Comentário: Em produção, você deve implementar um sistema de autenticação
-- adequado e reabilitar o RLS com políticas apropriadas