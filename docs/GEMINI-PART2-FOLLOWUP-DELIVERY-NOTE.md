# BRIDGIO — Part 2 follow-up patch (live-gate fixes) — delivery note

- **Branch:** `gemini/ui-refresh`
- **Base:** `7bd75b8` (*Part 2 delivery — tokens + shared components + six teacher views*)
- **Scope:** the ten §2 items of the follow-up brief (wordmark swap, Inter, bank
  new-question modal, materials upload modal, dashboard at-risk filter, single
  class-average source, density, preview relabel, logo wiring, student-drawer
  subtitle clip).
- **Gates (§0):** the `docs/` assets required before any edit
  (`gemini-demo.html`, `wordmark-{cream,maroon}-centered.svg`, `favicon.svg`,
  `apple-touch-icon.png`, `og-image.png`) are present. `apple-touch-icon.png`
  was absent at session start; it was supplied in-session (rendered 180×180 from
  `docs/favicon.svg`) before editing, and is flagged below as **derived, not
  owner-supplied**.
- **Untouched by design:** `ClassDetail.tsx`, `TestDetail.tsx`,
  `StudentDetail.tsx`, `TestBuilder.tsx`, student views, Phase 4. No contract
  method added, no dependency added, no existing test edited.

## Gates (re-run on the working tree after every change below)

| Gate | Command | Result |
| --- | --- | --- |
| Tests | `npm test` | **181 / 181 passed** (19 files) — baseline intact, no test edited |
| Typecheck | `npm run typecheck` | **exit 0**, no diagnostics |
| Build | `npm run build` | **exit 0**, built successfully |

All live numbers below were measured on the dev server (`http://localhost:3000`)
in headless Edge via CDP (`getBoundingClientRect` / `getComputedStyle`), viewport
**1440 × 1000**, device scale factor **2**. Class / student / unit data is the
mock seed, so every figure is reproducible.

---

## §2.1 — Wordmark swap

- Replaced the two text spans (`.app-sidebar__mark` "B" + `.app-sidebar__text`
  "BRIDGIO") in the `.app-sidebar__wordmark` Link with a theme-aware `<img>` pair
  — cream in dark theme, maroon in light theme — reusing the existing
  `--cream`/`--maroon` visibility pattern. `alt = strings.header.wordmarkAlt`;
  the Link (home) and the toggle button are untouched.
- **Sizing (measured):** rendered **136 px wide × 49 px tall** (aspect preserved
  from the 720×260 viewBox; never stretched, recoloured or mirrored).
- The whole wordmark hides when the rail is collapsed (existing rules kept);
  the collapsed brand row is 58 px and contains only the expand chevron.

| State | Wordmark | Brand row |
| --- | --- | --- |
| AR light / AR dark / EN light / EN dark, expanded | visible, **136 × 49 px** | 235 × 52 px |
| collapsed | **absent** | 58 px, chevron only |

Screenshots: `gemini-part2-followup-wordmark-{ar-light,ar-dark,en-light,en-dark}.png`
and `gemini-part2-followup-wordmark-ar-dark-collapsed.png`.

## §2.2 — Font: bundle Inter

- Committed **three static Inter instances** — `Inter-Regular.ttf` (400),
  `Inter-SemiBold.ttf` (600), `Inter-Bold.ttf` (700) — plus
  `Inter-OFL-LICENSE.txt` to `public/fonts/`. Inter 4.1, OFL. No CDN.
- `src/styles/fonts.css`: three `@font-face { font-family: 'Inter'; src: url('/fonts/Inter-*.ttf') }`
  rules, the **same Latin `unicode-range`** the other Latin faces use,
  `font-display: swap`. Removed `local('Inter')` from `Bridgio Body` / `Bridgio
  Label` (the files are now the delivery mechanism, not `local()`).
- Stacks: `--font-en-sans: 'Inter', 'Bridgio Body', ...` (unchanged order) and
  `--font-ar-sans: 'Thmanyah Sans', 'Inter', 'Bridgio Body', ...` — Inter is
  before `Bridgio Body` in **both** stacks, so Latin resolves to Inter on Arabic
  pages too. `tokens.css` comment updated (no longer "via local()").

