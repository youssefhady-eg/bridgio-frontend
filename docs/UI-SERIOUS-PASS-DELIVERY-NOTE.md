# BRIDGIO UI serious pass — delivery note

**Branch:** `feat/ui-serious-pass` (off `feat/port-lovable-polish` at `1992169`).
Pushed only. Not merged, no PR, nothing pushed to `main`. Nothing here is claimed verified in `docs/BRIDGIO-LIVE_RULES.md`.

**Hosted branch preview:** https://bridgio-frontend-git-feat-ui-serious-pass-youssef-17fc.vercel.app/

The preview is the gate for this pass: the teacher dashboard returns **200** in both languages (`?lang=ar` → `<html lang="ar" dir="rtl">`, `?lang=en` → `<html lang="en" dir="ltr">`) and shows the two-column `dashboard__grid`.

---

## Commits

| Commit | What |
| --- | --- |
| `9608887` | docs-only: LIVE_RULES refresh + page catalogue |
| `69afe69` | Phase 1 — sidebar bug fixes |
| `df5ce62` | Phase 1 follow-up — measured `--header-h` |
| `f24b065` | Phase 2 — denser two-column teacher dashboard |
| `1955ef9` | Phase 3 — radii, header lockup clip, parent badge (code) |
| `0a89838` | Phase 3 — hosted UI audit screenshots |
| `e45bb85` | Phase 4 — new dark palette, header toggle, persisted light default |

**Deviation from "one commit per phase":** Phase 1 needed a follow-up commit, and Phase 3 is two commits (code, then screenshots). Screenshots can only be captured from the hosted preview *after* the code commit deploys, and already-pushed commits are never rewritten, so the audit screenshots follow in their own commit. Each commit message states its phase.

---

## Phase 1 — sidebar bugs

Two live defects, both fixed:

1. **Collapse toggle fell below the fold.** The desktop sidebar was pinned with `top: 0; height: 100dvh`, so its foot (and the collapse button) sat one header-height below the viewport bottom. It is now pinned under the header: `top: var(--header-h); height: calc(100dvh - var(--header-h))`.
2. **`--header-h` was wrong, so the offset above was wrong too.** Measured full header height at ≥ 1024 px is **97.64 px** (locked 200 px lockup, 88.64 px tall at its fixed 3078:1364 aspect, plus `--space-1` padding top/bottom and the bottom hairline). `--header-h` is now **98px**; `--header-min: 72px` remains the header *inner* min-height. Verified: `--header-h: 98px`, sidebar top 98 / bottom 900, toggle visible, foot in viewport at 1440 and 1920, AR and EN.

## Phase 2 — teacher dashboard

Rebuilt as a **denser two-column** layout using **only existing adapter data**; nothing is computed and no value is invented — every number and label is backend-supplied.

- Two-column grid (`.dashboard__grid`): left = quick actions, tests needing attention, recent activity; right = student progress, classes.
- **Quick actions** link only to real screens. `Create a test` and `View tests` both resolve to `/teacher/tests` (the 4-step builder), because **that is the only real teacher tests screen** — there is no tests *list* route, so "view tests" has nowhere else to go. Flagged, not invented.
- **Tests needing attention**: drafts/unpublished first; each row shows only supplied fields.
- **Student progress**: sorted lowest progress first.
- AR and EN copy added for every new string, in `src/content/strings.ts`.

## Phase 3 — visual audit

Every real page was captured from the **hosted** preview at desktop 1440 and phone 390, AR and EN, and inspected: teacher dashboard, test builder, student test player, parent progress / tests / results / messages, home list. Population of the parent and student layouts was additionally audited on local dev servers with `VITE_MOCK_SESSION=parent|student`, because the hosted mock session is fixed to `teacher` (see Limitations).

### Defect list

**Fixed**

| # | Defect | Fix |
| --- | --- | --- |
| a | Header lockup clipped ~2 px at the top (`margin-block: -6px` pulled it above the viewport) | Removed the negative margin; the bar now sizes to the lockup |
| b | Sidebar collapse toggle below the fold (`--header-h` wrong) | Corrected `--header-h` to the measured 98 px (Phase 1) |
| c | Off-scale corner radii (14 / 16 / 10 / 20 px) broke the one-panel look | Normalised to the token scale: 12 px controls, `--radius-card` 24 px for `--radius-panel` |
| d | Parent frame rendered the same string as the eyebrow and the H1, duplicating the heading on every parent section | Eyebrow now names the role (`parent.badge`) and the section heading is the H1; regression test added |

**Flagged, deliberately not fixed** (needs an owner/copy decision, so no fix was invented)

| # | Defect | Why left |
| --- | --- | --- |
| e | Parent tests/results repeat the section heading as the page H1 and again as an in-section H2 | A copy decision (does the section need its own H2 under an identical H1?), not a styling bug |
| f | EN copy embeds the Arabic assistant working name (e.g. "let محسن draft questions") | Pre-existing working-name convention (`const M = assistant.nameAr` is used in English strings); changing it is a naming decision, not a UI fix |

