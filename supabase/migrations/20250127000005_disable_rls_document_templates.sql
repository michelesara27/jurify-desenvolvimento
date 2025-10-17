-- Migração para desabilitar RLS na tabela document_templates para demonstração
-- Esta migração permite operações sem autenticação para fins de teste

-- Desabilitar RLS na tabela document_templates
ALTER TABLE public.document_templates DISABLE ROW LEVEL SECURITY;

-- Remover políticas existentes para document_templates
DROP POLICY IF EXISTS "Users can view templates" ON public.document_templates;
DROP POLICY IF EXISTS "Users can create their own templates" ON public.document_templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON public.document_templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON public.document_templates;

-- Comentário: Em produção, você deve implementar um sistema de autenticação
-- adequado e reabilitar o RLS com políticas apropriadas