# BRIDGIO — design-token + shell port delivery

- **Branch:** `gemini/ui-refresh`
- **Base:** `8b410ef` (*feat(gemini): UI refresh palette, Inter faces, calm
  hover, inline Ctrl+K search*)
- **Scope:** Port the BRIDGIO demo's design tokens and app-shell geometry
  (sidebar + topbar) verbatim. No view was rebuilt, no data, names or numbers
  were copied, and no new dependency, font file or CDN font was added.

## Gates (on the branch, after every change below)

| Gate | Command | Result |
| --- | --- | --- |
| Tests | `npm test` | **171 / 171 passed** (18 files) — baseline intact |
| Typecheck | `npm run typecheck` | **exit 0**, no diagnostics |
| Build | `npm run build` | **exit 0**, built successfully |

## Token port — `src/styles/tokens.css`

Light block carries the ported demo names; the dark block is the wine theme.

- **Ported light names:** `--bg-canvas #f6f3ee`, `--bg-surface #ffffff`,
  `--bg-elevated #efeae2`, `--bg-hover #f3efe8`, `--bg-active #eae3d8`,
  `--bg-inset #faf8f5`, `--border-subtle #e5dfd6`, `--border-strong #cec5b8`,
  `--text-primary #1a1516`, `--text-secondary #574d4f`, `--text-muted #6f6466`,
  `--brand-maroon #7a1c2e`, `--brand-maroon-hover #621524`,
  `--brand-maroon-soft rgba(122,28,46,.09)`, `--brand-on-primary #faf6f1`,
  `--focus-ring #94263b`, the four `--status-*` hues, `--shadow-xs`,
  `--shadow-overlay` and the geometry/ease set: `--topbar-h 52px`,
  `--sidebar-w 236px`, `--sidebar-w-collapsed 58px`, `--row-h 42px`,
  `--content-max 1320px`, `--ease 130ms cubic-bezier(0.2,0,0,1)`.
- **Button-level CTA pair (separate from the accent):** light `--cta-bg
  #7a1c2e` / `--cta-bg-hover #621524` / `--cta-text #faf6f1`; dark `--cta-bg
  #f2e8dc` / `--cta-bg-hover #ffffff` / `--cta-text #1a0a0e`. The dark theme
  inverts the *button* (cream fill, dark label) without turning
  `--brand-maroon` to cream.
- **Wine dark theme:** page `#1a0a0e`, surface `#240f15`, elevated `#2f151d`,
  cream text `#f7f1eb`, accent `#b32e47`.
- **Re-valued shared names (kept defined, restyled):** `--bridgio-cream`,
  `--bridgio-paper`, `--bridgio-maroon` (stays the long-standing ink alias —
  cream in dark), `--bridgio-maroon-outline`, `--primary-hover-bg`,
  `--bridgio-success`, `--bridgio-info`, `--bridgio-error`, `--hover-bg`,
  `--border`, `--disabled-*`, `--band-*`, `--focus-ring-color`.
- **Removed:** `--rail-p`, `--rail-collapsed`, `--rail-expanded`,
  `--wordmark-width` and the 250 ms `@property --rail-p` animation.

## Shell port

- **`src/routes/__root.tsx`** — one grid owns the shell: the sidebar spans both
  rows, the 52 px topbar is row 1 beside it, and `.app-main__inner` (capped at
  `--content-max`) is the only scrolling column. Auth routes stay outside the
  shell. `theme-color` is now `#f6f3ee`.
- **`src/components/AppSidebar.tsx`** — full-height sidebar; 52 px brand row
  with the maroon rounded “B” chip + `BRIDGIO` wordmark (letter-spacing
  `0.04em`); collapse toggle stays in the brand row and the wordmark is hidden
  entirely when collapsed; 42 px nav rows; muted uppercase group labels; active
  row = tinted surface + maroon inline-start indicator; utility links pinned
  below. Teacher nav is grouped Command / Detect / Diagnose / Decide / Verify
  (Dashboard · Classes+Students · Tests · Question bank · Materials); every
  other role keeps one flat, unlabelled list.
- **`src/components/AppHeader.tsx`** — 52 px topbar: role/section breadcrumb at
  the inline-start, search in the middle, notifications (teacher) / language /
  chat / account at the inline-end. The colour-theme switch lives **only** in
  the account menu.
- **`src/components/HeaderSearch.tsx`** — trigger is icon + placeholder +
  `Ctrl K` kbd; opens the existing inline panel in place; focus returns to
  `.header-search__trigger`.
- **`src/content/strings.ts`** — new AR/EN keys: `header.breadcrumbLabel`,
  `header.homeLabel`, `search.shortcut`, `sidebar.groups.{command,detect,
  diagnose,decide,verify}`.
