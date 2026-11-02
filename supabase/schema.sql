create table if not exists public.study_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  theme text not null default 'light' check (theme in ('light', 'dark')),
  updated_at timestamptz not null default now()
);

alter table public.study_profiles enable row level security;

drop policy if exists "Users can read own study profile" on public.study_profiles;
create policy "Users can read own study profile"
on public.study_profiles for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create own study profile" on public.study_profiles;
create policy "Users can create own study profile"
on public.study_profiles for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own study profile" on public.study_profiles;
create policy "Users can update own study profile"
on public.study_profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

grant select, insert, update on public.study_profiles to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.study_profiles;
exception
  when duplicate_object then null;
end $$;
