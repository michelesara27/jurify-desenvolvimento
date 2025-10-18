-- Add user_id column to document_templates for user ownership
ALTER TABLE public.document_templates 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Add additional useful columns for templates
ALTER TABLE public.document_templates 
ADD COLUMN category TEXT,
ADD COLUMN tags TEXT[] DEFAULT '{}',
ADD COLUMN usage_count INTEGER DEFAULT 0,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN preview_content TEXT;

-- Create indexes for better performance (skip document_type as it already exists)
CREATE INDEX idx_document_templates_user_id ON public.document_templates(user_id);
CREATE INDEX idx_document_templates_category ON public.document_templates(category);

-- Update RLS policies for document_templates
DROP POLICY IF EXISTS "Anyone can view templates" ON public.document_templates;

-- Users can view all system templates and their own templates
CREATE POLICY "Users can view templates" 
ON public.document_templates 
FOR SELECT 
USING (is_system_template = true OR auth.uid() = user_id);

-- Users can create their own templates
CREATE POLICY "Users can create their own templates" 
ON public.document_templates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND is_system_template = false);

-- Users can update their own templates (not system templates)
CREATE POLICY "Users can update their own templates" 
ON public.document_templates 
FOR UPDATE 
USING (auth.uid() = user_id AND is_system_template = false);

-- Users can delete their own templates (not system templates)
CREATE POLICY "Users can delete their own templates" 
ON public.document_templates 
FOR DELETE 
USING (auth.uid() = user_id AND is_system_template = false);

-- Create template categories table for better organization
CREATE TABLE public.template_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on template_categories
ALTER TABLE public.template_categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view template categories
CREATE POLICY "Anyone can view template categories" 
ON public.template_categories 
FOR SELECT 
USING (true);

-- Create template usage tracking table
CREATE TABLE public.template_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.document_templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  document_id UUID REFERENCES public.legal_documents(id),
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  variables_used JSONB DEFAULT '{}'
);

-- Enable RLS on template_usage
ALTER TABLE public.template_usage ENABLE ROW LEVEL SECURITY;

-- Users can view their own template usage
CREATE POLICY "Users can view their own template usage" 
ON public.template_usage 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own template usage records
CREATE POLICY "Users can create their own template usage" 
ON public.template_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create indexes for template usage
CREATE INDEX idx_template_usage_user_id ON public.template_usage(user_id);
CREATE INDEX idx_template_usage_template_id ON public.template_usage(template_id);

-- Create function to update template usage count
CREATE OR REPLACE FUNCTION public.update_template_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.document_templates 
    SET usage_count = usage_count + 1 
    WHERE id = NEW.template_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically update usage count
CREATE TRIGGER update_template_usage_count_trigger
  AFTER INSERT ON public.template_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_template_usage_count();

-- Add trigger for updating updated_at column on template_categories
CREATE TRIGGER update_template_categories_updated_at
  BEFORE UPDATE ON public.template_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default template categories
INSERT INTO public.template_categories (name, description, icon, color, sort_order) VALUES
('Contratos', 'Modelos de contratos diversos', 'FileText', 'hsl(var(--primary))', 1),
('Petições', 'Modelos de petições iniciais e recursos', 'Scale', 'hsl(var(--blue))', 2),
('Pareceres', 'Modelos de pareceres jurídicos', 'BookOpen', 'hsl(var(--green))', 3),
('Recursos', 'Modelos de recursos e apelações', 'ArrowUp', 'hsl(var(--orange))', 4),
('Cartas', 'Modelos de cartas e notificações', 'Mail', 'hsl(var(--purple))', 5),
('Administrativo', 'Documentos administrativos', 'Building', 'hsl(var(--cyan))', 6);
