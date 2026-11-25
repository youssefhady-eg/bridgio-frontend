import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { useEffect, useState, type ReactNode } from 'react'
import { AppHeader } from '~/components/AppHeader'
import { AppSidebar } from '~/components/AppSidebar'
import { ChatPopup } from '~/components/chat/ChatPopup'
import { MohsenFab } from '~/components/mohsen/MohsenFab'
import { AuthControls } from '~/components/shared/AuthControls'
import { GuestPreviewNotice } from '~/components/shared/GuestPreviewNotice'
import {
  defaultLang,
  dirFor,
  hrefWithLang,
  parseLang,
  type Lang,
} from '~/shell/lang'
import { parseAppRole, type AppRole } from '~/shell/nav'
import { THEME_STORAGE_KEY } from '~/shell/theme-state'
import { useTheme } from '~/shell/useTheme'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings, stringsFor } from '~/shell/useStrings'
import { useSidebarCollapsed } from '~/shell/useSidebarCollapsed'
import appCss from '~/styles/app.css?url'
import batch5Css from '~/styles/batch5.css?url'
import finishCss from '~/styles/finish.css?url'
import followupCss from '~/styles/followup.css?url'
import fontsCss from '~/styles/fonts.css?url'
import polishCss from '~/styles/polish.css?url'
import teacherViewsCss from '~/styles/teacher-views.css?url'
import tokensCss from '~/styles/tokens.css?url'

/**
 * Root search params for the whole shell:
 *   `?as=teacher|student|assistant|parent` — preview role, diagnostic UI only.
 *   `?lang=ar|en` — active language / direction. Neither is auth.
 */
type RootSearch = { as?: AppRole; lang: Lang }

/** localStorage key for language persistence (see ShellDocument). */
const LANG_STORAGE_KEY = 'bridgio.lang'

/**
 * Pre-paint theme init. Runs in <head> before the body renders, so a visitor
 * who chose dark never sees a light flash. Default light when nothing is
 * stored; only the exact value "dark" applies. The resolved value is always
 * written, so every document load (the language switch is a normal navigation)
 * paints the stored theme and never inherits a stale attribute. Kept
 * dependency-free; language is not read here, so switching it cannot flip the
 * theme.
 */
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}')==='dark'?'dark':'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  validateSearch: (search: Record<string, unknown>): RootSearch => ({
    // Optional on purpose: when absent the role follows the route area, so the
    // router must not write `?as=teacher` into the URL of a student screen.
    as: parseAppRole(search.as),
    lang: parseLang(search.lang) ?? defaultLang,
  }),
  head: ({ match }) => {
    const strings = stringsFor(match.search.lang)
    return {
      meta: [
        { charSet: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: strings.head.title,
        },
        {
          name: 'description',
          content: strings.head.description,
        },
        {
          name: 'robots',
          content: 'noindex, nofollow',
        },
        {
          name: 'theme-color',
          content: '#f6f3ee',
        },
        // Social / install metadata (§2.9). Absolute paths as written: the
        // preview origin is the deployment origin.
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:title', content: 'BRIDGIO' },
        { property: 'og:description', content: 'From classroom to career.' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      links: [
        // The artwork's own B on a red tile (docs/favicon.svg → public/). The
        // adopted wordmark and the full lockup are never used as a favicon.
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'stylesheet', href: fontsCss },
        { rel: 'stylesheet', href: tokensCss },
        { rel: 'stylesheet', href: appCss },
        { rel: 'stylesheet', href: polishCss },
        { rel: 'stylesheet', href: finishCss },
        { rel: 'stylesheet', href: batch5Css },
        { rel: 'stylesheet', href: followupCss },
        { rel: 'stylesheet', href: teacherViewsCss },
      ],
    }
  },
  component: RootComponent,
  // Rendered in place of the matched route's outlet while RootComponent (the
  // document and shell) stays mounted. Wrapping these in ShellDocument again
  // nests a second <html> inside <main>, which the browser drops and leaves a
  // blank screen — see the follow-up delivery note.
  notFoundComponent: () => <NotFoundScreen />,
  errorComponent: () => <ErrorScreen />,
})

