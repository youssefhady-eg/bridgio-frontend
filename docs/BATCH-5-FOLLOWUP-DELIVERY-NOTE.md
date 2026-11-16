# BRIDGIO — Batch 5 Follow-up Delivery Note

**Date:** 2026-11-14 (updated 2026-11-16 — see the live-gate, round-2, round-3 and round-4 corrections below)
**Branch:** `feat/finish-frontend-followup`
**Base:** `ec831fc` (`origin/main`, after the Batch 5 merge, PR #33)
**Docs-first commit:** `95165db` — Muse's current `BRIDGIO-LIVE_RULES.md` copied into `docs/` before any code changed (byte-identical to the working copy Muse edited).
**Scope:** verify the first four follow-up items against `main`, then build items 5–15: pressed states, bidi isolation, gendered role labels, motion, Support, the Mohsen mascot FAB, the header account menu and sign-in, and the not-found screen. Branch pushed only — no PR, no merge.

`main` was inspected directly (not the previous delivery note): items 1–4 were **missing or partial** and are implemented here. None of the owner's locked decisions was reopened: Thmanyah is untouched, Support invents no contact channel and no success, and motion lives in tokens.

### Correction 2026-11-14 — header alignment (item 2)

The owner corrected item 2 after the first delivery: the wordmark was never meant to be centred on mobile, and the phone header had to return to a single row. The corrected state is what ships on this branch (fix commit `530319e`).

- **Phone (≤767.98 px):** one flex row, as on `main` — menu, wordmark at the inline-start, utilities. The two-row grid is removed. The account avatar stays visible (`.app-utility__button--account { display: inline-flex }`); it is the only route to sign out now that the rail's Profile item is gone.
- **Desktop (≥768 px):** `.app-header__inner` is `grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr)`, with the menu in column 1 (inline-start), the brand in column 2 and the utilities in column 3 (`justify-self: end`, auto margin removed). The two equal flexible columns put the brand at the exact horizontal centre of the header content width; explicit column assignments keep it centred when the menu is removed at ≥1024 px. **(Withdrawn by the 2026-11-16 round-2 correction below: the desktop wordmark is never centred.)**
- **Unchanged:** desktop bar height (76 px, 74 px content + 2 px rule), wordmark widths (148 px at 768–1023, 136 px at ≥1024), artwork and fills, and the phone bar's 60 px minimum.
- **Phone width fit:** `main` carried three phone utilities; the finished header carries five (language, theme, search, chat, account). A 136 px wordmark plus five 44 px-tall controls plus the 44 px menu cannot share 390 px at `main`'s 16 px edge padding, so the phone row uses 8 px edge padding, 34 × 44 px icon-only controls and 4 px gaps. The wordmark then measures 136 px at a true 390 px viewport (126 px in the 380 px screenshot viewport, where the desktop scrollbar takes 10 px) and the row has no horizontal overflow. The wordmark's own width is not redefined.
- **Tablet width fit:** at 768–1023 px five labelled controls are wider than either side column of the centred grid, so the utilities are icon-only in that range and their labels return at ≥1024 px. Measured gap between the brand and the utilities at 768 px: 30 px; no overlap at any width from 320 to 1920.

### Correction 2026-11-16 — live-gate fixes

The live gate on the follow-up branch found three fails and two new defects. All five are fixed on the same branch (`feat/finish-frontend-followup`), pushed only — no PR, no merge. The header follows the owner's 2026-11-14 correction: centring is desktop, never mobile.

| # | Live-gate finding | Fix | Commit |
| --- | --- | --- | --- |
| 1a | Phone header was a two-row grid (owner correction) | `followup.css` §2 phone band is one flex row again, exactly as `main`: menu + wordmark at the inline-start + utilities. `.app-utility__button--account { display: inline-flex }` keeps the avatar visible (it is the only route to sign out). Wordmark size untouched. | `530319e` |
| 1b | Desktop wordmark not centred | From 768 px `.app-header__inner` is `grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr)`; menu in column 1, brand in column 2 (`justify-self: center`), utilities in column 3 (`justify-self: end`, auto margin removed). 76 px bar and 136 px wordmark unchanged. | `530319e` |
| 1c | Header clipped at 390 px (avatar off-screen, chat icon cut) | Phone row uses 8 px edge padding, 34 × 44 px icon-only controls and 4 px gaps. Measured at 390 px in AR and EN: five utilities, none clipped against the header content box, account avatar fully visible, no page-level horizontal overflow. | `530319e` |
| 2 | Dashboard heading still the masculine string; `/profile` showed the masculine form beside "الدور: المعلمة" | `content/roles.ts#dashboardLabel` mirrors `roleLabel`: the heading (`h1`), the document title and the sidebar dashboard label all follow `user.gender`. `/profile` now shows "لوحة المعلمة" in the rail. A null (or male) gender keeps the existing string, so there is no regression. | `b3d4914` |
| 3 | No contact-options area on `/support` | A "قنوات التواصل" section is added, rendered honestly for the missing backend: no channel is connected, and it states that replies arrive with the real service. No email, WhatsApp or phone number is invented. The form and its states are unchanged. | `94f393b` |
| 4 | Help text pointed at the old sidebar Profile item | The account-session step and the two "find your way around" lines (ar + en) now point at the account menu in the top bar. Draft Arabic; owner reviews. | `aa5daa0` |

### Correction 2026-11-16 (round 2) — owner follow-up

A second owner pass on the same branch reopened the header, the sidebar, the account screens, the Mohsen mascot and the desktop sizing, and asked for the Help/Guide dashboard label to follow the session. Each landed as its own fix commit; the branch is still pushed only (no PR, no merge).

| # | Round-2 finding | Fix | Commit |
| --- | --- | --- | --- |
| R1 | Desktop wordmark still centred (owner withdrew the 2026-11-14 centring) | One flex row at every width again: the wordmark at the inline-start, the utilities pushed to the inline-end. `.app-header__inner` loses `max-width: 90rem; margin: 0 auto`, so the header spans the same box as the app body below it, and its inline-start padding is 70 px (12 nav pad + 14 link pad + 32 icon chip + 12 gap) — the wordmark's inline-start edge lines up with the sidebar nav **label** column at 1024 / 1440 / 1920, AR and EN. The phone keeps its single row and the 390 px fit. | `56871e2` |
| R2 | Sidebar widths fixed in px; the collapse toggle could scroll away | Expanded column and sidebar are `clamp(200px, 18.89vw, 272px)`; the collapsed rail is `clamp(64px, 6.11vw, 88px)` — the design values at the 1440 px base, floored so neither rail disappears on a small desktop. The sidebar box no longer scrolls: the nav is the scroll container and the foot, with the toggle, is pinned to the bottom edge (verified with a nav taller than the viewport). The 250 ms collapse animation is unchanged. | `7a97fea` |
| R3 | Account screens rendered inside the app shell | `/sign-in`, `/sign-up`, `/forgot-password` and `/reset-password` render outside the shell — no header, sidebar, chat popup or Mohsen button — as one centred `.auth-main` column on the cream background. Sign-in mock behaviour is unchanged. | `c49fca5` |
| R4 | Mohsen sat on a red fill and reused a raster asset | The button and the new popup header avatar use `public/brand/mohsen-wave.svg`, the transparent waving pose. Both sit on the brand paper, never on red; `public/brand/mohsen-fab.png` is removed. Escape still closes the popup on the first press. **(Superseded in round 3 by the supplied PNG set and a fixed cream plate — see R3-2.)** | `5643923` |
| R5 | Desktop px values did not scale | A vw/clamp pass over the ≥ 1024 px values (table below): each desktop size becomes `clamp(min, Xvw, design)` with `X = design / 1440 * 100`. Covers the type scale, the header height, the wordmark, the sidebar and the Mohsen button/popup/avatar. Mobile < 768 px values are untouched; hairlines and shadows stay px. | `d393e79` (+ `56871e2`, `7a97fea`, `5643923`) |
| R6 | Help/Guide named the dashboard with the masculine string | The Help link and the teacher Guide step now use the new `dashboardLinkLabel`, which follows the session gender ("لوحة المعلمة" / "لوحة المعلم") and falls back to the neutral "لوحة التحكم" ("Dashboard") when there is no session. The heading, document title and rail keep `dashboardLabel`. | `eaaff2d` |

#### Round-2 fluid (vw) table

Every value is the design value at the 1440 px base, so `X = value / 1440 * 100`:

| Surface | Value at 1440 px | Fluid rule |
| --- | --- | --- |
| `--header-h` | 76 px | `clamp(64px, 5.28vw, 76px)` |
| Sidebar column (expanded) | 272 px | `clamp(200px, 18.89vw, 272px)` |
| Sidebar rail (collapsed) | 88 px | `clamp(64px, 6.11vw, 88px)` |
| Wordmark (light and dark) | 136 px | `clamp(112px, 9.44vw, 136px)` |
| Mohsen button | 52 px | `clamp(44px, 3.61vw, 52px)` |
| Mohsen popup avatar | 40 px | `clamp(32px, 2.78vw, 40px)` |
| Mohsen popup panel | 544 px (32 rem) | `min(clamp(20rem, 37.78vw, 32rem), calc(100vw - 2rem))` |
| `h1` | 34 px | `clamp(28px, 2.36vw, 34px)` |
| `h2` | 26 px | `clamp(22px, 1.81vw, 26px)` |
| `h3` | 20 px | `clamp(18px, 1.39vw, 20px)` |
| Body | 17 px | `clamp(16px, 1.18vw, 17px)` |
| Body small | 15 px | `clamp(14px, 1.04vw, 15px)` |
| Label | 16 px | `clamp(15px, 1.11vw, 16px)` |

`--space-*` stays px on purpose: the design value is the same on mobile and desktop, so there is nothing to scale. Hairline borders/outlines and shadow offsets/blur also stay px (they are not layout widths).

#### Sidebar 200 px floor and label wrap

The owner's explicit 200 px minimum is kept rather than raised. Below roughly 1240 px the longer English labels used to wrap to two lines; **round 3 shortened the four that did** (label table in the round-3 section), so every label now holds one line at 1024 px in both languages. The rows keep a locked `min-height: 48px` and the sidebar stays `overflow: hidden` with the nav scrolling, so nothing clips.

### Correction 2026-11-16 (round 3) — owner follow-up

A third owner pass asked for six corrections on the same branch: the theme switch inside the account menu, a dark-mode-legible Mohsen, a slightly larger popup, shorter English sidebar labels, a wordmark aligned to the collapsed rail, and one step smaller sidebar type. Each landed as its own fix commit; the branch is still pushed only (no PR, no merge).

**Docs first.** `docs/BRIDGIO-LIVE_RULES.md` is byte-identical to Muse's current copy at `Projects\bridgio-frontend\docs\BRIDGIO-LIVE_RULES.md` (SHA-256 `2808E774EDB287103CBBC480BF88E656895D889C6E63B6253E91EB0A2BEA28DB`, 91,342 bytes), so there was no delta to commit in round 3. The file is untouched.

| # | Round-3 finding | Fix | Commit |
| --- | --- | --- | --- |
| R3-1 | Theme switch only in the header | The account menu (header avatar) gains a **Theme** row between Profile and Sign out. It reads and writes the same `useTheme` state as the header sun/moon control, so either control moves both, and the choice still persists in `bridgio-theme`. The row is a `menuitemcheckbox` with `aria-checked`, and its small switch shows the live theme (off = light, on = dark). The header toggle stays. | `8ffa833` |
| R3-2 | Mohsen was invisible in dark mode | Muse's prepared assets (the cleaner v2 pass of `chatgpt-mohsen-pack.zip`) are now in `public/brand/`: transparent 512 × 512 `mohsen-waving.png` on the floating button and the popup header, plus `mohsen-thinking.png` (answer in flight), `mohsen-sleeping.png` (idle), `mohsen-happy.png` (answered) and `mohsen-confused.png` (no result) as the popup's state art; waving remains the fallback. No re-crop from the sheet and no edit to the artwork. The button circle, popup avatar and state plate use the new `--bridgio-paper-fixed` token — the brand paper, deliberately **outside** the dark-theme swap — so the cream disc and the dark outline stay in both themes; pressing no longer darkens the circle. `object-fit: contain` keeps the character uncropped at 40 / 52 / 72–88 px. | `9b6b108` |
| R3-3 | Popup slightly bigger | The desktop panel floor rises 20rem → 22rem and the design width stays 32rem: `min(clamp(22rem, 37.78vw, 32rem), calc(100vw - 2rem))`. The middle term stays 37.78vw rather than 35.56vw because this app's desktop root is 17 px: 32rem = 544 px, and 544 / 1440 = 37.78vw. 35.56vw equals 32rem only at a 16 px root and would have shrunk the panel to 512 px at 1440 px. Measured at 1440 px: **543.74 px = 32.00rem**. | `c73f287` |
| R3-4 | English sidebar labels wrapped at the 200 px floor | Shortened the four labels that wrapped; Arabic already fitted and is unchanged (table below). The dashboard rail label now comes from `dashboard.navTitle` / `navTitleFemale` through `dashboardNavLabel`, so the sidebar says "Dashboard" while the page heading, document title and Help/Guide keep "Teacher dashboard". | `e0c3b31` |
| R3-5 | Wordmark aligned only in the expanded sidebar | Expanded keeps the 70 px label column. Collapsed now aligns to the icon chip's inline-start edge — the only lit line in the rail — which is `rail / 2 − 16 px`: 16 px at 1024, 28 px at 1440 / 1920. `AppShell` passes the rail state to the header (`app-header--sidebar-collapsed`), and the padding animates with the rail's 250 ms transition. Measured on the chip edge in AR and EN at all three widths. | `9d1f888` |
| R3-6 | Sidebar type one step smaller | The desktop nav rows move from `--font-body-size` (16 / 16.99 / 17 px) to `--font-label-size` (15 / 15.98 / 16 px): −1 px at the minimum, design and maximum, and the same size as the pinned collapse toggle. The utility rows take the same size instead of inheriting body copy. | `bc0acf2` |

#### Round-3 label changes (owner review)

Old → new, both languages. Arabic is shown for completeness; none of it changed.

| Nav item | English before | English after | Arabic before | Arabic after |
| --- | --- | --- | --- | --- |
| Dashboard (teacher) | Teacher dashboard | **Dashboard** | لوحة المعلم / لوحة المعلمة | لوحة المعلم / لوحة المعلمة *(unchanged)* |
| Question bank | Question bank | **Questions** | بنك الأسئلة | بنك الأسئلة *(unchanged)* |
| Material library | Material library | **Materials** | مكتبة المواد | مكتبة المواد *(unchanged)* |
| Parent → progress | Child's Progress | **Progress** | تقدّم الابن | تقدّم الابن *(unchanged)* |

The gender rule is unchanged: "لوحة المعلمة" appears only when the backend supplies `gender: 'female'`; a null or male gender keeps "لوحة المعلم". "Teacher dashboard" remains the H1 and document title.

**Round 4 supersedes the rail part of the Dashboard row:** the sidebar label is now the neutral **لوحة التحكم** (Arabic) / **Dashboard** (English) for every gender. The gendered **لوحة المعلمة** / **لوحة المعلم** remains only in the dashboard `h1`, the document title and Help/Guide (`dashboardLabel` / `dashboardLinkLabel`).

#### Round-3 measurements (dev server, Chromium)

- **Theme row:** menu order is Profile / Theme / Sign out; the switch is off in light and on in dark; clicking it sets `data-theme="dark"`, writes `bridgio-theme=dark`, and a reload keeps dark. The header sun/moon control and the row stay in step.
- **Mohsen:** button background `rgb(255, 246, 232)` in light **and** dark; popup avatar and state plate the same; button `src=/brand/mohsen-waving.png`, popup header the same, state plate `mohsen-sleeping.png` when idle. Both images `object-fit: contain`.
- **Popup:** 543.74 px at 1440 px = 32.00rem (viewport 1440, root 16.992 px).
- **Labels:** at 1024 px the teacher, student and parent rails render zero wrapped labels in EN and AR; label size 15 px at 1024, 15.98 px at 1440, 16 px at 1920.
- **Wordmark:** measured from the sidebar's inline-start edge — expanded 70 px (label column) at all widths; collapsed 16 px at 1024 and 28 px at 1440 / 1920, equal to the icon chip's edge in both directions.

Round 4 supersedes two of the round-3 results: the rail dashboard label is now neutral in both languages (R4-2), and the wordmark is aligned by its **visible glyph** edge rather than its element edge (R4-6). The other round-3 outcomes stand.

### Correction 2026-11-16 (round 4) — owner follow-up

A fourth owner pass reopened six items: interface-settings spacing, the gender of the sidebar dashboard label, the header search's navigation, the header theme control, guest access on sign-in, and the wordmark alignment. All six land as one fix commit (`a4a1316`) because they share the header, the central strings file and `followup.css`; the delivery note and the round-4 screenshots are a second commit. The branch is still pushed only (no PR, no merge).

**Docs first — deferred.** No updated `BRIDGIO-LIVE_RULES.md` from Muse was available on this machine in round 4, so there was no new byte-identical copy to commit before the code. The owner chose to proceed with the code and sync the rules file in a separate commit once the updated copy is supplied. The copy already under `docs/` (`95165db`, SHA-256 `2808E774…28DB`, 91,342 bytes) is untouched.

| # | Round-4 finding | Fix | Commit |
| --- | --- | --- | --- |
| R4-1 | Interface-settings rows stretched: the fixed 7 rem label column left a large dead gap between the label and its control | `MetaList` takes an optional `className`; `/profile` passes `summary-list--settings`, which sets the label column to `max-content`, centres the label/control pair and caps the list at 34 rem. The shared `.summary-list` used by tests, classes and students is unchanged. | `a4a1316` |
| R4-2 | Sidebar dashboard label followed the session gender | The rail uses one neutral label per language — Arabic **لوحة التحكم**, English **Dashboard**. Gender remains only in the dashboard `h1` and the document title (`dashboardLabel`); Help/Guide keep `dashboardLinkLabel`. `dashboardNavLabel`, `dashboard.navTitle` / `navTitleFemale` and their tests are removed, and the sidebar session query is enabled for the assistant only. | `a4a1316` |
| R4-3 | Clicking the header search left the screen for `/search` | A new `HeaderSearch` opens an in-place dropdown over the same PROPOSED `search.search` seam. Selecting a result navigates; a "view all results" link opens `/search?q=` for the full list. It closes on an outside click, Escape (focus returns to the control) and any navigation, and caps at six inline results. No new API surface. | `a4a1316` |
| R4-4 | Theme toggle still sat in the header | The header sun/moon control is removed. The account menu's Theme row (round 3) is now the only theme switch. The header keeps language, search, messages and account. | `a4a1316` |
| R4-5 | Sign-in offered no guest path | "Continue as a guest" clears the mock session (`api.auth.signOut()`), sets the session query to null and lands on `/teacher/dashboard` with the real no-session state. No fake account and no credentials are created. | `a4a1316` |
| R4-6 | Wordmark aligned by its element box, not the painted glyph | The artwork carries ~13.2 % empty space on its inline-start and ~1.4 % on its inline-end. `.app-header__brand` (not the `<img>`, which would shrink under `max-width: 100%`) takes a direction-aware negative `margin-inline-start` of that inset, scoped to ≥1024 px, so the *painted* edge lands on the nav label column (expanded, 70 px) and on the icon chip's inline-start edge (collapsed, 16 px at 1024, 28 px at 1440 / 1920). | `a4a1316` |

#### Round-4 measurements (dev server, Chromium)

- **Settings rows:** AR `26.06px 535.94px`, EN `58.45px 503.55px`; label→control gap **16 px** in both; `.summary-list--settings` width 578 px (cap 34 rem).
- **Sidebar label:** the AR rail's first item reads **لوحة التحكم**, while the dashboard `h1` stays **لوحة المعلمة** and the document title is **لوحة المعلمة — Bridgio**. The EN rail's first item reads **Dashboard**.
- **Inline search:** clicking the control leaves the URL unchanged (`/teacher/dashboard?as=teacher&lang=ar`); the panel lists **6** matching results and shows the "اعرض كل النتائج" / "View all results" link.
- **Theme:** `.app-utility__button--theme` is absent; the account menu lists Profile / Theme / Sign out and the switch reads the live theme.
- **Guest:** "الدخول كزائر" / "Continue as a guest" lands on `/teacher/dashboard?as=teacher&lang=…` with the "لا توجد جلسة معلم" / "No teacher session" state.
- **Wordmark:** each cell is the visible glyph edge / the sidebar edge it must match (nav label column when expanded, icon chip when collapsed):

  | Width | EN expanded | EN collapsed | AR expanded | AR collapsed |
  | --- | --- | --- | --- | --- |
  | 1024 | 70.0 / 70 | 16.0 / 15.6 | 944.3 / 943.6 | 998.3 / 998 |
  | 1440 | 70.1 / 70 | 28.0 / 27.6 | 1360.5 / 1359.6 | 1402.5 / 1402 |
  | 1920 | 70.0 / 70 | 28.1 / 27.6 | 1840.5 / 1839.6 | 1882.5 / 1882 |

  The geometry is exact; the ~0.4–0.9 px residual is the difference between the 1 px alpha-scan threshold used to measure and the ~1.9 px geometric inset used in CSS, not a layout offset.

---

## 1. Items 1–4: what `main` actually had

| # | Item | State in `main` (`ec831fc`) | What this branch adds |
| --- | --- | --- | --- |
| 1 | Branded scrollbars app-wide | No scrollbar rule existed in any stylesheet (`git grep scrollbar ec831fc -- src/styles` was empty); Chromium drew its default bar. | `followup.css` §1: thin bar, transparent track, maroon thumb (cream in dark theme), 10 px, 2 px paper border, pill radius, red thumb on hover. Applied to `html` and `*` so every scroll container is covered. |
| 2 | Centred wordmark in the desktop header | The `<768 px` band was a single flex row, and the ≥768 px row put the wordmark straight after the menu at the inline-start. | The phone keeps that single row (corrected 2026-11-14: no mobile centring, account avatar visible). From 768 px the inner bar was a three-column grid that centred the brand (measured 0.00 px offset at 768, 1024 and 1920, AR and EN) — **withdrawn in round 2**: one flex row at every width, the wordmark at the inline-start, its edge aligned with the sidebar nav label column at a fixed 70 px inline-start padding. See the round-2 correction above. |
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
| 10 | Mohsen FAB | The button contains the mascot image (originally `public/brand/mohsen-fab.png`, **replaced in round 2** by the transparent `public/brand/mohsen-wave.svg`), `object-fit: cover`, circular crop, `alt=""` because the button carries the label. A capture-phase `keydown` listener closes the popup on the first Escape even while focus is in the question field; the field has `autoFocus`. | `4064d13`, `5643923` |
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
| `npm test` | **160 passed (160)**, 18 files |
| `npm run typecheck` | **pass** (`tsc --noEmit`, no output) |
| `npm run build` | **pass**, exit 0 (vite client + Nitro SSR, then `tsc --noEmit`) |

The follow-up adds one test file (`src/content/roles.test.ts`: three `roleLabel` cases — female label, null keeps neutral, male keeps neutral — three `dashboardLabel` cases for the 2026-11-16 correction, and four `dashboardLinkLabel` cases for round 2 — female, non-female, no session, and English) and one mock-adapter expectation (`support.submitRequest` added to `EXPECTED_METHODS`). Batch 5 ended at 150; nothing was removed. Round 2 takes the count from 156 to 160. Round 3 adds two `dashboardNavLabel` cases (gendered Arabic, one-word English for every gender) and takes the count from 160 to 162. Round 4 removes those two cases together with the `dashboardNavLabel` helper, returning the count to **160**; no other test changed.

Runtime checks (dev server, Chromium, 1920 / 1440 / 390):

- Header: the 390 px phone bar is one row (five controls, wordmark, menu) with no horizontal overflow (document width = viewport width); the ≥1024 px bar stays 76 px tall (64 px at 1024, 76 px at 1440+). Round 2 withdrew the desktop centring: the wordmark is at the inline-start and its inline-start edge equals the sidebar nav label column at 1024 / 1440 / 1920, AR and EN (both edges measured at the same x; the nav label column starts at 70 px because the header padding is fixed while the nav's internal paddings stay px).
- Live-gate recheck (2026-11-16): at 390 px in AR and EN the five utility buttons sit inside the header content box (none clipped, avatar visible) and `scrollWidth == clientWidth`; the desktop wordmark offset is 0.00 px at 1024 and 1920 in both languages; the dashboard `h1` and document title read "لوحة المعلمة" for the female seed teacher; `/profile` and every teacher screen show "لوحة المعلمة" in the rail **(superseded in round 4: the rail now reads "لوحة التحكم")**; `/support` renders the "قنوات التواصل" section with no channel connected; the Help account-session step reads "افتح الملف الشخصي من قائمة الحساب في الشريط العلوي."
- Classes table: document width 390 px, no page-level horizontal overflow; the table itself scrolls inside its wrapper (864 px content in a 355 px wrapper) with the branded scrollbar.
- Support: empty form keeps the button disabled; a filled form shows the pending label and then the "request was not sent" state; the text stays in the fields.
- Sign out lands on `/sign-in`; the signed-out account menu shows Sign in; signing in as the teacher lands on the teacher dashboard; an unknown email shows the adapter message.
- `prefers-reduced-motion: reduce` removes transitions, animations and the press scale (values above).

Round-2 runtime checks (dev server, Chromium, 1024 / 1440 / 1920 / 390, AR and EN):

- Wordmark alignment: the wordmark's inline-start edge equals `.app-sidebar__label`'s inline-start edge at 1024 (70 px / 858 px in RTL), 1440 and 1920; header height 64 px at 1024, 76 px at 1440+. The header padding is 70 px 32 px at every desktop width.
- Sidebar: expanded column 200 px at 1024 and 272 px at 1440 / 1920; collapsed rail 64 px at 1024 and 88 px at 1440 / 1920 (`.app-body--collapsed` is applied and the computed track matches). With a 420 px-tall viewport the nav scrolls (`scrollHeight > clientHeight`) while the foot's bottom stays at the viewport bottom (toggle pinned, sidebar `overflow: hidden`). `document.scrollWidth == clientWidth` at 390 / 768 / 1024 / 1440 / 1920.
- Auth isolation: `/sign-in`, `/sign-up`, `/forgot-password` and `/reset-password` each render `.auth-main` with no `.app-header`, `.app-sidebar`, `.mohsen-fab` or chat popup, and no horizontal overflow.
- Mohsen: the button background is `rgb(255, 246, 232)` (paper, not red); `.mohsen-fab__mascot` is `/brand/mohsen-wave.svg` with `naturalWidth` 252; opening the popup shows `.mohsen-ask__avatar` on the paper with the same SVG.
- Gendered Help/Guide (mock session = female teacher): the teacher Guide's first step title reads "ابدأ من لوحة المعلمة", its body names the same label, and its link target shows "لوحة المعلمة". With no session the label falls back to "لوحة التحكم".

Round-4 runtime checks (dev server, Chromium, 1024 / 1440 / 1920; AR and EN unless noted):

- Settings: `/profile`'s Interface rows are `max-content` label + flexible control, 16 px apart; the list is 578 px wide (AR and EN, light and dark).
- Sidebar: the AR rail's first item is "لوحة التحكم" while the dashboard `h1` and document title stay "لوحة المعلمة"; the EN rail's first item is "Dashboard".
- Inline search: clicking the header search keeps the URL unchanged; typing lists up to 6 results and a "view all results" link to `/search?q=`; Escape closes the panel and returns focus to the control; choosing a result navigates.
- Header theme: the sun/moon button is gone; the account menu still exposes the Theme switch, and toggling it flips `data-theme` and persists `bridgio-theme`.
- Guest: "Continue as a guest" lands on the teacher dashboard preview with no session and no invented account; signing in afterwards still works.
- Wordmark: the visible glyph edge matches the sidebar edge at 1024 / 1440 / 1920 in AR and EN, expanded (nav label column, 70 px) and collapsed (icon chip, 16 / 28 px); figures in the round-4 table above.

---

## 8. Screenshots

All under `docs/screenshots/`. Each pair of `-rest` / `-pressed` images uses the identical crop so the press difference is comparable.

| Item | Files |
| --- | --- |
| 1. Scrollbars (chat, RTL) | `followup-scrollbar-chat-1920-ar-dark.png`, `followup-chat-popup-1920-ar-dark.png` |
| 2. Header (single-row phone; desktop wordmark withdrawn from centring and aligned to the nav) | `followup-wordmark-390-ar-light.png`, `followup-wordmark-390-en-dark.png`, `followup-wordmark-1920-ar-light.png`, `followup-wordmark-1920-en-light.png`, `followup-wordmark-1024-ar-light.png`, `followup-wordmark-1024-en-light.png` |
| 3. Classes table | `followup-classes-table-1920-ar-light.png`, `followup-classes-table-390-ar-light.png`, `followup-classes-table-1920-en-dark.png`, `followup-classes-table-390-en-dark.png` |
| 4. Materials card | `followup-material-card-1920-ar-light.png`, `followup-material-card-390-en-light.png` |
| 5. Pressed states | `followup-pressed-primary-rest.png` / `-pressed.png`, `followup-pressed-nav-rest.png` / `-pressed.png`, `followup-pressed-fab-rest.png` / `-pressed.png`, `followup-pressed-quick-rest.png` / `-pressed.png` |
| 6. Bidi meta rows | `followup-bidi-meta-1920-ar-light.png` |
| 7. Gendered role label | `followup-role-label-1920-ar-light.png`, `followup-role-label-1920-ar-dark.png` |
| 8. Motion surfaces | `followup-motion-sidebar-390-ar.png`, `followup-motion-chat-popup-1440-ar.png` |
| 9. Support | `followup-support-form-1920-ar-light.png`, `followup-support-pending-1920-ar-light.png`, `followup-support-unavailable-1920-ar-light.png`, `followup-support-390-en-dark.png` |
| 11–13. Account menu / sign-in | `followup-account-menu-1440-ar.png`, `followup-signin-error-1440-ar.png` |
| 15. Not found | `followup-notfound-390-en-dark.png` |
| Live-gate fixes (2026-11-16) | `followup-livegate-header-390-ar-light.png`, `followup-livegate-header-390-en-light.png`, `followup-livegate-header-1024-ar-light.png`, `followup-livegate-header-1024-en-light.png`, `followup-livegate-header-1920-ar-light.png`, `followup-livegate-header-1920-en-light.png`, `followup-livegate-dashboard-heading-1440-ar-light.png`, `followup-livegate-support-contact-1440-ar-light.png`, `followup-livegate-help-profile-text-1440-ar.png` |
| Round 2 — wordmark alignment (1024 / 1440 / 1920, AR + EN) | `followup-r2-header-1024-en.png`, `followup-r2-header-1024-ar.png`, `followup-r2-header-1440-en.png`, `followup-r2-header-1440-ar.png`, `followup-r2-header-1920-en.png`, `followup-r2-header-1920-ar.png` |
| Round 2 — phone header (390, AR + EN) | `followup-r2-header-390-en.png`, `followup-r2-header-390-ar.png` |
| Round 2 — sidebar clamp and pinned toggle (1024 / 1920) | `followup-r2-sidebar-1024-en.png`, `followup-r2-sidebar-1920-en.png` |
| Round 2 — vw scaling (1024 vs 1920) | `followup-r2-scale-1024-en.png`, `followup-r2-scale-1920-en.png` |
| Round 2 — isolated sign-in (1440, AR + EN) | `followup-r2-signin-1440-en.png`, `followup-r2-signin-1440-ar.png` |
| Round 2 — Mohsen button and popup mascot | `followup-r2-mohsen-fab-1440-en.png`, `followup-r2-mohsen-popup-1440-en.png` |
| Round 3 — account menu theme row (light + dark) | `followup-r3-account-menu-theme-light-1440.png`, `followup-r3-account-menu-theme-dark-1440.png` |
| Round 3 — Mohsen button (light + dark) | `followup-r3-mohsen-fab-light-1440.png`, `followup-r3-mohsen-fab-dark-1440.png` |
| Round 3 — Mohsen popup and mascot (light + dark) | `followup-r3-mohsen-popup-light-1440.png`, `followup-r3-mohsen-popup-dark-1440.png` |
| Round 3 — popup at 32rem (1440, EN) | `followup-r3-popup-32rem-1440-en.png` |
| Round 3 — sidebar labels, one line at 1024 (AR + EN) | `followup-r3-sidebar-labels-1024-en.png`, `followup-r3-sidebar-labels-1024-ar.png` |
| Round 3 — wordmark aligned to the collapsed rail (1024 / 1440 / 1920, AR + EN) | `followup-r3-wordmark-collapsed-1024-en.png`, `followup-r3-wordmark-collapsed-1024-ar.png`, `followup-r3-wordmark-collapsed-1440-en.png`, `followup-r3-wordmark-collapsed-1440-ar.png`, `followup-r3-wordmark-collapsed-1920-en.png`, `followup-r3-wordmark-collapsed-1920-ar.png` |
| Round 4 — settings rows compact (light + dark, AR + EN) | `followup-r4-settings-ar-light-1920.png`, `followup-r4-settings-ar-dark-1920.png`, `followup-r4-settings-en-light-1920.png`, `followup-r4-settings-en-dark-1920.png` |
| Round 4 — neutral AR sidebar label beside the gendered H1 | `followup-r4-sidebar-h1-ar-1920.png` |
| Round 4 — inline header search with results (AR + EN) | `followup-r4-inline-search-ar.png`, `followup-r4-inline-search-en.png` |
| Round 4 — header without the theme toggle (AR + EN, 1920) | `followup-r4-header-1920-en.png`, `followup-r4-header-1920-ar.png` |
| Round 4 — account menu with the Theme row (AR + EN, 1920) | `followup-r4-account-menu-ar-1920.png`, `followup-r4-account-menu-en-1920.png` |
| Round 4 — "Continue as a guest" on sign-in (AR + EN, 1920) | `followup-r4-signin-guest-ar-1920.png`, `followup-r4-signin-guest-en-1920.png` |
| Round 4 — guest dashboard with no session (AR + EN, 1920) | `followup-r4-guest-dashboard-ar-1920.png`, `followup-r4-guest-dashboard-en-1920.png` |
| Round 4 — wordmark visible-glyph alignment, expanded + collapsed (1024 / 1440 / 1920, AR + EN) | `followup-r4-wordmark-expanded-1024-en.png`, `followup-r4-wordmark-expanded-1024-ar.png`, `followup-r4-wordmark-collapsed-1024-en.png`, `followup-r4-wordmark-collapsed-1024-ar.png`, `followup-r4-wordmark-expanded-1440-en.png`, `followup-r4-wordmark-expanded-1440-ar.png`, `followup-r4-wordmark-collapsed-1440-en.png`, `followup-r4-wordmark-collapsed-1440-ar.png`, `followup-r4-wordmark-expanded-1920-en.png`, `followup-r4-wordmark-expanded-1920-ar.png`, `followup-r4-wordmark-collapsed-1920-en.png`, `followup-r4-wordmark-collapsed-1920-ar.png` |

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