- **`src/styles/app.css` / `followup.css` / `polish.css` / `finish.css`** —
  shell CSS rewritten with grid/sidebar/topbar/main/mobile-drawer rules;
  search trigger/panel, account panel and pressed states updated; stale
  header/wordmark/rail blocks and the old `.app-main` width override removed.

## Fixes made while porting (found by inspection / measurement)

1. **42 px rows survived every breakpoint.** A leftover
   `@media (min-width: 1024px)` rule forced `.app-sidebar__link` to
   `min-height: 48px` and a wider nav padding — removed, so rows measure 42 px
   at all desktop widths.
2. **Old 250 ms rail transition removed** from `followup.css`
   (`@media (max-width: 1023.98px)` `.app-sidebar`), which was overriding the
   new 180 ms drawer and re-introducing the retired `--rail-p` timing.
3. **Mobile drawer brand row was occluded** by the 52 px topbar (header
   `z-index: 30` painting over the drawer at `z-index: 20`), hiding the
   wordmark and the close button. The mobile drawer now sits at `z-index: 60`
   (above the header, backdrop at 50), so its brand row and close control are
   visible.

## Measurements

Teacher dashboard, **1600 × 1000 CSS px** viewport (≥ the required 1440 px),
measured with `getBoundingClientRect` after hydration. Values are CSS px.

| State | dir | collapsed | topbar h | brand h | sidebar w | nav row h | inner w |
| --- | --- | :-: | ---: | ---: | ---: | ---: | ---: |
| EN light, expanded | ltr | no | 52 | 52 | 236 | 42 | 1310 |
| EN light, collapsed | ltr | yes | 52 | 52 | 58 | 42 | 1320 |
| EN dark, expanded | ltr | no | 52 | 52 | 236 | 42 | 1310 |
| EN dark, collapsed | ltr | yes | 52 | 52 | 58 | 42 | 1320 |
| AR light, expanded | rtl | no | 52 | 52 | 236 | 42 | 1310 |
| AR light, collapsed | rtl | yes | 52 | 52 | 58 | 42 | 1320 |
| AR dark, expanded | rtl | no | 52 | 52 | 236 | 42 | 1310 |
| AR dark, collapsed | rtl | yes | 52 | 52 | 58 | 42 | 1320 |

Reading: topbar/brand rows are exactly **52 px**; nav and utility rows **42 px**;
the sidebar is **236 px / 58 px**; and the content column caps at
`--content-max` **1320 px** (visible in the collapsed rows, where the column is
wide enough to reach the cap). Theme and direction never change geometry.

Mobile drawer at **390 × 844**: fixed 256 px, opens from the inline-start
(EN `x = 0`, AR `x = 134`), backdrop present, brand row and close visible.

## Screenshots — `docs/screenshots/`

- **8 dashboard** states (EN/AR × light/dark × expanded/collapsed) at 1600 × 1000:
  `gemini-shell-dashboard-{en,ar}-{light,dark}-{expanded,collapsed}.png`.
- **2 search-open** panels: `gemini-shell-search-en-light.png`,
  `gemini-shell-search-ar-dark.png`.
- **3 mobile drawer** states at 390 × 844:
  `gemini-shell-drawer-390-{en-light,ar-light,ar-dark}.png`.

## Decisions and deviations

- **Demo file absent.** `docs/gemini-demo.html` was not present, so the token
  tables and the shell spec from the brief were ported verbatim; the available
  desktop demo (which matches the new *light* palette and shell but still
  carries the superseded charcoal dark theme) was used for the light/shell
  reference only. The wine dark theme comes from the brief.
- **`--text-muted` darkened one step to `#6f6466`.** The demo value `#7F7375`
  is 4.14:1 on `#F6F3EE`, below AA for body text; the locked contrast test
  requires ≥ 4.5:1.
- **`--bridgio-maroon` stays the ink alias (cream in dark); `--brand-maroon`
  is the new wine accent and is never swapped to cream.** This keeps the locked
  contrast test and every existing “maroon as ink” rule meaningful while the
  CTA inverts at the button level only.
- **Teacher group labels — Arabic is DRAFT:** `القيادة` (Command), `الرصد`
  (Detect), `التشخيص` (Diagnose), `القرار` (Decide), `التحقق` (Verify). The
  brief named the five groups but did not supply the Arabic strings.
- **Two literal colour values** (`--bridgio-success` in both themes) were
  written as hex rather than `var()` indirection so the locked contrast test,
  which parses token values directly, can read them. No test was weakened.

## Not built

No demo-only controls (role/state switcher, focus mode), no Phase 4, no KaTeX,
no CDN fonts, no new font files or dependencies. Views were not rebuilt; only
the shell and the token layer changed.