## Phase 4 — dark theme

**Default light, persisted, opt-in.** A sun/moon button in the header utility bar toggles the theme; the choice is stored in `localStorage` (`bridgio-theme`) and applied by a tiny inline `<head>` script before first paint, so there is no light flash on the next visit. Only the exact stored value `dark` turns it on.

### New palette — built only from locked brand colours

| Role | Token | Dark value | Source |
| --- | --- | --- | --- |
| Page base | `--bridgio-cream` | `#2c0706` | brand maroon (LOCKED) |
| Surface | `--bridgio-paper` | `#471e1b` | locked logo-outline (lifted above the base) |
| Ink / outline | `--bridgio-maroon` | `#f9ecd9` | brand cream (LOCKED) |
| Accent | `--bridgio-red` | `#d51c1d` | unchanged — small ticks/dots only |
| Success | `--bridgio-success` | `#76a88b` | locked hue mixed toward cream for AA |
| Info | `--bridgio-info` | `#7d99c0` | locked hue mixed toward cream for AA |
| Error | `--bridgio-error` | `#e08a90` | locked hue mixed toward cream for AA |
| Warning | `--bridgio-warning-fill` | `#f2a93b` | unchanged fill; chip text pinned to `#2c0706` |

Anchored on the locked brand: the **page base is the brand maroon** and the **surface is the locked logo-outline lifted above it**, so the whole theme is cream ink on maroon, with brand red used only as a small accent.

### Why it differs from the rejected palette (PRs #16–17)

| Role | Rejected (PRs #16–17) | This pass | Difference |
| --- | --- | --- | --- |
| Page background | `#1a0403` (invented near-black, deeper than maroon) | `#2c0706` brand maroon | uses the locked brand maroon as the base instead of an invented colour |
| Surface | `#2c0706` brand maroon | `#471e1b` locked logo-outline | the surface is a lifted locked colour, not the base colour itself |
| Ink | `#f9ecd9` | `#f9ecd9` | same by requirement — the brief asks for **cream ink** |
| Success / info / error | `#5cc79b` / `#8ab8f2` / `#f0909f` (invented) | `#76a88b` / `#7d99c0` / `#e08a90` (derived from the locked hues) | derived by mixing the locked hues toward cream, not invented hexes |

The adopted cream wordmark is used above the phone band in dark. The colour lockup and maroon wordmark have light-surface fills baked into the files (never recoloured) and are illegible on the maroon base, so this is a legibility constraint rather than a palette choice. Light theme values are byte-for-byte unchanged; every dark rule is scoped to `[data-theme='dark']`.

Contrast is guarded by `src/styles/tokens.contrast.test.ts`, which now blends dark text/status tokens over both dark surfaces and asserts AA (4.5:1). `src/styles/light-only.test.ts` (which asserted *no* dark theme) is removed and replaced by `src/shell/theme-state.test.ts` (parsing/persistence).

---

## Live sidebar widths

At ≥ 1024 px the sidebar is a 16 rem ↔ 5 rem rail; with the 17 px root font that is literally **272 px expanded ↔ 85 px collapsed** (verified at 1440 and 1920, AR and EN). Below 1024 px it is the unchanged overlay drawer. The header is **97.64 px** tall (token `--header-h: 98px`). Content and sidebar never overflow horizontally (`hasHorizontalOverflow: false` on every capture).

## Deliberately NOT changed

- No new screens or routes; no marking logic, no price, no auth, no backend, no new data.
- No links to placeholder screens (Classes, Students).
- The **light theme** (tokens, colours, spacing, radii beyond the defect fixes above) is unchanged.
- The rejected dark palette is not restored.
- `docs/BRIDGIO-LIVE_RULES.md` is not edited to claim this work verified or merged.

## Limitations / open items

- **Hosted parent/student states:** the hosted mock session defaults to `teacher` (`VITE_MOCK_SESSION`), so `/parent/*` and `/student/*` render their no-session state on the hosted preview. Their populated layouts were audited on local dev servers with `VITE_MOCK_SESSION=parent|student`. This is a mock-configuration limit, not a code defect.
- **Quick actions:** `Create a test` and `View tests` both resolve to `/teacher/tests`; there is no teacher tests *list* route. Needs a routes decision.
- **Defects (e)** and **(f)** above are flagged, not fixed.
- The Vercel branch alias updates ~25–30 minutes after a push; screenshots are only taken once the alias serves the intended commit.

## Screenshots

Committed under `docs/screenshots/`:

- Phase 3 light audit — `ui-serious-pass-<page>-<lang>-<desktop|phone>.png` (32 files across the 8 pages × AR/EN × 1440/390). Re-captured once more from the deployed Phase 4 build so the header shows the theme toggle; all 32 report `theme: light` and no horizontal overflow.
- Phase 4 dark theme — `ui-serious-pass-dark-<page>-<lang>-<desktop|phone>.png` (teacher dashboard and test builder, AR/EN at 1440 and AR at 390); all report `theme: dark` and no horizontal overflow.
