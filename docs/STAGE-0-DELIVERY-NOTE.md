# BRIDGIO — Stage 0 Delivery Note

**Stage:** 0 — Scaffold + API adapter contract (no UI screens)
**Branch:** `opencode-stage0`
**Date:** 2026-11-01
**Status:** Built and self-verified. **NOT verified by Muse. NOT merged to `main`.
NOT final, locked, or externally ready.**
**Model:** DeepSeek V4.1 Flash Free — provider `opencode`, exact listed model id
`deepseek-v4.1-flash-free`. This differs from the generic “DeepSeek 4.1” label in
the build docs; the listed id is recorded here per the rules.

---

## 1. What changed

- Scaffolded a runnable TanStack app:
  - TanStack Start `1.169.4`, TanStack Router `1.170.46`, TanStack Query `5.105.1`
  - React `19.3.1`, Vite `8.3.5`, TypeScript `7.0.2`, Vitest `5.0.5`
  - Arabic-first document (`lang="ar" dir="rtl"`), light theme only.
- Built **one typed API layer** in `src/api/`:
  - `BridgioApi` contract, 37 methods across auth, teachers, students,
    classrooms, curriculum, materials, tests, questions, attempts, Mohsen and
    adapter diagnostics.
  - Shared domain types in `src/api/types/`.
  - `ApiError` shared by both adapters.
  - Mock adapter implementing the exact same interface, with seeded and empty
    scenarios.
  - HTTP adapter implementing the same interface with a **PROPOSED** route map.
  - Single `fetch` location: `src/api/http/http-client.ts`.
  - Config via `VITE_API_ADAPTER`, `VITE_API_URL`, `VITE_MOCK_SCENARIO`,
    `VITE_MOCK_SESSION`, `VITE_API_TIMEOUT_MS`; mock is the default.
  - TanStack Query key factory + query options; SSR query integration wired.
- Added a minimal **Stage 0 status page** (not a product screen) that proves the
  app runs and reads adapter status through TanStack Query. It shows the mode,
  contract version, mock scenario and “PROPOSED” endpoint status.
- Added contract document: `docs/API-ADAPTER-CONTRACT.md`.
- Added 23 automated tests covering:
  - Mock/HTTP method parity (37 methods).
  - Teacher dashboard aggregate and empty scenario.
  - Builder flow: draft → grounded Mohsen questions → edit → delete → publish →
    published test becomes read-only.
  - Student flow: start → save answer → submit, with **no score fields**.
  - Mohsen grounded answer, refusal when not grounded, and `no_grounding` draft
    result.
  - Config switching and error mapping.
- Copied the four live execution docs into `docs/` for session resumption. Brand
  binaries/fonts were **not** copied.
- Added Arabic screenshots at desktop and phone width.

### Commits (branch history)

Small checkpoint commits were used for scaffold, API contract/types, adapters,
tests, docs and screenshots. See `git log --oneline opencode-stage0`.

---

## 2. What was NOT built

- **No product screens:** no teacher dashboard, no test builder, no question
  editor UI, no student player, no Mohsen panel UI.
- **No Stage 1 work:** no design-token layer, no Sora/Nunito/Alexandria/Baloo
  font loading, no shell, header, nav, logo or wordmark placement.
- **No auth UI and no second auth/user/role system.** Auth is Mentingo-owned; the
  exact method is unconfirmed.
- **No live Mentingo connection.** The Docker demo API was not run in Stage 0.
- **No marking/scoring**, no price, no installments, no Learn-to-Hire, no
  exotic-language flow, no dark theme.
- **No favicon / small mark / app icon** (TBD in the token sheet; deliberately
  not invented).
- **No hosting/deployment** (Stage 7 only).

---

## 3. Deviations from the token sheet and rules

### Token sheet

- **No LOCKED value was changed.** The placeholder styles use only LOCKED cream
  `#F9ECD9`, paper `#FFF6E8`, maroon `#2C0706` and the LOCKED 24 px card radius.
- **No PROPOSED FOR UI value was changed or presented as locked.** The §1–§3
  neutrals/type scale/spacing are not implemented in Stage 0; Stage 1 owns them.
