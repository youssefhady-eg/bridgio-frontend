import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { ar } from '~/content/strings'
import appCss from '~/styles/app.css?url'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Bridgio — Stage 0',
      },
      {
        name: 'description',
        content:
          'BRIDGIO Stage 0 scaffold and PROPOSED API adapter contract. Internal MVP; no product screens.',
      },
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
  notFoundComponent: () => (
    <RootDocument>
      <main className="stage0">
        <h1>{ar.root.notFound}</h1>
      </main>
    </RootDocument>
  ),
  errorComponent: () => (
    <RootDocument>
      <main className="stage0">
        <h1>{ar.root.errorTitle}</h1>
        <p>{ar.root.errorBody}</p>
      </main>
    </RootDocument>
  ),
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
