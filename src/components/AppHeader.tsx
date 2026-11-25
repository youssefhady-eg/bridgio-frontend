import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { api } from '~/api'
import { sessionQueryOptions } from '~/api/queries'
import { AppIcon } from '~/components/AppIcon'
import { HeaderSearch } from '~/components/HeaderSearch'
import { hrefWithLang } from '~/shell/lang'
import { navFor } from '~/shell/nav'
import { useGuestPreview } from '~/shell/useGuestPreview'
import { usePreviewRole } from '~/shell/usePreviewRole'
import type { Theme } from '~/shell/theme-state'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Topbar — 2026-11-21 shell port.
 *
 * The bar is exactly 52 px tall and carries three zones: a breadcrumb at the
 * inline-start, the inline search trigger in the middle, and the utility
 * controls (notifications, language, messages, account) at the inline-end.
 * The brand now lives in the sidebar's brand row, not here.
 *
 * The colour-theme switch stays in the account menu only; there is deliberately
 * no sun/moon button in the topbar. The account control opens the same menu as
 * before: Profile, Theme, Sign out when a session exists, or the guest role
 * line plus Sign in / Exit when the preview has no session.
 */

interface AppHeaderProps {
  onOpenSidebar: () => void
  onOpenChat: () => void
  theme: Theme
  onToggleTheme: () => void
}

