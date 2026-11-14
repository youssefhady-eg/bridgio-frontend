import { useQuery } from '@tanstack/react-query'
import { sessionQueryOptions, notificationsQueryOptions } from '~/api/queries'
import type { NotificationKind } from '~/api/types'
import { AppIcon, type AppIconName } from '~/components/AppIcon'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { formatCount, formatDate } from '~/components/dashboard/format'
import { PageHero } from '~/components/shared/PageHero'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

const kindIcon: Record<NotificationKind, AppIconName> = {
  submission: 'students',
  published_test: 'tests',
  message: 'messages',
}

/**
 * The backend supplies an in-app route, not a typed router target. It is
 * rendered as a plain link, and the shell params (`?as` / `?lang`) are appended
 * so opening a notification keeps the current language and preview role instead
 * of dropping back to the Arabic defaults.
 */
function hrefForLink(link: string, role: string, lang: string): string {
  const separator = link.includes('?') ? '&' : '?'
  return `${link}${separator}as=${role}&lang=${lang}`
}

/**
 * Notifications — teacher-only in Batch 5.
 *
 * The list comes from `notifications.listForUser` (PROPOSED, new in Batch 5);
 * the adapter derives every row from existing seed data, so nothing on this
 * screen is invented. There is no read/unread state and no push transport, and
 * none is claimed. A non-teacher account gets the honest role note instead of a
 * fabricated empty list.
 */
export function NotificationsView() {
  const strings = useStrings()
  const copy = strings.notifications
  const lang = useLang()
  const role = usePreviewRole()

  const sessionQuery = useQuery(sessionQueryOptions())
  const teacherId =
    sessionQuery.data?.user.role === 'teacher'
      ? sessionQuery.data.user.id
      : null

  const notificationsQuery = useQuery({
    ...notificationsQueryOptions(teacherId ?? ''),
    enabled: teacherId !== null,
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

  if (teacherId === null) {
    return (
      <Frame>
        <EmptyNote
          icon="notifications"
          title={copy.roleTitle}
          body={copy.roleBody}
        />
      </Frame>
    )
  }

  if (notificationsQuery.isPending) {
    return (
      <Frame>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </Frame>
    )
  }

  if (notificationsQuery.isError || !notificationsQuery.data) {
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

  const notifications = notificationsQuery.data

  return (
    <Frame>
      {notifications.length === 0 ? (
        <EmptyNote
          icon="notifications"
          title={copy.emptyTitle}
          body={copy.emptyBody}
        />
      ) : (
        <section
          className="dashboard__section"
          aria-labelledby="notifications-heading"
        >
          <div className="section-head">
            <h2 id="notifications-heading">{copy.listHeading}</h2>
            <span className="count-chip">
              {formatCount(notifications.length, lang)}
            </span>
          </div>
          <ol className="notification-list">
            {notifications.map((notification) => (
              <li className="notification-row" key={notification.id}>
                <span className="notification-row__icon" aria-hidden="true">
                  <AppIcon name={kindIcon[notification.kind]} size={20} />
                </span>
                <div className="notification-row__main">
                  <div className="notification-row__meta">
                    <span className="notification-row__kind">
                      {copy.kinds[notification.kind]}
                    </span>
                    <time dateTime={notification.occurredAt}>
                      {formatDate(
                        notification.occurredAt,
                        copy.dateFallback,
                        lang,
                      )}
                    </time>
                  </div>
                  <h3>{notification.title}</h3>
                  <p>{notification.body}</p>
                </div>
                {notification.link ? (
                  <a
                    className="button button--secondary button--small notification-row__open"
                    href={hrefForLink(notification.link, role, lang)}
                  >
                    {copy.open}
                  </a>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      )}
    </Frame>
  )
}

function Frame({ children }: { children: React.ReactNode }) {
  const copy = useStrings().notifications
  return (
    <div className="dashboard">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />
      {children}
    </div>
  )
}
