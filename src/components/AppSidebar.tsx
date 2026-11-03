import { useQuery } from '@tanstack/react-query'
import { Link, useRouterState } from '@tanstack/react-router'
import { capabilitiesQueryOptions, sessionQueryOptions } from '~/api/queries'
import { AppIcon, navIconName } from '~/components/AppIcon'
import { navFor } from '~/shell/nav'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Primary navigation sidebar — the single source of navigation for every role.
 *
 * Desktop: a fixed sidebar with an icon and a word for each item, active state
 * included. Phone: rendered as a drawer opened from the header menu button and
 * closed by the backdrop, the close button, or any nav link.
 *
 * The Teacher Assistant has no fixed menu: the items are exactly the
 * capabilities the backend granted this account (read through the adapter). A
 * grant the backend did not return is simply absent, and the frontend never
 * invents an item or offers a granting UI.
 */

interface AppSidebarProps {
  open: boolean
  onClose: () => void
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const role = usePreviewRole()
  const lang = useLang()
  const strings = useStrings()
  const { pathname } = useRouterState({ select: (state) => state.location })

  // Only the assistant needs capabilities; the query stays disabled otherwise.
  const sessionQuery = useQuery({ ...sessionQueryOptions(), enabled: role === 'assistant' })
  const sessionUser = sessionQuery.data?.user
  const assistantSession = role === 'assistant' && sessionUser?.role === 'assistant'
  const capabilitiesQuery = useQuery({
    ...capabilitiesQueryOptions(sessionUser?.id ?? ''),
    enabled: assistantSession,
  })

  const items =
    role === 'assistant'
      ? navFor('assistant', assistantSession ? (capabilitiesQuery.data?.items ?? []) : [])
      : navFor(role)

  const showAssistantNote = role === 'assistant' && items.length === 0

  return (
    <aside
      className={`app-sidebar${open ? ' is-open' : ''}`}
      aria-label={strings.sidebar.navLabel}
    >
      <div className="app-sidebar__head">
        <button
          type="button"
          className="app-sidebar__close"
          onClick={onClose}
          aria-label={strings.sidebar.closeLabel}
        >
          <AppIcon name="close" size={20} />
        </button>
      </div>

      <nav className="app-sidebar__nav" aria-label={strings.sidebar.navLabel}>
        <ul className="app-sidebar__list">
          {items.map((item) => {
            const active = pathname === item.to
            return (
              <li key={item.id}>
                <Link
                  to={item.to}
                  search={{ as: role, lang }}
                  className={`app-sidebar__link${active ? ' is-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                  preload={false}
                  onClick={onClose}
                >
                  <span className="app-sidebar__icon" aria-hidden="true">
                    <AppIcon name={navIconName(item.id)} size={20} />
                  </span>
                  <span className="app-sidebar__label">
                    {strings.nav[item.id]}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
        {showAssistantNote ? (
          <p className="app-sidebar__note">{strings.sidebar.assistantNote}</p>
        ) : null}
      </nav>
    </aside>
  )
}