export function AppHeader({
  onOpenSidebar,
  onOpenChat,
  theme,
  onToggleTheme,
}: AppHeaderProps) {
  const { pathname, href } = useRouterState({ select: (state) => state.location })
  const searchStr = href.slice(pathname.length).split('#')[0] ?? ''
  const lang = useLang()
  const role = usePreviewRole()
  const guest = useGuestPreview()
  const strings = useStrings()
  const nextLang = lang === 'en' ? 'ar' : 'en'

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const sessionQuery = useQuery(sessionQueryOptions())
  const user = sessionQuery.data?.user ?? null
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)

  // Breadcrumb: role area first, current destination second. Detail routes
  // keep their section name (a class detail still reads "Classes").
  const navItems = role === 'assistant' ? navFor('assistant') : navFor(role)
  const section = navItems.find(
    (item) =>
      pathname === item.to || pathname.startsWith(`${item.to}/`),
  )
  const utilityCrumbs: Record<string, string> = {
    '/notifications': strings.sidebar.notificationsLabel,
    '/help': strings.sidebar.helpLabel,
    '/guide': strings.sidebar.guideLabel,
    '/support': strings.sidebar.supportLabel,
    '/profile': strings.sidebar.profileLabel,
    '/search': strings.search.title,
    '/assistant': strings.profile.roles.assistant,
  }
  const currentCrumb = section
    ? strings.nav[section.id]
    : (utilityCrumbs[pathname] ?? strings.header.homeLabel)
  const roleCrumb = strings.profile.roles[role]

  const signOutMutation = useMutation({
    mutationFn: () => api.auth.signOut(),
    onSuccess: () => {
      setAccountOpen(false)
      queryClient.setQueryData(sessionQueryOptions().queryKey, null)
      void queryClient.invalidateQueries({
        queryKey: sessionQueryOptions().queryKey,
      })
      void navigate({
        to: '/sign-in',
        search: { as: role, lang },
      })
    },
  })

  // Close the menu on navigation, Escape, or a click outside it.
  useEffect(() => {
    setAccountOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!accountOpen) return

    function onPointerDown(event: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setAccountOpen(false)
        accountRef.current
          ?.querySelector<HTMLButtonElement>('.app-utility__button--account')
          ?.focus()
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [accountOpen])

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__start">
          <button
            type="button"
            className="app-header__menu"
            onClick={onOpenSidebar}
            aria-label={strings.header.menuLabel}
            aria-controls="app-sidebar"
          >
            <AppIcon name="menu" size={20} />
          </button>

          <nav
            className="app-breadcrumb"
            aria-label={strings.header.breadcrumbLabel}
          >
            <span className="app-breadcrumb__root">{roleCrumb}</span>
            <span className="app-breadcrumb__sep" aria-hidden="true">
              /
            </span>
            <strong className="app-breadcrumb__current">{currentCrumb}</strong>
          </nav>
        </div>

        <HeaderSearch />

        <div
          className="app-header__end"
          role="group"
          aria-label={strings.header.utilityLabel}
        >
          {role === 'teacher' ? (
            <Link
              to="/notifications"
              search={{ as: role, lang }}
              className="app-utility__button"
              aria-label={strings.sidebar.notificationsLabel}
              title={strings.sidebar.notificationsLabel}
              preload={false}
            >
              <AppIcon name="notifications" size={18} />
            </Link>
          ) : null}

          <a
            className="app-utility__button app-utility__button--lang"
            href={hrefWithLang(pathname, searchStr, nextLang)}
            lang={nextLang}
            hrefLang={nextLang}
            aria-label={`${strings.header.langLabel}: ${
              nextLang === 'en'
                ? strings.header.langToEnglish
                : strings.header.langToArabic
            }`}
            title={
              nextLang === 'en'
                ? strings.header.langToEnglish
                : strings.header.langToArabic
            }
          >
            <span className="app-utility__glyph" aria-hidden="true">
              {nextLang === 'en'
                ? strings.header.langGlyphEnglish
                : strings.header.langGlyphArabic}
            </span>
          </a>

          <button
            type="button"
            className="app-utility__button"
            onClick={onOpenChat}
            aria-label={strings.header.assistantOpenLabel}
            title={strings.header.assistantLabel}
          >
            <AppIcon name="chat" size={18} />
            <span className="app-utility__label">
              {strings.header.assistantLabel}
            </span>
          </button>

          {/* Avatar-only account control: person icon in a circle. */}
          <div className="account-menu" ref={accountRef}>
            <button
              type="button"
              className="app-utility__button app-utility__button--account"
              onClick={() => setAccountOpen((current) => !current)}
              aria-label={strings.header.accountLabel}
              aria-haspopup="menu"
              aria-expanded={accountOpen}
              aria-controls="account-menu-panel"
              title={strings.header.accountLabel}
            >
              <AppIcon name="user" size={18} />
            </button>

            {accountOpen ? (
              <div
                className="account-menu__panel"
                id="account-menu-panel"
                role="menu"
                aria-label={strings.header.accountMenuLabel}
              >
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      search={{ as: role, lang }}
                      className="account-menu__item"
                      role="menuitem"
                      preload={false}
                      onClick={() => setAccountOpen(false)}
                    >
                      <AppIcon name="user" size={18} />
                      {strings.sidebar.profileLabel}
                    </Link>
                    {/* Same theme state as the account row: the row toggles it
                        and the switch position reports it. */}
                    <button
                      type="button"
                      className="account-menu__item account-menu__item--theme"
                      role="menuitemcheckbox"
                      aria-checked={theme === 'dark'}
                      onClick={onToggleTheme}
                    >
                      <AppIcon
                        name={theme === 'dark' ? 'sun' : 'moon'}
                        size={18}
                      />
                      <span className="account-menu__item-label">
                        {strings.header.themeLabel}
                      </span>
                      <span className="account-menu__switch" aria-hidden="true">
                        <span className="account-menu__switch-thumb" />
                      </span>
                    </button>
                    <button
                      type="button"
                      className="account-menu__item"
                      role="menuitem"
                      disabled={signOutMutation.isPending}
                      onClick={() => signOutMutation.mutate()}
                    >
                      <AppIcon name="close" size={18} />
                      {signOutMutation.isPending
                        ? strings.header.signingOutLabel
                        : strings.header.signOutLabel}
                    </button>
                  </>
                ) : guest.active && guest.role ? (
                  <>
                    <p className="account-menu__role">
                      {strings.guestPreview.roleLine(
                        strings.auth.guestRoles[guest.role],
                      )}
                    </p>
                    <Link
                      to="/sign-in"
                      search={{ as: guest.role, lang }}
                      className="account-menu__item"
                      role="menuitem"
                      preload={false}
                      onClick={() => setAccountOpen(false)}
                    >
                      <AppIcon name="user" size={18} />
                      {strings.header.signInLabel}
                    </Link>
                    <button
                      type="button"
                      className="account-menu__item"
                      role="menuitem"
                      onClick={() => {
                        setAccountOpen(false)
                        void navigate({ to: '/sign-in', search: { lang } })
                      }}
                    >
                      <AppIcon name="close" size={18} />
                      {strings.guestPreview.exit}
                    </button>
                  </>
                ) : (
                  <Link
                    to="/sign-in"
                    search={{ as: role, lang }}
                    className="account-menu__item"
                    role="menuitem"
                    preload={false}
                    onClick={() => setAccountOpen(false)}
                  >
                    <AppIcon name="user" size={18} />
                    {strings.header.signInLabel}
                  </Link>
                )}
                {signOutMutation.isError ? (
                  <p className="account-menu__error" role="alert">
                    {strings.header.accountError}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
