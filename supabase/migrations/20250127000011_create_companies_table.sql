-- Criar tabela para armazenar informações de empresas
-- Migração para incluir estrutura completa de empresas no sistema

CREATE TABLE public.companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comentários para documentação dos campos
COMMENT ON TABLE public.companies IS 'Armazena informações das empresas cadastradas no sistema';
COMMENT ON COLUMN public.companies.id IS 'Identificador único da empresa (chave primária)';
COMMENT ON COLUMN public.companies.name IS 'Nome da empresa';
COMMENT ON COLUMN public.companies.cnpj IS 'CNPJ da empresa (único)';
COMMENT ON COLUMN public.companies.address IS 'Endereço completo da empresa';
COMMENT ON COLUMN public.companies.city IS 'Cidade da empresa';
COMMENT ON COLUMN public.companies.state IS 'Estado/UF da empresa';
COMMENT ON COLUMN public.companies.zip_code IS 'CEP da empresa';
COMMENT ON COLUMN public.companies.phone IS 'Telefone de contato da empresa';
COMMENT ON COLUMN public.companies.email IS 'E-mail de contato da empresa';
COMMENT ON COLUMN public.companies.website IS 'Website da empresa';
COMMENT ON COLUMN public.companies.description IS 'Descrição ou observações sobre a empresa';
COMMENT ON COLUMN public.companies.is_active IS 'Indica se a empresa está ativa no sistema';
COMMENT ON COLUMN public.companies.created_at IS 'Data e hora de cadastro da empresa';
COMMENT ON COLUMN public.companies.updated_at IS 'Data e hora da última atualização';

-- Índices para melhor performance nas consultas
CREATE INDEX idx_companies_name ON public.companies(name);
CREATE INDEX idx_companies_cnpj ON public.companies(cnpj);
CREATE INDEX idx_companies_email ON public.companies(email);
CREATE INDEX idx_companies_is_active ON public.companies(is_active);
CREATE INDEX idx_companies_created_at ON public.companies(created_at);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_companies_updated_at();

-- RLS (Row Level Security) policies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Policy para permitir que todos os usuários autenticados vejam as empresas
CREATE POLICY "Authenticated users can view companies" ON public.companies
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy para permitir que usuários autenticados criem empresas
CREATE POLICY "Authenticated users can create companies" ON public.companies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy para permitir que usuários autenticados atualizem empresas
CREATE POLICY "Authenticated users can update companies" ON public.companies
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy para permitir que usuários autenticados excluam empresas (soft delete recomendado)
CREATE POLICY "Authenticated users can delete companies" ON public.companies
  FOR DELETE USING (auth.role() = 'authenticated');

-- Inserir algumas empresas de exemplo para demonstração
INSERT INTO public.companies (name, cnpj, address, city, state, zip_code, phone, email, website, description) VALUES
('Advocacia Silva & Associados', '12.345.678/0001-90', 'Rua das Flores, 123', 'São Paulo', 'SP', '01234-567', '(11) 9999-8888', 'contato@silvaassociados.com.br', 'www.silvaassociados.com.br', 'Escritório especializado em direito empresarial'),
('Consultoria Jurídica Santos', '98.765.432/0001-10', 'Av. Paulista, 456', 'São Paulo', 'SP', '01310-100', '(11) 8888-7777', 'info@santosconsultoria.com.br', 'www.santosconsultoria.com.br', 'Consultoria em direito tributário e trabalhista'),
('Escritório Oliveira & Partners', '11.222.333/0001-44', 'Rua do Comércio, 789', 'Rio de Janeiro', 'RJ', '20040-020', '(21) 7777-6666', 'contato@oliveirapartners.com.br', 'www.oliveirapartners.com.br', 'Advocacia especializada em direito civil e família');