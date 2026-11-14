# BRIDGIO — Batch 5 Delivery Note

**Date:** 2026-11-14
**Branch:** `feat/finish-frontend`
**Base:** `2f2e94c` (`origin/main`, after Batch 4 / PR #32)
**Scope:** finish the product frontend — the 7 finish fixes (items 1–7), the three new product pages (items 8–10), the Messages check (item 11), the global Mohsen circle (item 12), the student home page (item 13), and the connect-ready global rule (item 14: every surface wired to `BridgioApi` through the mock adapter, loading/empty/error everywhere, no dead controls, no fake success).

The batch starts with a docs-only commit (`759ee38`) that copies Muse's current `BRIDGIO-LIVE_RULES.md` into `docs/` before any code changed, then a contract commit (`0664511`) that adds the PROPOSED methods the new screens need.

Branch pushed only — no PR, no merge.

---

## 1. What changed

| # | Item | Change | Commit |
| --- | --- | --- | --- |
| 1 | Red-dot removals | Removed the eyebrow/sidebar-active dot and the nav badge; the active item keeps its full-width wash. | `c7ebb5a` |
| 2 | Hover underlines → wash | `.screen-link`, `.page-back` and the help index drop the hover/focus underline and use the hover wash; the global focus ring is unchanged. | `c7ebb5a` |
| 3 | Hero rhythm | Restored the vertical rhythm between the shared hero and the first `.finish-row` / dashboard section (test detail and every hero screen). | `c7ebb5a` |
| 4 | Frameless success chip | `.status-chip--success` gets a transparent border, matching its paper background — no framing, other tones untouched. | `c7ebb5a` |
| 5 | `label: value` spacing | New `MetaPair` primitive renders the label and value as separate flex items instead of a `{'label'}: {value}` text join whose space collapses at a text-node boundary in RTL. Applied across dashboard, teacher, student, parent and builder surfaces. | `c7ebb5a` |
| 6 | Middle-dot separator | New `MetaSep` primitive renders the `·` as its own element with its own spacing, replacing inline ` A· B` text joins (class cards, lesson meta, material choice cards, student-detail class names). | `c7ebb5a` |
| 7 | Help article ending | Reworded the teacher test-builder Help article ending so it reads as a sentence rather than a trailing fragment. | `c7ebb5a` |
| 8 | Notifications page | `/notifications` lists teacher submissions, published tests and new messages, newest first, from `notifications.listForUser` (PROPOSED). Non-teacher accounts get an honest role note, never a fabricated empty list. | `973fbec` |
| 9 | Search | `/search` is a URL-driven form (`?q`) that queries tests, materials and questions through `search.search` (PROPOSED); each result links to its owning screen. | `973fbec` |
| 10 | Sign-up / forgot / reset | `/sign-up`, `/forgot-password` and `/reset-password` call the PROPOSED `auth.signUp` / `auth.requestPasswordReset` / `auth.resetPassword` methods and share one honest "accounts backend not connected" state; `/sign-in` links to both self-service screens. An invalid reset token gets its own state. | `973fbec` |
| 11 | Messages | **No code change.** The human-thread surface already labels itself `المحادثات`, which is correct for what it opens; nothing was renamed. | — |
| 12 | Global Mohsen circle | Fixed circle on every screen, 52 × 52 px (above the 44 px minimum) with a visible focus ring — bottom-right in LTR, bottom-left in RTL. It opens a global `mohsen.ask` popup with loading, empty, error and answered states, closes on Escape, and keeps an honest refusal when nothing is grounded. | `0f50429` |
| 13 | Student home | `/student/home` shows profile, progress and attempts from `students.getProfile` / `getProgress` and `attempts.listForStudent`; `/` now redirects students here instead of the tests list. | `973fbec` |
| 14 | Connect-ready rule | Every new surface reads/writes through `BridgioApi` (mock adapter today, HTTP adapter already implemented), shows loading, empty and error states, and has no dead control and no fake success. | all |

---

## 2. Data layer

Three PROPOSED contract groups were added in `0664511`; all three are implemented in **both** adapters (`mock` and `http`), so switching the adapter is the only change needed to connect:

| Method | Endpoint | Status | Mock behaviour |
| --- | --- | --- | --- |
| `notifications.listForUser({ userId })` | `GET /users/:id/notifications` | PROPOSED, not connected | Derives every row from existing seed data: submitted attempts on the teacher's own tests (`submission`), the teacher's published tests (`published_test`), and message threads the teacher is in (`message`), newest first. Returns `[]` for any non-teacher role. |
| `search.search({ query, limit? })` | `GET /search` | PROPOSED, not connected | Filters the **existing** seed: the teacher's own tests by title, materials by title, questions by prompt. Diacritic/letter-variant-insensitive via the shared `normalizeText`. Empty query or non-teacher → empty result set. |
| `auth.signUp` / `auth.requestPasswordReset` / `auth.resetPassword` | `POST /auth/sign-up`, `/auth/password-reset`, `/auth/password-reset/confirm` | PROPOSED, not connected | Validates required input honestly (422 on empty fields), then always returns `{ status: 'unavailable', reason: 'accounts_backend_missing' }`. It never fakes acceptance. |

Query keys and options were added for notifications and search (`notificationsQueryOptions`, `searchQueryOptions`; the search query is disabled until the box has non-whitespace content). Seven mock-adapter tests cover the three groups (derivation, non-teacher empty sets, another-user refusal, diacritic-insensitive matching, blank-query behaviour, and the "never fakes success" accounts contract).

`package.json` and the lockfile are untouched; no dependency was added.

### Integration checklist (per LIVE_RULES §117–118)

| Screen | Adapter method(s) | Mentingo concept? | Mocked? |
| --- | --- | --- | --- |
| `/notifications` | `notifications.listForUser` | PROPOSED shape | Mock-derived from seed |
| `/search` | `search.search` | PROPOSED shape | Mock filters existing seed |
| `/sign-up` | `auth.signUp` | PROPOSED shape | Mock returns the defined unavailable result |
| `/forgot-password` | `auth.requestPasswordReset` | PROPOSED shape | Mock returns the defined unavailable result |
| `/reset-password` | `auth.resetPassword` | PROPOSED shape | Mock returns the defined unavailable result |
| `/student/home` | `students.getProfile`, `students.getProgress`, `attempts.listForStudent` | Existing contract | Mock seed |
| Global Mohsen popup | `mohsen.ask` | Existing contract | Mock keyword retriever |
| Messages (item 11) | `messages.*` | Existing contract | Unchanged mock |

No confirmed-Mentingo endpoint was invented, and no PROPOSED shape is presented as confirmed.

---

## 3. Verification gates

| Gate | Result |
| --- | --- |
| `npm test` | **150 passed (150)**, 17 files |
| `npm run typecheck` | **pass** (`tsc --noEmit`, no output) |
| `npm run build` | **pass**, exit 0 (vite client + Nitro SSR, then `tsc --noEmit`) |

Test count: Batch 4 ended at 143. The API commit adds 7 mock-adapter tests, landing on 150. No test file was removed.

Runtime checks from the capture run (dev servers, teacher `:3000` / student `:3001`, Playwright Chromium):

- Zero console errors and zero page errors across every captured route at 1920 px and 390 px.
- Zero horizontal overflow at either width on every route.
- Notifications page: **6 rows** for the teacher; the student role gets the role note and no rows.
- Search: submitting `التكامل` writes `?q=…` and a result link opens its owning test; a student sees the role note instead.
- Accounts screens: the shared unavailable state renders on submit; `/reset-password` with a token shows the reset form and an invalid token gets its own state.
- Student home: progress **67 %**, **2 units**, **2 attempts**, with working links to results and lists.
- Mohsen circle: computed **52 × 52 px**, `left: 16px` in RTL and `right: 16px` in LTR; grounded answer on the teacher, honest refusal on the student; Escape closes popup.
- Notification links preserve `?as` and `?lang`; sidebar utility link, header search link and the auth links all navigate; students see no notifications utility link.

---

## 4. Live behaviour highlights

- The dashboard keeps its draft/published split; the finish pass only changed dots, hover, spacing and the meta primitives.
- `/` sends the student to the new home page, and the student header shows the search entry with an honest role note rather than a broken empty box.
- The global circle is reachable on every screen (including the new pages) and its popup quotes real seed material for the teacher and refuses when no material matches.

---

## 5. Deviations and open items

1. **Item 11 needed no code change.** The human-thread surface already carries the `المحادثات` label, which matches what the button opens (human message threads); nothing was renamed, in line with the Batch 4 finding N1.
2. **Notifications and search are teacher-only in practice.** The mock returns an empty set for every other role, and each screen renders an honest role note rather than a partial index. The routes and strings still exist for all roles so the surfaces stay reachable.
3. **The global Mohsen popup sends an empty scope.** With no scope on the FAB, the adapter grounds only from the signed-in teacher's own material; therefore only the teacher sees a grounded answer and every other role gets the honest `not_grounded` refusal (accepted Batch 5 decision). The grounded state is captured on the teacher and the refusal on the student.
4. **`dir="auto"` on Mohsen Q&A text.** Question and answer paragraphs use `dir="auto"` to keep mixed-direction text readable, following the existing `ChatSurface` precedent. Adapter-supplied text on other surfaces was left as-is for consistency.
5. **`routeTree.gen.ts` was regenerated** by the Vite build and is committed, as required.
6. **Screenshots** were taken with Playwright Chromium against the local dev servers (`:3000` teacher, `:3001` student), 1920 × 1080 and 390 × 844, AR and EN, light and dark.
7. **No new dependency.** The existing React Aria / Lucide stack covers every new control.

---

## 6. Screenshots — `docs/screenshots`, prefix `batch5-` (35 files)

| File group | Shows |
| --- | --- |
| `batch5-notifications-{1920,390}-{ar,en}[-dark].png` | Notifications list, teacher scope, six derived rows |
| `batch5-notifications-390-ar-drawer.png` | Phone sidebar drawer with the teacher-only notifications entry |
| `batch5-notifications-390-ar-student-role.png` | Student role: honest "not available for this account" note |
| `batch5-search-{1920,390}-{ar,en}[-dark].png` | Search form and mixed test/material/question results |
| `batch5-signup-{1920,390}-{ar,en}[-dark].png` | Sign-up form and the shared accounts-unavailable state |
| `batch5-forgot-{1920-ar,390-en-dark}.png` | Forgot-password form and its unavailable state |
| `batch5-reset-{1920,390}-ar.png` | Reset-password form with a token |
| `batch5-reset-invalid-390-ar.png` | Invalid reset token: its own state |
| `batch5-student-home-{1920,390}-{ar,en}[-dark].png` | Student home: profile, progress, attempts |
| `batch5-mohsen-grounded-{1920-ar,390-en}.png` | Mohsen grounded answer (teacher scope) |
| `batch5-mohsen-refusal-{1920-ar-dark,390-ar}.png` | Mohsen honest refusal (no grounded material) |

The finish-pass fixes (items 1–7) are visible on every screen in these shots (no dots, wash-only hover, meta primitives) and are also exercised by the existing surfaces' own screenshots from earlier batches.

---

## 7. Deliberately NOT changed

- No real-time transport (Messages stays on the current `messages.*` seam).
- No real auth backend; the three account methods return the defined unavailable result and never a fake success.
- No retake (blocked on the BFF 409) and no support-contact channel.
- No Thmanyah font/token change; no KaTeX or math renderer.
- No contract change beyond the three named PROPOSED groups; no new dependency.
- No merge, no PR, no push to `main`.
- `.agents/` and `skills-lock.json` remain untracked and uncommitted.
