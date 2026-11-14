# BRIDGIO — Batch 5 Follow-up Delivery Note

**Date:** 2026-11-14
**Branch:** `feat/finish-frontend-followup`
**Base:** `ec831fc` (`origin/main`, after the Batch 5 merge, PR #33)
**Docs-first commit:** `95165db` — Muse's current `BRIDGIO-LIVE_RULES.md` copied into `docs/` before any code changed (byte-identical to the working copy Muse edited).
**Scope:** verify the first four follow-up items against `main`, then build items 5–15: pressed states, bidi isolation, gendered role labels, motion, Support, the Mohsen mascot FAB, the header account menu and sign-in, and the not-found screen. Branch pushed only — no PR, no merge.

`main` was inspected directly (not the previous delivery note): items 1–4 were **missing or partial** and are implemented here. None of the owner's locked decisions was reopened: Thmanyah is untouched, Support invents no contact channel and no success, and motion lives in tokens.

### Correction 2026-11-14 — header alignment (item 2)

The owner corrected item 2 after the first delivery: the wordmark was never meant to be centred on mobile, and the phone header had to return to a single row. The corrected state is what ships on this branch (fix commit `530319e`).

- **Phone (≤767.98 px):** one flex row, as on `main` — menu, wordmark at the inline-start, utilities. The two-row grid is removed. The account avatar stays visible (`.app-utility__button--account { display: inline-flex }`); it is the only route to sign out now that the rail's Profile item is gone.
- **Desktop (≥768 px):** `.app-header__inner` is `grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr)`, with the menu in column 1 (inline-start), the brand in column 2 and the utilities in column 3 (`justify-self: end`, auto margin removed). The two equal flexible columns put the brand at the exact horizontal centre of the header content width; explicit column assignments keep it centred when the menu is removed at ≥1024 px.
- **Unchanged:** desktop bar height (76 px, 74 px content + 2 px rule), wordmark widths (148 px at 768–1023, 136 px at ≥1024), artwork and fills, and the phone bar's 60 px minimum.
- **Phone width fit:** `main` carried three phone utilities; the finished header carries five (language, theme, search, chat, account). A 136 px wordmark plus five 44 px-tall controls plus the 44 px menu cannot share 390 px at `main`'s 16 px edge padding, so the phone row uses 8 px edge padding, 34 × 44 px icon-only controls and 4 px gaps. The wordmark then measures 136 px at a true 390 px viewport (126 px in the 380 px screenshot viewport, where the desktop scrollbar takes 10 px) and the row has no horizontal overflow. The wordmark's own width is not redefined.
- **Tablet width fit:** at 768–1023 px five labelled controls are wider than either side column of the centred grid, so the utilities are icon-only in that range and their labels return at ≥1024 px. Measured gap between the brand and the utilities at 768 px: 30 px; no overlap at any width from 320 to 1920.

---

## 1. Items 1–4: what `main` actually had

| # | Item | State in `main` (`ec831fc`) | What this branch adds |
| --- | --- | --- | --- |
| 1 | Branded scrollbars app-wide | No scrollbar rule existed in any stylesheet (`git grep scrollbar ec831fc -- src/styles` was empty); Chromium drew its default bar. | `followup.css` §1: thin bar, transparent track, maroon thumb (cream in dark theme), 10 px, 2 px paper border, pill radius, red thumb on hover. Applied to `html` and `*` so every scroll container is covered. |
| 2 | Centred wordmark in the desktop header | The `<768 px` band was a single flex row, and the ≥768 px row put the wordmark straight after the menu at the inline-start. | The phone keeps that single row (corrected 2026-11-14: no mobile centring, account avatar visible). From 768 px the inner bar is a three-column grid — menu inline-start, brand centre, utilities inline-end — so the wordmark sits at the exact centre of the header content width (measured 0.00 px offset at 768, 1024 and 1920, AR and EN). See the correction section above. |
| 3 | Classes as a table | `ClassList` rendered a `class-grid` of cards; no table, no scoreboard columns. | A real table: name, subject, grade, students, tests, status, action. The name and the action both link to the same class detail screen; the detail screen is untouched. Status is derived from the class's own tests (no tests → "No tests", any draft → "Drafts", all published → "Published"). No sorting. |
| 4 | Materials detail opens as a card | The expanded `materials.get` block was already inline in its row, but it was an unstyled text block, not a card. | The same expansion is now a framed card (cream, hairline border, radius) with the detail animation. The library stays a list, and the delete-confirmation block is unchanged. |

---

## 2. Items 5–15: what changed

| # | Item | Change | Commit |
| --- | --- | --- | --- |
| 5 | Visible `:active` states | Every interactive control gets a pressed response from one rule set: `--motion-press-scale` (0.98) plus a token wash. Primary buttons and the FAB also take `--bridgio-maroon-outline` and `filter: brightness(0.96)`; secondary/danger/ghost/icon buttons, rail links, utility links, chat threads, popup closes, account-menu items, quick-action cards, page-back, builder steps and icon steppers take `--disabled-overlay`; header menu/utility take `--band-hover` on the phone band; inline links take the wash without the scale; selection cards darken with `filter: brightness(0.98)` so their selected fill is not replaced. The FAB hover rule is `:hover:not(:active)` so hover can no longer override the press. | `cb134f1`, `1573bbf` |
| 6 | Bidi isolation | `<bdi>` around every user-facing value that can mix scripts: `MetaList` values (profile, assistant session, class detail meta), class-table cells, material title and meta items, student names and class names, chat thread titles/roles and message authors. Message bodies keep `dir="auto"`. The page itself stays RTL; only the value is isolated. | `df2bc68` |
| 7 | Gendered role label | `User.gender: UserGender \| null` added to the contract (PROPOSED); the teacher seed is `'female'`, every other seeded user is `null`. `content/roles.ts#roleLabel` returns the `rolesFemale` label only for `'female'`; `null` keeps the existing neutral string, so the UI never guesses. Applied on the Profile and Assistant session cards. English labels are identical in both sets. | `1d1e5a4`, `630d5c7` |
| 8 | Motion tokens | Tokens live in `tokens.css` (table below) and are applied to the sidebar drawer, chat and Mohsen popups, the FAB entrance, detail expansion and hover/focus transitions. `prefers-reduced-motion: reduce` removes the press scale, all animations and transitions, and the drawer transition. | `cb134f1` |
| 9 | Support page | `/support` + a rail entry. The form is real: local validation, a pending state (`aria-busy`, disabled button, "جارٍ الإرسال..."), and a PROPOSED `support.submitRequest` call. The mock validates and then always answers `{ status: 'unavailable', reason: 'support_backend_missing' }`; the screen says the request was **not** sent, keeps the text in the form, and states that replies arrive once the real backend is connected. No contact address, no fake success. | `1d1e5a4`, `e35d4ce` |
| 10 | Mohsen FAB | The button contains the mascot image (`public/brand/mohsen-fab.png`, cropped from the top-right waving pose of the reactions sheet), `object-fit: cover`, circular crop, `alt=""` because the button carries the label. A capture-phase `keydown` listener closes the popup on the first Escape even while focus is in the question field; the field has `autoFocus`. | `4064d13` |
| 11 | Avatar-only account button | The header account control is the person icon in the same 44 px circle, no visible label. `aria-label`, `title`, `aria-haspopup`, `aria-expanded` and `aria-controls` are kept. | `cbdaa09` |
| 12 | Profile removed from the rail | The rail item is gone; Profile is reached from the account menu. (The rail slot now holds Support.) | `e35d4ce` |
| 13 | Account menu and sign-in | The avatar opens a menu: signed in → Profile, Sign out; signed out → Sign in. Sign out calls `auth.signOut`, clears and invalidates the session query, and navigates to `/sign-in`. The sign-in form calls `auth.signIn`: success lands on the role home the backend returned, failure shows the adapter's own message (`isApiError`), pending shows "جارٍ الدخول...". Menus close on Escape, outside click, and navigation. | `cbdaa09` |
| 14 | `?as=` role preview | Verified on the dev server: `?as=student` → student home, `?as=parent` → parent progress, `?as=assistant` → assistant home; each switches the rail and keeps `as` on links. Documented below: deployed previews need `VITE_MOCK_SESSION=none`, otherwise the session is baked into the build. | — |
| 15 | Honest not-found | See §5. Title, one short line, and a link to the role home (the `/` route redirects by `?as`). Never a blank shell. | `cb134f1` |

---

## 3. Motion tokens

Defined once in `src/styles/tokens.css`:

| Token | Value | Used by |
| --- | --- | --- |
| `--motion-duration-fast` | `120ms` | hover/focus and press feedback |
| `--motion-duration-base` | `180ms` | popup surfaces, material detail expansion |
| `--motion-duration-slow` | `250ms` | sidebar drawer (locked timing) |
| `--motion-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | hover/focus, press, drawer, detail |
| `--motion-ease-emphasis` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | popup and FAB entrance |
| `--motion-press-scale` | `0.98` | the single press transform |

Measured in the running app (Chromium):

- Sidebar drawer: `transition-duration: 0.25s, 0s` (transform, then visibility delay).
- Pressed primary button: `transform: matrix(0.98, 0, 0, 0.98, 0, 0)`, `filter: brightness(0.96)`.
- With `prefers-reduced-motion: reduce` emulated: button `transition-duration: 1e-05s`, sidebar `0s`, pressed transform `none`.

Static screenshots cannot show a transition mid-flight; the screenshots below show the animated surfaces in their open state, and the numbers above are the measured values.

---

## 4. Support: interface only

| Piece | Detail |
| --- | --- |
| Contract | `support.submitRequest(input) → SupportResult` (PROPOSED, not connected), in `src/api/types/support.ts`. |
| Result shape | `{ status: 'accepted' }` or `{ status: 'unavailable'; reason: 'support_backend_missing' }`. |
| Mock | Validates all four fields (422 on empty), otherwise always returns `unavailable`. |
| HTTP adapter | `POST /support/requests` — wired, but no backend exists; a real endpoint must return `unavailable` until it does. |
| UI states | Required-field validation, pending, error, `unavailable`, and an `accepted` branch that no mock path reaches. |
| Honesty rules | No contact address is invented, no reply is faked, and the note says replies arrive only after the backend is connected. |

---

## 5. The not-found bug and the fix

The root `notFoundComponent` / `errorComponent` used to wrap their screen in `ShellDocument` *again*, inside the root's own `<main>`. That produces `<html>` inside `<main>`; the browser drops the nested document element and leaves an empty shell — the "blank page" on unknown URLs.

`RootComponent` already owns the document and the shell, so the two components now return only the screen. The screen is `PageHero`-free by design: title, one line, and a link to `/` (the role home for the `?as` role, or the sign-in flow when there is no session).

---

## 6. Role preview and the Vercel session setting (item 14)

`?as=student|parent|assistant` changes the **preview role**: the rail, the role-scoped surfaces and the `as` carried by every link. It does not change the seeded session.

The session comes from `VITE_MOCK_SESSION` (`teacher` by default, or `student` / `assistant` / `parent` / `none`). For the deployed preview, set **`VITE_MOCK_SESSION=none`**: the build then starts signed out, the account menu shows **Sign in**, and the sign-in form is testable. With any other value the session is baked into the build, and sign-out lasts only until a reload.

Seed accounts accept any non-empty password: `mona.teacher@bridgio.test` (teacher), `sara.student@bridgio.test` (student), `adel.parent@bridgio.test` (parent), `hala.assistant@bridgio.test` (assistant). `.env.example` now documents the full set and the `none` recommendation.

---

## 7. Verification gates

| Gate | Result |
| --- | --- |
| `npm test` | **153 passed (153)**, 18 files |
| `npm run typecheck` | **pass** (`tsc --noEmit`, no output) |
| `npm run build` | **pass**, exit 0 (vite client + Nitro SSR, then `tsc --noEmit`) |

The follow-up adds one test file (`src/content/roles.test.ts`, three cases: female label, null keeps neutral, male keeps neutral) and one mock-adapter expectation (`support.submitRequest` added to `EXPECTED_METHODS`). Batch 5 ended at 150; nothing was removed.

Runtime checks (dev server, Chromium, 1920 / 1440 / 390):

- Header: the 390 px phone bar is one row (five controls, wordmark, menu) with no horizontal overflow (document width = viewport width); the desktop wordmark centre equals the header content centre exactly (0.00 px offset) at 768, 1024, 1280 and 1920, AR and EN; the ≥1024 px bar stays 76 px tall with the 136 px wordmark.
- Classes table: document width 390 px, no page-level horizontal overflow; the table itself scrolls inside its wrapper (864 px content in a 355 px wrapper) with the branded scrollbar.
- Support: empty form keeps the button disabled; a filled form shows the pending label and then the "request was not sent" state; the text stays in the fields.
- Sign out lands on `/sign-in`; the signed-out account menu shows Sign in; signing in as the teacher lands on the teacher dashboard; an unknown email shows the adapter message.
- `prefers-reduced-motion: reduce` removes transitions, animations and the press scale (values above).

---

## 8. Screenshots

All under `docs/screenshots/`. Each pair of `-rest` / `-pressed` images uses the identical crop so the press difference is comparable.

| Item | Files |
| --- | --- |
| 1. Scrollbars (chat, RTL) | `followup-scrollbar-chat-1920-ar-dark.png`, `followup-chat-popup-1920-ar-dark.png` |
| 2. Header (single-row phone, centred desktop wordmark) | `followup-wordmark-390-ar-light.png`, `followup-wordmark-390-en-dark.png`, `followup-wordmark-1920-ar-light.png`, `followup-wordmark-1920-en-light.png`, `followup-wordmark-1024-ar-light.png`, `followup-wordmark-1024-en-light.png` |
| 3. Classes table | `followup-classes-table-1920-ar-light.png`, `followup-classes-table-390-ar-light.png`, `followup-classes-table-1920-en-dark.png`, `followup-classes-table-390-en-dark.png` |
| 4. Materials card | `followup-material-card-1920-ar-light.png`, `followup-material-card-390-en-light.png` |
| 5. Pressed states | `followup-pressed-primary-rest.png` / `-pressed.png`, `followup-pressed-nav-rest.png` / `-pressed.png`, `followup-pressed-fab-rest.png` / `-pressed.png`, `followup-pressed-quick-rest.png` / `-pressed.png` |
| 6. Bidi meta rows | `followup-bidi-meta-1920-ar-light.png` |
| 7. Gendered role label | `followup-role-label-1920-ar-light.png`, `followup-role-label-1920-ar-dark.png` |
| 8. Motion surfaces | `followup-motion-sidebar-390-ar.png`, `followup-motion-chat-popup-1440-ar.png` |
| 9. Support | `followup-support-form-1920-ar-light.png`, `followup-support-pending-1920-ar-light.png`, `followup-support-unavailable-1920-ar-light.png`, `followup-support-390-en-dark.png` |
| 11–13. Account menu / sign-in | `followup-account-menu-1440-ar.png`, `followup-signin-error-1440-ar.png` |
| 15. Not found | `followup-notfound-390-en-dark.png` |

---

## 9. What was not built (unchanged from the brief)

- No real-time transport, notifications or external support channel.
- No real auth backend: sign-in still runs through the adapter and the mock; the self-service account screens keep their honest "accounts backend not connected" state.
- No retake flow, no Thmanyah content, no KaTeX.
- No new dependency, no new colour, no new font. The mascot is a supplied brand asset.

---

## 10. Integration checklist

| Surface | Adapter method(s) | Status |
| --- | --- | --- |
| `/support` | `support.submitRequest` | PROPOSED, not connected; mock always `unavailable` |
| Header account menu | `auth.session`, `auth.signOut` | Existing contract, mock |
| `/sign-in` | `auth.signIn` | Existing contract, mock |
| Classes table | `classrooms.listForTeacher`, `tests.listForTeacher` | Existing contract, mock |
| Materials detail | `materials.list`, `materials.get` | Existing contract, mock |
| Role label | `auth.session → user.gender` | PROPOSED field, mock seed |
| Mohsen FAB | `mohsen.ask` | Existing contract, mock |