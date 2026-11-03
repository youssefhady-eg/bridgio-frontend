# BRIDGIO — Stage 5 — Delivery Note

**Stage:** 5 only — Mohsen grounding hardening + grounded Q&A, empty/error/success
states, accessibility audit
**Branch:** `opencode-stage5`, branched from `main` at `f454fd6` (PR #8 merge)
**Date:** 2026-11-03
**Status:** Built and self-verified. **NOT verified by Muse yet. NOT merged to
`main`. NOT final, locked, or externally ready. No Stage 6 work started.**
**Model:** DeepSeek V4.1 Flash Free — provider `tokenharbor`, exact listed model
id `deepseek-v4.1-flash:free`.

---

## 0. Docs refresh gate (done before any code)

The LIVE_RULES status line was read before building. It records Stage 4 as
**VERIFIED PASS** and **MERGED** through PR #8, merge commit `f454fd6`, with
Stage 5 authorised. The gate passed.

The docs refresh was committed alone, before any code:

```text
c270014 docs(stage5): sync LIVE_RULES with stage 4 merge status (main f454fd6)
```

- +3 / -1 lines, `docs/BRIDGIO-LIVE_RULES.md` only. No code, test, asset or
  config file in that commit.
- The four owner docs were preserved across the branch switch; no
  `git checkout -- docs/` was used to overwrite the owner's current docs.
- The five owner locks were not reopened: dark-band cream 75% / border 24% /
  hover 8% / cream focus ring, Alexandria Bold as 600 and Nunito 700 max,
  `?as` preview role kept, student Lessons/Progress unassigned, small-header
  breakpoints unchanged.

---

## 1. What changed

Stage 5 adds no new screen and no new feature. It hardens the existing Mohsen
answer path, fills in the missing success state in the builder, makes the three
route loaders show the app's own Arabic error states, and fixes the
accessibility failures found in the audit.

| File | Change |
| --- | --- |
| `src/api/mock/mock-adapter.ts` | Grounding guard: a candidate only counts when a real sentence contains a query token; `supportingExcerpt` returns `null` instead of falling back to the first sentence; `hasUsableGrounding` downgrades an ungrounded "answered" result to the honest refusal; `refusalAnswer` helper. |
| `src/api/mock/mock-adapter.test.ts` | 2 new tests: no answered result without usable grounding across four questions; a stopword-only question refuses. |
| `src/components/mohsen/answerView.ts` | New UI-side integrity guard: filters unusable refs, downgrades an `answered` result with no usable grounding to `not_grounded` using centralised fallback copy. |
| `src/components/mohsen/answerView.test.ts` | 5 new unit tests for the guard. |
| `src/components/player/MohsenPanel.tsx` | Every answer passes through `answerView`; a refusal renders as a neutral `EmptyNote` (book icon + word), not a wine error. |
| `src/components/dashboard/EmptyNote.tsx` | Tones `neutral` / `error` / `success`, each with a default icon; `error` keeps `role="alert"`, the others `role="status"`. |
| `src/components/builder/StepDraftQuestions.tsx` | Drafting success state: "صاغ محسن أسئلة موثّقة" with a source note, shown when a draft is produced. |
| `src/routes/teacher.dashboard.tsx` | Loader wraps its prefetch in `try/catch` so a failed API shows the dashboard's Arabic wine error note, not the framework's default English error screen. |
| `src/routes/teacher.tests.tsx` | Same loader resilience for the builder. |
| `src/routes/student.tests.tsx` | Same loader resilience for the player. |
| `src/components/AppHeader.tsx` | Accessibility fix: `aria-pressed` on role links replaced with `aria-current` (the only Lighthouse failure). |
| `src/styles/app.css` | `:focus-visible` extended to inputs, selects, textareas, summaries and `[tabindex]` (visually hidden radios/checkboxes excluded, their labels use `:focus-within`); skip link gets a 44 px min height; `.empty-note--success`; Mohsen refusal spacing. |
| `src/content/strings.ts` | Stage 5 page title/description/banner, builder success copy, `notGroundedFallback`, English footer line. |
| `vitest.config.ts` | `resolve.tsconfigPaths: true`, so tests resolve the `~/*` alias like the app. |
| `docs/screenshots/stage5-*.png` | 20 Arabic desktop/phone captures, listed in §7. |
| `docs/STAGE-5-DELIVERY-NOTE.md` | This note. |

### Mohsen grounding hardening

The rule is: **an answer is shown only when it carries a real source label and a
real quoted excerpt; otherwise Mohsen refuses.** It is enforced twice, at both
sides of the boundary:

1. **Adapter (retrieval).** A candidate is kept only if it matches the question
   and a sentence in the candidate text contains a query token. The old
   fallback "quote the first sentence anyway" is gone. After building the top
   grounding refs, `hasUsableGrounding` checks every ref has a non-empty label
   and excerpt; if not, the result becomes the same `not_grounded` refusal used
   for no match.
2. **UI (display).** `answerView` re-checks every `answered` result. Refs
   without a label or excerpt are dropped; if none remain the result is
   downgraded to `not_grounded` with the centralised fallback
   "مفيش عندي إجابة موثّقة من مادة الاختبار على السؤال ده. مش هخمّن."

A refusal is **not an error**: it renders as a neutral `EmptyNote` with a book
icon and the heading "محسن مش لاقي إجابة". Wine is reserved for actual failures
(Mohsen unreachable), so status is never carried by colour alone.

---

## 2. Data path — adapter/mock only

No component calls `fetch`, imports the mock directly, or holds demo classes,
tests, questions or answers. No contract field was added, no adapter method was
added, and every endpoint stays **PROPOSED**. Stage 5 only changed the behaviour
inside the existing `mohsen.ask` mock and the rendering around it.

| Surface | Existing adapter methods used | Status | Mocked |
| --- | --- | --- | --- |
| Teacher dashboard | `auth.getSession`, `teachers.getDashboard` | **PROPOSED** | Yes |
| Test builder | `auth.getSession`, `classrooms.listForTeacher`, `classrooms.get`, `materials.listForTeacher`, `tests.get`, `questions.listForTest`, `tests.createDraft`, `mohsen.draftQuestions`, `questions.update`, `questions.delete`, `tests.publish` | **PROPOSED** | Yes |
| Student player | `auth.getSession`, `students.getProfile`, `tests.listForClass`, `attempts.listForStudent`, `attempts.start`, `attempts.get`, `questions.listForTest`, `attempts.saveAnswer`, `attempts.submit` | **PROPOSED** | Yes |
| Mohsen Q&A | `mohsen.ask` | **PROPOSED** | Yes |

`VITE_API_ADAPTER`, `VITE_API_URL` and `VITE_MOCK_SCENARIO` remain the only
switches; mock is the default and no live Mentingo connection is claimed.
`VITE_MOCK_SESSION` still selects the demo role, and `?as` remains the preview
switch.

**Persistent vs UI state:** answers, grounding, tests, classes, attempts and
progress all live in the adapter. Stage 5 adds no persisted field; the new UI
state is only transient form/thread display.

---

## 3. What was NOT built

- No new screen, route, feature or navigation item. Dashboard, builder and
  player keep their Stage 2–4 structure.
- No intelligent marking, scoring, grades, correct/incorrect result UI or
  answer review.
- No price, subscription, installments or payment UI.
- No Learn-to-Hire, certificate, exotic/foreign-language flow or Future Layer.
- No dark theme, theme switcher, second theme or new brand asset.
- No new auth screen, user model or role system; `?as` is unchanged.
- No student Lessons or Progress screens — they remain explicit placeholders
  and are not promised.
- No Mohsen reaction poses or cut-outs. The reactions sheet is not present in
  the repo, so the neutral inline icons + words stay and the sheet is listed as
  a pending owner asset in §9.
- No new adapter method, contract field, endpoint or backend.
- No favicon from the wordmark.
- No deployment, hosting, merge to `main` or Stage 6 work.

---

## 4. Token-sheet compliance and deviations

**LOCKED values used verbatim:** red `#D51C1D`, cream `#F9ECD9`, paper
`#FFF6E8`, maroon `#2C0706`, success `#1F7A57`, info `#2A62B0`, warning fill
`#F2A93B` (fill only, maroon text), error wine `#7E1A2B`. Card radius 24 px,
pill chips/buttons, sticker outlines, no drop shadows. Arabic-first RTL, light
theme only.

**PROPOSED FOR UI values used as-is and labelled proposed here:** neutrals,
type scale, spacing, input/sheet radii, 44 px touch targets and the focus ring.

**No new hex value or design token was introduced.** The Stage 5 CSS uses
existing custom properties only: `.empty-note--success` pairs `--bridgio-success`
with the check icon and a word, and errors keep `--bridgio-error`. The header,
fonts and colours match Stages 1–4 exactly.

### Deviations / things to note

1. **Refusal is neutral, not wine.** A `not_grounded` answer is an honest "I
   don't know", not an application error. It uses a neutral note with a book
   icon and the refusal words; wine is kept for real failures. Confirm in §9.
2. **Reactions sheet still pending.** LIVE_RULES §7 assigns it to Stage 5, but
   it is not in the repo. No pose was invented or cut from the wordmark; empty,
   refusal and success states use neutral inline icons + words.
3. **Skip link height.** The skip link now takes the 44 px `--touch-target`
   minimum; it is visually unchanged when focused and is keyboard-only.
4. **Focus selectors broadened.** `:focus-visible` now covers text inputs,
   selects, textareas, summaries and `[tabindex]`. Radios/checkboxes are
   visually hidden, so their labels show the ring through the existing
   `:focus-within` rules; the hidden input itself is excluded to avoid a stray
   1 px ring.
5. **Measured ring width.** The declared token is a 2 px outline at 2 px
   offset. The headless browser ran at DPR ~1.2–1.25, so computed values report
   1.6 px; the token is unchanged.
6. **Loaders return 200 with an error UI.** Swallowing a failed prefetch means
   SSR serves the app shell and the Arabic wine error note instead of a 500 or
   the framework's English error screen. This is a deliberate verification/demo
   choice; see §9 for the production-status question. A recoverable hydration
   warning is logged when the API is dead.
7. **Vitest alias.** `resolve.tsconfigPaths` was enabled so the new
   `answerView` test can import through `~/`.

---

## 5. States

Status is always **icon + word**, never colour alone. Error is wine
`#7E1A2B`; success is `#1F7A57`; refusals are neutral.

- **Dashboard success:** published tests show the existing success
  `StatusChip` (check icon + "منشور").
- **Dashboard empty:** no classes/tests yet, with the token-sheet wording and
  the next small step.
- **Dashboard error:** "تعذّر تحميل لوحتك." in a wine `role="alert"` note.
- **Builder success:** a produced draft shows "صاغ محسن أسئلة موثّقة" with a note
  that every question came from the selected source and carries its source.
- **Builder empty:** no classes / no materials / no new grounded questions,
  each with its own honest note.
- **Builder error:** "تعذّر تحميل منشئ الاختبار." in wine.
- **Player error:** "مش قادرين نحمّل اختباراتك." in wine.
- **Player empty:** no tests for the student's classes, and the existing
  no-session note.
- **Mohsen grounded:** answer + "المصدر" list with material/unit label and the
  supporting excerpt.
- **Mohsen not grounded:** neutral book note with "محسن مش لاقي إجابة" and the
  refusal sentence; no answer is invented.

Empty data is reproducible without code changes: `VITE_MOCK_SCENARIO=empty`.
Errors are reproducible by pointing the HTTP adapter at a dead port
(`VITE_API_ADAPTER=http`, `VITE_API_URL=http://localhost:9/api/v1`).

---

## 6. Verification (run in this session)

```text
npm test         → 8 files, 69 tests passed
                   (62 previous + 5 answerView + 2 mock grounding guard)
npm run typecheck → pass (tsc --noEmit)
npm run build    → pass: client + SSR bundles
```

Additional checks:

- **Lighthouse accessibility = 1.0** on all three audited surfaces
  (dashboard, builder, player) after the `aria-current` fix; best-practices and
  SEO also 1.0. Zero audit failures.
- **Touch targets:** every interactive control on the three surfaces measured
  at least 44 px high; no exceptions found.
- **Focus visible:** keyboard focus on nav links and controls shows a solid
  maroon outline at the declared 2 px / 2 px offset (computed 1.6 px at the
  harness DPR), colour `rgb(44, 7, 6)`.
- **RTL / language:** built pages render `lang="ar" dir="rtl"`.
- **No horizontal overflow:** `documentElement.scrollWidth === clientWidth` at
  1440 px and 390 px on every captured state.
- **Built preview** (`npm run preview`, port 4000, default seeded teacher
  build): 200, Arabic SSR content, no overflow at 1440 and 390.
- **Dead-API run** (port 3300): dashboard, builder and player each render their
  own Arabic wine error note (`rgb(126, 26, 43)` = `#7E1A2B`) instead of an
  English framework error page.
- **Grounded query:** "ما هي قاعدة الضرب في الاشتقاق؟" → answer cites
  «مذكرة التفاضل — قواعد الاشتقاق» with a real excerpt.
- **Refusal query:** "ما هي عاصمة أستراليا؟" → "لا أجد إجابة موثّقة من المادة
  المرفوعة أو المنهج المقر." with no grounding and no invented answer.
- Browser console clean on each captured flow (the dead-API run logs the
  expected recoverable hydration warning noted in §4).

Demo/preview commands:

```text
npm run dev                                            # teacher, seeded
VITE_MOCK_SESSION=student npm run dev                  # student player
VITE_MOCK_SCENARIO=empty npm run dev                   # empty states
VITE_API_ADAPTER=http VITE_API_URL=http://localhost:9/api/v1 \
  VITE_API_TIMEOUT_MS=1500 npm run dev                 # error states
```

`VITE_*` is inlined at build time, so one production build shows one
scenario/session.

---

## 7. Arabic screenshots

All captures are Arabic and RTL. Phone images are 780 px wide files = 390 CSS
px at 2x.

| File | Size | Content |
| --- | --- | --- |
| `docs/screenshots/stage5-desktop-mohsen-grounded.png` | 1440 x 1220 | Grounded answer with source label and excerpt |
| `docs/screenshots/stage5-desktop-mohsen-refusal.png` | 1440 x 1220 | Not-grounded refusal, neutral book note |
| `docs/screenshots/stage5-desktop-dashboard-success.png` | 1440 x 1836 | Dashboard with published success status |
| `docs/screenshots/stage5-desktop-dashboard-empty.png` | 1440 x 1000 | Dashboard empty state |
| `docs/screenshots/stage5-desktop-dashboard-error.png` | 1440 x 1000 | Dashboard wine error state |
| `docs/screenshots/stage5-desktop-builder-success.png` | 1440 x 2341 | Builder drafting success note |
| `docs/screenshots/stage5-desktop-builder-empty.png` | 1440 x 1000 | Builder empty state |
| `docs/screenshots/stage5-desktop-builder-error.png` | 1440 x 1000 | Builder wine error state |
| `docs/screenshots/stage5-desktop-player-error.png` | 1440 x 1000 | Player wine error state |
| `docs/screenshots/stage5-desktop-preview.png` | 1440 x 1836 | Built preview at desktop |
| `docs/screenshots/stage5-phone-mohsen-grounded.png` | 780 x 3936 | Grounded answer with source, phone |
| `docs/screenshots/stage5-phone-mohsen-refusal.png` | 780 x 3740 | Refusal, phone |
| `docs/screenshots/stage5-phone-dashboard-success.png` | 780 x 5072 | Dashboard success, phone |
| `docs/screenshots/stage5-phone-dashboard-empty.png` | 780 x 1800 | Dashboard empty, phone |
| `docs/screenshots/stage5-phone-dashboard-error.png` | 780 x 1800 | Dashboard error, phone |
| `docs/screenshots/stage5-phone-builder-success.png` | 780 x 5380 | Builder success, phone |
| `docs/screenshots/stage5-phone-builder-empty.png` | 780 x 2378 | Builder empty, phone |
| `docs/screenshots/stage5-phone-builder-error.png` | 780 x 1800 | Builder error, phone |
| `docs/screenshots/stage5-phone-player-error.png` | 780 x 1800 | Player error, phone |
| `docs/screenshots/stage5-phone-preview.png` | 780 x 5072 | Built preview at phone width |

---

## 8. Stage 5 gate self-check

- [x] Grounded answers only: a candidate needs a matching quotable sentence,
      and an answered result needs a label + excerpt at both adapter and UI.
- [x] Grounding (material/unit label + excerpt) shown with every answer.
- [x] No ungrounded chat; no answer means the honest refusal
      "محسن مش لاقي إجابة".
- [x] Empty, error and success states for dashboard, builder and player.
- [x] Token-sheet wording followed; status is icon + word, never colour alone.
- [x] Error is wine `#7E1A2B`, never brand red for wrong.
- [x] Accessibility audited on dashboard, builder and player only: visible
      focus 2 px maroon / 2 px offset, 44 px minimum touch targets; found
      failures fixed without redesign.
- [x] Arabic-first, full RTL, light theme; header, fonts, colours and tokens
      unchanged; five owner locks untouched.
- [x] `?as` preview switch kept.
- [x] Adapter + mock only; no new contract field, no new adapter method; all
      endpoints **PROPOSED**.
- [x] No mascot pose invented; neutral icons + words; reactions sheet listed
      as a pending owner asset.
- [x] No intelligent marking, scores/grades, price, installments,
      Learn-to-Hire, exotic-language flow, dark theme, new auth/user model,
      Lessons/Progress screens or wordmark favicon.
- [x] `npm test`, `npm run typecheck`, `npm run build` pass.
- [x] Built preview at desktop + phone: no horizontal overflow, `lang="ar"
      dir="rtl"`.
- [x] Arabic desktop + phone screenshots for grounded answer, refusal and the
      three surfaces' empty/error/success states.
- [ ] Muse verification.
- [ ] Merge to `main` (owner decision; not done here).

---

## 9. Open questions

1. **Reactions sheet:** where is the owner's 16-pose sheet, and should it
   replace the neutral icons in empty/error/refusal/success now, or wait for a
   later polish stage? No pose or cut-out was invented.
2. **Refusal styling:** is a neutral book note the right treatment for "not
   grounded", or should it stay visibly separate from empty and error as it is
   now? This note treats a refusal as neither.
3. **Grounding confidence:** the mock uses token overlap (2 matching tokens for
   questions of 3+ tokens, otherwise 1) plus a required excerpt. What confidence
   or citation rule will the real Mohsen/retrieval backend use? The UI guard is
   independent of that rule.
4. **Builder refusal:** should "no new grounded questions from this source" be
   neutral (as built) or share the same refusal wording as the player? Today the
   builder keeps its own draft-specific note.
5. **Production error status:** the loaders now return 200 with an Arabic error
   UI when prefetch fails. Confirm this is acceptable for the demo, or restore a
   non-200 route response later for real hosting/SEO semantics.
6. **A11y scope:** the audit covered the three Stage 5 surfaces only, as
   briefed. Should a later stage audit the remaining shell pieces (skip link,
   role switch, footer) too?
7. **Dashboard success:** publication is shown as a success status chip on the
   row. Confirm that is enough, or whether a transient confirmation is wanted
   later (no toast was added).
8. **Touch-target exceptions:** none were found on the three surfaces; confirm
   the 44 px rule should also bind dense table rows in a future stage.

---

## 10. Integration checklist (Mentingo)

| Flow | Adapter methods | Confirmed Mentingo concept? | Mocked now |
| --- | --- | --- | --- |
| Session / role gate | `auth.getSession` | No — auth transport unconfirmed (gap) | Yes |
| Teacher dashboard | `teachers.getDashboard` | No — PROPOSED | Yes |
| Teacher classes | `classrooms.listForTeacher`, `classrooms.get` | No — PROPOSED | Yes |
| Materials and units | `materials.listForTeacher` | No — PROPOSED | Yes |
| Existing questions | `questions.listForTest`, `questions.update`, `questions.delete` | No — PROPOSED | Yes |
| Tests | `tests.get`, `tests.createDraft`, `tests.publish` | No — PROPOSED | Yes |
| Student profile | `students.getProfile` | No — PROPOSED | Yes |
| Published tests | `tests.listForClass` | No — PROPOSED | Yes |
| Attempts | `attempts.listForStudent`, `attempts.start`, `attempts.get`, `attempts.saveAnswer`, `attempts.submit` | No — PROPOSED | Yes |
| Mohsen grounded Q&A | `mohsen.draftQuestions`, `mohsen.ask` | No — PROPOSED; real retrieval contract undefined | Yes |

Swapping to the real backend remains config-only (`VITE_API_ADAPTER=http`,
`VITE_API_URL`), with the Stage 0 contract unchanged. The real `mohsen.ask`
implementation must return, for every `answered` result, at least one grounding
ref with a non-empty label and excerpt; the UI will otherwise refuse to show it.