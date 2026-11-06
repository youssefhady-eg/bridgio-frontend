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
The colour lockup and maroon wordmark are made for light surfaces. In dark, the adopted cream wordmark (fill baked in the file, never recoloured) is used at every width. This replaces the ≥ 1024 px full-colour lockup (200 px minimum) while dark is active; needs brand sign-off.

## Verification
axe-core (wcag2a/2aa/21a/21aa/best-practice): no violations, light and dark, 7 routes, 1440/1024/390 px, ar and en. No horizontal overflow. Unit tests for theme and sidebar-state parsing.
