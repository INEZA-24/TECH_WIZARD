-- Portfolio Admin Step 2: Auth + Row Level Security
-- Run after schema.sql

alter table public.projects enable row level security;
alter table public.certifications enable row level security;

-- Clean previous policies if rerun
DROP POLICY IF EXISTS "public can read published projects" ON public.projects;
DROP POLICY IF EXISTS "authenticated can manage projects" ON public.projects;
DROP POLICY IF EXISTS "public can read published certifications" ON public.certifications;
DROP POLICY IF EXISTS "authenticated can manage certifications" ON public.certifications;

-- Public portfolio reads only published content
create policy "public can read published projects"
on public.projects
for select
to anon, authenticated
using (published = true);

create policy "public can read published certifications"
on public.certifications
for select
to anon, authenticated
using (published = true);

-- Admin app users (authenticated) can manage all rows
create policy "authenticated can manage projects"
on public.projects
for all
to authenticated
using (true)
with check (true);

create policy "authenticated can manage certifications"
on public.certifications
for all
to authenticated
using (true)
with check (true);
