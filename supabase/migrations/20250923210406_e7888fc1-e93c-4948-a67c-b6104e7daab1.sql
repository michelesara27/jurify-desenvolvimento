-- Create enum types for legal documents
CREATE TYPE public.document_type AS ENUM ('peticion', 'contract', 'appeal', 'motion', 'brief', 'memorandum', 'other');
CREATE TYPE public.document_status AS ENUM ('draft', 'review', 'approved', 'filed', 'archived');
CREATE TYPE public.generation_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Create document templates table
CREATE TABLE public.document_templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    document_type document_type NOT NULL,
    template_content TEXT,
    variables JSONB DEFAULT '{}',
    is_system_template BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create legal documents table
CREATE TABLE public.legal_documents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    template_id UUID REFERENCES public.document_templates(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT,
    document_type document_type NOT NULL,
    status document_status DEFAULT 'draft',
    file_url TEXT,
    word_count INTEGER DEFAULT 0,
    pages_count INTEGER DEFAULT 0,
    ai_generated BOOLEAN DEFAULT false,
    generation_prompt TEXT,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI generations table for tracking generation history
CREATE TABLE public.ai_generations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES public.legal_documents(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    model_used TEXT,
    status generation_status DEFAULT 'pending',
    tokens_used INTEGER DEFAULT 0,
    generation_time INTEGER, -- in seconds
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create document versions table for revision history
CREATE TABLE public.document_versions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES public.legal_documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    changes_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for document_templates (public read, admin write)
CREATE POLICY "Anyone can view templates" 
ON public.document_templates 
FOR SELECT 
USING (true);

-- Create RLS policies for legal_documents
CREATE POLICY "Users can view their own documents" 
ON public.legal_documents 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own documents" 
ON public.legal_documents 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" 
ON public.legal_documents 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" 
ON public.legal_documents 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for ai_generations
CREATE POLICY "Users can view their own AI generations" 
ON public.ai_generations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI generations" 
ON public.ai_generations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI generations" 
ON public.ai_generations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for document_versions
CREATE POLICY "Users can view versions of their documents" 
ON public.document_versions 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.legal_documents 
        WHERE id = document_versions.document_id 
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can create versions of their documents" 
ON public.document_versions 
FOR INSERT 
WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
        SELECT 1 FROM public.legal_documents 
        WHERE id = document_versions.document_id 
        AND user_id = auth.uid()
    )
);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_document_templates_updated_at
    BEFORE UPDATE ON public.document_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_legal_documents_updated_at
    BEFORE UPDATE ON public.legal_documents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_legal_documents_user_id ON public.legal_documents(user_id);
CREATE INDEX idx_legal_documents_case_id ON public.legal_documents(case_id);
CREATE INDEX idx_legal_documents_client_id ON public.legal_documents(client_id);
CREATE INDEX idx_legal_documents_status ON public.legal_documents(status);
CREATE INDEX idx_legal_documents_document_type ON public.legal_documents(document_type);
CREATE INDEX idx_legal_documents_created_at ON public.legal_documents(created_at);
CREATE INDEX idx_ai_generations_user_id ON public.ai_generations(user_id);
CREATE INDEX idx_ai_generations_document_id ON public.ai_generations(document_id);
CREATE INDEX idx_ai_generations_status ON public.ai_generations(status);
CREATE INDEX idx_document_versions_document_id ON public.document_versions(document_id);
CREATE INDEX idx_document_templates_document_type ON public.document_templates(document_type);

-- Insert some default templates
INSERT INTO public.document_templates (name, description, document_type, template_content, is_system_template) VALUES 
('Petição Inicial Padrão', 'Template básico para petição inicial', 'peticion', 'EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA {} VARA CÍVEL DA COMARCA DE {}...', true),
('Contrato de Prestação de Serviços', 'Template para contratos de prestação de serviços', 'contract', 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS\n\nCONTRATANTE: {}\nCONTRATADO: {}...', true),
('Recurso de Apelação', 'Template para recursos de apelação', 'appeal', 'EXCELENTÍSSIMO SENHOR DESEMBARGADOR RELATOR DO TRIBUNAL DE JUSTIÇA...', true),
('Memorando Jurídico', 'Template para memorandos jurídicos internos', 'memorandum', 'MEMORANDO JURÍDICO\n\nDe: {}\nPara: {}\nAssunto: {}...', true);
