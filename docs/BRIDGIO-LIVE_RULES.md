# BRIDGIO — LIVE RULES

Companion delta sheet to the BRIDGIO build files.
**Authority (owner-approved to save, 2026-11-01 — owner to check this file before it is pasted to OpenCode):** the UI/UX token sheet + this file + the AI build handoff + `BRIDGIO-OpenCode-stages.md` are the SOLE live execution line for OpenCode. Where this file records a post-handoff owner decision, this file wins; on everything else the token sheet wins for UI and the handoff wins for build scope.
**Maintained by Muse after every ruling.** Paste this file alongside the stages document, the handoff and the token sheet in every fresh OpenCode session.
**Status:** Stage 1 VERIFIED PASS and MERGED 2026-11-03 (code PASS + docs-fix PASS, reports: `BRIDGIO-stage1-verification-report.md` and `BRIDGIO-stage1-docs-fix-verification-report.md`) — Stage 1 code and docs fix are both in `main` (docs fix merged via PR #5, merge commit `bc1a812`, after PR #4 had merged it into `opencode-stage0` by mistake and all stale branches were deleted and the docs-fix branch restored). GitHub default branch is `main`. Owner locks LOCKED AS BUILT 2026-11-03 (see §9/§10): dark-band cream values, font-weight substitutions, preview-role switch for Stages 2–4, Lessons/Progress unassigned, small-header breakpoints as built. Stage 2 is authorised (merge + locks both done). Stage 0 VERIFIED PASS from source 2026-11-01. Canonical repo path CONFIRMED 2026-11-01 (owner): `C:\Users\Youssef Hady\Desktop\Youssef\Projects\bridgio-frontend`. Package manager locked to npm 2026-11-01 (see §1). Nothing in this file makes the build locked, final, or external-ready. Free hosting (Vercel etc.) is Stage 7 only — Stages 1–2 are local builds, not deployed.

## 0. What this file is not

- It does not replace the token sheet, the handoff, or the stages document. It records rulings and drift points on top of them.
- It does not invent a lock. Values are labelled LOCKED, PROPOSED FOR UI, or TBD exactly as in the token sheet. A PROPOSED value becomes a brand value only when the owner locks it explicitly.
- Superseded or rejected material is archive only — never execute from it (see §7).

## 1. Stack and theme discipline (locked)

- **Stack, locked:** TanStack Start + TanStack Router + TanStack Query, TypeScript, on Vite. Not Next.js, not plain React Router, not a new framework chosen by the builder.
- **Package manager, locked 2026-11-01 (owner decision: Keep npm for BRIDGIO):** npm, with `package-lock.json`. Commands are `npm test`, `npm run typecheck`, and `npm run build` as reported in Stage 0. Not bun (Analytica's manager) and not pnpm (Mentingo's manager) — managers are per-repo. Worktree startup uses the `npm ci` path for BRIDGIO.
- **Audience and language, locked:** Egyptian high-school teachers and their students first. Arabic-first, full RTL, light theme only, for every stage. No dark theme is specified — do not invent one.
- **Future layer, not MVP:** exotic / foreign languages (18–28) and Learn-to-Hire are future layer only. Do not build them as main MVP flows; a badge / ribbon label at most.
- **No paid anything:** no paid service, library, font, or image in any stage.

### Colours — LOCKED

- Brand red: `#D51C1D`
- Accent red, logo artwork only, sparingly for fills / emphasis, never as a second primary: `#F41920`
- Cream, app background: `#F9ECD9` — the deck also uses `#F9EEDC` for the logo fill; use `#F9EEDC` only inside logo artwork.
- Paper, surface: `#FFF6E8`
- Maroon / ink: `#2C0706`
- Logo outline dark: `#471E1B`
- Status — Success: `#1F7A57` · Info: `#2A62B0` · Warning: `#F2A93B` **fill only** · Error: wine `#7E1A2B`
- Old error red `#A8141A` is removed. Do not pull it from the old theme, and do not use it in UI.

### Colour rules — LOCKED

- Body text: maroon on cream, 15.8:1. This is the default text pairing.
- Brand red is NOT status red. In quizzes and marking, red must not automatically mean "wrong".
- `#F41920` on cream is 3.65:1 — never for text.
- `#D51C1D` on cream is 4.49:1, cream on `#D51C1D` is 4.56:1 — headlines / large bold text only, never small body copy. Small body / label text: maroon on cream / paper only. Small CTA buttons: maroon background + cream text, not brand-red background, unless the button text is 18 px+ bold.
- Status: always icon + word, never colour alone. Warning is fill only with maroon text (9.2:1); never amber text on cream (1.71:1).
- Mascot on red: Mohsen's body is the same red as the brand, so he loses his silhouette on a red background. Use cream or dark backgrounds for mascot poses. Do not put a pose directly on brand red.

### Fonts — LOCKED

- Latin display / headings: Sora, Bold / SemiBold (500–700). Never for long paragraphs or tiny UI labels.
- Latin body / labels: Nunito, Regular to ExtraBold (400–800).
- Arabic display / headings: Alexandria Bold.
- Arabic body (long reading): Baloo Bhaijaan 2 Regular (400).
- Arabic UI labels: Alexandria (Alexandria remains for Arabic display / UI, Baloo for longer Arabic reading).
- Fredoka: banned everywhere.
- Never retype the wordmark in any font. The wordmark is custom bubble lettering, not Sora.

### PROPOSED FOR UI — §1 neutrals, §2 type scale, §3 spacing / radius (not brand locks)

Use them as-is for the MVP, label them as proposed in the delivery note, and do NOT present them as locked brand decisions. Owner lock of §1–§3 is pending (§9).

- Neutrals, as opacity over locked colours, so no new brand hex is invented: text secondary maroon at 70% `rgba(44, 7, 6, 0.70)`; text muted / caption maroon at 55%; border / divider maroon at 12%; card border / outline maroon at 18%, or a 1–2 px solid maroon outline in sticker style; disabled background paper with maroon at 8% overlay, disabled text maroon at 40%; hover background maroon at 4% over paper / cream; focus ring maroon, 2 px, offset 2 px.
- App type scale (the deck's 120 / 72 / 44 / 32 / 24 px scale is a presentation scale, NOT an app scale): hero / page title 32 px, Sora Bold / Alexandria Bold, 1.2; H1 28 px, 1.25; H2 22 px, Sora SemiBold / Alexandria Bold, 1.3; H3 18 px, 1.35; body 16 px, Nunito / Baloo Bhaijaan 2, 1.55; body small 14 px, 1.5; label / button 15 px, Nunito SemiBold / Alexandria SemiBold, 1.4; caption 12 px, 1.45.
- Spacing base 4 px, scale 4, 8, 12, 16, 24, 32, 48, 64. Card radius 24 px. Input radius 12 px. Modal / sheet radius 24 px. Chip / tag / pill radius 999 px. Button radius 999 px (pill); secondary button pill outline, maroon border.
- Touch target: minimum 44 px height for buttons, inputs and list rows.
- Shadows: none as a brand device. Use the sticker style: solid surface + 1–2 px maroon outline, not drop shadows. If a shadow is technically needed for a modal, use one soft maroon-tinted shadow and mark it as an exception, not a brand pattern.
- Layout: Arabic-first RTL. Header placement flips in RTL, but the logo lockup NEVER mirrors — Mohsen stays on the same side of BRIDGIO as in the original.
- Logo clear space: x on every side, where x = height of the letter B in the logo. Minimum logo width: 200 px / 50 mm.

## 2. Logo and Mohsen rules (locked, with TBD interim rules)

- Full lockup for large / cover / splash use. Colour lockup on light backgrounds; B&W lockup for single-colour / print / certificates.
- Wordmark-only, ADOPTED 2026-11-01 (verified clean vector, 9 paths, transparent background, tight viewBox, rendered clean on red / maroon / cream / paper at large, 200 px and 120 px): `wordmark-cream.svg` (fill `#F9EEDC`, for red / maroon backgrounds) and `wordmark-maroon.svg` (fill `#2C0706`, for cream / paper backgrounds). Use for small header slots at 120 px width or wider. Never mirrored, never stretched, never recoloured beyond those two fills, never with effects, never as a favicon.
- Do not cut the mascot off the lockup (his hand overlaps the B in the lockup), do not retype the wordmark, do not use the withdrawn derived wordmark or the traced `file.svg` — both are rejected.
- For mascot-only uses: use a pose from the 16-pose reactions sheet, not a cut-out of the lockup. Mohsen in product UI: empty states, streaks, quiz feedback, help — not on every screen. Mascot mode (delight) vs Assistant mode (trust): in Assistant mode Mohsen is more careful and verifiable than playful.
- Running text: "Bridgio" in Latin, logo itself all-caps BRIDGIO, never retyped. In Arabic running text, keep Latin BRIDGIO. No Arabic wordmark, by decision.
- **TBD — DO NOT INVENT, interim rules only (internal build):** small-size mark / favicon / app icon (16–32 px) — use "Bridgio" set in Sora as text (not presented as the logo), or a Mohsen pose inside a red rounded card, until the illustrator supplies a clean small mark; never the full lockup at 16–32 px and never the withdrawn wordmark. Transparent mascot cutouts — poses only inside red or cream cards (sticker style), never as a transparent overlay, until the illustrator supplies transparent, individually named cutouts. Mohsen loading animation — static dark-swirl / loading pose with a standard progress indicator, labelled as pending.

## 3. MVP scope and prototype locks (locked 2026-10-28, unless noted)

Build only this, nothing else, in this phase:

- Teacher dashboard: classes, recent tests, student progress at a glance.
- Teacher test builder as a real flow, 4 steps: (1) choose material or curriculum unit, (2) Mohsen drafts questions, (3) teacher reviews and edits — every generated question editable / deletable before publishing, (4) publish to the class. Plus a question editor.
- Student test player: Question 1, options, Submit, progress, with the Mohsen Q&A panel on the same screen.
- Mohsen Q&A panel: answers curriculum questions grounded in teacher-uploaded material + the fixed Egyptian curriculum only, and shows its grounding (material / unit) with the answer. No ungrounded chat. If Mohsen does not know from the material, say so — do not guess. Mohsen builds tests from teacher material + fixed curriculum.
- Buttons, inputs, tags, progress, and empty / error / success states for the screens above. States, with icon + word, never colour alone: Empty ("Nothing here yet" + Mohsen wakes up pattern), Error ("Our side, not yours. Try again in a moment."), Success ("Unit complete. Nice. Next unit is ready when you are.").
- Buttons: primary maroon bg, cream text, pill; secondary pill outline, maroon text; danger / error actions use wine `#7E1A2B`, never brand red for "wrong".
- Inputs: 12 px radius, maroon border on focus, label above input, helper text below.
- Tags / chips: pills. Progress: progress bar + "Unit 3 · 64%" pattern; streak and lesson-count patterns from the dashboard examples, applied to teacher / student progress, not to exotic-language streaks.
- Course card: as in the deck (title, units / lessons, certificate note) — for teacher classes / units in MVP, not for German A1 etc. in MVP.

Out of scope for this MVP (do NOT build these, even as placeholders that look finished):

- Intelligent marking — deferred by the owner (2026-10-28, Youssef to decide). Do not build or promise it in UI copy.
- Installments, student payments, or any price in this phase. Teacher subscription only, priced per student per month, teacher pays, students do not. Price is TBD — leave it blank, do not invent a number.
- Learn-to-Hire flows, exotic / foreign-language flows, or any "Future Layer" screen as a main flow. Those are future layer only, badge / ribbon at most. Exotic-language courses, native-mentor flows, Jobs / Learn-to-Hire matching, certificates for German A1 etc. are Future Layer examples in the deck, not MVP product flows.
- Dark theme, or any theme other than the Arabic-first light theme in the token sheet.

Prototype framing (owner, 2026-10-28): Arabic-first UI; prototype offered as one of their services, not as a standalone product sale; MVP wedge is high-school teachers / students first to bootstrap / fundraise, then teacher-backed traction for Learn-to-Hire mentors.

## 4. Voice and copy rules (locked)

- Student-facing / casual: Egyptian colloquial Arabic, plus simple English where the product uses it. Calm, encouraging, nonchalant: short sentences, no panic, no hustle talk.
- Teacher / admin / formal (teachers, parents, certificates, legal, employer copy): MSA formal, plus clear English for product terms. Respectful, time-saving, direct about what Mohsen can and cannot do.
- Never mix dialects in one message.
- Teacher copy leads with time saved (tests, revision, follow-up), not with hiring promises.
- Student copy leads with the next small step, not career pressure.
- Taglines, all three, exact: "From classroom to career." (primary, long story / decks / sales to teachers about what comes next); "Your bridge to what's next." (student-facing product moments); "Learn it. Land it." (campaign-only, exotic languages only — do not use it in the high-school MVP, never as the main product line).
- Arabic wording is still draft, awaiting owner approval. Keep every string centralised and editable, do not hard-code Arabic wording into components as if it were final, and do not "fix" Arabic wording on your own. Arabic taglines and new v1.3 Arabic are drafts awaiting approval.
- BRIDGIO and Mohsen are working names and may still change. Centralise both names in UI strings and assets so a rename is a swap, not a rebuild. BRIDGIO is a working name for now, not locked final (see §9).

## 5. Integration-ready for Mentingo — a requirement, not a later phase

Mentingo is the headless engine (API / DB / auth / courses). BRIDGIO is the product / brand / experience on top, its own frontend first. Mentingo's web UI is NOT the product UI. Do NOT rebuild the backend, and do NOT change Mentingo's database schema.

- **One API adapter layer, and only one.** Every screen, component and action gets its data through a single, typed API client / service layer (for example `src/api/` or `src/services/`). No component calls `fetch` directly, no screen hard-codes data, and no business logic lives in UI components. Swapping the mock adapter for the real Mentingo API must be a configuration change (base URL + adapter), not a rewrite of screens.
- **Mock adapter implements the same interface as the real adapter.** The mock and the real client must share the same types, the same method names, and the same request / response shapes. A screen must not know, and must not care, whether it is talking to the mock or to Mentingo. If a mock shape and a real shape diverge, that is a bug to fix in the adapter, not in the screen.
- **Use Mentingo's existing auth, users and roles.** Do NOT build a separate auth system, a separate user model, or a separate role system. Teacher and student are Mentingo roles / users, reached through Mentingo auth. If Mentingo's exact auth method (token, session, etc.) is not in the files you were given, ask for it in your delivery note as an integration gap — do not invent an auth flow and bake it into the UI.
- **Map every MVP entity to a proposed Mentingo domain entity, and label ALL of it as proposal.** Mentingo source is deleted locally, so there are NO confirmed endpoints in this build. Teacher dashboard, test builder, question editor, student test player and Mohsen Q&A must each map to a proposed concept (course / class / test / question / attempt / material / curriculum) in the adapter contract. Every endpoint in the contract is labelled "PROPOSED — Mentingo to implement on restore / rebuild". Do not present any proposed shape as if Mentingo already provides it, and do not bake a mock-only shape into UI state.
- **No local-only data store that cannot be swapped.** Local state is for UI state only (which step, which tab, which panel is open). All persistent data — teachers, students, courses, tests, questions, attempts, materials, Mohsen answers and their grounding — goes through the adapter. A refresh, a reload, or a switch from mock to real API must not lose or change the data model.
- **Config, not code, for the connection.** Base URL, environment (mock vs Mentingo), and any feature flag for an unconfirmed endpoint must live in configuration, with the mock as the default for this MVP and the real Mentingo URL as a single config value to change later (for example `VITE_API_URL` or the framework's equivalent). Document that config value in the delivery note.
- **Integration checklist in the delivery note.** For each MVP screen, state: which adapter methods it uses, which of those are confirmed Mentingo concepts vs proposed shapes, and which are mocked. An integration checklist with a gap is a pass; a screen with no adapter mapping is a fail, even if it looks finished.
- If a needed API endpoint does not exist, stub it with a local mock, list it as a missing endpoint, and keep building — do not invent a backend.

### Mentingo remainder — the only confirmed facts

- Mentingo local repo DELETED by the owner (2026-11-01, storage / Docker reason). OpenCode CANNOT read Mentingo's api source locally. Do NOT try to read `~/mentingo`, do NOT claim you read Mentingo endpoints, and do NOT invent Mentingo endpoints as if they exist.
- ONLY Mentingo remainder confirmed: the Docker images (private Docker Hub `youssefhady/mentingo-demo-api:demo-v1` and `youssefhady/mentingo-demo-web:demo-v1`) — compiled demos, not source, not a git remote.
- Do NOT claim a live Mentingo connection until Stage 7, and then only if it actually works. Stage 7 dual track: (A) mock data while work is in progress, adapter contract ready for a real backend; (B) real backend demo in process via the Docker demo API, pull-only, seed data, document its actual endpoints by running it, and list every mismatch vs the Stage 0 proposed contract. Do NOT claim the mock demo talks to a live Mentingo backend, do NOT claim Docker image endpoints equal the adapter contract, and do NOT deploy a fake "Mentingo" backend and present it as Mentingo. If the Docker demo API does not match the contract, the mismatch list is the deliverable — not a silent rewrite of the contract or the demo.

## 6. Process rules — Analytica-style, adapted for BRIDGIO

- **One stage at a time, gated.** Build in `BRIDGIO-OpenCode-stages.md` order: Stage 0 scaffold + adapter contract, Stage 1 shell / tokens / RTL / header, Stage 2 teacher dashboard, Stage 3 test builder, Stage 4 student player, Stage 5 Mohsen grounding + states, Stage 6 polish (no new features), Stage 7 real backend demo + free hosting. Do one stage, stop, verify, then do the next. A stage is not done until its gate passes.
- **Fresh session per stage.** Start a NEW OpenCode session per stage, separate from the Analytica OpenCode session. Do NOT work inside any Mentingo repo, the Analytica repo, or Mentingo's web UI folder, and do NOT mix this build into the Analytica OpenCode session.
- **Builder builds, Muse verifies.** An AI build chat builds; Muse verifies only — Muse does not build directly, same split as the deck route. Do not send the build to merchants, teachers or any external party — it is an internal MVP until the owner locks the proposed values and approves it.
- **Model:** OpenCode with DeepSeek 4.1, already configured and free, as used for Analytica. No API key setup is needed, and no key should be asked for or pasted in chat. If OpenCode lists a different exact model id for DeepSeek 4.1, use that listed id and note it in the delivery note — do not guess a model id.
- **Stop the previous run before starting Stage 0.** The single big first prompt that ran 11+ minutes with no files is abandoned — do not resume it.
- **Work in checkpointed batches** (small commits, one per item where practical) so a lost session never loses the thread. Locked values live in the repo's docs / token sheet, not in chat history.
- **Gate discipline:** after each stage, the owner brings the build + delivery note + screenshots to Muse for verification against the token sheet. Do NOT start the next stage until Muse passes the gate, or the fixes for that stage are done. If a gate fails, fix in the same stage — do not carry the failure into the next stage.
- **Verification is by running / clicking the built artifact where behaviour matters,** not by inspecting code alone. At the end of every stage, OpenCode must deliver: (1) a runnable local build, (2) Arabic screenshots at desktop and phone width, (3) a short delivery note: what changed, what was NOT built, deviations from the token sheet, and open questions. No stage claims to be final or external-ready.
- **If something is missing or contradicts the token sheet:** stop on that item, use the token sheet interim rule if one exists, otherwise list it as an open question in the delivery note and keep building the rest. Do not invent a value to fill a gap, and do not silently change a locked value to make a screen fit.
- **No paid service, library, font or image.** No intelligent marking, no price, no installments, no Learn-to-Hire or exotic flows, no dark theme, in any stage. Do not present the build as locked, final, or external-ready until the owner locks the proposed values and Muse passes Stage 7.

### GitHub — BRIDGIO repo

- Private repo, created by the owner 2026-11-01: `https://github.com/youssefhady-eg/bridgio-frontend`
- Local working directory (code only, CONFIRMED 2026-11-01, owner): `C:\Users\Youssef Hady\Desktop\Youssef\Projects\bridgio-frontend` — this supersedes the earlier `LMS to Hire\bridgio-frontend` path in the stages doc, handoff, and §10 below. Do not work in the `LMS to Hire` path.
- Local folder was initialised on branch `master` with no commits yet. Rename to `main` before the first commit (for example, on an empty repo, `git symbolic-ref HEAD refs/heads/main`) to match the Analytica / GitHub `main` convention. This rename was instructed, not yet confirmed done at save time — check `git status` before Stage 0.
- Remote, confirmed linked 2026-11-01: `origin https://github.com/youssefhady-eg/bridgio-frontend` (fetch and push). `git ls-remote origin` returning no error and no refs on an empty repo is success: the repo exists, access works, it has no commits / branches yet, so there is nothing to list.
- Private does not block the owner / OpenCode on the owner's machine: Analytica's repo is private too and OpenCode pushes to it. Private blocks strangers, not the owner. First push from a different account may ask for a browser sign-in once — never paste a token into chat.
- Branch per stage: `opencode-stage0`, `opencode-stage1`, and so on. Push the branch only. Do NOT merge to `main` until Muse passes that stage's gate. The owner merges, as in Analytica. Since the repo was empty at save time, there is no `main` yet to merge into — after the first gated stage, that branch becomes `main`.
- `.gitignore` must cover `node_modules`, `.env`, and secrets. Never commit a secret, an API key, or a database password into the repo.
- **Muse verification route (same limit as Analytica):** Muse cannot pull a private repo directly. For each gate, the owner brings a branch export, as a zip one level up, not inside the repo — for example `git archive --format=zip -o '..\bridgio-stage0.zip' opencode-stage0` — plus the delivery note and screenshots. Do not put the zip inside `bridgio-frontend`.

### Hosting — Stage 7 only, free tiers

Goal: a shareable demo link, no paid hosting, no local-only demo that only works on the builder's machine.

- Frontend (BRIDGIO, static): Vercel free, Netlify free, or Cloudflare Pages free. Pick one, deploy from the frontend repo, document which one and the exact URL. No custom domain needed — use the free subdomain the host gives.
- Backend (Mentingo API): a free Node host — Render free web service, Railway free tier, or Fly.io free tier. Pick one that fits Mentingo's runtime (NestJS, pnpm). Document which one, the exact API URL, and that it may sleep / cold-start on a free tier, so the first load after idle can be slow — that is a free-tier limit, not a bug to hide.
- Database: use the SAME database type Mentingo already uses (check Mentingo's drizzle / env config first — do not assume). If it is Postgres, use Neon free or Supabase free Postgres. If it is another type, pick the matching free tier for that type and document it. Do NOT switch Mentingo to a different database type to fit a host, and do NOT put real teacher or student data in the demo database — demo / seed data only.
- Configuration, not code: frontend gets the backend URL from an environment variable, backend gets its database URL and secrets from environment variables on the host. Never commit a secret, an API key, or a database password into the repo. List every environment variable the demo needs, with example values only (no real secrets), in the delivery note.
- CORS: the backend must allow the frontend's free-host origin. If CORS is not set, the demo will look broken in the browser even though both parts are live — check this explicitly and document the allowed origin.
- Two links, not one: delivery must include (a) the frontend demo URL, (b) the backend API base URL (and a health / status endpoint if Mentingo has one), and (c) which demo accounts / seed data to use to try the teacher and student flows. A frontend link that only works against a local backend is not a pass. If live backend is not yet connected, say so clearly with the mismatch list, and label the demo honestly as frontend + mock.
- Private-repo note: as in Analytica, branch previews may sit behind a login / deployment-protection wall on a private repo. Expect the live gate to run on production after the owner's merge, not on a preview, until that setting is changed.

## 7. Files per stage and banned files

The 10 handoff files live in a separate, isolated folder as storage and are NOT all given at once. The isolated folder's path has NOT yet been given by the owner — do not assume it. Attaching the stage's files directly in the OpenCode session is an acceptable alternative for Stage 0.

- Stage 0 uses only: `BRIDGIO-LIVE_RULES.md`, `BRIDGIO-OpenCode-stages.md`, `BRIDGIO-AI-build-handoff.md`, `BRIDGIO-UI-UX-token-sheet.md`. (LIVE_RULES added after it was saved, per owner approval to provide it; it is pasted in every fresh session thereafter, alongside the stage's files.)
- Stage 1 adds: `logo-bw.svg`, `logo-colour.svg`, `wordmark-cream.svg`, `wordmark-maroon.svg`, and fonts (Sora, Nunito, Alexandria, Baloo Bhaijaan 2).
- Stages 2–4 add no new files.
- Stage 5 adds: the reactions sheet.
- Stage 7 adds: the Docker demo image details.
- The v1.4 PowerPoint is reference for Muse / owner verification only, never OpenCode code context. Do NOT attach it as code context after Stage 0.
- Source of truth, in order: token sheet, then v1.4 deck (reference only), then short brand guide v1.5.

**Never use:**

- `BRIDGIO_Brand_Guidelines_v1.2.pptx`, `v1.3.pptx`, `v1.3-2.pptx`, `v1.3-fixed.pptx`, `v1.2-2.pptx` — superseded or rejected. v1.2-2 must not be used at all, not even for its teacher dashboard / test builder / student app mockups. Muse v1.2, built from the old 37-slide file, does not match the adopted line and was also rejected.
- The old HTML visual guide (v1.4, Fredoka-era) — superseded by the v1.5 markdown guide.
- Any file named DO_NOT_USE, any derived wordmark, the traced `file.svg`, any Fredoka font file. Fredoka is banned everywhere.
- Do NOT copy the brand files into `bridgio-frontend` as repo files, except for a short docs pointer if OpenCode needs one, and except for the runtime assets a stage actually needs to build / deploy (for example, Stage 1 wordmarks and fonts). Read the source pack from the isolated folder by path; do not let the whole pack become repo files.

## 8. Stage gates (Muse verifies)

For every stage, the gate is:

- App runs locally, no errors.
- Data comes through the adapter / mock only, no hard-coded data in components, no `fetch` in components.
- Tokens match the sheet exactly for LOCKED values; PROPOSED values used as-is and labelled proposed; no invented colours, fonts, spacing, or features.
- Copy, language, and status rules in §2–§4 hold; no intelligent marking, price, installments, Learn-to-Hire, exotic, or dark-theme scope has crept in.
- Delivery note is complete: what changed, what was NOT built, deviations from the token sheet (with the exact token and what was used instead), any proposed value changed, any missing Mentingo endpoint mocked, and open questions.
- Arabic screenshots at desktop and phone width are included (for Stage 0, the runnable empty app + adapter / contract, not feature screens).

Stage-specific gates are in `BRIDGIO-OpenCode-stages.md` and are not repeated here to avoid drift. If a stage gate and this file ever disagree, stop and ask the owner — do not silently pick one.

## 9. Open items — do not let an agent fill these by assumption

- Price: TBD, blank in UI. Teacher subscription only, per student per month, teacher pays.
- Secondary / neutral colours: PROPOSED opacity neutrals in token sheet §1, pending owner lock.
- UI type scale / spacing / radius: PROPOSED values in token sheet §2–§3, pending owner lock. Owner locks these in one approval, or changes them.
- Arabic final wording: draft, centralised, labelled draft, pending owner / Arabic reviewer pass.
- Small-size mark / favicon / app icon, transparent mascot cutouts, Mohsen loading animation: TBD, interim rules in §2 only.
- BRIDGIO name / domain / trademark: working name, not locked final. An unrelated US company uses Bridgio / bridgio.io — domain / trademark check still open. Do not print, buy domains, or ship externally on the assumption it is locked.
- Mohsen name: working name, may still change.
- Website / handle / company / price placeholders: keep `[website]`, `[@handle]`, `[company name]`, `[price]` as placeholders in UI copy. "Not now" for this phase.
- Mentingo database type, Mentingo auth method, and every Mentingo endpoint: unconfirmed / proposed only. Ask in the delivery note as gaps; do not assume or invent.
- Isolated folder path for the 10 handoff files: not yet given by the owner.
- Local branch rename (`master` → `main`): instructed, not yet confirmed done.
- Stage 0 result: VERIFIED PASS from source 2026-11-01 (report: `BRIDGIO-stage0-verification-report.md`). Branch `opencode-stage0`, commit `8ebafda0906ef6b8946a4bd5da216b1758296a2a` (builder-reported; a `git archive` zip carries no `.git`, so the owner confirms branch/commit/main-untouched in GitHub before merging). Merge authorised. Canonical repo path CONFIRMED by owner 2026-11-01: `C:\Users\Youssef Hady\Desktop\Youssef\Projects\bridgio-frontend`. Stage 1 is authorised, with its first step = the docs refresh: Stage 1 must attach Muse's CURRENT files and replace the stale `docs/` copies in the repo (zip copies predate the npm lock, the stages rewrite of the handoff, and the adopted wordmark).
- Stage 1 result: VERIFIED code PASS / docs FAIL 2026-11-03 (report: `BRIDGIO-stage1-verification-report.md`). Zip 2,052,496 bytes, SHA-256 `35b19abeb696698db65d3fc28f5217397c302ce57da1479bc5559dfd4a17f9f3`; Muse re-ran `npm test` 29/29, typecheck pass, build pass (client + SSR), rendered preview SSR `lang="ar" dir="rtl"` with correct header widths and nav. Code gate PASS (locked tokens verbatim, fonts load with flagged weight substitutions, RTL/header legible, adopted wordmark never mirrored/stretched/favicon, placeholders only, adapter identical to Stage 0). Docs refresh FAIL: repo `docs/` copies were replaced from the owner's local handoff folder (`LMS to Hire\BuildDocs`), not from Muse's current files, so they still say Stage 0 not verified, `LMS to Hire` path, "paste the whole prompt", and wordmark TBD — all superseded. **Update 2026-11-03: Stage 1 code IS in `main` (owner-confirmed: `src/styles/tokens.css` and `src/components/AppHeader.tsx` are on `main`), merged despite the docs FAIL; `opencode-stage0` is 1 merge commit ahead of `main` (Merge PR #3 from `main`, `1d9a0b2`) with an identical tree. The docs fix therefore moves: branch off `main` (e.g. `opencode-stage1-docs-fix`), NOT off the already-merged `opencode-stage1`; replace the four repo `docs/` copies with Muse's current files, docs only (plus any owner-locked code change named in the note), push branch only, re-export, Muse re-checks docs diff = zero. Stage 2 NOT authorised until that fix passes and its branch is merged into `main` by the owner. GitHub default branch is still `opencode-stage0` at last screenshot — change it to `main` when the docs fix merges, not before. Owner must also sync the handoff folder with Muse's current four files before the next OpenCode session, or the next stage will re-import the same stale set.**
- Stage 1 docs-fix result: VERIFIED PASS 2026-11-03 (report: `BRIDGIO-stage1-docs-fix-verification-report.md`). Zip 2,057,369 bytes, SHA-256 `75f5a01c376cc989ea1477d718f4595fdaaf01934aea97d09e07f20f7b7a9f65e`; branch `opencode-stage1-docs-fix` off `main` at `a46252f`, commit `6ed538e` (builder-reported; zip has no `.git`, owner confirms branch tip and `main` still `a46252f` before merging). Four docs byte-identical to Muse's current files (MD5s in the report); `src/`/`public`/config content-identical to Stage 1 once line endings are stripped (Stage 1 zip was CRLF, fix zip is LF via `core.autocrlf=false` — not a code change); README/docs/README status pointers accurate; new delivery note only. Muse re-ran `npm test` 29/29, typecheck pass, build pass. Merge of the docs-fix branch into `main` is authorised (owner, in GitHub); after that merge, change GitHub default branch to `main` and delete stale `opencode-stage0`/`opencode-stage1` branches. Stage 2 is authorised to be briefed after that merge, with its brief settling the open locks (dark-band values, font weights, preview-role switch, Lessons/Progress assignment, breakpoints).
- Stage 1 docs-fix merge into `main`: DONE 2026-11-03 via PR #5 (not PR #4, which had merged into `opencode-stage0` because the default branch was still `opencode-stage0` at PR creation; all stale branches were then deleted, the docs-fix branch was restored from PR #4, compared base `main` / compare `opencode-stage1-docs-fix` as "Able to merge", 3 commits, 7 files). PR #5 merged 3 commits into `main` from `opencode-stage1-docs-fix`, merge commit `bc1a812`, 2 checks passed, 7 files changed. `main` now contains Stage 1 code + the verified docs fix. GitHub default branch is `main`. The docs-fix branch may now be safely deleted (GitHub's own "can be safely deleted" notice on PR #5).
- Owner locks LOCKED AS BUILT 2026-11-03 (owner decision, "Lock as built"): (1) Dark-band values as built — cream secondary 75%, border 24%, hover 8% on maroon, cream focus ring on the dark band. (2) Font-weight substitutions as built — Alexandria Bold declared as 600 (no SemiBold in pack), Nunito 700 max (no ExtraBold). (3) Preview-role switch `?as` kept for Stages 2–4, removed when Mentingo auth lands. (4) Student Lessons / Progress explicitly unassigned — placeholders stay "not assigned yet — no promises", no stage promised. (5) Small-header breakpoints as built — dark band + wordmark-cream on phone, maroon wordmark on light 768–1023, full lockup ≥1024. These five are now locked; the rest of token sheet §1–§3 remains PROPOSED FOR UI until separately locked. Stage 2 builds on these values as-is and does not re-open them.

## 10. Rulings log (owner decisions, in date order)

- **2026-10-28 — Prototype locks:** teacher subscription only, per student per month, teacher pays, students do not; NO installments in high-school-teacher phase; NO intelligent marking in prototype (deferred, Youssef to decide); Arabic-first UI; prototype offered as one of their services, not a standalone product sale.
- **2026-10-31 / 2026-11-01 — Brand locks:** fonts Sora (Latin display), Nunito (Latin body), Alexandria Bold (Arabic display), Baloo Bhaijaan 2 (Arabic body); Fredoka removed. Taglines: 'From classroom to career.' (primary) + 'Your bridge to what's next.' (student-facing) + 'Learn it. Land it.' (exotic-language campaigns only). Sales Engineer accepted Claude's first presentation with Youssef's edits — brand direction agreed.
- **2026-11-01 — Clean wordmark ADOPTED:** user-uploaded `clean_vector.svg` verified — 9 paths, transparent background, tight viewBox, rendered clean on red / maroon / cream / paper at large, 200 px and 120 px. Normalised to brand fills and saved as `wordmark-cream.svg` (`#F9EEDC`) and `wordmark-maroon.svg` (`#2C0706`). Wordmark-only allowed for small header slots at 120 px or wider, never mirrored, never as favicon.
- **2026-11-01 — Deck base ADOPTED:** v1.4, Claude's fix from v1.3-2, verified by Muse — only cover version (1.3 → 1.4), slide 22 AR assistant and slide 29 Arabic taglines changed; all other slides identical to v1.3-2. Token sheet stands — no token changed by v1.4. PowerPoint check still recommended before external hand-over.
- **2026-11-01 — Rejections (do not re-use):** v1.2-2 rejected completely; traced `file.svg` wordmark rejected (traced vectorization of the JPEG, not a clean illustrator wordmark); derived wordmark-only file withdrawn, renamed DO_NOT_USE; Muse v1.2 (old 37-slide file) rejected and must not be used as a base.
- **2026-11-01 — Mentingo migration:** Mentingo local repo DELETED (storage / Docker reason); Mentingo is the headless engine, BRIDGIO is the product / brand / experience on top, its own frontend first. As-is demo held, not shipping interim; diagnostic, disk / delete and handover-folder threads parked until the rebranded build; demo rebuild after rebrand stands.
- **2026-11-01 — Frontend folder and builder:** new local folder `C:\Users\Youssef Hady\Desktop\Youssef\Projects\LMS to Hire\bridgio-frontend` for code only; 10 handoff files in a separate isolated folder, not in that folder. Builder: OpenCode with DeepSeek 4.1, separate session from Analytica, Muse verifies only. Handoff delivered, then the single big OpenCode prompt abandoned after 11+ minutes with no files — do not resume it.
- **2026-11-01 — Stages rewrite:** plan rewritten as Analytica-style stages in `BRIDGIO-OpenCode-stages.md` (Stage 0–7, one stage at a time, stop, Muse verifies gate, then next stage). Handoff updated to point to stages, not the big prompt.
- **2026-11-01 — GitHub direct:** owner created private repo `bridgio-frontend` on GitHub; local folder linked as origin to `https://github.com/youssefhady-eg/bridgio-frontend`; `git ls-remote origin` returning no error and no refs confirmed the empty repo and access. Stage 0 to run on branch `opencode-stage0`, pushed as a branch only, merged to `main` only after Muse passes the gate.
- **2026-11-01 — This file:** LIVE_RULES saved per owner approval, as a draft for owner check before it is pasted to OpenCode. It records existing locks only; it does not lock any new value by itself.
- **2026-11-01 — Package manager LOCKED:** owner decision "Keep npm for BRIDGIO". BRIDGIO uses npm, not bun and not pnpm. This lock was made after the Stage 0 report used npm, and it confirms that choice rather than changing it — no Stage 0 rework was needed for the manager.
- **2026-11-01 — Stage 0 delivered, not verified:** branch `opencode-stage0`, commit `8ebafda0906ef6b8946a4bd5da216b1758296a2a`, pushed, not merged, main not pushed or changed. Builder claims 23/23 tests, typecheck and build pass, adapter-status page only, 37 PROPOSED adapter methods. Muse verification pending zip upload.
- **2026-11-01 — Stage 0 VERIFIED PASS from source:** Muse re-ran from the uploaded zip (188,757 bytes, SHA-256 `ad2c1c8…1bfb5`): `npm ci` 134 packages, `npm test` 23/23 (3 files), typecheck pass, build pass (client + SSR), built preview SSR renders `lang="ar" dir="rtl"` status page. Adapter 37 methods counted, mock/HTTP parity tested, every endpoint PROPOSED, status page only, locked colours only, no marking, no secrets. Merge authorised. Residue: branch/commit/main facts need GitHub confirmation (zip has no `.git`); repo `docs/` copies are stale (predate npm lock, stages handoff rewrite, adopted wordmark) and must be replaced from Muse's current files at Stage 1.
- **2026-11-01 — Canonical repo path CONFIRMED (owner):** `C:\Users\Youssef Hady\Desktop\Youssef\Projects\bridgio-frontend`. This supersedes the earlier `LMS to Hire\bridgio-frontend` path. Stage 1 is authorised from this folder, with the docs refresh as its first step.
- **2026-11-03 — Stage 1 VERIFIED code PASS / docs FAIL (Muse, from source):** zip 2,052,496 bytes, SHA-256 `35b19abeb696698db65d3fc28f5217397c302ce57da1479bc5559dfd4a17f9f3`, `npm test` 29/29, typecheck and build pass, preview SSR `lang="ar" dir="rtl"`. Code gate PASS; docs refresh FAIL (repo docs replaced from the local handoff folder, not Muse's current files — still Stage 0 not verified, `LMS to Hire` path, big-prompt handoff, wordmark TBD). Merge NOT authorised, Stage 2 NOT authorised until the docs-only fix on `opencode-stage1` passes. Builder-created `main` was owner-authorised in-session (Stage 0 gate passed, builder authorised to create `main` from `8ebafda` and push it); owner still confirms `main` = `8ebafda` exactly in GitHub. Handoff folder must be synced with Muse's current four files before the next OpenCode session.
- **2026-11-03 — Stage 1 docs fix VERIFIED PASS (Muse, from source):** zip 2,057,369 bytes, SHA-256 `75f5a01c376cc989ea1477d718f4595fdaaf01934aea97d09e07f20f7b7a9f65e`, branch `opencode-stage1-docs-fix` off `main` at `a46252f`, commit `6ed538e` (builder-reported). Four docs byte-identical to Muse's current files; `src/`/`public` content-identical to Stage 1 (line-ending normalisation CRLF→LF only); `npm test` 29/29, typecheck and build pass. Merge of the docs-fix branch into `main` authorised (owner, in GitHub); after that merge, change GitHub default branch to `main` and delete stale stage branches. Stage 2 authorised to be briefed after that merge, with its brief settling the open locks.