- **No brand font is loaded in Stage 0.** The placeholder uses a system font
  stack intentionally, so Stage 0 does not pretend to implement typography.
- **No brand asset is copied into the repo.** No wordmark, lockup, reactions
  sheet or font file is present.
- The Stage 0 status page is a diagnostic, not a product screen. It uses Arabic
  draft copy, centralised in `src/content/strings.ts`.

### Process / environment

- **Working directory mismatch:** `BRIDGIO-LIVE_RULES.md` names
  `C:\Users\Youssef Hady\Desktop\Youssef\Projects\LMS to Hire\bridgio-frontend`,
  but that folder does not exist. The git repo with the configured remote is
  `C:\Users\Youssef Hady\Desktop\Youssef\Projects\bridgio-frontend`, which is
  where Stage 0 was built. Ask the owner to confirm the canonical path.
- `main` already existed as the local branch (rename from `master` was done
  before this session). Stage 0 work is on `opencode-stage0`; `main` was not
  touched.

### Additions that are not Mentingo endpoints

- **`system.getInfo`** is adapter-local diagnostics for the Stage 0 status page.
  It makes no network request and is explicitly not a Mentingo endpoint.
- **`VITE_MOCK_SESSION`** is mock configuration to start as teacher/student/none
  so later stages can exercise both roles without inventing an auth UI.
- **`Question.correctOptionId`** is authoring metadata only. It is never used to
  compute a score; marking is deferred.
- The HTTP route map is a **proposal**, not a confirmed Mentingo API.

---

## 4. Mocked endpoints

All 37 contract methods are mocked behind the single adapter interface:

- Auth (3): `getSession`, `signIn`, `signOut`.
- Teachers (2) / students (2).
- Classrooms (3).
- Curriculum (3).
- Materials (4).
- Tests (7).
- Questions (5).
- Attempts (5).
- Mohsen (2): grounded `ask`, grounded `draftQuestions`.
- Adapter diagnostics (1): `system.getInfo` (not a Mentingo endpoint).

Every one is labelled **PROPOSED — Mentingo to implement on restore/rebuild** in
`src/api/contract.ts`, `src/api/http/endpoints.ts` and
`docs/API-ADAPTER-CONTRACT.md`.

### Mock behaviour limits (honest)

- Mohsen in the mock is a **deterministic keyword retriever**, not an AI model.
  It answers from seeded material/unit text and refuses when nothing matches.
- Question drafting uses a small seeded question bank. A material with no bank
  entry returns `no_grounding` instead of inventing questions.
- Seed content is Arabic **draft demo data**, not real teacher/student data and
  not approved copy.
- Permissions are minimal proposed checks, not Mentingo's confirmed matrix.

---

## 5. Integration checklist — future MVP screens

All rows are **mocked now** and use **PROPOSED** endpoints. No confirmed
Mentingo endpoint exists.

| Screen / stage | Adapter methods | Proposed Mentingo concept | Confirmed? | Mocked? |
| --- | --- | --- | --- | --- |
| Stage 1 shell | `auth.getSession` | session + user/role | No | Yes |
| Stage 2 teacher dashboard | `teachers.getDashboard`, `classrooms.listForTeacher`, `tests.listForTeacher`; detail `classrooms.get` / `listStudents` | user, class/course, test, progress | No | Yes |
| Stage 3 builder step 1 | `curriculum.listSubjects`, `listUnits`, `materials.listForTeacher`, `classrooms.get` | curriculum, material, class | No | Yes |
| Stage 3 step 2 | `tests.createDraft`, `mohsen.draftQuestions`, `questions.listForTest` | test, question, grounded answer | No | Yes |
| Stage 3 step 3 + editor | `questions.create`, `update`, `delete`, `reorder`, `tests.update` | question, test | No | Yes |
| Stage 3 step 4 | `tests.publish` | test | No | Yes |
| Stage 4 student player | `tests.listForClass`, `tests.get`, `questions.listForTest`, `attempts.start`, `get`, `saveAnswer`, `submit`, `mohsen.ask` | test, question, attempt, grounded answer | No | Yes |
| Stage 5 Mohsen + states | `mohsen.ask`, `mohsen.draftQuestions`, all error/empty paths | grounded answer | No | Yes |
| Stage 7 real backend | all HTTP adapter methods | to be documented from Docker demo | No | HTTP skeleton only |

