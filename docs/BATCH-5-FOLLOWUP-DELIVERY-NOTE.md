# BRIDGIO — Batch 5 Follow-up Delivery Note

**Date:** 2026-11-14 (updated 2026-11-19 — see the live-gate and round-2 … round-8 corrections below)
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

### Correction 2026-11-17 (round 5) — owner follow-up

The round-4 live gate passed 5 of 6 items and confirmed the two open questions from rounds 2–3 as failures. Round 5 lands the six corrections as one code commit (`3fa71fd`), the rules sync as `3e8988b`, and this note plus 14 screenshots as a third commit. The branch is still pushed only (no PR, no merge).

**Docs first — landed.** Muse's current rules file was found in the owner checkout. `docs/BRIDGIO-LIVE_RULES.md` is now a byte-identical copy (SHA-256 `240F459B...734A`, 111,001 bytes; `git hash-object` equals the source blob `ff06f65548d8386f4225c4a2e972a9597729f544`), carrying the round-4 code re-gate and the round-4 live-gate verdict in the §10 log. The previous copy was the round-3 file (`2808E774...28DB`, 91,342 bytes). No code or specification value changed in the sync.

| # | Round-5 finding | Fix | Commit |
| --- | --- | --- | --- |
| R5-1 | Collapsed wordmark still ~21 px (EN) / ~29 px (AR) off the icon chip | The collapse was animated twice on different trajectories: `grid-template-columns` 272 → 88 px (250 ms) and the header `padding-inline-start` 70 → 28 px (250 ms), while the collapsed rail re-centres its icons first (chip 120 → 28 px as the wide track finishes). No frame of that animation could align; only the settled state did, and the gate's screenshot caught the animation. Both properties now change in the same frame, so the line is exact at every instant. | `3fa71fd` |
| R5-2 | Mohsen popup ~656–670 px at 1920 vs 32 rem = 544 px | The panel already renders 544.0 px at a true 1920 CSS viewport (and on the round-4 preview build); the gate's figure is the same layout captured at 125 % display scale (544 × 1.25 = 680 screenshot px). No width bug exists. Kept the existing `width` and added `max-inline-size: min(32rem, calc(100vw - 2rem))` plus an explicit `box-sizing: border-box` so the cap cannot be overridden by a later rule. | `3fa71fd` |
| R5-3 | Sidebar ~332–384 px expanded / ~102–121 px collapsed vs 272 / 88 | The rail measures 272.0 px expanded and 88.0 px collapsed in AR **and** EN at a true 1920 CSS viewport (and on the round-4 preview); the gate's numbers are those values ×1.22–1.25 (the same screenshot scale). AR is not content-wider than EN. Pinned the grid item to its track with `inline-size: 100%` and `min-inline-size: 0` so a long label can never grow the rendered rail. | `3fa71fd` |
| R5-4 | Clicking the Theme ROW did nothing; only the switch worked | Not reproducible in a real browser: the row is one `<button role="menuitemcheckbox">` and a click at 12 %, 50 %, 82 % or 97 % of its width toggles the theme. The decorative switch is now `pointer-events: none`, so the row has a single hit target and no descendant can own the click. | `3fa71fd` |
| R5-5 | The Interface settings theme label stayed stale after an account-menu toggle | `useTheme` held a private `useState` per mount, so the header and `/profile` had two independent copies. Theme state is now one module-level external store (`useSyncExternalStore`), shared by both; the account-menu row updates the settings button in the same render. | `3fa71fd` |
| R5-6 | The first EN→AR switch flipped light→dark | Not reproducible with clean storage, nor with a stored choice: the language switch is a normal navigation and never touches the theme. Hardened so it cannot regress: the pre-paint script now always writes the resolved theme (light or dark) to `<html>`, and the store resolves a valid stored choice before the pre-painted attribute (`resolveTheme`). The resolver has no language input. Light and dark were verified across EN→AR→EN. | `3fa71fd` |

#### Round-5 measurements (real Chromium, `getBoundingClientRect`)

Setup for every figure: window 1920 × 1000, `window.innerWidth` 1920, `devicePixelRatio` 1, root `html` font-size 17 px, computed `zoom` 1. Measured on the dev server and repeated on the round-4 preview build; both agree. "Visible glyph edge" is a canvas alpha scan of the rendered wordmark (first column with alpha > 40), not the image box.

**Wordmark (item 1).**

| State | Language | Visible glyph edge | Target line | Δ |
| --- | --- | --- | --- | --- |
| Collapsed | EN | 28.1 px | icon chip inline-start 27.6 px | +0.5 px |
| Collapsed | AR | 1881.5 px | icon chip inline-start 1882.0 px | −0.5 px |
| Expanded | EN | 70.0 px | nav label column 70.0 px | 0.0 px |
| Expanded | AR | 1839.5 px | nav label column (right) 1839.6 px | −0.1 px |

- Collapsed rail 88.0 px in both languages; header `padding-inline-start` 28 px. Sampled immediately after the click and again at 60 ms and 300 ms: rail, padding, chip and glyph are identical in all three samples, so there is no transient frame any more.
- The 0.5 px residual is sub-pixel: the alpha edge sits at 13.235 % of the artwork (18.0 px of 136) while CSS compensates the 13.204 % geometric inset (17.96 px), and the chip is centred in the rail's content box (inside its 1.5 px inline-end rule), not its border box.

**Sidebar (item 3).**

| State | EN width | AR width | Grid tracks |
| --- | --- | --- | --- |
| Expanded | 272.0 px | 272.0 px | `272px 1637.6px` |
| Collapsed | 88.0 px | 88.0 px | `88px 1821.6px` |

**Mohsen popup (item 2).**

| Language | `getBoundingClientRect().width` | Computed `width` | Computed `max-inline-size` | Root font-size | Transform |
| --- | --- | --- | --- | --- | --- |
| EN | 544.0 px | 544 px | 544 px | 17 px | none |
| AR | 544.0 px | 544 px | 544 px | 17 px | none |

**Theme row and settings label (items 4–5).**

| Click point (fraction of the row width) | Theme before | Theme after |
| --- | --- | --- |
| 0.12 (over the icon) | dark | light |
| 0.50 (over the label) | light | dark |
| 0.82 (over the switch gap) | dark | light |
| 0.97 (over the switch edge) | light | dark |

| Step | Theme | Stored | Settings button label | Row `aria-checked` |
| --- | --- | --- | --- | --- |
| `/profile`, light | light | light | "Switch to dark theme" | – |
| Account-menu row clicked at 12 % | dark | dark | "Switch to light theme" (same tick) | true |

The menu stays open after the row click, and the label is already correct when it is read immediately afterwards — no reload.

**Language switch (item 6).**

| Theme set | EN | AR | EN again |
| --- | --- | --- | --- |
| Dark | dark / stored dark | dark / stored dark | dark / stored dark |
| Light | light / stored light | light / stored light | light / stored light |

**Why the gate's sidebar and popup numbers differ.** The gate measured screenshots, not geometry. In a 1920-px window at 80 % browser zoom the CSS viewport is 1536 px and `devicePixelRatio` is 1.25; the clamps resolve identically at 1536 and 1920 (272 / 88 / 544 CSS px), so a 1920-px screenshot shows 340 / 110 / 680 device pixels. The gate's 332–336 / 102–110 / 656–670 crop estimates sit inside that ±2–3 px reading error. The AR readings (up to 384 / 121) exceed even that scale, but there is no AR width rule: `grep` finds one clamp for both directions and the measured AR rail is 272.0 / 88.0. At a true 1920 CSS viewport (and on the round-4 preview `bridgio-frontend-51g2lxcxs-youssef-17fc.vercel.app`) the rail is 272 / 88 and the panel 544 in both languages.

#### Round-5 live gate (owner, 2026-11-17)

The owner ran the live gate on this branch's preview, `bridgio-frontend-16bxe9fqy-youssef-17fc.vercel.app`, and reports a clean pass: all six round-5 fixes and all previously verified behaviour hold at 1920 px in Arabic and English, light and dark. This is the owner's run on the deployed preview, not a dev-server measurement; the figures in the round-5 tables above are the geometry it confirms.

