-- Portfolio Admin certificate asset key migration
-- Run this once if your certifications table already has the old image column.

alter table public.certifications
  rename column image to certificate_file;

comment on column public.certifications.certificate_file is
  'Selected certificate asset key/filename from the admin app public/certificates folder. Resolve to a public URL at render time.';
