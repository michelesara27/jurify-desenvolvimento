-- Migração para adicionar campos de documento gerado na tabela webhook_responses
-- Adiciona campos para controlar se o documento foi gerado e armazenar o conteúdo formatado

-- Adicionar campo para marcar se o documento foi gerado
ALTER TABLE public.webhook_responses 
ADD COLUMN gerado BOOLEAN DEFAULT FALSE NOT NULL;

-- Adicionar campo para armazenar o documento formatado
ALTER TABLE public.webhook_responses 
ADD COLUMN documento_formatado TEXT;

-- Adicionar campo para data de geração do documento
ALTER TABLE public.webhook_responses 
ADD COLUMN data_geracao TIMESTAMP WITH TIME ZONE;

-- Comentários para documentação dos novos campos
COMMENT ON COLUMN public.webhook_responses.gerado IS 'Indica se o documento formatado foi gerado';
COMMENT ON COLUMN public.webhook_responses.documento_formatado IS 'Conteúdo do documento formatado gerado';
COMMENT ON COLUMN public.webhook_responses.data_geracao IS 'Data e hora da geração do documento formatado';

-- Índice para melhor performance nas consultas por documentos gerados
CREATE INDEX idx_webhook_responses_gerado ON public.webhook_responses(gerado);
