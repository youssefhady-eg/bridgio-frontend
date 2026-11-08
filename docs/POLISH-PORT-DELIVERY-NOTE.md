# BRIDGIO — Lovable polish port delivery note

- **Branch:** `feat/port-lovable-polish`, commit `bf974eb`, base `main` `d6a4217`.
- **Source:** `bridgio-connection-grove.zip`, 2,278,445 bytes, SHA-256 `46c591217543226b0cd0e533c2584dcd70dcceb08a1c8f5cc7466b1571047d05`. The export is **not merged**: its build fails (see the 2026-11-08 audit in `BRIDGIO-LIVE_RULES.md`), and it carries Tailwind, Radix/shadcn, Lovable scaffolding, a `bun.lock` and no `package-lock.json`.

## What changed

- **Added `src/styles/polish.css`**, loaded as the last stylesheet in `src/routes/__root.tsx`. It refines existing class names only: derived `color-mix` tints of locked colours, sticker surfaces, calmer header/sidebar, connected builder stepper, tinted status/grounding surfaces, 10 px progress track, hit-area and overflow fixes. No new brand hex, no drop shadows.
- **Removed the dark theme layer**, which the owner rejected as built on 2026-11-06:
  - deleted `src/shell/theme.ts`, `src/shell/useTheme.ts`, `src/shell/theme.test.ts`;
  - removed the init script, the header toggle, and the `themeToDark` / `themeToLight` / `themeLabel` copy;
  - removed the `data-theme='dark'` blocks from `tokens.css` and `app.css`;
  - added `src/styles/light-only.test.ts` as a guard against a dark theme selector or toggle copy returning.
- **Docs:** `BRIDGIO-LIVE_RULES.md` now carries the 2026-11-08 Lovable skeleton audit.

## What was NOT ported

- Tailwind, Radix/shadcn, `components.json`, Lovable scaffolding (`.lovable`, `.site-import`), `bun.lock`, `bunfig.toml`, `AGENTS.md`, `server.ts`, `start.ts`, `lib/*` error-reporting files, and the export's `routeTree.gen.ts`.
- No dependency changes: the app stays on npm, React Aria Components, TanStack Start/Router/Query, and `react-query` `^5.105.1` (the export's older `5.101.4` is what breaks its build).
- No API, adapter, route or copy changes beyond removing the rejected theme strings.

## Verification

- `npm ci` clean (152 packages, 0 vulnerabilities).
- `npm test` — **116/116 pass** (117 before; −3 theme tests, +2 light-only guards).
- `npm run typecheck` — pass.
- `npm run build` — pass (client + SSR, Nitro preview).
- Built preview returns 200 with no console errors, `lang="ar" dir="rtl"`, on teacher dashboard/classes/tests/students, student tests/lessons/progress, parent progress/tests/results/messages, and the EN variants. `polish.css` is the last stylesheet; no theme toggle in the header; no `data-theme` attribute.
- Computed styles confirm the polish rules win: paper surface `#FFF6E8`, card outline `rgba(44,7,6,0.85)`, radius 20 px, progress 10 px, count/status chips bold.

## Open questions

- Dark-theme removal is included as part of this port because polish is light-only and the owner rejected the dark colouring. If the owner would rather keep a disabled dark layer, it can be dropped from this branch.
- Arabic screenshots at desktop and phone width were not captured in this session (the desktop window was not visible to the capture tool). The build and SSR pages verify; Muse should take the screenshots at gate time.
