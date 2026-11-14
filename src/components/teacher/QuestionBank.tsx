import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState, type ReactNode } from 'react'
import {
  sessionQueryOptions,
  teacherQuestionBankQueryOptions,
} from '~/api/queries'
import { QuestionCard } from '~/components/builder/QuestionCard'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { StatusChip } from '~/components/dashboard/StatusChip'
import { PageHero } from '~/components/shared/PageHero'
import { SelectField } from '~/components/shared/SelectField'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'
import {
  filterQuestionBank,
  questionBankClasses,
  questionBankTotals,
} from './question-bank'

/**
 * Teacher question bank — every question across the teacher's tests, grouped by
 * test and readable in place.
 *
 * Data is the composed `teacherQuestionBankQueryOptions` (tests + full questions
 * through the adapter). The bank is browse-only in this batch: there is no copy
 * or reuse flow, and questions are edited from their test's builder. The screen
 * is teacher-only because full questions carry `correctOptionId`; a student
 * session sees an explicit no-session note and the query never runs.
 */
export function QuestionBank() {
  const strings = useStrings()
  const copy = strings.questionBank
  const sessionQuery = useQuery(sessionQueryOptions())

  if (sessionQuery.isPending) {
    return (
      <Frame>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </Frame>
    )
  }

  if (sessionQuery.data?.user.role !== 'teacher') {
    return (
      <Frame>
        <EmptyNote
          icon="alert"
          title={copy.noSessionTitle}
          body={copy.noSessionBody}
        />
      </Frame>
    )
  }

  return <QuestionBankBody teacherId={sessionQuery.data.user.id} />
}

function QuestionBankBody({ teacherId }: { teacherId: string }) {
  const strings = useStrings()
  const copy = strings.questionBank
  const lang = useLang()
  const role = usePreviewRole()
  const [classId, setClassId] = useState('all')
  const [search, setSearch] = useState('')

  const bankQuery = useQuery(teacherQuestionBankQueryOptions(teacherId))
  const groups = bankQuery.data ?? []
  const classes = questionBankClasses(groups)
  const totals = questionBankTotals(groups)
  const filtered = filterQuestionBank(groups, {
    classroomId: classId === 'all' ? null : classId,
    query: search,
  })
  const filteredTotals = questionBankTotals(filtered)
  const filtering = classId !== 'all' || search.trim() !== ''

  function clearFilters() {
    setClassId('all')
    setSearch('')
  }

  return (
    <Frame>
      {bankQuery.isError ? (
        <EmptyNote
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      ) : bankQuery.isPending ? (
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      ) : totals.tests === 0 ? (
        <EmptyNote
          icon="tests"
          title={copy.emptyTitle}
          body={copy.emptyBody}
        />
      ) : totals.questions === 0 ? (
        <EmptyNote
          icon="spark"
          title={copy.noQuestionsTitle}
          body={copy.noQuestionsBody}
        />
      ) : (
        <>
          <section className="dashboard__section" aria-label={copy.filtersLabel}>
            <div className="filter-bar">
              <label className="filter-bar__field">
                <span className="field__label">{copy.filterClass}</span>
                <SelectField>
                  <select
                    className="input"
                    value={classId}
                    onChange={(event) => setClassId(event.target.value)}
                  >
                    <option value="all">{copy.allClasses}</option>
                    {classes.map((classroom) => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.name}
                      </option>
                    ))}
                  </select>
                </SelectField>
              </label>

              <label className="filter-bar__field filter-bar__field--grow">
                <span className="field__label">{copy.searchLabel}</span>
                <input
                  className="input"
                  type="search"
                  value={search}
                  placeholder={copy.searchPlaceholder}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>

              <p className="filter-bar__summary" role="status">
                {filtering
                  ? copy.matchesCount(filteredTotals.questions)
                  : `${copy.testsCount(totals.tests)} · ${copy.questionsCount(
                      totals.questions,
                    )}`}
              </p>

              {filtering ? (
                <button
                  type="button"
                  className="button button--secondary button--small"
                  onClick={clearFilters}
                >
                  {copy.clearFilters}
                </button>
              ) : null}
            </div>
          </section>

          <p className="finish-note">{copy.readOnlyNote}</p>

          {filtered.length === 0 ? (
            <EmptyNote
              icon="spark"
              title={copy.noMatchTitle}
              body={copy.noMatchBody}
            />
          ) : (
            filtered.map((group) => (
              <section
                className="dashboard__section question-bank__group"
                key={group.test.id}
                aria-labelledby={`bank-test-${group.test.id}`}
              >
                <div className="section-head">
                  <h2 id={`bank-test-${group.test.id}`}>
                    <Link
                      to="/teacher/tests/$testId"
                      params={{ testId: group.test.id }}
                      search={{ as: role, lang }}
                      className="screen-link"
                      preload={false}
                    >
                      {group.test.title}
                    </Link>
                  </h2>
                  <span className="count-chip">
                    {copy.questionsCount(group.questions.length)}
                  </span>
                </div>

                <div className="finish-row">
                  <span className="row-meta">{group.test.classroomName}</span>
                  <StatusChip
                    tone={
                      group.test.status === 'published' ? 'success' : 'warning'
                    }
                    icon={
                      group.test.status === 'published' ? 'check' : 'pencil'
                    }
                    label={
                      group.test.status === 'published'
                        ? strings.testDetail.statusPublished
                        : strings.testDetail.statusDraft
                    }
                  />
                </div>

                <ol className="question-list">
                  {group.questions.map((question) => (
                    <li key={question.id}>
                      <QuestionCard question={question} readOnly />
                    </li>
                  ))}
                </ol>
              </section>
            ))
          )}
        </>
      )}
    </Frame>
  )
}

function Frame({ children }: { children: ReactNode }) {
  const copy = useStrings().questionBank
  return (
    <div className="dashboard">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />
      {children}
    </div>
  )
}
