# BRIDGIO — Part 2 delivery (tokens + shared components + six teacher views)

- **Branch:** `gemini/ui-refresh`
- **Base:** `c45887e` (*feat(gemini): port demo design tokens and app shell*)
- **Look authority:** `docs/gemini-demo.html` (present and current — wine dark
  palette + cream-CTA override, 143,002 bytes).
- **Data authority:** `src/api/contract.ts` via the mock adapter. No contract
  method was added; §6 extended shapes only.
- **Scope:** token corrections, shared `tv-` primitives, and a rebuild of the six
  teacher views (dashboard, classes, tests list, question bank, materials,
  students + student drawer). The builder moved to `/teacher/tests/new`.
- **Untouched by design:** `ClassDetail.tsx`, `TestDetail.tsx`,
  `StudentDetail.tsx`, `TestBuilder.tsx`, the student views and Phase 4.

## Gates (on the branch, after every change below)

| Gate | Command | Result |
| --- | --- | --- |
| Tests | `npm test` | **181 / 181 passed** (19 files) — 171 baseline intact + 10 new for new logic |
| Typecheck | `npm run typecheck` | **exit 0**, no diagnostics |
| Build | `npm run build` | **exit 0**, built successfully |

No existing test was edited, skipped or weakened. The only fixture edits are the
new **required** fields on `Question`/`TestSummary`/`StudentProgressSnapshot`
(`builder.test.ts`, `dashboard/format.test.ts`, `player/player.test.ts`,
`question-bank.test.ts`) — no assertion changed.

## Token corrections — `src/styles/tokens.css`

- **Dark block now carries the demo's wine values verbatim.** The Option 1 drift
  is gone: `--bg-inset #14070a`, `--bg-hover #361821`, `--bg-active #421d28`,
  `--border-subtle #3d1d26`, `--border-strong #572a37`, `--text-secondary
  #cdb9bf`, `--text-muted #997f87`, `--brand-maroon-hover #c93853`,
  `--brand-maroon-soft rgba(179,46,71,.22)`, `--focus-ring #e06b80`,
  `--status-success #42c27d`, `--status-warning #e8a63c`, `--status-danger
  #f06570`, `--status-neutral #997f87`, and the demo shadow alphas.
- **Dark “B” chip fixed:** `--brand-on-primary` is cream `#faf6f1` in dark
  (was `#1a0a0e`), so the chip letter is cream on wine, 5.74:1.
- **Type, scale and radii landed:** `--font-en-sans/display`,
  `--font-ar-sans/display`, `--font-body`, `--font-display`, `--text-xs` …
  `--text-kpi`, `--radius-sm/md/lg/full`, values copied from the demo. RTL
  (Arabic) is the default; `:root[dir='ltr']` switches body/display to the Latin
  stacks, as the demo does.
- **Kept intact:** every `--bridgio-*` alias (the contrast test parses literal
  hex), `--bridgio-info #7d99c0` (no demo twin), light `--text-muted #6f6466`
  (the AA fix from the shell port), `--cta-bg/--cta-text` cream-on-wine dark.
  `tokens.contrast.test.ts` → **15 / 15**.

## Data layer (§6) — shapes only, no new methods

- `types/teaching.ts`: `ClassroomSummary.averageMasteryPercent / atRiskCount /
  unitsDone`, `ClassroomStudent.lastScorePercent`,
  `StudentProgressSnapshot.lastScorePercent`, new `TeacherSubmission`, and the
  dashboard aggregate `averageMasteryPercent / atRiskCount /
  averageMasteryByClass / submittedAttemptsCount / scoredSubmissionsCount /
  recentSubmissions / unitMastery`.
- `types/tests.ts`: `TestSummary.durationMinutes`; `Question.type / difficulty /
  points / modelAnswer / unitId`; optional authoring fields on
  `CreateQuestionInput`.
- `types/attempts.ts`: `scorePercent` moved up to `AttemptSummary`.
- `seed.ts` + `mock-adapter.ts`: every new value is computed by the adapter
  (backend role), never by a view. `questions.create` now accepts the authoring
  metadata and essay questions. `attempts.listForStudent` lets a teacher read an
  enrolled student's attempts (existing method, no new endpoint).

## Shared components

- **`src/styles/teacher-views.css`** — the full `tv-` primitive set ported from
  the demo §3: buttons (primary/secondary/ghost/subtle/danger-ghost, 34/28 px),
  page head/title, panels, KPI, status dot, progress bars, dense tables
  (42 px rows, stacked `data-label` mode at ≤768 px), inputs, drawer/backdrop,
  empty/loading, drawer bar chart, 960/768 px breakpoints. Old tokens/classes
  stay for the screens not rebuilt in this part.
- **`src/components/teacher/ui.tsx`** — `PageHead`, `Panel`, `PanelHead`, `Kpi`,
  `Status`, `MasteryBar`, `EmptyBox`, `LoadingNote`, `Drawer` (Escape + backdrop
  close, focus moves to the close button and returns to the opener).
