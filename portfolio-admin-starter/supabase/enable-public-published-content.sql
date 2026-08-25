-- Allow the public portfolio to read only published content.
-- Admin writes remain controlled by the existing authenticated/admin policies.

alter table public.projects enable row level security;
alter table public.certifications enable row level security;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
on public.projects
for select
to anon, authenticated
using (published = true);

drop policy if exists "Public can read published certifications" on public.certifications;
create policy "Public can read published certifications"
on public.certifications
for select
to anon, authenticated
using (published = true);
