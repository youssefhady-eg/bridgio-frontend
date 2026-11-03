import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { api } from '~/api'
import { queryKeys } from '~/api/query-keys'
import {
  classroomDetailQueryOptions,
  sessionQueryOptions,
  teacherClassroomsQueryOptions,
  teacherMaterialsQueryOptions,
  testQuestionsQueryOptions,
} from '~/api/queries'
import type {
  CreateTestDraftInput,
  DraftQuestionsResult,
  Test,
  TestSourceInput,
  UserId,
} from '~/api/types'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { useStrings } from '~/shell/useStrings'
import type { BuilderStep } from './builder'
import { StepChooseSource, type SourceKind } from './StepChooseSource'
import { StepDraftQuestions } from './StepDraftQuestions'
import { StepIndicator } from './StepIndicator'
import { StepPublish } from './StepPublish'
import { StepReviewQuestions } from './StepReviewQuestions'

/**
 * Stage 3 — teacher test builder.
 *
 * Four steps, one persisted draft test:
 *   1. choose a class + material / curriculum unit  → tests.createDraft
 *   2. Mohsen drafts grounded questions             → mohsen.draftQuestions
 *   3. review, edit, delete                          → questions.update / delete
 *   4. publish to the class                          → tests.publish
 *
 * Every persistent value comes from the Stage 0 adapter. Local state is UI
 * state only: the current step, the chosen source, and the draft id.
 */

export function TestBuilder() {
  const sessionQuery = useQuery(sessionQueryOptions())
  const strings = useStrings().builder

  if (sessionQuery.isPending) {
    return (
      <BuilderFrame>
        <p className="loading-note" role="status">
          {strings.loading}
        </p>
      </BuilderFrame>
    )
  }

  if (sessionQuery.isError) {
    return (
      <BuilderFrame>
        <EmptyNote
          tone="error"
          title={strings.loadErrorTitle}
          body={strings.loadErrorBody}
        />
      </BuilderFrame>
    )
  }

  const teacherId =
    sessionQuery.data?.user.role === 'teacher'
      ? sessionQuery.data.user.id
      : null

  if (teacherId === null) {
    return (
      <BuilderFrame>
        <EmptyNote
          icon="alert"
          title={strings.noSessionTitle}
          body={strings.noSessionBody}
        />
      </BuilderFrame>
    )
  }

  return (
    <BuilderFrame>
      <BuilderFlow teacherId={teacherId} />
    </BuilderFrame>
  )
}