Live proof (computed style + canvas metrics on a Latin string `BRIDGIO 12345`):

| Language | Computed `font-family` | Stack width | Inter width | Nunito width | Resolves to |
| --- | --- | --- | --- | --- | --- |
| AR | `"Thmanyah Sans", Inter, "Bridgio Body", system-ui, sans-serif` | 101.11 px | 101.11 px | 102.93 px | **Inter** |
| EN | `Inter, "Bridgio Body", system-ui, -apple-system, sans-serif` | 101.11 px | 101.11 px | 102.93 px | **Inter** |

`document.fonts` reports Inter 400 / 600 / 700 **loaded**; the stack width equals
the Inter width exactly (and differs from Nunito) in **both** languages, so
neither falls back to Nunito.

## §2.3 — Question-bank new-question modal

- Added a **"+ سؤال جديد"** head button to `QuestionBank.tsx` opening a centred
  modal (`.tv-modal`, **max-width 560 px**, measured **560 × 634 px**, radius
  8 px). Fields are exactly `CreateQuestionInput`: `prompt` (required), `options`
  (2–6, in display order, empty allowed for an essay), `correctOptionIndex`
  (radio, or "no correct answer" = null), `type` (mcq/essay), `difficulty`,
  `points`, `modelAnswer`, `unitId`. The unit select offers the **target draft's
  own class units**, not a flat list. Target is the newest draft, the same rule
  add-to-draft already uses; when no draft exists the button is disabled with the
  reason beside it (`title={copy.noDraftHint}`), never a dead control.
- Submit calls `api.questions.create({ teacherId, testId: draft.test.id, ... })`
  and invalidates `questions.forTeacher` / `tests.questions` / `tests.detail`.
  Live end-to-end create: **rows 9 → 10**, modal closed, new prompt present,
  in-draft buttons **1 → 2** (the new row shows the same `في المسودة` / disabled
  de-duplication). No fake success.
- **Seed duplicate fix:** `q_integration_1` (draft) and `q_integ_1` (published)
  shared the prompt `"ما العلاقة بين التكامل والاشتقاق؟"`. Only
  `q_integration_1` was changed (same shape) to
  `"ما ناتج تكامل الدالة الثابتة k بالنسبة إلى x؟"` with options
  `['kx + C', 'k + C', 'k/x + C']`, `correctIndex: 0`, same grounding. Both
  questions survive; the bank now shows the old prompt **once**.

Screenshots: `gemini-part2-followup-bank-modal-{ar,en}.png`.

## §2.4 — Materials upload modal

- Replaced the inline "أضف مادة" panel form on the materials page with the demo's
  upload modal opened from a **"+ رفع مادة"** primary head button. `.tv-modal`,
  **max-width 460 px**, measured **460 × 573 px**, radius 8 px. The table is
  unchanged (Title / Class / Type / Word count / Date / Action).
