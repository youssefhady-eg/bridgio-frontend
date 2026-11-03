# BRIDGIO — refinement delivery note

**Branch:** `refinement-sidebar-font-en`
**Base:** `3acff0b` (`main`, merge commit of PR #11 — student answer-key fix)
**Commits:** `b39a14b` docs-only (LIVE_RULES refresh, no code), then the code commit that contains this note (branch tip).
**Status:** built and locally verified only. Not merged, no PR, not deployed, and not claimed final or external-ready. Every backend endpoint added here is **PROPOSED**.

---

## What this refinement changes

1. The sidebar becomes the only primary navigation for all four roles.
2. The header becomes a slim utility bar (no nav links).
3. Arabic moves to the Thmanyah family names, with the existing Arabic fonts as fallback.
4. A full AR/EN toggle switches copy and text direction (`rtl` / `ltr`).
5. A display-only parent view is added (Progress, Tests, Results, Messages).
6. Parent → Teacher / Teacher Assistant messaging is an in-app mock chat popup.

Stage 7 (real backend + hosting) is **not** part of this branch and was not started.

---

## 1. Sidebar and roles

`src/shell/nav.ts` is the single nav source; `src/components/AppSidebar.tsx` renders it.

| Role | Sidebar items | Where each item opens |
| --- | --- | --- |
| Teacher | Dashboard, My Classes, Tests, Students | `/teacher/dashboard` (built), `/teacher/classes` (existing placeholder), `/teacher/tests` (built builder), `/teacher/students` (existing placeholder) |
| Student | My Tests, Lessons, Progress | `/student/tests` (built player), `/student/lessons` (existing placeholder), `/student/progress` (existing placeholder) |
| Parent (UI name "Parents", not "Guardian") | Progress, Tests, Results, Messages | `/parent/progress`, `/parent/tests`, `/parent/results`, `/parent/messages` (all new, display-only) |
| Teacher Assistant | **Only** the items the backend granted | The matching teacher route for each granted capability |

- Desktop (≥1024 px): fixed/sticky sidebar column with icon + word and an active state.
- Phone/tablet (<1024 px): off-canvas drawer opened by the header menu button, closed by the backdrop, the close button, or a nav link. The drawer opens from the inline-start edge, so it is on the left in LTR and the right in RTL.
- There is no duplicate nav: the header contains no navigation links.
- **Teacher Assistant:** the sidebar reads `rbac.getCapabilities` through the adapter and renders exactly the granted subset, in canonical order. It never shows a fixed TA menu. The mock seed grants `dashboard` + `tests` and withholds `classes` + `students`, so the hiding is visible in the preview. When nothing is granted, the sidebar says so. There is **no granting UI** in BRIDGIO and no hardcoded TA menu.
- `?as=teacher|student|assistant|parent` remains preview-only UI state. It is not an auth, user, or role model. The switcher now lives in the footer so the header stays a slim utility bar.
- Existing placeholder screens are untouched: My Classes detail, Students list/detail, Lessons, and student Progress still open the previous placeholder UI.

## 2. Utility header

`src/components/AppHeader.tsx`.

- Holds the brand/wordmark, the language toggle, the messages/assistant popup trigger, and a disabled account area (future Mentingo auth only).
- No navigation links.
- Phone header holds the hamburger, brand, language toggle, and messages trigger.
- Breakpoints are **unchanged** from the locked build: dark band with cream wordmark on phone, maroon wordmark at 768–1023 px, full colour lockup at ≥1024 px. No breakpoint value was changed.
- The account button is a labelled placeholder; sign-in and roles stay owned by Mentingo (method still unconfirmed).

## 3. Thmanyah Arabic fonts

`src/styles/fonts.css` documents the intent; `src/styles/app.css` prepends the Thmanyah family names to the relevant stacks.

Proposed mapping (owner to confirm):

| Thmanyah family name | Used for | Current fallback |
| --- | --- | --- |
| `thmanyahserifdisplay` | display / headings | `Bridgio Display` → Alexandria Bold (AR) / Sora (Latin) |
| `thmanyahsans` | UI, labels, short body text | `Bridgio Label` → Alexandria Bold (AR) / Nunito (Latin) |
| `thmanyahseriftext` | long reading / body paragraphs | `Bridgio Body` → Baloo Bhaijaan 2 (AR) / Nunito (Latin) |

- Latin stays Sora / Nunito, unchanged.
- **The Thmanyah font files are deliberately NOT in this repository.** The repo is public, and the owner's delivery model is bundled-only with no standalone download. No fonts, links, archives, or zip files were added. The CSS requests the Thmanyah family names first and falls back to the bundled Arabic fonts, so nothing breaks while the files are pending.
- The files listed above are a **pending owner asset**. When supplied, add one `@font-face` per family in `fonts.css` (exact family name, Arabic `unicode-range`) and the existing stacks light up without touching components.
- If the real Thmanyah family names differ from the three above, update `fonts.css` and the stacks in `app.css`; nothing else depends on the names.

## 4. Full AR/EN toggle with LTR

- Language lives in the root search param `?lang=ar|en` (SSR-correct) and in `localStorage` under `bridgio.lang`. `src/shell/lang.ts` owns parsing, direction and href helpers; `src/shell/useStrings.ts` exposes `useLang` / `useStrings` / `stringsFor`.
- The toggle is in the utility header. It preserves the current path, the preview role, and the other params. It switches `<html lang="en" dir="ltr">` / `<html lang="ar" dir="rtl">`.
- Arabic is the default. English is a complete mirror in `src/content/strings.ts`, labelled draft. Every UI string comes from that file; `BRIDGIO` (`brand.name`) and `Mohsen` (`assistant.nameAr`) are swappable from one place (`B` / `M`).
- No hardcoded UI English was added outside the central strings; the existing internal footer note remains the only intentionally English-only internal string.
- Numerals: Arabic-Indic digits in AR via the existing formatters, Western digits in EN. Dates and percentages follow the same helpers.
- Layout uses logical properties (`margin-inline`, `inset-inline`, `border-inline-end`, etc.) and mirrors in LTR. Deviations and judgement calls are listed under "Deviations".

## 5. Parent view (display only)

`src/components/parent/ParentView.tsx`, routes `src/routes/parent.*.tsx`, data from `parents.getProfile` and `parents.getOverview`.

- A parent can switch between linked children; the UI shows what the backend returns.
- **Progress:** overall percent, completed units, last active, unit list.
- **Tests:** the child's attempt state per published test (`not_started`, `in_progress`, `submitted`) with answered/question counts.
- **Results:** submitted attempts with a **backend-supplied** `scorePercent`. If the field is `null`, the UI says the score is not available. The frontend does not calculate scores, mark answers, or invent results.
- **Messages:** the shared in-app chat surface, inline.
- No marking was added to the student player. No score or result is computed anywhere in a component.

## 6. Parent messages — in-app mock chat

`src/components/chat/ChatSurface.tsx` (shared body) and `ChatPopup.tsx` (modal), backed by `messages.*`.

- Patterned after the planned AI Chat / AI Assistant popup, not WhatsApp and not an external channel.
- Mock conversations: one thread with the Teacher and one with the Teacher Assistant, plus a deterministic mock reply when the parent sends a message.
- The header messages trigger opens the same popup; the parent Messages screen embeds the same surface.
- No real-time transport and no notifications are claimed. Every `messages.*` method stays PROPOSED.
- `fromMe` is computed by the adapter from the signed-in user's role, so the parent's own messages render on the "me" side.

---

## Deliberately unchanged

- No new auth, user, or role model in BRIDGIO. `?as` and `?lang` are UI/diagnostic state only.
- No RBAC granting UI; grants are read-only.
- No marking logic and no score computation; the student player is unchanged.
- My Classes detail, Students list/detail, Lessons and student Progress keep their existing placeholder screens.
- Header breakpoints unchanged.
- No dark theme, price, installments, Learn-to-Hire, or exotic-language flows.
- No new dependencies.
- `docs/BRIDGIO-LIVE_RULES.md` is preserved and is **not** edited to claim this refinement verified or merged. The docs-only commit `b39a14b` only refreshes upstream status.
- No Thmanyah font binaries, no `dist/`, no `.tanstack/` cache, and no temporary capture helper were committed.

## Deviations

1. **Language persistence first paint.** When a stored language exists but the URL has no `?lang`, first paint is Arabic, then the shell reloads once with the stored language via `window.location.replace`. The URL param remains the SSR source of truth. This is a documented first-paint deviation, not a user model.
2. **Preview-role switcher moved to the footer.** The header brief asked for a slim utility bar; the diagnostic role switch was moved out of the header to keep it slim.
3. **Header "assistant popup trigger" opens the shared messages popup.** There is no separate AI Assistant chat backend; the trigger and the parent Messages screen share one mock surface. Documented as an open question.
4. **Assistant preview content.** The assistant's granted items point at the existing teacher routes. Those routes currently require a teacher mock session, so an assistant preview session is rejected there; the assistant screenshots therefore show the shell home with the granted sidebar items. This is a guard question, not a menu change.
5. **Bilingual inline text.** The internal footer note and the shell code hint keep explicit `dir="ltr"` / `lang="en"` because they are intentionally English.
6. **Brand artwork never mirrors.** The logo/wordmark keeps its orientation in LTR by design; only layout and controls mirror.
7. **Arabic wording** remains draft; English is a draft mirror. Both await owner / reviewer approval.

## Open questions

1. **Thmanyah family mapping and files.** Confirm the three family names and which face maps to display / UI / long reading. The font files are a pending owner asset (public repo, bundled-only). Which formats (`woff2` preferred) and weights will be supplied?
2. **Header breakpoints.** No breakpoint was changed; confirm the existing phone dark band / 768–1023 maroon wordmark / ≥1024 full lockup stays as-is for this refinement.
3. **Teacher Assistant route access.** How should an assistant reach granted teacher routes once Mentingo auth exists? This build only reads grants and hides ungranted items; the existing route guards are teacher-only.
4. **Assistant content in the preview.** The seed grants `dashboard` + `tests`, which map to teacher screens. Should the assistant have dedicated screens, or should the teacher routes become RBAC-aware?
5. **Preview data session.** Parent and assistant data in the preview requires a matching build-time `VITE_MOCK_SESSION` (`parent` / `assistant`), the same technique used for the student preview. `?as` alone only changes nav/role. Confirm this demo technique is acceptable until Mentingo auth lands.
6. **Scores source.** The frontend only displays `scorePercent`. Whether the child's score is teacher-entered or produced by automatic marking remains a Mentingo/owner decision; no marking was added here.
7. **Messaging backend.** All `messages.*` endpoints are PROPOSED and mock-only. No real-time transport, notifications, WhatsApp, or external channel is implemented.
8. **English copy** is a draft mirror and needs an owner / reviewer pass.
9. **Parent demo data.** The mock progress shows 42% with 0/2 completed units; that inconsistency is seed data, not a UI calculation.
10. **Assistant label in EN nav.** The parent nav item is "Child's Progress"; confirm the final English label.

## Integration checklist

All data goes through `src/api/` (contract + mock adapter + HTTP adapter). No component calls `fetch` or hard-codes data. Every method below is **PROPOSED — Mentingo to implement on restore/rebuild**; none is confirmed.

| Screen / surface | Adapter methods | Confirmed? | Mocked? |
| --- | --- | --- | --- |
| Sidebar (all roles) | `rbac.getCapabilities` (assistant only) | No | Yes |
| Utility header / account | none (auth is Mentingo-owned) | n/a | Placeholder only |
| Parent Progress | `parents.getProfile`, `parents.getOverview` | No | Yes |
| Parent Tests | `parents.getProfile`, `parents.getOverview` | No | Yes |
| Parent Results | `parents.getProfile`, `parents.getOverview` (score field backend-supplied) | No | Yes |
| Parent Messages | `messages.listThreads`, `messages.listMessages`, `messages.sendMessage` | No | Yes |
| Header messages popup | `messages.listThreads`, `messages.listMessages`, `messages.sendMessage` | No | Yes |
| Teacher dashboard / builder / student player | Existing Stage 2–4 methods, unchanged | No | Yes |

- `?as` is preview only; it is not authentication.
- No confirmed endpoint exists. Do not present the mock as a live Mentingo connection.
- No marking or score computation exists in the frontend.
- Scores are display-only and come from the backend projection.

## Verification

Run on the final working tree, default (teacher) mock session:

- `npm test` — **91 passed / 91**, 10 test files.
- `npm run typecheck` — pass, no errors.
- `npm run build` — pass (client + SSR + post-build typecheck).

Built-preview checks (headless Edge, built `vite preview`), at desktop 1440×900 and phone 390×844:

- Teacher, Student, Assistant, Parent in AR and EN.
- Sidebar shows the correct items per role; assistant shows only Dashboard + Tests (the granted subset).
- Utility header has no nav links; phone drawer opens and closes; desktop sidebar is fixed.
- `dir` / `lang` switch between `rtl` and `ltr`; persisted language applies.
- No horizontal overflow (`scrollWidth - clientWidth === 0`).
- Parent progress / tests / results render backend values; the parent messages popup and inline messages screen send and receive mock replies.

## Screenshots

All under `docs/screenshots/`, captured from the built preview.

**Role + language, desktop (1440×900):**
- `refinement-desktop-ar-teacher.png`
- `refinement-desktop-en-teacher.png`
- `refinement-desktop-ar-student.png`
- `refinement-desktop-en-student.png`
- `refinement-desktop-ar-assistant.png`
- `refinement-desktop-en-assistant.png`
- `refinement-desktop-ar-parent.png`
- `refinement-desktop-en-parent.png`

**Role + language, phone (390×844):**
- `refinement-phone-ar-teacher.png`
- `refinement-phone-en-teacher.png`
- `refinement-phone-ar-student.png`
- `refinement-phone-en-student.png`
- `refinement-phone-ar-assistant.png`
- `refinement-phone-en-assistant.png`
- `refinement-phone-ar-parent.png`
- `refinement-phone-en-parent.png`

**Utility header:**
- `refinement-desktop-ar-header.png`
- `refinement-phone-ar-header.png`

**Parent messages popup:**
- `refinement-desktop-ar-parent-messages.png`
- `refinement-desktop-en-parent-messages.png`
- `refinement-phone-ar-parent-messages.png`
- `refinement-phone-en-parent-messages.png`

**Parent messages screen (inline):**
- `refinement-desktop-ar-parent-messages-screen.png`
- `refinement-desktop-en-parent-messages-screen.png`

**Parent results / tests (display-only backend values):**
- `refinement-desktop-ar-parent-results.png`
- `refinement-desktop-en-parent-results.png`
- `refinement-desktop-ar-parent-tests.png`