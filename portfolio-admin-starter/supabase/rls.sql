-- Portfolio Admin: Authentication and Row Level Security
-- Public users can read published content.
-- Only the approved admin account can manage content.

alter table public.projects enable row level security;
alter table public.certifications enable row level security;

-- Remove earlier policies so this file can be safely rerun.
drop policy if exists "public can read published projects"
on public.projects;

drop policy if exists "authenticated can manage projects"
on public.projects;

drop policy if exists "admin can manage projects"
on public.projects;

drop policy if exists "public can read published certifications"
on public.certifications;

drop policy if exists "authenticated can manage certifications"
on public.certifications;

drop policy if exists "admin can manage certifications"
on public.certifications;

-- Anyone may read published projects.
create policy "public can read published projects"
on public.projects
for select
to anon, authenticated
using (published = true);

-- Anyone may read published certificates.
create policy "public can read published certifications"
on public.certifications
for select
to anon, authenticated
using (published = true);

-- Only the approved administrator may create, edit, delete,
-- or read unpublished projects.
create policy "admin can manage projects"
on public.projects
for all
to authenticated
using (
  (select auth.uid()) =
  'b2076c39-389f-441a-8e44-60543948c5b2'::uuid
)
with check (
  (select auth.uid()) =
  'b2076c39-389f-441a-8e44-60543948c5b2'::uuid
);

-- Only the approved administrator may create, edit, delete,
-- or read unpublished certificates.
create policy "admin can manage certifications"
on public.certifications
for all
to authenticated
using (
  (select auth.uid()) =
  'b2076c39-389f-441a-8e44-60543948c5b2'::uuid
)
with check (
  (select auth.uid()) =
  'b2076c39-389f-441a-8e44-60543948c5b2'::uuid
);
