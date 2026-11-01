# BRIDGIO — AI Build Handoff (frontend MVP)

Builder: OpenCode with DeepSeek 4.1 (already configured, free, as used for Analytica), in a new, separate frontend repo. Paste this whole prompt as the first OpenCode prompt, and give OpenCode the path to the isolated folder containing the files listed under "Files to attach" (do NOT copy those files into the frontend repo). Do not paste a raw chat export. The builder builds; Muse verifies the result separately. Do not send the build to merchants, teachers or any external party — it is an internal MVP until the owner locks the proposed values and approves it.

## Builder setup — OpenCode + DeepSeek 4.1

- Working directory: the NEW frontend repo folder named `bridgio-frontend`, at `C:\Users\Youssef Hady\Desktop\Youssef\Projects\LMS to Hire\bridgio-frontend` (Windows), for BRIDGIO code only. The 10 handoff files do NOT live in that folder — they live in a SEPARATE, isolated folder (owner keeps them isolated from the frontend folder, path to be given by the owner in the first prompt). Do NOT copy the brand files into `bridgio-frontend` as repo files, except for a short docs pointer if OpenCode needs one — read them from the isolated folder by path. Do NOT work inside any Mentingo repo, the Analytica repo, or Mentingo's web UI folder, and do NOT mix this build into the Analytica OpenCode session. Mentingo's local source was DELETED by the owner (storage reason) and is NOT available to read — do NOT try to read `~/mentingo`, do NOT claim you read Mentingo endpoints, and do NOT invent Mentingo endpoints as if they exist. The ONLY Mentingo remainder confirmed by the owner is the Docker images (private Docker Hub `youssefhady/mentingo-demo-api:demo-v1` and `youssefhady/mentingo-demo-web:demo-v1`) — compiled demos, not source, not a git remote.
- Model: DeepSeek 4.1 in OpenCode, already configured and free — the same setup already used for Analytica. No API key setup is needed for this build, and no key should be asked for or pasted in chat. If OpenCode lists a different exact model id for DeepSeek 4.1, use that listed id and note it in the delivery note — do not guess a model id. Keep this BRIDGIO OpenCode session separate from the Analytica OpenCode session.
- First task in OpenCode, before any UI: read the token sheet, the v1.4 deck and the short guide, then write the API adapter contract (see Integration-ready section) as a PROPOSAL. Build UI only after that contract is written. The contract is what Mentingo will implement later when it is restored/rebuilt — it is not a description of existing Mentingo endpoints.
- Stack (owner choice): TanStack — TanStack Start (with TanStack Router + TanStack Query), TypeScript, on Vite. Not Next.js, not plain React Router, not a new framework chosen by the builder. Keep it deployable on a free static host (see Hosting below). No paid service, no paid library, no paid font, no paid image. All fonts and images come from the files attached.
- Commit in small steps, with the token sheet and this handoff in the repo docs folder, so the next session can resume from files, not from chat history.

## What you are building

A new BRIDGIO frontend (product UI on top of Mentingo). Mentingo is the headless engine (API / DB / auth / courses). Do NOT use Mentingo's own web UI as the product UI, do NOT rebuild the backend, and do NOT change Mentingo's database schema. If a needed API endpoint does not exist, stub it with a local mock, list it as a missing endpoint, and keep building — do not invent a backend.

## Integration-ready for Mentingo — this is a requirement, not a later phase

This frontend must be built ready to connect to Mentingo, not as a standalone demo that later needs a rewrite to connect. That changes how you build it:

- **One API adapter layer, and only one.** Every screen, component and action gets its data through a single, typed API client / service layer (for example `src/api/` or `src/services/`). No component calls `fetch` directly, no screen hard-codes data, and no business logic lives in UI components. Swapping the mock adapter for the real Mentingo API must be a configuration change (base URL + adapter), not a rewrite of screens.
- **Mock adapter implements the same interface as the real adapter.** The mock and the real client must share the same types, the same method names, and the same request/response shapes. A screen must not know, and must not care, whether it is talking to the mock or to Mentingo. If a mock shape and a real shape diverge, that is a bug to fix in the adapter, not in the screen.
- **Use Mentingo's existing auth, users and roles.** Do NOT build a separate auth system, a separate user model, or a separate role system. Teacher and student are Mentingo roles / users, reached through Mentingo auth. If Mentingo's exact auth method (token, session, etc.) is not in the files you were given, ask for it in your delivery note as an integration gap — do not invent an auth flow and bake it into the UI.
- **Map every MVP entity to a proposed Mentingo domain entity, and label ALL of it as proposal.** Mentingo source is deleted locally, so there are NO confirmed endpoints in this build. Teacher dashboard, test builder, question editor, student test player and Mohsen Q&A must each map to a proposed concept (course / class / test / question / attempt / material / curriculum) in the adapter contract. Every endpoint in the contract is labelled "PROPOSED — Mentingo to implement on restore/rebuild". Do not present any proposed shape as if Mentingo already provides it, and do not bake a mock-only shape into the UI state.
- **No local-only data store that cannot be swapped.** Local state is for UI state only (which step, which tab, which panel is open). All persistent data — teachers, students, courses, tests, questions, attempts, materials, Mohsen answers and their grounding — goes through the adapter. A refresh, a reload, or a switch from mock to real API must not lose or change the data model.
- **Config, not code, for the connection.** Base URL, environment (mock vs Mentingo), and any feature flag for an unconfirmed endpoint must live in configuration, with the mock as the default for this MVP and the real Mentingo URL as a single config value to change later. Document that config value in the delivery note.
- **Integration checklist in the delivery note.** For each MVP screen, state: which adapter methods it uses, which of those are confirmed Mentingo concepts vs proposed shapes, and which are mocked. An integration checklist with a gap is a pass; a screen with no adapter mapping is a fail, even if it looks finished.

