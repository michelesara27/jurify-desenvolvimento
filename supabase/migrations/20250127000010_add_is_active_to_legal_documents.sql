-- Migração para adicionar campo is_active na tabela legal_documents
-- Este campo permitirá implementar soft delete (inativação) ao invés de exclusão física

-- Adicionar campo is_active com valor padrão TRUE
ALTER TABLE public.legal_documents 
ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- Criar índice para melhor performance nas consultas
CREATE INDEX idx_legal_documents_is_active ON public.legal_documents(is_active);

-- Atualizar todos os registros existentes para is_active = TRUE
UPDATE public.legal_documents SET is_active = TRUE WHERE is_active IS NULL;

-- Comentário: Este campo permite inativar documentos sem removê-los fisicamente do banco
-- Em produção, considere adicionar também campos como deleted_at e deleted_by para auditoria