# BRIDGIO — Batch 2 Delivery Note

**Date:** 2026-11-13
**Branch:** `feat/teacher-test-results`
**Base:** `cc1fff3` (`origin/main`, merge of PR #29 / Batch 1)
**Scope:** teacher per-test results on `/teacher/tests/$testId` and the student score on the existing `/student/tests/$testId/results`. Branch pushed only — no PR, no merge.

---

## 1. What changed

### A — Contract: one new PROPOSED method

`src/api/contract.ts`, `src/api/types/attempts.ts`

- `attempts.listForTest(input: { testId: TestId }): Promise<TestAttemptSummary[]>`
  - **PROPOSED — NEW in Batch 2.** The contract had `attempts.listForStudent` only, so a teacher had no way to read the attempts on one of their own tests. The method is labelled PROPOSED in the contract, the mock and the query helper; it is a proposal for Mentingo to implement on restore/rebuild, not an existing endpoint.
  - Teacher-only. `TestAttemptSummary` carries the student identity the list needs (`studentId`, `studentName`) plus `status`, `answeredCount`, `questionCount`, `startedAt`, `submittedAt` and `scorePercent`.
  - It is a separate type rather than an extension of `AttemptSummary`, because the teacher row needs a student name that `AttemptSummary` does not have. Nothing else in the contract changed.
- `Attempt.scorePercent: number | null`
  - Backend-supplied display data, in the same spirit as the parent view's `ParentResult.scorePercent`. The frontend never derives it from `answers`; null renders as “score unavailable”, never as zero.
  - Added to the detail type only, not to `AttemptSummary`, so existing fixtures and list responses do not ripple.

HTTP adapter path: `GET /tests/{testId}/attempts` (`src/api/http/endpoints.ts`, `src/api/http/http-adapter.ts`).

### B — Mock implementation (PROPOSED, seeded)

`src/api/mock/seed.ts`, `src/api/mock/mock-adapter.ts`, `src/api/queries.ts`, `src/api/query-keys.ts`

- `attempts.listForTest` returns every attempt on the teacher's own test, newest activity first (`submittedAt ?? startedAt`, descending). A student session is refused (`FORBIDDEN`); a teacher who does not own the test is refused through `requireVisibleTest`.
- **One score source.** The score still lives only in `db.resultScores[attemptId]` — the same map the parent projection already reads. Attempts are stored as `MockAttempt = Omit<Attempt, 'scorePercent'>`, so a seeded attempt cannot carry a second, drifting copy of its score. Both `attempts.get` and `attempts.listForTest` map the value on the way out.
- `attempts.get` now maps `scorePercent` too, so the student review can show the same backend value without a second endpoint.
- Query wiring: `queryKeys.attempts.forTest(testId)` and `testAttemptsQueryOptions(testId)` (stale time 0). No component calls the adapter directly.

**Seed data added:**

| Item | Value |
| --- | --- |
| Test | `test_math_integration_1` — published, class Math, source unit “التكامل”, 3 questions (`q_integ_1..3`) |
| Attempt | `attempt_sara_integration` — Sara, submitted 2026-11-02, 3/3 answered |
| Score | `resultScores.attempt_sara_integration = 67` (backend-supplied; not derived from the picks) |
| Existing states kept | `test_math_deriv_1`: Sara `attempt_sara_deriv` still in progress / score null; Omar `attempt_omar_deriv` submitted / 67. `test_math_integration_draft` stays a draft. |

The demo student session is Sara, and the sign-in screen is informational only, so a scored submitted attempt had to belong to Sara for the student score to be reachable in the demo. Sara's in-progress derivatives attempt is untouched so the resume flow still has its state.

### C — Teacher per-test results (`/teacher/tests/$testId`)

`src/components/teacher/TestDetail.tsx`, `src/styles/finish.css`, `src/content/strings.ts`

- The old “per-test results are not available” placeholder and its link to the class page are gone. The side column now renders the results list from `attempts.listForTest`: loading, error, empty and populated states.
- Each row: student name + status chip (`Submitted` success / `In progress` warning), the answered count, the submitted date (or “not submitted”), and the score at the row's end. Rows sit in a bordered `.panel` with hairline dividers, mirroring the owner-approved parent results treatment.
- The section count chip shows the number of attempts. The score label/value follows the parent view: label + backend value, or “not scored yet”.
- New CSS is a `Batch 2` block in `finish.css`: `.attempt-list`, `.attempt-row*`, `.attempt-score*`. Logical properties only (`align-items: end`, `border-block-start`, `padding-inline` elsewhere), locked tokens, no shadows.

### D — Student score (`/student/tests/$testId/results`)

`src/components/student/TestResults.tsx`, `src/styles/finish.css`, `src/content/strings.ts`

- The score summary row now shows `attempt.scorePercent`: `formatPercent` when the backend supplied a value, “الدرجة لسه مش متاحة” when null. It no longer claims that scores are not connected, and no score is calculated on the client.
- The score value is the only emphasis change (`.summary-list .score-value`, `--font-display-size-h3`); the unavailable state uses the muted text token.
- The screen lead now states the score source (“…ودرجتك زي ما المنصة حسبتها” / “your score as the platform supplies it”) instead of saying scores do not exist. The lead is rendered through `PageHero`, which previously left it unused.
- The pre-existing retake section was left untouched (see §5).

### E — Copy

`src/content/strings.ts` — AR + EN for both languages: teacher results heading/lead/loading/error/empty, attempt statuses, score label, score-unavailable, answered count, submitted label and date fallback; student score-unavailable and the corrected lead. The now-unused `resultsUnavailableTitle/Body`, `resultsClassLink` and `scoreNote` keys were removed. All UI copy stays in the central string file; no Arabic literal was added to a component.

---

## 2. Data layer

| Screen | Adapter calls | Contract status |
| --- | --- | --- |
| Teacher test detail — results | `attempts.listForTest` | **PROPOSED — new in Batch 2** |
| Teacher test detail — questions | `tests.get`, `questions.listForTest` | existing PROPOSED |
| Student test review — score | `attempts.listForStudent` → `attempts.get` | existing PROPOSED |
| Student test review — questions | `questions.listForStudentTest` | existing PROPOSED |

Every call goes through `src/api/`; no component calls `fetch`. No dependency, route or other contract signature changed.

**No marking anywhere.** Nothing in this batch marks an answer, counts correct options, or computes a percentage. Both screens render `scorePercent` as received. The teacher row and the student summary read the same mock score map, and the mock's own `submit` still records the attempt without marking it (the new attempt's score is null).

