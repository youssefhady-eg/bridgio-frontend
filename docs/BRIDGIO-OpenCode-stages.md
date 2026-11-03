# BRIDGIO — OpenCode Stages (Analytica-style)

Build BRIDGIO in `bridgio-frontend` with OpenCode + DeepSeek 4.1 (free, separate from the Analytica session), TanStack Start + TanStack Router + TanStack Query, TypeScript, Vite.

This plan replaces the single big prompt. Do NOT do all stages at once. Do one stage, stop, verify, then do the next. A stage is not done until its gate passes.

## Rules for every stage

- Stop the previous OpenCode run before starting Stage 0. The big first prompt that ran 11+ minutes with no files is abandoned — do not resume it.
- Working directory (CONFIRMED 2026-11-01, owner): `C:\Users\Youssef Hady\Desktop\Youssef\Projects\bridgio-frontend` (code only). This supersedes the earlier `LMS to Hire\bridgio-frontend` path — do not work in that path.
- Brand files live in a separate isolated folder (path given by the owner in the first prompt). Read them from there. Do NOT copy them into `bridgio-frontend`.
- Source of truth, in order: `BRIDGIO-UI-UX-token-sheet.md`, then `BRIDGIO_Brand_Guidelines_v1.4.pptx` (reference only, do NOT attach it as code context after Stage 0), then `BRIDGIO-short-brand-guide.md` v1.5.
- Stack, locked: TanStack Start + Router + Query, TypeScript, Vite. Not Next.js.
- Language: Arabic-first, full RTL, light theme only, for every stage.
- Mentingo source is deleted locally. There are NO confirmed Mentingo endpoints. Every API shape in this plan is PROPOSED, for Mentingo to implement later. The only Mentingo remainder is the Docker demo images. Do NOT claim a live Mentingo connection until Stage 7, and then only if it actually works.
- No paid service, library, font or image. No intelligent marking, no price, no installments, no Learn-to-Hire or exotic flows, no dark theme, in any stage.
- At the end of every stage, OpenCode must deliver: (1) a runnable local build, (2) Arabic screenshots at desktop and phone width, (3) a short delivery note: what changed, what was NOT built, deviations from the token sheet, and open questions. No stage claims to be final or external-ready.
- Gate: after each stage, the owner brings the build + delivery note + screenshots to Muse for verification against the token sheet. Do NOT start the next stage until Muse passes the gate, or the fixes for that stage are done. If a gate fails, fix in the same stage — do not carry the failure into the next stage.

## Stage 0 — Scaffold + API adapter contract (no UI screens)

Goal: a runnable empty TanStack app, and the adapter that every later screen will use.

Prompt for OpenCode:
```
In bridgio-frontend, using TanStack Start + TanStack Router + TanStack Query, TypeScript, Vite, scaffold the project only, and write the API adapter contract + mock implementation only. Read only BRIDGIO-AI-build-handoff.md and BRIDGIO-UI-UX-token-sheet.md from the isolated folder. Do NOT read the PowerPoint deck, do NOT build any screens yet. Adapter: one typed layer in src/api/ or src/services/, mock implements the exact same interface, method names and types as the real adapter. Cover, as PROPOSED endpoints only: auth / teacher / student, classes, tests, questions, attempts, materials, Mohsen Q&A with grounding. No component calls fetch directly. Deliver: runnable empty app, adapter + mock, contract document. Stop there and report back.
```

Gate (Muse verifies):
- App runs locally, no errors.
- Adapter exists, typed, mock implements the same interface.
- Every endpoint labelled PROPOSED, none presented as a confirmed Mentingo endpoint.
- No screens built yet, no invented colours, fonts or features.

## Stage 1 — Shell, tokens, RTL, header

Goal: the app shell looks and reads like BRIDGIO, before any feature screen.

Prompt for OpenCode:
```
Stage 1 only. Build the app shell from the token sheet: design tokens (colours, status colours, fonts Sora / Nunito / Alexandria / Baloo Bhaijaan 2), Arabic-first full RTL layout, light theme only, header / nav with full lockup for large header and adopted wordmark (wordmark-cream on dark, wordmark-maroon on light) for small header at 120 px or wider. Teacher nav: Dashboard, My Classes, Tests, Students. Student nav: My Tests, Lessons, Progress. No feature screens yet. Deliver runnable build + Arabic screenshots desktop and phone.
```

Gate:
- Tokens match the sheet exactly (locked values), proposed values used as-is and labelled proposed.
- Fonts load correctly, no Fredoka anywhere.
- RTL correct, header legible at desktop and phone, wordmark never mirrored, never stretched, never as favicon.
- No feature screens, no invented components.

## Stage 2 — Teacher dashboard

Goal: teacher lands and sees classes, recent tests, student progress at a glance.

Prompt for OpenCode:
```
Stage 2 only. Build the teacher dashboard, from the token sheet and the Stage 0 adapter + mock only: classes, recent tests, student progress at a glance. Lead copy with time saved, not hiring promises. Arabic-first, RTL, light theme. Deliver runnable build + Arabic screenshots desktop and phone.
```

