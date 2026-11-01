import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { ar, en } from '~/content/strings'
import { parseAppRole, type AppRole } from '~/shell/nav'
import { AppHeader } from '~/components/AppHeader'
import appCss from '~/styles/app.css?url'
import fontsCss from '~/styles/fonts.css?url'
import tokensCss from '~/styles/tokens.css?url'

/**
 * Preview-role search param for the whole shell (`?as=teacher|student`):
 * diagnostic UI state only, never auth.
 */
type RootSearch = { as: AppRole }

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  validateSearch: (search: Record<string, unknown>): RootSearch => ({
    as: parseAppRole(search.as) ?? 'teacher',
  }),
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: ar.head.title,
      },
      {
        name: 'description',
        content: ar.head.description,
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
  }),
  component: RootComponent,
  notFoundComponent: () => (
    <ShellDocument>
      <main className="app-main" id="app-main">
        <h1>{ar.root.notFound}</h1>
        <p>{ar.root.notFoundBody}</p>
      </main>
    </ShellDocument>
  ),
  errorComponent: () => (
    <ShellDocument>
      <main className="app-main" id="app-main">
        <h1>{ar.root.errorTitle}</h1>
        <p>{ar.root.errorBody}</p>
      </main>
    </ShellDocument>
  ),
})

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
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        <a className="skip-link" href="#app-main">
          {ar.header.skipToMain}
        </a>
        <AppHeader />
        <p className="stage-banner">
          <strong className="stage-banner__stage">{ar.stageBanner.stage}</strong>
          <span>{ar.stageBanner.note}</span>
        </p>
        {children}
        <footer className="app-footer">
          <div className="app-footer__inner">
            <p>{ar.footer.note}</p>
            <p className="app-footer__en" lang="en" dir="ltr">
              {en.shell.footerEn}
            </p>
          </div>
        </footer>
        <Scripts />
      </body>
    </html>
  )
}
