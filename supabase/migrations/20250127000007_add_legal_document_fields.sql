-- Adicionar novos campos obrigatórios para peças jurídicas
-- Migração para incluir campos específicos de ações judiciais

-- Adicionar novos campos à tabela legal_documents
ALTER TABLE public.legal_documents 
ADD COLUMN action_type TEXT,
ADD COLUMN plaintiff TEXT,
ADD COLUMN defendant TEXT,
ADD COLUMN facts TEXT,
ADD COLUMN legal_basis TEXT,
ADD COLUMN request TEXT;

-- Comentários para documentação dos campos
COMMENT ON COLUMN public.legal_documents.action_type IS 'Tipo de ação judicial (obrigatório)';
COMMENT ON COLUMN public.legal_documents.plaintiff IS 'Autor da ação (obrigatório)';
COMMENT ON COLUMN public.legal_documents.defendant IS 'Réu da ação (obrigatório)';
COMMENT ON COLUMN public.legal_documents.facts IS 'Descrição dos fatos (obrigatório)';
COMMENT ON COLUMN public.legal_documents.legal_basis IS 'Fundamento legal (obrigatório)';
COMMENT ON COLUMN public.legal_documents.request IS 'Pedido da ação (obrigatório)';

-- Atualizar a função de trigger para updated_at se necessário
-- (assumindo que já existe uma função para atualizar updated_at)
