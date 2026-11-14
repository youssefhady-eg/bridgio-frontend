import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  Button,
  Group,
  Input,
  Label,
  NumberField,
  Text,
} from 'react-aria-components'
import type { DraftQuestionsResult, Test } from '~/api/types'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { formatCount } from '~/components/dashboard/format'
import { useLang, useStrings } from '~/shell/useStrings'
import { GroundingList } from './GroundingList'

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
  const builder = useStrings().builder
  const strings = builder.draft
  const lang = useLang()
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

        {/* React Aria NumberField replaces the native `type="number"` input, so
            Chrome's unstyled spinner never appears. Buttons are 44 px targets
            and the input keeps the narrow field width. Out-of-range or empty
            input falls back to 1. */}
        <NumberField
          className="field"
          minValue={1}
          maxValue={10}
          value={count}
          onChange={(value) =>
            onCountChange(
              Number.isNaN(value) ? 1 : Math.min(10, Math.max(1, value)),
            )
          }
        >
          <Label className="field__label">{strings.countLabel}</Label>
          <Group className="number-field">
            <Input className="input input--narrow number-field__input" />
            <div className="number-field__buttons">
              <Button
                slot="increment"
                className="number-field__button"
                aria-label={strings.countIncrease}
              >
                <ChevronUp size={16} strokeWidth={1.8} aria-hidden="true" />
              </Button>
              <Button
                slot="decrement"
                className="number-field__button"
                aria-label={strings.countDecrease}
              >
                <ChevronDown size={16} strokeWidth={1.8} aria-hidden="true" />
              </Button>
            </div>
          </Group>
          <Text slot="description" className="field__hint">
            {strings.countHint}
          </Text>
        </NumberField>

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
              <span className="count-chip">
                {strings.questionsCount(result.questions.length)}
              </span>
            </div>
            <p className="field__hint">{strings.draftedNote}</p>
            <ol className="draft-list">
              {result.questions.map((question, index) => (
                <li className="draft-card" key={question.id}>
                  <p className="draft-card__number">
                    {builder.review.questionNumber(
                      formatCount(index + 1, lang),
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
                    label={builder.review.groundingLabel}
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
            {builder.nav.back}
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
