import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { api } from '~/api'
import { queryKeys } from '~/api/query-keys'
import {
  attemptQueryOptions,
  studentTestQuestionsQueryOptions,
} from '~/api/queries'
import type { Attempt, UserId } from '~/api/types'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { ProgressBar } from '~/components/dashboard/ProgressBar'
import { formatCount, formatPercent } from '~/components/dashboard/format'
import { Icon } from '~/components/dashboard/icons'
import { ar } from '~/content/strings'
import {
  answeredPercent,
  clampIndex,
  isLastQuestion,
  nextIndex,
  previousIndex,
  selectedOptionFor,
  unansweredCount,
} from './player'

const strings = ar.player.runner

/**
 * Stage 4 — the test player itself.
 *
 * One question at a time with options, next/previous, a progress bar and a
 * submit action. Answers are saved through `attempts.saveAnswer`; submitting calls
 * `attempts.submit`, which records the attempt only. There is no marking, no score
 * and no correct/incorrect feedback anywhere in this stage.
 */
export function TestRunner({
  attemptId,
  studentId,
  onExit,
}: {
  attemptId: string
  studentId: UserId
  onExit: () => void
}) {
  const queryClient = useQueryClient()
  const attemptQuery = useQuery(attemptQueryOptions(attemptId))
  const testId = attemptQuery.data?.testId ?? ''
  const questionsQuery = useQuery({
    ...studentTestQuestionsQueryOptions(testId),
    enabled: testId !== '',
  })

  const [index, setIndex] = useState(0)
  const [confirming, setConfirming] = useState(false)

  const saveMutation = useMutation({
    mutationFn: (input: { questionId: string; optionId: string }) =>
      api.attempts.saveAnswer({
        attemptId,
        questionId: input.questionId,
        optionId: input.optionId,
      }),
    onSuccess: (attempt) => {
      queryClient.setQueryData(queryKeys.attempts.detail(attemptId), attempt)
    },
  })

  const submitMutation = useMutation({
    mutationFn: () => api.attempts.submit({ attemptId }),
    onSuccess: (attempt) => {
      queryClient.setQueryData(queryKeys.attempts.detail(attemptId), attempt)
      void queryClient.invalidateQueries({
        queryKey: queryKeys.attempts.forStudent(studentId),
      })
      setConfirming(false)
    },
  })

  if (attemptQuery.isPending) {
    return <RunnerFrame><Loading /></RunnerFrame>
  }

  if (attemptQuery.isError || !attemptQuery.data) {
    return (
      <RunnerFrame>
        <EmptyNote
          tone="error"
          title={strings.loadErrorTitle}
          body={strings.loadErrorBody}
        />
      </RunnerFrame>
    )
  }

  const attempt = attemptQuery.data

  if (attempt.status === 'submitted') {
    return <RunnerFrame><Completion attempt={attempt} onExit={onExit} /></RunnerFrame>
  }

  if (questionsQuery.isPending) {
    return <RunnerFrame><Loading /></RunnerFrame>
  }

  if (questionsQuery.isError) {
    return (
      <RunnerFrame>
        <EmptyNote
          tone="error"
          title={strings.loadErrorTitle}
          body={strings.loadErrorBody}
        />
      </RunnerFrame>
    )
  }

  const questions = questionsQuery.data ?? []
  const question = questions[clampIndex(index, questions.length)]
  if (!question) {
    return (
      <RunnerFrame>
        <EmptyNote
          icon="alert"
          title={ar.player.list.emptyTitle}
          body={ar.player.list.emptyBody}
        />
      </RunnerFrame>
    )
  }

  const safeIndex = clampIndex(index, questions.length)
  const selected = selectedOptionFor(attempt, question.id)
  const answeredCount = attempt.answers.filter(
    (answer) => answer.optionId !== null,
  ).length
  const percent = answeredPercent(answeredCount, questions.length)
  const remaining = unansweredCount(attempt)

  return (
    <RunnerFrame>
      <header className="player-run__head">
        <h2>{attempt.testTitle}</h2>
        <button
          type="button"
          className="button button--ghost button--small"
          onClick={onExit}
        >
          {strings.changeTest}
        </button>
      </header>
      <p className="row-meta">{attempt.classroomName}</p>

      <div className="player-progress">
        <div className="progress-row__labels">
          <span>{strings.progressLabel}</span>
          <strong>
            {strings.questionCount(
              formatCount(safeIndex + 1),
              formatCount(questions.length),
            )}
          </strong>
        </div>
        <ProgressBar
          percent={percent}
          label={strings.progressLabel}
          valueText={formatPercent(percent)}
        />
      </div>

      <fieldset className="player-question">
        <legend className="player-question__prompt">{question.prompt}</legend>
        <p className="field__hint">{strings.optionsLabel}</p>
        <ul className="player-options">
          {question.options.map((option) => {
            const isSelected = option.id === selected
            return (
              <li key={option.id}>
                <label
                  className={`player-option${isSelected ? ' is-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.id}
                    checked={isSelected}
                    onChange={() =>
                      saveMutation.mutate({
                        questionId: question.id,
                        optionId: option.id,
                      })
                    }
                  />
                  <span className="player-option__text">{option.text}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </fieldset>

      {saveMutation.isError ? (
        <EmptyNote
          tone="error"
          title={strings.saveErrorTitle}
          body={strings.saveErrorBody}
        />
      ) : null}

      <div className="builder-actions builder-actions--split">
        <button
          type="button"
          className="button button--secondary"
          disabled={safeIndex === 0}
          onClick={() => setIndex(previousIndex(safeIndex, questions.length))}
        >
          {strings.previous}
        </button>
        <button
          type="button"
          className="button button--secondary"
          disabled={isLastQuestion(safeIndex, questions.length)}
          onClick={() => setIndex(nextIndex(safeIndex, questions.length))}
        >
          {strings.next}
        </button>
      </div>

      <div className="player-submit">
        {submitMutation.isError ? (
          <EmptyNote
            tone="error"
            title={strings.submitErrorTitle}
            body={strings.submitErrorBody}
          />
        ) : null}

        {confirming ? (
          <div className="player-confirm" role="alert">
            <p className="player-confirm__title">{strings.confirmTitle}</p>
            <p className="player-confirm__body">
              {strings.confirmBody(formatCount(remaining))}
            </p>
            <div className="builder-actions">
              <button
                type="button"
                className="button button--primary"
                disabled={submitMutation.isPending}
                onClick={() => submitMutation.mutate()}
              >
                {submitMutation.isPending
                  ? strings.submitting
                  : strings.confirmSubmit}
              </button>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => setConfirming(false)}
              >
                {strings.confirmContinue}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="button button--primary"
            disabled={submitMutation.isPending}
            onClick={() => {
              if (remaining > 0) {
                setConfirming(true)
              } else {
                submitMutation.mutate()
              }
            }}
          >
            {submitMutation.isPending ? strings.submitting : strings.submit}
          </button>
        )}
      </div>
    </RunnerFrame>
  )
}

function RunnerFrame({ children }: { children: ReactNode }) {
  return <div className="player-run">{children}</div>
}

function Loading() {
  return (
    <p className="loading-note" role="status">
      {strings.loading}
    </p>
  )
}

function Completion({
  attempt,
  onExit,
}: {
  attempt: Attempt
  onExit: () => void
}) {
  return (
    <div className="player-done-block">
      <div className="player-done" role="status">
        <span className="player-done__icon" aria-hidden="true">
          <Icon name="check" size={26} />
        </span>
        <div>
          <h2>{strings.doneTitle}</h2>
          <p>{strings.doneBody(attempt.testTitle)}</p>
        </div>
      </div>
      <p className="field__hint">{strings.doneNoMarking}</p>
      <p className="row-meta">{strings.doneNext}</p>
      <div className="builder-actions">
        <button
          type="button"
          className="button button--primary"
          onClick={onExit}
        >
          {strings.backToList}
        </button>
      </div>
    </div>
  )
}
