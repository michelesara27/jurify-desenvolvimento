-- Ajuste de padrão para campo is_active na tabela companies
-- Objetivo: garantir que novos registros de empresas sejam criados como inativos

ALTER TABLE public.companies ALTER COLUMN is_active SET DEFAULT FALSE;
