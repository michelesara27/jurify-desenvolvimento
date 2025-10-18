-- Create custom users table for application authentication (no use of auth.users)
create extension if not exists pgcrypto;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  name text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_app_users_email on public.app_users(email);
create index if not exists idx_app_users_active on public.app_users(is_active);

create or replace function public.update_app_users_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_app_users_updated_at on public.app_users;
create trigger trg_app_users_updated_at
before update on public.app_users
for each row execute procedure public.update_app_users_updated_at();

-- RLS policies (disabled for demo; enable and author policies for production)
alter table public.app_users disable row level security;
