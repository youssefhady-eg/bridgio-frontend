import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  parentOverviewQueryOptions,
  parentProfileQueryOptions,
  sessionQueryOptions,
} from '~/api/queries'
import type { ParentTestStatus } from '~/api/types'
import { ChatSurface } from '~/components/chat/ChatSurface'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { ProgressBar } from '~/components/dashboard/ProgressBar'
import { StatusChip, type StatusTone } from '~/components/dashboard/StatusChip'
import { formatCount, formatDate, formatPercent } from '~/components/dashboard/format'
import { MetaPair } from '~/components/shared/MetaPair'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Parent view (UI name "Parents") — display only.
 *
 * Shows what the adapter returns for a linked child's progress, tests, results
 * and messages. The frontend computes nothing: `scorePercent` is
 * backend-supplied, and no score is calculated, no answer marked, and no result
 * invented here. Every `parents.*` / `messages.*` method is PROPOSED.
 */

export type ParentSection = 'progress' | 'tests' | 'results' | 'messages'

const statusMeta: Record<
  ParentTestStatus,
  { tone: StatusTone; icon: 'clock' | 'pencil' | 'check' }
> = {
  not_started: { tone: 'neutral', icon: 'clock' },
  in_progress: { tone: 'warning', icon: 'pencil' },
  submitted: { tone: 'success', icon: 'check' },
}

