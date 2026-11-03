import type { DraftQuestionsResult, Test } from '~/api/types'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { formatCount } from '~/components/dashboard/format'
import { ar } from '~/content/strings'
import { GroundingList } from './GroundingList'

const strings = ar.builder.draft

/**
 * Step 2 — Mohsen drafts grounded questions into the persisted draft test.
 * The source label and each question's grounding come from the adapter result;
 * a `no_grounding` result is shown as an honest empty state, never as a guess.
 */
export function StepDraftQuestions({
  test,
  result,
  requesting,
  error,
  focus,
  onFocusChange,
  count,
  onCountChange,
  onRequest,
  onNext,
  onBack,
}: {
  test: Test
  result: DraftQuestionsResult | null
  requesting: boolean
  error: boolean
  focus: string
  onFocusChange: (value: string) => void
  count: number
  onCountChange: (value: number) => void
  onRequest: () => void
  onNext: () => void
  onBack: () => void
}) {
  const requestLabel =
    result === null
      ? strings.request
      : result.status === 'no_grounding'
        ? strings.retry
        : strings.requestMore

  return (
    <section className="builder-panel" aria-labelledby="builder-draft-heading">
      <header className="builder-panel__head">
        <h2 id="builder-draft-heading">{strings.heading}</h2>
        <p className="builder-panel__lead">{strings.lead}</p>
      </header>

      <div className="source-banner">
        <span className="source-banner__label">{strings.sourceLabel}</span>
        <span className="source-banner__value">{test.source.label}</span>
      </div>

      <div className="builder-form">
        <div className="field">
          <label className="field__label" htmlFor="builder-focus">
            {strings.focusLabel}
          </label>
          <input
            id="builder-focus"
            className="input"
            type="text"
            value={focus}
            placeholder={strings.focusPlaceholder}
            onChange={(event) => onFocusChange(event.target.value)}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="builder-count">
            {strings.countLabel}
          </label>
          <input
            id="builder-count"
            className="input input--narrow"
            type="number"
            min={1}
            max={10}
            inputMode="numeric"
            value={count}
            onChange={(event) =>
              onCountChange(Number.parseInt(event.target.value, 10) || 1)
            }
          />
          <p className="field__hint">{strings.countHint}</p>
        </div>

        {error ? (
          <EmptyNote
            tone="error"
            title={strings.draftErrorTitle}
            body={strings.draftErrorBody}
          />
        ) : null}

        <div className="builder-actions">
          <button
            type="button"
            className="button button--primary"
            disabled={requesting}
            onClick={onRequest}
          >
            {requesting ? strings.requesting : requestLabel}
          </button>
        </div>

        {result?.status === 'no_grounding' ? (
          <EmptyNote
            icon="alert"
            title={strings.noGroundingTitle}
            body={result.message || strings.noGroundingFallback}
          />
        ) : null}

        {result === null && !requesting ? (
          <EmptyNote
            icon="spark"
            title={strings.idleTitle}
            body={strings.idleBody}
          />
        ) : null}

        {result?.status === 'drafted' ? (
          <EmptyNote
            tone="success"
            title={strings.draftedSuccessTitle}
            body={strings.draftedSuccessBody}
          />
        ) : null}

        {result?.status === 'drafted' ? (
          <section
            className="draft-preview"
            aria-labelledby="builder-draft-preview-heading"
          >
            <div className="draft-preview__head">
              <h3 id="builder-draft-preview-heading">
                {strings.draftedTitle}
              </h3>
              <span className="dashboard__count">
                {strings.questionsCount(formatCount(result.questions.length))}
              </span>
            </div>
            <p className="field__hint">{strings.draftedNote}</p>
            <ol className="draft-list">
              {result.questions.map((question, index) => (
                <li className="draft-card" key={question.id}>
                  <p className="draft-card__number">
                    {ar.builder.review.questionNumber(
                      formatCount(index + 1),
                    )}
                  </p>
                  <h4>{question.prompt}</h4>
                  <ul className="draft-card__options">
                    {question.options.map((option) => (
                      <li key={option.id}>{option.text}</li>
                    ))}
                  </ul>
                  <GroundingList
                    grounding={question.grounding}
                    label={ar.builder.review.groundingLabel}
                  />
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <div className="builder-actions builder-actions--split">
          <button
            type="button"
            className="button button--secondary"
            onClick={onBack}
          >
            {ar.builder.nav.back}
          </button>
          <button
            type="button"
            className="button button--primary"
            onClick={onNext}
          >
            {strings.nextReview}
          </button>
        </div>
      </div>
    </section>
  )
}
