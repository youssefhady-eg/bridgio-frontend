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

Stage 0 and Stage 1 are built and self-verified. Neither is verified by Muse yet;
Stage 1 is on branch `opencode-stage1` and is not merged to `main` or final.
Every Mentingo endpoint remains PROPOSED.
