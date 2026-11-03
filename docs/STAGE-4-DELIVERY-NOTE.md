# BRIDGIO — Stage 4 — Delivery Note

**Stage:** 4 only — student test player (one screen: questions + Mohsen Q&A)
**Branch:** `opencode-stage4`, branched from `main` at `6acc9ea` (PR #7 merge)
**Date:** 2026-11-03
**Status:** Built and self-verified. **NOT verified by Muse yet. NOT merged to
`main`. NOT final, locked, or externally ready. No Stage 5 work started.**
**Model:** DeepSeek V4.1 Flash Free — provider `tokenharbor`, exact listed model
id `deepseek-v4.1-flash:free`.

---

## 0. Docs refresh gate (done before any code)

The LIVE_RULES status line was read before building. It records Stage 3 as
**VERIFIED PASS** and **MERGED** through PR #7, merge commit `6acc9ea`, with
Stage 4 authorised. The gate passed.

The docs refresh was committed alone, before any code:

```text
700e2f6 docs(stage4): sync LIVE_RULES with stage 3 merge status (main 6acc9ea)
```

- The four owner docs were preserved across the branch switch (backed up outside
  the repo and restored before the commit; hashes matched the backup).
- Only `docs/BRIDGIO-LIVE_RULES.md` differed from `main`. The change is
  docs-only: no code, test, asset or config file in that commit.
- No `git checkout -- docs/` was used to overwrite the owner's current docs.
- The five owner locks were not reopened: dark-band cream 75% / border 24% /
  hover 8% / cream focus ring, Alexandria Bold as 600 and Nunito 700 max,
  `?as` preview role kept, student Lessons/Progress unassigned, small-header
  breakpoints unchanged.

---

## 1. What changed

The student **My Tests** destination now opens the real Stage 4 player at
`/student/tests`. The player is one screen: the test runner and the Mohsen Q&A
panel sit side by side (stacked on phone). Lessons and Progress stay explicit
`NotBuiltScreen` placeholders, and the Stage 2 dashboard plus the Stage 3
teacher builder are untouched.

| File | Change |
| --- | --- |
| `src/api/queries.ts` | Added query options for a student profile, a class's published tests, a student's attempts and one attempt. All call existing adapter methods. |
| `src/components/player/player.ts` | Pure logic: attempt lookup/state, question index bounds, progress percent, saved-option lookup, unanswered count, Mohsen scope, per-class list de-dup/sort. |
| `src/components/player/player.test.ts` | 11 new unit tests for that logic. |
| `src/components/player/StudentTestPlayer.tsx` | Top-level player: session gate, per-class test list, start/resume, two-column runner + Mohsen layout. |
| `src/components/player/TestList.tsx` | Published tests for the student's classes, each with new / in-progress / submitted state and honest empty/error states. |
| `src/components/player/TestRunner.tsx` | One question at a time, options, autosave on select, previous/next, progress bar, submit with an unanswered-confirm panel, completion state. |
| `src/components/player/MohsenPanel.tsx` | Grounded Q&A thread beside the player; every answer shows its source, a refusal is shown verbatim. |
| `src/content/strings.ts` | Centralised Stage 4 Arabic copy (`ar.player`), player title/description, Stage 4 banner and English footer line. |
| `src/styles/app.css` | Stage 4 player layout appended; existing tokens only, light theme, RTL. |
| `src/routes/student.tests.tsx` | Replaced the Stage 1 placeholder with the player; loader prefetches session, then profile, attempts and per-class tests. |
| `src/api/mock/mock-adapter.test.ts` | 2 new tests: a student sees only published tests for an enrolled class, and is forbidden a class they are not enrolled in. |
| `docs/screenshots/stage4-*.png` | Arabic desktop and phone captures, listed in §7. |
| `docs/STAGE-4-DELIVERY-NOTE.md` | This note. |

### The player flow

1. **My tests** — the student's published tests, merged from each of their
   classes, newest first. Each row shows its state from the student's own
   attempts: "جديد" (start), "شغّال" (resume) or "تم التسليم" (no action, with a
   note that marking is not part of this stage).
2. **Answering** — one question at a time, with a progress bar and
   "سؤال X من Y". Choosing an option saves it immediately through
   `attempts.saveAnswer`. Previous/next move within bounds. No correct/incorrect
   feedback is shown anywhere.
3. **Submit** — submits through `attempts.submit`. If questions are unanswered an
   inline confirmation says how many remain and offers "أيوه، سلّم" or
   "كمّل حل". Submitting **records the attempt only**; there is no score.
4. **Completion** — an honest done state ("تم تسليم الاختبار") states that the
   attempt was recorded, that there is no automatic marking or grades in this
   stage, and offers a return to the test list.
5. **Mohsen beside it** — the same screen hosts the Q&A panel. It is grounded to
   the open test's own source only; every answered result shows its source label
   and excerpt, and a `not_grounded` result is shown as "محسن مش لاقي إجابة"
   rather than a guess.

---

## 2. Data path — adapter/mock only

Components import only query options and the adapter from `src/api/`. No
component calls `fetch`, imports the mock directly, or contains hard-coded
classes, tests, questions or attempts.

| Adapter method | Used for | Status | Mocked |
| --- | --- | --- | --- |
| `auth.getSession` | Student identity / role gate | **PROPOSED** — Mentingo auth transport unconfirmed | Yes |
| `students.getProfile` | The student's classes | **PROPOSED** | Yes |
| `tests.listForClass` | Published tests per class | **PROPOSED** | Yes |
| `attempts.listForStudent` | The student's own attempt state per test | **PROPOSED** | Yes |
| `attempts.start` | Start (or resume) an attempt | **PROPOSED** | Yes |
| `attempts.get` | Load the open attempt and its saved answers | **PROPOSED** | Yes |
| `questions.listForTest` | The attempt's questions and options | **PROPOSED** | Yes |
| `attempts.saveAnswer` | Save one answer on option select | **PROPOSED** | Yes |
| `attempts.submit` | Submit the attempt (records it only) | **PROPOSED** | Yes |
| `mohsen.ask` | Grounded Q&A beside the player | **PROPOSED** | Yes |

No field was added to the Stage 0 contract. No adapter method was added. No
endpoint is presented as a confirmed Mentingo endpoint. `VITE_API_ADAPTER`,
`VITE_API_URL` and `VITE_MOCK_SCENARIO` remain the only switches; mock is the
default and no live Mentingo connection is claimed. The Mohsen panel's scope for
a player screen is `{ classroomId: null, testId, materialIds: [], unitId: null }`
— the test's own source only.

**Persistent vs UI state:** the attempt, its saved answers, the questions and
the published tests all live in the adapter. Component state is limited to the
active attempt id, the current question index and the submit-confirm flag.

---

## 3. What was NOT built

- No intelligent marking, scoring, grades, correct/incorrect result UI or
  answer review. Submit records the attempt and shows completion/next step only.
- No price, subscription, installments or payment UI.
- No Learn-to-Hire, certificate, exotic/foreign-language flow or Future Layer.
- No teacher dashboard or test-builder change; Stage 3 stays as built.
- No test-detail screen; dashboard recent-test rows stay non-interactive.
- No student Lessons or Progress screens — they remain explicit `NotBuiltScreen`
  placeholders and are **not** promised here.
- No Mohsen reaction poses or richer Q&A hardening (Stage 5).
- No dark theme, theme switcher or second theme.
- No new auth screen, user model, role system or session persistence beyond the
  existing mock session and the `?as` preview switch.
- No new fonts, images, brand assets, paid service or library. No favicon from
  the wordmark.
- No deployment, hosting, merge to `main` or Stage 5 work.

---

## 4. Token-sheet compliance

**LOCKED values used verbatim:** red `#D51C1D`, cream `#F9ECD9`, paper
`#FFF6E8`, maroon `#2C0706`, success `#1F7A57`, info `#2A62B0`, warning fill
`#F2A93B` (fill only, maroon text), error wine `#7E1A2B`. Card radius 24 px,
pill chips/buttons, sticker outlines, no drop shadows. Arabic-first RTL, light
theme only.

**PROPOSED FOR UI values used as-is and labelled proposed here:** neutrals,
type scale, spacing 4/8/12/16/24/32/48/64, input/sheet radii, 44 px touch
targets and the focus ring. None is presented as a brand lock.

**No new hex value or design token was introduced** — the appended Stage 4 CSS
contains zero hard-coded colours and reuses the existing custom properties. The
five owner locks are unchanged. The header, fonts and colours match Stages 1–3
exactly.

Student copy is Egyptian colloquial and leads with the next small step. There is
no hiring promise and no price. All Stage 4 Arabic is centralised in
`src/content/strings.ts`.

### Deviations / things to note

1. **No Mohsen pose.** The reactions sheet is Stage 5 per LIVE_RULES §7
   ("Stages 2–4 add no new files"). Loading, empty and error states use the
   existing neutral inline icons + words.
2. **Demo needs `VITE_MOCK_SESSION=student`.** The default mock session is the
   teacher, so `/student/tests` honestly shows the "no student session" note
   until the mock is started as a student. See §6 for the exact command.
3. **One attempt per test in the mock.** `attempts.start` returns the existing
   unsubmitted attempt rather than creating a second one, so "resume" reappears
   after leaving and returning in the same page lifetime. The mock DB is
   per-page in-memory, so a hard reload re-seeds it.
4. **Arabic-Indic digits.** Question numbers, counts and the progress percent use
   `Intl` (`ar-EG`); this remains a display choice for owner review, not a brand
   token.
5. **Mohsen panel scope.** The panel is intentionally narrow: it answers only
   from the open test's source. It does not answer general class or curriculum
   questions, by design, to avoid unguessed answers.
6. **Sequential submit only.** Answers are saved per question; the player submits
   the whole attempt at once and does not auto-submit at the last question.

---

## 5. States

- **No student session** (default mock is the teacher): "مفيش جلسة طالب." with
  an honest note that sign-in and roles belong to Mentingo and are not connected
  yet. No invented auth flow.
- **No tests for the student's classes** (empty scenario): "مفيش اختبارات لسه"
  with the note that a test appears once a teacher publishes one for the class.
- **Loading / error:** `role="status"` loading lines and wine-outlined error
  notes using the existing "المشكلة من جهتنا مش من جهتك" wording, for the list,
  the runner, saving an answer, submitting and Mohsen.
- **Unanswered submit:** an inline `role="alert"` panel names the remaining
  count and offers submit-anyway or keep-solving; it is never submitted silently.
- **Submitted test:** the row shows "تم التسليم" and a note that marking is not
  part of this stage; opening a submitted test from the list is a no-op.
- **Mohsen not grounded:** the adapter's refusal message is shown verbatim under
  "محسن مش لاقي إجابة"; the UI does not guess.

Empty data is reproducible without code changes: `VITE_MOCK_SCENARIO=empty`. For
this verification a second dev server was started with the empty scenario and the
student session on a separate port, and the captures were taken there.

---

## 6. Verification (run in this session)

```text
npm test         → 7 files, 62 tests passed
                   (49 previous + 11 player-logic + 2 mock student class-tests)
npm run typecheck → pass (tsc --noEmit)
npm run build    → pass: client + SSR bundles
```

Demo/preview: the seeded student preview was served with the mock student
session:

```text
VITE_MOCK_SESSION=student npm run dev        # then open /student/tests?as=student
VITE_MOCK_SCENARIO=empty VITE_MOCK_SESSION=student npm run dev   # empty state
```

Additional checks:

- Built page title `اختباراتي — Bridgio`; `lang="ar" dir="rtl"`; Arabic player
  content; Stage 4 banner present.
- Browser console clean (zero errors) after each captured flow.
- Headless flow at 1440 px and 390 px (deviceScaleFactor 2 for the phone):
  list → open/resume test → answer question 1 → next → answer question 2 → ask
  Mohsen → grounded answer with source → next → answer question 3 → submit →
  completion.
- At both widths `document.documentElement.scrollWidth` equals `clientWidth` on
  every captured state (list, player, completion, empty). No horizontal overflow.
- The seeded student (Sara) already has an in-progress attempt for the published
  derivatives test, so the list row reads "كمّل الاختبار"; the empty scenario
  reads "مفيش اختبارات لسه".
- Mohsen returned a grounded answer with the source label "مادة — مذكرة
  التفاضل — قواعد الاشتقاق" and excerpt, shown with the answer.

---

## 7. Arabic screenshots

All captures are Arabic and RTL. Phone images are 780 px wide files = 390 CSS
px at 2x.

| File | Size | Content |
| --- | --- | --- |
| `docs/screenshots/stage4-desktop-list.png` | 1440 x 1000 | Published test list with its in-progress state |
| `docs/screenshots/stage4-desktop-player.png` | 1440 x 1202 | Runner (question, options, progress) beside the Mohsen panel with a grounded answer |
| `docs/screenshots/stage4-desktop-completion.png` | 1440 x 1202 | Submitted / completion state |
| `docs/screenshots/stage4-empty-desktop.png` | 1440 x 1000 | Empty scenario — no tests, desktop |
| `docs/screenshots/stage4-phone-list.png` | 780 x 1990 | Published test list, phone |
| `docs/screenshots/stage4-phone-player.png` | 780 x 3818 | Runner + Mohsen panel stacked, phone |
| `docs/screenshots/stage4-phone-completion.png` | 780 x 3818 | Submitted / completion state, phone |
| `docs/screenshots/stage4-empty-phone.png` | 780 x 1844 | Empty scenario — no tests, phone |

---

## 8. Stage 4 gate self-check

- [x] Student test player only: question display, options, submit, progress, with
      the Mohsen Q&A panel on the same screen.
- [x] All data through `src/api/`; no hard-coded component data and no component
      `fetch`; no new contract field; no new adapter method; endpoints stay
      **PROPOSED**.
- [x] Submit records the attempt and shows completion/next step only — no
      marking, scoring or grades.
- [x] Arabic-first, full RTL, light theme only; player Arabic centralised in
      `src/content/strings.ts`.
- [x] Locked tokens verbatim; no new hex/token; five owner locks untouched.
- [x] Empty, loading and error states for no session, no tests, runner load,
      answer save, submit and Mohsen.
- [x] Tests, typecheck and build pass; built preview verified at 1440 and
      390 px with no horizontal overflow and no console errors.
- [x] Arabic desktop + phone screenshots and empty-state captures included.
- [x] No intelligent marking, scores/grades, price, installments,
      Learn-to-Hire, exotic-language flow, dark theme, new auth/user model or
      wordmark favicon.
- [x] Teacher dashboard and test builder untouched; Lessons/Progress stay
      unassigned placeholders; recent-test rows stay as-is.
- [ ] Muse verification.
- [ ] Merge to `main` (owner decision; not done here).

---

## 9. Open questions

1. **Endpoint gap:** which Mentingo endpoints will implement the ten PROPOSED
   adapter methods above, and do their request/response shapes match the Stage 0
   contract? No backend was invented.
2. **Auth gap:** Mentingo auth transport/session is still unconfirmed; the player
   currently depends on the mock student session.
3. **Attempt lifecycle:** should the mock (and later the backend) allow more than
   one attempt per test per student, or explicitly reset an attempt? Today one
   unsubmitted attempt per test per student is reused as "resume".
4. **Grounding scope:** should the Mohsen panel also be allowed to answer general
   questions about the class or curriculum, or stay strictly limited to the open
   test's source? This stage chose the narrow scope to avoid unguessed answers.
5. **Progress semantics:** the bar shows the share of questions *answered*, not
   questions visited. Confirm this is the intended reading of "progress".
6. **Submit confirmation:** should the unanswered warning be a blocking dialog
   instead of an inline panel? It is currently inline and non-blocking.
7. **Numeral system:** keep Arabic-Indic digits for question numbers, counts and
   the percent, or switch to Western digits while keeping Arabic labels?
8. **After submit:** should completion link to a future results/review screen, or
   keep only the return-to-list action (as built, since marking is out of scope)?

---

## 10. Integration checklist (Mentingo)

| Flow | Adapter methods | Confirmed Mentingo concept? | Mocked now |
| --- | --- | --- | --- |
| Student identity | `auth.getSession` | No — auth method unconfirmed (gap) | Yes |
| Student's classes | `students.getProfile` | No — PROPOSED | Yes |
| Published tests per class | `tests.listForClass` | No — PROPOSED | Yes |
| Attempt state per test | `attempts.listForStudent` | No — PROPOSED | Yes |
| Start / resume an attempt | `attempts.start` | No — PROPOSED | Yes |
| Open an attempt | `attempts.get` | No — PROPOSED | Yes |
| Questions and options | `questions.listForTest` | No — PROPOSED | Yes |
| Save an answer | `attempts.saveAnswer` | No — PROPOSED | Yes |
| Submit the attempt | `attempts.submit` | No — PROPOSED | Yes |
| Mohsen Q&A | `mohsen.ask` | No — PROPOSED | Yes |

Swapping to the real backend remains config-only (`VITE_API_ADAPTER=http`,
`VITE_API_URL`), with the contract unchanged. Persisted attempts, saved answers
and question order must survive the swap; local UI state is not a data source.
