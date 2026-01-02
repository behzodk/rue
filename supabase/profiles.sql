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
