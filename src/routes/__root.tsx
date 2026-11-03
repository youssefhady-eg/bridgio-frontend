import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { useEffect, useState, type ReactNode } from 'react'
import { AppHeader } from '~/components/AppHeader'
import { AppSidebar } from '~/components/AppSidebar'
import { ChatPopup } from '~/components/chat/ChatPopup'
import {
  defaultLang,
  dirFor,
  hrefWithLang,
  parseLang,
  type Lang,
} from '~/shell/lang'
import { hrefWithRole, parseAppRole, appRoles, type AppRole } from '~/shell/nav'
import { useLang, useStrings, stringsFor } from '~/shell/useStrings'
import appCss from '~/styles/app.css?url'
import fontsCss from '~/styles/fonts.css?url'
import tokensCss from '~/styles/tokens.css?url'

/**
 * Root search params for the whole shell:
 *   `?as=teacher|student|assistant|parent` — preview role, diagnostic UI only.
 *   `?lang=ar|en` — active language / direction. Neither is auth.
 */
type RootSearch = { as: AppRole; lang: Lang }

/** localStorage key for language persistence (see ShellDocument). */
const LANG_STORAGE_KEY = 'bridgio.lang'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  validateSearch: (search: Record<string, unknown>): RootSearch => ({
    as: parseAppRole(search.as) ?? 'teacher',
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
          content: '#2c0706',
        },
      ],
      links: [
        // Interim internal placeholder favicon (Sora "B" on a red card). The
        // adopted wordmark and the full lockup are never used as a favicon.
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'stylesheet', href: fontsCss },
        { rel: 'stylesheet', href: tokensCss },
        { rel: 'stylesheet', href: appCss },
      ],
    }
  },
  component: RootComponent,
  notFoundComponent: () => (
    <ShellDocument>
      <main className="app-main" id="app-main">
        <NotFoundScreen />
      </main>
    </ShellDocument>
  ),
  errorComponent: () => (
    <ShellDocument>
      <main className="app-main" id="app-main">
        <ErrorScreen />
      </main>
    </ShellDocument>
  ),
})

function NotFoundScreen() {
  const strings = useStrings()
  return (
    <>
      <h1>{strings.root.notFound}</h1>
      <p>{strings.root.notFoundBody}</p>
    </>
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

function RootComponent() {
  return (
    <ShellDocument>
      <main className="app-main" id="app-main">
        <Outlet />
      </main>
    </ShellDocument>
  )
}

function ShellDocument({ children }: Readonly<{ children: ReactNode }>) {
  const lang = useLang()
  const dir = dirFor(lang)
  const strings = useStrings()
  const { pathname, href } = useRouterState({ select: (state) => state.location })
  const searchStr = href.slice(pathname.length).split('#')[0] ?? ''

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const previewRole =
    parseAppRole(new URLSearchParams(searchStr).get('as')) ?? 'teacher'

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
    <html lang={lang} dir={dir}>
      <head>
        <HeadContent />
      </head>
      <body>
        <a className="skip-link" href="#app-main">
          {strings.header.skipToMain}
        </a>
        <AppHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenChat={() => setChatOpen(true)}
        />
        <div className="app-body">
          <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <button
            type="button"
            className={`sidebar-backdrop${sidebarOpen ? ' is-open' : ''}`}
            aria-label={strings.header.menuCloseLabel}
            tabIndex={sidebarOpen ? 0 : -1}
            onClick={() => setSidebarOpen(false)}
          />
          <div className="app-content">
            <p className="stage-banner">
              <strong className="stage-banner__stage">
                {strings.stageBanner.stage}
              </strong>
              <span>{strings.stageBanner.note}</span>
            </p>
            {children}
            <footer className="app-footer">
              <div className="app-footer__inner">
                <p>{strings.footer.note}</p>
                <p className="app-footer__en" lang="en" dir="ltr">
                  {strings.footer.noteEn}
                </p>
                <div
                  className="app-footer__roles"
                  role="group"
                  aria-label={strings.preview.groupAria}
                >
                  <span className="app-roles__hint">
                    {strings.preview.label}
                  </span>
                  {appRoles.map((candidate) => (
                    <a
                      key={candidate}
                      href={hrefWithRole(pathname, searchStr, candidate)}
                      className={`app-roles__link${
                        candidate === previewRole ? ' is-active' : ''
                      }`}
                      aria-current={
                        candidate === previewRole ? 'true' : undefined
                      }
                    >
                      {strings.preview.roles[candidate]}
                    </a>
                  ))}
                </div>
              </div>
            </footer>
          </div>
        </div>
        <ChatPopup open={chatOpen} onClose={() => setChatOpen(false)} />
        <Scripts />
      </body>
    </html>
  )
}