- **`src/components/teacher/tones.ts`** — `masteryTone` (demo `toneOf`: ≥75
  success / ≥55 warning / <55 danger), a deliberately separate
  `difficultyTone`, `scoreText` (null → unavailable, never 0 %), `scoreBarHeight`
  (demo 0–58 px plot).

## Views

- **Dashboard** — class filter + new-test in the head; 4 KPIs (students, average
  mastery, **التسليمات**, students needing follow-up); at-risk table with mastery
  bars and a follow-up drawer; unit-mastery panel; unpublished drafts (edit +
  inline publish); latest submissions. KPI 3 and the submissions table stay
  unfiltered, as in the demo. No grading action, no “تحليل البنود”.
- **Classes** — table → card grid: average mastery badge, subject + units done,
  students / follow-up counts, links to Students and Tests.
- **Tests list (new)** — `/teacher/tests` is now a table (class, questions,
  duration, status, last edit). Drafts offer **تعديل** + **نشر**; published tests
  offer **معاينة**. No release-mode sub-line. The builder moved to
  `/teacher/tests/new`; `TestDetail` is untouched and its back-link now lands on
  the list.
- **Question bank** — dense table with unit, type, difficulty, points and the
  model-answer disclosure. **Add to draft** copies the question into the newest
  draft; disabled when no draft exists, and marked “في المسودة” when the question
  already belongs to it (no duplicate write).
- **Materials** — dense table with word count (or “—”) and `createdAt`; no
  invented size. Create (text/link) and delete stay real; the PDF/image upload
  gap is stated in the form, not faked.
- **Students + drawer** — name/class filters, table (mastery bar, last score,
  last active), and a drawer with mastery, last score and the last three
  submitted attempts as bars. No previous-notes panel and no note composer.

## Measurements — 1600 × 1000 CSS px

| Target | Value |
| --- | --- |
| Content column (`--content-max`) | 1320 px |
| KPI grid / one KPI | 1320 px / 321 × 89 px |
| Panel width (dashboard column) | 749 px |
| Table header row / single-line body row | 36 px / **42 px** |
| Primary button / small button | 34 px / 28 px |
| Page title | 25.5 px (`--text-xl` token) |
| Student drawer | **460 px** wide, full height, RTL left edge |
| Mobile stacked table | 390 px — rows become labelled cards |

## Screenshots — `docs/screenshots/`

- **12 view shots** at 1600 × 1000: six views × {AR dark, EN light} —
  `gemini-part2-{dashboard,classes,tests,students,question-bank,materials}-{ar-dark,en-light}.png`.
- **1 student drawer**: `gemini-part2-student-drawer-ar-dark.png`.
- **1 mobile** students table at 390 × 844:
  `gemini-part2-students-390-ar-dark.png`.

## Decisions and deviations

- **Font stacks resolve onto bundled faces.** The demo names IBM Plex Sans
  Arabic (CDN). No CDN and no new font files were allowed, so the stacks resolve
  onto the repo's bundled `Bridgio Body`/`Bridgio Display` faces with the
  Thmanyah names first while the asset is pending.
- **`معاينة` points at `TestDetail`.** There is no per-test student-preview
  route; the detail screen's question list is the only real read-only preview.
  Drafts’ `تعديل` uses the same screen, which does host `tests.update` /
  `questions.update` for an existing test.
- **Student note composer omitted.** `messages.sendMessage` only reaches the
  assistant/parent threads (it needs an existing thread), so a teacher→student
  note has no destination. The control was omitted rather than faked, and the
  drawer has no previous-notes panel (per brief).
- **“New bank question” omitted.** The contract has no bank-level create;
  `questions.create` requires a test id. Reported, not faked.
- **At-risk panel lists the five lowest-mastery students**, as the demo does,
  while the KPI counts students below 55 %. This is the demo’s own behaviour, kept
  rather than “corrected” unilaterally.
- **Arabic copy reused from the demo where it exists** (`التسليمات`,
  `طلاب يحتاجون متابعة`, …); new keys were added to `strings.ts` with AR + EN for
  every new label. No existing Arabic copy was rewritten.

## Fixes made while porting (found by inspection / measurement)

1. **Unit-mastery bars were invisible.** `.tv-bar-track` carried `flex: 1`,
   which collapsed to 0 px height inside the panel’s column stack. The flex now
   applies only inside `.tv-bar-wrap`; the stacked bars keep their 6 px height.
2. **Drawer chart bars were too tall.** `scoreBarHeight` scaled to 100 px; the
   demo scales to 58 px so three bars plus labels fit the 110 px body. Matching
   the demo also keeps a 3 px stub at zero.
3. **Add-to-draft could duplicate.** The success note was keyed by test id (it
   showed on every draft row) and the button stayed enabled on questions already
   in the draft. It is now keyed by the created question id and the button reads
   `في المسودة` / disabled for those rows.
4. **Drawer had no focus management.** Focus now moves to the close button on
   open and returns to the opener on close, alongside Escape/backdrop.

## Not built

Phase 4 (grading buttons, item analysis, “تنتظر التصحيح”), the student views,
the palette/notifications drawer/toast/skeletons, the builder and player re-skin,
KaTeX, demo-only controls, client-side score computation, and any new dependency
or font file.