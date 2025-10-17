-- Remove campos category, tags e preview_content da tabela document_templates
-- Esta migração remove os campos adicionados na migração 20250925182742_b76788d6-961a-46be-9e6c-261272a3d8f6.sql

-- Remover índices relacionados aos campos que serão removidos
DROP INDEX IF EXISTS idx_document_templates_category;

-- Remover as colunas da tabela document_templates
ALTER TABLE public.document_templates 
DROP COLUMN IF EXISTS category,
DROP COLUMN IF EXISTS tags,
DROP COLUMN IF EXISTS preview_content;

-- Comentário: Os campos usage_count e is_active são mantidos pois podem ser úteis
-- para controle de templates ativos e estatísticas de uso