- The scale-corrected rail and popup widths are accepted: the round-4 sidebar (332–384 / 102–121) and popup (656–670) "failures" were captured at 125 % display scale, and the underlying CSS is 272 / 88 / 544 as measured.
- **Open for the owner:** the collapse is now instant. Round 5 withdrew the 250 ms `grid-template-columns` and header-padding transitions to remove the transient offset, so the rail snaps in one frame instead of animating. The owner needs to confirm that an instant snap is acceptable rather than ask for a corrected animation.
- **Still open on the owner's console** (not covered by the live gate): an axe accessibility run, the 390 px overflow check, and a console-error check. The production live gate follows the owner's merge.

### Correction 2026-11-17 (round 6) — owner follow-up

The sixth owner pass reopened three things: the round-5 instant snap (the 250 ms fold must come back **with the wordmark on the line every frame**), one guest button that had to become a role choice with a real read-only preview, and the sign-in page's column, spacing and missing language/theme controls. All three land as one code commit; this note and the round-6 screenshots are a second commit. The branch is still pushed only (no PR, no merge).

**Docs first — pending, not done.** No updated round-6 `BRIDGIO-LIVE_RULES.md` from Muse exists on this machine (the owner checkout holds the same round-5 file). The copy under `docs/` is untouched: SHA-256 `240F459B57BB847E5EB46E41D884C1F00B5C0AD2A8546104ADF614123DF7734A`, 111,001 bytes. The sync stays listed as pending until the new copy is supplied; it is **not** recorded as done.

