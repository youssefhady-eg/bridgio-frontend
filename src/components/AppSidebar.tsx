import { useQuery } from '@tanstack/react-query'
import { Link, useRouterState } from '@tanstack/react-router'
import { capabilitiesQueryOptions, sessionQueryOptions } from '~/api/queries'
import { AppIcon, navIconName } from '~/components/AppIcon'
import { useEffect, useRef, useState } from 'react'
import { assistantCapabilityOrder, navFor } from '~/shell/nav'
import { useFocusScope } from '~/shell/useFocusScope'
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
  /** Desktop only: the sidebar is folded to an icon rail. */
  collapsed: boolean
  onToggleCollapsed: () => void
}

export function AppSidebar({
  open,
  onClose,
  collapsed,
  onToggleCollapsed,
}: AppSidebarProps) {
  const role = usePreviewRole()
  const lang = useLang()
  const strings = useStrings()
  const { pathname } = useRouterState({
    select: (state) => state.location,
  })

  // The fragment never reaches the server, so the assistant anchor is read once
  // after mount: the server render and the first client render stay identical
  // (same expanded + same active item) and the anchor only then takes effect.
  const [anchor, setAnchor] = useState('')
  useEffect(() => {
    const readAnchor = () => setAnchor(window.location.hash.replace(/^#/, ''))
    readAnchor()
    window.addEventListener('hashchange', readAnchor)
    return () => window.removeEventListener('hashchange', readAnchor)
  }, [])

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

  // The assistant has a single granted-sections screen, so its items are
  // distinguished by the in-page anchor. With no anchor yet in the URL, the
  // first granted section is the one in view.
  const assistantHash =
    anchor.length > 0
      ? anchor
      : (assistantCapabilityOrder.find((capability) =>
          items.some((item) => item.hash === capability),
        ) ?? '')

  function isActive(item: (typeof items)[number]): boolean {
    // A child screen keeps its section highlighted: `/teacher/classes/x` is
    // still the classes area, so the sidebar never goes blank on a detail page.
    const inSection =
      pathname === item.to || pathname.startsWith(`${item.to}/`)
    if (!inSection) return false
    if (!item.hash) return true
    return item.hash === assistantHash
  }

  const utilityLinks = [
    ...(role === 'teacher'
      ? [
          {
            id: 'notifications',
            to: '/notifications',
            label: strings.sidebar.notificationsLabel,
            icon: 'notifications',
          } as const,
        ]
      : []),
    { id: 'help', to: '/help', label: strings.sidebar.helpLabel, icon: 'help' },
    {
      id: 'guide',
      to: '/guide',
      label: strings.sidebar.guideLabel,
      icon: 'guide',
    },
    {
      id: 'profile',
      to: '/profile',
      label: strings.sidebar.profileLabel,
      icon: 'user',
    },
  ] as const

  // Below 1024px the sidebar is a drawer: while it is open keep focus inside,
  // close on Escape, and return focus to the menu button. On desktop it is never
  // `open`, so this does nothing.
  const drawerRef = useRef<HTMLElement>(null)
  useFocusScope(open, drawerRef, onClose)

  return (
    <aside
      ref={drawerRef}
      id="app-sidebar"
      className={`app-sidebar${open ? ' is-open' : ''}${collapsed ? ' is-collapsed' : ''}`}
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
            const active = isActive(item)
            return (
              <li key={`${item.id}:${item.hash ?? ''}`}>
                <Link
                  to={item.to}
                  hash={item.hash}
                  search={{ as: role, lang }}
                  className={`app-sidebar__link${active ? ' is-active' : ''}`}
                  title={collapsed ? strings.nav[item.id] : undefined}
                  aria-current={active ? 'page' : undefined}
                  preload={false}
                  onClick={onClose}
                >
                  <span className="app-sidebar__icon" aria-hidden="true">
                    <AppIcon name={navIconName(item.id)} size={22} strokeWidth={2} />
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

        {/* Pinned utilities: the same three screens for every role. */}
        <ul className="utility-links" aria-label={strings.sidebar.utilitiesLabel}>
          {utilityLinks.map((link) => {
            const active = pathname === link.to
            return (
              <li key={link.id}>
                <Link
                  to={link.to}
                  search={{ as: role, lang }}
                  className={`utility-links__link${active ? ' is-active' : ''}`}
                  title={collapsed ? link.label : undefined}
                  aria-current={active ? 'page' : undefined}
                  preload={false}
                  onClick={onClose}
                >
                  <span className="utility-links__icon" aria-hidden="true">
                    <AppIcon name={link.icon} size={22} strokeWidth={2} />
                  </span>
                  <span className="app-sidebar__label">{link.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Desktop only (hidden on the phone drawer): fold to an icon rail. */}
      <div className="app-sidebar__foot">
        <button
          type="button"
          className="app-sidebar__toggle"
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
          aria-controls="app-sidebar"
          aria-label={
            collapsed ? strings.sidebar.expandLabel : strings.sidebar.collapseLabel
          }
          title={
            collapsed ? strings.sidebar.expandLabel : strings.sidebar.collapseLabel
          }
        >
          <AppIcon
            name={collapsed ? 'expand' : 'collapse'}
            size={22}
            strokeWidth={2}
          />
          <span className="app-sidebar__label">
            {collapsed ? strings.sidebar.expandLabel : strings.sidebar.collapseLabel}
          </span>
        </button>
      </div>
    </aside>
  )
}
