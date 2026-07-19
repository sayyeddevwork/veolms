# VeoLMS — Client

React 19 + TypeScript + Tailwind v4 frontend for VeoLMS.

## Stack

- React Router — routing
- TanStack Query — server state (courses, enrollments, progress)
- Redux Toolkit — client-only state (current auth user), via `src/store/`
- React Hook Form + Zod — forms and validation
- Axios — API client, cookie-based auth (`withCredentials: true`) with
  automatic refresh-on-401 retry (see `src/lib/axios.ts`)

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` to point at the running server
(defaults to `http://localhost:5000/api/v1`).

## Caching strategy

- **Query keys** are centralized in `src/lib/queryKeys.ts` — every feature
  imports from there instead of writing ad-hoc arrays, so invalidation
  and optimistic updates never drift out of sync with the queries they
  target.
- **staleTime is tuned per data shape**, not left at one global value:
  course catalog (`useCourses`) 5min, course detail 2min, enrollments
  30s, notifications 15s + a light 60s poll. Slow-changing public data
  stays cached longer; personal/live data refreshes sooner.
- **Selective localStorage persistence** (`src/lib/queryClient.ts`): only
  the public course catalog is persisted across reloads via
  `@tanstack/query-sync-storage-persister`. Enrollments, notifications,
  and anything user-specific are deliberately excluded — no personal
  data sits in localStorage on a shared machine. Bump the `buster`
  string there on any breaking API change to drop stale caches.
- **Mutations don't auto-retry** (`retry: 0` by default) — a retried
  POST/PATCH can double-submit (double-enroll, double-review). Query
  retries use exponential backoff up to 30s.

## Optimistic updates

Two features demonstrate the pattern end to end — copy this shape for
new mutations:

- `features/enrollment/api/enrollment.mutations.ts` (`useEnrollFree`) —
  clicking "Enroll" flips the button to "Enrolled ✓" instantly; on
  failure the cache rolls back to the pre-click state.
- `features/notifications/api/notifications.mutations.ts`
  (`useMarkNotificationRead`) — same `onMutate` / `onError` /
  `onSettled` shape for marking a notification read.

## Production hardening

- **Route-level code splitting** — every page in `src/app/router.tsx`
  is `React.lazy`-loaded, wrapped in a single `<Suspense>` in
  `RootLayout`. The initial bundle only pays for the shell.
- **Vendor chunk splitting** (`vite.config.ts`) — React/Router, Query,
  and Redux each build into their own chunk so a deploy that only
  touches app code doesn't bust the browser's cache of vendor code.
- **`ErrorBoundary`** (`src/components/ErrorBoundary.tsx`) wraps the
  whole app as a last-resort crash screen with a refresh action — wire
  `componentDidCatch` into Sentry or similar before shipping.
- **Query cancellation** — every query passes `signal` through to
  axios, so navigating away mid-request cancels the fetch instead of
  updating state for an unmounted page.
- Skeletons (`components/ui/Skeleton.tsx`) and a retry-capable
  `ErrorState` (`components/ui/ErrorState.tsx`) cover loading/error
  states on the course pages — reuse them for new pages instead of a
  bare spinner.

## Security

- **No tokens in JS.** Auth is entirely httpOnly cookies (`accessToken`/
  `refreshToken`) — nothing sits in localStorage/sessionStorage where
  an XSS bug could read it. `useBootstrapAuth` learns the session by
  asking the server (`GET /auth/me`), not by reading a stored token.
- **CSRF mitigation** (`src/lib/axios.ts`) — every non-GET request gets
  an `X-Requested-With` header attached. A cross-site `<form>` submit
  or `<img>`/no-cors request can't set custom headers, so this blocks
  naive cross-site CSRF. This is defense-in-depth on top of — not a
  replacement for — the backend's CORS allowlist (frontend origin
  only) and cookie `SameSite` setting.
- **XSS**: React escapes all plain-string rendering by default — never
  bypass that except through `components/ui/SafeHtml.tsx`, the one
  sanctioned `dangerouslySetInnerHTML` in the codebase, which runs
  everything through DOMPurify (`src/lib/sanitize.ts`) with a tight
  tag/attribute allowlist first.
- **Open-redirect guard** (`src/lib/safeRedirect.ts`) — the post-login
  redirect validates the target is a same-app relative path before
  navigating, so a crafted `location.state`/query param can't send a
  user to `//evil.com` after they authenticate.
- **Reverse-tabnabbing guard** (`components/ui/ExternalLink.tsx`) — the
  only place `target="_blank"` is allowed; always pairs it with
  `rel="noopener noreferrer"`.
- **Security headers + CSP** (`vercel.json`) — `Content-Security-Policy`,
  `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy`, `Permissions-Policy`, and HSTS are set at the
  hosting layer (a `<meta>` tag alone can't cover response headers like
  `X-Frame-Options` or HSTS). **Update the CSP's `connect-src`/
  `img-src` to your actual Render/Cloudinary domains before shipping**
  — the checked-in values are placeholders.
- **HTTPS enforced in production** — `src/lib/axios.ts` throws at boot
  if `VITE_API_BASE_URL` isn't `https://` when `import.meta.env.PROD`,
  so a misconfigured env var can't silently send session cookies over
  plaintext.
- **No secrets in the frontend, ever.** Anything in `VITE_*` env vars
  ships in the client bundle, world-readable — only the API base URL
  belongs there. Payment/API secret keys stay server-side.
- **Response size cap + timeout** on the axios instance (10MB / 15s) —
  a compromised or misbehaving endpoint can't hang the UI or exhaust
  memory buffering a runaway response.
- **`npm run audit`** runs `npm audit --audit-level=high` — wire this
  into CI so a vulnerable dependency fails the build, not a human
  remembering to check.

## Folder structure

```
src/
├── app/          # router, layout shell, route guards
├── features/     # one folder per backend module: auth, courses,
│                 # enrollment, checkout, student, admin, player,
│                 # reviews, notifications — each owns its own
│                 # api/ (TanStack Query calls), components/, pages/
├── components/   # shared dumb UI (buttons, cards, inputs)
├── lib/          # axios instance, query client
├── store/        # redux toolkit store, slices, typed hooks
└── types/        # shared TS types (mirrors backend DTOs)
```

## Auth model

The backend issues httpOnly `accessToken` / `refreshToken` cookies —
there is no token stored in JS. On app load, `useBootstrapAuth` calls
`GET /auth/me` and dispatches `setUser` into the `auth` slice
(`src/store/authSlice.ts`). `RequireAuth` / `RequireRole` in
`src/app/RouteGuards.tsx` read `state.auth` to gate routes by login
state and role.
