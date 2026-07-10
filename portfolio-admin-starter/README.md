# Portfolio Admin Starter

This folder is the Phase I frontend foundation for the future private `portfolio_admin` project. It is a standalone Next.js admin dashboard that will later connect to Supabase for authentication, database content, and storage.

## Phase I status

Phase I is focused on the frontend/admin UI only. The current app includes:

- Mock admin authentication when Supabase environment variables are not configured.
- Protected admin layout for mock/real sessions.
- Dashboard overview page.
- Projects content manager using Phase I mock data.
- Certificates content manager using Phase I mock data.
- Responsive desktop sidebar and mobile navigation.
- Reusable UI primitives.
- Delete confirmations, inline validation, toast feedback, and empty/search states.
- Supabase-ready content types aligned with the included SQL/content contract.

The CRUD screens currently use local component state only. Supabase persistence is intentionally reserved for Phase II.

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

If Supabase is not configured, the login page uses a local mock session for UI testing. Enter any email and password to access the dashboard.

## Environment variables

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_for_secure_server_actions
```

For Phase I UI testing, real values are optional. For Phase II, real Supabase values are required.

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Supabase preparation

The `supabase` folder contains initial SQL for the future backend:

- `supabase/schema.sql` creates foundational `projects` and `certifications` tables.
- `supabase/rls.sql` enables Row Level Security and basic policies.

Before Phase II implementation, create the Supabase project, review the policies, and tighten admin-only write access as needed.

## Phase II reminder

Do not add live Supabase CRUD until Phase I checks pass. Phase II should add real Supabase authentication, protected server-side routes, storage buckets, RLS hardening, and persistent CRUD.
