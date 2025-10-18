-- Migração para remover temporariamente a foreign key constraint do user_id na tabela cases
-- Esta migração permite operações sem usuários válidos na tabela auth.users para fins de demonstração

-- Remover a foreign key constraint da tabela cases
ALTER TABLE public.cases DROP CONSTRAINT IF EXISTS cases_user_id_fkey;

-- Tornar o campo user_id opcional (permitir NULL) para demonstração
ALTER TABLE public.cases ALTER COLUMN user_id DROP NOT NULL;

-- Comentário: Esta é uma solução temporária para demonstração
-- Em produção, você deve:
-- 1. Implementar autenticação adequada
-- 2. Manter a foreign key constraint
-- 3. Usar user_id real do sistema de autenticação