function BuilderFlow({ teacherId }: { teacherId: UserId }) {
  const queryClient = useQueryClient()
  const strings = useStrings().builder

  const [step, setStep] = useState<BuilderStep>(1)
  const [classroomId, setClassroomId] = useState('')
  const [sourceKind, setSourceKind] = useState<SourceKind>('material')
  const [materialId, setMaterialId] = useState('')
  const [unitId, setUnitId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [draft, setDraft] = useState<Test | null>(null)
  const [draftResult, setDraftResult] =
    useState<DraftQuestionsResult | null>(null)
  const [focus, setFocus] = useState('')
  const [count, setCount] = useState(3)
  const [published, setPublished] = useState<Test | null>(null)

  const classesQuery = useQuery(teacherClassroomsQueryOptions(teacherId))
  const selectedClass = classesQuery.data?.find(
    (classroom) => classroom.id === classroomId,
  )
  const selectedClassName =
    selectedClass?.name ?? draft?.classroomName ?? ''

  const materialsQuery = useQuery({
    ...teacherMaterialsQueryOptions(teacherId, classroomId || undefined),
    enabled: classroomId !== '' && sourceKind === 'material' && draft === null,
  })

  const classroomQuery = useQuery({
    ...classroomDetailQueryOptions(classroomId),
    enabled:
      classroomId !== '' && sourceKind === 'curriculum_unit' && draft === null,
  })

  const questionsQuery = useQuery({
    ...testQuestionsQueryOptions(draft?.id ?? ''),
    enabled: draft !== null,
  })
  const questions = questionsQuery.data ?? []

  const invalidateDraft = (testId: string) => {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.tests.questions(testId),
    })
    void queryClient.invalidateQueries({
      queryKey: queryKeys.tests.detail(testId),
    })
    void queryClient.invalidateQueries({
      queryKey: queryKeys.tests.forTeacher(teacherId),
    })
    void queryClient.invalidateQueries({
      queryKey: queryKeys.teachers.dashboard(teacherId),
    })
  }

  const createDraftMutation = useMutation({
    mutationFn: (input: CreateTestDraftInput) => api.tests.createDraft(input),
    onSuccess: (test) => {
      setDraft(test)
      setDraftResult(null)
      setPublished(null)
      setStep(2)
      invalidateDraft(test.id)
    },
  })

  const draftMutation = useMutation({
    mutationFn: (input: {
      testId: string
      count: number
      focus: string | null
    }) =>
      api.mohsen.draftQuestions({
        teacherId,
        testId: input.testId,
        count: input.count,
        focus: input.focus,
      }),
    onSuccess: (result, input) => {
      setDraftResult(result)
      invalidateDraft(input.testId)
    },
  })

  const publishMutation = useMutation({
    mutationFn: (testId: string) =>
      api.tests.publish({ teacherId, testId }),
    onSuccess: (test) => {
      setPublished(test)
      invalidateDraft(test.id)
    },
  })

  function createDraft() {
    const source: TestSourceInput =
      sourceKind === 'material'
        ? { kind: 'material', materialId }
        : { kind: 'curriculum_unit', unitId }

    createDraftMutation.reset()
    createDraftMutation.mutate({
      teacherId,
      classroomId,
      title: title.trim(),
      description: description.trim() || null,
      source,
    })
  }

  function requestQuestions() {
    if (!draft) return
    draftMutation.reset()
    draftMutation.mutate({
      testId: draft.id,
      count: Math.min(10, Math.max(1, Math.trunc(count) || 1)),
      focus: focus.trim() || null,
    })
  }

  function publish() {
    if (!draft) return
    publishMutation.reset()
    publishMutation.mutate(draft.id)
  }

  function startNewTest() {
    setStep(1)
    setClassroomId('')
    setSourceKind('material')
    setMaterialId('')
    setUnitId('')
    setTitle('')
    setDescription('')
    setDraft(null)
    setDraftResult(null)
    setFocus('')
    setCount(3)
    setPublished(null)
  }

  return (
    <>
      <StepIndicator
        current={step}
        hasDraft={draft !== null}
        published={published !== null}
        onSelect={setStep}
      />

      {step === 1 ? (
        <StepChooseSource
          classes={classesQuery.data ?? []}
          classesLoading={classesQuery.isLoading}
          classesError={classesQuery.isError}
          classroomId={classroomId}
          onClassroomChange={(value) => {
            setClassroomId(value)
            setMaterialId('')
            setUnitId('')
          }}
          sourceKind={sourceKind}
          onSourceKindChange={(value) => {
            setSourceKind(value)
            setMaterialId('')
            setUnitId('')
          }}
          materials={materialsQuery.data ?? []}
          materialsLoading={materialsQuery.isLoading}
          materialsError={materialsQuery.isError}
          materialId={materialId}
          onMaterialIdChange={setMaterialId}
          classroomDetail={classroomQuery.data}
          classroomLoading={classroomQuery.isLoading}
          classroomError={classroomQuery.isError}
          unitId={unitId}
          onUnitIdChange={setUnitId}
          title={title}
          onTitleChange={setTitle}
          description={description}
          onDescriptionChange={setDescription}
          draft={draft}
          className={selectedClassName}
          creating={createDraftMutation.isPending}
          createError={createDraftMutation.isError}
          onCreateDraft={createDraft}
        />
      ) : null}

      {step === 2 && draft ? (
        <StepDraftQuestions
          test={draft}
          result={draftResult}
          requesting={draftMutation.isPending}
          error={draftMutation.isError}
          focus={focus}
          onFocusChange={setFocus}
          count={count}
          onCountChange={setCount}
          onRequest={requestQuestions}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      ) : null}

      {step === 3 && draft ? (
        <StepReviewQuestions
          teacherId={teacherId}
          test={draft}
          questions={questions}
          loading={questionsQuery.isLoading}
          loadError={questionsQuery.isError}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      ) : null}

      {step === 4 && draft ? (
        <StepPublish
          test={draft}
          className={selectedClassName}
          questions={questions}
          questionsLoading={questionsQuery.isLoading}
          questionsError={questionsQuery.isError}
          published={published}
          publishing={publishMutation.isPending}
          publishError={publishMutation.isError}
          onPublish={publish}
          onBack={() => setStep(3)}
          onNewTest={startNewTest}
        />
      ) : null}

      {step !== 1 && !draft ? (
        <EmptyNote
          icon="alert"
          title={strings.source.classesEmptyTitle}
          body={strings.source.createDraftErrorBody}
        />
      ) : null}
    </>
  )
}

function BuilderFrame({ children }: { children: ReactNode }) {
  const strings = useStrings().builder
  return (
    <div className="builder">
      <header className="builder__hero">
        <p className="app-shell__badge">{strings.badge}</p>
        <h1>{strings.title}</h1>
        <p className="builder__lead">{strings.lead}</p>
      </header>
      {children}
    </div>
  )
}