Audience now: Egyptian high-school teachers and their students. Arabic-first, full RTL, light theme only.

## Files to attach (attach all of these, in this order)

1. `BRIDGIO-UI-UX-token-sheet.md` — THE source of truth for the UI. Follow it exactly.
2. `BRIDGIO_Brand_Guidelines_v1.4.pptx` — brand guideline, adopted base, 40 slides.
3. `BRIDGIO-short-brand-guide.md` v1.5 — short brand guide, for brand rules the token sheet does not repeat.
4. `logo-colour.svg` and `logo-bw.svg` — full lockup, for large / cover / splash use.
5. `wordmark-cream.svg` (fill #F9EEDC, for red/maroon backgrounds) and `wordmark-maroon.svg` (fill #2C0706, for cream/paper backgrounds) — adopted clean wordmark, 2026-11-01. Use for small header slots at 120 px width or wider. Never mirrored, never stretched, never recoloured beyond those two fills, never as a favicon.
6. `reactions-sheet.svg` (or `reactions.png`) — Mohsen poses.
7. `BRIDGIO-fonts-to-install.zip` — Sora, Nunito, Alexandria, Baloo Bhaijaan 2.

## Files you must NOT use

- `BRIDGIO_Brand_Guidelines_v1.2.pptx`, `v1.3.pptx`, `v1.3-2.pptx`, `v1.3-fixed.pptx`, `v1.2-2.pptx` — superseded or rejected. v1.2-2 must not be used at all, not even for its teacher mockups.
- The old HTML visual guide (v1.4, Fredoka-era) — superseded by the v1.5 markdown guide.
- Any file named DO_NOT_USE, any derived wordmark, any Fredoka font file. Fredoka is banned everywhere.

## MVP scope — build only this, nothing else

- Teacher dashboard
- Teacher test builder (4 steps) + question editor
- Student test player
- Mohsen Q&A panel: answers curriculum questions grounded in teacher-uploaded material + the fixed Egyptian curriculum, and shows its grounding. No ungrounded chat. Mohsen builds tests from teacher material + fixed curriculum.
- Buttons, inputs, tags, progress, and empty / error / success states for the screens above.

Out of scope for this MVP (do NOT build these, even as placeholders that look finished):
- Intelligent marking (deferred by the owner)
- Installments, student payments, or any price. Teacher subscription only, per student per month, teacher pays, students do not. Price is TBD — leave it blank, do not invent a number.
- Learn-to-Hire flows, exotic / foreign-language flows, or any "Future Layer" screen as a main flow. Those are future layer only, badge/ribbon at most.
- Dark theme, or any theme other than the Arabic-first light theme in the token sheet.

## Tokens — locked, proposed, TBD. Do not blur them.

- LOCKED values in the token sheet are locked. Use them exactly: colours Red #D51C1D / Cream #F9ECD9 / Paper #FFF6E8 / Maroon #2C0706, status Success #1F7A57 / Info #2A62B0 / Warning #F2A93B fill only with maroon text / Error wine #7E1A2B, fonts Sora (Latin display) / Nunito (Latin body) / Alexandria Bold (Arabic display) / Baloo Bhaijaan 2 (Arabic body).
- PROPOSED FOR UI values (§1 neutrals, §2 app type scale, §3 spacing/radius) are proposals, not brand locks. Use them as-is for this MVP, label them as proposed in your delivery note, and do NOT present them as locked brand decisions.
- TBD items carry interim rules in the token sheet. Follow the interim rules exactly: poses only inside red/cream cards, Sora text "Bridgio" or a pose for small header slots, all strings centralised so names and Arabic wording can be swapped later.
- Never use brand red for "wrong". Error is always wine + icon + word. Warning amber as text on cream is never allowed.
- Do not invent a neutral, a type scale, a radius, a small-size mark, a favicon, a loading animation, or a price.

## Logo and Mohsen rules

- Full lockup for large use, adopted wordmark for small header slots (120 px or wider, cream on dark / maroon on light). Never crop a wordmark from the lockup, never present Sora text "Bridgio" as the logo, never use the withdrawn derived wordmark or the traced `file.svg`.
- Never mirror the lockup in RTL. Arabic running text keeps Latin BRIDGIO. Running text is "Bridgio", logo is all-caps BRIDGIO.
- Do not use the full lockup as a favicon. Small-size mark / favicon does not exist yet — use the token sheet interim rule.
- Mohsen (محسن) is one identity: mascot + AI assistant, working name, may change. Mainly nonchalant, supportive and joyful in small doses, disciplined and grounded in work. Never use an emoji as Mohsen.

## Language rules

- Egyptian colloquial for students / casual copy, MSA formal for teachers / certificates / legal / employer copy. Never mix dialects in one message.
- Teacher copy leads with time saved, student copy with the next small step.
- Arabic wording is still draft, awaiting owner approval. Keep every string centralised and editable, do not hard-code Arabic wording into components as if it were final, and do not "fix" Arabic wording on your own.
- Taglines, all three, exact: "From classroom to career." (primary), "Your bridge to what's next." (student-facing), "Learn it. Land it." (campaign-only, exotic languages only — do not use it in the high-school MVP).

## Hosting — both parts on free tiers, to show to people

Goal: a shareable demo link for the frontend — no paid hosting, no local-only demo that only works on the builder's machine. Two tracks, in parallel, owner direction: (A) mock data while work is in progress — frontend + mock adapter only for this phase, with the adapter contract ready for a real backend; (B) real backend demo in process — using the Docker Hub demo images (`youssefhady/mentingo-demo-api:demo-v1`) as the only Mentingo remainder, run pull-only with seed data, document its actual endpoints by running it, and compare them to the adapter contract, listing every mismatch. Do NOT claim the mock demo talks to a live Mentingo backend, do NOT claim Docker image endpoints equal the adapter contract, and do NOT deploy a fake "Mentingo" backend and present it as Mentingo. If the Docker demo API does not match the contract, the mismatch list is the deliverable for that track — not a silent rewrite of the contract or the demo.

- Frontend (BRIDGIO, static): Vercel free, Netlify free, or Cloudflare Pages free. Pick one, deploy from the frontend repo, and document which one and the exact URL. No custom domain needed — use the free subdomain the host gives.
- Backend (Mentingo API): a free Node host — Render free web service, Railway free tier, or Fly.io free tier. Pick one that fits Mentingo's runtime (NestJS, pnpm). Document which one, the exact API URL, and that it may sleep / cold-start on a free tier, so the first load after idle can be slow — that is a free-tier limit, not a bug to hide.
- Database: use the SAME database type Mentingo already uses (check Mentingo's drizzle / env config first — do not assume). If it is Postgres, use Neon free or Supabase free Postgres. If it is another type, pick the matching free tier for that type and document it. Do NOT switch Mentingo to a different database type to fit a host, and do NOT put real teacher or student data in the demo database — demo / seed data only.
- Configuration, not code: frontend gets the backend URL from an environment variable (for example `VITE_API_URL` or the framework's equivalent), backend gets its database URL and secrets from environment variables on the host. Never commit a secret, an API key, or a database password into the repo. List every environment variable the demo needs, with example values only (no real secrets), in the delivery note.
- CORS: the backend must allow the frontend's free-host origin. If CORS is not set, the demo will look broken in the browser even though both parts are live — check this explicitly and document the allowed origin.
- Two links, not one: delivery must include (a) the frontend demo URL, (b) the backend API base URL (and a health / status endpoint if Mentingo has one), and (c) which demo accounts / seed data to use to try the teacher and student flows. A frontend link that only works against a local backend is not a pass.

## What to deliver back

1. A clickable build / preview link, not just code or screenshots — plus the hosted frontend URL and hosted Mentingo API URL from the Hosting section above.
2. A delivery note listing: screens built, screens NOT built, any deviation from the token sheet (with the exact token and what you used instead), any proposed value you changed, and any missing Mentingo endpoint you mocked.
3. Screenshots of the teacher flow and the student flow in Arabic, at desktop and at phone width.
4. Do not claim the build is locked, final, or ready for external launch. It is an internal MVP for owner verification.

## If something is missing or contradicts the token sheet

Stop on that item, use the token sheet interim rule if one exists, otherwise list it as an open question in the delivery note and keep building the rest. Do not invent a value to fill a gap, and do not silently change a locked value to make a screen fit.
