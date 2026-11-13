# BRIDGIO — Shell Polish Delivery Note

**Date:** 2026-11-13
**Branch:** `feat/shell-polish`
**Base:** `4e63494` (`origin/main` after PR #27, sticky-header scroll gap)
**Commits:** `2ea43ba` LIVE_RULES sync (verbatim), plus the shell-polish commit (code, docs, 48 screenshots)
**Scope:** desktop shell geometry and icon treatment (header, sidebar, dashboard icons), the Profile "إعدادات الواجهة" settings row, the two stale lockup statements in the docs, and the screenshot set. Branch pushed only — no merge.

---

## 1. What changed

### Header — `src/components/AppHeader.tsx`, `src/styles/polish.css`, `src/styles/app.css`

- The 200 px colour-lockup `<img>` is **removed from the header DOM**. The header now renders the adopted wordmark only: `wordmark-maroon.svg` on light and `wordmark-cream.svg` on dark.
- `--header-h` is **76 px** (was 98 px). The bar is sticky at `top: 0`, `z-index: 40`, `min-height: var(--header-h)`, border-bottom `var(--outline-sticker)` = **2 px**.
- `.app-header__inner` is `min-height: calc(76px - 2px)` = **74 px**, `padding-block: 0`, `padding-inline: 32px`. The **136 px** wordmark (49.1 px tall at its fixed aspect) is vertically centred by the flex row, so it sits on the 38 px bar centreline in both themes (measured icon/wordmark centreline 37 px, i.e. the 74 px content box centre).
- Utility control icons go from 18 px to **20 px** (`strokeWidth` stays 1.8). This satisfies both brief lines at once: "icons 20–22 px on the wordmark centreline" for the header and "header/chat icons keep 18–22 px, strokeWidth 1.8" for the icon mapping.
- The 200 px lockup CSS (`position`, `margin-block`, dark override, `width: var(--bridgio-lockup-min-width)`) is deleted; `public/brand/logo-colour.svg` **stays in the repo** for large/cover use. `strings.header.lockupAlt` is kept (unreferenced) so no copy key disappears.
- `--bridgio-lockup-min-width: 200px` in `tokens.css` is kept as the brand constant for large/cover use; the header no longer references it.

### Sidebar — `src/components/AppSidebar.tsx`, `src/styles/polish.css`, `src/styles/app.css`, `src/styles/finish.css`

- Grid columns are written in px on purpose: **272 px expanded / 88 px collapsed** (was `17rem` / `5rem`; the desktop root font-size is 17 px, so the rem values rendered 289 / 85 px).
- Sidebar is `top: var(--header-h)` and `height: calc(100dvh - var(--header-h))` — it starts under the 76 px bar and its foot (with the collapse toggle) meets the fold.
- Desktop nav: `padding-block-start: 24px`, list `gap: 8px`, rows `min-height: 48px` with `padding-block: 8px` and `padding-inline: 14px`, `border-radius: 16px` — the 48 / 8 / 16 numbers.
- Active item: `background: var(--bridgio-cream)`, `color: var(--bridgio-maroon)`, radius 16. The icon-chip fill is removed (the tile carries the state) and the 6 px red dot is `top: 50%` + `translateY(-50%)` at `inset-inline-start: 4px`, so it is fully inside the tile in both directions. In dark the locked token pair inverts, so the tile is maroon-on-cream-token (fill `#2c0706`, label `#f9ecd9`) — the same rule, not a second palette.
- Collapse control keeps the **same affordance in both states**: identical 48 px row, 16 px radius, 8 px gap, 32 px chip, same label, only the chevron reverses (`ChevronLeft` expanded → `ChevronRight` collapsed).
- Utility rows (Help / Profile) follow the same metrics at ≥1024 px: 48 px row, 8 px gap, 14 px inline padding, 16 px radius, 32 px icon chip. The toggle follows 48 / 8 / 16.
- "No wordmark in the rail" is a **no-op** — `AppSidebar` never rendered a brand element; there was nothing to remove.

### Icons — `src/components/AppIcon.tsx`, `src/components/AppSidebar.tsx`, `src/components/dashboard/icons.tsx`

- Lucide is the only icon source. Sidebar icons render at `size={22}` with `strokeWidth={2}`; header and chat icons keep stroke 1.8.
- Shell mapping: dashboard → `House`, classes → `PanelsTopLeft`, lessons → `FolderOpen`, results → `ShieldCheck`, tests → `ClipboardList`, students → `Users`, progress → `ChartColumn`, messages → `MessagesSquare`, plus the new **`help` → `FileQuestion`** for the Help link (it previously reused the lessons icon). `chat` stays `MessageSquare`.
- Every requested Lucide export exists — **no export was missing, nothing custom remains**. No invented `materials` / `assistants` names.
- `dashboard/icons.tsx` keeps its `IconName` + `Icon` API but renders Lucide components at `strokeWidth` 1.8: `classes → PanelsTopLeft`, `students → Users`, `tests → ClipboardList`, `drafts → FilePenLine`, `check → CircleCheck`, `pencil → Pencil`, `chart → ChartColumn`, `book → BookOpen`, `alert → TriangleAlert`, `clock → Clock`, `spark → Sparkles`. All 11 have a direct Lucide equivalent, so no hand-rolled path survives and there is nothing to list as "no equivalent".

### Dashboard — `src/components/dashboard/TeacherDashboard.tsx`

- Total-card and both quick-action glyphs are 22 px (`strokeWidth` 1.8). Circles are 40 × 40 px in both card types.
- Summary alignment: the value + label text block centre and the icon centre are **0.1 px apart** (579.8 px vs 579.7 px at 1920×1080), i.e. one shared baseline.
- Arabic-Indic numerals: see §5.

### Profile addendum — `src/components/shared/ProfileView.tsx`, `src/styles/polish.css`

- Language row: the `<a>` now carries `className="screen-link"` — colour inherit, same treatment as the dashboard links (underlined, no button chrome). Measured colour: `#2c0706` light / `#f9ecd9` dark, `text-decoration-line: underline` in all four theme × language combos.
- Theme row: the `<button>` is a real secondary button — `className="button button--secondary"` plus `.summary-list dd .button { min-height: 48px }`. Measured **48 px tall, `border-radius: 999px`**, surface fill (`#fff6e8` light / `#471e1b` dark), 1 px border, `text-decoration: none` — no link styling, no grey browser box.
- Click-through: the pill toggles the theme (label `داكن` → `فاتح`) and persists it; the link switches `lang=ar → en` and flips `dir` to `ltr`.

### Docs

- `docs/BRIDGIO-LIVE_RULES.md` — synced **verbatim** from Muse's current copy (commit `2ea43ba`).
- `docs/DESIGN-SYSTEM.md` — the stale "lockup minimum 200 px on the large header" rule now says the large header renders the 136 px wordmark and the lockup is no longer rendered in the header.
- `docs/THEME-AND-SIDEBAR-NOTE.md` — the dark "replaces the ≥ 1024 px full-colour lockup" paragraph now matches the single 136 px wordmark size in both themes.

---

## 2. Verification gates

| Gate | Result |
| --- | --- |
| `npm run typecheck` | **pass** (`tsc --noEmit`, no output) |
| `npm test` | **129 passed (129)**, 16 files |
| `npm run build` | **pass**, exit 0 (vite client + Nitro SSR, then `tsc --noEmit`) |

Live measurements were taken in the project dev build (`http://localhost:5173`) with a scripted browser using `getBoundingClientRect()` and `getComputedStyle()`. Device-pixel snapping on this machine (125 % OS scaling) reports a 2 px border as `1.6px` and a 1 px border as `0.8px` computed; the CSS declarations are 2 px and 1 px as specified and the *element heights* are exact.

---

## 3. Measurements — 1920×1080

| Property | Value | Check |
| --- | --- | --- |
| Header height (border included) | **76 px** (inner 74 px + 2 px rule) | exact |
| Header position / z-index | `sticky`, `top: 0`, `z-index: 40` | exact |
| Wordmark width | **136 px**, 49.1 px tall | exact |
| Wordmark fill | maroon light / cream dark | theme swap |
| Colour lockups in header DOM | **0** | removed |
| Header ↔ sidebar gap | **0 px** | at scrollY 0 and 600 |
| Sidebar width | **272 px** expanded / **88 px** collapsed | exact |
| Sidebar top / height | 76 px / 1004 px (1080 viewport) | exact |
| Sidebar nav padding-top | **24 px** | exact |
| First nav row top | **100 px** (76 + 24) | exact |
| Nav row height | **48 px** | exact |
| Nav row gap | **8 px** | exact |
| Nav row radius / padding | **16 px** / `8px 14px` | exact |
| Sidebar icon | **22 px**, `stroke-width 2` | every row |
| Active tile | cream `#f9ecd9` + maroon `#2c0706` (inverted in dark), radius 16 | exact |
| Active dot | 6 px, 4 px from inline-start, fully inside the tile | exact |
| Utility row | 48 px, radius 16, 32 px chip | exact |
| Collapse toggle | 48 px, radius 16, gap 8, centred icon (±0.4 px of the 88 px rail centre) | exact |
| Header controls | 44 × 44 px (lang, theme), 44 px tall (chat, account) | inside 44–48 |
| Header icons | **20 px**, stroke 1.8, centre y 37 = wordmark centreline | exact |
| Total / quick-action circles | 40 × 40 px, 22 px glyphs, stroke 1.8 | exact |
| Shared baseline | text-block centre 579.8 vs icon centre 579.7 | 0.1 px |
| Horizontal overflow | none | 1920 / 1366 / 1024 / 1023 / 390 |

Collapse/expand click-through: `is-collapsed` → `88px 1816.8px`, survives a reload, expands back to `272px 1632.8px`. Active tiles verified for teacher (`لوحة التحكم`), student (`اختباراتي`), parent (`الرسائل`), assistant (`لوحة التحكم`), plus the Help and Profile utility rows (cream-deep fill, maroon label, 16 px radius, 48 px). Theme and language toggles verified (light → dark → light, persisted; `lang=ar → en`, `dir` flips).

### Breakpoints

| Width | Header | Sidebar | Nav rows |
| --- | --- | --- | --- |
| 1920 / 1366 / 1024 | 76 px, sticky, 2 px rule | sticky 272 / 88 px at top 76 | 48 px, 8 px gap, radius 16 |
| 1023 | 72.8 px | drawer, fixed 320 px | 48 px, radius 12, padding-top 16 |
| 390 | 65.9 px | drawer, fixed 320 px, opens to x 70.4 | 48 px, radius 12, padding-top 16 |

Below 1024 px nothing changed: same phone header sizing, same off-canvas drawer (opens from the menu, closes by backdrop, close button, Escape or any nav link), only the icon treatment is unified.

### 1366×768, expanded, scrollY 0

Header 76, sidebar 272 at top 76, first row 100–148. Dashboard quick actions end at 500.8 px, totals at 626.6 px, class cards start below the fold — **no primary action sits below the fold**; the dashboard and the class list render no `.button--primary` at all (their actions are `.quick-action` / `.class-card` links), so the check passes trivially for both.

---

## 4. Supersessions recorded

1. **Header brand at ≥ 1024 px.** `docs` rule "lockup minimum 200 px on the large header" (and the sticky-fix assumption of a 98 px bar built around an 88.6 px lockup) is superseded: the header renders the **136 px clean wordmark** and is **76 px** total. `logo-colour.svg` stays in the repo but is not rendered in the header.
2. **Sidebar icon stroke.** The Lucide adoption note set stroke 1.8 as the default; sidebar icons are declared **stroke 2** (22 px), while header and chat icons stay 1.8 (20 px). Both statements are now true of different surfaces.
3. **dashboard-bugs nav padding.** The earlier "no dead band above the first nav item — `padding-block-start: 0`" tuning is superseded by the designed **24 px** gap under the header (first row at 100 px).
4. **sticky-fix numbers.** The 98 px header/inner-height/offset set is superseded by **76 px** everywhere the constant is used. The dark-bar sizing workaround disappears with it (both themes now render the same wordmark size).
5. **Header Option A geometry (deviation).** The bar is a fixed 76 px with the wordmark centred rather than 14 px padding around a fixed-height wordmark: `padding-block` is 0 and the effective vertical breathing space above/below the 136 px wordmark is **12.4 / 12.5 px**, i.e. ≈ **1.5 px under** the 14 px Figma target on each side. Inline padding is the specified 32 px. Recorded as the accepted deviation; no other dimension moves.
6. **Header icon size.** Utility icons moved 18 → **20 px** so the header line ("icons 20–22 px on the wordmark centreline") and the icon-mapping line ("header/chat keep 18–22 px, stroke 1.8") are both satisfied. Stroke stays 1.8.
7. **Computed border widths.** A 2 px CSS rule computes as `1.6px` and a 1 px rule as `0.8px` on this machine (125 % scaling, device-pixel snapping). The declarations are the specified 2 px / 1 px; the 76 px bar height is measured with the rule included.
8. **Class-card Arabic-Indic numerals.** The stat digits use `'thmanyahserifdisplay', 'Bridgio Display'`. Thmanyah Serif Display is **not in the repo** (pending owner asset), so the Arabic-Indic glyphs come from the prepared fallback face. Canvas ink metrics for that face (bold 20 px): `١ / ٢ / ٧` ink ascent 16 px, descent 0; `٤` ink ascent 16 px, **descent 1 px** (it is the only digit that drops below the baseline); Latin `1 / 2 / 4 / 7` ink ascent 15 px, descent 0. The per-row layout boxes are identical (24 px), so no CSS baseline bug exists — the visible ٤/٧ difference is the fallback glyph design. **No per-digit offsets were invented**; re-check when the Thmanyah files land.

---

## 5. Screenshots

48 files in `docs/screenshots`, prefix `shell-polish-`. All are full-page captures unless noted.

**Every route, 1920 px, AR, light + dark (40 files)** — captured with the session that owns the route:

| Route | Files |
| --- | --- |
| `/` (resolves to the teacher dashboard) | `shell-polish-index-ar-{light,dark}-1920.png` |
| `/sign-in` | `shell-polish-sign-in-ar-{light,dark}-1920.png` |
| `/teacher/dashboard` | `shell-polish-teacher-dashboard-ar-{light,dark}-1920.png` |
| `/teacher/classes` | `shell-polish-teacher-classes-ar-{light,dark}-1920.png` |
| `/teacher/classes/class_math_3a` | `shell-polish-teacher-class-detail-ar-{light,dark}-1920.png` |
| `/teacher/tests` | `shell-polish-teacher-tests-ar-{light,dark}-1920.png` |
| `/teacher/tests/test_math_deriv_1` | `shell-polish-teacher-test-detail-ar-{light,dark}-1920.png` |
| `/teacher/students` | `shell-polish-teacher-students-ar-{light,dark}-1920.png` |
| `/teacher/students/usr_student_omar` | `shell-polish-teacher-student-detail-ar-{light,dark}-1920.png` |
| `/student/tests` | `shell-polish-student-tests-ar-{light,dark}-1920.png` |
| `/student/tests/test_math_deriv_1/results` | `shell-polish-student-results-ar-{light,dark}-1920.png` |
| `/student/lessons` | `shell-polish-student-lessons-ar-{light,dark}-1920.png` |
| `/student/progress` | `shell-polish-student-progress-ar-{light,dark}-1920.png` |
| `/parent/progress` | `shell-polish-parent-progress-ar-{light,dark}-1920.png` |
| `/parent/tests` | `shell-polish-parent-tests-ar-{light,dark}-1920.png` |
| `/parent/results` | `shell-polish-parent-results-ar-{light,dark}-1920.png` |
| `/parent/messages` | `shell-polish-parent-messages-ar-{light,dark}-1920.png` |
| `/assistant` | `shell-polish-assistant-ar-{light,dark}-1920.png` |
| `/help` | `shell-polish-help-ar-{light,dark}-1920.png` |
| `/profile` | `shell-polish-profile-ar-{light,dark}-1920.png` |

**Also included**

- `shell-polish-teacher-dashboard-en-{light,dark}-1920.png` — English dashboard, both themes.
- `shell-polish-teacher-dashboard-ar-{light,dark}-1920-scrolled.png` — 1920×1080 viewport shots at scrollY 600: header pinned, sidebar starting directly under it, no band.
- `shell-polish-drawer-ar-{light,dark}-390.png` — 390×844 phone drawer **open**, both themes.
- `shell-polish-profile-settings-ar-light-1920.png` and `shell-polish-profile-settings-en-dark-390.png` — the "إعدادات الواجهة" / "UI settings" section: the language link and the 48 px secondary pill.

**Session used per shot.** The mock session is set by `VITE_MOCK_SESSION` (see `src/api/config.ts`), so the role screens were captured with their own session rather than as preview-role empty states:

- teacher routes, `/`, `/sign-in`, `/help`, `/profile` — default session (teacher);
- `/student/*` — `VITE_MOCK_SESSION=student` (the tests / results / lessons / progress screen filled with the seeded student);
- `/parent/*` — `VITE_MOCK_SESSION=parent` (all four screens filled; the preview role alone leaves them at "loading the child's data");
- `/assistant` — `VITE_MOCK_SESSION=assistant` (sidebar shows exactly the two granted capabilities).

The dev server was returned to the default session afterwards; no project file was changed for these runs.

---

## 6. Deliberately NOT changed

- No colour, font, copy, route, adapter/API, or dependency change. `package.json` and the lockfile are untouched.
- No red "B" square, no offset shadows.
- The below-1024 px drawer behaviour and phone header sizing are untouched (only icon size/stroke are unified).
- The Vercel Toolbar overlap was **not** fixed (preview-only, out of scope).
- The wordmark/lockup is never mirrored, stretched or recoloured; fills stay baked in the SVG files.
- No merge, no PR, no push to `main`. `.agents/` and `skills-lock.json` remain untracked.

## 7. Open items

1. Confirm the 76 px bar with the ≈1.5 px-smaller effective vertical padding (§4.5) is the accepted reading of Option A.
2. Supply the Thmanyah Serif Display / Sans / Text woff2 files so the class-card Arabic-Indic digits render from the intended face (§4.8); the ٤ descender is a glyph property of the fallback, not a CSS offset to patch.
3. Re-take the assistant shots once a real Mentingo session supplies capabilities; the current pair uses the documented mock assistant session.