| # | Round-6 finding | Fix |
| --- | --- | --- |
| R6-1 | Round 5 removed the collapse animation; the owner wants the 250 ms fold back, with the wordmark glyph on the sidebar line in every frame | One registered custom property, `@property --rail-p` on `.app-shell`, is the only animated value (0 = expanded, 1 = folded, 250 ms `cubic-bezier(0.4, 0, 0.2, 1)`, same easing both ways). The grid track, header padding, icon-chip position and label position are all **derived** from it, so they cannot take different trajectories: `--rail-width = expanded − (expanded − collapsed) × p`; the chip gathers from 26 px to 70 px while `--rail-gather` runs (p ≤ 0.16), then rides the rail edge (`rail / 2 − 16 px`); `--nav-line` stays at 70 px until the gather ends, then follows the chip. Labels are out of flow and pinned to `--nav-line`, so shrinking the padding cannot drag them. No margin workaround, and no second transition. |
| R6-2 | "Continue as a guest" gave one role and a no-session screen | The single button is replaced by a 2 × 2 role grid — Teacher, Student, Parent, Assistant — that clears the mock session and lands on `/teacher/dashboard`, `/student/home`, `/parent/progress` and `/assistant` with `?as=<role>`. Each landing is a labelled, read-only preview: the mock adapter borrows the matching seeded demo identity for **reads** when there is no session and `?as` is present (`viewerUser`, `requireViewerActor`, `requireViewerSelf`), while every write still goes through `currentUser()` and fails `UNAUTHENTICATED`. No session, account or identity is created. A shell banner names the preview role and says "Guest preview — demo data. Sign in to see your own." / "معاينة الزائر — بيانات تجريبية. سجّل الدخول لعرض بياناتك."; the account menu offers only Sign in. Screens outside the four landings keep their honest no-session state. No `BridgioApi` method was added. |
| R6-3 | Sign-in column split between 32 rem and 28 rem, off-centre in RTL, buttons not spanning the form, links wrapping, and no language/theme controls | The page owns one `--auth-column: 32rem`; the hero, form, guest block and links all fill it (the form's inner `max-width: 28rem` was the cause of the off-centre look and is removed). Submit and the four guest buttons span the form width. Spacing is token-based with a larger gap before the guest block: hero→form 32 px, form→hint 24 px, hint→guest 32 px. The "Other options" links are one row, first and last flush with the form edges, in both directions. The hint uses normal secondary contrast, not muted. `AuthLayout` now carries `AuthControls`: the language link is built with `hrefWithLang` (the header's mechanism) and the theme switch reads the shared `theme-state` store through `useTheme` (the account-menu Theme row's state), so a change in one place moves the other. |

#### Round-6 measurements (dev server, Chromium, `getBoundingClientRect`)

Window 1920 × 1080, `devicePixelRatio` 1, root 17 px unless a row says otherwise. "Glyph" is the wordmark's painted inline-start edge relative to the sidebar edge; "nav-line" is the header's computed `padding-inline-start`; every figure is measured in the same frame.

**Item 1 — collapse and expand, AR + EN.** The sample columns are 0 / ~60 / ~125 / ~250 ms after the click (actual elapsed 24–27 / 62–70 / 125–130 / 254–264 ms), then the settled state.

| Width | Lang | Direction | Glyph / nav-line at 0 ms | ~60 ms | ~125 ms | ~250 ms | Settled |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1920 | EN | collapse | 70.00 / 70 | 70.00 / 70 | 66.88 / 66.88 | 28.36 / 28.36 | 28.00 / 28 |
| 1920 | AR | collapse | 70.01 / 70 | 70.00 / 70 | 66.89 / 66.88 | 28.37 / 28.36 | 28.01 / 28 |
| 1920 | EN | expand | 28.00 / 28 | 44.75 / 44.75 | 73.88 / 73.88 | 70.00 / 70 | 70.00 / 70 |
| 1920 | AR | expand | 28.01 / 28 | 44.76 / 44.75 | 73.89 / 73.88 | 70.01 / 70 | 70.01 / 70 |
| 1440 | EN / AR | collapse | 70.01 / 70 | 70.01 / 70 | 66.88 / 66.88 | 28.36 / 28.36 | 27.99 / 27.99 |
| 1440 | EN / AR | expand | 27.99 / 27.99 | 44.74 / 44.74 | 73.88 / 73.88 | 70.01 / 70 | 70.01 / 70 |
| 1024 | EN / AR | collapse | 70.01 / 70 | 70.00 / 70 | 66.88 / 66.88 | 16.37 / 16.37 | 16.01 / 16 |
| 1024 | EN / AR | expand | 16.00 / 16 | 44.74 / 44.74 | 73.88 / 73.88 | 70.01 / 70 | 70.01 / 70 |

The largest glyph-vs-nav-line difference in any sample is **0.01 px**; the settled difference is ≤ 0.01 px at every width and in both languages. Rail width: 272.00 px expanded and 88.00 px collapsed at 1440 / 1920; 200.00 / 64.00 px at 1024. Icon-chip inline-start edge: 26.00 px expanded; 27.98 px collapsed at 1440 / 1920 and 16.00 px at 1024 — the required 28 px / 16 px chip line. The built stylesheet keeps `@property --rail-p`, so the interpolation survives Vite/Lightning CSS.

**Item 2 — guest roles.** Each row is one click on the sign-in picker, run in EN and AR.

| Role | Landing | Seed data actually rendered | Account menu | Errors |
| --- | --- | --- | --- | --- |
| Teacher | `/teacher/dashboard?as=teacher` | 4 dashboard total cards, seeded classes and tests | Sign in only | none |
| Student | `/student/home?as=student` | 2 seeded curriculum units | Sign in only | none |
| Parent | `/parent/progress?as=parent` | 2 seeded child units | Sign in only | none |
| Assistant | `/assistant?as=assistant` | 2 seeded capability items (dashboard, tests) | Sign in only | none |

The banner reads "Guest preview · Teacher · Demo data. Sign in to see your own. · Sign in" in EN and "معاينة الزائر · المعلم · بيانات تجريبية. سجّل الدخول لعرض بياناتك. · تسجيل الدخول" in AR (role word follows the choice); `auth.getSession()` stays `null` throughout. Exit paths, all verified without a reload: guest → account-menu Sign in → `/sign-in?as=teacher&lang=en` with the picker; pick Student → `/student/home?as=student&lang=en` as a guest; real sign-in as the teacher → dashboard with no banner; Sign out → `/sign-in?as=teacher&lang=en`. **Baked-session note:** this build has `VITE_MOCK_SESSION=teacher`, so a full page load or a fresh navigation recreates the teacher session and the guest state ends (the banner disappears). Guest verification therefore used client-side navigation only; deployed previews that need stable guest checks must use `VITE_MOCK_SESSION=none`.

**Item 3 — one column, centred, AR + EN × light + dark at 1920.**

| Measure | EN light | EN dark | AR light | AR dark |
| --- | --- | --- | --- | --- |
| Auth column, hero, form, submit, guest grid, links row | 544 px each | 544 | 544 | 544 |
| Centre of form / dashboard / viewport | 960 / 960 / 960 | 960 | 960 | 960 |
| Hero→form / form→hint / hint→guest | 32 / 24 / 32 px | 32 / 24 / 32 | 32 / 24 / 32 | 32 / 24 / 32 |
| Hint contrast | 6.63:1 | 8.43:1 | 6.63:1 | 8.43:1 |
| Badge contrast | 14.91:1 | 11.45:1 | 14.91:1 | 11.45:1 |
| Auth-controls contrast | 6.91:1 | 7.05:1 | 6.91:1 | 7.05:1 |

The 32 rem column renders 544 px because the desktop root is 17 px, not 16; the old 28 rem form cap inside it (476 px at that root) is what left 68 px of dead space on one side. The links row's first and last links sit on the form edges in both directions. The dark-mode top "Sign in" pill and the hint text were read back at the contrast figures above (both AA). The language and theme controls were exercised by the four screenshots indexed in §8; the controls read the same URL language and the same persisted theme as the shell.

**Screenshots.** The whole set is indexed in §8 under "Round 6": four sign-in captures (EN + AR × light + dark) and eight guest-preview captures (four roles × EN + AR), all 1920 px full page. The 390 px layout stays on the owner's console as agreed; nothing here estimates it.

---

### Correction 2026-11-18 (round 7) — owner follow-up

The seventh pass closes three items: the folded rail's horizontal scrollbar, the EN guest Parent tab title, and a fresh icon-centre audit at 1024 / 1440 plus mid-animation at 1920 and 1024. The docs sync is its own commit; the code, note and screenshots are a second. The branch is pushed only — no PR, no merge.

**Docs first — done.** Commit `a8cfcf5` replaces `docs/BRIDGIO-LIVE_RULES.md` with the copy supplied on 2026-11-18 (including the 15:47 owner-feedback paragraph). The committed file is **123,948 bytes**, SHA-1 `17ffadbedd5889ece6db7c90593d40a776453d96`, SHA-256 `0FEA9E6484F40F68082E8086B1C2E1123BE28A516BBD847F7904B87780B55115`, Git blob `5747c3de8e3c06325d0f7de481292dbaa46463a0`. The round-6 copy was 111,001 bytes; this one is larger and different, so the sync is real. (The hand-off listed 123,035 bytes / `f7abbc38`; the copy actually received and committed here is the larger file with the later paragraph.)

| # | Round-7 finding | Fix |
| --- | --- | --- |
| R7-1 | A horizontal scrollbar appears under the folded rail; the Support row and the foot are squeezed | The overflow was **content**, not the scrollbar. `.utility-links` is a grid whose implicit `auto` track took the rows' 64 px min-content width (32 px chip + 2 × 16 px inline padding), while its own content box was 39.17 px after the 12 px nav padding and its 12 px container padding. The track ran to x = 88 in a nav whose `clientWidth` is 87 (the 1.5 px trailing border paints as 0.8 px at the 125 % capture zoom), so `scrollWidth` was 88 and Chromium reserved an 11 px horizontal bar. `.app-sidebar__list` had the same 64 px track inside a 63.17 px box (it stopped at x = 76, still inside the nav). Both desktop lists now use `grid-template-columns: minmax(0, 1fr)` and their `li` children `min-inline-size: 0`, so the rows shrink to the content box. `.utility-links` also drops its second 12 px inline padding, which is what put the utility icons 12 px right of the main icons: the shared `--chip-line` padding now puts every row on the same edge. The nav's `overflow-x: auto` and the app-wide scrollbar styling are untouched — nothing is hidden. |
| R7-2 | The EN guest Parent landing keeps "Sign in — Bridgio" in the tab | The string was already right; the tab kept the outgoing route's title until the parent route committed. `guestMutation.onSuccess` now writes the destination title (`setGuestTitle`) **before** `navigateToRoleHome`, using the same `strings` object the destination `head` uses. The destination route still writes the same value. The wrong-title window is now the role switch itself (title correct in the ~120 ms sample, while the sign-in form is still on screen), not the route chunk. |
| R7-3 | Re-check the icon centres at 1024 / 1440 and mid-animation | The defect reproduced: the utility chip centre was 12 px right of the main chip in **both** states (56 vs 44 at 1440 collapsed; 54 vs 42 expanded). After R7-1 the two centres are identical (0.00 px) in every settled and mid-animation sample. The toggle chip remains 0.7 px inline-start of the nav chips — a pre-existing sub-pixel difference, unchanged and inside the 1.6 px tolerance; it is not a layout defect. |

#### Round-7 measurements (dev server, Chromium, `getBoundingClientRect`)

Viewport 1440 × 1080 for the before/after row (rail 87.97 px, nav `clientWidth` 87, 1.5 px trailing border painting as 0.8 px at the 125 % capture zoom); 1024 / 1440 / 1920 × 1080 for the matrix; `devicePixelRatio` 1, AR and EN. The "before" row re-applies the round-6 rules in the same build (`grid-template-columns: auto`, `li { min-inline-size: auto }`, utility `padding-inline: 12px`), so the comparison is like for like.

**Item 1 — the overflowing element, collapsed, EN, 1440.**

| Measure | Round-6 rules | Round-7 fix |
| --- | --- | --- |
| `.app-sidebar__nav` client / scroll / horizontal bar | 87 / 88 / **11 px** | 87 / 87 / **0** |
| `.utility-links` client / scroll | 63 / 76 | 63 / 63 |
| `.app-sidebar__list` client / scroll | 63 / 64 | 63 / 63 |
| Main icon x / centre | 27.99 / 43.99 | 27.99 / 43.99 |
| Utility icon x / centre | 39.99 / **55.99** | 27.99 / **43.99** |
| Rail width / centre | 87.97 / 43.99 | 87.97 / 43.99 |

The overflowing element is `.utility-links`: its 12 px container padding + 64 px track ends at x = 88, past the nav's 87 px content edge. `.app-sidebar__list` overflows its own grid box by 0.8 px (64 vs 63.17) but not the nav. After the fix both lists report `scrollWidth == clientWidth`; the nav reports `scrollWidth == clientWidth` at every width, state, language and theme below (63 / 63 at 1024, 87 / 87 at 1440 and 1920). The screenshot pair `round7-before-rail-overflow-1440-en-light.png` / `round7-rail-fixed-1440-en-light.png` shows the same rail before and after. Support sits fully in view (row `top` 572.8, `bottom` 620.8; nav `top` 76, `bottom` 1005.6) and the foot chevron is outside the scrolling nav.

**Item 3 — settled icon centres (CSS px).** Expanded rows are on the 26 px chip line (labels on 70 px); collapsed rows are on the rail centre. AR absolute x is the mirrored position; its inline insets are the same 26 / 28 px.

| Width | Lang | State | Rail | Main centre | Utility centre | Toggle centre | Main − utility | Nav client / scroll |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1024 | EN | expanded | 200.00 | 42.00 | 42.00 | 41.30 | 0.00 | 199 / 199 |
| 1024 | EN | collapsed | 64.00 | 32.00 | 32.00 | 31.30 | 0.00 | 63 / 63 |
| 1024 | AR | expanded | 200.00 | 971.60 | 971.60 | 972.30 | 0.00 | 199 / 199 |
| 1024 | AR | collapsed | 64.00 | 981.60 | 981.60 | 982.30 | 0.00 | 63 / 63 |
| 1440 | EN | expanded | 272.00 | 42.00 | 42.00 | 41.30 | 0.00 | 271 / 271 |
| 1440 | EN | collapsed | 87.97 | 43.99 | 43.99 | 43.29 | 0.00 | 87 / 87 |
| 1440 | AR | expanded | 272.00 | 1387.60 | 1387.60 | 1388.30 | 0.00 | 271 / 271 |
| 1440 | AR | collapsed | 87.97 | 1385.61 | 1385.61 | 1386.31 | 0.00 | 87 / 87 |
| 1920 | EN | expanded | 272.00 | 42.00 | 42.00 | 41.30 | 0.00 | 271 / 271 |
| 1920 | EN | collapsed | 88.00 | 44.00 | 44.00 | 43.30 | 0.00 | 87 / 87 |
| 1920 | AR | expanded | 272.00 | 1867.60 | 1867.60 | 1868.30 | 0.00 | 271 / 271 |
| 1920 | AR | collapsed | 88.00 | 1865.60 | 1865.60 | 1866.30 | 0.00 | 87 / 87 |

Every row also has `offsetHeight - clientHeight = 0` (no horizontal bar) and `offsetWidth - clientWidth = 0` (no vertical bar); the document's `clientWidth == scrollWidth` at 1014 / 1430 / 1910 for the three widths, so there is no page-level horizontal overflow. The 0.7 px toggle difference is the same in all 12 rows and has not moved since round 6. The dark theme repeats the collapsed numbers exactly — 64 / 32 / 32 at 1024, 87.97 / 43.99 / 43.99 at 1440 and 88 / 44 / 44 at 1920, AR mirrored — with `hBar 0` and the same 1014 / 1430 / 1910 document widths; the Support row stays fully in view in all 12 theme combinations.

**Item 3 — mid-animation.** Four collapse runs and four expand runs; requested sample times 0 / 60 / 125 / 250 ms, actual times below. "Rail" is the sidebar's rendered width; `hBar` is the nav's `offsetHeight - clientHeight`.

| Width | Lang | Direction | Actual sample times (ms) | Rail at 0 / 60 / 125 / 250 ms | `hBar` at all four | Main = utility centre |
| --- | --- | --- | --- | --- | --- | --- |
| 1920 | EN | collapse | 1.3 / 67.5 / 133.7 / 259.6 | 272.00 / 247.35 / 137.69 / 88.00 | 0 / 0 / 0 / 0 | yes, 0.00 px |
| 1920 | AR | collapse | 0.8 / 68.0 / 147.7 / 257.3 | 272.00 / 247.35 / 122.14 / 88.44 | 0 / 0 / 0 / 0 | yes, 0.00 px |
| 1024 | EN | collapse | 0.6 / 67.3 / 146.8 / 259.6 | 200.00 / 181.78 / 89.24 / 64.33 | 0 / 0 / 0 / 0 | yes, 0.00 px |
| 1024 | AR | collapse | 0.9 / 72.2 / 133.8 / 259.0 | 200.00 / 181.78 / 100.72 / 64.00 | 0 / 0 / 0 / 0 | yes, 0.00 px |
| 1920 | EN | expand | 11.7 / 80.6 / 142.2 / 266.3 | 88.00 / 139.15 / 237.85 / 271.99 | 0 / 0 / 0 / 0 | yes, 0.00 px |
| 1920 | AR | expand | 1.5 / 85.7 / 147.5 / 273.9 | 88.00 / 139.15 / 237.85 / 271.99 | 0 / 0 / 0 / 0 | yes, 0.00 px |
| 1024 | EN | expand | 12.8 / 92.6 / 151.4 / 263.8 | 64.00 / 101.66 / 174.66 / 199.99 | 0 / 0 / 0 / 0 | yes, 0.00 px |
| 1024 | AR | expand | 15.2 / 87.2 / 146.9 / 256.8 | 64.00 / 101.95 / 174.81 / 200.00 | 0 / 0 / 0 / 0 | yes, 0.00 px |

In every one of the 40 samples main and utility share the same centre to 0.00 px; the toggle stays 0.70 px behind. The labels stay on the 70 px line (LTR; mirrored in RTL). In the collapse direction they fade through 0.16 at the ~60 ms sample and 0 at ~125 ms; in the expand direction they stay at 0 until the gather releases them and return to 1 by the 250 ms sample. The nav's `scrollWidth == clientWidth` in every sample, so the fix holds without a settled-state trick. The 400 ms sample (not shown) is the settled state in the table above.

**Item 2 — guest Parent tab title.** Each row is one real click on the sign-in guest picker; "at ~120 ms" is the first sample after the URL changed. The sign-in form and h1 were still on screen in that sample, so the title moved before the destination route committed.

| Role | Lang | URL in the ~120 ms sample | Title in that sample | Settled title |
| --- | --- | --- | --- | --- |
| Teacher | EN | `/teacher/dashboard?as=teacher&lang=en` | Teacher dashboard — Bridgio | Teacher dashboard — Bridgio |
| Student | EN | `/student/home?as=student&lang=en` | My page — Bridgio | My page — Bridgio |
| Parent | EN | `/parent/progress?as=parent&lang=en` | **Parents — Bridgio** | **Parents — Bridgio** |
| Assistant | EN | `/assistant?as=assistant&lang=en` | Teacher Assistant area — Bridgio | Teacher Assistant area — Bridgio |
| Parent | AR | `/parent/progress?as=parent&lang=ar` | ولي الأمر — Bridgio | ولي الأمر — Bridgio |

Before this change the pre-fix parent sample read `Sign in — Bridgio` at ~100 ms and `Parents — Bridgio` only at ~250 ms. Direct SSR of `/parent/progress?as=parent&lang=en` has always returned `<title>Parents — Bridgio</title>`, which is why the fix is a timing fix in the role switch, not a string change. The settled title is written both by `setGuestTitle` and by the route's own `head`.

**Non-regression.** The expanded rail keeps its 272 / 200 px column, 26 px chip line, 70 px label line and one-line labels: all 10 labels at 1024 and 1440 report one line box (`Range.getClientRects().length = 1`). The 12 layout combinations above also report no page overflow. The wordmark/header, sign-in column and guest picker, Mohsen popup (544 px), theme row, settings rows, language-preserves-theme behaviour, inline search, the no-sun/moon header, and the AR neutral sidebar beside the gendered H1 are untouched by this diff; the guest picker was exercised by the title test. The new rules are inside `@media (min-width: 1024px)`, so the phone drawer is unchanged.

### Correction 2026-11-19 (round 8) — owner follow-up

The eighth pass folds in six owner findings from the live preview: the dark "Create account" submit button, the two sign-in text links, the guest account menu, the collapsed rail and wordmark, the `/assistant` granted cards, and the `/assistant` language switch. The docs sync is its own commit; the code, note and screenshots are a second. The branch is pushed only — no PR, no merge.

**Docs first — done.** Commit `dbbf08f` replaces `docs/BRIDGIO-LIVE_RULES.md` with the copy supplied on 2026-11-19 (it carries the 13:26 FOLD decision and this round's six-item scope). The committed file is **130,440 bytes**, SHA-1 `f10e417295f1fdf84e18f9d2f8b0f942b86d1c00`, SHA-256 `02fef6e77a3c3173c9ac6503be0a31348d7c01b92ca08ef54c7b9a003bd0dd3f`, Git blob `6470fe287ebe31e2071ffd190c779b0142c362d4`. The round-7 copy was 123,948 bytes; this one is larger and different, so the sync is real. No sync is recorded that did not happen.

| # | Round-8 finding | Cause and fix |
| --- | --- | --- |
| R8-1 | Dark "Create account" submit button unreadable | **Token/state cause:** the disabled pill paints its label with `--disabled-text`, and the dark value was cream at 40 % alpha — `rgba(249, 236, 217, 0.4)` — over the pill's `#471e1b` paper plus the 8 % `--disabled-overlay`, measuring **2.93:1**. Only the dark token changed, to `rgba(249, 236, 217, 0.62)` (**4.87:1**). Light is deliberately untouched. The enabled pill was already correct in both themes (**15.81:1**) and is unchanged. |
| R8-2 | "Create a new account" and "Forgot your password?" read as filled pills | `.auth-links__link` painted a persistent 44 px `--hover-bg` pill — its 44 px hit area *was* its visible box. At rest the link is now plain text: maroon, weight 600, no underline, transparent background, `border-radius: 0`. The wash moved to a text-line `::before` (1.7 em tall, 4 px radius, inset −4 px inline) shown on `:hover` and `:focus-visible` only. The 44 px hit area is kept. Wording, order and position unchanged. |
| R8-3 | Guest account menu never says which role is previewed, and has no exit | The guest branch held only the "Sign in" link (round 6: no Theme row — that is session-only). It now opens with a role line — `Guest — Teacher` / `زائر — الطالب` — and adds **Exit guest preview** (`الخروج من معاينة الزائر`), which returns to the sign-in role picker. The signed-in branch (Profile, Theme row, Sign out) is untouched. |
| R8-4 | AR collapsed rail wider than EN with off-centre glyphs; the collapsed wordmark hangs past the rail | The collapsed rail is a single shared `--rail-collapsed: clamp(64px, 6.11vw, 88px)`, so EN and AR cannot diverge, and both icon-chip columns sit on the rail centre (`--rail-edge`). The collapsed wordmark now reads `--wordmark-width`, interpolated by `--rail-p` from the expanded clamp to `(rail / 2 + 16) / 0.85397`, so its painted *end* lands on the rail's far edge while its painted *start* stays on the chip edge. The expanded clamp (`clamp(112px, 9.44vw, 136px)`) and the 272 px expanded rail are unchanged. Reproduced pre-fix overhang: **+56.1 px** in both directions. |
| R8-5 | `/assistant` granted-section cards are ~16:1 empty pills and the page is loose | Grants are a 2–4 item list, so a full-width row measured **1159.4 × 77.6 px (14.94:1)** — a banner for one label. `.capability-list` is now `repeat(auto-fill, minmax(12rem, 1fr))` with a tighter `.capability-item` (36 px icon, `--radius-input`, `--space-3`/`--space-4` padding), plus an `.assistant-page`-scoped rhythm that tightens the hero and section gaps on this screen only. Grants and wording are unchanged. |
| R8-6 | Switching language on `/assistant` loses the session | **Cause:** the built preview bakes a seeded mock session (`VITE_MOCK_SESSION` unset → `readSession` defaults to `teacher`), and `?as=` was only a fallback consulted when no session was live, so `/assistant?as=assistant` rendered "No teacher assistant session". Two fixes: `createMockApi` clears a baked session whose role differs from an explicit `?as=` (client only — SSR has no `window`), and the assistant loader skips its session/capabilities prefetch for a mock `?as=` preview so a stale teacher is never dehydrated into the 30 s cache. |

#### Round-8 measurements (dev server, Chromium, `getComputedStyle` / `getBoundingClientRect`)

Viewports 1440 × 900 / 1000 and 1024 / 1280 / 1920 × 1000, `devicePixelRatio` 1, EN and AR. Contrast is computed from the *composited* colours: the pill's own background colour plus its 8 % overlay gradient, with the alpha label composited on top. The submit button is measured on a detached probe of the same `button button--primary` classes because React resets the real button's `disabled`.

**Item 1 — the four submit-button states.** The `enabled`/`disabled` and light/dark numbers are identical for EN and AR (the label text differs only in length).

| Theme | State | Label token | Backdrop (composited) | Contrast |
| --- | --- | --- | --- | --- |
| Light | enabled | `rgb(249, 236, 217)` | `rgb(44, 7, 6)` | 15.81:1 |
| Light | disabled | `rgba(44, 7, 6, 0.4)` | `rgb(238, 227, 214)` | 2.54:1 (unchanged) |
| Dark | enabled | `rgb(44, 7, 6)` | `rgb(249, 236, 217)` | 15.81:1 |
| Dark | disabled | `rgba(249, 236, 217, 0.4)` → **0.62** | `rgb(85, 46, 42)` | **2.93:1 → 4.87:1** |

The dark fix is one token (`--disabled-text`); the light token and the enabled pill are byte-identical to round 7. Screenshots `round8-item1-signup-{en,ar}-{light,dark}-{enabled,disabled}.png`.

**Item 2 — link treatment at rest and on interaction** (EN light, and the same rule in the other three combinations). Two links: "Create a new account", "Forgot your password?".

| State | `color` | `font-weight` | `text-decoration-line` | `background-color` | `border-radius` | `::before` background |
| --- | --- | --- | --- | --- | --- | --- |
| Rest | `rgb(44, 7, 6)` (maroon) | 600 | none | `rgba(0, 0, 0, 0)` | 0 px | `rgba(0, 0, 0, 0)` |
| Hover | `rgb(44, 7, 6)` | 600 | none | `rgba(0, 0, 0, 0)` | 0 px | `rgba(44, 7, 6, 0.04)` |
| Focus-visible | `rgb(44, 7, 6)` | 600 | none | `rgba(0, 0, 0, 0)` | 0 px | `rgba(44, 7, 6, 0.04)` |

Dark mirrors this with `rgb(249, 236, 217)` text and `rgba(249, 236, 217, 0.06)`. The `::before` box is 28.88 px tall (1.7 em), inset −4 px inline and vertically centred on the text line — a highlight, not a 44 px pill. The measured link box stays 44 px tall (hit area), width 166.86 / 177.16 px EN. Screenshots `round8-item2-auth-links-{en,ar}-{light,dark}-{rest,hover}.png`.

**Item 3 — guest account-menu contents, per role.** Read from the open menu on `5173` (`VITE_MOCK_SESSION=none`, so the preview is a true guest). All four roles, EN and AR, show the same three parts; the signed-in menu was read on `5174` (`VITE_MOCK_SESSION=teacher`) and is unchanged.

| Role | Menu (EN) | Menu (AR) |
| --- | --- | --- |
| Teacher | `Guest — Teacher`, Sign in, Exit guest preview | `زائر — المعلم`, تسجيل الدخول, الخروج من معاينة الزائر |
| Student | `Guest — Student`, Sign in, Exit guest preview | `زائر — الطالب`, … |
| Parent | `Guest — Parent`, Sign in, Exit guest preview | `زائر — وليّ الأمر`, … |
| Assistant | `Guest — Assistant`, Sign in, Exit guest preview | `زائر — مساعد المعلم`, … |
| Signed in (teacher) | Profile, Theme, Sign out | الملف الشخصي, المظهر, تسجيل الخروج |

"Exit guest preview" lands on `/sign-in?lang=<lang>` with the role picker ("Continue as a guest": Teacher, Student, Parent, Assistant). No Theme row in the guest menu; the signed-in menu keeps its Theme `menuitemcheckbox`. Screenshots `round8-item3-guest-menu-{en,ar}-{teacher,student,parent,assistant}-light.png` plus `…-{en,ar}-assistant-dark.png`.

**Item 4 — collapsed rail and wordmark, `getBoundingClientRect` per combination.** "Paint start" / "paint end" are the glyph edges derived from the box and the 13.204 % / 1.399 % whitespace split (RTL mirrors which side is inline-start). Differences are against the icon-chip edge and the rail's far edge.

| Width | Lang | Rail | Icon centre − rail centre | Paint start − chip edge | Paint end − rail far edge | Wordmark box |
| --- | --- | --- | --- | --- | --- | --- |
| 1024 | EN | 64.00 | 0.00 | +0.01 | 0.00 | 56.20 |
| 1024 | AR | 64.00 | 0.00 | −0.01 | 0.00 | 56.20 |
| 1280 | EN | 78.20 | 0.00 | +0.01 | +0.01 | 64.53 |
| 1280 | AR | 78.20 | 0.00 | 0.00 | −0.01 | 64.53 |
| 1440 | EN | 87.97 | 0.00 | 0.00 | 0.00 | 70.25 |
| 1440 | AR | 87.97 | 0.00 | −0.01 | −0.01 | 70.25 |
| 1920 | EN | 88.00 | 0.00 | 0.00 | −0.01 | 70.25 |
| 1920 | AR | 88.00 | 0.00 | −0.01 | 0.00 | 70.25 |

Every collapsed combination lands the icon centre on the rail centre and the painted wordmark between the chip edge and the rail's far edge, to ≤0.01 px. The expanded rail is unchanged: 200.00 px at 1024, 241.79 at 1280, 272.00 at 1440 and 1920 (the same `clamp(200px, 18.89vw, 272px)`). Pre-fix, the same probe with the round-7 wordmark rule restored overhangs the rail's far edge by **+56.10 px** (EN) and **−56.09 px** (AR, mirrored) at 1440 collapsed; after the fix that is 0.00 / −0.01. Screenshots `round8-item4-rail-{1024,1280,1440,1920}-{en,ar}-{collapsed,expanded}.png`.

**Item 5 — granted cards and page height,** 1440 × 900, EN + AR, light + dark (all four identical).

| Measure | Round-7 | Round-8 |
| --- | --- | --- |
| Granted card box | 1159.4 × 77.6 px | **225.5 × 61.6 px** |
| Card aspect | 14.94:1 | **3.66:1** |
| Cardinality | one full-width column | 5 auto-fill tracks (`minmax(12rem, 1fr)`) |
| Page bottom / main scroll | 759.1 / 747 px | **629.5 / 618 px** |

The "Round-7" column re-applies the old rules in the same build (single column, `--space-4` padding, `--radius-card`, 44 px icon) so the comparison is like for like. Grants (Teacher dashboard, Tests) and their wording are unchanged, and the shared `.capability-list` / section classes are only overridden inside `.assistant-page`. Screenshots `round8-item5-granted-{en,ar}-{light,dark}.png`.

**Item 6 — exact repro and fix.** On the built preview (`VITE_MOCK_SESSION` unset, so it bakes teacher), loading `/assistant?as=assistant&lang=en` directly rendered the "No teacher assistant session" state and the account menu showed the teacher session; switching EN→AR or AR→EN kept the same wrong state, and a reload reproduced it. After the fix, on `5174` (`VITE_MOCK_SESSION=teacher`):

| Step | URL | H1 / greeting | Both sections | "No … session" |
| --- | --- | --- | --- | --- |
| Direct load, EN | `/assistant?as=assistant&lang=en` | "The sections granted to your account" / Welcome, هالة محمود | Granted + Current session + note | no |
| Switch EN→AR (in place) | `/assistant?as=assistant&lang=ar` | الأقسام الممنوحة لحسابك | yes | no |
| Switch AR→EN | `/assistant?as=assistant&lang=en` | back to EN | yes | no |
| Reload, EN | `/assistant?as=assistant&lang=en` | same as first row | yes | no |
| Direct load, AR | `/assistant?as=assistant&lang=ar` | الأقسام الممنوحة لحسابك | yes | no |
| Switch AR→EN | `/assistant?as=assistant&lang=en` | page unchanged, only `lang` flips | yes | no |

The guest menu stays "Guest — Assistant" throughout, and the language link carries `as` (it already did — `hrefWithLang`). `/assistant?as=teacher` on the same build keeps the teacher session, so the change only lets an explicit `?as=` win over a *different* baked role; when `?as=` matches the baked role nothing is cleared. `src/api/config.ts` is deliberately unmodified (its default stays `teacher`, so the demo's first paint is unchanged); deploying the preview with `VITE_MOCK_SESSION=none` remains an owner action recorded in the live rules.

**Non-regression.** `npm test` is 18 files / **169 of 169** (unchanged from the round-7 baseline at `c67d395`), `npm run typecheck` is clean, and `npm run build` succeeds. `src/api/config.ts`, the shared `.capability-list` base rules outside `.assistant-page`, the signed-in account menu, the expanded rail, the motion tokens and the Thmanyah font are untouched by this diff. Out of scope and left alone: the round-7 scrollbar and EN guest Parent title fixes, the Mohsen sign-out/in, the 390 px and console checks, and the Vercel toolbar overlay.

### Correction 2026-11-19 (round 9) — owner follow-up

The ninth pass works the four round-8 live-gate findings on `feat/finish-frontend-followup`, on top of the round-8 tip `d2664ca`: the dark "Create account" submit button after an invalid submit, the AR collapsed rail and wordmark, `/student/home` losing the guest session on a language switch, and the theme surviving a language switch. Two of the four did not reproduce on this tip; that is stated with the measurements rather than papered over, and no code was changed for them.

**Baseline at `d2664ca`, before any edit.** `npm test` **18 files / 169 of 169**, `npm run typecheck` clean, `npm run build` exit 0. The branch was clean at that tip.

**Docs first — no round-9 copy exists on this machine, so no sync is recorded.** `BRIDGIO-LIVE_RULES.md` was searched for under `C:\Users\Youssef Hady` (repo `docs/`, both worktrees, `%TEMP%`). The newest copies are all the round-8 file: **130,440 bytes**, SHA-256 `02fef6e77a3c3173c9ac6503be0a31348d7c01b92ca08ef54c7b9a003bd0dd3f`, ending at the round-8 fold decision, with no round-9 tail. `docs/BRIDGIO-LIVE_RULES.md` is therefore untouched by this round. The round-9 scope is taken from the owner brief, not from a file, and no sync is claimed that did not happen.

| # | Round-9 finding | Cause and fix |
| --- | --- | --- |
| R9-1 | Dark "Create account" submit is unreadable once a submit attempt has been made | **The state is `:hover` (and `:active`), not `:disabled`.** An invalid form never starts the mutation, so the button stays enabled; after the click the pointer rests on it, which is what the gate photographed. `.button--primary:hover:not(:disabled)` and `.button--primary:active:not(:disabled)` painted `--bridgio-maroon-outline` (`#471e1b`) while the label is `--bridgio-cream` — which dark redefines as `#2c0706` — measuring **1.29:1**. Fix: one new role token, `--primary-hover-bg`. Light keeps today's `var(--bridgio-maroon-outline)` exactly; dark keeps the cream fill and dips it toward the dark paper with `color-mix(in srgb, var(--bridgio-maroon) 88%, var(--bridgio-paper))`. Hover in `app.css` / `polish.css` and press in `followup.css` now read that token. The resting button, the enabled state and the light theme are unchanged; no new hex value is introduced. |
| R9-2 | AR collapsed rail narrower than EN and its wordmark off the rail edge | **Not reproducible on `d2664ca` or this tip.** The collapsed rail is one shared `--rail-collapsed: clamp(64px, 6.11vw, 88px)` for both directions: measured **88.00 px for EN and AR** at 1920 × 1080, with the icon centre on the rail centre to **0.00 px** and the AR wordmark's painted edge on the rail's inner edge to **−0.04 px** (EN +0.38 px — both sub-pixel). Dark is identical (the cream wordmark takes over), and the built preview matches the dev server. No code change: redoing either rail would have broken the round-8 numbers the gate already accepted. |
| R9-3 | `/student/home` shows "No student session" after the language switch, after a reload and on a direct `?as=student` load | **Cause: the route loader's SSR session prefetch.** `student.home` called `ensureQueryData(sessionQueryOptions())`, and SSR cannot see `?as=`; a preview build that bakes a seeded account (VITE_MOCK_SESSION unset → `readSession` defaults to `teacher`) dehydrates that teacher into the query cache with a 30 s `staleTime`. Guest preview only activates while `getSession()` is `null`, so the client lost the preview. The language link already preserved `as` (`hrefWithLang`, covered by `lang.test.ts`); the full-page navigation was simply re-running the bad prefetch. Fix: the same guard `assistant.tsx` got in round 8 — when `api.mode === 'mock'` and the location carries `?as=`, skip the session/profile/progress/attempts prefetch and let the client answer it. |
| R9-4 | Theme does not survive a language switch | **Not reproducible.** 6/6 switches in both directions on the built preview, from the account-menu Theme row (seeded session) and from the sign-in control (no session), plus 6/6 on the dev server; the four-step guest flow (set dark on sign-in → Student preview → switch) also stays dark. `resolveTheme` never takes the active language as an input, the pre-paint script re-applies the stored value on every full navigation, and `theme-state.test.ts` already pins the contract. No code change. |

#### Round-9 measurements (Chromium 1255 via CDP, 1920 × 1080, `devicePixelRatio` 1)

The in-app browser pane is 1000 px wide, below the 1024 px desktop breakpoint, so every number below was taken through the DevTools protocol with a true 1920 CSS-pixel viewport at dpr 1. Contrast is composited from the computed colours: the button's own background, its 8 % disabled overlay and the alpha label over that fill.

**Item 1 — sign-up submit, light and dark, EN and AR.** EN and AR report the same colours; the label is `Create account` (142.86 × 44 px) or `إنشاء الحساب` (122.39 × 44 px). `after submit` is the state the gate photographed: one real click on the untouched form, pointer left on the button, native validation blocks the request, the button stays `disabled: false`.

| Theme | State | Fill | Label | Contrast |
| --- | --- | --- | --- | --- |
| Light | enabled (rest) | `rgb(44, 7, 6)` | `rgb(249, 236, 217)` | 15.81:1 (unchanged) |
| Light | after submit (`:hover`) | `rgb(71, 30, 27)` | `rgb(249, 236, 217)` | 12.27:1 (unchanged) |
| Light | disabled | `rgb(238, 227, 214)` | `rgba(44, 7, 6, 0.4)` → `rgb(160, 139, 131)` | 2.54:1 (unchanged; disabled is WCAG-exempt) |
| Dark | enabled (rest) | `rgb(249, 236, 217)` | `rgb(44, 7, 6)` | 15.81:1 (unchanged) |
| Dark | after submit (`:hover`) | `rgb(228, 211, 194)` | `rgb(44, 7, 6)` | **12.64:1** (was **1.29:1** on `#471e1b`) |
| Dark | disabled | `rgb(85, 46, 42)` | `rgba(249, 236, 217, 0.62)` → `rgb(187, 164, 151)` | 4.87:1 (unchanged since round 8) |

The press state adds `filter: brightness(0.96)` on the same dark fill, which stays above 11:1. Two assertions were added to `tokens.contrast.test.ts` that resolve `--primary-hover-bg` in each theme and require ≥ 4.5:1, so the maroon-on-maroon pair cannot come back. Screenshots `round9-item1-signup-{en,ar}-{light,dark}-{enabled,after-submit,disabled}.png`.

**Item 2 — collapsed rail and wordmark, `getBoundingClientRect` per combination** (1920 × 1080; light and dark identical apart from which wordmark file is visible). "Edge on rail" is the AR wordmark's painted inline-start edge minus the rail's inner edge (EN: painted end minus the rail's far edge).

| Combo | Rail box (x, w) | Grid column | Icon centre − rail centre | Wordmark box (x, w) | Edge on rail | Sidebar overflow |
| --- | --- | --- | --- | --- | --- | --- |
| EN light | 0.00, 88.00 | 88px | 0.00 | 18.73, 70.25 | +0.38 | none |
| AR light | 1832.00, 88.00 | 88px | 0.00 | 1822.72, 70.25 | −0.04 | none |
| EN dark | 0.00, 88.00 | 88px | 0.00 | 18.73, 70.25 | +0.38 | none |
| AR dark | 1832.00, 88.00 | 88px | 0.00 | 1822.72, 70.25 | −0.04 | none |

Width sweep, collapsed, EN vs AR rail: **87.97 / 87.97** at 1440, **83.45 / 83.45** at 1366, **78.20 / 78.20** at 1280, **67.20 / 67.20** at 1100, **64.00 / 64.00** at 1024 — one shared clamp, so the directions cannot diverge. The icon centre is on the rail centre to ≤ 0.01 px at every width. The built preview repeats the 1920 and 1280 rows exactly. The expanded rail (272.00 px at 1920 and 1440) and the EN collapsed rail were not touched. Screenshots `round9-item2-collapsed-{en,ar}-{light,dark}.png`.

**Item 3 — guest preview on `/student/home`, seeded-teacher build (`VITE_MOCK_SESSION` unset).** Reproduced first, then re-run after the loader fix; the table is the built preview (`4190`), and the dev server (`5175`) reports the same six rows.

| Step | URL | Guest badge | Greeting | Progress data | "No student session" |
| --- | --- | --- | --- | --- | --- |
| Preview from sign-in | `/student/home?as=student&lang=en` | Student | Hello, سارة محمد! | 67 %, 2 units | no |
| Switch EN→AR | `...&lang=ar` | الطالب | أهلًا يا سارة محمد! | ٦٧٪, وحدتان | no |
| Switch AR→EN | `...&lang=en` | Student | Hello, سارة محمد! | yes | no |
| Reload | `...&lang=en` | Student | Hello, سارة محمد! | yes | no |
| Direct load EN | `...&lang=en` | Student | Hello, سارة محمد! | yes | no |
| Direct load AR | `...&lang=ar` | الطالب | أهلًا يا سارة محمد! | yes | no |

Pre-fix, the same six steps read `guest: false`, "No student session" / "مفيش جلسة طالب" from step 2 onward (reproduced on `5175`, teacher-seeded). Re-verified on the same build: `/assistant?as=assistant&lang=ar` (guest, هالة محمود), `/teacher/dashboard?as=teacher&lang=ar` (real teacher session, no guest badge — `as` matches the baked role), `/parent/progress?as=parent&lang=ar` (guest, child سارة محمد). Screenshots `round9-item3-student-home-{en,ar}.png`, `round9-item3-{assistant,teacher-dashboard,parent-progress}-en.png`.

**Item 4 — theme across the language switch, built preview.** Each row is one toggle followed by one language switch; "survived" means both `data-theme` and `localStorage['bridgio-theme']` still held the toggled value after the navigation.

| Flow | Direction | Survived |
| --- | --- | --- |
| Sign-in control, no session (build has no baked account) | EN→AR / AR→EN, three each | **6/6** |
| Account-menu Theme row, seeded teacher | EN→AR / AR→EN, three each | **6/6** |
| Dev server, account-menu Theme row | EN→AR / AR→EN, three each | **6/6** |
| Guest flow: dark on sign-in → Student preview → switch | EN→AR | dark before and after |

Screenshots `round9-item4-en-dark-{before,after}.png` (EN→AR) and `round9-item4-ar-dark-{before,after}.png` (AR→EN).

**Gates after the changes.** `npm test` **18 files / 171 of 171** (the round-8 169 plus the two new button-fill assertions), `npm run typecheck` clean, `npm run build` succeeds (`✓ built in 1.53s`). Nothing outside the five touched source files and the test file changed: `src/routes/student.home.tsx`, `src/styles/{tokens,app,polish,followup}.css`, `src/styles/tokens.contrast.test.ts`.

**Non-regression and out of scope.** Light-mode buttons, the enabled primary button, the disabled tokens, the EN collapsed rail, the expanded rail and the wordmark scale formula are byte-identical to `d2664ca`. The round-8 passing items (pill links, guest menu, assistant cards) were not touched. Out of scope and left alone: the per-role wordmark theory, the mock password, email trimming, the Mohsen sign-out (it did not recur), the 390 px and console checks, and the Vercel toolbar overlay.

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
| `npm test` | **169 passed (169)**, 18 files |
| `npm run typecheck` | **pass** (`tsc --noEmit`, no output) |
| `npm run build` | **pass**, exit 0 (vite client + Nitro SSR, then `tsc --noEmit`); the built CSS keeps `@property --rail-p` |
| Live gate (owner, branch preview `16bxe9fqy`, 2026-11-17) | **pass** — all six round-5 fixes and the earlier behaviour, at 1920, AR + EN, light + dark |
| Round-6 local gate | **pass** — the figures and screenshots in the round-6 section above |
| Round-7 local gate | **pass** — docs sync, folded-rail overflow, guest Parent title and 40 mid-animation samples; figures in the round-7 section above |

The follow-up adds one test file (`src/content/roles.test.ts`: three `roleLabel` cases — female label, null keeps neutral, male keeps neutral — three `dashboardLabel` cases for the 2026-11-16 correction, and four `dashboardLinkLabel` cases for round 2 — female, non-female, no session, and English) and one mock-adapter expectation (`support.submitRequest` added to `EXPECTED_METHODS`). Batch 5 ended at 150; nothing was removed. Round 2 takes the count from 156 to 160. Round 3 adds two `dashboardNavLabel` cases (gendered Arabic, one-word English for every gender) and takes the count from 160 to 162. Round 4 removes those two cases together with the `dashboardNavLabel` helper, returning the count to **160**; no other test changed. Round 5 adds six `theme-state` cases — theme resolution when a stored choice and a pre-painted attribute disagree, the pre-paint fallback, the no-source default, and the shared store's toggle and subscriber contract — taking the count from 160 to **166**. Round 6 adds three guest-preview cases to `mock-adapter.test.ts` — seed reads for all four roles with no session, writes rejecting `UNAUTHENTICATED` while no session is created, and the real session staying authoritative over `?as` — taking the count from 166 to **169**. No existing test changed. Round 7 changes no test and removes none; the count stays **169**.

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

Round-5 runtime checks (dev server, Chromium; 1920 × 1000, `innerWidth` 1920, `devicePixelRatio` 1; AR and EN):

- Collapsed wordmark: after the collapse the rail is 88.0 px, header padding 28 px, icon chip inline-start 27.6 px (EN) / 1882.0 px (AR, right edge), and the alpha-scan glyph edge 28.1 px / 1881.5 px — a 0.5 px residual. The same four values are already true in the first sample taken immediately after the click (and at 60 ms and 300 ms), so the old in-flight offset is gone.
- Sidebar: rail 272.0 px expanded and 88.0 px collapsed in both languages; tracks `272px 1637.6px` / `88px 1821.6px`; `document.scrollWidth == clientWidth` (1910) at 1920.
- Mohsen popup: `getBoundingClientRect().width` 544.0 px, computed `width: 544px`, `max-inline-size: 544px`, root 17 px, `transform: none` after the entry animation, EN and AR.
- Theme row: a click at 12 / 50 / 82 / 97 % of the row width toggles the theme every time; the switch is `pointer-events: none`.
- Settings label: on `/profile` in the light theme the button reads "Switch to dark theme"; clicking the account-menu row reads "Switch to light theme" immediately, with the row `aria-checked="true"` and the menu still open.
- Language switch: `data-theme` and `bridgio-theme` stay `light` across EN→AR→EN and stay `dark` across EN→AR→EN.
- The round-4 preview build (`51g2lxcxs`) measured 272 / 88 / 544 at a true 1920 viewport, matching the dev server.
- The owner's round-5 live gate (2026-11-17) on the branch preview `bridgio-frontend-16bxe9fqy-youssef-17fc.vercel.app` passed clean; the round-5 section above records the pass, the instant-collapse confirmation request and the three items still open on the owner's console.

Round-6 runtime checks (dev server, Chromium; 1920 × 1080 unless noted; AR and EN):

- Collapse/expand: 48 samples across 1024 / 1440 / 1920 and both directions, each taken at 0, ~60, ~125 and ~250 ms after the toggle click plus the settled state. Glyph edge and nav line differ by at most **0.01 px** in every sample; settled rail 272 / 88 px at 1440 and 1920, 200 / 64 px at 1024; settled chip edge 28 px at 1440 / 1920 and 16 px at 1024; expanded label line 70 px. The expanded row's chip edge stays at 26 px (the design inset), while the label column is the 70 px line.
- Guest roles: the four sign-in buttons land on the four required URLs with `?as=`; the shell banner names the role; seeded teacher totals, student units, parent units and assistant capabilities all render; the account menu contains only **Sign in**; `auth.getSession()` remains `null`; no console errors in either language.
- Guest exits: account-menu Sign in keeps the chosen `as` on `/sign-in`; choosing Student from there lands on the student preview; a real teacher sign-in clears the banner; Sign out returns to `/sign-in` with the picker. A fresh navigation recreates the baked teacher session (the documented `VITE_MOCK_SESSION=teacher` behaviour).
- Sign-in layout: at 1920 the column, hero, form, submit, guest grid and links row all measure 544 px and share the 960 px centre in EN and AR, light and dark. The old inner 28 rem form cap is gone. Gaps are 32 / 24 / 32 px, and the links row's outer edges meet the form's in both directions.
- Sign-in contrast: hint 6.63:1 light and 8.43:1 dark; badge 14.91:1 / 11.45:1; auth controls 6.91:1 / 7.05:1.
- Sign-in controls: the language control builds the URL through `hrefWithLang` and the theme switch toggles the shared store (`data-theme` and `bridgio-theme` move together); both appear on all four auth routes through `AuthLayout`.

Round-7 runtime checks (dev server, Chromium; 1024 / 1440 / 1920 × 1080; AR and EN; light and dark):

- Folded rail: after the fix, all 12 width × language × theme combinations report `.app-sidebar__nav` `scrollWidth == clientWidth`, no horizontal or vertical bar, `documentElement.scrollWidth == clientWidth`, and a fully visible Support row. The chevron lives in the foot, outside the nav, and is reachable in every combination.
- The before/after pair at 1440 EN collapsed: nav 87 / 88 with an 11 px bar and utility centre 55.99 → 87 / 87 with no bar and utility centre 43.99. The main centre stays 43.99. `.utility-links` is the element that crossed the nav's content edge; `.app-sidebar__list` is fixed for the same min-content reason.
- Expanded rail: 272 px at 1440 / 1920 and 200 px at 1024; chip line 26 px; label line 70 px; all 10 labels one line at 1024 and 1440 in both languages; no bars. The utility icons moved from 38 to 26 px onto the main icon line (the owner-visible 12 px offset); the rest of the expanded rail is unchanged.
- Mid-animation: 20 collapse + 20 expand samples at 0 / ~60 / ~125 / ~250 ms on 1920 and 1024, AR and EN. Main and utility centres are equal to 0.00 px in every sample; toggle 0.70 px behind. `hBar = 0` in all 40; labels leave the line while gathered and return by the 250 ms expand sample.
- Guest Parent title: with the fix, the tab reads `Parents — Bridgio` in EN and `ولي الأمر — Bridgio` in AR at the first ~120 ms sample (while the sign-in form is still on screen), and the same after the route commits. Teacher, Student, Parent and Assistant all follow their own destination title; no role falls back to `Sign in — Bridgio` once the switch succeeds.
- No test, contract, dependency or route change; the only code files touched are `src/styles/followup.css` and `src/components/shared/SignInView.tsx`.

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
| Round 5 — collapsed wordmark vs icon chip (1920, AR + EN; full + detail crop) | `followup-r5-wordmark-collapsed-en-1920.png`, `followup-r5-wordmark-collapsed-en-detail.png`, `followup-r5-wordmark-collapsed-ar-1920.png`, `followup-r5-wordmark-collapsed-ar-detail.png` |
| Round 5 — sidebar rendered width, expanded + collapsed (1920, AR + EN) | `followup-r5-sidebar-expanded-en-1920.png`, `followup-r5-sidebar-expanded-ar-1920.png`, `followup-r5-sidebar-collapsed-en-1920.png`, `followup-r5-sidebar-collapsed-ar-1920.png` |
| Round 5 — Mohsen popup width (1920, AR + EN) | `followup-r5-popup-en-1920.png`, `followup-r5-popup-ar-1920.png` |
| Round 5 — Theme row click updates the settings label live (light → dark) | `followup-r5-settings-theme-light-1920.png`, `followup-r5-theme-row-toggle-settings-label-1920.png` |
| Round 5 — language switch preserves the dark theme (EN → AR → EN) | `followup-r5-lang-switch-theme-kept-ar-dark-1920.png`, `followup-r5-lang-switch-theme-kept-en-dark-1920.png` |
| Round 6 — sign-in, one column + role picker + auth controls (1920, EN + AR × light + dark) | `round6-signin-en-light-1920.png`, `round6-signin-en-dark-1920.png`, `round6-signin-ar-light-1920.png`, `round6-signin-ar-dark-1920.png` |
| Round 6 — guest preview, four roles (1920, EN + AR, light) | `round6-guest-teacher-en-light-1920.png`, `round6-guest-teacher-ar-light-1920.png`, `round6-guest-student-en-light-1920.png`, `round6-guest-student-ar-light-1920.png`, `round6-guest-parent-en-light-1920.png`, `round6-guest-parent-ar-light-1920.png`, `round6-guest-assistant-en-light-1920.png`, `round6-guest-assistant-ar-light-1920.png` |
| Round 7 — folded rail, no horizontal scrollbar (1024 / 1440 / 1920, EN + AR × light + dark) | `round7-rail-{1024,1440,1920}-{en,ar}-{light,dark}.png` |
| Round 7 — the overflowing `.utility-links` recreated vs the fix (1440, EN, light) | `round7-before-rail-overflow-1440-en-light.png`, `round7-rail-fixed-1440-en-light.png` |
| Round 7 — expanded utility icons on the main icon line (1440, EN + AR, light) | `round7-rail-expanded-1440-en-light.png`, `round7-rail-expanded-1440-ar-light.png` |

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