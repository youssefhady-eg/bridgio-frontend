# BRIDGIO — Stage 3 — Delivery Note

**Stage:** 3 only — teacher test builder (four steps)
**Branch:** `opencode-stage3`, branched from `main` at `7e9600c` (PR #6 merge)
**Date:** 2026-11-03
**Status:** Built and self-verified. **NOT verified by Muse yet. NOT merged to
`main`. NOT final, locked, or externally ready. No Stage 4 work started.**
**Model:** DeepSeek V4.1 Flash Free — provider `tokenharbor`, exact listed model
id `deepseek-v4.1-flash:free`.

---

## 0. Docs refresh gate (done before any code)

The LIVE_RULES status line was read before building. It records Stage 2 as
**VERIFIED PASS** and **MERGED** through PR #6, merge commit `7e9600c`, with
Stage 3 authorised. The gate passed.

The docs refresh was committed alone, before any code:

```text
eddac43 docs: sync owner current four docs for stage 3 (main 7e9600c)
```

- The four owner docs were backed up outside the repo and restored before the
  commit; their hashes matched the backup.
- Only `docs/BRIDGIO-LIVE_RULES.md` differed from `main`. The change is
  docs-only: no code, test, asset or config file in that commit.
- No `git checkout -- docs/` was used to overwrite the owner's current docs.
- The five owner locks were not reopened: dark-band cream 75% / border 24% /
  hover 8% / cream focus ring, Alexandria Bold as 600 and Nunito 700 max,
  `?as` preview role kept, student Lessons/Progress unassigned, small-header
  breakpoints unchanged.

---

## 1. What changed

The teacher **Tests** destination now opens the real four-step test builder at
`/teacher/tests`. The Stage 2 dashboard is otherwise untouched, and its recent
test rows remain non-interactive (no test-detail screen was invented).

| File | Change |
| --- | --- |
| `src/api/queries.ts` | Added query options for classes, class detail (units), materials, a test, and test questions. All call existing adapter methods. |
| `src/components/builder/TestBuilder.tsx` | Four-step flow, adapter queries/mutations, draft and publish state, restart. |
| `src/components/builder/builder.ts` | Pure logic: step bounds, step entry, publish gate, source validation, question validation, list replace/renumber. |
| `src/components/builder/builder.test.ts` | 15 new unit tests for that logic. |
| `src/components/builder/StepChooseSource.tsx` | Step 1: class + material/curriculum unit + title/description; loading, error and empty states. |
| `src/components/builder/StepDraftQuestions.tsx` | Step 2: optional focus, count 1–10, drafting request, grounded preview, idle / no-grounding / error states. |
| `src/components/builder/StepReviewQuestions.tsx` | Step 3: review list; edits and deletes go through `questions.update` / `questions.delete`; empty and error states. |
| `src/components/builder/QuestionCard.tsx` | Inline editor (prompt, 2–6 options, reference answer) and delete confirmation. |
| `src/components/builder/StepPublish.tsx` | Step 4: summary, honest publish gating, publish, success, restart. |
| `src/components/builder/StepIndicator.tsx` | Four-step indicator with locked states. |
| `src/components/builder/GroundingList.tsx` | Adapter-supplied source label/excerpt shown with each question. |
| `src/content/strings.ts` | Centralised Stage 3 Arabic copy, builder title, empty/error/blocked copy. |
| `src/styles/app.css` | Stage 3 builder layout appended; existing tokens only, light theme, RTL. |
| `src/routes/teacher.tests.tsx` | Replaced the Stage 1 placeholder with the builder route; loader prefetches session and classes. |
| `src/api/mock/mock-adapter.ts` | Repeated “add more” drafting now uses only unused bank questions and reports honestly when the source is exhausted. |
| `src/api/mock/mock-adapter.test.ts` | 1 new test for non-duplicating repeated drafting (49 tests total). |
| `docs/screenshots/stage3-*.png` | Arabic desktop and phone captures, listed in §7. |
| `docs/STAGE-3-DELIVERY-NOTE.md` | This note. |

### The four steps

1. **Choose a source** — pick one of the teacher's classes, then a ready
   material or a curriculum unit that belongs to that class; enter a title and
   optional description. Creating the draft persists it through
   `tests.createDraft` and moves to step 2.
2. **Mohsen drafts questions** — an optional focus sentence and a requested
   count (1–10). Mohsen drafts only from the chosen source. Every previewed
   question shows its source and excerpt. A `no_grounding` result is shown as
   an honest empty state, never as a guess.
3. **Review, edit, delete** — every drafted question is editable and deletable.
   Editing covers the prompt, 2–6 options and an optional reference answer for
   the teacher. Nothing is auto-marked or scored. Empty review and update/delete
   errors are explicit.
4. **Publish** — a summary shows title, class, source, question count and status.
   The publish button is disabled only with a visible, specific reason
   (`no_test`, `no_class`, `no_questions`, `already_published`). Success confirms
   the test was published to the class and offers “start a new test”.

After publishing, steps 1–3 are locked in this version; only the success state
and “start a new test” remain, which prevents editing a live test without a
test-detail screen (Stage 3 does not build one).

---

## 2. Data path — adapter/mock only

Components import only query options and the adapter from `src/api/`. No
component calls `fetch`, imports the mock directly, or contains hard-coded
classes, materials, units, tests or questions.

| Adapter method | Used for | Status | Mocked |
| --- | --- | --- | --- |
| `auth.getSession` | Teacher identity for the builder | **PROPOSED** — Mentingo auth transport unconfirmed | Yes |
| `classrooms.listForTeacher` | Step 1 class list | **PROPOSED** — Mentingo to implement on restore/rebuild | Yes |
| `classrooms.get` | Curriculum units for the chosen class | **PROPOSED** | Yes |
| `materials.listForTeacher` | Ready materials for the chosen class | **PROPOSED** | Yes |
| `tests.createDraft` | Persist step 1 draft | **PROPOSED** | Yes |
| `mohsen.draftQuestions` | Step 2 grounded drafting | **PROPOSED** | Yes |
| `questions.listForTest` | Draft questions for steps 3–4 | **PROPOSED** | Yes |
| `questions.update` | Step 3 edit/save | **PROPOSED** | Yes |
| `questions.delete` | Step 3 delete | **PROPOSED** | Yes |
| `tests.publish` | Step 4 publish to class | **PROPOSED** | Yes |

No field was added to the Stage 0 contract. No endpoint is presented as a
confirmed Mentingo endpoint. `VITE_API_ADAPTER`, `VITE_API_URL` and
`VITE_MOCK_SCENARIO` remain the only switches; mock is the default and no live
Mentingo connection is claimed.

**Persistent vs UI state:** the draft test, its questions, their order, their
grounding and the published status all live in the adapter. Component state is
limited to the current step, the chosen source ids, the title/description, the
focus/count inputs and transient editor state.

---

## 3. What was NOT built

- No intelligent marking, scoring, grades, correct/incorrect result UI or
  student attempt review.
- No price, subscription, installments or payment UI.
- No Learn-to-Hire, certificate, exotic/foreign-language flow or Future Layer.
- No student test player (Stage 4).
- No Mohsen Q&A hardening or reaction poses (Stage 5).
- No test-detail screen; dashboard recent-test rows stay non-interactive.
- No dark theme, theme switcher or second theme.
- No auth screen, user model, role system or session persistence beyond the
  existing mock session and the `?as` preview switch.
- No change to the Stage 2 dashboard content or its non-interactive rows.
- No new fonts, images, brand assets, paid service or library.
- No deployment, hosting, merge to `main` or Stage 4 work.

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

**No new hex value or design token was introduced.** Stage 3 CSS reuses the
existing custom properties. The five owner locks are unchanged.

Teacher copy is formal MSA and leads with time saved and review control. There
are no hiring promises and no price. All Stage 3 draft Arabic is centralised in
`src/content/strings.ts`.

### Deviations / things to note

1. **No Mohsen pose in empty states.** The reactions sheet is Stage 5 per
   LIVE_RULES §7 (“Stages 2–4 add no new files”). Empty, loading and error
   states use a neutral inline icon + word.
2. **Arabic-Indic digits.** Counts and question numbers use `Intl` (`ar-EG`) as
   ٣ / ٤; this remains a display choice for owner review, not a brand token.
3. **Class and source lock after draft creation.** There is no test-detail
   screen, so changing the source of an existing draft would require deleting
   the draft. The UI states this honestly and offers a new test after publish.
4. **Finite mock question bank.** When more questions are requested than the
   bank still has, the mock adds only unused questions and then reports that the
   source is exhausted. Production Mohsen must decide how to generate more from
   the source; the UI does not invent questions.
5. **Focus is currently advisory in the mock.** The focus field is sent through
   the adapter/contract but the mock bank does not filter on it yet.
6. **Summary layout.** Step 4 and the success state use compact label/value
   rows so the summary stays readable at 390 px and does not pair unrelated
   fields side by side.

---

## 5. States

- **No classes** (empty scenario): “لا توجد صفوف بعد” with an icon and honest
  body copy; no source picker is shown.
- **No materials for a class:** “لا توجد مواد لهذا الصف” and a hint to choose a
  curriculum unit instead.
- **No units for a class:** “لا توجد وحدات لهذا الصف” with the alternative
  material path.
- **No questions yet:** step 2 idle note explains that Mohsen has not been asked
  yet; step 3 empty note explains that publishing needs at least one question
  and links back to drafting.
- **No grounding / exhausted source:** the adapter's message is shown verbatim;
  the UI does not guess.
- **Publish blocked:** each reason has specific Arabic copy, and the button is
  never disabled silently:
  - `no_test` — start from step 1;
  - `no_class` — go back and choose a class;
  - `no_questions` — go back and add/request a question;
  - `already_published` — this test is already published.
- **Loading / error:** `role="status"` loading lines and wine-outlined error
  notes with the existing “من جهتنا، لا من جهتك” wording. No retry control is
  promised beyond re-requesting the action.
- **No teacher session:** explicit note that Mentingo owns sign-in and it is
  not connected yet; no invented auth flow.

Empty data is reproducible without code changes:
`VITE_MOCK_SCENARIO=empty`. For this verification it was built to a temporary
output directory and served separately; the seeded preview stays on port 4180.

---

## 6. Verification (run in this session)

```text
npm test         → 6 files, 49 tests passed
                   (33 previous + 15 builder + 1 mock repeated-drafting test)
npm run typecheck → pass (tsc --noEmit)
npm run build    → pass: client + SSR bundles
npm run preview  → 200 on /teacher/tests?as=teacher
```

Additional checks:

- Built page title `منشئ الاختبارات — Bridgio`; `lang="ar" dir="rtl"`; Arabic
  builder content; Stage 3 banner present.
- Browser console clean (zero errors) after reload of the built preview.
- Headless flow at 1440 px and 390 px (deviceScaleFactor 2 for the phone):
  step 1 → create draft → request 3 questions → review → edit first question →
  delete second question → publish.
- At 390 px, `document.documentElement.scrollWidth` equals `clientWidth` on
  every captured state (step 1, step 2 idle, step 2 drafted, step 3, step 3
  edited, step 4, published, empty). No horizontal overflow.
- Edit persisted and was visible on return to the card; delete reduced the
  count from 3 to 2 before publishing.
- Publish summary showed the edited draft and two questions; publish produced
  the success state with the published status.
- Blocked path verified: a draft with zero questions reaches step 3 empty, then
  step 4 shows “النشر غير متاح بعد” with the no-question reason and a disabled
  publish button that carries the visible explanation.
- Empty scenario verified at desktop and phone with no classes.

---

## 7. Arabic screenshots

All captures are Arabic and RTL. Phone images are 780 px wide files = 390 CSS
px at 2×.

| File | Size | Content |
| --- | --- | --- |
| `docs/screenshots/stage3-desktop-step1.png` | 1440 × 1408 | Step 1 with class, material, title and description filled |
| `docs/screenshots/stage3-desktop-step2-idle.png` | 1440 × 1310 | Step 2 before drafting (no questions yet) |
| `docs/screenshots/stage3-desktop-step2-drafted.png` | 1440 × 2198 | Step 2 with three grounded questions and excerpts |
| `docs/screenshots/stage3-desktop-step3.png` | 1440 × 2046 | Step 3 review list before edits |
| `docs/screenshots/stage3-desktop-step3-edited.png` | 1440 × 1661 | Step 3 after editing one question and deleting another |
| `docs/screenshots/stage3-desktop-step4.png` | 1440 × 1192 | Step 4 summary with publish enabled |
| `docs/screenshots/stage3-desktop-published.png` | 1440 × 1033 | Published success state |
| `docs/screenshots/stage3-step3-empty.png` | 1440 × 1043 | Step 3 with no questions yet |
| `docs/screenshots/stage3-publish-blocked.png` | 1440 × 1216 | Step 4 blocked with the no-question reason |
| `docs/screenshots/stage3-empty-desktop.png` | 1440 × 1200 | Empty scenario — no classes, desktop |
| `docs/screenshots/stage3-phone-step1.png` | 780 × 3252 | Step 1, phone |
| `docs/screenshots/stage3-phone-step2-idle.png` | 780 × 3186 | Step 2 idle, phone |
| `docs/screenshots/stage3-phone-step2-drafted.png` | 780 × 4924 | Step 2 drafted, phone |
| `docs/screenshots/stage3-phone-step3.png` | 780 × 4702 | Step 3 review, phone |
| `docs/screenshots/stage3-phone-step3-edited.png` | 780 × 3916 | Step 3 edited, phone |
| `docs/screenshots/stage3-phone-step4.png` | 780 × 2862 | Step 4 summary, phone |
| `docs/screenshots/stage3-phone-published.png` | 780 × 2578 | Published success, phone |
| `docs/screenshots/stage3-empty-phone.png` | 780 × 2304 | Empty scenario — no classes, phone |

---

## 8. Stage 3 gate self-check

- [x] Four steps only: source → drafting → review/edit/delete → publish.
- [x] All data through `src/api/`; no hard-coded component data and no component
      `fetch`; no new contract field; endpoints stay **PROPOSED**.
- [x] Every generated question is editable and deletable before publish.
- [x] Publish gating is honest and has visible copy for every block reason.
- [x] Arabic-first, full RTL, light theme only; draft Arabic centralised in
      `src/content/strings.ts`.
- [x] Locked tokens verbatim; no new hex/token; five owner locks untouched.
- [x] Empty and error states for no classes, no materials, no units, no
      questions and blocked publish.
- [x] Tests, typecheck and build pass; built preview verified at 1440 and
      390 px with no horizontal overflow and no console errors.
- [x] Arabic desktop + phone screenshots and empty-state captures included.
- [x] No marking, scoring, price, installments, Learn-to-Hire, dark theme, new
      auth model, student player, Mohsen Q&A hardening or test-detail screen.
- [x] Stage 2 dashboard not changed; its recent-test rows remain
      non-interactive.
- [ ] Muse verification.
- [ ] Merge to `main` (owner decision; not done here).

---

## 9. Open questions

1. **Endpoint gap:** which Mentingo endpoints will implement the ten PROPOSED
   adapter methods above, and do their request/response shapes match the Stage 0
   contract? No backend was invented.
2. **Auth gap:** Mentingo auth transport/session is still unconfirmed; the
   builder currently depends on the mock teacher session.
3. **Source locking:** should a teacher be able to change a draft's class or
   source before publishing? This version locks them after draft creation
   because there is no test-detail/edit screen.
4. **Repeated drafting:** production Mohsen should decide whether “add more”
   generates new grounded questions from the source or stops when the source is
   exhausted. The mock now stops honestly instead of duplicating.
5. **Focus instruction:** should the focus sentence filter or steer real Mohsen
   generation? The mock currently accepts it but does not apply it.
6. **After publish:** should the success state link back to the dashboard or a
   future test-detail screen, rather than only offering a new test?
7. **Numeral system:** keep Arabic-Indic digits for counts/question numbers, or
   switch to Western digits while keeping Arabic labels?
8. **Summary density:** the compact label/value summary is a Stage 3 layout
   choice; confirm it is preferred over a two-column card summary at desktop.

---

## 10. Integration checklist (Mentingo)

| Flow | Adapter methods | Confirmed Mentingo concept? | Mocked now |
| --- | --- | --- | --- |
| Teacher identity | `auth.getSession` | No — auth method unconfirmed (gap) | Yes |
| Step 1 classes | `classrooms.listForTeacher` | No — PROPOSED | Yes |
| Step 1 units | `classrooms.get` | No — PROPOSED | Yes |
| Step 1 materials | `materials.listForTeacher` | No — PROPOSED | Yes |
| Step 1 draft | `tests.createDraft` | No — PROPOSED | Yes |
| Step 2 drafting | `mohsen.draftQuestions` | No — PROPOSED | Yes |
| Steps 3–4 questions | `questions.listForTest`, `questions.update`, `questions.delete` | No — PROPOSED | Yes |
| Step 4 publish | `tests.publish` | No — PROPOSED | Yes |

Swapping to the real backend remains config-only (`VITE_API_ADAPTER=http`,
`VITE_API_URL`), with the contract unchanged. Persisted draft questions, their
order, grounding and published status must survive the swap; local UI state is
not a data source.