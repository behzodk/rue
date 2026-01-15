alter table public.problems add column if not exists slug text;
create unique index if not exists problems_slug_key on public.problems (slug);
