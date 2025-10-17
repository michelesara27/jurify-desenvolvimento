-- Add foreign key from company_users.user_id to app_users.id for easier joins
alter table public.company_users
  add constraint company_users_user_id_fkey
  foreign key (user_id) references public.app_users(id)
  on delete cascade;