export function ParentView({ section }: { section: ParentSection }) {
  const strings = useStrings()
  const lang = useLang()
  const copy = strings.parent

  const sessionQuery = useQuery(sessionQueryOptions())
  const isParent = sessionQuery.data?.user.role === 'parent'

  const profileQuery = useQuery({
    ...parentProfileQueryOptions(),
    enabled: isParent,
  })
  const children = profileQuery.data?.children ?? []

  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const activeChildId =
    children.find((child) => child.student.id === selectedChildId)?.student.id ??
    children[0]?.student.id ??
    null

  const overviewQuery = useQuery({
    ...parentOverviewQueryOptions(activeChildId ?? ''),
    enabled: isParent && activeChildId !== null,
  })

  if (sessionQuery.isPending || (isParent && profileQuery.isPending)) {
    return (
      <ParentFrame heading={sectionHeading(copy, section)}>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </ParentFrame>
    )
  }

  if (sessionQuery.isError || profileQuery.isError) {
    return (
      <ParentFrame heading={sectionHeading(copy, section)}>
        <EmptyNote
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      </ParentFrame>
    )
  }

  if (!isParent) {
    return (
      <ParentFrame heading={sectionHeading(copy, section)}>
        <EmptyNote
          icon="alert"
          title={copy.noSessionTitle}
          body={copy.noSessionBody}
        />
      </ParentFrame>
    )
  }

  const childPicker =
    children.length > 1 ? (
      <label className="parent-child-picker">
        <span className="parent-child-picker__label">{copy.childLabel}</span>
        <select
          value={activeChildId ?? ''}
          onChange={(event) => setSelectedChildId(event.target.value)}
        >
          {children.map((child) => (
            <option key={child.student.id} value={child.student.id}>
              {child.student.displayName}
            </option>
          ))}
        </select>
      </label>
    ) : null

  if (section === 'messages') {
    return (
      <ParentFrame heading={copy.messages.heading} lead={copy.messages.lead}>
        <p className="parent-readonly">{copy.readOnlyNote}</p>
        <div className="panel">
          <ChatSurface active />
        </div>
      </ParentFrame>
    )
  }

  if (overviewQuery.isPending) {
    return (
      <ParentFrame heading={sectionHeading(copy, section)}>
        {childPicker}
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </ParentFrame>
    )
  }

  if (overviewQuery.isError || !overviewQuery.data) {
    return (
      <ParentFrame heading={sectionHeading(copy, section)}>
        {childPicker}
        <EmptyNote
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      </ParentFrame>
    )
  }

  const overview = overviewQuery.data

  return (
    <ParentFrame
      heading={sectionHeading(copy, section)}
      lead={
        section === 'progress'
          ? copy.progress.lead
          : section === 'tests'
            ? copy.tests.lead
            : copy.results.lead
      }
      childName={overview.child.student.displayName}
    >
      {childPicker}
      <p className="parent-readonly">{copy.readOnlyNote}</p>

      {section === 'progress' ? (
        <section className="dashboard__section" aria-labelledby="parent-progress-heading">
          <div className="section-head">
            <h2 id="parent-progress-heading">{copy.progress.overall}</h2>
            <span className="count-chip">
              {formatPercent(overview.progress.overallPercent, lang)}
            </span>
          </div>
          <ProgressBar
            percent={overview.progress.overallPercent}
            label={copy.progress.barLabel(overview.child.student.displayName)}
            valueText={formatPercent(overview.progress.overallPercent, lang)}
          />
          <dl className="parent-stats">
            <div>
              <dt>{copy.progress.completedUnits}</dt>
              <dd>
                {formatCount(overview.progress.completedUnits, lang)} /{' '}
                {formatCount(overview.progress.totalUnits, lang)}
              </dd>
            </div>
            <div>
              <dt>{copy.progress.lastActive}</dt>
              <dd>
                {formatDate(
                  overview.progress.lastActiveAt,
                  copy.progress.noActivity,
                  lang,
                )}
              </dd>
            </div>
          </dl>

          {overview.progress.units.length === 0 ? (
            <EmptyNote
              icon="chart"
              title={copy.progress.emptyTitle}
              body={copy.progress.emptyBody}
            />
          ) : (
            <ul className="parent-unit-list">
              {overview.progress.units.map((unit) => (
                <li className="parent-unit" key={unit.unitId}>
                  <div className="parent-unit__head">
                    <h3>{unit.unitTitle}</h3>
                    <span className="count-chip">
                      {formatPercent(unit.progressPercent, lang)}
                    </span>
                  </div>
                  <ProgressBar
                    percent={unit.progressPercent}
                    label={copy.progress.barLabel(unit.unitTitle)}
                    valueText={formatPercent(unit.progressPercent, lang)}
                  />
                  <p className="row-meta">
                    <MetaPair label={copy.progress.lessonsCompleted}>
                      {formatCount(unit.lessonsCompleted, lang)}
                    </MetaPair>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {section === 'tests' ? (
        <section className="dashboard__section" aria-labelledby="parent-tests-heading">
          <div className="section-head">
            <h2 id="parent-tests-heading">{copy.tests.heading}</h2>
            <span className="count-chip">
              {formatCount(overview.tests.length, lang)}
            </span>
          </div>
          {overview.tests.length === 0 ? (
            <EmptyNote
              icon="tests"
              title={copy.tests.emptyTitle}
              body={copy.tests.emptyBody}
            />
          ) : (
            <div className="panel">
              <ul className="test-list">
                {overview.tests.map((test) => {
                  const meta = statusMeta[test.status]
                  return (
                    <li className="test-row" key={test.id}>
                      <div className="test-row__main">
                        <h3>{test.title}</h3>
                        <p className="row-meta">{test.classroomName}</p>
                      </div>
                      <div className="test-row__aside">
                        <StatusChip
                          tone={meta.tone}
                          icon={meta.icon}
                          label={
                            test.status === 'not_started'
                              ? copy.tests.statusNotStarted
                              : test.status === 'in_progress'
                                ? copy.tests.statusInProgress
                                : copy.tests.statusSubmitted
                          }
                        />
                        <p className="row-meta">
                          {copy.tests.answered(
                            formatCount(test.answeredCount, lang),
                            formatCount(test.questionCount, lang),
                          )}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </section>
      ) : null}

      {section === 'results' ? (
        <section className="dashboard__section" aria-labelledby="parent-results-heading">
          <div className="section-head">
            <h2 id="parent-results-heading">{copy.results.heading}</h2>
            <span className="count-chip">
              {formatCount(overview.results.length, lang)}
            </span>
          </div>
          {overview.results.length === 0 ? (
            <EmptyNote
              icon="tests"
              title={copy.results.emptyTitle}
              body={copy.results.emptyBody}
            />
          ) : (
            <div className="panel">
              <ul className="test-list">
                {overview.results.map((result) => (
                  <li className="test-row" key={result.attemptId}>
                    <div className="test-row__main">
                      <h3>{result.testTitle}</h3>
                      <p className="row-meta">{result.classroomName}</p>
                      <p className="row-meta">
                        <MetaPair label={copy.results.submittedAt}>
                          {formatDate(
                            result.submittedAt,
                            copy.results.unanswered,
                            lang,
                          )}
                        </MetaPair>
                      </p>
                    </div>
                    <div className="test-row__aside">
                      <p className="parent-score">
                        <span className="parent-score__label">
                          {copy.results.scoreLabel}
                        </span>
                        <strong>
                          {result.scorePercent === null
                            ? copy.results.scoreUnavailable
                            : formatPercent(result.scorePercent, lang)}
                        </strong>
                      </p>
                      <p className="row-meta">
                        {copy.results.answeredCount(
                          formatCount(result.answeredCount, lang),
                          formatCount(result.questionCount, lang),
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ) : null}
    </ParentFrame>
  )
}

function sectionHeading(
  copy: ReturnType<typeof useStrings>['parent'],
  section: ParentSection,
): string {
  switch (section) {
    case 'progress':
      return copy.progress.heading
    case 'tests':
      return copy.tests.heading
    case 'results':
      return copy.results.heading
    case 'messages':
      return copy.messages.heading
  }
}

function ParentFrame({
  heading,
  lead,
  childName,
  children,
}: {
  heading: string
  lead?: string
  childName?: string
  children: React.ReactNode
}) {
  const strings = useStrings()
  return (
    <div className="dashboard parent-view">
      <header className="dashboard__hero">
        {/* Eyebrow names the role; the section heading is the H1. The two used
            to render the same string, duplicating the heading on every section. */}
        <p className="app-shell__badge">{strings.parent.badge}</p>
        <h1>{heading}</h1>
        {lead ? <p className="dashboard__lead">{lead}</p> : null}
        {childName ? <p className="dashboard__greeting">{childName}</p> : null}
      </header>
      {children}
    </div>
  )
}
