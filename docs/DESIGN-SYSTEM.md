# BRIDGIO design system (UI layer)

Status: documents what the code already does, plus a short audit. Nothing here is a new brand decision. Anything marked **PROPOSED** is not in the token sheet and needs approval. Source tokens: `src/styles/tokens.css`; components: `src/styles/app.css`.

## 1. Audit (2026-11-06)

| Check | Result |
| --- | --- |
| Hard-coded colours in `app.css` | 3 hex values, all inside logo/theme-colour contexts (wordmark fills, `theme-color` meta). Everything else uses tokens. |
| Spacing | 209 `var(--space-*)` uses; 11 literal values remain. |
| Type sizes | 2 literal `font-size` values outside the scale. |
| Focus | 15 `:focus-visible` rules; focus ring is a token. |
| Reduced motion | Was missing — added in this branch. |
| Dark theme | Opt-in token override (PROPOSED), built only from locked brand colours; text/status contrast checked. |
| Documentation | None for components — this file. |

Priority actions: (1) keep new CSS on tokens, (2) migrate remaining dialogs/menus to React Aria, (3) replace the 11 literal spacings and 2 literal font sizes over time.

## 2. Tokens

Three tiers. Components should only use tiers 2 and 3.

1. **Brand (LOCKED)**: `--bridgio-cream` #f9ecd9 (background), `--bridgio-paper` #fff6e8 (surface), `--bridgio-maroon` #2c0706 (ink/outline), `--bridgio-success` #1f7a57, `--bridgio-info` #2a62b0, `--bridgio-warning-fill` #f2a93b (fill only), `--bridgio-error` #7e1a2b (wine; error is never brand red).
2. **Semantic (PROPOSED)**: `--text-primary/secondary/muted`, `--border`, `--border-strong`, `--hover-bg`, `--disabled-*`, `--band-*` (header band).
3. **Scale (PROPOSED)**: spacing 4/8/12/16/24/32/48/64 px; type h1 28 / h2 22 / h3 18 / body 16 / small 14 / label 15 / caption 13 (larger from 1024 px); radius card 24, input 12, pill 999; sticker outline 2 px, hairline 1.5 px; touch target 44 px.

### Dark theme (PROPOSED)
Set with `data-theme="dark"` on `<html>` (header toggle, remembered in `localStorage` under `bridgio-theme`; a tiny inline `<head>` script applies it before first paint). Default is light. The palette is built only from locked brand colours plus one mix rule, and is deliberately **not** the rejected `#1a0403` attempt:

| Role | Token | Dark value | Source |
| --- | --- | --- | --- |
| Page base | `--bridgio-cream` | `#2c0706` | brand maroon (LOCKED) |
| Surface | `--bridgio-paper` | `#471e1b` | locked logo-outline, lifted |
| Ink / outline | `--bridgio-maroon` | `#f9ecd9` | brand cream (LOCKED) |
| Accent | `--bridgio-red` | `#d51c1d` | unchanged, small ticks only |
| Success / info / error | `--bridgio-success/info/error` | `#76a88b` / `#7d99c0` / `#e08a90` | locked hues mixed toward cream for AA |

Warning stays the amber fill with dark `#2c0706` text. The colour lockup and maroon wordmark are for light surfaces, so dark uses the adopted cream wordmark at every width (fills are baked in the files, never recoloured). Details and rationale: `docs/THEME-AND-SIDEBAR-NOTE.md`.

## 3. Components

| Component | Classes | Variants | States covered |
| --- | --- | --- | --- |
| Button | `.button` | `--primary`, `--secondary`, `--danger`, `--ghost`; `--small`, `--icon` | hover, focus-visible, disabled |
| Header utility | `.app-utility__button` | `--lang`, `--theme`, `--account` | hover, focus-visible, disabled; icon-only lang/theme |
| Sidebar link | `.app-sidebar__link` | active, collapsed | hover, focus-visible, `aria-current` |
| Status chip | `.status-chip` | `--success`, `--warning`, `--neutral` | always icon + word, never colour alone |
| Empty note | `.empty-note` | default, `--error`, `--success` | title + body, icon optional |
| Input | `.input`, `.field` | `--narrow` | focus-visible, error text via `.field__error` |
| Panel / card | `.panel`, `.class-card`, `.total-card`, `.test-row` | — | sticker outline, 24 px radius |
| Modal | `.chat-popup*` (React Aria `Modal`/`Dialog`) | desktop panel, phone sheet | focus contained, Escape, outside press |

### Rules
- Status is icon + word. Warning is a fill with dark text; never amber text on cream.
- Primary action per screen is one `.button--primary`.
- Never recolour or mirror the wordmark or lockup. Since the shell polish (2026-11-13) the large (≥ 1024 px) header renders the 136 px clean wordmark only; the 200 px colour lockup stays in the repo for large/cover use and is no longer rendered in the header.

## 4. Accessibility rules (WCAG 2.1 AA)
- Text contrast ≥ 4.5:1 (measured with alpha blended over the real background); UI parts ≥ 3:1.
- Touch targets ≥ 44 px (`--touch-target`).
- Every control has an accessible name; icon-only controls carry `aria-label` and `title`.
- Dialogs and drawers: focus moves in, stays in, Escape closes, focus returns. Use React Aria for new ones.
- Motion: `prefers-reduced-motion` removes transitions (global rule at the end of `app.css`).
- Direction: logical properties (`inline-start/end`); directional icons mirror in RTL.

## 5. Copy rules
- Button = verb + object ("Delete question", not "Confirm delete").
- Confirmations say what is deleted and that it can't be undone; cancel names what is kept ("Keep question").
- Errors: what happened + what to do. Empty states: what it is + how to start.
- Same word for the same thing in Arabic and English; all copy lives in `src/content/strings.ts`.
- Open question: teacher screens use Modern Standard Arabic, student screens Egyptian colloquial. Confirm this is intended before unifying.
