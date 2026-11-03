import { formatCount } from '~/components/dashboard/format'
import { ar } from '~/content/strings'
import {
  BUILDER_STEPS,
  type BuilderStep,
  canEnterStep,
} from './builder'

/**
 * Four-step indicator. Steps after the draft are disabled until the adapter has
 * a persisted draft, so the UI cannot skip the required create-draft call.
 * After publishing, the builder stays on step 4 (published tests are read-only).
 */
export function StepIndicator({
  current,
  hasDraft,
  published,
  onSelect,
}: {
  current: BuilderStep
  hasDraft: boolean
  published: boolean
  onSelect: (step: BuilderStep) => void
}) {
  return (
    <ol className="builder-steps" aria-label={ar.builder.stepsLabel}>
      {BUILDER_STEPS.map((step) => {
        const state =
          step === current ? 'is-active' : step < current ? 'is-done' : ''
        const available = canEnterStep(step, { hasDraft, published })
        return (
          <li className={`builder-step ${state}`.trim()} key={step}>
            <button
              type="button"
              className="builder-step__button"
              aria-current={step === current ? 'step' : undefined}
              disabled={!available || step === current}
              onClick={() => onSelect(step)}
            >
              <span className="builder-step__num" aria-hidden="true">
                {formatCount(step)}
              </span>
              <span className="builder-step__label">
                {ar.builder.steps[step]}
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
