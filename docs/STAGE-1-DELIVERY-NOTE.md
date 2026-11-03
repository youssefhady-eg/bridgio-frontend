# BRIDGIO — Stage 1 Delivery Note

**Stage:** 1 — Shell, tokens, RTL, header
**Branch:** `opencode-stage1` (branched from `main` at `8ebafda`)
**Date:** 2026-11-02
**Status:** Built and self-verified. **NOT verified by Muse. NOT merged to `main`.
NOT final, locked, or externally ready.**
**Model:** DeepSeek V4.1 Flash — provider `nvidia`, exact listed model id
`deepseek-ai/deepseek-v4.1-flash`. Stage 0 recorded provider `opencode` /
`deepseek-v4.1-flash-free`; the listed id differs per session and is recorded
here per the rules.

---

## 0. Branch setup and the `main` deviation (read this first)

The stage prompt said: *"after Stage 0 is merged to main: checkout main, pull,
then create branch opencode-stage1."* At session start **no `main` branch
existed** — locally or on `origin` — and the newest `BRIDGIO-LIVE_RULES.md`
still said *"Stage 0 delivered, not verified, not merged… no PASS, no merge, no
Stage 1 until the gate passes."* LIVE_RULES §8 says to stop and ask the owner
when state and rules disagree, so the owner was asked.

Owner decisions in this session:

1. **Stage 0 gate passed** (owner-confirmed).
2. **The builder was authorised to create `main` from `opencode-stage0`** to
   unblock the branch.

What was done, exactly:

```
git checkout -b main opencode-stage0   # main == 8ebafda (Stage 0 tip)
git push origin main                    # main now exists on origin
git checkout main && git pull
git checkout -b opencode-stage1
```

**Deviation to record:** LIVE_RULES says *"The owner merges, as in Analytica."*
Here the **builder** created and pushed `main` (fast-forward, identical tree to
the Stage 0 commit `8ebafda`). This was explicitly authorised in-session but is
a deviation from the written process and needs the owner's confirmation at the
gate.

## 0b. Docs sync (first commit on the branch)

The stale `docs/` copies were replaced from the current handoff set
(`LMS to Hire\BuildDocs`), per the owner's instruction to build from the
attached files, not the repo copies:

| File | Result |
| --- | --- |
| `BRIDGIO-LIVE_RULES.md` | **Replaced — was stale.** New copy adds the npm package-manager lock and the Stage 0 delivered-status line. |
| `BRIDGIO-OpenCode-stages.md` | Byte-identical to the current copy (re-written unchanged). |
| `BRIDGIO-AI-build-handoff.md` | Byte-identical (re-written unchanged). |
| `BRIDGIO-UI-UX-token-sheet.md` | Byte-identical (re-written unchanged). |

MD5-verified against the source copies after the copy.

---

## 1. What changed

### Design tokens (`src/styles/tokens.css`)

- All **LOCKED** colours as CSS variables, exactly as the sheet: red `#D51C1D`,
  accent red `#F41920`, cream `#F9ECD9`, paper `#FFF6E8`, maroon `#2C0706`,
  logo outline `#471E1B`, success `#1F7A57`, info `#2A62B0`, warning fill
  `#F2A93B`, error wine `#7E1A2B`, artwork cream `#F9EEDC`.
- **PROPOSED FOR UI** neutrals as opacity over locked colours (secondary 70 %,
  muted 55 %, border 12 %, card outline 18 %, hover 4 %, disabled 8 %/40 %),
  plus a derived dark-band mirror set for the maroon header (flagged below).
- **PROPOSED FOR UI** app type scale, spacing scale (4 px base:
  4/8/12/16/24/32/48/64), radii (card 24, input 12, pill 999), 44 px touch
  target, 2 px focus ring, no shadows (sticker style). Each block carries a
  `LOCKED` / `PROPOSED FOR UI` comment.

### Fonts (`src/styles/fonts.css`, `public/fonts/`)

- The four locked families, loaded from the font pack into `public/fonts/`.
- Script-correct pairing via `unicode-range`, one family per role:
  - `Bridgio Display` = Sora (Latin) + Alexandria (Arabic) — headings.
  - `Bridgio Body` = Nunito (Latin) + Baloo Bhaijaan 2 (Arabic) — body copy.
  - `Bridgio Label` = Nunito (Latin) + Alexandria (Arabic) — nav/labels/buttons,
    weight 600.
- No Fredoka anywhere (grep-verified: the only mention in `src/` is the comment
  in `fonts.css` stating it is banned).

### Shell, header and nav

