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

## Copying note

The four rules/spec markdown files above were copied into this repo so a fresh
OpenCode session can resume from files instead of chat history. Brand binaries
and fonts (lockups, wordmarks, reactions sheet, font files, PowerPoint decks)
remain in the owner's isolated folder and are **not** repo files. Do not copy the
brand pack here; only the runtime assets a stage actually needs belong in the
repo.

## Status

Stage 0 is built and self-verified, not yet verified by Muse, not merged to
`main`, and not final or externally ready. Every Mentingo endpoint remains
PROPOSED.
