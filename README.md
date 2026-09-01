# PoliCheck

A structured, source-based research application for politicians' identities, political
histories, and legal status — court cases, investigations, convictions, acquittals,
warrants, bail, detention, and current legal standing.

The application prioritizes authoritative sources, clearly distinguishes verified facts
from allegations, preserves source citations, and never presents an unverified claim as
an established fact. The anti-hallucination rules below aren't just prose — they're
enforced in code and covered by unit tests in `src/lib/legal-status/` and
`src/lib/reports/`.

## Stack

React 18 + TypeScript + Vite, React Router, TanStack Query, React Hook Form + Zod,
Tailwind CSS, Recharts, react-markdown + DOMPurify, Firebase (Auth, Firestore, Storage,
optional App Check), deployed on Vercel.

## Status: Phase 1 MVP

This repository implements the Phase 1 scope: auth (email/password + Google), the
Firestore data model, Storage uploads, politician profiles, case/investigation/source/
claim/timeline records, the legal-status dashboard, public profile pages, the
researcher → reviewer → published workflow, and audit logging. Several Phase 2 items are
also included: timelines, source-tier/verification tracking, report generation with
Markdown/CSV/JSON export, and print-friendly report pages. Phase 3 (AI-assisted
summarization, external search integration, notifications, a public API) is not built.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Firebase project's client config
npm run dev
```

The app renders even without Firebase configured (auth/data features show a
configuration notice instead of crashing) — useful for UI work without a live project.

For full setup (Firebase project configuration, security rules deployment, the
role-sync Cloud Function, Vercel environment variables, and troubleshooting), see
[`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).

### Firebase project setup

1. Create a Firebase project with Authentication, Cloud Firestore, and Storage enabled.
2. Enable the Email/Password and Google sign-in providers.
3. Deploy security rules and indexes:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```
4. Deploy the custom-claims sync function (keeps `request.auth.token.role` in sync with
   each user's `users/{uid}.role` document, which the security rules authorize against —
   never the client-writable Firestore field directly):
   ```bash
   cd functions && npm install && cd ..
   firebase deploy --only functions
   ```
5. Copy your web app's config into `.env.local` (see `.env.example`). These values are
   not secret — Firestore/Storage security rules are what actually protect data.
6. The first account created for a project has the `public` role by default. Grant
   yourself `admin` directly in the Firestore console (`users/{uid}.role`) to unlock
   the Admin dashboard and promote everyone else from there.

## Scripts

```bash
npm run dev         # start the Vite dev server
npm run build        # typecheck (tsc -b) + production build
npm run preview       # preview the production build locally
npm run lint         # eslint
npm run test         # vitest
npm run typecheck     # tsc --noEmit
```

## Architecture

Feature-based layout under `src/`:

- `app/` — router, providers, root component
- `components/` — shared, presentational UI (layout, navigation, tables, status badges,
  source cards, timelines, charts)
- `features/` — one directory per domain: `auth`, `politicians`, `cases`,
  `investigations`, `sources`, `reports`, `reviews`, `admin`
- `lib/` — `firebase/` (thin SDK wrappers), `legal-status/` (pure, unit-tested
  classification logic — freedom status, case-stage transitions, source-tier rules,
  identity matching, dashboard aggregation), `reports/` (markdown report builder),
  `validation/` (Zod schemas), `permissions/` (role checks), `formatting/`, `security/`
  (DOMPurify), `export/` (Markdown/CSV/JSON download helpers)
- `types/`, `constants/`, `hooks/` — shared types, labels/colors, and cross-cutting hooks

`firestore.rules` and `storage.rules` at the repo root are the source of truth for
access control; `src/lib/permissions/roles.ts` mirrors them client-side purely for UI
gating (hiding buttons a user can't use) — the server-side rules are what actually
enforce authorization.

## Anti-hallucination guarantees (tested)

The legal-status logic in `src/lib/legal-status/` is pure and unit-tested
(`npm run test`) specifically to prevent the failure modes the spec calls out:

- An investigation, complaint, or indictment never gets treated as evidence of custody
  or guilt (`freedomStatus.ts`, `caseStage.ts`).
- Freedom/incarceration status is derived only from the *most recent* reliable
  custody-relevant event; a stale historical arrest never overrides a later release.
- Conflicting same-day events or a source marked "disputed" produce an explicit
  `unresolved` status rather than a guessed one.
- Tier 4 sources (blogs, anonymous sites, social media) can never alone back a
  conviction, court finding, or formal-allegation claim.
- The generated report (`src/lib/reports/buildReportMarkdown.ts`) never fabricates a
  case number or source citation — missing data renders as an explicit "not on file"
  note instead of an invented value.
