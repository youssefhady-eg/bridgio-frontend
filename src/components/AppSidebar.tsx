import { useQuery } from '@tanstack/react-query'
import { Link, useRouterState } from '@tanstack/react-router'
import { capabilitiesQueryOptions, sessionQueryOptions } from '~/api/queries'
import { AppIcon, navIconName } from '~/components/AppIcon'
import { useEffect, useRef, useState } from 'react'
import { assistantCapabilityOrder, navFor } from '~/shell/nav'
import type { NavRoute, NavScreenId } from '~/shell/nav'
import { useFocusScope } from '~/shell/useFocusScope'
import { useGuestPreview } from '~/shell/useGuestPreview'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Primary navigation sidebar — the single source of navigation for every role.
 *
 * Desktop: a full-height column with a 52 px brand row, 42 px nav rows and the
 * five teacher groups from the 2026-11-21 shell port. Phone: the same markup
 * becomes a 256 px drawer opened from the topbar menu button and closed by the
 * backdrop, the close button, or any nav link.
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

/**
 * Teacher information architecture for the five-group rail. The group ids are
 * the ones named in the brief; the labels live in `strings.sidebar.groups`.
 * Every teacher item is listed here, and anything added later without a group
 * falls through as an unlabelled row instead of disappearing.
 */
const teacherGroupOrder = [
  { id: 'command', items: ['teacher-dashboard'] },
  { id: 'detect', items: ['teacher-classes', 'teacher-students'] },
  { id: 'diagnose', items: ['teacher-tests'] },
  { id: 'decide', items: ['teacher-question-bank'] },
  { id: 'verify', items: ['teacher-materials'] },
] as const

type TeacherGroupId = (typeof teacherGroupOrder)[number]['id']

interface SidebarGroup {
  key: string
  label: string | null
  items: readonly NavRoute[]
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

  // Only the assistant needs the session (to read the granted capabilities), so
  // the query stays disabled for the fixed-menu roles.
  const sessionQuery = useQuery({
    ...sessionQueryOptions(),
    enabled: role === 'assistant',
  })
  const guest = useGuestPreview()
  const sessionUser = sessionQuery.data?.user ?? guest.user
  const assistantSession =
    role === 'assistant' && sessionUser?.role === 'assistant'
  const capabilitiesQuery = useQuery({
    ...capabilitiesQueryOptions(sessionUser?.id ?? ''),
    enabled: assistantSession,
  })

  const items =
    role === 'assistant'
      ? navFor('assistant', assistantSession ? (capabilitiesQuery.data?.items ?? []) : [])
      : navFor(role)

  const showAssistantNote = role === 'assistant' && items.length === 0

  // Every nav label is role-neutral, including the dashboard item: the sidebar
  // uses one neutral name per language, and only the dashboard H1 and the
  // document title follow the session user's gender.
  function navLabel(id: NavScreenId): string {
    return strings.nav[id]
  }

  // Teacher groups come from the brief. Every other role keeps one flat list
  // with no invented section names.
  const groups: SidebarGroup[] =
    role === 'teacher'
      ? buildTeacherGroups(items)
      : [{ key: 'all', label: null, items }]

  function buildTeacherGroups(routes: readonly NavRoute[]): SidebarGroup[] {
    const byId = new Map<string, NavRoute>(
      routes.map((item) => [item.id, item] as const),
    )
    const grouped = new Set<string>()
    const result: SidebarGroup[] = teacherGroupOrder.map((group) => {
      const groupItems = group.items
        .map((id) => byId.get(id))
        .filter((item): item is NavRoute => item !== undefined)
      groupItems.forEach((item) => grouped.add(item.id))
      return {
        key: group.id,
        label: strings.sidebar.groups[group.id as TeacherGroupId],
        items: groupItems,
      }
    })
    const ungrouped = routes.filter((item) => !grouped.has(item.id))
    if (ungrouped.length > 0) {
      result.push({ key: 'more', label: null, items: ungrouped })
    }
    return result.filter((group) => group.items.length > 0)
  }

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
      id: 'support',
      to: '/support',
      label: strings.sidebar.supportLabel,
      icon: 'support',
    },
  ] as const

  // Below 769px the sidebar is a drawer: while it is open keep focus inside,
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
      <div className="app-sidebar__brand">
        <Link
          to="/"
          search={{ as: role, lang }}
          className="app-sidebar__wordmark"
          preload={false}
        >
          {/* Adopted wordmark — fills are baked into the files and never
              recoloured or mirrored. Exactly one is visible per theme: the
              maroon file on the light sidebar, the cream file on the wine
              dark sidebar (see app.css). */}
          <img
            className="app-sidebar__wordmark-img app-sidebar__wordmark-img--maroon"
            src="/brand/wordmark-maroon.svg"
            alt={strings.header.wordmarkAlt}
            width={136}
            height={49}
            decoding="async"
          />
          <img
            className="app-sidebar__wordmark-img app-sidebar__wordmark-img--cream"
            src="/brand/wordmark-cream.svg"
            alt={strings.header.wordmarkAlt}
            width={136}
            height={49}
            decoding="async"
          />
        </Link>

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
            size={18}
            strokeWidth={2}
          />
        </button>

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
        {groups.map((group) => {
          const labelId = group.label ? `nav-group-${group.key}` : undefined
          return (
            <div className="app-sidebar__group" key={group.key}>
              {group.label ? (
                <p className="app-sidebar__group-label" id={labelId}>
                  {group.label}
                </p>
              ) : null}
              <ul
                className="app-sidebar__list"
                aria-labelledby={labelId}
              >
                {group.items.map((item) => {
                  const active = isActive(item)
                  return (
                    <li key={`${item.id}:${item.hash ?? ''}`}>
                      <Link
                        to={item.to}
                        hash={item.hash}
                        search={{ as: role, lang }}
                        className={`app-sidebar__link${active ? ' is-active' : ''}`}
                        title={collapsed ? navLabel(item.id) : undefined}
                        aria-current={active ? 'page' : undefined}
                        preload={false}
                        onClick={onClose}
                      >
                        <span className="app-sidebar__icon" aria-hidden="true">
                          <AppIcon
                            name={navIconName(item.id)}
                            size={20}
                            strokeWidth={2}
                          />
                        </span>
                        <span className="app-sidebar__label">
                          {navLabel(item.id)}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}

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
                    <AppIcon name={link.icon} size={20} strokeWidth={2} />
                  </span>
                  <span className="app-sidebar__label">{link.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