---

## 6. Verification evidence

Run in the repo root:

| Command | Result |
| --- | --- |
| `npm install` | Pass, 134 packages |
| `npm run typecheck` | Pass, no TypeScript errors |
| `npm test` | **23/23 tests pass** (3 files) |
| `npm run build` | Pass (client + SSR bundle) |
| `npm run dev` | Pass at `http://localhost:3000/` |

Browser checks (dev server):

- Page title: `Bridgio — Stage 0`.
- Document: `lang="ar"`, `dir="rtl"`.
- Console errors: **none**.
- Console warnings: **none**.
- External network requests: **none** (Vite dev modules only).
- Phone viewport check: `innerWidth=390`, `scrollWidth=390` (no horizontal
  overflow).
- Desktop viewport check: `innerWidth=1440`, `scrollWidth=1440`.

### Arabic screenshots

- `docs/screenshots/stage0-desktop.png` — **1440 × 1000**, Arabic/RTL.
- `docs/screenshots/stage0-phone.png` — **390 × 844**, Arabic/RTL.

These show the runnable empty app + adapter status, not feature screens, as
required for the Stage 0 gate.

### Adapter wiring evidence

- The only `fetch` call is in `src/api/http/http-client.ts`.
- The Status page uses `adapterInfoQueryOptions()` → `api.system.getInfo()`; the
  component does not import the mock or call the adapter directly.
- A test compares the mock and HTTP method lists and fails if either drifts.

---

## 7. Configuration for the next session

Copy `.env.example` to `.env` (git-ignored) only if different values are needed.

| Variable | Default | Notes |
| --- | --- | --- |
| `VITE_API_ADAPTER` | `mock` | `mock` or `http`; no live Mentingo is connected. |
| `VITE_API_URL` | `http://localhost:3001/api/v1` | **PROPOSED** base URL; single config change later. |
| `VITE_MOCK_SCENARIO` | `seeded` | Use `empty` for empty-state work. |
| `VITE_MOCK_SESSION` | `teacher` | `teacher`, `student`, `none` (mock only). |
| `VITE_API_TIMEOUT_MS` | `15000` | HTTP adapter timeout. |

No secrets, tokens or passwords are in the repo. `.gitignore` covers
`node_modules`, `.env*` (except `.env.example`), build output and local tooling.

---

## 8. Open questions

1. Mentingo auth method and token transport; sign-in shape (unconfirmed).
2. Mentingo database type for Stage 7 free hosting.
3. Every endpoint path/shape — all proposed; the Docker demo mismatch list is a
   Stage 7 deliverable.
4. Fixed Egyptian curriculum source, grade levels, unit IDs and ownership.
5. Material binary upload, PDF/image extraction and processing states.
6. Whether `correctOptionId` should remain while marking is deferred.
7. Pagination/filtering for real class sizes.
8. Teacher/student permission matrix.
9. Approval of Arabic draft strings and seed content.
10. Stage 1 asset paths: wordmarks, `logo-colour.svg`, `logo-bw.svg`, reactions
    sheet and fonts were not supplied in this session.
11. Canonical repo path (see §3).
12. Small mark/favicon: TBD, intentionally absent.
13. Whether `system.getInfo` stays in production or is dev-only.
14. CORS/allowed origin for Stage 7.

---

## 9. Stage 0 gate self-check

| Gate item | Status |
| --- | --- |
| App runs locally, no errors | **Pass** (typecheck, build, dev, console clean) |
| Adapter exists and is typed | **Pass** (`BridgioApi`, shared types) |
| Mock implements the same interface | **Pass** (runtime parity test + compile-time type) |
| Every endpoint labelled PROPOSED | **Pass** (contract, route map, contract doc) |
| No screens built | **Pass** (Stage 0 status page only) |
| No invented colours, fonts or features | **Pass** (locked colours only; system font; no brand assets) |
| Delivery note complete | **Pass** (this file) |
| Arabic screenshots desktop + phone | **Pass** (paths above) |
| Branch pushed only, no merge to `main` | Done at hand-off; see branch note |

Muse has not verified this stage. Do not start Stage 1 until the gate passes.
