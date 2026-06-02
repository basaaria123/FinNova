
## Goal
Move all user data (auth, expenses, budget, savings goals) from browser localStorage into Lovable Cloud so it persists per-account across devices and shows up in Cloud → Database → Tables.

## 1. Database schema (one migration)

Tables (all with RLS scoped to `auth.uid()`):

- `profiles` — `id`, `user_id` (unique, FK auth.users), `name`, `created_at`, `updated_at`
- `expenses` — `id`, `user_id`, `amount`, `category`, `note`, `date`, `created_at`
- `budgets` — `id`, `user_id` (unique), `monthly`, `updated_at`
- `savings_goals` — `id`, `user_id`, `name`, `target`, `saved`, `created_at`, `updated_at`

For each: `GRANT` to `authenticated` + `service_role`, enable RLS, policies "users manage their own rows" (`auth.uid() = user_id`).

Plus:
- `handle_new_user()` trigger on `auth.users` → auto-insert into `profiles` (uses `raw_user_meta_data->>'name'`).
- `update_updated_at_column()` trigger function reused across tables.

## 2. Auth

- Configure auth: email/password + Google sign-in (via `configure_social_auth`), auto-confirm email ON (so users don't need to verify during testing).
- Rewrite `AuthProvider` in `src/hooks/use-finova-store.tsx` to use real Supabase auth:
  - `signup` → `supabase.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: window.location.origin } })`
  - `login` → `supabase.auth.signInWithPassword`
  - `logout` → `supabase.auth.signOut`
  - Add Google sign-in via Lovable broker
  - Session via `onAuthStateChange` + `getSession`, wired at root so cache invalidates on login/logout.
- Add `/reset-password` route (required by guidelines).
- Update `src/routes/login.tsx` to support the new flow (incl. Google button).

## 3. Data hooks → Supabase

Rewrite `useExpenses`, `useBudget`, `useSavingsGoals` in `use-finova-store.tsx` to read/write Supabase instead of localStorage. Same hook signatures so no component changes needed. Each:
- Loads from Supabase on mount / user change
- `add/update/delete` mutate Supabase, then update local state (optimistic)
- Returns same shape `{ expenses, addExpense, deleteExpense }` etc.

Theme + onboarding stay in localStorage (UI-only, not user data).

## 4. One-time migration of existing localStorage data

On first login after this update, if `finova_expenses_<email>` etc. exist in localStorage and DB is empty for this user → bulk-insert them, then mark migrated (`localStorage.setItem('finova_migrated_<userId>', '1')`). Non-destructive; localStorage data kept as backup.

## 5. Where to verify

After implementation:
- Sign up → row appears in **Cloud → Users** and **Database → Tables → profiles**
- Add expense → row appears in **Database → Tables → expenses** within ~1 sec
- Log out, log back in on another browser → data still there

## Technical details

- Use direct `supabase` client from components (RLS handles security) — no server functions needed for this CRUD.
- Keep `AuthProvider` API surface identical so existing components (`profile.tsx`, `login.tsx`, etc.) only need minimal tweaks.
- Files touched: `src/hooks/use-finova-store.tsx` (major rewrite), `src/routes/login.tsx` (add Google btn, async handlers), `src/routes/__root.tsx` (auth listener + query invalidation), new `src/routes/reset-password.tsx`, new `src/lib/migrate-local-to-cloud.ts`.
- Existing AI tips server fn (`ai-tips.functions.ts`) keeps working unchanged.
