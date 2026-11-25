import { useQuery } from '@tanstack/react-query'
import { capabilitiesQueryOptions, sessionQueryOptions } from '~/api/queries'
import type { NavCapability } from '~/api/types'
import { AppIcon, type AppIconName } from '~/components/AppIcon'
import { dashboardLabel, roleLabel } from '~/content/roles'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { MetaList } from '~/components/shared/MetaList'
import { PageHero } from '~/components/shared/PageHero'
import { useGuestPreview } from '~/shell/useGuestPreview'
import { useStrings } from '~/shell/useStrings'

/**
 * Teacher Assistant — the sections the backend granted this account.
 *
 * The frontend never decides grants: it asks `rbac.getCapabilities` and renders
 * exactly the returned items. Each granted section is an anchor of this single
 * screen, so the assistant sidebar (which points every capability here) can
 * scroll to it. With no grants the list is empty and says so.
 */
const capabilityIcon: Record<NavCapability, AppIconName> = {
  dashboard: 'dashboard',
  classes: 'classes',
  tests: 'tests',
  students: 'students',
}

export function AssistantView() {
  const strings = useStrings()
  const copy = strings.assistant

  const sessionQuery = useQuery(sessionQueryOptions())
  const guest = useGuestPreview()
  const viewer = sessionQuery.data?.user ?? guest.user

  const capabilitiesQuery = useQuery({
    ...capabilitiesQueryOptions(viewer?.id ?? ''),
    enabled: viewer !== null,
  })

  if (sessionQuery.isPending) {
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

  if (!viewer || viewer.role !== 'assistant') {
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

  if (capabilitiesQuery.isPending) {
    return (
      <Frame>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </Frame>
    )
  }

  if (capabilitiesQuery.isError || !capabilitiesQuery.data) {
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

  const granted = capabilitiesQuery.data.items

  return (
    <Frame
      greeting={
        <p className="dashboard__greeting">
          {copy.greeting(viewer.displayName)}
        </p>
      }
    >
      <section
        className="dashboard__section"
        aria-labelledby="granted-heading"
      >
        <div className="section-head">
          <h2 id="granted-heading">{copy.grantedHeading}</h2>
        </div>
        <p className="section-lead">{copy.grantedLead}</p>
        {granted.length === 0 ? (
          <EmptyNote
            icon="alert"
            title={copy.grantedEmptyTitle}
            body={copy.grantedEmptyBody}
          />
        ) : (
          <ul className="capability-list">
            {granted.map((capability) => (
              <li
                className="capability-item"
                id={capability}
                key={capability}
              >
                <span className="capability-item__icon" aria-hidden="true">
                  <AppIcon name={capabilityIcon[capability]} size={22} />
                </span>
                <span className="capability-item__text">
                  <strong>
                    {capability === 'dashboard'
                      ? dashboardLabel(viewer, strings.dashboard)
                      : copy.capability[capability]}
                  </strong>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="finish-grid">
        <div className="finish-grid__main">
          <section
            className="dashboard__section"
            aria-labelledby="assistant-note-heading"
          >
            <h2 id="assistant-note-heading">{copy.noteTitle}</h2>
            <p className="section-lead">{copy.note}</p>
          </section>
        </div>
        <div className="finish-grid__side">
          <section
            className="dashboard__section"
            aria-labelledby="assistant-session-heading"
          >
            <h2 id="assistant-session-heading">{copy.sessionHeading}</h2>
            <MetaList
              items={[
                { label: copy.sessionName, value: viewer.displayName },
                {
                  label: copy.sessionRole,
                  value: roleLabel(
                    viewer,
                    strings.profile.roles,
                    strings.profile.rolesFemale,
                  ),
                },
              ]}
            />
          </section>
        </div>
      </div>
    </Frame>
  )
}

function Frame({
  greeting,
  children,
}: {
  greeting?: React.ReactNode
  children: React.ReactNode
}) {
  const copy = useStrings().assistant
  return (
    <div className="dashboard assistant-page">
      <PageHero
        badge={copy.badge}
        title={copy.title}
        lead={copy.lead}
        footer={greeting}
      />
      {children}
    </div>
  )
}
