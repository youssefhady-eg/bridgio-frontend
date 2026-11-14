# BRIDGIO — Batch 4 Delivery Note

**Date:** 2026-11-14
**Branch:** `feat/pre-cohort-fixes`
**Base:** `d9d24a3` (`origin/main`, after Batch 3 / PR #31)
**Scope:** fix the 13 independent UI/UX review items before the first teacher cohort, plus the 4 polish items (14–17) the owner folded into this batch by decision 2026-11-14. No new features, no new dependency, no contract change, no Thmanyah change, no new screen. Branch pushed only — no PR, no merge.

The batch starts with a docs-only commit (`f55e958`) that copies Muse's current `BRIDGIO-LIVE_RULES.md` into `docs/` before any code changed.

---

## 1. What changed

| # | Item | Change | Commit |
| --- | --- | --- | --- |
| 1 | Dashboard label | Sidebar nav `لوحة التحكم` → `لوحة المعلم` and the assistant capability label likewise; EN `Dashboard` → `Teacher dashboard`. The H1, tab title and Guide wording already said `لوحة المعلم` and were left alone. | `40bf87c` |
| 2 | F1 stepper contrast | Future (disabled) steps now use `--text-secondary` (6.90:1 light / 7.03:1 dark) instead of the 40% disabled ink. Current vs upcoming stays distinguishable by more than colour: the active step keeps its filled maroon pill plus a 700-weight label, and done steps keep the check icon. | `e0cdcfd` |
| 3 | N1 header label | **No change.** The header button opens the human message threads (`messages.listThreads`, thread titles and author roles; Mohsen appears nowhere in it), so `المحادثات` is correct for what it opens. The optional key rename (`assistantLabel` → `messagesLabel`) was not done: it touches the header, chat and chat-surface surfaces for no user-visible gain, and is not required for the gate. | — |
| 4 | N3 introduce Mohsen | Four one-line introductions, centralised: player Q&A lead (Egyptian, student), builder draft-step lead (MSA, teacher), Help article `أنشئ اختبارًا وانشره` body, and Guide teacher step `أنشئ اختبارًا` body. The header messages popup was deliberately **not** touched. | `40bf87c` |
| 5 | N4 profile dead end | Removed the `/sign-in` link/button from the signed-in account card; no real sign-in was built and nothing else was pointed at it. | `5a53a3d` |
| 6 | P2 #7 profile duplicate | Dropped the `بيانات الحساب` card whose heading duplicated its own EmptyNote title; the note body now sits under the session section, which already shows name / role / email. | `5a53a3d` |
| 7 | N5 logo alt | Both wordmark `alt`s now use the existing `brand.wordmarkText` constant (`BRIDGIO`). | `40bf87c` |
| 8 | N6 dashboard dedupe | Extracted `splitDashboardTests`: `attention` = everything not published (drafts first, filter kept as `status !== 'published'`), `activity` = published only, newest first. A test can no longer appear in both lists. Activity lead now says "published". New pure unit test asserts no overlap. | `8c90176` |
| 9 | N8 profile theme button | Profile theme switch reworded as an action: `التبديل إلى المظهر الفاتح/الداكن` / `Switch to light/dark theme`. The header icon-only toggle is untouched. | `40bf87c`, `5a53a3d` |
| 10 | N9 test detail repetition | Removed the duplicate class row (the class already sits next to the status chip) and collapsed the two dates to one: publish date when published, last-edit date while a draft. No third repetition existed as a section heading. Unused `metaClass` string removed. | `43a9eeb` |
| 11 | N10(a) logo links home | The brand is now a `<Link to="/" search={{ as, lang }}>`; `/` already redirects per role, so the preview role and language are preserved. A dark-band `:focus-visible` ring override was added for the phone header, reverted to the normal ring from 768 px up. | `a131961` |
| 12 | E7 results skeleton | The teacher per-test results loading note is now three static token-coloured skeleton rows in the panel's shape (no animation). The loading text stays as a visually-hidden `role="status"`. | `43a9eeb` |
| 13 | Math Unicode stopgap | Every caret expression in the seed became Unicode superscripts: `xⁿ`, `xⁿ⁻¹`, `xⁿ⁺¹` across prompts, options, excerpts and material/unit text (14 seed occurrences). Matching mock fixtures updated. No renderer, no KaTeX. | `ccedf4c` |
| 14 | Progress percent treatment | `.progress-row__labels strong` is body size (`var(--font-body-size)`) with an explicit `font-weight: 700` instead of leaning on `bolder`. Digits and Thmanyah untouched. | `e0cdcfd` |
| 15 | Number input spinner | The builder question-count field is a React Aria `NumberField` (already in the repo) with Lucide `ChevronUp`/`ChevronDown` 44 px buttons, token colours, min 1 / max 10, invalid or empty input falls back to 1, and the native spinner is gone. The input keeps `.input--narrow`. | `412cc53` |
| 16 | Textbox max-width cap | `input.input[type="text"]` and `input.input[type="search"]` are capped at 32 rem; `.input--narrow` (8 rem) and textareas are excluded. | `e0cdcfd` |
| 17 | Select chevron | `select.input` gets `appearance: none`, a Lucide `ChevronDown` pinned to the inline-end side through a shared `SelectField` wrapper, and matching `padding-inline-end`. Options, filter behaviour and labels untouched. | `412cc53`, `e0cdcfd` |

---

## 2. Data layer

No adapter, contract, query key or endpoint changed. `package.json` and the lockfile are untouched; no dependency was added (`react-aria-components` and `lucide-react@1.72.0` were already pinned).

The one seed-content change (item 13) is display text inside the existing mock seed, not a contract shape. The Mohsen retriever tokenises through `normalizeText`, so the grounding tests still resolve the same source and the seed question fixtures were updated to match.

---

## 3. Verification gates

| Gate | Result |
| --- | --- |
| `npm test` | **143 passed (143)**, 17 files |
| `npm run typecheck` | **pass** (`tsc --noEmit`, no output) |
| `npm run build` | **pass**, exit 0 (vite client + Nitro SSR, then `tsc --noEmit`) |

Test count: Batch 3 was 142. The new `splitDashboardTests` no-overlap test adds 1, landing on 143.

Runtime checks from the capture run (dev server, `localhost:5199`):

- Zero console errors and zero page errors across 8 routes × 1920 px and 390 px.
- Zero horizontal overflow on every route at both widths.
- Progress percent computed at **17 px / 700** on desktop — `var(--font-body-size)` is 17 px from 1024 px up by the token sheet, and 16 px on phone.
- Test detail meta list = 3 rows, 0 repeated class rows; profile = 0 sign-in links, 0 duplicate account headings.
- Brand link computed `href="/?as=teacher&lang=ar"` (and `…lang=en`), matching `:focus-visible` with a visible 2 px ring, cream on the phone dark band and maroon on the light header.
- NumberField input computed `type="text"` (no native spinner), buttons 44 × 44 px, narrow input 8 rem (136 px), focus input capped at 32 rem (544 px at the desktop root size).
- `select.input` computed `appearance: none`, `padding-inline-end: 37.5px`, chevron 16 px at the inline-end.
- Results skeleton = 3 rows, accessible status text `جارٍ تحميل النتائج...` / `Loading the results...`.

---

## 4. Live behaviour highlights

- The dashboard shows a draft in **one** list only: `مراجعة التكامل` under "tests needing attention", `اختبار التكامل` and `اختبار قواعد الاشتقاق` under "recent activity".
- The seed maths renders as superscripts in the question bank, player and test detail: `xⁿ`, `xⁿ⁻¹`, `xⁿ⁺¹`.
- The builder draft step shows the design-system stepper instead of Chrome's spinner; the focus input no longer spans the whole panel.
- Profile is one session block plus UI settings, with no dead sign-in card and no repeated heading.
- The Help article and the Guide step name Mohsen as an AI assistant where the teacher meets him.

---

## 5. Deviations and open items

1. **Progress percent size.** The item asked for "16 px, `var(--font-body-size)`". The token **is** `var(--font-body-size)`, which the token sheet sets to 17 px from 1024 px up and 16 px on phone. Using the token (as instructed) means 17 px on desktop rather than a hard-coded 16 px.
2. **Item 3 key rename skipped.** `assistantLabel` / `assistantOpenLabel` still carry the "assistant" name while the button is messages. The label text is unchanged and correct; the rename was explicitly optional and would touch three surfaces for no visible gain.
3. **Select fix uses a wrapper component.** `appearance: none` cannot carry an inline Lucide icon inside a native `<select>`, so all six `select.input` sites (question bank filter, material-library filter + three create-form selects, builder class select) are wrapped in a shared `SelectField`. The parent child-picker select has no `.input` class and is untouched.
4. **Skeleton is static.** No animation, per the item; the accessible status text is the only loading signal for assistive tech. The skeleton shots were taken with the mock latency temporarily raised to 1500 ms to hold the pending state, then reverted (the file is unchanged in the commit).
5. **One date, one class.** The published date is shown when published and the last-edit date while a draft, so a draft never shows a null "published at". The class remains visible once, in the hero next to the status chip.
6. **No KaTeX.** Superscripts are the whole stopgap; the deferred math renderer decision is untouched.
7. **Screenshots were taken on `localhost:5199`** against the dev build (Playwright, Chromium), 1920 × 1080 and 390 × 844, AR and EN, light and dark.

---

## 6. Screenshots — `docs/screenshots`, prefix `batch4-`

| File group | Shows |
| --- | --- |
| `batch4-dashboard-{1920,390}-{ar,en}[-dark].png` | Dashboard: `لوحة المعلم` label, attention draft vs published activity (no duplicate), progress percent treatment, dark variant |
| `batch4-profile-{1920,390}-{ar,en}[-dark].png` | Profile: one session section with the folded note, no sign-in link, action-worded theme button |
| `batch4-test-detail-{1920,390}-{ar,en}[-dark].png` | Test detail: single class mention, one date row, results list |
| `batch4-test-detail-skeleton-{1920,390}-{ar,en}.png` | Results panel pending state: three static skeleton rows + accessible status |
| `batch4-header-focus-{1920,390}-{ar,en}[-dark].png` | Brand link focused: visible ring, cream on the phone dark band |
| `batch4-builder-stepper-{1920,390}-{ar,en}[-dark].png` | Builder step 1: readable future steps, filled active pill, 700-weight active label |
| `batch4-builder-draft-{1920,390}-{ar,en}[-dark].png` | Builder step 2: NumberField stepper and the capped focus input |
| `batch4-help-{1920,390}-{ar,en}[-dark].png` | Help: the `أنشئ اختبارًا وانشره` article naming Mohsen as an AI assistant |
| `batch4-guide-{1920,390}-{ar,en}[-dark].png` | Guide: the teacher `أنشئ اختبارًا` step naming Mohsen as an AI assistant |
| `batch4-question-bank-{1920,390}-{ar,en}[-dark].png` | Question bank: filter select with the design-system chevron, superscript maths |
| `batch4-materials-{1920,390}-{ar,en}[-dark].png` | Material library: three selects with the design-system chevron |

54 files.

---

## 7. Deliberately NOT changed

- No Thmanyah font file, font stack or token change.
- No math renderer and no KaTeX.
- No real sign-in, no BFF, no retake, no support contact (no e-mail/WhatsApp).
- No contract, adapter method, endpoint or query-key change; no new dependency.
- No new screen; the student/parent home page (N10(b)) is a separate scope decision and is not in this batch.
- No change to the header messages popup, its label, or the human-thread surface.
- `.agents/` and `skills-lock.json` remain untracked and uncommitted.
- No merge, no PR, no push to `main`.
