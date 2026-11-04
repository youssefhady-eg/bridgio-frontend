# BRIDGIO — Vercel Hosting Fix Delivery Note

**Date:** 2026-11-04
**Branch:** `fix/vercel-hosting`
**Base:** `8ceae94` (main after PR #12)
**Scope:** Vercel hosting fix only. No UI polish, component library, new feature, marking, price, installments, Learn-to-Hire, exotic flow, or dark theme.

## Hosted URLs and status

- **Production URL supplied by the owner:** <https://bridgio-frontend.vercel.app/>
  - At the time of this note it still returns **404 `NOT_FOUND`** on `/`, `/teacher/dashboard` and `/parent/progress`.
  - Reason: the Vercel **production branch is `main`**, and this fix is intentionally **not merged or pushed to `main`** in this run. Production will keep serving the old `main` build until the owner merges/deploys.
- **Hosted verification deployment (branch preview, commit `d913c48`):** <https://bridgio-frontend-git-fix-vercel-hosting-youssef-17fc.vercel.app/>
  - Verified **HTTP 200** on `/`, `/teacher/dashboard` and `/parent/progress`, in **AR and EN**, with **no local backend running**.
  - This is a real Vercel deployment of the branch, not localhost. The Arabic screenshots below were captured from this hosted URL.

| Hosted check | Final status | Final URL / document |
| --- | --- | --- |
| `/` AR | 200 (307 app redirect, then 200) | `/teacher/dashboard?lang=ar&as=teacher`, `<html lang="ar" dir="rtl">` |
| `/` EN | 200 (307 app redirect, then 200) | `/teacher/dashboard?lang=en&as=teacher`, `<html lang="en" dir="ltr">` |
| `/teacher/dashboard?as=teacher&lang=ar` | 200 | `<html lang="ar" dir="rtl">`, title `لوحة المعلم — Bridgio` |
| `/teacher/dashboard?as=teacher&lang=en` | 200 | `<html lang="en" dir="ltr">`, title `Teacher dashboard — Bridgio` |
| `/parent/progress?as=parent&lang=ar` | 200 | `<html lang="ar" dir="rtl">`, title `ولي الأمر — Bridgio` |
| `/parent/progress?as=parent&lang=en` | 200 | `<html lang="en" dir="ltr">`, title `Parents — Bridgio` |

## Project settings used

Confirmed from the owner's Vercel screenshot plus owner answers:

| Setting | Value |
| --- | --- |
| Framework Preset | **TanStack Start** |
| Root Directory | **`/`** |
| Build Command | **blank / auto** (placeholder `npm run build` or `vite build`; Override off) |
| Output Directory | **blank / auto** (placeholder `dist`; Override off) |
| Install Command | **blank / auto** (Override off) |
| Development Command | blank / auto (Override off) |
| Node.js Version | **26.x** (owner-confirmed) |
| Production branch | **`main`** (owner-confirmed) |
| Deployment verified here | preview branch **`fix/vercel-hosting`**, commit `d913c48` |

The dashboard settings were **not** the defect: framework preset, root directory, build/install/output commands and branch were already consistent with a TanStack Start project. No dashboard setting was changed by this run.

## Root cause of the 404

The build succeeded, but the project had **no SSR deployment adapter**.

- The app is **TanStack Start SSR**, not a static SPA.
- Before this fix the Vite build emitted `dist/client/` (assets, **no `index.html`**) and `dist/server/server.js`.
- With no Nitro/Vercel adapter, a normal Vercel deployment had no static entry point and no server function to handle requests. Vercel therefore answered the platform-level `404 NOT_FOUND`:
  - `HTTP/1.1 404 Not Found`
  - `X-Vercel-Error: NOT_FOUND`
  - same result on `/`, `/teacher/dashboard` and `/parent/progress`.
- This matches the owner's report: **build succeeded, 404 at runtime**.

The checks in order were: correct repo and branch (`main`), deployment present and completed (not deleted/superseded), Framework Preset already **TanStack Start** (not static), Root Directory **`/`** correct, build/install/output commands on auto and correct. The missing layer was the **Nitro Vite plugin** required by the official TanStack Start / Vercel hosting guide.

## Config changed

1. `package.json` / `package-lock.json`
   - Added dependency: `nitro` **`3.0.261103-rc`** (installed with npm, exact version pinned).
2. `vite.config.ts`
   - Added `import { nitro } from 'nitro/vite'`.
   - Plugins are now `[tanstackStart(), nitro(), viteReact()]`.

No `vercel.json` was added. The official TanStack Start and Vercel guides require the Nitro Vite plugin; a `vercel.json` framework override is only needed when the preset is **not** detected, and the dashboard already shows the **TanStack Start** preset. Adding an unneeded override would be unverified config.

Build evidence: a Vercel-preset build (`VERCEL=1 npx vite build`) now emits the Vercel Build Output API:

- `.vercel/output/config.json` routes all requests to `/__server`
- `.vercel/output/functions/__server.func/` (SSR function, runtime `nodejs26.x`)
- `.vercel/output/static/` (client assets, fonts, brand files)

No secrets are used in code, and no `.env` file is committed.

## Verification run

- `npm test` — **91 passed (91)**, 10 test files. No drop from 91.
- `npm run typecheck` — **pass**.
- `npm run build` — **pass** (client + Nitro SSR output).
- Local preview (`npm run preview`) — served the Nitro Node build; `/` redirects to the teacher dashboard and returns 200; teacher dashboard and parent progress return 200 in AR and EN.
- Hosted preview — all six route/language checks above return 200 with the expected `lang`/`dir`; no 404.
- No local backend was running for the hosted checks; the app uses its mock adapter, as built.

## Screenshots (hosted Vercel preview, Arabic)

All captured from <https://bridgio-frontend-git-fix-vercel-hosting-youssef-17fc.vercel.app/>, not localhost:

- `docs/screenshots/vercel-desktop-ar-teacher.png` — 1440×900
- `docs/screenshots/vercel-phone-ar-teacher.png` — 390×844
- `docs/screenshots/vercel-desktop-ar-parent-progress.png` — 1440×900
- `docs/screenshots/vercel-phone-ar-parent-progress.png` — 390×844

Note: the parent progress page renders its normal display-only shell; because the built mock session defaults to `teacher`, it shows the existing “no parent session” state rather than a populated child-progress record. That is existing mock-session behaviour, not a hosting failure.

## Deliberately NOT changed

- No UI polish, component library, new feature, marking, price, installments, Learn-to-Hire, exotic flow, or dark theme.
- No static export, no SPA conversion, no invented static output.
- No `vercel.json` unless and until the framework preset is not detected.
- No change to repo visibility.
- No merge, no PR, no push to `main`.
- `docs/BRIDGIO-LIVE_RULES.md` was not edited to claim this fix is verified or merged.
- No committed `.env` or secret.

## Free-tier / cold-start note

This deployment fits Vercel Hobby: it uses a serverless function rather than a paid server. Vercel does not “sleep” like a Render free web service, but the SSR function can **cold-start** after idle, so the first request after inactivity may be slower. The observed deployment region was `fra1`. Function duration/memory stay within Hobby limits for this small SSR app, but this was not load-tested.

## Open questions

1. **Production still needs the owner action:** merge `fix/vercel-hosting` into `main` (or promote this preview to production) so <https://bridgio-frontend.vercel.app/> serves the fix. This run deliberately did neither.
2. **Preview protection:** Vercel Authentication for previews was temporarily disabled by the owner so the hosted gate could be verified. Re-enable it after verification if preview privacy is required; the preview URL will then need a Vercel login.
3. **Parent progress data:** the hosted mock build has no parent session (`VITE_MOCK_SESSION` defaults to `teacher`). If a populated parent screenshot is required, a demo build with `VITE_MOCK_SESSION=parent` or a real backend session is needed. That is outside this hosting-only scope.
4. **Nitro is a release candidate** (`3.0.261103-rc`) as required by the current TanStack Start/Vercel guidance. Re-check the pinned version when a stable Nitro release is available.
5. **Node 26.x** is owner-confirmed and the Vercel function was generated for `nodejs26.x`; verify Vercel keeps that runtime available for the project over time.