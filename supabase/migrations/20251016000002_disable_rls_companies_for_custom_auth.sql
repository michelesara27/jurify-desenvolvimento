-- Disable RLS on companies to allow custom-auth operations without Supabase auth session
ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can create companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can update companies" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can delete companies" ON public.companies;

-- In production, implement proper RLS with custom auth via Postgres functions or edge functions.