function NotFoundScreen() {
  const strings = useStrings()
  const role = usePreviewRole()
  const lang = useLang()
  return (
    <div className="not-found">
      <h1>{strings.root.notFound}</h1>
      <p>{strings.root.notFoundBody}</p>
      <p className="not-found__actions">
        <Link
          to="/"
          search={{ as: role, lang }}
          className="button button--primary"
          preload={false}
        >
          {strings.root.notFoundHome}
        </Link>
      </p>
    </div>
  )
}

function ErrorScreen() {
  const strings = useStrings()
  return (
    <>
      <h1>{strings.root.errorTitle}</h1>
      <p>{strings.root.errorBody}</p>
    </>
  )
}

/**
 * Routes that render outside the app shell.
 *
 * The four account screens are standalone centred forms: no header, no sidebar,
 * no chat popup and no Mohsen button. The document (`html`/`head`/`body`) and
 * the language effects still wrap them, so direction, title and theme init
 * behave exactly as everywhere else.
 */
const AUTH_ROUTE_PATHS = new Set([
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
])

function RootComponent() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  return (
    <ShellDocument>
      {AUTH_ROUTE_PATHS.has(pathname) ? <AuthLayout /> : <AppShell />}
    </ShellDocument>
  )
}

/** One auth screen, centred on its own — the shell chrome is never rendered. */
function AuthLayout() {
  return (
    <main className="auth-main" id="app-main">
      {/* The account screens have no header, so their language and theme
          controls live here rather than being copied into each form. */}
      <AuthControls />
      <Outlet />
    </main>
  )
}

/** The app shell: header, sidebar, content column, chat popup and Mohsen. */
function AppShell() {
  const strings = useStrings()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { collapsed: sidebarCollapsed, toggle: toggleSidebarCollapsed } =
    useSidebarCollapsed()
  const { theme, toggle: toggleTheme } = useTheme()
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <>
      {/* One grid owns the whole shell: the sidebar spans both rows, the 52 px
          topbar sits in row 1 beside it, and the main column scrolls inside
          row 2. The old header-above-body nesting and the animated rail
          property are gone. */}
      <div
        className={`app-shell${sidebarCollapsed ? ' app-shell--collapsed' : ''}`}
        data-collapsed={sidebarCollapsed}
      >
        <AppSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={toggleSidebarCollapsed}
        />
        <AppHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenChat={() => setChatOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <button
          type="button"
          className={`sidebar-backdrop${sidebarOpen ? ' is-open' : ''}`}
          aria-label={strings.header.menuCloseLabel}
          tabIndex={sidebarOpen ? 0 : -1}
          onClick={() => setSidebarOpen(false)}
        />
        <main className="app-main" id="app-main">
          <div className="app-main__inner">
            <GuestPreviewNotice />
            <Outlet />
          </div>
        </main>
      </div>
      <ChatPopup open={chatOpen} onClose={() => setChatOpen(false)} />
      <MohsenFab />
    </>
  )
}

function ShellDocument({ children }: Readonly<{ children: ReactNode }>) {
  const lang = useLang()
  const dir = dirFor(lang)
  const strings = useStrings()

  // Reflect the active language on <html> and remember it for the next visit.
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang)
    } catch {
      // Storage can be unavailable (private mode); language still works via URL.
    }
  }, [lang, dir])

  // Persistence: on first load without an explicit `?lang`, apply the stored
  // choice once. Documented first-paint deviation: the first paint is Arabic,
  // then the browser replaces the URL with the stored language.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has('lang')) return
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(LANG_STORAGE_KEY)
    } catch {
      stored = null
    }
    const parsed = parseLang(stored)
    if (parsed && parsed !== lang) {
      window.location.replace(
        hrefWithLang(window.location.pathname, window.location.search, parsed),
      )
    }
    // Intentionally once per load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        <a className="skip-link" href="#app-main">
          {strings.header.skipToMain}
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
