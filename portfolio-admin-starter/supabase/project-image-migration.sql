-- Portfolio Admin project image migration
-- Run this once if your projects table was created before the image column was added.

alter table public.projects
  add column if not exists image text not null default '';

comment on column public.projects.image is
  'Project cover image URL used by the public portfolio.';