Gate:
- Dashboard data comes through the adapter / mock only, no hard-coded data in components.
- Copy, colours, fonts and spacing match the token sheet.
- Empty state works (no classes / no tests yet).

## Stage 3 — Test builder (4 steps + question editor)

Goal: teacher can build, edit and publish a test to a class.

Prompt for OpenCode:
```
Stage 3 only. Build the teacher test builder as a real flow, 4 steps: (1) choose material or curriculum unit, (2) Mohsen drafts questions, (3) teacher reviews and edits — every generated question editable / deletable before publishing, (4) publish to the class. All through the Stage 0 adapter + mock. Arabic-first, RTL, light theme. Deliver runnable build + Arabic screenshots desktop and phone.
```

Gate:
- All 4 steps work end to end in mock, edit / delete works before publish.
- No intelligent marking, no price, no installments built or promised in copy.
- Mohsen drafting is grounded in teacher material + fixed curriculum only, grounding shown.

## Stage 4 — Student test player

Goal: student can take a test and ask Mohsen on the same screen.

Prompt for OpenCode:
```
Stage 4 only. Build the student test player: Question 1, options, Submit, progress, with the Mohsen Q&A panel on the same screen. All through the Stage 0 adapter + mock. Arabic-first, RTL, light theme. Deliver runnable build + Arabic screenshots desktop and phone.
```

Gate:
- Player works end to end in mock, progress correct, submit works.
- Mohsen panel shows grounding, says when it does not know from the material — no unguessed answers.
- Student copy leads with the next small step.

## Stage 5 — Mohsen Q&A, grounded, and states

Goal: Mohsen is trustworthy, and empty / error / success states are correct everywhere.

Prompt for OpenCode:
```
Stage 5 only. Harden Mohsen Q&A across builder and player: grounded answers only, grounding (material / unit) shown with every answer, no ungrounded chat. Add empty, error and success states for dashboard, builder and player, with icon + word for status, never colour alone. Accessibility: visible focus 2 px maroon outline, 2 px offset, minimum touch target 44 px. Arabic-first, RTL, light theme. Deliver runnable build + Arabic screenshots desktop and phone.
```

Gate:
- No ungrounded Mohsen answer in any flow.
- States match token sheet wording and status colours (wine for error, never brand red for wrong).
- Focus and touch targets pass the token sheet standard.

## Stage 6 — Polish, no new features

Goal: the MVP feels finished, without adding scope.

Prompt for OpenCode:
```
Stage 6 only. Polish only, no new features: buttons, inputs, tags / chips, progress patterns from the token sheet, applied consistently across dashboard, builder and player. Fix any token deviation found in Stages 1–5. Centralise all strings so Arabic wording and the BRIDGIO / Mohsen working names can be swapped in one place. Arabic-first, RTL, light theme. Deliver runnable build + Arabic screenshots desktop and phone.
```

Gate:
- No new feature, no scope creep, no Future Layer flow added.
- All strings centralised, draft Arabic labelled draft, not hard-coded as final in multiple places.
- Token deviations from earlier stages fixed or listed as open questions.

## Stage 7 — Real backend demo + free hosting (dual track closes)

Goal: showable demo, with the mock-to-real switch documented honestly.

Prompt for OpenCode:
```
Stage 7 only. First, switch the adapter base URL by config only (no screen rewrite) and try the Docker demo API (youssefhady/mentingo-demo-api:demo-v1, pull-only, seed data). Document its actual endpoints and list every mismatch vs the Stage 0 proposed contract — do NOT silently rewrite the contract or claim the Docker API matches it. Second, deploy the frontend to a free static host (Vercel / Netlify / Cloudflare Pages, pick one), backend URL from an environment variable, CORS allowing the frontend origin, secrets only in host environment variables, never in code. Deliver: frontend demo URL, backend API URL (or a clear statement that live backend is not yet connected, with the mismatch list), demo teacher / student accounts, and Arabic screenshots of the live demo.
```

Gate (Muse verifies, before any external showing):
- Frontend link works without a local backend.
- If live backend is claimed, it actually works end to end; if not, the mismatch list is complete and the demo is honestly labelled frontend + mock.
- No secret in code, no real teacher / student data, free-tier sleep / cold-start noted.
- Proposed UI values in token sheet §1–§3 are still labelled proposed, not locked, unless the owner locks them separately.

## What NOT to do, in any stage

- Do not resume the abandoned big prompt.
- Do not attach the PowerPoint deck as code context after Stage 0.
- Do not use v1.2, v1.3, v1.3-2, v1.3-fixed, v1.2-2, the traced file.svg, or any DO_NOT_USE wordmark.
- Do not build intelligent marking, pricing, installments, Learn-to-Hire, exotic-language flows, dark theme, or a favicon from the wordmark.
- Do not present the build as locked, final, or external-ready until the owner locks the proposed values and Muse passes Stage 7.
