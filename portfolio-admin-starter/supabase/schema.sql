-- Portfolio Admin Step 1: Database schema
-- Run this in Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  tags text[] not null default '{}',
  github text not null default '',
  demo text not null default '',
  icon text not null default 'fa-code',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  issuer text not null,
  issued_at date,
  issued_at_label text not null default '',
  description text not null,
  skills text[] not null default '{}',
  image text not null,
  icon text not null default 'fa-certificate',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_certifications_updated_at on public.certifications;
create trigger set_certifications_updated_at
before update on public.certifications
for each row execute function public.set_updated_at();

create index if not exists idx_projects_published_sort
  on public.projects (published, sort_order, created_at desc);

create index if not exists idx_certifications_published_sort
  on public.certifications (published, sort_order, created_at desc);
