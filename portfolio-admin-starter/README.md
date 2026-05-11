# Portfolio Admin Starter

This folder is a **separate admin app scaffold** intended to be copied into a new private repository (for example: `portfolio-admin`) and deployed independently on Vercel.

## Goal
- Manage `projects` and `certifications` via create, edit, update, and delete actions.
- Keep this admin app private and separate from the public portfolio app.
- Connect both apps later through Supabase.

## Suggested deployment model
- Public portfolio repo/app: read-only consumer.
- Private admin repo/app: authenticated content manager.
- Shared backend: Supabase tables (`projects`, `certifications`).

## Quick start (after copying to new repo)
1. Create a new repo and copy this folder contents into its root.
2. Run `npm install`.
3. Create `.env.local` using `.env.example`.
4. Run `npm run dev`.

## Notes
- This starter intentionally contains placeholder implementation files only.
- You can build UI framework of choice (Next.js/React/Vite) on top of this contract.


## Step 1 done in this repo
- Added `supabase/schema.sql` with foundational tables for `projects` and `certifications`.
- Includes UUID primary keys, slug uniqueness, publish flags, sort order, timestamps, indexes, and auto-update triggers.

## How to apply schema
1. Open your Supabase project dashboard.
2. Go to **SQL Editor**.
3. Paste and run `portfolio-admin-starter/supabase/schema.sql`.
4. Confirm both tables appear in **Table Editor**.


## Step 2 done in this repo
- Added `supabase/rls.sql` to enable RLS and define simple policies.

## How to apply auth/RLS
1. In Supabase SQL Editor, run `portfolio-admin-starter/supabase/rls.sql` after schema.
2. In Supabase Auth, create your admin account (email/password).
3. Keep signups disabled if you want only your account to manage data.

### Current policy behavior
- Public (`anon`) can only read rows where `published = true`.
- Authenticated users can create/update/delete in both tables.


## Step 3 done in this repo
- Added a minimal Next.js admin app scaffold with pages for login, projects CRUD, and certifications CRUD.
- Added reusable table component and Supabase client helper.

### Admin routes
- `/admin/login`
- `/admin/projects`
- `/admin/certifications`


## Step 4 prep notes
- For certificate file upload, create a Supabase storage bucket named `certificates` and set public read if you want direct public URLs.
- The certifications admin form supports either pasting a URL or uploading a file to that bucket.
