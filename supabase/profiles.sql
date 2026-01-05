create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  username text not null unique,
  bio text,
  location text
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles
  for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = user_id);

create or replace function public.has_provider_conflict(
  p_email text,
  p_provider text,
  p_user_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  existing_user_id uuid;
  existing_provider text;
begin
  select u.id
    into existing_user_id
    from auth.users u
   where lower(u.email) = lower(p_email)
   limit 1;

  if existing_user_id is null or existing_user_id = p_user_id then
    return false;
  end if;

  select i.provider
    into existing_provider
    from auth.identities i
   where i.user_id = existing_user_id
   order by i.created_at asc
   limit 1;

  if existing_provider is null then
    return false;
  end if;

  return existing_provider <> p_provider;
end;
$$;

grant execute on function public.has_provider_conflict(text, text, uuid) to authenticated;
