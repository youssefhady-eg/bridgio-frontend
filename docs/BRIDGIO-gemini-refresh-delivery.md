# BRIDGIO — Gemini UI refresh delivery

- **Branch:** `gemini/ui-refresh`
- **Base:** `ed9be31` (round-10 tip of `feat/finish-frontend-followup`)
- **Scope:** Patches 1–5 applied verbatim by content anchor. No redesign, no new
  token names, no new dependencies, no Phase 4 work.

## Gates (on the branch)

| Gate | Command | Result |
| --- | --- | --- |
| Tests | `npm test` | **171 / 171 passed** (18 files) — baseline intact |
| Typecheck | `npm run typecheck` | **exit 0**, no diagnostics |
| Build | `npm run build` | **exit 0**, built successfully |

## Applied

1. **`src/styles/tokens.css`** — dark theme replaced with the Warm Near-Black
   Charcoal pair (`#110e0f` page / `#1a1516` surface, cream ink `#f9ecd9`,
   locked brand red accent). Only the `:root[data-theme='dark']` block changed;
   the light `:root` and the `@media (min-width: 1024px)` clamp block are
   untouched. Every existing token name remains defined.
2. **`src/styles/fonts.css`** — Latin `Bridgio Body` (400/600/700) and
   `Bridgio Label` (600/700) now request `local('Inter …')` first and fall back
   to the bundled Nunito files. Sora display, Arabic faces, and the Thmanyah
   guard are untouched; no font files added or downloaded.
3. **`src/styles/polish.css`** — h1 tracking neutralised for Arabic; the badge,
   hero/lead, card-surface and hover blocks replaced; hover is a calm border
   change (no lift); tabular numerals added to the listed numeric surfaces; the
   entire dark-theme refinement section replaced with the charcoal hairline,
   third-step tints, red inline-start active indicator, neutral charcoal
   backdrops, and the amber-chip contrast rule.
4. **`src/styles/followup.css`** — scrollbar track paints `--bridgio-cream`;
   the desktop wordmark compensation uses the corrected painted factor
   `0.85975` and RTL margin factor `-0.00865` with both `html[dir='rtl']` and
   `:root[dir='rtl']` selectors; the folded wordmark line subtracts
   `--outline-hairline` and centres the painted glyph. Round-10 invariants
   (`--rail-collapsed`, `--rail-expanded`, `--wordmark-width`, the 250 ms
   `@property --rail-p` animation) are unchanged.
5. **`src/components/HeaderSearch.tsx`** — full drop-in: Ctrl+K / Cmd+K
   teacher-only shortcut, `aria-keyshortcuts`, arrow-key movement between the
   input and result links, panel ref cleanup, and the documented inline
   dropdown behaviour.

## Not built (Phase 4 parked)

No changes to `src/components/builder/*`. No Grading View, no paper-scan, no
Active Exam timer, no KaTeX. No new dependencies.

## Measurements

Teacher dashboard, true **1440 × 900 CSS px** viewport, `devicePixelRatio = 1`,
settled rail (250 ms animation complete). The console snippet from the brief was
run unchanged; the table below is its output for AR + EN × light + dark ×
expanded + collapsed.

| State | dir | collapsed | railWidth | paintedWidth | leftInset | rightInset | deltaPx |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| EN light, expanded | ltr | false | 272 | 116.8 | 70.01 | 83.69 | −13.68 |
| EN light, collapsed | ltr | true | 150 | 116.8 | 15.82 | 15.88 | −0.06 |
| AR light, expanded | rtl | false | 272 | 116.8 | 83.70 | 70.00 | +13.69 |
| AR light, collapsed | rtl | true | 150 | 116.8 | 15.88 | 15.82 | +0.07 |
| EN dark, expanded | ltr | false | 272 | 116.8 | 70.01 | 83.69 | −13.68 |
| EN dark, collapsed | ltr | true | 150 | 116.8 | 15.82 | 15.88 | −0.06 |
| AR dark, expanded | rtl | false | 272 | 116.8 | 83.70 | 70.00 | +13.69 |
| AR dark, collapsed | rtl | true | 150 | 116.8 | 15.88 | 15.82 | +0.07 |

Reading:

- **Collapsed rail:** AR residual is **+0.07 px** (EN −0.06 px) — effectively
  zero, symmetrically padded, in both themes. No fix invented.
- **Expanded rail:** `leftInset` (EN) / `rightInset` (AR) is exactly the 70 px
  nav-label line; the snippet's `deltaPx` assumes centring, which applies only
  to the folded rail, so the ±13.7 px expansion delta is expected and not a
  defect.
- Theme makes no difference to geometry (identical rows), as intended.

## Screenshots

All at 1440 × 900, in `docs/screenshots/`:

- `gemini-refresh-en-light-dashboard.png`
- `gemini-refresh-en-light-collapsed-dashboard.png`
- `gemini-refresh-ar-light-dashboard.png`
- `gemini-refresh-ar-light-collapsed-dashboard.png`
- `gemini-refresh-en-dark-dashboard.png`
- `gemini-refresh-en-dark-collapsed-dashboard.png`
- `gemini-refresh-ar-dark-dashboard.png`
- `gemini-refresh-ar-dark-collapsed-dashboard.png`
- `gemini-refresh-en-light-search-open.png`
- `gemini-refresh-ar-light-search-open.png`
- `gemini-refresh-en-dark-search-open.png`
- `gemini-refresh-ar-dark-search-open.png`
- `gemini-refresh-en-light-classes.png`
- `gemini-refresh-ar-light-classes.png`
- `gemini-refresh-en-dark-classes.png`
- `gemini-refresh-ar-dark-classes.png`
- `gemini-refresh-en-light-notifications.png`
- `gemini-refresh-ar-light-notifications.png`
- `gemini-refresh-en-dark-notifications.png`
- `gemini-refresh-ar-dark-notifications.png`

## Delivery

Push only — no PR, no merge. `feat/finish-frontend-followup` and `main` are
untouched.