- `src/components/AppHeader.tsx` — one DOM, three size states:
  - **≥ 1024 px:** full colour lockup `logo-colour.svg` at **200 px** wide
    (LOCKED minimum), paper header.
  - **768–1023 px:** adopted **`wordmark-maroon.svg`** at **148 px** on the cream
    header (light surface → maroon wordmark).
  - **< 768 px:** dark band `#2C0706` with adopted **`wordmark-cream.svg`** at
    **136 px** (dark surface → cream wordmark). Both wordmark widths are ≥ the
    120 px minimum.
  - The lockup/wordmarks are never mirrored, never stretched (intrinsic aspect
    ratio preserved), never recoloured (fills are baked into the files), and
    never used as a favicon.
- Teacher nav: **لوحة التحكم، صفوفي، الاختبارات، الطلاب** (Dashboard, My Classes,
  Tests, Students — exact order).
- Student nav: **اختباراتي، دروسي، تقدمي** (My Tests, Lessons, Progress — exact
  order).
- Active nav item is marked (maroon pill on light, cream pill on the dark band)
  and sets `aria-current="page"`.
- Preview-role switch (`?as=teacher|student`) — a shell diagnostic to see both
  navs before Mentingo auth exists. Default teacher. UI state only; no identity
  is displayed and no auth flow is invented.
- RTL: `html lang="ar" dir="rtl"` with logical CSS properties throughout
  (inline-start/end, border-block), so nothing is position-hacked.
- Accessible: skip-to-content link, 44 px targets, visible focus ring on every
  interactive element, `aria-label`s on nav and the role group.

### Routes and placeholders

- `/` — shell overview: what the shell contains and what is **not** built.
- `/teacher/dashboard`, `/teacher/classes`, `/teacher/tests`,
  `/teacher/students`, `/student/tests`, `/student/lessons`,
  `/student/progress` — all render one shared **placeholder** component
  (`NotBuiltScreen`), explicitly labelled "شاشة لم تُبنَ بعد" with the stage that
  will build it. **No feature screen exists.**
- Centralised draft strings in `src/content/strings.ts`; nav config and role
  helpers in `src/shell/nav.ts`; `?as` reading in `src/shell/usePreviewRole.ts`.
- Interim internal favicon `public/favicon.svg` (Sora "B" on a red card) per the
  interim small-mark rule — internal build only, not presented as the logo.

### Evidence

- `npm test`: **29 passed** (23 Stage 0 + 6 new shell-nav tests).
- `npm run typecheck`: clean. `npm run build`: clean (client + SSR).
- Screenshots (this branch, device-emulated Edge via CDP, 2× DPR):
  - `docs/screenshots/stage1-desktop-teacher.png` (1440 × 1000)
  - `docs/screenshots/stage1-desktop-student.png` (1440 × 1000)
  - `docs/screenshots/stage1-desktop-teacher-tests-placeholder.png` (1440 × 1000)
  - `docs/screenshots/stage1-tablet-teacher.png` (900 × 1000)
  - `docs/screenshots/stage1-phone-teacher.png` (390 × 844)
  - `docs/screenshots/stage1-phone-student.png` (390 × 844)
- Capture-time assertions (from the screenshot harness, all passing): document
  `dir=rtl`, `lang=ar`; desktop header paper `rgb(255,246,232)` showing
  `logo-colour.svg` at 200 × 89; tablet cream `rgb(249,236,217)` showing
  `wordmark-maroon.svg` at 148 × 53; phone maroon `rgb(44,7,6)` showing
  `wordmark-cream.svg` at 133 × 48; all six font-weight/script checks true
  (Latin **and** Arabic); **zero console errors**.

---

## 2. What was NOT built

- **No feature screens**: no teacher dashboard, no test builder, no question
  editor, no student player, no Mohsen Q&A panel. The nav destinations open
  labelled placeholders only.
- **No data fetching in the shell.** No component calls `fetch`, no adapter
  method is used by the header/nav/placeholders, and no mock data is rendered.
- **No Mohsen imagery.** The reactions sheet is a Stage 5 file; Stage 1 uses
  only the lockup and the two wordmarks.
- **No auth UI / user model / role system.** Auth stays Mentingo-owned; the role
  switch is a diagnostic, not auth.
- **No sticky / collapsing header, no drawer / hamburger menu, no dark theme, no
  empty/error/success states, no progress or chip components** — none are in the
  Stage 1 scope and none were invented.
- **No hosting/deployment** (Stage 7 only) and no live Mentingo connection.

---

## 3. Deviations from the token sheet and rules

No LOCKED value was changed.

