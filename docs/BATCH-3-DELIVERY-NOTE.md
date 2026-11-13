# BRIDGIO — Batch 3 Delivery Note

**Date:** 2026-11-13
**Branch:** `feat/batch3-help-guide-copy`
**Base:** `4ec883e` (`origin/main`, after Batch 2 / PR #30)
**Scope:** remove developer-facing copy from the UI, rebuild `/help` as a role-scoped reference library, and add a role-scoped `/guide` pinned in the sidebar. Branch pushed only — no PR, no merge.

The batch starts with a docs-only commit (`e9f33cb`) that copies Muse's current `BRIDGIO-LIVE_RULES.md` into `docs/` before any code changed.

---

## 1. What changed

### A — Developer language removed from the UI

| Removed | Where it lived |
| --- | --- |
| Stage banner ("Stage N", what is and is not built) | `src/shell/dev-chrome.ts` (deleted, with `dev-chrome.test.ts`), `<aside class="stage-banner">` in `__root.tsx` |
| The whole footer chrome: role switch links, demo-data note, the bilingual "internal version" line | `<footer class="app-footer">` in `__root.tsx`; `footer`, `preview`, `stageBanner` string blocks |
| Stage-1 shell overview screen ("what the shell contains") | `src/components/NotBuiltScreen.tsx` (deleted); `shell`, `placeholder` string blocks |
| Sign-in notes: "no BRIDGIO auth", Mentingo, demo sessions, `VITE_MOCK_SESSION` | `SignInView.tsx` + `auth.*` keys — replaced by one plain status line `auth.status` |
| Assistant internal-preview note and the word "الباك إند" | `AssistantView.tsx`, assistant copy |
| Chat "demo conversation only, no notifications" note | `ChatSurface.tsx` + `chat.mockNote` |
| Profile lead naming Mentingo | `profile.accountNote` — now says the account data comes from the session and is not editable here |
| Meta description calling this an internal verification version | `head.description` |
| `?as` role-switch hints on screen | the URL mechanism itself still works (`usePreviewRole`); nothing advertises it |

- `/` no longer renders a screen of its own: it redirects per role (student → `/student/tests`, parent → `/parent/progress`, assistant → `/assistant`, otherwise teacher → `/teacher/dashboard`), so the shell overview could be retired.
- Empty/placeholder states on the material library, question bank, test detail, student and parent screens were reworded to plain product copy.
- Dashboard: the duplicate eyebrow badge above the H1 is gone. The title is `لوحة المعلم` / `Teacher dashboard` — **PROPOSED**: the brief proposed it, the owner has not confirmed it.
- The retake section kept its place on the student screen; only its copy changed ("إعادة المحاولة" instead of the simulator wording).
- No new slogan was added anywhere, and no support contact was invented (no e-mail, no WhatsApp, no phone).
- Dead CSS for every removed element (stage banner, footer, role switcher, placeholder, shell hero/lead/section, `.app-code`, `.app-main:has`) was deleted from `app.css` and `polish.css`.

**Register rule (LIVE_RULES §4, owner 2026-11-13):** greetings and encouragement are Egyptian colloquial, every instruction, label and status is MSA, and the two never mix inside one string. The assistant screen follows it with one colloquial greeting (`assistant.greeting(name)`); everything else on that screen stays MSA.

### B — Help Center rebuilt as a role-scoped reference library

`src/components/shared/HelpView.tsx`, `src/content/strings.ts` (`help`), `finish.css` (Batch 3 block)

- Two-column library: a sticky index (`المحتويات`) on one side, article cards on the other. Each card is **one task** with a short numbered step list (`الخطوات`) and a CTA link into the real screen.
- Scope: a role sees **Getting started + its own category + Account & settings + FAQ** and nothing else.
- Categories: Getting started, For teachers, For students, For parents, For assistants, Account & settings, FAQ.
- 21 articles + 4 FAQ items, AR + EN, all in the central string file. Topics excluded by the brief stay excluded: no sign-in article, no file-upload article, no retake article, no "coming soon".
- Register: MSA throughout, including the student articles.
- The role comes from `usePreviewRole()` — the same source as the sidebar nav (`?as` when present, else the route area). No data is fetched.

### C — `/guide`

`src/components/shared/GuideView.tsx` (new), `src/routes/guide.tsx` (new), `strings.guide`

- A numbered walkthrough with a connecting rail between the markers; the number comes from the step's position (`index + 1`), never from copy.
- One walkthrough per role, scoped to the current role only:
  - teacher — the first test, class → test → questions → publish → results;
  - student — the first test, from choosing it to reviewing the score;
  - parent — the first look, from choosing a child to messages;
  - assistant — the sections granted to the account.
- Register: MSA for teacher, parent and assistant; Egyptian colloquial for the student walkthrough. One role per page, so no page mixes the two registers.
- Pinned in the sidebar as the second utility link, after Help (`Compass` icon in `AppIcon`), so the order is Help, Guide, Profile in every role.

### D — Help and Guide link targets

`src/shell/help-links.ts` (new), `src/shell/help-links.test.ts` (new)

- Routes moved out of the views to `src/shell/help-links.ts`, next to `nav.ts`: `linkRoutes: Record<HelpLinkId, string>` is exhaustive over `HelpLinkId`, so a copy id added without a route fails `typecheck` instead of silently dropping a button.
- `linkSearchRole(to, role)`: a role-specific screen carries its own area role; a **shared** screen (`/profile`) keeps the visitor's current role. Before this, opening Profile from a student's Help carried `?as=teacher` and flipped the sidebar into the teacher lens.
- The string file still owns the link *labels* (`help.links`); the string file's `HelpLinkId` comment now points at the new module.

---

## 2. Data layer

| Screen | Adapter calls | Contract impact |
| --- | --- | --- |
| `/help` | none | none |
| `/guide` | none | none |

Help and Guide render copy and link to existing routes with the router `Link`. No adapter call, query key, contract signature, dependency or build setting changed. `package.json` and the lockfile are untouched.

---

## 3. Verification gates

| Gate | Result |
| --- | --- |
| `npm test` | **142 passed (142)**, 17 files |
| `npm run typecheck` | **pass** (`tsc --noEmit`, no output) |
| `npm run build` | **pass**, exit 0 (vite client + Nitro SSR, then `tsc --noEmit`) |

Test count: Batch 2 was 142 in 17 files. Deleting `dev-chrome.test.ts` (its subject is gone) removed 2 tests; the new `src/shell/help-links.test.ts` adds 2 (every AR and EN link id resolves to a path; the shared-screen role rule), so the totals land back on 142/17.

`src/routeTree.gen.ts` was regenerated by the build and now carries `/guide`.

---

## 4. Live behaviour (dev build on `localhost:3001`)

### Help Center

- Teacher: 14 entries in scope — 2 getting started, 6 teacher, 2 account, 4 FAQ — with the index listing exactly those.
- Student: getting started + `للطالب` + account + FAQ; 8 articles + 4 FAQ. CTAs resolve to `/student/tests?as=student&lang=ar`, `/student/lessons…`, `/student/progress…` and `/profile?as=student&lang=ar`.
- Assistant: `لمساعد المعلم` category; CTAs resolve to `/assistant?as=assistant&lang=ar`.
- Index anchors jump to the right category and land clear of the sticky header (measured 96 px below the viewport top).
- The index is sticky from 1024 px up and stays in view while the articles scroll (`batch3-help-teacher-1920-ar-light-scrolled.png`).
- Below 1024 px the layout collapses to one column; the mobile sidebar drawer opens from the header menu button.

### Guide

- All four walkthroughs render with sequential markers, the connecting rail (from 600 px up) and one CTA per step; the assistant page is short enough to fit one viewport at 1080 px.

### Cross-cutting checks

- No horizontal overflow at 1920, 1024, 768 or 390 px (`scrollWidth === innerWidth` on `/help` and `/guide`).
- Zero console errors and zero page errors across the whole capture run (four roles × two routes, several widths, both languages).
- Dark theme applies through the stored choice (`data-theme="dark"`, body `rgb(44, 7, 6)`).
- AR renders RTL and EN renders LTR, on both routes, with the sidebar order Help, Guide, Profile.

---

## 5. Deviations and open items

1. **The dashboard title is a proposal.** `لوحة المعلم` / `Teacher dashboard` comes from the brief's prompt, not from an owner decision; it is the only heading changed in this batch and no slogan was added around it.
2. **Retake is still on the student screen.** It predates this batch and is out of scope; only its copy changed. The mock still refuses a new attempt on a submitted test, and the screen keeps that honest error.
3. **"Role" here is `usePreviewRole`, not a session.** In this frontend-only demo the role is the `?as` preview parameter or the route area — the same source the sidebar uses. Help and Guide deliberately do not read the session query, so a mock session cannot desync them from the nav.
4. **No support contact.** The Help Center and the FAQ intentionally give no e-mail, phone or WhatsApp; that decision belongs to the owner.
5. **`/` has no screen.** It is a redirect only, so a link to `/` always lands on a real first screen. The `?as` switch is still functional but is no longer visible anywhere in the UI.
6. **CTA label shape.** Links read "افتح الشاشة + <screen name>" / "Open the screen + <screen name>": the destination is spelled out rather than a bare "learn more".
7. **Screenshots were taken on `localhost:3001`.** The Batch 2 dev servers on 5199/5200 are gone; one server serves every role through `?as`.

---

## 6. Screenshots — `docs/screenshots`, prefix `batch3-`

| File | Shows |
| --- | --- |
| `batch3-help-teacher-1920-ar-light.png` / `-dark.png` | Help Center, teacher scope, AR, 1920, light / dark (full page) |
| `batch3-help-teacher-390-ar-light.png` / `-dark.png` | Same, AR, 390, light / dark (full page) |
| `batch3-help-teacher-1920-en-light.png` / `-390-en-light.png` | Same, EN (LTR), light, 1920 / 390 |
| `batch3-help-teacher-1920-ar-light-scrolled.png` | Same as the first file, scrolled, to show the sticky index |
| `batch3-help-student-1920-ar-light.png` | Help Center, student scope (category `للطالب`, different articles) |
| `batch3-help-parent-1920-ar-light.png` | Help Center, parent scope |
| `batch3-help-assistant-1920-ar-light.png` | Help Center, assistant scope (`لمساعد المعلم`) |
| `batch3-guide-teacher-1920-ar-light.png` / `-dark.png` | Guide, teacher walkthrough, AR, 1920, light / dark |
| `batch3-guide-teacher-390-ar-light.png` / `-dark.png` | Same, AR, 390, light / dark |
| `batch3-guide-teacher-1920-en-light.png` / `-390-en-light.png` | Same, EN (LTR), light, 1920 / 390 |
| `batch3-guide-student-1920-ar-light.png` | Guide, student walkthrough (colloquial register) |
| `batch3-guide-parent-1920-ar-light.png` | Guide, parent walkthrough |
| `batch3-guide-assistant-1920-ar-light.png` | Guide, assistant walkthrough |

19 files. The role-scoped variants are teacher, student, parent and assistant for both screens, so the scoping rule is visible rather than described.

---

## 7. Deliberately NOT changed

- No auth flow, provider or session mechanism; the sign-in form is exactly the disabled form it was, minus the notes.
- No support contact, and no promise of one.
- No route rename: `/help` keeps its URL and `/guide` is a new sibling; the sidebar slugs for the eleven nav destinations are untouched.
- No nav item added, removed or reordered for the roles — Guide is a utility link below the role nav, next to Help and Profile.
- No marking, scoring or grading logic; no retake feature.
- No new dependency; no colour, font or spacing token changed (the Batch 3 CSS uses existing tokens only).
- No BFF, adapter or contract change; Help and Guide fetch nothing.
- `.agents/` and `skills-lock.json` remain untracked and uncommitted.
- No merge, no PR, no push to `main`.
