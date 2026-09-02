# Development & Configuration Guide

This is the detailed reference for working on PoliCheck day to day. For a one-paragraph
project overview, see the root [`README.md`](../README.md).

## 1. Prerequisites

- Node.js 20 LTS (Cloud Functions are pinned to Node 20 — see `functions/package.json`)
- npm 10+
- A Firebase project (Blaze plan if you deploy Cloud Functions or use App Check)
- The [Firebase CLI](https://firebase.google.com/docs/cli): `npm install -g firebase-tools`
- (Optional) [Vercel CLI](https://vercel.com/docs/cli) for local `vercel dev` / deploys

## 2. Clone and install

```bash
git clone <repo-url> policheck
cd policheck
npm install
```

The Cloud Functions codebase has its own `package.json` and is **not** part of the root
npm workspace — install it separately when you touch `functions/`:

```bash
cd functions && npm install && cd ..
```

## 3. Environment variables

Copy the template and fill in your Firebase web app config:

```bash
cp .env.example .env.local
```

| Variable | Required | Where to find it |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | Yes | Firebase Console → Project settings → General → Your apps → SDK setup |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | same as above |
| `VITE_FIREBASE_PROJECT_ID` | Yes | same as above |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes | same as above |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | same as above |
| `VITE_FIREBASE_APP_ID` | Yes | same as above |
| `VITE_FIREBASE_MEASUREMENT_ID` | No | only if you enabled Analytics |
| `VITE_FIREBASE_APPCHECK_SITE_KEY` | No | reCAPTCHA v3 site key, only if App Check is enabled |

Notes:

- These `VITE_*` values are compiled into the client bundle and are **not secret** —
  Firestore/Storage security rules (`firestore.rules`, `storage.rules`) are what actually
  protect data, not hiding this config.
- Never put an Admin SDK service-account key, an AI provider key, or any other secret in
  a `VITE_*` variable — it would ship to every browser. Secrets belong in Cloud
  Functions config or a server-side API route only (see §9).
- The app renders even with `.env.local` missing or incomplete: `firebaseConfigured`
  (`src/lib/firebase/config.ts`) short-circuits and the UI shows a "not configured"
  notice instead of crashing, so you can work on layout/UI without a live project.

## 4. Firebase project setup (one-time)

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. **Authentication** → Sign-in method → enable **Email/Password** and **Google**.
3. **Firestore Database** → Create database (start in production mode; the rules file
   below replaces the defaults).
4. **Storage** → Get started (same bucket referenced by `VITE_FIREBASE_STORAGE_BUCKET`).
5. (Optional) **App Check** → register a reCAPTCHA v3 site key if you want bot
   protection on Firestore/Storage calls; put it in `VITE_FIREBASE_APPCHECK_SITE_KEY`.
6. Log in and link the CLI to your project:
   ```bash
   firebase login
   firebase use --add        # pick your project, give it an alias (e.g. "default")
   ```

### 4a. Deploy security rules and indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

- `firestore.rules` — collection-by-collection access control. Read it before changing
  any query in the app: every list query for a public/unauthenticated user **must**
  include a `where("publicationStatus", "==", "published")` filter (see
  `publicationConstraint()` in `src/features/politicians/api.ts`) or Firestore will
  reject the whole query, because the rule can't prove every result is public otherwise.
- `firestore.indexes.json` — composite indexes for the array-contains + equality +
  orderBy queries the app issues (e.g. cases by politician + publication status). If you
  add a new compound query and see a `FAILED_PRECONDITION` error in the browser console,
  Firestore's error message includes a direct link to auto-create the missing index —
  add the equivalent entry to this file so it's captured in version control too.
- `storage.rules` — gates uploads by content type (PDF/PNG/JPEG/WebP only) and a 25MB
  size cap; see `ALLOWED_UPLOAD_MIME_TYPES` / `MAX_UPLOAD_BYTES` in
  `src/lib/firebase/storage.ts` for the client-side mirror of those same limits.

### 4b. Role checks (no Cloud Function required)

Security rules authorize off the `role` field on the caller's **own**
`users/{request.auth.uid}` Firestore document — read live via `get()`/`exists()` in
`firestore.rules`, and via the cross-service `firestore.get()`/`firestore.exists()` rules
functions in `storage.rules` — never off a client-supplied field on the document being
written, and never off a custom claim on the Firebase Auth token. A role change made in
Firestore (by an admin, or by you directly in the console while bootstrapping) takes
effect on the **very next request** — no Cloud Function to deploy, no token refresh, no
sign-out/sign-in required.

`functions/src/index.ts` still exists as an optional, no-longer-required Cloud Function
that mirrors the Firestore role onto a custom claim, kept only as defense-in-depth for
anything outside Firestore/Storage rules that might want to read `request.auth.token.role`
(e.g. a future custom backend). Skip §2's `functions/` install and `firebase deploy
--only functions` entirely unless you actually need that.

### 4c. Bootstrap your first admin account

There's no UI to create the first admin (by design — nobody should be able to
self-promote). After registering an account in the app:

1. Open Firestore Console → `users/{your-uid}` → set `role` to `"admin"`.
2. Reload the app (or just wait — the client holds a live listener on your own profile
   doc, so this is usually instant). You now see the **Admin** nav item and `/admin`
   dashboard, and can promote other users from there instead of touching Firestore
   directly.

## 5. Running the app locally

```bash
npm run dev
```

Starts Vite on `http://localhost:5173` (or the next free port). Hot-reloads on save.

Optional: run against the Firebase **emulator suite** instead of your live project, so
local testing doesn't touch real data:

```bash
firebase emulators:start   # Auth :9099, Firestore :8080, Storage :9199, Functions :5001, UI on the printed port
```

The client code in this repo connects to production Firebase by default. To point it at
the emulators, add emulator-connector calls (`connectAuthEmulator`,
`connectFirestoreEmulator`, `connectStorageEmulator`) guarded by
`import.meta.env.DEV` near the top of `src/lib/firebase/config.ts` — this isn't wired up
out of the box, since most day-to-day work is fine against a real dev project.

## 6. Day-to-day scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | `tsc -b` (typecheck) then `vite build` → `dist/` |
| `npm run preview` | Serve the last production build locally |
| `npm run lint` | ESLint over the whole project |
| `npm run typecheck` | `tsc --noEmit` — fast type-only check, no build output |
| `npm run test` | Vitest — runs everything under `**/__tests__/*.test.ts` |
| `npx vitest --watch` | Vitest in watch mode while you edit `src/lib/**` |

Before pushing, run all three gates locally — CI (if configured) runs the same:

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

## 7. Testing conventions

Unit tests live next to the code they cover, in a sibling `__tests__/` folder
(`src/lib/legal-status/__tests__/freedomStatus.test.ts` tests
`src/lib/legal-status/freedomStatus.ts`, etc.). The project deliberately keeps the
highest-stakes logic — legal-status classification, case-stage transitions, source-tier
validation, identity matching, report generation, and role permissions — as **pure
functions with no Firebase/React dependency**, specifically so they're cheap to test
exhaustively. If you add a new rule to any of those (e.g. a new case stage, a new claim
classification), add a test alongside it rather than only exercising it manually in the
browser.

There's no component/integration test harness wired up yet (no Testing Library render
tests, no Firestore emulator test suite, no Playwright E2E) — see §10 for what to reach
for if you add one.

## 8. Deploying to Vercel

1. Import the repo in the Vercel dashboard (or `vercel link` locally).
2. Framework preset: **Vite**. Build command `npm run build`, output directory `dist`
   (both already match Vercel's Vite defaults, and `vercel.json` adds the SPA rewrite so
   client-side routes don't 404 on refresh).
3. Add the same `VITE_FIREBASE_*` variables from §3 under **Project Settings →
   Environment Variables**, for both the Production and Preview environments (use a
   separate Firebase project per environment if you want preview deploys isolated from
   production data — point Preview's variables at that project instead).
4. Every PR gets its own preview deployment automatically once the repo is connected;
   `main` deploys to production.

## 9. Adding server-side/secret-requiring features

Nothing in this repo currently needs a secret API key (no AI summarization, no external
search — those are Phase 3, unbuilt). If you add one:

- Put the route under `api/` (Vercel serverless functions) or a Firebase Cloud Function
  under `functions/src/` — never in `src/` (which ships to the browser).
- Read the secret from `process.env` (Vercel) or `functions.config()` / Secret Manager
  (Firebase Functions), not a `VITE_*` variable.
- If it's AI-assisted content, follow the rules already encoded in the report builder
  (`src/lib/reports/buildReportMarkdown.ts`): require a source citation for every
  generated claim, store generated summaries separately from verified records, mark them
  clearly as AI-generated, and never let generated output auto-change a `legalStage` or
  `publicationStatus`.

## 10. Where things live (quick map)

```
src/
├── app/            router.tsx (createBrowserRouter), routes.tsx (route tree),
│                   providers.tsx (QueryClient + AuthProvider), App.tsx, pages/
├── components/      shared presentational UI — status badges, source cards,
│                   timelines, charts, layout, tables, nav
├── features/        one folder per domain: auth, politicians, cases,
│                   investigations, sources, reports, reviews, admin.
│                   Each owns its own api.ts (TanStack Query hooks) and pages/forms.
├── lib/
│   ├── firebase/    thin SDK wrappers (config, auth, firestore, storage, auditLog)
│   ├── legal-status/ pure, unit-tested classification logic (see §7)
│   ├── reports/     buildReportMarkdown.ts — the 22-section report generator
│   ├── validation/   Zod schemas, one per form
│   ├── permissions/  role-check helpers mirroring firestore.rules (UI gating only —
│                     the rules file is the actual enforcement)
│   ├── formatting/   date helpers (date-fns wrappers)
│   ├── security/     DOMPurify wrapper
│   └── export/      Markdown/CSV/JSON download helpers
├── types/           TypeScript interfaces mirroring the Firestore data model
├── constants/        labels/colors for statuses, source tiers, roles
└── hooks/           cross-cutting hooks (useAuth)
```

### Common tasks

- **Add a new Firestore collection**: add the interface to `src/types/firestore.ts`, a
  name to `COLLECTIONS` in `src/lib/firebase/firestore.ts`, a match block in
  `firestore.rules`, and an `api.ts` (or hooks in an existing one) using the
  `queryCollection`/`createDoc`/`updateDocById` helpers from
  `src/lib/firebase/firestore.ts` so audit logging and publication-status query
  constraints stay consistent with the rest of the app.
- **Add a new politician-profile tab**: create the component under
  `src/features/politicians/tabs/`, add it to the `TABS` array and route children in
  `src/app/routes.tsx`, and pull data via `useOutletContext<PoliticianOutletContext>()`
  like the existing tabs.
- **Add a new form**: define its Zod schema in `src/lib/validation/schemas.ts`, then a
  `*FormPage.tsx` using `react-hook-form` + `zodResolver`, following the pattern in
  `src/features/cases/CaseFormPage.tsx` (source picker, tier-consistency warning,
  `publicationStatus: "draft"` on create).
- **Change a legal-status rule**: everything lives in `src/lib/legal-status/` — start
  there, update the corresponding test in the sibling `__tests__/` folder, then check
  `src/lib/legal-status/dashboard.ts` and `src/lib/reports/buildReportMarkdown.ts`,
  which both consume that logic and may need matching test updates.

## 11. Troubleshooting

| Symptom | Likely cause / fix |
| --- | --- |
| "Firebase is not configured" banner everywhere | `.env.local` missing or a `VITE_FIREBASE_*` value is blank — check §3, restart `npm run dev` after editing (Vite only reads env files at startup) |
| A public/logged-out user sees nothing in a list that has data | The query is missing the `publicationStatus == "published"` constraint required by the security rules for unauthenticated list queries (§4a) — or the record genuinely isn't published yet |
| `FAILED_PRECONDITION: The query requires an index` in the console | Click the link in the error to auto-create it, then copy the resulting index definition into `firestore.indexes.json` and redeploy so it's reproducible |
| "Missing or insufficient permissions" on submit, even for a role that should be allowed | Make sure `firestore.rules` (and `storage.rules`, for uploads) have actually been deployed — `firebase deploy --only firestore:rules,storage` — the console's "Rules" tab shows the version that's live. Also double-check the account has a `users/{uid}` document with the expected `role` value; a signed-in user with no profile document is treated as `"public"` |
| Upload rejected client-side | Check `ALLOWED_UPLOAD_MIME_TYPES` / `MAX_UPLOAD_BYTES` in `src/lib/firebase/storage.ts` — PDF/PNG/JPEG/WebP only, 25MB cap, mirrored in `storage.rules` |
| `tsc -b` emits stray `.js`/`.d.ts` files at the repo root | `tsconfig.node.json` must keep `"noEmit": true` (Vite's config file is type-checked, not compiled to disk) |
