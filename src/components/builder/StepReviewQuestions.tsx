import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '~/api'
import { queryKeys } from '~/api/query-keys'
import { testQuestionsQueryOptions } from '~/api/queries'
import type { Question, Test, UserId } from '~/api/types'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { formatCount } from '~/components/dashboard/format'
import { useLang, useStrings } from '~/shell/useStrings'
import type { QuestionDraft } from './builder'
import { removeQuestion, replaceQuestion } from './builder'
import { QuestionCard } from './QuestionCard'

/**
 * Step 3 — teacher review. Every question is editable and deletable before
 * publishing. Edits/deletes go through `questions.update` / `questions.delete`
 * and update the shared query cache with the adapter's returned shape.
 */
export function StepReviewQuestions({
  teacherId,
  test,
  questions,
  loading,
  loadError,
  onNext,
  onBack,
}: {
  teacherId: UserId
  test: Test
  questions: readonly Question[]
  loading: boolean
  loadError: boolean
  onNext: () => void
  onBack: () => void
}) {
  const queryClient = useQueryClient()
  const builder = useStrings().builder
  const strings = builder.review
  const lang = useLang()
  const [error, setError] = useState<'update' | 'delete' | null>(null)

  const updateMutation = useMutation({
    mutationFn: (input: { questionId: string; draft: QuestionDraft }) =>
      api.questions.update({
        teacherId,
        testId: test.id,
        questionId: input.questionId,
        prompt: input.draft.prompt,
        options: input.draft.options,
        correctOptionIndex: input.draft.correctIndex,
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData<Question[]>(
        testQuestionsQueryOptions(test.id).queryKey,
        (current) => replaceQuestion(current ?? [], updated),
      )
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tests.detail(test.id),
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (questionId: string) =>
      api.questions.delete({
        teacherId,
        testId: test.id,
        questionId,
      }),
    onSuccess: (_result, questionId) => {
      queryClient.setQueryData<Question[]>(
        testQuestionsQueryOptions(test.id).queryKey,
        (current) => removeQuestion(current ?? [], questionId),
      )
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tests.detail(test.id),
      })
    },
  })

  async function saveQuestion(
    questionId: string,
    draft: QuestionDraft,
  ): Promise<boolean> {
    setError(null)
    try {
      await updateMutation.mutateAsync({ questionId, draft })
      return true
    } catch {
      setError('update')
      return false
    }
  }

  async function deleteQuestion(questionId: string): Promise<boolean> {
    setError(null)
    try {
      await deleteMutation.mutateAsync(questionId)
      return true
    } catch {
      setError('delete')
      return false
    }
  }

  return (
    <section className="builder-panel" aria-labelledby="builder-review-heading">
      <header className="builder-panel__head">
        <h2 id="builder-review-heading">{strings.heading}</h2>
        <p className="builder-panel__lead">{strings.lead}</p>
      </header>

      <div className="source-banner">
        <span className="source-banner__label">
          {builder.draft.sourceLabel}
        </span>
        <span className="source-banner__value">{test.source.label}</span>
      </div>

      {loading ? (
        <p className="loading-note" role="status">
          {strings.loading}
        </p>
      ) : null}

      {loadError ? (
        <EmptyNote
          tone="error"
          title={strings.loadErrorTitle}
          body={strings.loadErrorBody}
        />
      ) : null}

      {!loading && !loadError && questions.length === 0 ? (
        <>
          <EmptyNote
            icon="spark"
            title={strings.emptyTitle}
            body={strings.emptyBody}
          />
          <div className="builder-actions">
            <button
              type="button"
              className="button button--secondary"
              onClick={onBack}
            >
              {strings.backToDraft}
            </button>
          </div>
        </>
      ) : null}

      {questions.length > 0 ? (
        <>
          <div className="draft-preview__head">
            <h3>{strings.listHeading}</h3>
            <span className="count-chip">
              {builder.draft.questionsCount(questions.length)}
            </span>
          </div>

          {error ? (
            <EmptyNote
              tone="error"
              title={
                error === 'update'
                  ? strings.updateErrorTitle
                  : strings.deleteErrorTitle
              }
              body={
                error === 'update'
                  ? strings.updateErrorBody
                  : strings.deleteErrorBody
              }
            />
          ) : null}

          <ol className="question-list">
            {questions.map((question) => (
              <li key={question.id}>
                <QuestionCard
                  question={question}
                  onSave={(draft) => saveQuestion(question.id, draft)}
                  onDelete={() => deleteQuestion(question.id)}
                />
              </li>
            ))}
          </ol>
        </>
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
          {strings.nextPublish}
        </button>
      </div>
    </section>
  )
}
