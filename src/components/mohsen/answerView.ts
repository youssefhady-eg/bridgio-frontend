import type { GroundingRef, MohsenAnswer } from '~/api/types'
import { ar } from '~/content/strings'

/**
 * Stage 5 — the single place the UI decides what a Mohsen answer looks like.
 *
 * The contract says an `answered` result always carries at least one grounding
 * ref, and the adapter enforces that. The UI must not trust it blindly, though:
 * if a result ever arrives `answered` with no usable grounding (a missing label
 * or a missing excerpt), it is downgraded to the honest refusal rather than
 * shown as an ungrounded answer. That keeps the rule "every answer shown is
 * grounded, and Mohsen never guesses" true regardless of which adapter runs.
 */

/** A grounding ref only counts when it names a source and quotes evidence. */
export function isUsableGrounding(ref: GroundingRef): boolean {
  return ref.label.trim().length > 0 && (ref.excerpt ?? '').trim().length > 0
}

/** Keep only the refs that can be shown as real evidence. */
export function usableGrounding(
  grounding: readonly GroundingRef[],
): GroundingRef[] {
  return grounding.filter(isUsableGrounding)
}

/**
 * Normalise an adapter answer for display. An `answered` result with no usable
 * grounding becomes a `not_grounded` refusal using the supplied (centralised)
 * fallback copy; everything else passes through unchanged.
 */
export function answerView(
  answer: MohsenAnswer,
  fallback: string = ar.player.mohsen.notGroundedFallback,
): MohsenAnswer {
  if (answer.status !== 'answered') return answer

  const grounding = usableGrounding(answer.grounding)
  if (grounding.length === 0) {
    return {
      status: 'not_grounded',
      answer: fallback,
      grounding: [],
    }
  }

  return { status: 'answered', answer: answer.answer, grounding }
}