- Creates via `materials.create` (`CreateMaterialInput`), which is
  **metadata-only by contract** (`contract.ts:214` "binary upload is an
  integration gap"). Text and link materials are accepted; the note states
  plainly that PDF/image file upload is not available yet. No upload or success is
  faked — the row appears only after the adapter confirms
  (live create: **rows 2 → 3**, status `حُفظت بيانات «مادة تحقق تلقائي»`).
- **Copy bug fixed:** the note no longer runs into the next sentence —
  `"File upload is not available yet You can add a text material or a link..."` /
  `"رفع الملفات غير متاح بعد يمكنك إضافة مادة نصية أو رابط..."` (space kept in both
  languages; no wording rewritten).

Screenshots: `gemini-part2-followup-materials-modal-{ar,en}.png`.

## §2.5 — Dashboard at-risk panel filter

- `rows` are now filtered to **`progressPercent < 55`** first, then sorted
  ascending, then capped at 5. Filtering supplied percents is presentation — no
  score is computed. The KPI `atRiskCount` already used the same `<55` threshold
  in the mock, so the mock was left unchanged (it agrees).

| View | KPI (`atRiskCount`) | Panel rows |
| --- | --- | --- |
| AR, unfiltered | 2 | **2** (was 3) |
| AR, filtered → class ب | 1 | **1** |
| EN, unfiltered | 2 | **2** (was 3) |
| EN, filtered → class ب | 1 | **1** |

Before the fix the unfiltered panel listed 3 rows (it included Sara Mohammed at
67 %, who is above the 55 % line) while the KPI said 2. It now says 2 / 2, and
KPI = panel in every AR/EN × filtered/unfiltered combination.

## §2.6 — Class average: one source

- **The brief's claimed defect did not reproduce.** The Classes view (AR and EN)
  renders **exactly one average per class card** — the `PanelHead` badge sourced
  from `ClassroomSummary.averageMasteryPercent` (the field `ClassList.tsx` already
  used). Measured percent count per card = **1**:

| Class | Badge (AR) | Badge (EN) | Percents on card |
| --- | --- | --- | --- |
| الصف الثالث الثانوي — أ | `متوسط ٤٠٪` | `Average 40%` | 1 |
| الصف الثالث الثانوي — ب | `متوسط ٢٥٪` | `Average 25%` | 1 |

- **Actionable fix applied anyway:** the dashboard's *filtered* mastery KPI was
  reading a **second contract source** — `data.averageMasteryByClass[].averageMasteryPercent`
  — instead of `selectedClass.averageMasteryPercent`. It now reads
  `selectedClass.averageMasteryPercent`, the same field the Classes cards read, so
  every display of a class average reads the single source. In the mock both
  fields derive from `classAverageMastery()`, so the numbers did not change
  (class ب = **25 %** before and after; no numeric before/after difference
  exists). `averageMasteryByClass` is now read by **no view** (kept in
  `types/teaching.ts` + mock — removing it would be a contract change, which the
  brief forbids).

## §2.7 — Density

Measured live (CSS px). "Before" for the CSS-driven rows is a faithful runtime
revert of the pre-change rules (two-line primary cells, no forced single line).

| Target | Brief-stated before | **Measured before @ `7bd75b8`** | **Measured after** |
| --- | --- | --- | --- |
| Tests-list rows | ~34 px | **42 px** (already spec) | 42 px |
| Dashboard rows | ~48 px | **[74, 74, 53, 42, 42]** (at-risk / drafts / submissions) | **42 px** |
| Bank rows | ~56 px | **54 px** (9 rows, two-line cells) | **42 px** |
| Panel corner radius | ~11 px | **8 px** (already spec, `--radius-lg`) | 8 px |
| Small row button | 22–32 px | **28 px** (already spec) | 28 px |

- Change: `.tv-table td` now forces `white-space: nowrap; overflow: hidden`, and
  `.tv-td-primary` lays the title + sub-line + model-answer disclosure on **one
  line** (`display: inline`, ellipsis on overflow; `details[open]` reverts to a
  block so an expanded model answer still wraps). At ≤768 px the stacked
  `data-label` card mode restores normal wrapping.
- **The brief's "before" numbers for tests / panel radius / small buttons do not
  reproduce** — those three were already at spec at `7bd75b8`. The real
  deviations were the Dashboard (up to 74 px) and Bank (54 px) two-line rows, both
  now 42 px. Materials rows are also 42 px. The demo file itself renders 52 px
  two-line rows despite `--row-h: 42px`; this item deliberately deviates from the
  demo to hit the single-line 42 px spec.
- The demo's type scale and the 14 px body copy are unchanged.

## §2.8 — Preview button relabel

- `strings.ts` `preview`: AR `'معاينة'` → **`'التفاصيل'`**, EN `'Preview'` →
  **`'Details'`**. Key used only at `TestsList.tsx:170`; destination
  (`TestDetail`) and icon unchanged. Screenshot shows published rows now reading
  **Details**.

Screenshots: `gemini-part2-followup-preview-button-{ar,en}.png`.

## §2.9 — Logo wiring

- Copied `docs/favicon.svg` → `public/favicon.svg` (replacing the interim Sora "B"
  placeholder), `docs/apple-touch-icon.png` → `public/`, `docs/og-image.png` →
  `public/`. Byte-identical to the `docs/` sources (SHA-256 compared).
- `src/routes/__root.tsx`: added `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`,
  `<meta property="og:image" content="/og-image.png">`,
  `<meta property="og:title" content="BRIDGIO">`,
  `<meta property="og:description" content="From classroom to career.">`,
  `<meta name="twitter:card" content="summary_large_image">`. `/favicon.svg` link
  unchanged.

Screenshot: `gemini-part2-followup-favicon-16.png` — the favicon rendered at its
tab size (16 px) against 32 px and the 180 px apple-touch icon. *Method note:* the
headless harness has no browser tab strip, so the 16 px tab rendering is shown in
a page overlay rather than a real tab; the source files are byte-identical to the
`docs/` masters.

## §2.10 — Student drawer subtitle clip

- Added `.tv-drawer-heading { min-width: 0 }` and
  `.tv-drawer-heading .tv-cell-sub { overflow-wrap: anywhere }`, plus the
  corresponding wrapper class in `ui.tsx`. Minimal, no drawer restyle.
- Measured (AR and EN): subtitle `scrollWidth == clientWidth`
  (253/253 AR, 305/305 EN), `overflow-wrap: anywhere`, **clipped = false** in both
  languages.

---

## Conflicts with `docs/BRIDGIO-LIVE_RULES.md` (reported, not silently resolved)

`BRIDGIO-LIVE_RULES.md` governs on conflict; the brief conflicts are recorded
here. Note line 11 of the rules: a **PROPOSED** value is not a brand value until
the owner locks it explicitly, and the brief is the owner's 2026-11-24/25
amendment.

1. **§2.2 (bundle Inter) vs §1 "Fonts — LOCKED"** (rules line 42–50: Latin display
   = Sora, Latin body = Nunito; Inter is not listed). The brief frames Inter as an
   owner amendment and Inter is OFL. **Implemented per the brief; conflict
   reported.**
2. **§2.7 (42 px rows, 28 px small buttons, 8 px panel radius) vs §1 "PROPOSED FOR
   UI"** (rules line 58–59: card radius **24 px**, input radius **12 px**, modal
   radius **24 px**; **touch target minimum 44 px** for buttons, inputs and list
   rows). The brief's 42 px rows and 28 px small buttons sit **below** the 44 px
   PROPOSED touch target, and 8 px is below the 24 px PROPOSED card radius.
   Implemented per the brief (demo-match, owner-locked) because PROPOSED ≠ locked;
   conflict reported. The rules' own demo-match direction (rules line 369:
   "tables 42px rows at 14px", "buttons 34/28px", "panel 8px radius") agrees with
   the brief.

## Uncommitted file deliberately excluded

`docs/BRIDGIO-LIVE_RULES.md` carries a pre-existing working-copy change (a
verification log, +59/−1) that is **not** part of this patch; it is left
uncommitted. `.agents/`, `docs/BRIDGIO-gemini-apply-prompt.md` and
`skills-lock.json` are pre-existing untracked files and are not committed.

## Screenshots — `docs/screenshots/`

| File | Shows |
| --- | --- |
| `gemini-part2-followup-wordmark-{ar-light,ar-dark,en-light,en-dark}.png` | brand row, wordmark 136 × 49 px, four expanded states |
| `gemini-part2-followup-wordmark-ar-dark-collapsed.png` | collapsed rail — wordmark absent |
| `gemini-part2-followup-bank-modal-{ar,en}.png` | bank "+ سؤال جديد" modal open (560 px) |
| `gemini-part2-followup-materials-modal-{ar,en}.png` | materials "+ رفع مادة" modal open (460 px) |
| `gemini-part2-followup-preview-button-{ar,en}.png` | relabelled **التفاصيل / Details** button |
| `gemini-part2-followup-favicon-16.png` | favicon at 16 px (tab size), with 32 px and 180 px |
