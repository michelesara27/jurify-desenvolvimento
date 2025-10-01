-- Migração para remover temporariamente a foreign key constraint do user_id
-- Esta migração permite operações sem usuários válidos na tabela auth.users para fins de demonstração

-- Remover a foreign key constraint da tabela clients
ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_user_id_fkey;

-- Tornar o campo user_id opcional (permitir NULL) para demonstração
ALTER TABLE public.clients ALTER COLUMN user_id DROP NOT NULL;

-- Comentário: Esta é uma solução temporária para demonstração
-- Em produção, você deve:
-- 1. Implementar autenticação adequada
-- 2. Manter a foreign key constraint
-- 3. Usar user_id real do sistema de autenticação
