-- Migração para remover temporariamente a foreign key constraint do user_id na tabela legal_documents
-- Esta migração permite operações sem usuários válidos para fins de demonstração

-- Remover foreign key constraint de user_id
ALTER TABLE public.legal_documents DROP CONSTRAINT IF EXISTS legal_documents_user_id_fkey;

-- Permitir user_id nulo temporariamente
ALTER TABLE public.legal_documents ALTER COLUMN user_id DROP NOT NULL;

-- Comentário: Em produção, você deve implementar um sistema de autenticação
-- adequado e recriar a foreign key constraint com usuários válidos