-- Create table to manage company invitation links (magic links)
create extension if not exists pgcrypto;

create table if not exists public.company_invites (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  company_id uuid not null references public.companies(id) on delete cascade,
  role text not null check (role in ('admin','manager','member')) default 'member',
  created_by uuid null references public.app_users(id) on delete set null,
  status text not null check (status in ('pending','accepted','revoked','expired')) default 'pending',
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_by uuid null references public.app_users(id) on delete set null,
  accepted_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_company_invites_token on public.company_invites(token);
create index if not exists idx_company_invites_company on public.company_invites(company_id);
create index if not exists idx_company_invites_status on public.company_invites(status);

create or replace function public.update_company_invites_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_company_invites_updated_at on public.company_invites;
create trigger trg_company_invites_updated_at
before update on public.company_invites
for each row execute procedure public.update_company_invites_updated_at();

-- RLS disabled for local development demo
alter table public.company_invites disable row level security;