---

## 3. Verification gates

| Gate | Result |
| --- | --- |
| `npm test` | **142 passed (142)**, 17 files |
| `npm run typecheck` | **pass** (`tsc --noEmit`, no output) |
| `npm run build` | **pass**, exit 0 (vite client + Nitro SSR, then `tsc --noEmit`) |

New tests: contract-surface list includes `attempts.listForTest`; teacher list ordering, score mapping (67 and null), empty test, student `FORBIDDEN`; `attempts.get` score mapping on both a scored and an unscored attempt; the HTTP path `/tests/{id}/attempts`; the `Attempt` fixture carries `scorePercent: null`; the player test asserts a submitted attempt has no computed score.

---

## 4. Live behaviour (dev build; teacher session on :5199, student on :5200)

### Teacher test detail — `test_math_deriv_1`

- Two rows, newest activity first: Sara محمد (in progress, 1/3, not submitted, **لم تُحتسب بعد**) then Omar خالد (submitted, 3/3, 29 October 2026, **٦٧٪**).
- EN renders `In progress / Submitted`, `1 of 3`, `Not submitted`, `Not scored yet`, `67%`.
- Count chip = ٢ / 2; no console errors (`consoleErrorCount: 0`, `pageErrorCount: 0`).
- No horizontal overflow: `scrollWidth === innerWidth` at 390 and 1920.

### Student review — `test_math_integration_1`

- Lead, title, submitted status, 3/3 answered, submitted 2 November 2026, score **٦٧٪** (`67%` in EN).
- Score value computes to 20 px (the h3 token) at 1920; no overflow at 390.
- The unscored path is demonstrated on the teacher row above (Sara's in-progress attempt); the student review for an in-progress attempt still shows the existing “not finished” note and its score stays unavailable.

### Regression sweep

The teacher test detail still renders its questions, read-only state and draft panel; the student review still renders the per-question answer list and the existing retake section. Both screens were checked in AR and EN, light and dark, 1920 and 390 with no console errors, no error boundary, no `undefined` copy and no horizontal overflow.

---

## 5. Deviations and open items

1. **Retake is still on the student screen.** It predates this batch and was explicitly out of scope, so it was not removed or reworked. The button still calls `attempts.start`, which the mock rejects for a submitted attempt with `CONFLICT 409`; its existing error note remains the honest outcome. A future batch should decide whether to hide it until the backend supports retakes.
2. **`listForTest` is a proposal, not a backend endpoint.** The mock is the only implementation. Path and payload are a recommendation for Mentingo (`TestAttemptSummary` includes the student name the teacher needs).
3. **New seeded test.** The integration test and Sara's scored attempt were added so the student score is reachable in the demo (the demo student is Sara). This changes the teacher's test list by one published test and the material/test counts where those are derived from the seed; no assertion depended on the old totals beyond the ones updated in this branch.
4. **Teacher results live in the side column.** They reuse the existing `finish-grid__side` layout rather than a full-width table, because the parent results pattern is owner-approved and the row is designed to stack at 390. A wider table would be a layout change outside this scope.
5. **Score unavailable wording differs by audience.** Teacher results use “لم تُحتسب بعد” / “Not scored yet” (matching the parent view); the student review uses the colloquial “الدرجة لسه مش متاحة” / “Score unavailable”. Both are backend-null states, not zeros.
6. **The student lead is new on screen.** The string existed but was unused; it is now rendered so the score's provenance is stated above the fold. No other student copy changed beyond the score row.
7. **Dev-server ports.** Screenshots were taken against `localhost:5199` and `localhost:5200` because two mock sessions (teacher, student) were needed at once. The production build is unaffected.

---

## 6. Screenshots — `docs/screenshots`, prefix `batch2-`

| File | Shows |
| --- | --- |
| `batch2-teacher-results-1920-ar-light.png` / `-dark.png` | Teacher test detail, results section, AR, 1920, light / dark |
| `batch2-teacher-results-390-ar-light.png` / `-dark.png` | Same, AR, 390, light / dark |
| `batch2-teacher-results-1920-en-light.png` | Same, EN (LTR), 1920, light |
| `batch2-student-results-1920-ar-light.png` / `-dark.png` | Student review with score, AR, 1920, light / dark |
| `batch2-student-results-390-ar-light.png` / `-dark.png` | Same, AR, 390, light / dark |
| `batch2-student-results-1920-en-light.png` | Same, EN (LTR), 1920, light |

The teacher captures show both score states in one panel: Sara in progress with no score, Omar submitted at 67 %.

---

## 7. Deliberately NOT changed

- No marking, scoring, grading or correctness logic; no score is computed, inferred or defaulted to zero.
- No retake feature, and no change to the existing retake section.
- No new dependency; `package.json` and the lockfile are untouched.
- No route rename, no nav change, no colour or font token change.
- No BFF/auth work; the mock session stays build-config only.
- `.agents/` and `skills-lock.json` remain untracked.
- No merge, no PR, no push to `main`.