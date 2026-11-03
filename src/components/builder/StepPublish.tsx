import type { GroundingRef, Question, Test } from '~/api/types'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { StatusChip } from '~/components/dashboard/StatusChip'
import { formatCount } from '~/components/dashboard/format'
import { Icon } from '~/components/dashboard/icons'
import { useLang, useStrings } from '~/shell/useStrings'
import { publishGate } from './builder'
import { GroundingList } from './GroundingList'

function sourcesOf(questions: readonly Question[]): GroundingRef[] {
  return [
    ...new Map(
      questions
        .flatMap((question) => question.grounding)
        .map((ref) => [`${ref.kind}:${ref.materialId ?? ref.unitId}`, ref]),
    ).values(),
  ]
}

/**
 * Step 4 — review the summary and publish to the class. Publishing is blocked
 * with honest teacher copy when there is no class or no question; the button is
 * never disabled without an explanation.
 */
export function StepPublish({
  test,
  className,
  questions,
  questionsLoading,
  questionsError,
  published,
  publishing,
  publishError,
  onPublish,
  onBack,
  onNewTest,
}: {
  test: Test
  className: string
  questions: readonly Question[]
  questionsLoading: boolean
  questionsError: boolean
  published: Test | null
  publishing: boolean
  publishError: boolean
  onPublish: () => void
  onBack: () => void
  onNewTest: () => void
}) {
  const builder = useStrings().builder
  const strings = builder.publish
  const lang = useLang()
  const activeTest = published ?? test
  const resolvedClassName = className || activeTest.classroomName
  const gate = publishGate({
    testId: activeTest.id,
    classroomId: activeTest.classroomId,
    questionCount: questions.length,
    status: activeTest.status,
  })
  const grounding = sourcesOf(questions)

  if (published) {
    return (
      <section
        className="builder-panel"
        aria-labelledby="builder-published-heading"
      >
        <div className="builder-success" role="status">
          <span className="builder-success__icon" aria-hidden="true">
            <Icon name="check" size={26} />
          </span>
          <div>
            <h2 id="builder-published-heading">{strings.successTitle}</h2>
            <p>{strings.successBody(published.title, resolvedClassName)}</p>
          </div>
        </div>

        <dl className="summary-list">
          <div>
            <dt>{strings.titleLabel}</dt>
            <dd>{published.title}</dd>
          </div>
          <div>
            <dt>{strings.classLabel}</dt>
            <dd>{resolvedClassName}</dd>
          </div>
          <div>
            <dt>{strings.sourceLabel}</dt>
            <dd>{published.source.label}</dd>
          </div>
          <div>
            <dt>{strings.statusLabel}</dt>
            <dd>
              <StatusChip
                tone="success"
                icon="check"
                label={strings.statusPublished}
              />
            </dd>
          </div>
        </dl>

        <p className="field__hint">{strings.successNote}</p>

        <div className="builder-actions">
          <button
            type="button"
            className="button button--primary"
            onClick={onNewTest}
          >
            {strings.newTest}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="builder-panel" aria-labelledby="builder-publish-heading">
      <header className="builder-panel__head">
        <h2 id="builder-publish-heading">{strings.heading}</h2>
        <p className="builder-panel__lead">{strings.lead}</p>
      </header>

      <div className="source-banner">
        <span className="source-banner__label">
          {builder.draft.sourceLabel}
        </span>
        <span className="source-banner__value">{activeTest.source.label}</span>
      </div>

      {questionsLoading ? (
        <p className="loading-note" role="status">
          {builder.review.loading}
        </p>
      ) : null}

      {questionsError ? (
        <EmptyNote
          tone="error"
          title={builder.review.loadErrorTitle}
          body={builder.review.loadErrorBody}
        />
      ) : null}

      {!questionsLoading && !questionsError ? (
        <>
          <h3>{strings.summaryTitle}</h3>
          <dl className="summary-list">
            <div>
              <dt>{strings.titleLabel}</dt>
              <dd>{activeTest.title}</dd>
            </div>
            <div>
              <dt>{strings.classLabel}</dt>
              <dd>{resolvedClassName}</dd>
            </div>
            <div>
              <dt>{strings.sourceLabel}</dt>
              <dd>{activeTest.source.label}</dd>
            </div>
            <div>
              <dt>{strings.questionsLabel}</dt>
              <dd>{formatCount(questions.length, lang)}</dd>
            </div>
            <div>
              <dt>{strings.statusLabel}</dt>
              <dd>
                <StatusChip
                  tone={activeTest.status === 'published' ? 'success' : 'warning'}
                  icon={activeTest.status === 'published' ? 'check' : 'pencil'}
                  label={
                    activeTest.status === 'published'
                      ? strings.statusPublished
                      : strings.statusDraft
                  }
                />
              </dd>
            </div>
          </dl>

          {grounding.length > 0 ? (
            <GroundingList
              grounding={grounding}
              label={strings.groundingTitle}
            />
          ) : (
            <p className="field__hint">{strings.noGrounding}</p>
          )}

          {!gate.allowed ? (
            <EmptyNote
              icon="alert"
              title={strings.blockedTitle}
              body={strings.blocked[gate.reason]}
            />
          ) : null}

          {publishError ? (
            <EmptyNote
              tone="error"
              title={strings.publishErrorTitle}
              body={strings.publishErrorBody}
            />
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
              disabled={!gate.allowed || publishing}
              onClick={onPublish}
            >
              {publishing ? strings.publishing : strings.publishButton}
            </button>
          </div>
        </>
      ) : null}
    </section>
  )
}
