# Docs index — BRIDGIO frontend

These documents are the live execution line for the build. Read them in this
order before starting any stage:

1. [BRIDGIO-LIVE_RULES.md](BRIDGIO-LIVE_RULES.md) — owner rulings that override
   the other docs where they record a post-handoff decision.
2. [BRIDGIO-UI-UX-token-sheet.md](BRIDGIO-UI-UX-token-sheet.md) — source of
   truth for UI tokens. LOCKED / PROPOSED FOR UI / TBD are not interchangeable.
3. [BRIDGIO-AI-build-handoff.md](BRIDGIO-AI-build-handoff.md) — build scope and
   integration requirements.
4. [BRIDGIO-OpenCode-stages.md](BRIDGIO-OpenCode-stages.md) — stage order and
   gates. Do one stage, stop, verify.

Stage 0 artefacts:

- [API-ADAPTER-CONTRACT.md](API-ADAPTER-CONTRACT.md) — full PROPOSED contract,
  entity mapping, endpoint tables, invariants and integration checklist.
- [STAGE-0-DELIVERY-NOTE.md](STAGE-0-DELIVERY-NOTE.md) — what changed, what was
  not built, deviations, mocked endpoints, verification evidence, open questions.
- `screenshots/stage0-desktop.png` (1440 × 1000)
- `screenshots/stage0-phone.png` (390 × 844)

Stage 1 artefacts:

- [STAGE-1-DELIVERY-NOTE.md](STAGE-1-DELIVERY-NOTE.md) — tokens, fonts, RTL
  shell, header/nav, deviations (wordmark adoption, missing font weights),
  open questions and the Stage 1 gate self-check.
- `screenshots/stage1-desktop-teacher.png` (1440 × 1000)
- `screenshots/stage1-desktop-student.png` (1440 × 1000)
- `screenshots/stage1-desktop-teacher-tests-placeholder.png` (1440 × 1000)
- `screenshots/stage1-tablet-teacher.png` (900 × 1000)
- `screenshots/stage1-phone-teacher.png` (390 × 844)
- `screenshots/stage1-phone-student.png` (390 × 844)

Stage 1 docs-fix artefacts:

- [STAGE-1-DOCS-FIX-DELIVERY-NOTE.md](STAGE-1-DOCS-FIX-DELIVERY-NOTE.md) —
  docs-only sync of the four live files, MD5 evidence, owner-lock check and the
  re-run gate commands.

Stage 2 artefacts:

- [STAGE-2-DELIVERY-NOTE.md](STAGE-2-DELIVERY-NOTE.md) — teacher dashboard
  scope, data path through `src/api/`, token-sheet compliance, states,
  deviations, verification evidence, gate self-check and open questions.
- `screenshots/stage2-desktop.png` (1440 × 1000)
- `screenshots/stage2-desktop-full.png` (1440 × 1818)
- `screenshots/stage2-tablet.png` (900 × 1000)
- `screenshots/stage2-phone.png` (390 × 844)
- `screenshots/stage2-empty-desktop.png` (1440 × 1000, empty scenario)
- `screenshots/stage2-empty-phone.png` (390 × 844, empty scenario)

## Copying note

The four rules/spec markdown files above were copied into this repo so a fresh
OpenCode session can resume from files instead of chat history.

Brand binaries stay in the owner's isolated folder, with one exception:
LIVE_RULES §7 allows the **runtime assets a stage actually needs** to live in the
repo. Stage 1 therefore adds `public/fonts/` (Sora, Nunito, Alexandria, Baloo
Bhaijaan 2) and `public/brand/` (logo-colour, logo-bw, wordmark-cream,
wordmark-maroon). The PowerPoint decks, the reactions sheet and any superseded or
DO_NOT_USE file remain **out** of the repo.

## Status

Stage 0, Stage 1 code and the Stage 1 docs fix are verified PASS by Muse and are
on `main` (`bc1a812`). The docs-only fix is merged and all five owner locks are
locked as built.

Stage 2 (teacher dashboard) is built on branch `opencode-stage2` and **not
merged**. It adds `/teacher/dashboard` only; other screens stay placeholders and
Stage 3 has not started. Every Mentingo endpoint remains PROPOSED, and Mentingo
auth transport is still unconfirmed.

Stage 6 (consistency polish) is delivered on branch `opencode-stage6` and is
**not merged and not verified** by Muse. It changes shared styling and string
plumbing only: no new screen, route, feature, contract field or adapter method.
Stage 7 has not started.
