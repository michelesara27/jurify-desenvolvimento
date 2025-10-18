-- Criar tabela para armazenar respostas do webhook
-- Migração para incluir dados de resposta do webhook após criação de peças jurídicas

CREATE TABLE public.webhook_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  legal_document_id UUID REFERENCES public.legal_documents(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  document_type TEXT NOT NULL,
  webhook_response_content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comentários para documentação dos campos
COMMENT ON TABLE public.webhook_responses IS 'Armazena as respostas do webhook após criação de peças jurídicas';
COMMENT ON COLUMN public.webhook_responses.user_id IS 'ID do usuário que criou a nova peça';
COMMENT ON COLUMN public.webhook_responses.legal_document_id IS 'ID da peça jurídica relacionada';
COMMENT ON COLUMN public.webhook_responses.company_id IS 'ID da empresa (se aplicável)';
COMMENT ON COLUMN public.webhook_responses.document_type IS 'Tipo do documento';
COMMENT ON COLUMN public.webhook_responses.webhook_response_content IS 'Conteúdo completo retornado pelo webhook em formato JSON';
COMMENT ON COLUMN public.webhook_responses.created_at IS 'Data e hora da criação do registro';

-- Índices para melhor performance
CREATE INDEX idx_webhook_responses_user_id ON public.webhook_responses(user_id);
CREATE INDEX idx_webhook_responses_legal_document_id ON public.webhook_responses(legal_document_id);
CREATE INDEX idx_webhook_responses_company_id ON public.webhook_responses(company_id);
CREATE INDEX idx_webhook_responses_created_at ON public.webhook_responses(created_at);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_webhook_responses_updated_at
  BEFORE UPDATE ON public.webhook_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS (Row Level Security) policies
ALTER TABLE public.webhook_responses ENABLE ROW LEVEL SECURITY;

-- Policy para permitir que usuários vejam apenas suas próprias respostas de webhook
CREATE POLICY "Users can view their own webhook responses" ON public.webhook_responses
  FOR SELECT USING (auth.uid() = user_id);

-- Policy para permitir que usuários insiram suas próprias respostas de webhook
CREATE POLICY "Users can insert their own webhook responses" ON public.webhook_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy para permitir que usuários atualizem suas próprias respostas de webhook
CREATE POLICY "Users can update their own webhook responses" ON public.webhook_responses
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy para permitir que usuários deletem suas próprias respostas de webhook
CREATE POLICY "Users can delete their own webhook responses" ON public.webhook_responses
  FOR DELETE USING (auth.uid() = user_id);
