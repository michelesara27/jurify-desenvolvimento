-- Create enum type for generation status if it doesn't exist
DO $$ BEGIN
    CREATE TYPE generation_status AS ENUM ('pending', 'processing', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum type for AI model preference if it doesn't exist  
DO $$ BEGIN
    CREATE TYPE ai_model_preference AS ENUM ('gpt-4', 'gpt-3.5-turbo', 'claude-3', 'claude-2');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add indexes on ai_generations for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id_created_at 
ON public.ai_generations (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_generations_status 
ON public.ai_generations (status);

CREATE INDEX IF NOT EXISTS idx_ai_generations_model_used 
ON public.ai_generations (model_used);

-- Add index for filtering by date ranges
CREATE INDEX IF NOT EXISTS idx_ai_generations_completed_at 
ON public.ai_generations (completed_at DESC) WHERE completed_at IS NOT NULL;
