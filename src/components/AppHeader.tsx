import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { api } from '~/api'
import { sessionQueryOptions } from '~/api/queries'
import { AppIcon } from '~/components/AppIcon'
import { hrefWithLang } from '~/shell/lang'
import { usePreviewRole } from '~/shell/usePreviewRole'
import type { Theme } from '~/shell/theme-state'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Slim utility header â€” refinement branch.
 *
 * The header no longer carries the primary navigation (that is the sidebar's
 * job). It holds only utility controls: the menu button (phone only), the
 * brand, the language toggle, the messages trigger and the account area.
 *
 * Three brand size states are unchanged (see app.css), one DOM, media queries:
 *  - â‰¥ 1024 px : large header â€” adopted wordmark, maroon fill, 136 px
 *    (the 200 px colour lockup is no longer rendered in the header; the asset
 *    stays in the repo for large/cover use)
 *   768â€“1023 : light small header â€” adopted wordmark, maroon fill, 148 px
 *   <768 px  : dark band â€” adopted wordmark, cream fill, 136 px, centred on its
 *              own row (followup.css)
 *
 * The account control is the avatar only. It opens a small menu with Profile,
 * Sign out (through `auth.signOut`) when a session exists, or Sign in when it
 * does not. Every label comes from the central strings.
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
  const strings = useStrings()
  const nextLang = lang === 'en' ? 'ar' : 'en'

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const sessionQuery = useQuery(sessionQueryOptions())
  const user = sessionQuery.data?.user ?? null
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)

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
        <button
          type="button"
          className="app-header__menu"
          onClick={onOpenSidebar}
          aria-label={strings.header.menuLabel}
        >
          <AppIcon name="menu" size={22} />
        </button>

        {/* The brand links to the shell home, keeping the preview role and the
            language in the query so `/` redirects to the same role home. */}
        <Link
          to="/"
          search={{ as: role, lang }}
          className="app-header__brand"
        >
          {/* Adopted wordmark â€” fills baked in the files, never recoloured.
              One of the two is visible per breakpoint/theme (see app.css). */}
          <img
            className="app-header__wordmark app-header__wordmark--cream"
            src="/brand/wordmark-cream.svg"
            alt={strings.header.wordmarkAlt}
            width={136}
            height={49}
            decoding="async"
          />
          <img
            className="app-header__wordmark app-header__wordmark--maroon"
            src="/brand/wordmark-maroon.svg"
            alt={strings.header.wordmarkAlt}
            width={148}
            height={53}
            decoding="async"
          />
        </Link>

        <div
          className="app-header__utilities"
          role="group"
          aria-label={strings.header.utilityLabel}
        >
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
            className="app-utility__button app-utility__button--theme"
            onClick={onToggleTheme}
            aria-label={`${strings.header.themeLabel}: ${
              theme === 'dark'
                ? strings.header.themeToLight
                : strings.header.themeToDark
            }`}
            title={
              theme === 'dark'
                ? strings.header.themeToLight
                : strings.header.themeToDark
            }
          >
            <AppIcon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
          </button>

          <Link
            to="/search"
            search={{ as: role, lang, q: '' }}
            className="app-utility__button"
            aria-label={strings.header.searchOpenLabel}
            title={strings.header.searchLabel}
            preload={false}
          >
            <AppIcon name="search" size={20} />
            <span className="app-utility__label">
              {strings.header.searchLabel}
            </span>
          </Link>

          <button
            type="button"
            className="app-utility__button"
            onClick={onOpenChat}
            aria-label={strings.header.assistantOpenLabel}
          >
            <AppIcon name="chat" size={20} />
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
              <AppIcon name="user" size={20} />
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
