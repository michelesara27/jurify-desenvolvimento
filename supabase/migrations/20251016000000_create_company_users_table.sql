-- Create table company_users to link Supabase auth users to companies with roles
create table if not exists public.company_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  company_id uuid not null references public.companies(id) on delete cascade,
  role text not null check (role in ('admin','manager','member')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_company_users_user on public.company_users(user_id);
create index if not exists idx_company_users_company on public.company_users(company_id);
create index if not exists idx_company_users_role on public.company_users(role);

-- Trigger to update updated_at on row change
create or replace function public.update_company_users_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_company_users_updated_at on public.company_users;
create trigger trg_company_users_updated_at
before update on public.company_users
for each row execute procedure public.update_company_users_updated_at();

-- RLS policies (disabled for demo to simplify local development)
alter table public.company_users disable row level security;

-- Optional seed example (commented)
-- insert into public.company_users (user_id, company_id, role) values ('00000000-0000-0000-0000-000000000000', (select id from public.companies limit 1), 'admin');
