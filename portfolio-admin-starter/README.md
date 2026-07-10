# Portfolio Admin Starter

This folder contains the private Next.js admin dashboard for managing Tech Wizard portfolio content. It connects to Supabase for authentication and persistent project/certificate CRUD when Supabase environment variables are configured.

## Current status

The admin app includes:

- Supabase email/password authentication when environment variables are configured.
- Local mock authentication only when Supabase is not configured, for development previews.
- Protected admin layout for mock/real sessions.
- Dashboard overview with Supabase-backed totals when connected.
- Projects content manager with Supabase create, read, update, and delete.
- Certificates content manager with Supabase create, read, update, and delete.
- Manual certificate file selection from `portfolio-admin-starter/public/certificates`.
- Responsive desktop sidebar and mobile navigation.
- Reusable UI primitives.
- Delete confirmations, inline validation, toast feedback, empty states, and search.
- Supabase SQL/schema files aligned with the admin content contract.

If Supabase is not configured, the CRUD screens fall back to local demo data so the UI can still be previewed. Local demo changes are not persistent.

## Admin routes

- `/admin/login`
- `/admin/dashboard`
- `/admin/projects`
- `/admin/certificates`

## Quick start

```bash
cd portfolio-admin-starter
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_for_secure_server_actions
```

Real Supabase values are required for persistent database CRUD. Without them, the app uses local demo data only.

## Manual certificate files

Place certificate images/documents manually in:

```text
portfolio-admin-starter/public/certificates/
```

Supported file extensions are configured in `lib/certificate-assets.ts`. The admin panel lists existing files from this folder and stores the selected filename/key in Supabase as `certificate_file`.

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Supabase preparation

The `supabase` folder contains SQL for the backend:

- `supabase/schema.sql` creates foundational `projects` and `certifications` tables.
- `supabase/rls.sql` enables Row Level Security and basic policies.
- `supabase/certificate-file-migration.sql` renames the old certificate `image` column to `certificate_file` for existing deployments.
- `supabase/project-image-migration.sql` adds the project `image` column for existing deployments.

Before production, review and tighten RLS so only approved admin users can write content.
