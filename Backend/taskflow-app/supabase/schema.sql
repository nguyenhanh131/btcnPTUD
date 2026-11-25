-- TaskFlow schema. Run the whole file once in Supabase Dashboard > SQL Editor > New query > Run.
-- Safe to re-run: it uses "if not exists" and drops policies before recreating them.

create table if not exists public.categories (
  id         text primary key,                 -- slug, matches the category list in the app
  name       text not null unique,
  color      text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id           uuid primary key default gen_random_uuid(),
  title        text not null check (char_length(btrim(title)) between 1 and 120),
  description  text not null default '' check (char_length(description) <= 1000),
  due_date     date,                                                        -- null = no deadline
  priority     text not null default 'medium' check (priority in ('low','medium','high')),
  status       text not null default 'todo'   check (status in ('todo','in_progress','completed')),
  category_id  text not null default 'work' references public.categories(id) on update cascade,
  created_at   date not null default current_date,
  completed_at date,
  updated_at   timestamptz not null default now()
);
create index if not exists tasks_due_date_idx on public.tasks (due_date);
create index if not exists tasks_status_idx   on public.tasks (status);
create index if not exists tasks_category_idx on public.tasks (category_id);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at before update on public.tasks for each row execute function public.set_updated_at();

-- Categories used by the UI (ids must match src/data/categories.ts)
insert into public.categories (id, name, color) values
  ('work','Work','#4f46e5'), ('personal','Personal','#0d9488'), ('health','Health','#16a34a'),
  ('learning','Learning','#d97706'), ('finance','Finance','#9333ea')
on conflict (id) do nothing;

-- Row Level Security -------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.tasks      enable row level security;

grant select on public.categories to anon, authenticated;
grant select, insert, update, delete on public.tasks to anon, authenticated;

drop policy if exists "categories are readable" on public.categories;
create policy "categories are readable" on public.categories for select to anon, authenticated using (true);

-- NO LOGIN in this app, so every visitor is the "anon" role and shares one task list.
-- Anyone who has the publishable key (it is visible in the browser) can read, edit and delete ALL tasks.
-- Acceptable for a coursework demo; NOT acceptable for real user data.
drop policy if exists "tasks public select" on public.tasks;
drop policy if exists "tasks public insert" on public.tasks;
drop policy if exists "tasks public update" on public.tasks;
drop policy if exists "tasks public delete" on public.tasks;
create policy "tasks public select" on public.tasks for select to anon, authenticated using (true);
create policy "tasks public insert" on public.tasks for insert to anon, authenticated with check (true);
create policy "tasks public update" on public.tasks for update to anon, authenticated using (true) with check (true);
create policy "tasks public delete" on public.tasks for delete to anon, authenticated using (true);

-- Upgrade path once you add Supabase Auth: add "user_id uuid default auth.uid() references auth.users",
-- replace the four policies with "to authenticated using (user_id = auth.uid())", and drop the anon grants.