| # | Item | Token value | What was used | Why |
| --- | --- | --- | --- | --- |
| 1 | Small-header brand mark | Repo token sheet §4 still lists the small-slot rule as interim ("Bridgio" in Sora or a Mohsen pose) and "Clean wordmark: **TBD**" | The **adopted wordmark** (`wordmark-cream` / `wordmark-maroon`, ≥ 120 px) | LIVE_RULES §2, handoff §5 and the Stage 1 prompt all record the wordmark **adopted 2026-11-01**, which supersedes the older sheet text. Flagged so Muse can reconcile the token sheet §4 wording. |
| 2 | Arabic label weight | §2 type scale: "Label / button 15 px, Nunito SemiBold / **Alexandria SemiBold**" | Arabic labels at weight 600 rendered from **Alexandria Bold** (declared as the 600 face) | The font pack ships **no Alexandria SemiBold**. Closest available weight used rather than inventing a font. |
| 3 | Latin body max weight | §2: Nunito "400–800" | Numeric heaviest **700** | The font pack ships Nunito 400/600/700 only — no ExtraBold (800). |
| 4 | Focus ring on the dark band | §1 PROPOSED: "Focus ring maroon `#2C0706`, 2 px, offset 2 px" | Maroon ring on light surfaces; **cream ring** on the maroon header band | A maroon ring is invisible on maroon. Accessibility variant of a PROPOSED value; flagged for the owner's lock. |
| 5 | Preview-role switch | Not in the token sheet | A small pill group in the header driven by `?as=` | Needed to show both navs before Mentingo auth exists. UI state only; to be removed once auth lands. |
| 6 | Dark-band text/derived neutrals | §1 PROPOSED neutrals are defined for light surfaces only | A small derived mirror set (cream text/secondary/border/hover on maroon) | §3 says "header placement flips in RTL" but the sheet gives no dark-surface neutral rules. Derived by opacity over the locked colours so no new brand hex is invented. Flagged for the owner's lock. |
| 7 | Nav wording vs screen titles | — | Nav "Dashboard" = **لوحة التحكم**; the placeholder screen title is **لوحة المعلم** | Draft Arabic, centralised, not final. Flagged. |
| 8 | Interim favicon | §4 small mark **TBD — DO NOT INVENT** | Sora "B" on a red card, labelled interim/internal, never presented as the logo | Follows the sheet's interim rule; not a designed mark. |

Note on the token sheet vs LIVE_RULES for the wordmark (#1): the sheet is
byte-identical to the copy supplied in this session, so this is a genuine
inconsistency **inside the handoff set**, not a stale-repo artefact. It should be
fixed in the sheet at the next Muse pass.

---

## 4. Integration checklist — future MVP screens

The Stage 1 shell is intentionally data-free, so there is no adapter mapping to
verify yet:

| Surface | Adapter methods | Confirmed Mentingo concept? | Mocked? |
| --- | --- | --- | --- |
| Shell header / nav / placeholders | **none** (no data) | n/a | n/a |
| Preview role (`?as`) | none — UI state only | n/a | n/a |

No component calls `fetch`. The single adapter layer from Stage 0 is untouched.
From Stage 2 onward, every MVP screen must render through `src/api/` only.

---

## 5. Open questions for the owner / Muse

1. **`main` protocol:** confirm the builder-created `main` (fast-forward from
   `opencode-stage0` at `8ebafda`) is acceptable, or re-parent as preferred.
2. **Token sheet §4 vs LIVE_RULES:** should the token sheet's small-header entry
   be updated from "TBD / interim Sora text" to the adopted wordmark?
3. **Missing weights:** supply `Alexandria-SemiBold` and `Nunito-ExtraBold`, or
   lock the substitutions used here (Alexandria Bold as 600; Nunito 700 max)?
4. **Dark-band neutrals + focus ring:** lock or change the derived cream values.
5. **Small-header breakpoints:** is "dark band on phone, maroon wordmark on
   light 768–1023 px, full lockup ≥ 1024 px" the intended mapping of
   "cream on dark / maroon on light"? No sticky/collapse behaviour was invented.
6. **Student `Lessons` and `Progress`** have no stage in the plan; their
   placeholders say so. Assign stages or defer explicitly.
7. **Preview-role switch:** keep it for Stages 2–4, or drop it once a mock
   session can drive the role?
8. **Path drift:** LIVE_RULES/handoff still name
   `…\Projects\LMS to Hire\bridgio-frontend`; the repo actually lives at
   `…\Projects\bridgio-frontend` (unchanged from Stage 0). Confirm the canonical
   path.

---

## 6. Stage 1 gate — self-check

| Gate item (stages doc) | Result |
| --- | --- |
| Tokens match the sheet exactly (locked values) | ✅ all LOCKED hexes verbatim in `tokens.css` |
| Proposed values used as-is and labelled proposed | ✅ neutrals / scale / spacing / radius labelled in-file and listed above |
| Fonts load correctly, no Fredoka anywhere | ✅ four families load, per-script checks true, Fredoka absent |
| RTL correct, header legible at desktop and phone | ✅ screenshots + `dir=rtl` assertions |
| Wordmark never mirrored / stretched / favicon | ✅ no transforms; intrinsic ratios; favicon is the interim Sora card |
| No feature screens, no invented components | ✅ placeholders only |
| Runnable build + Arabic screenshots desktop & phone | ✅ `npm run build` clean; 6 screenshots |
