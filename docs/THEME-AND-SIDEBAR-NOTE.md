# Theme and foldable sidebar — delivery note

Branch: `feat/theme-and-sidebar`. Not merged, no PR opened, not claimed verified in the live rules.

## What changed
- **Light / dark toggle** in the header (sun/moon button). Choice is stored in `localStorage` (`bridgio-theme`) and applied by a tiny inline `<head>` script before first paint, so there is no flash. Default stays light.
- **Foldable sidebar** (desktop ≥ 1024 px): a button at the foot of the sidebar folds it to an icon rail and back. State is stored in `localStorage` (`bridgio-sidebar`). Labels stay in the DOM, visually hidden, so every link keeps its accessible name; links get a `title` tooltip when folded. The phone drawer is unchanged and the fold button is hidden there.
- New icons `sun`, `moon`, `collapse`, `expand` in `AppIcon.tsx`. Chevrons mirror in RTL.

## Dark palette — PROPOSED, not a brand lock
The token sheet has no dark theme. These values are proposals pending brand approval (`tokens.css`, `:root[data-theme='dark']`):

| Role | Light | Dark (PROPOSED) |
| --- | --- | --- |
| Page background (`--bridgio-cream`) | #f9ecd9 family | #1a0403 (new value, deeper than maroon) |
| Surface (`--bridgio-paper`) | paper | #2c0706 (brand maroon) |
| Ink / outline (`--bridgio-maroon`) | #2c0706 | #f9ecd9 (brand cream) |
| Success / info / error | locked | #5cc79b / #8ab8f2 / #f0909f (lighter tints for AA on dark) |

Only the swap of roles reuses locked colours; the background and status tints are new.

## Logo in dark — PROPOSED deviation
The colour lockup and maroon wordmark are made for light surfaces. In dark, the adopted cream wordmark (fill baked in the file, never recoloured) is used at every width. Since the shell polish (2026-11-13) the ≥ 1024 px header renders the 136 px clean wordmark, not the 200 px colour lockup, so dark and light now show the same wordmark size with only the fill swapping; needs brand sign-off.

## Verification
axe-core (wcag2a/2aa/21a/21aa/best-practice): no violations, light and dark, 7 routes, 1440/1024/390 px, ar and en. No horizontal overflow. Unit tests for theme and sidebar-state parsing.

---

## Rebuild on `feat/ui-serious-pass` (2026-11-09)

An earlier dark palette (PRs #16–17) was rejected. That palette is **not** restored. Recorded here so it is not reintroduced:

| Role | Rejected (PRs #16–17) |
| --- | --- |
| Page background | `#1a0403` (invented, deeper than the brand maroon) |
| Surface | `#2c0706` (brand maroon) |
| Ink | `#f9ecd9` |
| Success / info / error | `#5cc79b` / `#8ab8f2` / `#f0909f` (invented tints) |
| Logo | cream wordmark at every width |

The rebuilt palette keeps every value on the locked brand and uses the maroon as the *base*, not the surface:

| Role | Token | Value | Why it differs |
| --- | --- | --- | --- |
| Page base | `--bridgio-cream` | `#2c0706` | brand maroon, not an invented near-black |
| Surface | `--bridgio-paper` | `#471e1b` | locked logo-outline, lifted above the base |
| Ink / outline | `--bridgio-maroon` | `#f9ecd9` | brand cream (as required; cream ink) |
| Accent | `--bridgio-red` | `#d51c1d` | unchanged; small ticks/dots only |
| Success / info / error | `--bridgio-success/info/error` | `#76a88b` / `#7d99c0` / `#e08a90` | locked hues mixed toward cream for AA, not invented hexes |

Warning stays the amber fill (`#f2a93b`) with dark `#2c0706` chip text. The cream wordmark is still used on dark above the phone band — the colour lockup and maroon wordmark have baked light-surface fills and are illegible on the maroon base — but that is a legibility constraint, not a palette choice, and the palette values above are all different from the rejected set.

Toggle: a sun/moon button in the header utility bar; default light; choice persisted in `localStorage` (`bridgio-theme`); an inline `<head>` script applies it before first paint so there is no flash. Light theme is byte-for-byte unchanged.
