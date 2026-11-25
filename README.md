# TaskFlow

React + TypeScript + Vite + Tailwind + Recharts. Data is stored in **Supabase** when configured, otherwise in **localStorage**.

## 1. Run the app (works without Supabase)
    npm install
    npm run dev          # open the printed http://localhost:5173
    npm run build        # production build in dist/

Without a `.env` file the app uses localStorage (demo data is seeded on first run).

## 2. Set up Supabase
1. Supabase Dashboard > **SQL Editor** > New query > paste `supabase/schema.sql` > **Run**. This creates `categories` and `tasks`, the 5 categories, and the RLS policies.
2. (Optional) Run `supabase/seed.sql` the same way to insert demo tasks, so the Statistics page has data.
3. Dashboard > **Project Settings > API Keys**: copy the **Project URL** and the **Publishable key** (never the secret / service_role key).
4. In the project folder:

        cp .env.example .env

   Open `.env` and fill in:

        VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
        VITE_SUPABASE_PUBLISHABLE_KEY=<your publishable key>
5. Stop and restart `npm run dev` (Vite only reads `.env` at startup).
6. Check it works: add a task, then Dashboard > **Table Editor > tasks** should show the new row. Edit, complete and delete a task and watch the row change.

If `.env` is missing or still has placeholder values, the app silently stays on localStorage. If Supabase is configured but a call fails (for example the schema was not run), a message appears at the bottom of the screen.

## Architecture
- `src/domain`   types, dates, filters, statistics (pure functions)
- `src/data/repository.ts`  `TaskRepository` interface and the switch between adapters
  - `LocalStorageRepository` (same file) and `supabaseRepository.ts`
  - `supabaseClient.ts` creates the client from `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`
- `src/context`, `src/components`, `src/pages`  UI (unchanged by the storage choice)

## Security limits (no login yet)
There is no user authentication, so every visitor uses the same Supabase `anon` role and the RLS policies allow that role to read, create, edit and delete every task. The publishable key is part of the browser bundle, so anyone who opens the site can use it. This is fine for a coursework demo and wrong for real data. Never put the secret or `service_role` key in the frontend or in `.env`. `schema.sql` ends with the steps to add per-user rows once Supabase Auth is added.

Both `.env` and `.env.local` are in `.gitignore`. The publishable key is not a secret, but the project URL and key still should not be committed by habit.

## GitHub Pages
`vite.config.ts` uses `base: './'` and the app uses HashRouter. Vite bakes `.env` values in at build time, so run `npm run build` on a machine that has your `.env`, then publish `dist/`.
