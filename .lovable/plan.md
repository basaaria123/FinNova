## Goal
Splash + onboarding should always appear before the login/sign-up screen for any signed-out visitor, then never reappear once the user is authenticated (no flash on refresh while logged in).

## Current behavior
`SplashAndOnboarding.tsx` uses a `finova_splash_seen` localStorage flag. After it's set the first time, refreshing while signed-out skips the splash and drops the user directly on `/login`.

## Change
In `src/components/SplashAndOnboarding.tsx`:
- Remove the `finova_splash_seen` localStorage gating.
- Initial `phase` logic: while auth is still `loading`, render children-less placeholder (or splash); once resolved:
  - If `user` exists → `phase = "done"` (no splash, no flash).
  - If no `user` → `phase = "splash"` then auto-advance to `onboarding` then `/login`.
- Keep the existing splash→onboarding→login flow intact.
- Remove the localStorage write in the onboarding `finish()` handler.

No backend, routing, or auth changes. Only `SplashAndOnboarding.tsx` is touched.
