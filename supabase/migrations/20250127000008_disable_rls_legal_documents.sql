-- Migração para desabilitar RLS na tabela legal_documents para demonstração
-- Esta migração permite operações sem autenticação para fins de teste

-- Desabilitar RLS na tabela legal_documents
ALTER TABLE public.legal_documents DISABLE ROW LEVEL SECURITY;

-- Remover políticas existentes para legal_documents
DROP POLICY IF EXISTS "Users can view their own documents" ON public.legal_documents;
DROP POLICY IF EXISTS "Users can create their own documents" ON public.legal_documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON public.legal_documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.legal_documents;

-- Comentário: Em produção, você deve implementar um sistema de autenticação
-- adequado e reabilitar o RLS com políticas apropriadas
