# BRIDGIO — Sticky Header Scroll-Gap Delivery Note

**Date:** 2026-11-13
**Branch:** `fix/sticky-header-scroll-gap`
**Base:** `2c05fb9` (main after PR #26, Lucide)
**Commits:** `c757178` docs sync, `6f1e918` layout fix
**Scope:** the desktop scroll gap only. No sidebar offset change, no drawer change, no token, adapter, dependency, or feature change.

## Root cause

- `.app-header` was sticky only inside `@media (max-width: 1023.98px)` in `src/styles/polish.css`.
- At >=1024 px the header scrolled away, while `.app-sidebar` stayed pinned at `top: var(--header-h)` (98 px).
- Result: a 98 px empty band above the sidebar once the page scrolled. The earlier dashboard fix removed the padding inside the sidebar, not this offset.

## What changed

`src/styles/polish.css`, inside the existing `@media (min-width: 1024px)` block:

1. `.app-header` now pins with `position: sticky; top: 0; z-index: 40; min-height: var(--header-h)`.
   - 40 matches the below-1024 px rule and stays under the drawer (60), backdrop (50) and chat popup (80).
   - `min-height: var(--header-h)` makes the bar exactly 98 px in both themes, so the sidebar's 98 px offset meets it with no sub-pixel band.
2. `.app-header__inner` now has `min-height: calc(var(--header-h) - var(--outline-hairline))`.
   - Dark hides the 200 px lockup and shows the 136 px wordmark, so the bar would otherwise shrink to 72 px + border. The extra height keeps the desktop bar at 98 px and centres the wordmark; light is effectively unchanged.

`docs/BRIDGIO-LIVE_RULES.md` was synced with the 2026-11-13 scroll-gap ruling (the repo copy was one line behind); the ruling text was not rewritten.

## Verification run

- `npm test` — **129 passed (129)**, 16 files.
- `npm run typecheck` — **pass**.
- `npm run build` — **pass** (client + Nitro SSR output).
- Local dev preview on Microsoft Edge (Playwright), viewport 1920x1080, measured with `getBoundingClientRect()`.

### Measurements — 1920x1080

| State | Header top | Header height | Sidebar top | Gap | Header at scrollY 600 |
| --- | --- | --- | --- | --- | --- |
| AR light, expanded | 0 | 98 | 98 | 0 | top 0 |
| AR light, collapsed | 0 | 98 | 98 | 0 | top 0 |
| AR dark, expanded | 0 | 98 | 98 | 0 | top 0 |
| AR dark, collapsed | 0 | 98 | 98 | 0 | top 0 |
| EN light, expanded | 0 | 98 | 98 | 0 | top 0 |
| EN light, collapsed | 0 | 98 | 98 | 0 | top 0 |
| EN dark, expanded | 0 | 98 | 98 | 0 | top 0 |
| EN dark, collapsed | 0 | 98 | 98 | 0 | top 0 |

- Gap is `sidebar.top - header.bottom`, checked at scrollY 0 and scrollY 600 for every row above. All 16 checks report **0**.
- Sidebar height 982 px at a 1080 px viewport; expanded width 272 px, collapsed rail 85 px.
- Phone 390x844: header 66.11 px, still sticky at scrollY 420; the sidebar remains a closed drawer (`position: fixed`), unchanged.

### Before / after at desktop

- Light: header 97.64 px, sidebar top 98 px — a 0.36 px hairline band at scroll.
- Dark: header 97.5 px after the inner min-height, sidebar top 98 px — a 0.5 px hairline band.
- After the `.app-header` min-height: both 98 px, gap 0.

## Screenshots

All in `docs/screenshots`, 1920x1080 unless noted:

- `sticky-header-dashboard-{ar,en}-{light,dark}-1920-{expanded,collapsed}-{top,scrolled}.png` — 16 files covering both languages, both themes, both scroll positions and both sidebar states.
- `sticky-header-dashboard-ar-light-390-scrolled.png` — 390x844 phone shot with the header pinned and the drawer closed.

The "scrolled" shots are at scrollY 600: the header is visible at the top and the sidebar starts directly below it, with no band.

## Deliberately NOT changed

- `.app-sidebar` `top: 98px` and `height: calc(100dvh - 98px)` — untouched.
- The below-1024 px header rule and the off-canvas drawer behaviour — untouched.
- No token, palette, font, adapter, API contract, route, test, or dependency change.
- No merge, no PR, no push to `main`.
- `docs/BRIDGIO-LIVE_RULES.md` was not edited to claim this fix is verified or merged.

## Deviations from the brief

1. **Base:** the brief named `d5c6a31` (PR #25). `origin/main` is now `2c05fb9` (PR #26, Lucide), which contains `d5c6a31`; the branch was cut from the current main so the branch matches the live app.
2. **Dark header height:** the brief assumed the 98 px offset stays correct with a sticky header. It did not, because dark renders a shorter bar (73.5 px). Fixed by holding the header at 98 px in both themes; the sidebar offset was not changed. This makes the dark desktop header ~24.5 px taller than the previously approved screenshots — owner to confirm from the dark shots.

## Open questions

1. Confirm the taller dark desktop header (98 px, wordmark centred) is acceptable.
2. `--header-h: 98px` is a fixed value derived from the 200 px lockup; if the desktop lockup size changes, this constant and the sidebar offset must move together.