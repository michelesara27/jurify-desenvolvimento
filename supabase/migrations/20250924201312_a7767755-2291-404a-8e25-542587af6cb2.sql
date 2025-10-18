-- Corrigir função handle_new_user adicionando search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Inserir perfil básico
  INSERT INTO public.profiles (user_id, email)
  VALUES (new.id, new.email);
  
  -- Inserir configurações padrão
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$;
