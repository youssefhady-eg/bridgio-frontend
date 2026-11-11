import { useQuery } from '@tanstack/react-query'
import { sessionQueryOptions, studentProgressQueryOptions } from '~/api/queries'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { ProgressBar } from '~/components/dashboard/ProgressBar'
import { formatCount, formatDate, formatPercent } from '~/components/dashboard/format'
import { MetaList } from '~/components/shared/MetaList'
import { PageHero } from '~/components/shared/PageHero'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Student "My Progress" — the student's own progress across their units.
 *
 * Everything comes from `students.getProgress` (PROPOSED): the overall percent,
 * the per-unit progress and the last activity. The screen computes nothing; the
 * percent is backend-supplied and is only localised for display.
 */
export function ProgressView() {
  const strings = useStrings()
  const copy = strings.progress
  const lang = useLang()

  const sessionQuery = useQuery(sessionQueryOptions())
  const studentId =
    sessionQuery.data?.user.role === 'student'
      ? sessionQuery.data.user.id
      : null

  const progressQuery = useQuery({
    ...studentProgressQueryOptions(studentId ?? ''),
    enabled: studentId !== null,
  })

  if (sessionQuery.isPending || (studentId !== null && progressQuery.isPending)) {
    return (
      <Frame>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </Frame>
    )
  }

  if (sessionQuery.isError) {
    return (
      <Frame>
        <EmptyNote
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      </Frame>
    )
  }

  if (studentId === null) {
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

  if (progressQuery.isError || !progressQuery.data) {
    return (
      <Frame>
        <EmptyNote
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      </Frame>
    )
  }

  const progress = progressQuery.data

  return (
    <Frame>
      <MetaList
        items={[
          {
            label: copy.overallLabel,
            value: formatPercent(progress.overallPercent, lang),
          },
          {
            label: copy.lastActive,
            value: formatDate(progress.lastActiveAt, copy.noActivity, lang),
          },
        ]}
      />

      <section className="dashboard__section" aria-labelledby="my-units-heading">
        <div className="section-head">
          <h2 id="my-units-heading">{copy.unitsHeading}</h2>
          <span className="count-chip">
            {formatCount(progress.units.length, lang)}
          </span>
        </div>
        {progress.units.length === 0 ? (
          <EmptyNote
            icon="chart"
            title={copy.emptyTitle}
            body={copy.emptyBody}
          />
        ) : (
          <ul className="parent-unit-list">
            {progress.units.map((entry) => (
              <li className="parent-unit" key={entry.unit.id}>
                <div className="parent-unit__head">
                  <h3>{entry.unit.title}</h3>
                  <div className="parent-score">
                    <span className="parent-score__label">
                      {copy.overallLabel}
                    </span>
                    <strong>{formatPercent(entry.progressPercent, lang)}</strong>
                  </div>
                </div>
                <ProgressBar
                  percent={entry.progressPercent}
                  label={copy.barLabel(entry.unit.title)}
                  valueText={formatPercent(entry.progressPercent, lang)}
                />
                <p className="row-meta">
                  {copy.lessonsCompleted}:{' '}
                  {formatCount(entry.lessonsCompleted, lang)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Frame>
  )
}

function Frame({ children }: { children: React.ReactNode }) {
  const copy = useStrings().progress
  return (
    <div className="dashboard">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />
      {children}
    </div>
  )
}
