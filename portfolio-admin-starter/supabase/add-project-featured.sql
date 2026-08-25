alter table public.projects add column if not exists featured boolean not null default false;
create index if not exists idx_projects_featured_published_sort on public.projects (featured, published, sort_order, created_at desc);
