-- Migração para atualizar clientes existentes com user_id NULL
-- Esta migração garante que todos os clientes tenham um user_id único

-- Atualizar clientes existentes que não possuem user_id
UPDATE public.clients 
SET user_id = gen_random_uuid() 
WHERE user_id IS NULL;

-- Comentário: Esta migração garante que todos os registros existentes
-- tenham um user_id único, mantendo a integridade dos dados